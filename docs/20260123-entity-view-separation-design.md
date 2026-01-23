# Entity-View分離リファクタリング設計書

## 背景

現在、TypeORMのEntityがGraphQLのView層でそのまま使われている状態。View専用のプロパティ（`GameUserEntity.user`, `GameUserEntity.actionTypes`など）がEntityに含まれており、永続化層とプレゼンテーション層の関心事が混在している。

## 目的

- Presenterパターンを導入し、Entity→GraphQL型への変換を明示的にする
- 将来的にEntityからView専用プロパティを削除できる基盤を作る
- 責務の分離により保守性とテスタビリティを向上させる

## アーキテクチャ

### 変更前
```
DB層（TypeORM Entity）
    ↓
Service層（DB操作）
    ↓
Resolver層（Entityを直接返却）
    ↓
GraphQL型定義（自動生成）
    ↓
View層（クライアント）
```

### 変更後
```
DB層（TypeORM Entity）
    ↓
Service層（DB操作）
    ↓
Presenter層（Entity → GraphQL型変換）← 新規追加
    ↓
Resolver層（Presenterを呼び出し）
    ↓
GraphQL型定義（自動生成）
    ↓
View層（クライアント）
```

## 実装内容

### 1. Presenter層の作成

#### GameUserPresenter
- **ファイル**: `server/src/presenters/game.user.presenter.ts`
- **責務**: `GameUserEntity` → `GameUser`（GraphQL型）への変換
- **メソッド**: `static present(entity: GameUserEntity): GameUser`

#### GameCardPresenter
- **ファイル**: `server/src/presenters/game.card.presenter.ts`
- **責務**: `GameCardEntity` → `GameCard`（GraphQL型）への変換
- **メソッド**: `static present(entity: GameCardEntity): GameCard`

#### GamePresenter
- **ファイル**: `server/src/presenters/game.presenter.ts`
- **責務**: `GameEntity` → `Game`（GraphQL型）への変換（ネストも含む）
- **メソッド**: `static present(entity: GameEntity): Game`

### 2. Resolver層の修正

#### game.resolver.ts
- `GamePresenter`をimport
- `game()`メソッド: 返却時に`GamePresenter.present(gameEntity)`を呼び出す
- `games()`メソッド: 返却時に`gameEntities.map(GamePresenter.present)`を呼び出す

## View専用プロパティの一覧

### GameUserEntity
- `user: User` - UserServiceから取得したユーザー情報
- `actionTypes: ActionType[]` - grantActions()で設定される実行可能アクション

### GameCardEntity
- `name: string | null` - cardプロパティから複製
- `kind: Kind | null` - cardプロパティから複製
- `type: Type | null` - cardプロパティから複製
- `attribute: Attribute | null` - cardプロパティから複製
- `attack: number | null` - cardプロパティから複製
- `defence: number | null` - cardプロパティから複製
- `cost: number | null` - cardプロパティから複製
- `detail: string | null` - cardプロパティから複製
- `actionTypes: ActionType[]` - grantActions()で設定される実行可能アクション

## 今回のスコープ

### 実施すること
✅ Presenter層の作成（3ファイル）
✅ Resolver層の修正（game.resolver.ts）
✅ ビルド確認
✅ フォーマット実行

### 実施しないこと（将来的な拡張）
❌ EntityからView専用プロパティを削除
❌ Presenterでのロジック追加（今回は単純な変換のみ）
❌ 他のResolverの修正（card, deck, deckCardなど）

## 影響範囲

### 新規作成ファイル
1. `server/src/presenters/game.user.presenter.ts`
2. `server/src/presenters/game.card.presenter.ts`
3. `server/src/presenters/game.presenter.ts`

### 修正ファイル
1. `server/src/resolvers/game.resolver.ts`（2箇所: game(), games()メソッド）

### 修正不要
- Entity定義ファイル
- GraphQLスキーマファイル
- Service層
- grantActions/reflectStates関数群

## テスト戦略

### ビルド確認
```bash
cd server
yarn build
```

### フォーマット実行
```bash
cd server
yarn format
```

### 動作確認
1. サーバー起動
2. GraphQLクエリでゲーム情報を取得
3. View専用プロパティ（user, actionTypes, カード詳細情報）が正しく返却されることを確認

## 設計の根拠

### Presenterパターンを選択した理由
1. **責務の明確化**: Entity（永続化）とView（表示）の責務を分離
2. **テスタビリティ**: Presenter単体でテスト可能
3. **保守性**: 変換ロジックが一箇所に集約される
4. **クリーンアーキテクチャ**: プレゼンテーション層の標準的なパターン

### GraphQL自動生成型を活用する理由
- `schema/*.graphql`から`src/graphql/index.ts`が自動生成される
- Presenterはこの自動生成型を返すことで型安全性が保証される
- 独自のViewクラスを作るよりもメンテナンスコストが低い

## 将来的な拡張計画（Phase 2）

1. EntityからView専用プロパティを削除
   - `GameUserEntity.user`を削除
   - `GameUserEntity.actionTypes`を削除
   - `GameCardEntity`のView専用プロパティを削除

2. Presenterでのロジック追加
   - `GameUserPresenter`でUserServiceから取得したデータを設定
   - `GameCardPresenter`でcardプロパティから情報を複製

3. 他のResolverへの適用
   - card.resolver.ts
   - deck.resolver.ts
   - deck.card.resolver.ts

## 参考資料

### 関連ファイル
- Entity定義: `server/src/entities/game.user.entity.ts`, `server/src/entities/game.card.entity.ts`
- Resolver: `server/src/resolvers/game.resolver.ts`
- GraphQL型定義: `server/src/graphql/index.ts`（自動生成）
- GraphQLスキーマ: `schema/game.user.graphql`, `schema/game.card.graphql`
- アクション付与: `server/src/game/actions/grantors/index.ts`
- 状態反映: `server/src/game/states/reflectors/index.ts`
