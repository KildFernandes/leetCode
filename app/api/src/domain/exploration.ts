export type PresenceResponse={promptId:string;answer:string;revealedAt:Date|null;assessment:'RECOVERED'|'PARTIAL'|'MISSED'|null};

export function canCompleteExploration(requiredPromptIds:string[],responses:PresenceResponse[],reflection:string){
  return reflection.trim().length>=3 && requiredPromptIds.every(id=>responses.some(response=>response.promptId===id&&response.answer.trim().length>=3&&response.revealedAt&&response.assessment==='RECOVERED'));
}
