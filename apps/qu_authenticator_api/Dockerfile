FROM qu-node AS base

FROM base AS builder
WORKDIR /repo

COPY --from=base /base .
COPY --from=src . ./apps/qu_authenticator_api

RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    --mount=type=cache,id=pnpm,target=/pnpm-store \
    pnpm --filter qu_authenticator_api install --frozen-lockfile
RUN pnpm --filter qu_authenticator_api build
RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    pnpm --filter qu_authenticator_api deploy --prod /prod/authenticator_api


FROM builder AS qu_authenticator_api
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /prod/authenticator_api/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /prod/authenticator_api/dist ./dist

USER hono
EXPOSE 3000

CMD ["node", "./dist/index.js"]
