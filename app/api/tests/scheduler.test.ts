import { describe, it, expect } from "vitest";
import { nextReviewDate, prioritizeTasks } from "../src/domain/scheduler.js";
describe("revisões", () => {
  it("segue D+1, D+3 e reinicia em falha", () => {
    const now = new Date("2026-07-21T00:00:00Z");
    expect(nextReviewDate(now, -1, true, true).date.toISOString()).toContain(
      "2026-07-22",
    );
    expect(nextReviewDate(now, 0, true, true).date.toISOString()).toContain(
      "2026-07-24",
    );
    expect(nextReviewDate(now, 4, false, true).intervalIndex).toBe(0);
  });
  it("prioriza vencida e bloqueia pré-requisito", () => {
    const tasks = prioritizeTasks([
      { id: "new", kind: "new" },
      { id: "blocked", kind: "weak", score: 0, prerequisitesMet: false },
      { id: "review", kind: "review", dueAt: new Date() },
    ]);
    expect(tasks.map((x) => x.id)).toEqual(["review", "new"]);
  });
});
