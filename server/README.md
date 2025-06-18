# soulmonsters-server

## environment

- prisma: 1.34.6
- nvm: 0.40.2

## setup

```sh
git clone git@github.com:solt9029/soulmonsters-client.git
cd soulmonsters-client

git submodules init

nvm use # automatically switch to the node version specified in .nvmrc
npm install

docker-compose up -d

cp .env.example .env
vi .env

npm run typeorm migration:run

npm run start:dev
```

## migration

```sh
yarn run typeorm migration:create -n FileName
```
