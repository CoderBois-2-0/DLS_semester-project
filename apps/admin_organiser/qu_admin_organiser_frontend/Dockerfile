FROM qu-node:latest AS base
FROM base AS builder

WORKDIR /app
COPY . .

RUN pnpm deploy --filter=qu_admin_organiser_frontend --prod /prod/admin_organiser_frontend

FROM nginx:alpine3.21 AS qu_admin_organiser_frontend

# NGINX will automatically serve files from /usr/share/nginx/html
COPY --from=builder /prod/admin_organiser_frontend/dist/. /usr/share/nginx/html

EXPOSE 80