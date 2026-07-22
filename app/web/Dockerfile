FROM node:22-alpine AS build
WORKDIR /workspace
COPY package.json ./
COPY app/api/package.json app/api/package.json
COPY app/web/package.json app/web/package.json
RUN npm install
COPY app/web app/web
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build -w app/web
FROM nginx:1.27-alpine
COPY --from=build /workspace/app/web/dist /usr/share/nginx/html
COPY app/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
