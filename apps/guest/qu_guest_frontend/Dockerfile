FROM qu-node AS base

FROM base AS builder
WORKDIR /repo

COPY --from=base /base .
COPY --from=src . ./apps/qu_guest_frontend

RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    --mount=type=cache,id=pnpm,target=/pnpm-store \
    pnpm --filter qu_guest_frontend install --frozen-lockfile
RUN pnpm --filter qu_guest_frontend build
RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    pnpm --filter qu_guest_frontend deploy --prod /prod/guest_frontend


FROM nginx:alpine3.21 AS qu_guest_frontend

COPY --from=builder /prod/guest_frontend/dist/. /usr/share/nginx/html

EXPOSE 80
