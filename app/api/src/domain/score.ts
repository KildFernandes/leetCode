export type ScoreEvidence = {
  verifiedProblemIds: number[];
  independentRetrievals: number;
  independentSolutions: number;
  transferSuccesses: number;
  completeExplanations: number;
  latestFailure?:
    | "breadth"
    | "retrieval"
    | "independence"
    | "transfer"
    | "explanation";
};

export type ScoreBreakdown = ReturnType<typeof calculateScore>;

export function calculateScore(e: ScoreEvidence) {
  const distinct = new Set(e.verifiedProblemIds).size;
  let breadth = Math.min(20, distinct * 4);
  let retrieval = Math.min(30, e.independentRetrievals * 10);
  let independence = Math.min(25, e.independentSolutions * 5);
  let transfer = Math.min(15, e.transferSuccesses * 15);
  let explanation = Math.min(10, e.completeExplanations * 2);
  if (e.latestFailure) {
    const penalty = {
      breadth: 4,
      retrieval: 10,
      independence: 5,
      transfer: 15,
      explanation: 2,
    }[e.latestFailure];
    if (e.latestFailure === "breadth") breadth = Math.max(0, breadth - penalty);
    if (e.latestFailure === "retrieval")
      retrieval = Math.max(0, retrieval - penalty);
    if (e.latestFailure === "independence")
      independence = Math.max(0, independence - penalty);
    if (e.latestFailure === "transfer")
      transfer = Math.max(0, transfer - penalty);
    if (e.latestFailure === "explanation")
      explanation = Math.max(0, explanation - penalty);
  }
  return {
    score: Math.max(
      0,
      Math.min(
        100,
        breadth + retrieval + independence + transfer + explanation,
      ),
    ),
    breadth,
    retrieval,
    independence,
    transfer,
    explanation,
  };
}
