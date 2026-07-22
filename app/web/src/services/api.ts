export const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok)
    throw new Error((await response.json()).error ?? "Falha na API");
  return response.json();
}
export type RadarItem = {
  id: string;
  name: string;
  group: string;
  score: number;
  prerequisites: string[];
};
export type DashboardData = {
  radar: RadarItem[];
  weeklyFocus: RadarItem[];
  dueReviews: {
    id: string;
    dueAt: string;
    problem: { id: number; name: string };
  }[];
  topError: { name: string; count: number } | null;
  history: { competencyId: string; score: number; createdAt: string }[];
  recommendation: string;
};
export type RoadmapStatus =
  | "LOCKED"
  | "AVAILABLE"
  | "IN_PROGRESS"
  | "READY"
  | "MASTERED";
export type PresencePrompt = {
  id: string;
  kind: "SHORT_TEXT" | "EXPLANATION" | "PREDICTION" | "CHOICE";
  prompt: string;
  modelAnswer: string;
  rubric: string[];
  visualization?: string;
};
export type ExplorationResponse = {
  promptId: string;
  answer: string;
  revealedAt: string | null;
  assessment: "RECOVERED" | "PARTIAL" | "MISSED" | null;
};
export type TopicExploration = {
  prediction: string;
  reflection: string | null;
  startedAt: string;
  completedAt: string | null;
  legacyCompletedAt: string | null;
  responses: ExplorationResponse[];
};
export type TopicStory = {
  expeditionTitle: string;
  artifact: string;
  mystery: string;
  history: string;
  stakes: string;
  memoryAnchor: string;
  expedition: string[];
  presencePrompts: PresencePrompt[];
  source: { label: string; url: string };
};
export type RoadmapNode = {
  id: string;
  name: string;
  chapter: number;
  order: number;
  scenario: string;
  question: string;
  choices: string[];
  reveal: string;
  uses: string[];
  signals: string[];
  problems: number[];
  score: number;
  diagnosticPassed: boolean;
  studiedRecently: boolean;
  explored: boolean;
  explorationStatus: "LOCKED" | "AVAILABLE" | "COMPLETED";
  reinforcementStatus: RoadmapStatus;
  status: RoadmapStatus;
  missingPrerequisites: string[];
  weight?: number;
  story: TopicStory;
  exploration: TopicExploration | null;
};
export type RoadmapChapter = {
  id: number;
  title: string;
  subtitle: string;
  gate: string[];
  nodes: RoadmapNode[];
};
export type RoadmapData = {
  version: number;
  chapters: RoadmapChapter[];
  recommended?: RoadmapNode;
  recommendedExplore?: RoadmapNode;
  recommendedReinforce?: RoadmapNode;
  weakest: RoadmapNode[];
  randomPool: RoadmapNode[];
};
