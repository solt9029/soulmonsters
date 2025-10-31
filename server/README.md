# soulmonsters-server

## environment

- prisma: 1.34.6
- nvm: 0.40.2

## setup

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

## testing

```sh
yarn test:db:up
yarn test:db:migrate

yarn test
```

## migration

Automatically generates migration files based on the defined entities while running the application on the local machine thanks to the synchronize option.

```ts
    TypeOrmModule.forRoot({
      // ...
      synchronize: DB_SYNCHRONIZE?.toLowerCase() === 'true',
    }),
```

- If you would like to create a custom migration file, you can generate a file through the command.

```sh
yarn typeorm migration:create -n FileName
```

## GraphQLの型生成

- このプロジェクトはスキーマファースト開発を採用しています（コードファーストではありません）
- GraphQLのスキーマは、ルートディレクトリのschemaディレクトリに集約管理されています（clientもこのスキーマを参照します）
- GraphQLのスキーマを更新した後に、NestJSが利用するtypescriptの型ファイルを生成するためには、serverディレクトリで`yarn generate-graphql-types`コマンドを利用するか、開発サーバーを起動すれば良いです。

## デバッグコンソール

Rails consoleのようなインタラクティブなデバッグ環境を提供します。

### 使い方

```sh
yarn console
```

### 使用例

#### サービスの実行

```javascript
await cardService.findAll();
```

#### SQL実行

`sql()` ヘルパー関数を使って直接SQLを実行できます。

```javascript
// SELECTクエリ
await sql('SELECT * FROM users LIMIT 10');

// パラメータ付きクエリ
await sql('SELECT * FROM games WHERE id = ?', [1]);

// UPDATEクエリ
await sql('UPDATE games SET status = ? WHERE id = ?', ['finished', 1]);
```
