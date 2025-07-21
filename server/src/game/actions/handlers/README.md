# Game Action Handlers

このディレクトリは、ゲームアクションを処理するハンドラーを含みます。ゲーム状態の変更はすべてここで実装されます。

## 設計原則

### 1. エンティティベースのMutable操作

GameEntityを中心とした設計で、常にGameEntityを受け取り、そのGameEntityを直接変更して返す関数として実装します。

```typescript
// ✅ 良い例（現在のパターン）
const putSoulGameCard = (gameEntity: GameEntity, userId: string, gameCardId: number): GameEntity => {
  const index = gameEntity.gameCards.findIndex(gameCard => gameCard.id === gameCardId);
  
  gameEntity.gameCards[index].zone = Zone.SOUL;
  gameEntity.gameCards[index].position = calcNewSoulGameCardPosition(gameEntity, userId);
  
  return gameEntity;
};

// ❌ 避けるべき例
await gameCardRepository.update({ id: gameCardId }, { zone: Zone.SOUL });
```

### 2. 集約保存パターン

複数の変更を行う場合は、GameEntityの各プロパティを直接操作した後、最後に`manager.save`で一括保存します。

```typescript
// ✅ 推奨パターン
subtractUserEnergy(gameEntity, userId, gameCard.card.cost);
summonGameCard(gameEntity, userId, data.payload.gameCardId!);
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
  const soulGameCards = gameEntity.gameCards
    .filter(gameCard => gameCard.zone === Zone.SOUL && gameCard.currentUserId === userId)
    .sort((a, b) => b.position - a.position);
  
  return soulGameCards.length > 0 ? soulGameCards[0].position + 1 : 0;
};

// エンティティ操作関数
const putSoulGameCard = (gameEntity: GameEntity, userId: string, gameCardId: number): GameEntity => {
  const index = gameEntity.gameCards.findIndex(gameCard => gameCard.id === gameCardId);
  
  gameEntity.gameCards[index].zone = Zone.SOUL;
  gameEntity.gameCards[index].position = calcNewSoulGameCardPosition(gameEntity, userId);
  
  return gameEntity;
};

// 状態管理関数
const savePutCountGameState = (gameEntity: GameEntity, gameUserId: number): GameEntity => {
  const index = gameEntity.gameStates.findIndex(
    gameState => gameState.state.type === StateType.PUT_SOUL_COUNT && gameState.state.data.gameUserId === gameUserId,
  );
  
  if (index >= 0) {
    (gameEntity.gameStates[index].state.data as any).value++;
    return gameEntity;
  }
  
  gameEntity.gameStates.push(initPutSoulCountGameState(gameEntity, gameUserId));
  return gameEntity;
};
```

### 4. 後処理の分離

ユニーク制約などの関係で別クエリが必要な操作は、メイン保存後に実行します。

```typescript
// メイン処理
putSoulGameCard(gameEntity, userId, data.payload.gameCardId!);
savePutCountGameState(gameEntity, gameUser.id);
await manager.save(GameEntity, gameEntity);

// 後処理（ユニーク制約のため分離）
await gameCardRepository.packHandPositions(gameEntity.id, userId, originalPosition);
```

## Mutableアプローチの採用理由

### パフォーマンス
- オブジェクト生成のオーバーヘッドがない
- 大きなエンティティグラフの場合、メモリ使用量が大幅に削減される
- ガベージコレクションの負荷軽減

### 可読性
- 複雑なスプレッド演算子の組み合わせを避けられる
- コードが直感的で理解しやすい
- ネストした構造の更新が簡潔

### 保守性
- Immutableなクラス設計は非常に複雑になりがち
- TypeScriptでのImmutable実装は制約が多い

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
  updateGameCards(gameEntity, ...);
  updateGameStates(gameEntity, ...);
  
  // 3. 一括保存
  await manager.save(GameEntity, gameEntity);
  
  // 4. 後処理（必要な場合のみ）
  await someRepository.doPostProcessing(...);
}
```

### ヘルパー関数のパターン

#### 計算関数
```typescript
const calcNewBattleGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const battleGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.BATTLE && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return battleGameCards.length > 0 ? battleGameCards[0].position + 1 : 0;
};
```

#### エンティティ更新関数
```typescript
const summonGameCard = (gameEntity: GameEntity, userId: string, gameCardId: number): GameEntity => {
  const index = gameEntity.gameCards.findIndex(gameCard => gameCard.id === gameCardId);

  gameEntity.gameCards[index].zone = Zone.BATTLE;
  gameEntity.gameCards[index].battlePosition = BattlePosition.ATTACK;
  gameEntity.gameCards[index].position = calcNewBattleGameCardPosition(gameEntity, userId);

  return gameEntity;
};
```

#### 状態管理関数
```typescript
const subtractUserEnergy = (gameEntity: GameEntity, userId: string, amount: number): GameEntity => {
  const index = gameEntity.gameUsers.findIndex(gameUser => gameUser.userId === userId);

  gameEntity.gameUsers[index].energy -= amount;

  return gameEntity;
};
```

## ベストプラクティス

### テスト容易性
- 各ヘルパー関数は副作用のない純粋関数として実装
- GameEntityの入出力が明確
- モックが不要な単体テストが可能

### パフォーマンス
- 一括保存によりデータベースアクセスを最小化
- オブジェクト生成コストの削減
- 必要な場合のみ後処理を実行

### 保守性
- 機能ごとに関数を分割
- 命名規則の統一（`calc...`, `summon...`, `subtract...`, `save...`）
- findIndexパターンの統一使用

## 実装パターン

### 配列要素の直接変更
```typescript
// ✅ 推奨パターン
const index = gameEntity.gameCards.findIndex(gameCard => gameCard.id === gameCardId);
gameEntity.gameCards[index].zone = Zone.SOUL;

// ❌ 避けるべきパターン（Immutableな方法）
const gameCards = gameEntity.gameCards.map(gameCard =>
  gameCard.id === gameCardId
    ? { ...gameCard, zone: Zone.SOUL }
    : { ...gameCard }
);
return { ...gameEntity, gameCards };
```

### 配列への要素追加
```typescript
// ✅ 推奨パターン
gameEntity.gameStates.push(initPutSoulCountGameState(gameEntity, gameUserId));

// ❌ 避けるべきパターン
return { ...gameEntity, gameStates: [...gameEntity.gameStates, newState] };
```

### プリミティブ値の変更
```typescript
// ✅ 推奨パターン
gameEntity.gameUsers[index].energy -= amount;

// ❌ 避けるべきパターン
const gameUsers = gameEntity.gameUsers.map(user =>
  user.userId === userId ? { ...user, energy: user.energy - amount } : user
);
```

## リファクタリング指針

既存のハンドラーを新しいパターンに移行する際：

1. **Immutableな実装を特定**
   ```typescript
   // 変更前
   const gameCards = gameEntity.gameCards.map(gameCard =>
     gameCard.id === gameCardId ? { ...gameCard, zone: Zone.BATTLE } : { ...gameCard }
   );
   return { ...gameEntity, gameCards };
   ```

2. **Mutableな実装に変換**
   ```typescript
   // 変更後
   const index = gameEntity.gameCards.findIndex(gameCard => gameCard.id === gameCardId);
   gameEntity.gameCards[index].zone = Zone.BATTLE;
   return gameEntity;
   ```

3. **一括保存の確認**
   ```typescript
   await manager.save(GameEntity, gameEntity);
   ```

## 参考実装

- **putSoul.ts**: Mutableパターンの完全実装例
- **summonMonster.ts**: 複数エンティティ変更の実装例
