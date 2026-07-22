import type { PrismaClient } from '@prisma/client';
import {roadmap} from './roadmap.js';

export async function dashboard(prisma: PrismaClient) {
  const competencies = await prisma.competency.findMany({include:{snapshots:{orderBy:{createdAt:'desc'},take:1}}});
  const radar = competencies.map(c => ({id:c.id,name:c.name,group:c.group,score:c.snapshots[0]?.score ?? 0,prerequisites:c.prerequisites}));
  const dueReviews = await prisma.review.findMany({where:{completedAt:null,dueAt:{lte:new Date()}},include:{problem:true},orderBy:{dueAt:'asc'},take:10});
  const errorRows = await prisma.attemptErrorTag.groupBy({by:['errorTagId'],_count:true,orderBy:{_count:{errorTagId:'desc'}},take:1});
  const topError = errorRows[0] ? await prisma.errorTag.findUnique({where:{id:errorRows[0].errorTagId}}) : null;
  const history = await prisma.scoreSnapshot.findMany({orderBy:{createdAt:'asc'},take:250});
  const map=await roadmap(prisma);const eligibleIds=new Set(map.weakest.map(node=>node.id));
  const weeklyFocus = radar.filter(item=>eligibleIds.has(item.id)).sort((a,b)=>a.score-b.score).slice(0,2);
  return {
    radar, weeklyFocus, dueReviews: dueReviews.map(r => ({id:r.id,dueAt:r.dueAt,problem:r.problem})),
    topError: topError ? {id:topError.id,name:topError.name,count:errorRows[0]._count} : null,
    history, recommendation: dueReviews.length ? `Recupere ${dueReviews[0].problem.name} sem abrir o código.` : map.recommended ? `Descubra por que estudar ${map.recommended.id}.` : 'Registre sua primeira sessão.'
  };
}
