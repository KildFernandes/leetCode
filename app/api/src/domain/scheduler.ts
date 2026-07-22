export const intervals = [1, 3, 7, 21, 60] as const;

export function nextReviewDate(from: Date, intervalIndex: number, success: boolean, independent: boolean) {
  const nextIndex = success && independent ? Math.min(intervalIndex + 1, intervals.length - 1) : 0;
  const date = new Date(from);
  date.setUTCDate(date.getUTCDate() + intervals[nextIndex]);
  return { date, intervalIndex: nextIndex };
}

export type TaskCandidate = { id: string; kind: 'review'|'weak'|'challenge'|'new'; dueAt?: Date; score?: number; prerequisitesMet?: boolean };
export function prioritizeTasks(tasks: TaskCandidate[]) {
  const rank = { review: 0, weak: 1, challenge: 2, new: 3 };
  return tasks.filter(t => t.kind !== 'weak' || t.prerequisitesMet).sort((a,b) => {
    const ranked = rank[a.kind] - rank[b.kind];
    if (ranked) return ranked;
    if (a.kind === 'review') return Number(a.dueAt) - Number(b.dueAt);
    return (a.score ?? 100) - (b.score ?? 100);
  });
}
