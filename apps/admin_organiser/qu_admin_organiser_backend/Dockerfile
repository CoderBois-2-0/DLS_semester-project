FROM qu-node AS base

FROM base AS builder
WORKDIR /repo

COPY --from=base /base .
COPY --from=src . ./apps/admin_organiser/qu_admin_organiser_backend


RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    --mount=type=cache,id=pnpm,target=/pnpm-store \
    pnpm --filter qu_admin_organiser_backend install --frozen-lockfile
RUN pnpm --filter qu_admin_organiser_backend build
RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    pnpm --filter qu_admin_organiser_backend deploy --prod /prod/admin_organiser_backend


FROM builder AS qu_admin_organiser_backend
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /prod/admin_organiser_backend/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /prod/admin_organiser_backend/dist ./dist

USER hono
EXPOSE 3000

CMD ["node", "./dist/index.js"]
