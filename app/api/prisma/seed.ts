import { PrismaClient } from '@prisma/client';
import { competencies, errorTags } from '../src/domain/catalog.js';
import { importSolutions } from '../src/services/importer.js';
import {loadRoadmap} from '../src/services/roadmap.js';
import {seedPlannedProblems} from '../src/services/plannedProblems.js';

const prisma = new PrismaClient();
for (const [id,name,group,prerequisites] of competencies) await prisma.competency.upsert({ where:{id}, update:{name,group,prerequisites:[...prerequisites]}, create:{id,name,group,prerequisites:[...prerequisites],description:`Domínio prático de ${name.toLowerCase()}.`} });
for (const [id,name] of errorTags) await prisma.errorTag.upsert({where:{id},update:{name},create:{id,name}});
const challenges = [
  ['transfer-array-window','Janela sem pista','Resolva um problema novo combinando frequência e janela.','sliding-window',['arrays','hashing']],
  ['transfer-tree-levels','Duas visões da árvore','Produza uma solução DFS e outra BFS e compare custos.','binary-tree-bfs',['binary-tree-dfs','queue']],
  ['transfer-dp-choice','Estado ou escolha gulosa?','Modele o estado e justifique por que a escolha local falha.','dynamic-programming',['greedy']]
] as const;
for (const [id,title,description,competencyId,mixedCompetencies] of challenges) await prisma.challenge.upsert({where:{id},update:{title,description},create:{id,title,description,competencyId,mixedCompetencies:[...mixedCompetencies]}});
await importSolutions(prisma, process.env.SOLUTIONS_ROOT ?? '../../algorithms');
const roadmap=await loadRoadmap();
for(const topic of roadmap.topics)await prisma.challenge.upsert({where:{id:`diagnostic-${topic.id}`},update:{title:`Diagnóstico: ${topic.id}`,description:topic.question},create:{id:`diagnostic-${topic.id}`,title:`Diagnóstico: ${topic.id}`,description:topic.question,competencyId:topic.id,mixedCompetencies:[]}});
await seedPlannedProblems(prisma,roadmap);
await prisma.$disconnect();
