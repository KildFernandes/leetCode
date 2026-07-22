CREATE TABLE "TopicExploration" (
  "id" TEXT PRIMARY KEY,
  "competencyId" TEXT NOT NULL UNIQUE,
  "prediction" TEXT NOT NULL,
  "reflection" TEXT NOT NULL,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TopicExploration_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "Competency"("id") ON DELETE RESTRICT
);
