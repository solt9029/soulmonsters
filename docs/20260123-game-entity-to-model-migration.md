# GameEntity to GameModel Migration - 完了

## 概要
GameEntityをDB層（Entity）とドメイン層（Model）に分離する作業を完了しました。

## 完了した作業

### 1. GameModelクラスの作成 ✅
- ファイル: [server/src/models/game.model.ts](server/src/models/game.model.ts)
- GameEntityのほぼ完全コピーとして定義
- GameUserEntity, GameCardEntity, GameStateEntityは一旦Entityのまま保持
- `toEntity()`メソッドを追加（一時的な変換用、将来削除予定）

### 2. GameRepositoryの更新 ✅
- ファイル: [server/src/repositories/game.repository.ts](server/src/repositories/game.repository.ts)
- `toModel`ヘルパー関数を追加（GameEntity → GameModel変換）
- 全メソッドの戻り値を`GameModel | null`に変更
  - `findActiveGameByUserId`
  - `findByIdWithRelations`
  - `findByIdWithRelationsAndLock`
  - `findByIdWithGameUsersAndDeck`

### 3. GameServiceの更新 ✅
- ファイル: [server/src/services/game.service.ts](server/src/services/game.service.ts)
- インポートを`GameEntity`から`GameModel`に変更
- 全メソッドで`GameModel`を使用

### 4. grantActions関数群の更新 ✅
- ファイル: `server/src/game/actions/grantors/*.ts`
- 全てのgrantor関数を`GameModel`を受け取るように更新
- 一括置換で効率的に対応

### 5. reflectStates関数の更新 ✅
- ファイル: [server/src/game/states/reflectors/index.ts](server/src/game/states/reflectors/index.ts)
- `GameEntity`を`GameModel`に変更

### 6. handleAction関数とhandlers/validatorsの更新 ✅
- ファイル: [server/src/game/actions/handlers/index.ts](server/src/game/actions/handlers/index.ts)
- `GameEntity`を`GameModel`に変更
- 全てのvalidator/handler関数（43ファイル）を一括更新
- `manager.save(GameEntity, ...)`を`manager.save(...)`に修正
- インポートパスの修正

### 7. game.presenterの更新 ✅
- ファイル: [server/src/presenters/game.presenter.ts](server/src/presenters/game.presenter.ts)
- `GameModel`を受け取るように変更

### 8. GameStateEntity作成時の修正 ✅
以下のファイルで`gameModel.toEntity()`を使用するように修正：
- [server/src/game/actions/handlers/attack/incrementAttackCount.ts](server/src/game/actions/handlers/attack/incrementAttackCount.ts:34)
- [server/src/game/actions/handlers/effectRuteruteDraw/saveEffectUseCountGameState.ts](server/src/game/actions/handlers/effectRuteruteDraw/saveEffectUseCountGameState.ts:8)
- [server/src/game/actions/handlers/putSoul/savePutCountGameState.ts](server/src/game/actions/handlers/putSoul/savePutCountGameState.ts:7)

### 9. コードフォーマット ✅
- `yarn format`を実行し、全ファイルをフォーマット

## 技術的なポイント

### toEntity()メソッドの導入
GameStateEntityを作成する際に`game`プロパティとしてGameEntityが必要なため、`toEntity()`メソッドを追加しました。
これは一時的な措置であり、将来的にGameStateEntityもModelに移行する際に削除予定です。

### 段階的な移行アプローチ
- GameUserEntity, GameCardEntity, GameStateEntityは今回Entityのまま保持
- 一気に全てを変更せず、GameModelのみを先に導入
- これにより、作業を分割し、安全に移行を進められる

## 今後の作業

1. GameUserModel, GameCardModel, GameStateModelの作成
2. これらのModelを使用するようにコードを更新
3. `toEntity()`メソッドの削除
4. 完全にEntityとModelの分離を達成

## 影響範囲

- 更新ファイル数: 約80ファイル
- 主な変更箇所:
  - models/game.model.ts（新規作成）
  - repositories/game.repository.ts
  - services/game.service.ts
  - presenters/game.presenter.ts
  - game/actions/grantors/*.ts（11ファイル）
  - game/actions/handlers/*.ts（30+ファイル）
  - game/actions/validators/*.ts（11ファイル）
  - game/states/reflectors/index.ts
