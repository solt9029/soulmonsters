# soulmonsters

## Development

```sh
docker compose -f mysql/docker-compose.yml up -d

# Follow server/README.md
# Follow client/README.md

yarn dev
```

## Release

### Build

```sh
# From PC

cp build/.env.example build/.env
vi build/.env

docker compose -f build/docker-compose.yml --env-file build/.env build
docker compose -f build/docker-compose.yml push
```

### Deploy

```sh
# From server machine

cp deploy/.env.example deploy/.env
vi deploy/.env

docker compose -f deploy/docker-compose.yml pull
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d
```
