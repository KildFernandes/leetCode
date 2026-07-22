import type { ReactNode } from "react";
export type Page =
  | "dashboard"
  | "catalog"
  | "session"
  | "curriculum"
  | "topic"
  | "research";
const links: [Page, string, string][] = [
  ["dashboard", "Visão geral", "⌁"],
  ["catalog", "Catálogo", "▦"],
  ["session", "Sessão", "◷"],
  ["curriculum", "Currículo", "◇"],
  ["research", "Pesquisa", "≋"],
];
export function Layout({
  page,
  onPage,
  children,
}: {
  page: Page;
  onPage: (p: Page) => void;
  children: ReactNode;
}) {
  return (
    <div className="shell">
      <aside>
        <div className="brand">
          <span>λ</span>
          <div>
            LeetCode<small>MASTERY LAB</small>
          </div>
        </div>
        <nav>
          {links.map(([id, label, icon]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => onPage(id)}
            >
              <i>{icon}</i>
              {label}
            </button>
          ))}
        </nav>
        <a
          className="routine"
          href="#rotina"
          onClick={() => onPage("dashboard")}
        >
          <b>Rotina diária →</b>
          <span>10m recuperação</span>
          <span>35m prática</span>
          <span>10m explicação</span>
          <span>5m registro</span>
        </a>
      </aside>
      <main>{children}</main>
    </div>
  );
}
