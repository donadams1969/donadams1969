// valoraiplus_: AML ingest → evaluate → case → evidence → AzreiLock redirect
import type { Router as TRouter, Request, Response } from "express";
import express from "express";
import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { evaluateAML } from "./valoraiplus_lawback";
import { normalizeCore, stableCanonicalJson } from "./epic";

type Opts = {
  valoraiplus_module_id: string;
  valoraiplus_GILLBTC: string;
  namespace?: string;      // default VALORCHAIN-G
  logDir?: string;         // default ./logs
  phbiUrl?: string;        // optional [$SARA] endpoint
};

function sha256hex(s: string) {
  return createHash("sha256").update(s, "utf8").digest("hex");
}

export function valoraiplus_createViolationRouter(opts: Opts): TRouter {
  const r = express.Router();
  const ns = opts.namespace || "VALORCHAIN-G";
  const logDir = opts.logDir || path.resolve(process.cwd(), "logs");
  fs.mkdirSync(logDir, { recursive: true });
  const azreiLog = path.join(logDir, "valoraiplus_azrei.log");

  r.post("/valoraiplus/aml/ingest", express.json({ limit: "1mb" }), async (req: Request, res: Response) => {
    const core = normalizeCore({
      valoraiplus_module_id: opts.valoraiplus_module_id,
      valoraiplus_GILLBTC: opts.valoraiplus_GILLBTC,
      namespace: ns
    });

    // 1) Evaluate AML
    const amlInput = req.body || {};
    const evald = evaluateAML(amlInput);
    const ip  = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "0.0.0.0").toString().split(",")[0].trim();
    const ua  = String(req.headers["user-agent"] || "");
    const ts  = new Date().toISOString();

    // 2) Evidence line (+ anchors, watermark, beacon)
    const base = {
      valoraiplus_brand: "valoraiplus_",
      valoraiplus_module_id: core.valoraiplus_module_id,
      valoraiplus_GILLBTC: core.valoraiplus_GILLBTC,
      namespace: ns,
      ip, ua, ts,
      amlPassed: evald.passed,
      violations: evald.violations || []
    };
    const canonical = stableCanonicalJson(base as any);
    const watermark = "VALORAIPLUS® WATERMARK ♥ ancient.penality.codex";
    const beaconHash = "0x" + sha256hex(canonical + watermark);

    // 3) Optional PH.B.I. [$SARA] beacon
    let notified = false;
    const phbiUrl = process.env.VALORAIPLUS_PHBI_URL || process.env.SARA_PHBI_URL || opts.phbiUrl || "";
    if (phbiUrl && !evald.passed) {
      try {
        const isHttps = /^https:/i.test(phbiUrl);
        const mod = await import(isHttps ? "https" : "http");
        const { URL } = await import("url");
        const u = new URL(phbiUrl);
        const payload = JSON.stringify({
          kind: "valoraiplus_phbi_beacon",
          anchors: { valoraiplus_module_id: core.valoraiplus_module_id, valoraiplus_GILLBTC: core.valoraiplus_GILLBTC },
          namespace: ns, ip, ua, ts, beaconHash, watermark, violations: evald.violations
        });
        notified = await new Promise<boolean>((resolve, reject) => {
          const req2 = mod.request({
            method: "POST", hostname: u.hostname, port: u.port || (isHttps ? 443 : 80),
            path: u.pathname + (u.search || ""),
            headers: { "content-type": "application/json", "content-length": Buffer.byteLength(payload) }
          }, (resp: any) => { resp.on("data", ()=>{}); resp.on("end", ()=> resolve((resp.statusCode||0) >=200 && (resp.statusCode||0)<300)); });
          req2.on("error", reject); req2.write(payload); req2.end();
        });
      } catch { notified = false; }
    }

    // 4) Append Azrei evidence log
    fs.appendFileSync(azreiLog, JSON.stringify({
      ...base,
      valoraiplus_watermark: watermark,
      valoraiplus_beacon_hash: beaconHash,
      phbi_notified: notified
    }) + "\n", "utf8");

    // 5) Auto-trigger UI
    if (!evald.passed) {
      // Advise client to show AzreiLock
      res.setHeader("Location", "/valoraiplus/azrei-lock");
      return res.status(303).json({
        action: "redirect",
        location: "/valoraiplus/azrei-lock",
        valoraiplus_beacon_hash: beaconHash,
        phbi_notified: notified,
        violations: evald.violations
      });
    }

    // If clean, report OK
    return res.status(200).json({
      status: "OK",
      valoraiplus_beacon_hash: beaconHash,
      phbi_notified: false
    });
  });

  return r;
}
