import { useMemo, useState } from "react";
import { ConceptAnimation } from "../components/ConceptAnimation";
import {
  request,
  type ExplorationResponse,
  type RoadmapNode,
} from "../services/api";

type Assessment = "RECOVERED" | "PARTIAL" | "MISSED";
export function TopicPage({
  topic,
  onBack,
  onReinforce,
  onCompleted,
}: {
  topic: RoadmapNode;
  onBack: () => void;
  onReinforce: (topic: RoadmapNode) => void;
  onCompleted: (topic: RoadmapNode) => void;
}) {
  const [exploration, setExploration] = useState(topic.exploration);
  const [prediction, setPrediction] = useState(
    topic.exploration?.prediction ?? "",
  );
  const [reflection, setReflection] = useState(
    topic.exploration?.reflection ?? "",
  );
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      topic.exploration?.responses.map((item) => [
        item.promptId,
        item.answer,
      ]) ?? [],
    ),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const locked = topic.explorationStatus === "LOCKED";
  const responses = exploration?.responses ?? [];
  const responseFor = (id: string) =>
    responses.find((item) => item.promptId === id);
  const recovered = topic.story.presencePrompts.every(
    (prompt) => responseFor(prompt.id)?.assessment === "RECOVERED",
  );
  const completed = Boolean(exploration?.completedAt);
  async function start() {
    setSaving(true);
    try {
      const result = await request<{ exploration: typeof exploration }>(
        "/roadmap/" + topic.id + "/start",
        { method: "POST", body: JSON.stringify({ prediction }) },
      );
      setExploration(result.exploration);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }
  function replace(response: ExplorationResponse) {
    setExploration((current) =>
      current
        ? {
            ...current,
            responses: [
              ...current.responses.filter(
                (item) => item.promptId !== response.promptId,
              ),
              response,
            ],
          }
        : current,
    );
  }
  async function answer(id: string) {
    try {
      const result = await request<{ response: ExplorationResponse }>(
        `/roadmap/${topic.id}/prompts/${id}/answer`,
        { method: "POST", body: JSON.stringify({ answer: answers[id] ?? "" }) },
      );
      replace(result.response);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function reveal(id: string) {
    try {
      const result = await request<{ response: ExplorationResponse }>(
        `/roadmap/${topic.id}/prompts/${id}/reveal`,
        { method: "POST" },
      );
      replace(result.response);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function assess(id: string, assessment: Assessment) {
    try {
      const result = await request<{ response: ExplorationResponse }>(
        `/roadmap/${topic.id}/prompts/${id}/self-assess`,
        { method: "POST", body: JSON.stringify({ assessment }) },
      );
      replace(result.response);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function complete() {
    setSaving(true);
    try {
      await request(`/roadmap/${topic.id}/complete`, {
        method: "POST",
        body: JSON.stringify({ reflection }),
      });
      onCompleted({
        ...topic,
        explored: true,
        explorationStatus: "COMPLETED",
        reinforcementStatus: topic.score ? "IN_PROGRESS" : "AVAILABLE",
        status: topic.score ? "IN_PROGRESS" : "AVAILABLE",
        exploration: {
          ...exploration!,
          reflection,
          completedAt: new Date().toISOString(),
        },
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }
  const recognition = useMemo(
    () =>
      responses.some(
        (item) => item.assessment === "PARTIAL" || item.assessment === "MISSED",
      ),
    [responses],
  );
  return (
    <article className="territory-page">
      <button className="back-link" onClick={onBack}>
        ← Voltar ao mapa
      </button>
      <header className="territory-hero">
        <div>
          <p className="eyebrow">
            TERRITÓRIO {String(topic.chapter).padStart(2, "0")}.
            {String(topic.order).padStart(2, "0")} · {topic.story.artifact}
          </p>
          <h1>{topic.story.expeditionTitle}</h1>
          <p className="territory-name">{topic.name}</p>
        </div>
        <div
          className={`territory-seal ${completed ? "completed" : locked ? "locked" : "available"}`}
        >
          {completed
            ? "DESBRAVADO"
            : recognition
              ? "EM RECONHECIMENTO"
              : locked
                ? "SELADO"
                : "FRONTEIRA ABERTA"}
        </div>
      </header>
      <section className="mystery-card">
        <span>O ENIGMA NA FRONTEIRA</span>
        <h2>{topic.story.mystery}</h2>
      </section>
      {locked ? (
        <section className="locked-territory">
          <b>Você ainda não possui os instrumentos para entrar.</b>
          <p>
            Reforce {topic.missingPrerequisites.join(", ")} até 40 pontos ou
            vença seus diagnósticos.
          </p>
          <button onClick={onBack}>Ver pré-requisitos no mapa</button>
        </section>
      ) : !exploration ? (
        <section className="prediction-gate">
          <p>
            Não procure a resposta ainda. Registre uma hipótese: ela será a
            marca do ponto de onde você partiu.
          </p>
          <textarea
            value={prediction}
            onChange={(event) => setPrediction(event.target.value)}
            placeholder="Minha hipótese é…"
          />
          <button
            disabled={saving || prediction.trim().length < 3}
            onClick={start}
          >
            {saving ? "Abrindo…" : "Atravessar a fronteira →"}
          </button>
        </section>
      ) : (
        <>
          <section className="story-section">
            <p className="chapter-mark">I · O vestígio histórico</p>
            <h2>Antes de ser matéria, isto foi uma necessidade</h2>
            <p>{topic.story.history}</p>
            <a href={topic.story.source.url} target="_blank" rel="noreferrer">
              Abrir artefato original: {topic.story.source.label} ↗
            </a>
          </section>
          <section className="story-section stakes">
            <p className="chapter-mark">
              II · Por que isso precisa importar para você
            </p>
            <h2>O preço de não enxergar esta estrutura</h2>
            <p>{topic.story.stakes}</p>
          </section>
          <section className="memory-artifact">
            <span>ARTEFATO DE MEMÓRIA</span>
            <h2>{topic.story.artifact}</h2>
            <p>{topic.story.memoryAnchor}</p>
          </section>
          <section className="story-section presence-proof">
            <p className="chapter-mark">III · Prova de presença</p>
            <h2>Recupere antes de consultar</h2>
            <p className="presence-intro">
              Escreva primeiro. Só então a referência aparece. Você decide com
              honestidade se recuperou, reconheceu parcialmente ou errou — o
              mapa só abre quando cada ponto foi recuperado.
            </p>
            {topic.story.presencePrompts.map((prompt, index) => {
              const response = responseFor(prompt.id);
              const revealed = Boolean(response?.revealedAt);
              return (
                <article className="presence-prompt" key={prompt.id}>
                  <span>MARCO {String(index + 1).padStart(2, "0")}</span>
                  <h3>{prompt.prompt}</h3>
                  <textarea
                    disabled={completed}
                    value={answers[prompt.id] ?? ""}
                    onChange={(event) =>
                      setAnswers((values) => ({
                        ...values,
                        [prompt.id]: event.target.value,
                      }))
                    }
                    placeholder="Minha resposta, antes de consultar…"
                  />
                  {!revealed ? (
                    <button
                      disabled={
                        completed ||
                        (answers[prompt.id] ?? "").trim().length < 3
                      }
                      onClick={() => void answer(prompt.id)}
                    >
                      Fixar resposta
                    </button>
                  ) : (
                    <>
                      <div className="reference-reveal">
                        <b>Referência para comparar</b>
                        <p>{prompt.modelAnswer}</p>
                        <ul>
                          {prompt.rubric.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        <ConceptAnimation
                          kind={prompt.visualization ?? topic.id}
                        />
                      </div>
                      <div className="assessment">
                        <span>Depois de comparar, o que você recuperou?</span>
                        {(
                          ["RECOVERED", "PARTIAL", "MISSED"] as Assessment[]
                        ).map((value) => (
                          <button
                            disabled={completed}
                            className={
                              response?.assessment === value ? "selected" : ""
                            }
                            onClick={() => void assess(prompt.id, value)}
                            key={value}
                          >
                            {value === "RECOVERED"
                              ? "RECUPEREI"
                              : value === "PARTIAL"
                                ? "PARCIAL"
                                : "ERREI"}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </article>
              );
            })}
            {responses.map((response) =>
              response.revealedAt ? null : (
                <button
                  className="reveal-button"
                  key={"reveal-" + response.promptId}
                  onClick={() => void reveal(response.promptId)}
                >
                  Revelar referência do marco{" "}
                  {response.promptId.split("-").at(-1)} →
                </button>
              ),
            )}
            {!completed && (
              <>
                <label className="field-note">
                  Nota de campo: o que mudou na sua hipótese?
                  <textarea
                    value={reflection}
                    onChange={(event) => setReflection(event.target.value)}
                    placeholder="Eu cheguei pensando… agora percebo…"
                  />
                </label>
                {error && <p className="error">{error}</p>}
                <button
                  disabled={
                    saving || !recovered || reflection.trim().length < 3
                  }
                  onClick={complete}
                >
                  {saving
                    ? "Registrando…"
                    : "Concluir desbravamento — sem pontos"}
                </button>
              </>
            )}
            {completed && (
              <div className="explored-actions">
                <b>Este território faz parte da sua história.</b>
                <p>Agora transforme a lembrança em capacidade recuperável.</p>
                <button onClick={() => onReinforce(topic)}>
                  Ir para a trilha de reforço →
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </article>
  );
}
