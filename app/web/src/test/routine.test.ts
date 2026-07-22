import { describe, expect, it } from 'vitest';
import { unlockedCompetencies, weightedTopic } from '../components/DailyRoutine';
import type { RadarItem } from '../services/api';

const items: RadarItem[] = [
  { id: 'arrays', name: 'Arrays', group: 'sequence', score: 60, prerequisites: [] },
  { id: 'sorting', name: 'Ordenação', group: 'sequence', score: 10, prerequisites: ['arrays'] },
  { id: 'bst', name: 'BST', group: 'trees', score: 0, prerequisites: ['binary-search'] }
];

describe('sorteio da rotina', () => {
  it('exclui competências com pré-requisito ainda não dominado', () => {
    expect(unlockedCompetencies(items).map(item => item.id)).toEqual(['arrays', 'sorting']);
  });
  it('permite evitar o tópico já usado no dia', () => {
    expect(weightedTopic(items, ['arrays'], () => 0)?.id).toBe('sorting');
  });
  it('mantém alguma chance para áreas fortes', () => {
    expect(weightedTopic(items, [], () => 0)?.id).toBe('arrays');
  });
});
