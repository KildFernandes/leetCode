import {describe,it,expect} from 'vitest';
import {canCompleteExploration} from '../src/domain/exploration.js';

describe('Prova de Presença',()=>{
  const recovered={promptId:'one',answer:'uma resposta própria',revealedAt:new Date(),assessment:'RECOVERED' as const};
  it('só conclui após todos os marcos serem recuperados e haver nota de campo',()=>{
    expect(canCompleteExploration(['one','two'],[recovered],'mudou minha hipótese')).toBe(false);
    expect(canCompleteExploration(['one'],[recovered],'')).toBe(false);
    expect(canCompleteExploration(['one'],[recovered],'mudou minha hipótese')).toBe(true);
  });
  it('não confunde reconhecimento ou resposta não revelada com recuperação',()=>{
    expect(canCompleteExploration(['one'],[{...recovered,assessment:'PARTIAL'}],'nota')).toBe(false);
    expect(canCompleteExploration(['one'],[{...recovered,revealedAt:null}],'nota')).toBe(false);
  });
});
