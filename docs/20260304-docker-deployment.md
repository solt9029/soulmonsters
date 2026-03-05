# Docker デプロイ手順

## ファイル構成

```
soulmonsters/
├── docker-compose.dev.yml       # ローカル開発用（DB のみ）
├── docker-compose.prod.yml   # ローカルでイメージをビルド & push する用
├── deploy/
│   ├── docker-compose.yml       # VPS 上で実行する用
│   └── .env.example             # VPS 用 .env テンプレート
├── server/
│   └── Dockerfile
└── client/
    ├── Dockerfile
    └── nginx.conf
```

## ローカル：イメージのビルド & push

### 事前準備

`client/.env.production` を作成する（`.gitignore` 済み）：

```
VITE_HTTP_LINK_URI=http://your-vps-ip:3100/graphql   # ← ブラウザからアクセスする URL
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

> **注意**: `VITE_*` はビルド時に JS バンドルへ埋め込まれるブラウザ側の値。
> `localhost` を指定すると、エンドユーザーのブラウザが自分の PC に接続しようとするため本番では使えない。

### ビルド & push

リポジトリルートから実行：

```bash
docker compose -f docker-compose.prod.yml --env-file client/.env.production build
docker compose -f docker-compose.prod.yml push
```

## VPS：初回セットアップ

### ファイルの転送

```bash
scp -r deploy/ user@your-vps:/path/to/deploy/
```

### .env の作成

```bash
# VPS 上で
cp deploy/.env.example deploy/.env
vi deploy/.env   # 値を埋める
```

`.env` に設定する値：

| 変数 | 説明 |
|---|---|
| `DB_USERNAME` | MySQL ユーザー名 |
| `DB_PASSWORD` | MySQL パスワード |
| `DB_DATABASE` | DB 名（デフォルト: `soulmonsters`） |
| `CORS_ORIGIN` | フロントエンドの URL |
| `FIREBASE_PROJECT_ID` | Firebase プロジェクト ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin SDK のメールアドレス |
| `FIREBASE_DATABASE_URL` | Firebase Realtime Database の URL |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin SDK の秘密鍵（改行は `\n` リテラルで記述） |

> **DB_HOST / DB_PORT は不要**。docker-compose 内でサービス名 `mysql:3306` に固定済み。

### 起動

```bash
cd deploy
docker compose up -d
```

## VPS：更新デプロイ

ローカルで新しいイメージをビルド & push したあと：

```bash
cd deploy
docker compose pull
docker compose up -d
```

## 備考

- `server/Dockerfile` のビルドはリポジトリルートをコンテキストとして実行する（`schema/` が必要なため）
- `deploy/.env` は VPS のみに存在し、リポジトリには含めない
- `FIREBASE_PRIVATE_KEY` の改行: サーバーコードで `.replace(/\\n/g, '\n')` しているため、`.env` には `\n` リテラルのまま書く
