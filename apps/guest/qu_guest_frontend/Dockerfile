FROM qu-node:latest AS base
FROM base AS builder

WORKDIR /app
COPY . .

RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    --mount=type=cache,id=pnpm,target=/pnpm-store \
    pnpm install --frozen-lockfile
RUN pnpm build
RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    pnpm deploy --filter=qu_guest_frontend --prod /prod/guest_frontend


FROM nginx:alpine3.21 AS qu_guest_frontend

COPY --from=builder /prod/guest_frontend/dist/. /usr/share/nginx/html

EXPOSE 80
