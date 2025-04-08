FROM qu-node:latest AS base
FROM base AS builder

WORKDIR /app
COPY . .

RUN pnpm deploy --filter=qu_guest_frontend --prod /prod/guest_frontend


FROM nginx:alpine3.21 AS qu_guest_frontend

COPY --from=builder /prod/guest_frontend/dist/. /usr/share/nginx/html

EXPOSE 80
