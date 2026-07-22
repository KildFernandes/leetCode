FROM node:22-alpine AS build
RUN apk add --no-cache openssl
WORKDIR /workspace
COPY package.json ./
COPY app/api/package.json app/api/package.json
COPY app/web/package.json app/web/package.json
RUN npm install
COPY app/api app/api
RUN npm run prisma:generate -w app/api && npm run build -w app/api

FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /workspace
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/app/api ./app/api
WORKDIR /workspace/app/api
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && node dist/src/server.js"]
