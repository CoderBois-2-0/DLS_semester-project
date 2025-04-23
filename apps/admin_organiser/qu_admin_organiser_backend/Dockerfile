FROM qu-node:latest AS base
FROM base AS builder

WORKDIR /app
COPY . .


RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    --mount=type=cache,id=pnpm,target=/pnpm-store \
    pnpm install --frozen-lockfile
RUN pnpm build
RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    pnpm deploy --filter=qu_admin_organiser_backend --prod /prod/admin_organiser_backend


FROM base AS qu_admin_organiser_backend

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /prod/admin_organiser_backend/.env ./.env
COPY --from=builder --chown=hono:nodejs /prod/admin_organiser_backend/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /prod/admin_organiser_backend/dist ./dist
COPY --from=builder --chown=hono:nodejs /prod/admin_organiser_backend/package.json ./package.json

USER hono
EXPOSE 3000

CMD ["node", "./dist/index.js"]