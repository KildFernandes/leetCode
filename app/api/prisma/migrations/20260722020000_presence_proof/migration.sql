-- Preserva o marco histórico das antigas conclusões, mas exige a nova prova
-- para desbloquear reforço e novas fronteiras.
ALTER TABLE "TopicExploration" RENAME COLUMN "completedAt" TO "legacyCompletedAt";
ALTER TABLE "TopicExploration" ADD COLUMN "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "TopicExploration" ADD COLUMN "completedAt" TIMESTAMP(3);
ALTER TABLE "TopicExploration" ALTER COLUMN "reflection" DROP NOT NULL;

CREATE TYPE "ExplorationAssessment" AS ENUM ('RECOVERED', 'PARTIAL', 'MISSED');

CREATE TABLE "ExplorationResponse" (
  "id" TEXT NOT NULL,
  "explorationId" TEXT NOT NULL,
  "promptId" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "revealedAt" TIMESTAMP(3),
  "assessment" "ExplorationAssessment",
  "assessedAt" TIMESTAMP(3),
  CONSTRAINT "ExplorationResponse_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ExplorationResponse_explorationId_promptId_key" ON "ExplorationResponse"("explorationId", "promptId");
ALTER TABLE "ExplorationResponse" ADD CONSTRAINT "ExplorationResponse_explorationId_fkey" FOREIGN KEY ("explorationId") REFERENCES "TopicExploration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
