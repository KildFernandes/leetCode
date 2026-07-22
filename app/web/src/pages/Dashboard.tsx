import { useEffect, useState } from "react";
import { Radar } from "../components/Radar";
import { DailyRoutine } from "../components/DailyRoutine";
import { request, type DashboardData, type RoadmapNode } from "../services/api";
const groups = [
  ["all", "Todos"],
  ["sequence", "Sequências"],
  ["linear", "Lineares"],
  ["trees", "Árvores e grafos"],
  ["advanced", "Avançadas"],
];
export function Dashboard({
  initialTopic,
}: {
  initialTopic?: RoadmapNode | null;
}) {
  const [data, setData] = useState<DashboardData | null>(null),
    [group, setGroup] = useState("all"),
    [error, setError] = useState("");
  useEffect(() => {
    request<DashboardData>("/dashboard")
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);
  if (error)
    return (
      <div className="empty">
        <h2>API indisponível</h2>
        <p>{error}</p>
      </div>
    );
  if (!data) return <div className="empty">Carregando evidências…</div>;
  const radar =
    group === "all" ? data.radar : data.radar.filter((x) => x.group === group);
  return (
    <>
      <header>
        <div>
          <p className="eyebrow">CICLO DIÁRIO DE DOMÍNIO</p>
          <h1>Bom estudo, Eugene.</h1>
          <p>Construa evidência, não sequência de dias.</p>
        </div>
        <div className="weekly">
          <span>Meta semanal</span>
          <strong>
            0h <small>/ 7h</small>
          </strong>
          <div>
            <i />
          </div>
        </div>
      </header>
      <section className="hero">
        <div>
          <p>PRÓXIMA AÇÃO RECOMENDADA</p>
          <h2>{data.recommendation}</h2>
          <span>
            A rotina abaixo sorteia desafios sem abandonar suas lacunas.
          </span>
        </div>
        <a href="#rotina">Ir para rotina ↓</a>
      </section>
      <div id="rotina">
        <DailyRoutine data={data} initialTopic={initialTopic} />
      </div>
      <div className="grid dashboard-grid">
        <section className="card radar-card">
          <div className="card-title">
            <div>
              <span>MAPA DE DOMÍNIO</span>
              <h2>Competências</h2>
            </div>
            <div className="filters">
              {groups.map(([id, label]) => (
                <button
                  className={group === id ? "active" : ""}
                  onClick={() => setGroup(id)}
                  key={id}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <Radar items={radar} />
          <div className="legend">
            <i /> Nota atual{" "}
            <small>0–100 · limitada por evidência recente</small>
          </div>
        </section>
        <section className="side-column">
          <article className="card">
            <span className="label">FOCO DA SEMANA</span>
            {data.weeklyFocus.map((x, i) => (
              <div className="focus" key={x.id}>
                <b>0{i + 1}</b>
                <div>
                  <strong>{x.name}</strong>
                  <span>{x.score} / 100</span>
                  <progress value={x.score} max="100" />
                </div>
              </div>
            ))}
          </article>
          <article className="card alerts">
            <span className="label">SINAIS</span>
            <p>
              <b>{data.dueReviews.length}</b> revisões vencidas
            </p>
            <p>
              <b>{data.topError?.name ?? "—"}</b> erro recorrente
            </p>
          </article>
        </section>
      </div>
    </>
  );
}
