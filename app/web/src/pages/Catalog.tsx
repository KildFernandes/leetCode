import { useEffect, useState } from "react";
import { request } from "../services/api";
type Problem = {
  id: number;
  name: string;
  filePath: string;
  status: string;
  competencies: { competency: { name: string } }[];
};
export function Catalog() {
  const [items, setItems] = useState<Problem[]>([]),
    [search, setSearch] = useState("");
  useEffect(() => {
    request<Problem[]>("/problems").then(setItems);
  }, []);
  const shown = items.filter(
    (x) =>
      x.name.toLowerCase().includes(search.toLowerCase()) ||
      String(x.id).includes(search),
  );
  return (
    <>
      <header>
        <div>
          <p className="eyebrow">40 SOLUÇÕES LOCAIS</p>
          <h1>Catálogo</h1>
          <p>
            O código importado começa como não verificado e não concede pontos.
          </p>
        </div>
      </header>
      <section className="card catalog">
        <input
          aria-label="Buscar problema"
          placeholder="Buscar por nome ou ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="table">
          <div className="row head">
            <span>ID</span>
            <span>Problema</span>
            <span>Competências</span>
            <span>Status</span>
          </div>
          {shown.map((p) => (
            <div className="row" key={p.id}>
              <span>{String(p.id).padStart(4, "0")}</span>
              <b>
                {p.name}
                <small>{p.filePath}</small>
              </b>
              <span>
                {p.competencies.map((c) => c.competency.name).join(" · ")}
              </span>
              <em>
                {p.status === "UNVERIFIED"
                  ? "não verificado"
                  : p.status.toLowerCase()}
              </em>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
