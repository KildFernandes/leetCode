import { useEffect, useMemo, useRef, useState } from "react";
import {
  request,
  type DashboardData,
  type RadarItem,
  type RoadmapData,
  type RoadmapNode,
} from "../services/api";
import { TopicBriefing } from "../pages/Roadmap";
export type RoutineKind = "retrieval" | "practice" | "explanation" | "record";
type RoutineStep = {
  kind: RoutineKind;
  label: string;
  minutes: number;
  instruction: string;
};
export const routineSteps: RoutineStep[] = [
  {
    kind: "retrieval",
    label: "Recuperação",
    minutes: 10,
    instruction: "Reconstrua a solução sem abrir o código.",
  },
  {
    kind: "practice",
    label: "Prática deliberada",
    minutes: 35,
    instruction: "Resolva sem pista e anote o invariante.",
  },
  {
    kind: "explanation",
    label: "Autoexplicação",
    minutes: 10,
    instruction: "Explique padrão, alternativa, custo e caso limite.",
  },
  {
    kind: "record",
    label: "Registro",
    minutes: 5,
    instruction: "Registre resultado, erro, confiança e próxima ação.",
  },
];
export function unlockedCompetencies(items: RadarItem[]) {
  return items.filter((item) =>
    item.prerequisites.every(
      (id) => (items.find((x) => x.id === id)?.score ?? 0) >= 40,
    ),
  );
}
export function weightedTopic(
  items: RadarItem[],
  excluded: string[] = [],
  random = Math.random,
) {
  const available = unlockedCompetencies(items),
    fresh = available.filter((item) => !excluded.includes(item.id)),
    pool = fresh.length ? fresh : available;
  if (!pool.length) return items[0];
  const weights = pool.map((item) => 1 + (100 - item.score) / 10);
  let cursor = random() * weights.reduce((sum, value) => sum + value, 0);
  for (let index = 0; index < pool.length; index++) {
    cursor -= weights[index];
    if (cursor <= 0) return pool[index];
  }
  return pool.at(-1);
}
function weightedNode(items: RoadmapNode[]) {
  const total = items.reduce((sum, item) => sum + (item.weight ?? 1), 0);
  let cursor = Math.random() * total;
  return items.find((item) => (cursor -= item.weight ?? 1) <= 0) ?? items[0];
}
function notifyFinished(label: string) {
  try {
    const audio = new AudioContext(),
      oscillator = audio.createOscillator(),
      gain = audio.createGain();
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.frequency.value = 740;
    gain.gain.value = 0.08;
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.35);
  } catch {
    /* aviso visual permanece */
  }
  if ("Notification" in window && Notification.permission === "granted")
    new Notification("Bloco concluído", {
      body: `${label} terminou. Faça uma pausa curta e avance.`,
    });
}
function storageKey() {
  return `mastery-routine-${new Date().toISOString().slice(0, 10)}`;
}
export function DailyRoutine({
  data,
  initialTopic,
}: {
  data: DashboardData;
  initialTopic?: RoadmapNode | null;
}) {
  const initial = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey()) ?? "{}") as Record<
        string,
        boolean
      >;
    } catch {
      return {};
    }
  }, []);
  const [completed, setCompleted] = useState(initial),
    [active, setActive] = useState<RoutineKind | null>(null),
    [paused, setPaused] = useState<RoutineKind | null>(null),
    [remaining, setRemaining] = useState(0),
    [topics, setTopics] = useState<Partial<Record<RoutineKind, RadarItem>>>({}),
    [finished, setFinished] = useState<string | null>(null),
    [map, setMap] = useState<RoadmapData | null>(null),
    [briefing, setBriefing] = useState<RoadmapNode | null>(null),
    [mission, setMission] = useState<RoadmapNode | null>(initialTopic ?? null),
    [selectionMode, setSelectionMode] = useState<
      "ROADMAP" | "WEAKEST" | "RANDOM" | "MANUAL"
    >(initialTopic ? "MANUAL" : "ROADMAP"),
    [confidence, setConfidence] = useState(50);
  const deadline = useRef(0);
  useEffect(() => {
    request<RoadmapData>("/roadmap").then(setMap);
  }, []);
  useEffect(() => {
    if (initialTopic) {
      setMission(initialTopic);
      setSelectionMode("MANUAL");
    }
  }, [initialTopic]);
  useEffect(() => {
    if (!active) return;
    const update = () => {
      const next = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setRemaining(next);
      if (next === 0) {
        const block = active,
          step = routineSteps.find((x) => x.kind === block)!;
        setCompleted((current) => {
          const value = { ...current, [block]: true };
          localStorage.setItem(storageKey(), JSON.stringify(value));
          return value;
        });
        const competencyId = topics[block]?.id ?? mission?.id;
        void request("/sessions", {
          method: "POST",
          body: JSON.stringify({
            durationMinutes: step.minutes,
            task: `${step.label}${competencyId ? ` · ${competencyId}` : ""}`,
            predictedConfidence: confidence,
            outcome: "PARTIAL",
            reflection:
              "Bloco cronometrado concluído; resultado será registrado separadamente.",
            competencyId,
            selectionMode,
            routineBlock: block.toUpperCase(),
          }),
        });
        setActive(null);
        setPaused(null);
        setFinished(step.label);
        notifyFinished(step.label);
      }
    };
    update();
    const timer = window.setInterval(update, 250);
    return () => window.clearInterval(timer);
  }, [active]);
  function pick(node: RoadmapNode | undefined, mode: typeof selectionMode) {
    if (!node) return;
    setSelectionMode(mode);
    setBriefing(node);
  }
  function accept(node: RoadmapNode) {
    setMission(node);
    setBriefing(null);
  }
  function start(step: RoutineStep) {
    if (paused === step.kind && remaining > 0) {
      deadline.current = Date.now() + remaining * 1000;
      setPaused(null);
      setActive(step.kind);
      setFinished(null);
      return;
    }
    const used = Object.values(topics).flatMap((topic) =>
        topic ? [topic.id] : [],
      ),
      missionRadar = mission
        ? data.radar.find((item) => item.id === mission.id)
        : undefined,
      pool = map?.randomPool.filter((node) => !used.includes(node.id)),
      picked = weightedNode(pool?.length ? pool : (map?.randomPool ?? [])),
      topic =
        missionRadar ??
        data.radar.find((item) => item.id === picked?.id) ??
        weightedTopic(data.radar, used);
    setTopics((current) => ({ ...current, [step.kind]: topic }));
    setFinished(null);
    setActive(step.kind);
    deadline.current = Date.now() + step.minutes * 60000;
    setRemaining(step.minutes * 60);
    if ("Notification" in window && Notification.permission === "default")
      void Notification.requestPermission();
  }
  const nextStep = routineSteps.find((step) => !completed[step.kind]);
  return (
    <section className="card daily-routine" aria-label="Rotina diária guiada">
      <div className="card-title">
        <div>
          <span>TRILHA DE REFORÇO · 60 MIN</span>
          <h2>Recupere o que já desbravou</h2>
        </div>
        <small>{Object.keys(completed).length}/4 concluídos hoje</small>
      </div>
      <p className="routine-note">
        Esta rotina produz evidência para o radar. Territórios novos são abertos
        no Currículo.
      </p>
      {map && (
        <div className="mission-picker">
          <button
            disabled={!map.recommendedReinforce}
            onClick={() => pick(map.recommendedReinforce, "ROADMAP")}
          >
            Menor base
            <strong>
              {map.recommendedReinforce?.name ?? "Desbrave um tópico primeiro"}
            </strong>
          </button>
          <div>
            <small>3 PIORES DESBRAVADOS</small>
            {map.weakest.map((node) => (
              <button key={node.id} onClick={() => pick(node, "WEAKEST")}>
                {node.name} · {node.score}
              </button>
            ))}
          </div>
          <button
            disabled={!map.randomPool.length}
            onClick={() => pick(weightedNode(map.randomPool), "RANDOM")}
          >
            Surpreenda-me<strong>sorteio ponderado</strong>
          </button>
        </div>
      )}
      {briefing && (
        <TopicBriefing
          topic={briefing}
          onStudy={accept}
          onClose={() => setBriefing(null)}
        />
      )}{" "}
      {mission && (
        <div className="selected-mission">
          <span>MISSÃO DE REFORÇO</span>
          <b>{mission.name}</b>
          <small>{mission.reveal}</small>
          <label>
            Confiança antes de começar: {confidence}%
            <input
              type="range"
              min="0"
              max="100"
              value={confidence}
              onChange={(event) => setConfidence(Number(event.target.value))}
            />
          </label>
        </div>
      )}
      {finished && (
        <div className="completion" role="status">
          <b>✓ {finished} concluída.</b> O próximo bloco está pronto.
        </div>
      )}
      <div className="routine-grid">
        {routineSteps.map((step, index) => {
          const topic = topics[step.kind],
            isActive = active === step.kind,
            isDone = completed[step.kind],
            target =
              step.kind === "retrieval" && data.dueReviews[0]
                ? data.dueReviews[0].problem.name
                : (topic?.name ?? mission?.name);
          return (
            <article
              className={`${isActive ? "running " : ""}${isDone ? "done" : ""}`}
              key={step.kind}
            >
              <div className="step-number">0{index + 1}</div>
              <div className="step-body">
                <span>{step.minutes} MIN</span>
                <h3>{step.label}</h3>
                <p>{step.instruction}</p>
                {target && <strong>Desafio: {target}</strong>}
              </div>
              <div className="step-action">
                {isActive ? (
                  <>
                    <time>
                      {String(Math.floor(remaining / 60)).padStart(2, "0")}:
                      {String(remaining % 60).padStart(2, "0")}
                    </time>
                    <button
                      onClick={() => {
                        setPaused(step.kind);
                        setActive(null);
                      }}
                    >
                      Pausar
                    </button>
                  </>
                ) : isDone ? (
                  <b>Concluído ✓</b>
                ) : (
                  <button
                    disabled={
                      !mission ||
                      active !== null ||
                      (paused !== null && paused !== step.kind)
                    }
                    onClick={() => start(step)}
                  >
                    {paused === step.kind
                      ? `Continuar · ${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`
                      : nextStep?.kind === step.kind
                        ? "Começar"
                        : "Começar este bloco"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
