# ---- Builder ----
FROM node:22.14.0-alpine AS builder

RUN apk update && apk upgrade --no-cache

WORKDIR /workspace

COPY package.json yarn.lock ./
COPY client/package.json ./client/

RUN yarn install --frozen-lockfile

COPY client/ ./client/

ARG VITE_HTTP_LINK_URI
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_DATABASE_URL
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID

WORKDIR /workspace/client
RUN yarn build

# ---- Runner ----
FROM nginx:alpine AS runner

RUN apk update && apk upgrade --no-cache && apk add --no-cache apache2-utils

COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY client/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY --from=builder /workspace/client/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
