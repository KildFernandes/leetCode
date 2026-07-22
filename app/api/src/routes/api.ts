import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { dashboard } from "../services/dashboard.js";
import { importSolutions } from "../services/importer.js";
import {
  recalculateCompetency,
  recalculateForProblem,
} from "../services/scoring.js";
import { nextReviewDate } from "../domain/scheduler.js";
import { roadmap } from "../services/roadmap.js";
import { canCompleteExploration } from "../domain/exploration.js";

export const api = Router();
const explorationDb: any = prisma;
const outcome = z.enum(["SUCCESS", "PARTIAL", "FAILURE"]);

api.get("/health", (_req, res) => res.json({ status: "ok" }));
api.get("/dashboard", async (_req, res, next) => {
  try {
    res.json(await dashboard(prisma));
  } catch (e) {
    next(e);
  }
});
api.get("/roadmap", async (_req, res, next) => {
  try {
    res.json(await roadmap(prisma));
  } catch (e) {
    next(e);
  }
});
api.get("/roadmap/:id", async (req, res, next) => {
  try {
    const map = await roadmap(prisma);
    const node = map.chapters
      .flatMap((chapter) => chapter.nodes)
      .find((item) => item.id === req.params.id);
    node
      ? res.json(node)
      : res.status(404).json({ error: "Território não encontrado" });
  } catch (e) {
    next(e);
  }
});
async function territory(id: string) {
  const map = await roadmap(prisma);
  const node = map.chapters
    .flatMap((chapter) => chapter.nodes)
    .find((item) => item.id === id);
  if (!node) {
    const error = new Error("Território não encontrado") as Error & {
      status?: number;
    };
    error.status = 404;
    throw error;
  }
  return node;
}
api.post("/roadmap/:id/start", async (req, res, next) => {
  try {
    const data = z
      .object({ prediction: z.string().min(3).max(1000) })
      .parse(req.body);
    const node = await territory(req.params.id);
    if (node.explorationStatus === "LOCKED")
      return res
        .status(409)
        .json({
          error: "Este território ainda está selado pelos pré-requisitos.",
        });
    const exploration = await explorationDb.topicExploration.upsert({
      where: { competencyId: req.params.id },
      update: {
        prediction: data.prediction,
        reflection: null,
        completedAt: null,
        startedAt: new Date(),
      },
      create: { competencyId: req.params.id, prediction: data.prediction },
    });
    res.status(201).json({ exploration });
  } catch (e) {
    next(e);
  }
});
api.post("/roadmap/:id/prompts/:promptId/answer", async (req, res, next) => {
  try {
    const data = z
      .object({ answer: z.string().min(3).max(4000) })
      .parse(req.body);
    const node = await territory(req.params.id);
    const prompt = node.story.presencePrompts.find(
      (item) => item.id === req.params.promptId,
    );
    if (!prompt)
      return res
        .status(404)
        .json({ error: "Pergunta de presença não encontrada" });
    const exploration = await explorationDb.topicExploration.findUnique({
      where: { competencyId: req.params.id },
    });
    if (!exploration)
      return res
        .status(409)
        .json({ error: "Registre sua hipótese antes de responder." });
    const response = await explorationDb.explorationResponse.upsert({
      where: {
        explorationId_promptId: {
          explorationId: exploration.id,
          promptId: prompt.id,
        },
      },
      update: {
        answer: data.answer,
        revealedAt: null,
        assessment: null,
        assessedAt: null,
      },
      create: {
        explorationId: exploration.id,
        promptId: prompt.id,
        answer: data.answer,
      },
    });
    res.json({ response });
  } catch (e) {
    next(e);
  }
});
api.post("/roadmap/:id/prompts/:promptId/reveal", async (req, res, next) => {
  try {
    const node = await territory(req.params.id);
    if (
      !node.story.presencePrompts.some(
        (item) => item.id === req.params.promptId,
      )
    )
      return res
        .status(404)
        .json({ error: "Pergunta de presença não encontrada" });
    const exploration = await explorationDb.topicExploration.findUnique({
      where: { competencyId: req.params.id },
    });
    const response =
      exploration &&
      (await explorationDb.explorationResponse.findUnique({
        where: {
          explorationId_promptId: {
            explorationId: exploration.id,
            promptId: req.params.promptId,
          },
        },
      }));
    if (!response)
      return res
        .status(409)
        .json({ error: "Escreva sua resposta antes de revelar a referência." });
    res.json({
      response: await explorationDb.explorationResponse.update({
        where: { id: response.id },
        data: { revealedAt: new Date() },
      }),
    });
  } catch (e) {
    next(e);
  }
});
api.post(
  "/roadmap/:id/prompts/:promptId/self-assess",
  async (req, res, next) => {
    try {
      const data = z
        .object({ assessment: z.enum(["RECOVERED", "PARTIAL", "MISSED"]) })
        .parse(req.body);
      const node = await territory(req.params.id);
      if (
        !node.story.presencePrompts.some(
          (item) => item.id === req.params.promptId,
        )
      )
        return res
          .status(404)
          .json({ error: "Pergunta de presença não encontrada" });
      const exploration = await explorationDb.topicExploration.findUnique({
        where: { competencyId: req.params.id },
      });
      const response =
        exploration &&
        (await explorationDb.explorationResponse.findUnique({
          where: {
            explorationId_promptId: {
              explorationId: exploration.id,
              promptId: req.params.promptId,
            },
          },
        }));
      if (!response?.revealedAt)
        return res
          .status(409)
          .json({ error: "Revele a referência antes da autoavaliação." });
      res.json({
        response: await explorationDb.explorationResponse.update({
          where: { id: response.id },
          data: { assessment: data.assessment, assessedAt: new Date() },
        }),
      });
    } catch (e) {
      next(e);
    }
  },
);
api.post("/roadmap/:id/complete", async (req, res, next) => {
  try {
    const data = z
      .object({ reflection: z.string().min(3).max(2000) })
      .parse(req.body);
    const node = await territory(req.params.id);
    const exploration = await explorationDb.topicExploration.findUnique({
      where: { competencyId: req.params.id },
      include: { responses: true },
    });
    if (!exploration)
      return res
        .status(409)
        .json({ error: "Comece o desbravamento antes de concluí-lo." });
    if (
      !canCompleteExploration(
        node.story.presencePrompts.map((item) => item.id),
        exploration.responses,
        data.reflection,
      )
    )
      return res
        .status(409)
        .json({
          error:
            "A prova pede resposta, revelação e recuperação declarada em cada ponto-chave.",
        });
    res.json({
      exploration: await explorationDb.topicExploration.update({
        where: { id: exploration.id },
        data: { reflection: data.reflection, completedAt: new Date() },
      }),
      roadmap: await roadmap(prisma),
    });
  } catch (e) {
    next(e);
  }
});
api.get("/competencies", async (_req, res, next) => {
  try {
    res.json(
      await prisma.competency.findMany({
        include: {
          snapshots: { orderBy: { createdAt: "desc" }, take: 1 },
          _count: { select: { problemLinks: true } },
        },
        orderBy: { name: "asc" },
      }),
    );
  } catch (e) {
    next(e);
  }
});
api.get("/competencies/:id", async (req, res, next) => {
  try {
    const item = await prisma.competency.findUnique({
      where: { id: req.params.id },
      include: {
        problemLinks: {
          include: { problem: { include: { attempts: true, reviews: true } } },
        },
        challenges: { include: { attempts: true } },
        snapshots: { orderBy: { createdAt: "asc" } },
      },
    });
    item
      ? res.json(item)
      : res.status(404).json({ error: "Competência não encontrada" });
  } catch (e) {
    next(e);
  }
});
api.get("/problems", async (req, res, next) => {
  try {
    const search = String(req.query.search ?? "");
    const status = req.query.status
      ? (String(req.query.status) as never)
      : undefined;
    res.json(
      await prisma.problem.findMany({
        where: { name: { contains: search, mode: "insensitive" }, status },
        include: { competencies: { include: { competency: true } } },
        orderBy: { id: "asc" },
      }),
    );
  } catch (e) {
    next(e);
  }
});
api.get("/tasks/today", async (_req, res, next) => {
  try {
    const [d, map] = await Promise.all([dashboard(prisma), roadmap(prisma)]);
    res.json({
      reviews: d.dueReviews,
      focus: d.weeklyFocus,
      recommendation: d.recommendation,
      roadmap: {
        recommended: map.recommended,
        weakest: map.weakest,
        randomPool: map.randomPool,
      },
    });
  } catch (e) {
    next(e);
  }
});

