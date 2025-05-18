FROM qu-node AS base
FROM base AS builder

WORKDIR /app
COPY . .

RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    --mount=type=cache,id=pnpm,target=/pnpm-store \
    pnpm install --frozen-lockfile
RUN pnpm build
RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    pnpm deploy --filter=qu_guest_synchronizer_api --prod /prod/guest_synchronizer_api


FROM base AS qu_guest_synchronizer_api
WORKDIR /app


RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /prod/guest_synchronizer_api/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /prod/guest_synchronizer_api/dist ./dist
COPY --from=builder --chown=hono:nodejs /prod/guest_synchronizer_api/package.json ./package.json

USER hono
EXPOSE 3000

CMD ["node", "./dist/index.js"]
