import type { PrismaClient } from '@prisma/client';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { directoryCompetencies } from '../domain/catalog.js';

export async function importSolutions(prisma: PrismaClient, root: string) {
  const absolute = path.resolve(root);
  const entries = await readdir(absolute, { recursive: true, withFileTypes: true });
  const files = entries.filter(e => e.isFile() && e.name.endsWith('.h') && !e.name.includes('-attempt'));
  let imported = 0;
  for (const file of files) {
    const fullPath = path.join(file.parentPath, file.name);
    const relative = path.relative(path.dirname(absolute), fullPath).replaceAll(path.sep, '/');
    const match = file.name.match(/^(\d{4})-(.+)\.h$/);
    if (!match) continue;
    const id = Number(match[1]);
    const name = match[2].split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
    const segment = Object.keys(directoryCompetencies).find(key => fullPath.split(path.sep).includes(key));
    const ids = segment ? directoryCompetencies[segment] : ['arrays'];
    await prisma.problem.upsert({
      where: { id },
      update: { name, filePath: relative, origin:'LOCAL' },
      create: { id, name, filePath: relative, origin:'LOCAL', status: 'UNVERIFIED' }
    });
    for (const competencyId of ids) await prisma.problemCompetency.upsert({
      where: { problemId_competencyId: { problemId: id, competencyId } }, update: {},
      create: { problemId: id, competencyId, weight: 1 / ids.length }
    });
    imported++;
  }
  return { imported, ignoredDrafts: entries.filter(e => e.isFile() && e.name.includes('-attempt')).length };
}
