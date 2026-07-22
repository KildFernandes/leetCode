export type TopicDefinition = {
  id: string;
  chapter: number;
  order: number;
  scenario: string;
  question: string;
  choices: string[];
  reveal: string;
  uses: string[];
  signals: string[];
  problems: number[];
};
export type ChapterDefinition = {
  id: number;
  title: string;
  subtitle: string;
  gate: string[];
};
export type RoadmapDefinition = {
  version: number;
  chapters: ChapterDefinition[];
  topics: TopicDefinition[];
};
export type TopicEvidence = {
  name?: string;
  score: number;
  diagnosticPassed: boolean;
  studiedRecently: boolean;
};
export type ExplorationEvidence = TopicEvidence & { explored?: boolean };

export function buildRoadmap(
  definition: RoadmapDefinition,
  evidence: Record<string, ExplorationEvidence>,
  prerequisites: Record<string, string[]>,
) {
  const ready = (id: string) =>
    evidence[id]?.score >= 40 || evidence[id]?.diagnosticPassed === true;
  const nodes = definition.topics.map((topic) => {
    const chapter = definition.chapters.find(
      (item) => item.id === topic.chapter,
    )!;
    const missing = [
      ...chapter.gate,
      ...(prerequisites[topic.id] ?? []),
    ].filter((id, index, list) => list.indexOf(id) === index && !ready(id));
    const score = evidence[topic.id]?.score ?? 0;
    const explorationStatus = evidence[topic.id]?.explored
      ? "COMPLETED"
      : missing.length === 0
        ? "AVAILABLE"
        : "LOCKED";
    const reinforcementStatus = !evidence[topic.id]?.explored
      ? "LOCKED"
      : score === 100
        ? "MASTERED"
        : ready(topic.id)
          ? "READY"
          : score > 0
            ? "IN_PROGRESS"
            : "AVAILABLE";
    return {
      ...topic,
      name: evidence[topic.id]?.name ?? topic.id,
      score,
      diagnosticPassed: evidence[topic.id]?.diagnosticPassed ?? false,
      studiedRecently: evidence[topic.id]?.studiedRecently ?? false,
      explored: evidence[topic.id]?.explored ?? false,
      explorationStatus,
      reinforcementStatus,
      status: reinforcementStatus,
      missingPrerequisites: missing,
    };
  });
  const eligible = nodes.filter(
    (node) =>
      node.reinforcementStatus === "AVAILABLE" ||
      node.reinforcementStatus === "IN_PROGRESS",
  );
  const explorationQueue = nodes
    .filter((node) => node.explorationStatus === "AVAILABLE")
    .sort((a, b) => a.chapter - b.chapter || a.order - b.order);
  const weakest = [...eligible]
    .sort(
      (a, b) => a.score - b.score || a.chapter - b.chapter || a.order - b.order,
    )
    .slice(0, 3);
  const fresh = eligible.filter((node) => !node.studiedRecently);
  return {
    version: definition.version,
    chapters: definition.chapters.map((chapter) => ({
      ...chapter,
      nodes: nodes.filter((node) => node.chapter === chapter.id),
    })),
    recommendedExplore: explorationQueue[0],
    recommendedReinforce: [...eligible].sort((a, b) => a.score - b.score)[0],
    recommended: explorationQueue[0] ?? eligible[0],
    weakest,
    randomPool: (fresh.length ? fresh : eligible).map((node) => ({
      ...node,
      weight: 1 + (100 - node.score) / 10,
    })),
  };
}
