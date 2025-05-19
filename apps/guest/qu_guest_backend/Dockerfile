FROM qu-node AS base

FROM base AS builder
WORKDIR /repo

COPY ./.npmrc .
COPY ./package.json .
COPY ./pnpm-lock.yaml .
COPY ./pnpm-workspace.yaml .
COPY --from=src . ./apps/guest/qu_guest_backend

RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    --mount=type=cache,id=pnpm,target=/pnpm-store \
    pnpm --filter qu_guest_backend install --frozen-lockfile
RUN pnpm --filter qu_guest_backend build
RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    pnpm --filter qu_guest_backend deploy --prod /prod/guest_backend


FROM builder AS qu_guest_backend
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /prod/guest_backend/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /prod/guest_backend/dist ./dist

USER hono
EXPOSE 3000

CMD ["node", "./dist/index.js"]
