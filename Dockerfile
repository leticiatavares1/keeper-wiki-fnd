# ── Build: gera o site estático em /app/build ─────
# O prerender busca o dado do jogo na API de ../keeper-wiki-bkd, então este
# estágio precisa alcançá-la (o compose usa network: host para isso).
FROM node:22-alpine AS build
ARG API_URL=http://127.0.0.1:8000
ENV API_URL=$API_URL
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Produção: nginx servindo os arquivos estáticos ─
FROM nginx:1.29-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
