# soulmonsters-server

## Environment

- prisma: 1.34.6
- nvm: 0.40.2

## Setup

```sh
git clone git@github.com:solt9029/soulmonsters.git
cd server

nvm use # automatically switch to the node version specified in .nvmrc
yarn install

cp .env.example .env
vi .env

yarn db:up
yarn db:migrate

yarn start:dev
```

## Testing

```sh
yarn test:db:up
yarn test:db:migrate

yarn test
```

## Migration

Migration files are automatically generated based on the defined entities when running the application on the local machine, thanks to the synchronize option.

```ts
    TypeOrmModule.forRoot({
      // ...
      synchronize: DB_SYNCHRONIZE?.toLowerCase() === 'true',
    }),
```

- If you would like to create a custom migration file, you can generate it using the following command:

```sh
yarn typeorm migration:create -n FileName
```

## GraphQL Type Generation

- This project adopts a schema-first development approach (not code-first)
- GraphQL schemas are centrally managed in the schema directory at the root of the project (the client also references this schema)
- After updating the GraphQL schema, to generate TypeScript type files for NestJS, run the `yarn generate-graphql-types` command in the server directory, or start the development server.

## Debug Console

Provides an interactive debugging environment similar to Rails console.

### Usage

```sh
yarn console
```

### Examples

#### Executing Services

```javascript
await cardService.findAll();
```

#### Executing SQL

You can execute SQL directly using the `sql()` helper function.

```javascript
await sql('SELECT * FROM users LIMIT 10');
await sql('SELECT * FROM games WHERE id = ?', [1]);
await sql('UPDATE games SET status = ? WHERE id = ?', ['finished', 1]);
```
