# Game Action Handlers

このディレクトリは、ゲームアクションを処理するハンドラーを含みます。ゲーム状態の変更はすべてここで実装されます。

## 設計原則

### 1. エンティティベースのImmutable操作

GameEntityを中心とした設計で、常にGameEntityを受け取り、新しいGameEntityを返す関数として実装します。

```typescript
// ✅ 良い例
const putSoulGameCard = (gameEntity: GameEntity, userId: string, gameCardId: number): GameEntity => {
  const gameCards = gameEntity.gameCards.map(gameCard =>
    gameCard.id === gameCardId
      ? { ...gameCard, position: newPosition, zone: Zone.SOUL }
      : { ...gameCard }
  );
  return { ...gameEntity, gameCards };
};

// ❌ 避けるべき例
await gameCardRepository.update({ id: gameCardId }, { zone: Zone.SOUL });
```

### 2. 集約保存パターン

複数の変更を行う場合は、GameEntityのassociationをすべて操作した後、最後に`manager.save`で一括保存します。

```typescript
// ✅ 推奨パターン
gameEntity = updateGameCards(gameEntity, ...);
gameEntity = updateGameStates(gameEntity, ...);
await manager.save(GameEntity, gameEntity);

// ❌ 避けるべきパターン
await gameCardRepository.update(...);
await gameStateRepository.save(...);
```

### 3. 機能分割

複雑な操作は、小さな純粋関数に分割します。これによりテストが容易になり、ロジックが明確になります。

```typescript
// 計算関数
const calcNewSoulGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  // 計算ロジック
};

// エンティティ操作関数
const putSoulGameCard = (gameEntity: GameEntity, userId: string, gameCardId: number): GameEntity => {
  // エンティティ変更ロジック
};

// 状態管理関数
const savePutCountGameState = (gameEntity: GameEntity, gameUserId: number): GameEntity => {
  // ゲーム状態変更ロジック
};
```

### 4. 後処理の分離

ユニーク制約などの関係で別クエリが必要な操作は、メイン保存後に実行します。

```typescript
// メイン処理
gameEntity = putSoulGameCard(gameEntity, userId, gameCardId);
await manager.save(GameEntity, gameEntity);

// 後処理（ユニーク制約のため分離）
await gameCardRepository.packHandPositions(gameEntity.id, userId, originalPosition);
```

## 実装ガイド

### 基本構造

```typescript
export async function handleXxxAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
) {
  // 1. 必要な情報の取得
  const targetCard = gameEntity.gameCards.find(card => card.id === data.payload.gameCardId);
  const gameUser = gameEntity.gameUsers.find(user => user.userId === userId);

  // 2. エンティティの段階的変更
  gameEntity = updateGameCards(gameEntity, ...);
  gameEntity = updateGameStates(gameEntity, ...);
  
  // 3. 一括保存
  await manager.save(GameEntity, gameEntity);
  
  // 4. 後処理（必要な場合のみ）
  await someRepository.doPostProcessing(...);
}
```

### ヘルパー関数のパターン

#### 計算関数
```typescript
const calcNewPosition = (gameEntity: GameEntity, zone: Zone, userId: string): number => {
  const cards = gameEntity.gameCards
    .filter(card => card.zone === zone && card.currentUserId === userId)
    .sort((a, b) => b.position - a.position);
  
  return cards.length > 0 ? cards[0].position + 1 : 0;
};
```

#### エンティティ更新関数
```typescript
const updateGameCard = (gameEntity: GameEntity, cardId: number, updates: Partial<GameCard>): GameEntity => {
  const gameCards = gameEntity.gameCards.map(card =>
    card.id === cardId ? { ...card, ...updates } : { ...card }
  );
  return { ...gameEntity, gameCards };
};
```

#### 状態管理関数
```typescript
const updateGameState = (gameEntity: GameEntity, stateUpdate: StateUpdate): GameEntity => {
  const gameStates = gameEntity.gameStates.map(state =>
    state.id === stateUpdate.id 
      ? { ...state, ...stateUpdate } 
      : { ...state }
  );
  return { ...gameEntity, gameStates };
};
```

## ベストプラクティス

### テスト容易性
- 各ヘルパー関数は純粋関数として実装
- GameEntityの入出力が明確
- モックが不要な単体テストが可能

### パフォーマンス
- 一括保存によりデータベースアクセスを最小化
- 必要な場合のみ後処理を実行

### 保守性
- 機能ごとに関数を分割
- 命名規則の統一（`calc...`, `update...`, `save...`）
- コメントは処理の意図を明確にする場合のみ

## リファクタリング指針

既存のハンドラーを新しいパターンに移行する際：

1. **直接的なリポジトリ操作を特定**
   ```typescript
   // 変更前
   await gameCardRepository.update({ id }, { zone: Zone.BATTLE });
   ```

2. **エンティティベース操作に変換**
   ```typescript
   // 変更後
   gameEntity = updateGameCard(gameEntity, id, { zone: Zone.BATTLE });
   ```

3. **最後に一括保存**
   ```typescript
   await manager.save(GameEntity, gameEntity);
   ```

## 参考実装

- **putSoul.ts**: 新しいパターンの完全実装例
