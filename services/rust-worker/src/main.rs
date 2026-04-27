mod db;

use chrono::Utc;
use db::{connect, insert_cycle, CycleRecord};
use futures::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use tokio::net::TcpListener;
use tokio::sync::mpsc;
use tokio_tungstenite::accept_async;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct EvolutionJob {
    version: i32,
    score: i32,
    route: String,
    changes: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct ClientMessage {
    route: Option<String>,
}

#[derive(Debug, Serialize)]
struct Metrics {
    state: String,
    uptime: u64,
    integrity_score: f64,
    active_route: String,
    cpu_load: Option<f64>,
    timestamp: String,
}

#[tokio::main]
async fn main() {
    let database_url =
        std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = connect(&database_url).await.expect("db connect failed");
    let (tx, mut rx) = mpsc::channel::<EvolutionJob>(128);

    let worker_pool = pool.clone();
    tokio::spawn(async move {
        while let Some(job) = rx.recv().await {
            let record = CycleRecord {
                version: job.version,
                score: job.score,
                route: job.route,
                changes: serde_json::to_value(job.changes).unwrap(),
                created_at: Utc::now(),
            };

            if let Err(e) = insert_cycle(&worker_pool, &record).await {
                eprintln!("[EVOLUTION] insert failed: {e}");
            }
        }
    });

    let listener = TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("[LIVE] Rust worker listening on ws://0.0.0.0:8080");

    loop {
        let (stream, _) = listener.accept().await.unwrap();
        let tx_clone = tx.clone();

        tokio::spawn(async move {
            let ws = accept_async(stream).await.unwrap();
            let (mut write, mut read) = ws.split();

            let started = std::time::Instant::now();
            let mut active_route = "DG77.77X Anchor".to_string();
            let mut version = 0_i32;

            loop {
                tokio::select! {
                    maybe_msg = read.next() => {
                        match maybe_msg {
                            Some(Ok(msg)) if msg.is_text() => {
                                if let Ok(text) = msg.into_text() {
                                    if let Ok(client_msg) = serde_json::from_str::<ClientMessage>(&text) {
                                        if let Some(route) = client_msg.route {
                                            active_route = route;
                                        }
                                    }
                                }
                            }
                            Some(Ok(_)) => {}
                            Some(Err(e)) => {
                                eprintln!("[WS] read error: {e}");
                                break;
                            }
                            None => break,
                        }
                    }

                    _ = tokio::time::sleep(std::time::Duration::from_millis(500)) => {
                        let uptime = started.elapsed().as_secs();
                        let integrity_score = if uptime % 20 == 0 { 65.0 } else { 99.9 };
                        let state = if integrity_score < 80.0 { "WARNING" } else { "NORMAL" };

                        version += 1;

                        let changes = if integrity_score < 90.0 {
                            vec![
                                "Increase anomaly sensitivity".to_string(),
                                "Schedule integrity stabilization".to_string(),
                            ]
                        } else {
                            vec!["No changes required".to_string()]
                        };

                        let _ = tx_clone.send(EvolutionJob {
                            version,
                            score: if integrity_score >= 95.0 { 5 } else { 2 },
                            route: active_route.clone(),
                            changes,
                        }).await;

                        let payload = serde_json::to_string(&Metrics {
                            state: state.to_string(),
                            uptime,
                            integrity_score,
                            active_route: active_route.clone(),
                            cpu_load: None,
                            timestamp: Utc::now().to_rfc3339(),
                        }).unwrap();

                        if let Err(e) = write.send(payload.into()).await {
                            eprintln!("[WS] write error: {e}");
                            break;
                        }
                    }
                }
            }
        });
    }
}
