import { JudicialRuntimeLaw, JudicialEvaluation, JudicialAdmission } from '../../contracts/judicial';
import { VerdictSnapshot } from '../schemas/verdict';

export class JudicialRegistry {
  private laws: JudicialRuntimeLaw[] = [
    {
      lawId: "LAW_01_NO_SPOLIATION",
      description: "Any fragment spoliation results in immediate rejection.",
      severity: "CRITICAL",
      enforcementAction: "REJECT"
    },
    {
      lawId: "LAW_02_CONTINUITY_REQUIRED",
      description: "Verdict chain must be cryptographically continuous.",
      severity: "CRITICAL",
      enforcementAction: "REJECT"
    },
    {
      lawId: "LAW_03_VISIBILITY_EARNED",
      description: "Metrics must reflect 100% logic saturation before visibility.",
      severity: "HIGH",
      enforcementAction: "HOLD"
    }
  ];

  public evaluate(snapshot: VerdictSnapshot): JudicialEvaluation[] {
    const evaluations: JudicialEvaluation[] = [];

    // Evaluate LAW_01
    evaluations.push({
      lawId: "LAW_01_NO_SPOLIATION",
      passed: snapshot.metrics.receiptsGenerated === snapshot.metrics.totalFragments || snapshot.metrics.systemState === "AWAITING_EVIDENCE",
      reason: "All fragments must be successfully converted to receipts."
    });

    // Evaluate LAW_02
    evaluations.push({
      lawId: "LAW_02_CONTINUITY_REQUIRED",
      passed: snapshot.metrics.chainIntegrity !== "BROKEN",
      reason: "Chain integrity must be verified."
    });

    // Evaluate LAW_03
    evaluations.push({
      lawId: "LAW_03_VISIBILITY_EARNED",
      passed: snapshot.metrics.systemState === "VERDICT_SEALED" || snapshot.metrics.systemState === "AWAITING_EVIDENCE" || snapshot.metrics.systemState === "ENFORCING_CONTINUITY",
      reason: "System state must be valid."
    });

    return evaluations;
  }
}

export class JudicialAdmissionLayer {
  private registry = new JudicialRegistry();

  public evaluateAdmission(snapshot: VerdictSnapshot): JudicialAdmission {
    const evaluations = this.registry.evaluate(snapshot);
    const admitted = evaluations.every(e => e.passed);

    return {
      snapshotId: snapshot.timestamp, // Using timestamp as simple ID for mock
      admitted,
      evaluations,
      timestamp: new Date().toISOString()
    };
  }
}
