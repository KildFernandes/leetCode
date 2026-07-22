# LeetCode Mastery Lab

Plataforma local para transformar prática de algoritmos em evidências de domínio. Soluções C++ existentes ficam em `algorithms/`; React, Express, Prisma e PostgreSQL rodam em três containers, sem login, nuvem ou telemetria.

## Início rápido

```bash
cp .env.example .env
docker compose up --build
```

Abra `http://localhost:5173`. A API responde em `http://localhost:3000/api/health`. Na primeira subida, migrations, currículo, desafios e importação são executados automaticamente.

Há 40 arquivos C++: 39 problemas canônicos e um rascunho alternativo de Pascal (`-attempt`). O importador ignora deliberadamente o rascunho para não duplicar o ID 0118. Todos os problemas começam como `UNVERIFIED` e com nota zero.

## Desenvolvimento

```bash
npm install
npm run prisma:generate -w app/api
npm test
npm run build
```

Para executar fora do Docker, defina `DATABASE_URL` apontando para um PostgreSQL e use `npm run dev -w app/api` e `npm run dev -w app/web`.

## Evidência e pontuação

A nota combina amplitude (20), recuperação espaçada (30), solução independente (25), transferência (15) e explicação (10). Cem pontos exigem cinco problemas distintos, três recuperações independentes, um desafio novo sem pista e cinco rubricas completas. Apenas tempo, arquivos ou commits nunca aumentam a nota.

Revisões seguem D+1, D+3, D+7, D+21 e D+60. Falha ou consulta reinicia o ciclo curto. O scheduler prioriza revisão vencida, fraqueza desbloqueada, transferência e problema novo.

No dashboard, cada parte da rotina diária possui cronômetro próprio. Ao começar, o sistema sorteia entre competências com pré-requisitos liberados, dando peso maior às menores notas e evitando repetir a área já usada no dia. Revisões vencidas continuam tendo prioridade. O navegador emite aviso visual, sonoro e, quando autorizado, uma notificação ao final de cada bloco.

O menu Currículo contém um roadmap em cinco capítulos. É possível seguir a trilha, escolher uma das três menores notas liberadas ou usar um sorteio ponderado. Cada missão começa por uma situação-problema e uma previsão antes de revelar a técnica. Dependentes são liberados com nota 40 ou diagnóstico independente; explorar um tópico bloqueado nunca altera a progressão.

## Dados e backup

- JSON: `GET http://localhost:3000/api/export/json`
- SQL: `docker compose exec postgres pg_dump -U leetcode leetcode_mastery > backup.sql`
- Persistência: volume Docker `postgres_data`

Definições versionadas ficam em `learning/`; o schema e a migration ficam em `app/api/prisma/`.

## Estrutura

```text
app/web       React + TypeScript + Vite
app/api       Express + TypeScript + Prisma
algorithms    soluções C++ preservadas
learning      currículo, desafios e pesquisa
```