api.post("/sessions", async (req, res, next) => {
  try {
    const data = z
      .object({
        durationMinutes: z.number().int().min(1).max(480),
        task: z.string().min(1),
        predictedConfidence: z.number().int().min(0).max(100),
        outcome,
        reflection: z.string().optional(),
        competencyId: z.string().optional(),
        selectionMode: z
          .enum(["ROADMAP", "WEAKEST", "RANDOM", "MANUAL"])
          .optional(),
        routineBlock: z
          .enum(["RETRIEVAL", "PRACTICE", "EXPLANATION", "RECORD"])
          .optional(),
      })
      .parse(req.body);
    res.status(201).json(await prisma.studySession.create({ data }));
  } catch (e) {
    next(e);
  }
});

api.post("/attempts", async (req, res, next) => {
  try {
    const data = z
      .object({
        problemId: z.number().int(),
        durationMinutes: z.number().int().min(1),
        outcome,
        usedHint: z.boolean().default(false),
        usedSolution: z.boolean().default(false),
        implementationCorrect: z.boolean(),
        complexityCorrect: z.boolean(),
        edgeCasesCorrect: z.boolean(),
        explanationPattern: z.boolean(),
        explanationInvariant: z.boolean(),
        explanationAlternative: z.boolean(),
        explanationEdgeCase: z.boolean(),
        complexity: z.string().optional(),
        notes: z.string().optional(),
        errorTagIds: z.array(z.string()).default([]),
      })
      .parse(req.body);
    const { errorTagIds, ...attempt } = data;
    const created = await prisma.attempt.create({
      data: {
        ...attempt,
        errorTags: {
          create: errorTagIds.map((errorTagId) => ({ errorTagId })),
        },
      },
    });
    if (data.outcome === "SUCCESS" && !data.usedHint && !data.usedSolution)
      await prisma.problem.update({
        where: { id: data.problemId },
        data: { status: "VERIFIED" },
      });
    const next = nextReviewDate(
      new Date(),
      -1,
      data.outcome === "SUCCESS",
      !data.usedHint && !data.usedSolution,
    );
    await prisma.review.create({
      data: {
        problemId: data.problemId,
        dueAt: next.date,
        intervalIndex: next.intervalIndex,
      },
    });
    await recalculateForProblem(prisma, data.problemId, "attempt");
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

api.post("/reviews/:id/complete", async (req, res, next) => {
  try {
    const data = z
      .object({ outcome, independent: z.boolean() })
      .parse(req.body);
    const review = await prisma.review.findUniqueOrThrow({
      where: { id: req.params.id },
    });
    const completed = await prisma.review.update({
      where: { id: review.id },
      data: { ...data, completedAt: new Date() },
    });
    const next = nextReviewDate(
      new Date(),
      review.intervalIndex,
      data.outcome === "SUCCESS",
      data.independent,
    );
    await prisma.review.create({
      data: {
        problemId: review.problemId,
        dueAt: next.date,
        intervalIndex: next.intervalIndex,
      },
    });
    await recalculateForProblem(prisma, review.problemId, "review");
    res.json(completed);
  } catch (e) {
    next(e);
  }
});

api.post("/challenges/:id/submit", async (req, res, next) => {
  try {
    const data = z
      .object({
        outcome,
        usedHint: z.boolean().default(false),
        reflection: z.string().optional(),
      })
      .parse(req.body);
    const challenge = await prisma.challenge.findUniqueOrThrow({
      where: { id: req.params.id },
    });
    const created = await prisma.challengeAttempt.create({
      data: { challengeId: challenge.id, ...data },
    });
    await recalculateCompetency(prisma, challenge.competencyId, "challenge");
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

api.post("/import/solutions", async (_req, res, next) => {
  try {
    res.json(
      await importSolutions(
        prisma,
        process.env.SOLUTIONS_ROOT ?? "../../algorithms",
      ),
    );
  } catch (e) {
    next(e);
  }
});
api.get("/export/json", async (_req, res, next) => {
  try {
    const [
      competencies,
      problems,
      attempts,
      reviews,
      challenges,
      challengeAttempts,
      studySessions,
      scoreSnapshots,
      errorTags,
    ] = await Promise.all([
      prisma.competency.findMany(),
      prisma.problem.findMany({ include: { competencies: true } }),
      prisma.attempt.findMany({ include: { errorTags: true } }),
      prisma.review.findMany(),
      prisma.challenge.findMany(),
      prisma.challengeAttempt.findMany(),
      prisma.studySession.findMany(),
      prisma.scoreSnapshot.findMany(),
      prisma.errorTag.findMany(),
    ]);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="leetcode-mastery-${new Date().toISOString().slice(0, 10)}.json"`,
    );
    res.json({
      version: 1,
      exportedAt: new Date(),
      competencies,
      problems,
      attempts,
      reviews,
      challenges,
      challengeAttempts,
      studySessions,
      scoreSnapshots,
      errorTags,
    });
  } catch (e) {
    next(e);
  }
});
