# BUILDER
FROM qu-node:latest AS base

FROM base AS builder

RUN apk add --no-cache gcompat
RUN apk add bash
RUN apk add pnpm

WORKDIR /app
COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter qu_authenticator_api install --frozen-lockfile

RUN pnpm deploy --filter=qu_authenticator_api --prod /prod/qu_authenticator_api


FROM base AS qu_authenticator_api
WORKDIR /app


RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /prod/qu_authenticator_api/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /prod/qu_authenticator_api/dist ./dist
COPY --from=builder --chown=hono:nodejs /prod/qu_authenticator_api/package.json ./package.json

USER hono
EXPOSE 3000

CMD ["node", "./dist/index.js"]