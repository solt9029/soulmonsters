#!/bin/sh
set -e

echo "${NGINX_BASIC_AUTH_USER}:$(openssl passwd -apr1 ${NGINX_BASIC_AUTH_PASS})" > /etc/nginx/.htpasswd

exec nginx -g "daemon off;"
