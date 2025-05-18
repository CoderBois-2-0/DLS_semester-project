FROM node:22-alpine

RUN apk add --no-cache gcompat
RUN apk add pnpm

COPY .npmrc .
COPY package.json .
COPY pnpm-lock.yaml .
