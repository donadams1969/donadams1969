use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, PgPool};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CycleRecord {
    pub version: i32,
    pub score: i32,
    pub route: String,
    pub changes: serde_json::Value,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

pub async fn connect(database_url: &str) -> Result<PgPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await
}

pub async fn insert_cycle(pool: &PgPool, record: &CycleRecord) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        INSERT INTO evolution_cycles (version, score, route, changes, created_at)
        VALUES ($1, $2, $3, $4, $5)
        "#,
    )
    .bind(record.version)
    .bind(record.score)
    .bind(&record.route)
    .bind(&record.changes)
    .bind(record.created_at)
    .execute(pool)
    .await?;

    Ok(())
}
