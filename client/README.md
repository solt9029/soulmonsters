# soulmonsters-server

## environment

- nvm: 0.40.2

## setup

```sh
git clone git@github.com:solt9029/soulmonsters.git
cd client

nvm use # automatically switch to the node version specified in .nvmrc
yarn install

cp .env.example .env
vi .env

yarn start
```

## graphql

```sh
npx graphql-codegen --config codegen.yml # generates src/graphql/generated/*
```
