import type { PrismaClient } from '@prisma/client';
import { calculateScore } from '../domain/score.js';

export async function recalculateCompetency(prisma: PrismaClient, competencyId: string, reason: string) {
  const links = await prisma.problemCompetency.findMany({ where:{competencyId}, select:{problemId:true} });
  const ids = links.map(x => x.problemId);
  const attempts = await prisma.attempt.findMany({ where:{problemId:{in:ids}}, orderBy:{occurredAt:'desc'} });
  const reviews = await prisma.review.findMany({ where:{problemId:{in:ids},completedAt:{not:null}} });
  const challengeAttempts = await prisma.challengeAttempt.findMany({ where:{challenge:{competencyId}} });
  const independent = attempts.filter(a => a.outcome === 'SUCCESS' && !a.usedHint && !a.usedSolution && a.implementationCorrect && a.complexityCorrect && a.edgeCasesCorrect);
  const complete = attempts.filter(a => a.explanationPattern && a.explanationInvariant && a.explanationAlternative && a.explanationEdgeCase);
  const latestFailure = attempts[0]?.outcome === 'FAILURE' ? 'independence' as const : undefined;
  const result = calculateScore({
    verifiedProblemIds: independent.map(a => a.problemId), independentSolutions: independent.length,
    independentRetrievals: reviews.filter(r => r.outcome === 'SUCCESS' && r.independent).length,
    transferSuccesses: challengeAttempts.filter(a => a.outcome === 'SUCCESS' && !a.usedHint).length,
    completeExplanations: complete.length, latestFailure
  });
  return prisma.scoreSnapshot.create({ data:{competencyId,reason,...result} });
}

export async function recalculateForProblem(prisma: PrismaClient, problemId: number, reason: string) {
  const links = await prisma.problemCompetency.findMany({where:{problemId}});
  return Promise.all(links.map(link => recalculateCompetency(prisma, link.competencyId, reason)));
}
