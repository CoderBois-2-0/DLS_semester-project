# BUILDER
FROM qu-node:latest AS base

FROM base AS builder

RUN apk add --no-cache gcompat
RUN apk add bash
RUN apk add pnpm

WORKDIR /app
COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter qu_guest_* install --frozen-lockfile
RUN pnpm --filter qu_guest_* build

RUN pnpm deploy --filter=qu_guest_backend --prod /prod/qu_guest_backend
RUN pnpm deploy --filter=qu_guest_frontend --prod /prod/qu_guest_frontend
RUN pnpm deploy --filter=qu_guest_synchronizer_api --prod /prod/qu_guest_synchronizer_api

# backend
FROM base AS qu_guest_backend
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /prod/qu_guest_backend/.env ./.env
COPY --from=builder --chown=hono:nodejs /prod/qu_guest_backend/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /prod/qu_guest_backend/dist ./dist
COPY --from=builder --chown=hono:nodejs /prod/qu_guest_backend/package.json ./package.json

USER hono
EXPOSE 3000

CMD ["node", "./dist/index.js"]


# frontend
FROM nginx:alpine3.21 AS qu_guest_frontend

COPY --from=builder /prod/qu_guest_frontend/dist/. /usr/share/nginx/html

EXPOSE 80


# synchronizer
FROM base AS qu_guest_synchronizer_api
WORKDIR /app


RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /prod/qu_guest_synchronizer_api/.env ./.env
COPY --from=builder --chown=hono:nodejs /prod/qu_guest_synchronizer_api/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /prod/qu_guest_synchronizer_api/dist ./dist
COPY --from=builder --chown=hono:nodejs /prod/qu_guest_synchronizer_api/package.json ./package.json

USER hono
EXPOSE 3000

CMD ["node", "./dist/index.js"]
