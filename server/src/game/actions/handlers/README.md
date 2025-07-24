# Actions Handlers

## 概要

`actions/handlers` ディレクトリは、ゲームアクションの処理ロジックを格納しています。各ハンドラーは特定のゲームアクションに対応し、データベースエンティティの状態を更新します。

## データ操作方針

### GameEntity の操作

**GameEntity 自体には mutable な操作を行います。**

- ✅ `gameEntity.phase = Phase.ENERGY`
- ✅ `gameEntity.gameCards = newGameCards`
- ✅ `gameEntity.gameUsers = newGameUsers`

### Association Entity の操作

**GameEntity に紐づく association の entity（gameCards、gameUsers等）には immutable な操作を行います。**

#### gameCards の操作例

```typescript
// ❌ 直接変更
gameEntity.gameCards[0].zone = Zone.SOUL;

// ✅ immutable に新規作成して代入
gameEntity.gameCards = gameEntity.gameCards.map(gameCard =>
  gameCard.id === targetId
    ? new GameCardEntity({
        ...gameCard,
        zone: Zone.SOUL,
        position: newPosition,
      })
    : gameCard,
);
```

#### gameUsers の操作例

```typescript
// ❌ 直接変更
const gameUser = gameEntity.gameUsers.find(u => u.userId === userId);
gameUser.energy = newEnergy;

// ✅ immutable に新規作成して代入
gameEntity.gameUsers = gameEntity.gameUsers.map(gameUser =>
  gameUser.userId === userId 
    ? new GameUserEntity({ ...gameUser, energy: newEnergy }) 
    : gameUser,
);
```

## ハンドラーパターン

### メインハンドラー
- エントリーポイントとして機能
- 必要なサブ処理を呼び出し
- 最終的にエンティティを保存

### サブ処理
- 単一責任の原則に従った小さな関数
- GameEntity を受け取り、更新されたGameEntity を返却
- 純粋関数として設計（副作用なし）

## 実装例

```typescript
// メインハンドラーの例
export async function handleExampleAction(
  manager: EntityManager,
  userId: string,
  gameEntity: GameEntity,
) {
  gameEntity = updateSomeProperty(gameEntity, userId);
  gameEntity = updatePhase(gameEntity);
  
  await manager.save(GameEntity, gameEntity);
}

// サブ処理の例
const updateSomeProperty = (gameEntity: GameEntity, userId: string): GameEntity => {
  // immutable な操作でassociation entityを更新
  gameEntity.gameCards = gameEntity.gameCards.map(card =>
    card.currentUserId === userId
      ? new GameCardEntity({ ...card, someProperty: newValue })
      : card,
  );
  
  // mutable な操作でGameEntity自体を更新
  gameEntity.phase = Phase.NEXT;
  
  return gameEntity;
};
```