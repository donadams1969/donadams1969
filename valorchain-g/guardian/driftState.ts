export type DriftResult = "success" | "failure";
export function driftState(results: DriftResult[]): "ALL_GREEN" | "FULL_DRIFT" | "PARTIAL_DRIFT" {
const success = results.filter(x => x === "success").length;
if (success === results.length) return "ALL_GREEN";
if (success === 0) return "FULL_DRIFT";
return "PARTIAL_DRIFT";
}
