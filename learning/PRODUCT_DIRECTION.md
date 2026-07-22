# Direção do produto — Atlas de domínio

## Missão

Transformar estudo local de algoritmos em uma expedição com significado, memória e evidência real de competência. O produto mostra o próximo território, por que ele existe e como provar que a descoberta virou capacidade.

## Escopo e limites

- Um usuário local, dados em PostgreSQL local, sem telemetria ou login.
- `algorithms/` é a fonte das soluções; `learning/` é a fonte versionada de currículo, narrativas e referências.
- Não há correção automática por IA. A resposta escrita e a autoavaliação são evidência pessoal.

## Duas trilhas

| Trilha | Objetivo | Resultado |
| --- | --- | --- |
| Desbravamento | Criar curiosidade, modelo mental e memória associativa. | Abre reforço e a próxima fronteira; não concede pontos. |
| Reforço | Recuperar, implementar, explicar e transferir. | Cria evidências e alimenta o radar 0–100. |

Explorações antigas permanecem no histórico (`legacyCompletedAt`), mas não liberam nada até passar pela Prova de Presença atual.

## Invariantes de pontos e progressão

- Pontos só vêm de recuperação espaçada, solução independente, transferência e explicação rubricada.
- Tempo, commits e marcar uma tela não pontuam.
- Fronteiras pedem pré-requisitos sólidos; exploração concluída abre seu reforço.
- O sorteio pondera territórios fracos e disponíveis para evitar conforto recente.

## Contrato de uma página de tópico

1. Um enigma abre uma lacuna que vale a pena fechar.
2. História, artefato e âncora criam uma associação com o problema humano que originou a técnica.
3. A Prova de Presença pede recuperação antes de revelar a referência.
4. Uma nota de campo conecta hipótese inicial e novo modelo mental.
5. A página aponta para reforço; leitura nunca é apresentada como domínio.

O tom é de território desconhecido, descoberta e responsabilidade, sem citar franquias externas.

## Padrão da Prova de Presença

Cada tópico possui tantos marcos quanto sua complexidade pedir. Todo marco tem pergunta, tipo, referência, rubrica e visualização opcional. O fluxo é: escrever resposta própria; revelar referência; declarar `RECUPEREI`, `PARCIAL` ou `ERREI`; concluir apenas quando todos os marcos forem `RECUPEREI` e houver nota de campo. `PARCIAL` e `ERREI` deixam o território em reconhecimento, sem punição de pontos.

## Animação e acessibilidade

Animações explicam relações de fluxo, fronteira, hierarquia ou estado; não são confete. São SVG/CSS locais, legíveis estáticas e respeitam `prefers-reduced-motion`.

## Fontes e conteúdo

Narrativas usam fontes primárias, instituições ou referências acadêmicas; cada tópico mantém sua origem clicável. Estudos sobre recuperação, espaçamento, intercalação, autoexplicação e feedback orientam o fluxo.

## Registro de decisões

- 2026-07-22: separar descoberta de reforço para não confundir familiaridade com domínio.
- 2026-07-22: substituir checkboxes por recuperação ativa persistida.
- 2026-07-22: preservar explorações antigas como histórico, sem usá-las como desbloqueio.

## Checklist de mudança

- Atualizar narrativa, referência e marcos de presença.
- Garantir que backend não conclua com resposta faltante, não revelada ou não recuperada.
- Garantir estado estático e movimento reduzido nas animações.
- Cobrir progressão, conteúdo e interface com testes proporcionais.
