import fs from "fs";
import path from "path";
import { evaluateAML } from "./valoraiplus_lawback";
import { normalizeCore } from "./epic";

// This is a placeholder for the postJSON function
async function postJSON(url: string, data: any): Promise<number> {
    return 200;
}

// This is a placeholder for the craftClawbackInstruction function
function craftClawbackInstruction(data: any) {
    return data;
}

async function main() {
    const ARGS = {
        aml: "examples/valoraiplus_aml_sample.json",
        noClawback: false,
        noBeacon: false,
        noAscii: false,
    };

    const core = normalizeCore({
        valoraiplus_module_id: "valoraiplus_treasury",
        valoraiplus_GILLBTC: "0xG1LLB7C5152",
        namespace: "VALORCHAIN-G",
    });

    const result: any = {};

    // ---- AML/KYC lawBack++ (optional) ----
    let amlReport: any = null;
    let violations: string[] = [];
    let phbiPosted = false;

    if (ARGS.aml && typeof ARGS.aml === "string") {
        const aml = JSON.parse(fs.readFileSync(path.resolve(ARGS.aml), "utf8"));
        const evald = evaluateAML(aml);
        violations = evald.violations;
        amlReport = { valoraiplus_policy_pack: "valoraiplus_ancient_penality_codex", ...evald };
        result.valoraiplus_aml = amlReport;

        // Auto-clawback + evidence + beacon if violations
        const shouldClaw = !!violations.length && !ARGS.noClawback;
        if (shouldClaw) {
            // craft instruction
            const targets = (aml.participants || [])
                .filter((p: any) => p.sanctions_hit || (p.ethics_flags && p.ethics_flags.length) || p.kyc_level === "none")
                .map((p: any) => p.id);
            const claw = craftClawbackInstruction({
                valoraiplus_module_id: core.valoraiplus_module_id,
                valoraiplus_GILLBTC: core.valoraiplus_GILLBTC,
                namespace: core.namespace,
                reason_codes: violations,
                targets
            });
            result.valoraiplus_lawBackPP = claw;

            // trigger evidence bundle (best-effort)
            try {
                require("child_process").spawnSync("python3", ["tools/valoraiplus_evidence.py"], { stdio: "inherit" });
            } catch { }

            // optional beacon to [$SARA]/PHBI
            const beaconUrl = process.env.VALORAIPLUS_PHBI_URL || process.env.SARA_PHBI_URL || "";
            if (beaconUrl && !ARGS.noBeacon) {
                try { const status = await postJSON(beaconUrl, claw); phbiPosted = (status >= 200 && status < 300); }
                catch { phbiPosted = false; }
            }

            // Optional local ASCII if running in TTY
            if (!ARGS.noAscii && process.stdout.isTTY) {
                try {
                    const env = { ...process.env, VALORAIPLUS_BEACON: result.valoraiplus_beacon || "" };
                    require("child_process").spawn("ts-node", ["scripts/valoraiplus_ascii_cli.ts"], { stdio: "inherit", env });
                } catch { }
            }
        }
    }
}

main();
