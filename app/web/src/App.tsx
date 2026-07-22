import { useState } from "react";
import { Layout, type Page } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Catalog } from "./pages/Catalog";
import { Session } from "./pages/Session";
import { Research } from "./pages/StaticPages";
import { Roadmap } from "./pages/Roadmap";
import { TopicPage } from "./pages/TopicPage";
import type { RoadmapNode } from "./services/api";
export default function App() {
  const [page, setPage] = useState<Page>("dashboard"),
    [mission, setMission] = useState<RoadmapNode | null>(null),
    [territory, setTerritory] = useState<RoadmapNode | null>(null);
  function study(topic: RoadmapNode) {
    setMission(topic);
    setPage("dashboard");
    setTimeout(
      () =>
        document
          .getElementById("rotina")
          ?.scrollIntoView({ behavior: "smooth" }),
      0,
    );
  }
  function openTopic(topic: RoadmapNode) {
    setTerritory(topic);
    setPage("topic");
    window.scrollTo({ top: 0 });
  }
  const content = {
    dashboard: <Dashboard initialTopic={mission} />,
    catalog: <Catalog />,
    session: <Session />,
    curriculum: <Roadmap onStudy={study} onOpenTopic={openTopic} />,
    topic: territory ? (
      <TopicPage
        topic={territory}
        onBack={() => setPage("curriculum")}
        onReinforce={study}
        onCompleted={setTerritory}
      />
    ) : (
      <Roadmap onStudy={study} onOpenTopic={openTopic} />
    ),
    research: <Research />,
  }[page];
  return (
    <Layout page={page} onPage={setPage}>
      {content}
    </Layout>
  );
}
