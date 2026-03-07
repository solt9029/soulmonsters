# ---- Builder ----
FROM node:22.14.0-alpine AS builder

RUN apk update && apk upgrade --no-cache

WORKDIR /workspace

COPY package.json yarn.lock ./
COPY server/package.json ./server/

RUN yarn install --frozen-lockfile

COPY server/ ./server/
COPY schema/ ./schema/

WORKDIR /workspace/server
RUN yarn build

# ---- Runner ----
FROM node:22.14.0-alpine AS runner

RUN apk update && apk upgrade --no-cache

WORKDIR /workspace/server

COPY --from=builder /workspace/yarn.lock ./
COPY --from=builder /workspace/server/package.json ./
RUN yarn install --production --frozen-lockfile

COPY --from=builder /workspace/server/dist ./dist

# app.module.ts の typePaths: ['../schema/*.graphql'] が process.cwd() 基準で解決されるため
# WORKDIR(/workspace/server) の ../schema に配置する
COPY --from=builder /workspace/schema/ /workspace/schema/

EXPOSE 3100
CMD ["node", "dist/src/main"]
