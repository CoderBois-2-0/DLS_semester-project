FROM qu-node AS base

FROM base AS builder
WORKDIR /repo

COPY ./.npmrc .
COPY ./package.json .
COPY ./pnpm-lock.yaml .
COPY ./pnpm-workspace.yaml .
COPY --from=src . ./apps/admin_organiser/qu_admin_organiser_frontend

RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    --mount=type=cache,id=pnpm,target=/pnpm-store \
    pnpm --filter qu_admin_organiser_frontend install --frozen-lockfile
RUN pnpm --filter qu_admin_organiser_frontend build
RUN --mount=type=secret,id=QUEUE_UP_REG_TOKEN,env=QUEUE_UP_REG_TOKEN \
    pnpm --filter qu_admin_organiser_frontend deploy --prod /prod/admin_organiser_frontend

FROM nginx:alpine3.21 AS qu_admin_organiser_frontend

# NGINX will automatically serve files from /usr/share/nginx/html
COPY --from=builder /prod/admin_organiser_frontend/dist/. /usr/share/nginx/html

EXPOSE 80
