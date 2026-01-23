# ソウルキャノン実装設計

## 概要
ソウルキャノンは、サムシングタイム（Phase.SOMETHING）に使用できる特殊アクションです。ソウルゾーンのカードを4枚モルグゾーンに置き、相手のモンスター1枚をモルグゾーンに置くことができます。

## 仕様
- **発動タイミング**: サムシングタイム（Phase.SOMETHING）
- **コスト**: ソウルゾーンのカード4枚をモルグゾーンに移動
- **効果**: 相手のバトルゾーンにいるモンスター1枚をモルグゾーンに移動

## 実装すべきファイル

### 1. GraphQL スキーマ
- **ファイル**: `schema/action.type.graphql`
- **ステータス**: 既に `USE_SOUL_CANON` が定義済み
- **変更**: 不要

### 2. Grantor (アクション付与処理)
- **ファイル**: `server/src/game/actions/grantors/useSoulCannon.ts`
- **役割**: ソウルキャノンを使用できる条件を満たしているか判定し、GameUserにアクションタイプを付与
- **処理内容**:
  - Phase が SOMETHING であることを確認
  - turnUserId が自分であることを確認
  - ソウルゾーンに自分のカードが4枚以上あることを確認
  - 相手のバトルゾーンにモンスターが1枚以上いることを確認
  - 条件を満たす場合、GameUser の actionTypes に `USE_SOUL_CANON` を追加

### 3. Validator (バリデーション処理)
- **ファイル**: `server/src/game/actions/validators/useSoulCannon.ts`
- **役割**: アクション実行時のバリデーション
- **処理内容**:
  - payload から costGameCardIds (4枚) と targetGameCardIds (1枚) を取得
  - costGameCardIds が正確に4枚であることを確認
  - targetGameCardIds が正確に1枚であることを確認
  - costGameCardIds のカードがすべて自分のソウルゾーンにあることを確認
  - targetGameCardIds のカードが相手のバトルゾーンにあることを確認
  - GameUser に `USE_SOUL_CANON` アクションが付与されていることを確認
  - Payload を返す (costGameCards, targetGameCard, gameUser)

### 4. Handler (実行処理)
- **ファイル**: `server/src/game/actions/handlers/useSoulCannon.ts`
- **役割**: ソウルキャノンの実際の効果を実行
- **処理内容**:
  - コストとなる4枚のカードをソウルゾーンからモルグゾーンに移動
  - ターゲットのモンスターをバトルゾーンからモルグゾーンに移動
  - 使用回数をGameStateに記録（必要に応じて）

### 5. Handler サブ関数
- **ファイル**:
  - `server/src/game/actions/handlers/useSoulCannon/moveCardsToMorgue.ts`
  - `server/src/game/actions/handlers/useSoulCannon/destroyTargetMonster.ts`
- **役割**: Handler の処理を分割
- **moveCardsToMorgue の処理内容**:
  - 指定されたカードをモルグゾーンに移動
  - モルグゾーンの position を計算して設定
- **destroyTargetMonster の処理内容**:
  - ターゲットのモンスターをモルグゾーンに移動
  - battlePosition を null に設定
  - モルグゾーンの position を計算して設定

### 6. 統合処理の更新
- **ファイル**:
  - `server/src/game/actions/grantors/index.ts`
  - `server/src/game/actions/validators/index.ts`
  - `server/src/game/actions/handlers/index.ts`
- **変更内容**:
  - 各ファイルに useSoulCannon の import と関数呼び出しを追加
  - validators/index.ts の ValidationResult 型に USE_SOUL_CANON ケースを追加
  - handlers/index.ts の switch 文に USE_SOUL_CANNON ケースを追加

## データ構造

### ActionPayload (既存)
```graphql
input ActionPayload {
  gameCardId: Int
  targetGameCardIds: [Int!]
  costGameCardIds: [Int!]
  targetGameUserIds: [Int!]
}
```

### UseSoulCannonActionPayload (新規)
```typescript
export type UseSoulCannonActionPayload = {
  costGameCards: GameCardModel[];  // 4枚のソウルゾーンのカード
  targetGameCard: GameCardModel;   // 破壊対象のモンスター
  gameUser: GameUserModel;         // アクションを実行するユーザー
};
```

## モルグゾーンへの移動処理

既存の `putSoulGameCard` や `destroyMonster` を参考に、モルグゾーンへの移動処理を実装します。

### モルグゾーン position の計算
```typescript
const calcNewMorgueGameCardPosition = (gameModel: GameModel, userId: string): number => {
  const morgueGameCards = gameModel.gameCards
    .filter(gameCard => gameCard.zone === Zone.MORGUE && gameCard.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return morgueGameCards[0] ? morgueGameCards[0].position + 1 : 0;
};
```

## 実装順序

1. Grantor の実装
2. Validator の実装
3. Handler サブ関数の実装
4. Handler の実装
5. 統合処理の更新
6. テストの作成と実行

## テスト観点

### Grantor のテスト
- ソウルゾーンに4枚以上のカードがあり、相手のバトルゾーンにモンスターがいる場合、アクションが付与される
- ソウルゾーンのカードが4枚未満の場合、アクションが付与されない
- 相手のバトルゾーンにモンスターがいない場合、アクションが付与されない
- Phase が SOMETHING でない場合、アクションが付与されない
- 自分のターンでない場合、アクションが付与されない

### Validator のテスト
- 正常系: 正しい costGameCardIds と targetGameCardIds が渡された場合、バリデーションが通る
- costGameCardIds が4枚でない場合、エラーが発生する
- targetGameCardIds が1枚でない場合、エラーが発生する
- costGameCardIds のカードが自分のソウルゾーンにない場合、エラーが発生する
- targetGameCardIds のカードが相手のバトルゾーンにない場合、エラーが発生する
- GameUser に USE_SOUL_CANON アクションが付与されていない場合、エラーが発生する

### Handler のテスト
- コストの4枚のカードがソウルゾーンからモルグゾーンに移動する
- ターゲットのモンスターがバトルゾーンからモルグゾーンに移動する
- ターゲットのモンスターの battlePosition が null になる
- モルグゾーンの position が正しく設定される

## 参考実装

- PUT_SOUL アクション（ソウルゾーンへの移動処理）
- ATTACK アクション（モンスターの破壊処理）
- EFFECT_* アクション（GameState の記録処理）

## 注意事項

1. **ゾーン変更イベント**: モンスターをモルグゾーンに移動する際、ゾーン変更イベントを発火する必要があるか検討（destroyMonster の実装を参考）
2. **使用回数制限**: ソウルキャノンに使用回数制限が必要か確認（プットタイムは1ターンに1回のみ）
3. **currentUserId の扱い**: カードがモルグゾーンに移動しても currentUserId は変更しない（元の所有者のまま）
4. **position の連続性**: モルグゾーンに複数枚同時に移動する場合、position の計算が正しいか確認
