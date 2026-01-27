# シマシマジュニア効果のPendingEffect移行

## 概要

シマシマジュニアの「バトルゾーンに置かれた時」に発動する誘発効果を、チェーンシステムに統合する。

### 現状の実装
- [zoneChanged.ts:15-21](server/src/game/events/handlers/zoneChanged.ts#L15-L21)で即座に効果処理（エナジー移動）を行っている
- チェーンシステムを経由していない

### 目標
1. Event HandlerでGamePendingEffectを作成する
2. ChainBuilder（新規）でGamePendingEffectからGameChain + GameChainLinkを生成する
3. ChainResolverでシマシマジュニアの効果を処理する

## 実装タスク

### TASK 1: GraphQLスキーマにEffectTypeを追加

**ファイル**: [effect.type.graphql](schema/effect.type.graphql)

```graphql
enum EffectType {
  # 既存のEffectType...
  SHIMASHIMAJUNIOR_ENERGY_TRANSFER
}
```

追加後、`yarn generate-graphql-types` を実行する。

---

### TASK 2: GameChainLinkのEffect型を拡張

**ファイル**: [game-chain-link.model.ts](server/src/models/game-chain-link.model.ts)

```typescript
export type Effect =
  | { type: EffectType.RUTERUTE_DRAW }
  | { type: EffectType.NATSUKASHINORUDE_POWER_DOWN; targetGameCardId: number }
  // ... 既存の型
  | { type: EffectType.SHIMASHIMAJUNIOR_ENERGY_TRANSFER };
```

---

### TASK 3: Event HandlerでGamePendingEffectを作成

**ファイル**: [zoneChanged.ts](server/src/game/events/handlers/zoneChanged.ts)

**変更内容**: シマシマジュニアの効果処理を即座に行うのではなく、GamePendingEffectを作成するように変更する。

```typescript
import { GamePendingEffectModel } from 'src/models/game-pending-effect.model';
import { EffectType } from 'src/graphql';

// 変更前
if (event.toZone === Zone.BATTLE && movedCard.card.id === CARD_ID.SHIMASHIMAJUNIOR) {
  const opponentUserId = gameModel.gameUsers.find(gu => gu.userId !== movedCard.currentUserId)?.userId;
  if (opponentUserId) {
    gameModel = subtractUserEnergy(gameModel, opponentUserId, 1);
    gameModel = addUserEnergy(gameModel, movedCard.currentUserId, 1);
  }
}

// 変更後
if (event.toZone === Zone.BATTLE && movedCard.card.id === CARD_ID.SHIMASHIMAJUNIOR) {
  const gamePendingEffect = new GamePendingEffectModel({
    gameId: gameModel.id,
    userId: movedCard.currentUserId,
    gameCardId: movedCard.id,
    effectType: EffectType.SHIMASHIMAJUNIOR_ENERGY_TRANSFER,
    createdAt: new Date(),
  });
  gameModel.gamePendingEffects = [...gameModel.gamePendingEffects, gamePendingEffect];
}
```

---

### TASK 4: ChainBuilderクラスを新規作成

**ファイル**: `server/src/game/chains/builder.ts`（新規作成）

GamePendingEffectからGameChain + GameChainLinkを生成する。DIできる状態にする。

```typescript
import { Injectable } from '@nestjs/common';
import { GameModel } from 'src/models/game.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus, Effect } from 'src/models/game-chain-link.model';
import { GamePendingEffectModel } from 'src/models/game-pending-effect.model';
import { EffectType } from 'src/graphql/index';

@Injectable()
export class ChainBuilder {
  buildChainIfNeeded(gameModel: GameModel): GameModel {
    // RESOLVING状態のGameChainが存在する場合は何もしない
    const hasResolvingChain = gameModel.gameChains.some(c => c.status === GameChainStatus.RESOLVING);
    if (hasResolvingChain) {
      return gameModel;
    }

    // GamePendingEffectが存在しない場合は何もしない
    if (gameModel.gamePendingEffects.length === 0) {
      return gameModel;
    }

    // STEP1: 最初のGamePendingEffectのみ処理（将来的には複数対応）
    const gamePendingEffect = gameModel.gamePendingEffects[0];

    // GamePendingEffectからEffectを生成
    const effect = this.buildEffect(gamePendingEffect);

    // GameChain (RESOLVING) + GameChainLink (WAITING) を生成
    const gameChain = new GameChainModel({
      gameId: gameModel.id,
      status: GameChainStatus.RESOLVING,
      gameChainLinks: [
        new GameChainLinkModel({
          orderIndex: 0,
          userId: gamePendingEffect.userId,
          gameCardId: gamePendingEffect.gameCardId,
          status: GameChainLinkStatus.WAITING,
          effect,
        }),
      ],
    });

    gameModel.gameChains = [...gameModel.gameChains, gameChain];

    // GamePendingEffectを削除
    gameModel.gamePendingEffects = gameModel.gamePendingEffects.filter(
      gpe => gpe.id !== gamePendingEffect.id,
    );

    return gameModel;
  }

  private buildEffect(gamePendingEffect: GamePendingEffectModel): Effect {
    switch (gamePendingEffect.effectType) {
      case EffectType.SHIMASHIMAJUNIOR_ENERGY_TRANSFER:
        return { type: EffectType.SHIMASHIMAJUNIOR_ENERGY_TRANSFER };
      default:
        throw new Error(`Unsupported effectType: ${gamePendingEffect.effectType}`);
    }
  }
}
```

---

### TASK 5: ChainResolverにシマシマジュニアの処理を追加

**ファイル**: `server/src/game/chains/resolvers/shimashimajuniorEnergyTransfer.ts`（新規作成）

```typescript
import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { addUserEnergy } from 'src/game/mutations/addUserEnergy';
import { subtractUserEnergy } from 'src/game/mutations/subtractUserEnergy';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';

export const resolveShimashimajuniorEnergyTransfer = (
  gameModel: GameModel,
  gameChainLink: GameChainLinkModel,
): GameModel => {
  const gameCard = gameModel.gameCards.find(gc => gc.id === gameChainLink.gameCardId);
  if (!gameCard) {
    return gameModel;
  }

  const opponentUserId = gameModel.gameUsers.find(gu => gu.userId !== gameCard.currentUserId)?.userId;
  if (opponentUserId) {
    gameModel = subtractUserEnergy(gameModel, opponentUserId, 1);
    gameModel = addUserEnergy(gameModel, gameCard.currentUserId, 1);
  }

  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  return gameModel;
};
```

**ファイル**: [resolvers/index.ts](server/src/game/chains/resolvers/index.ts)

switch文に追加:

```typescript
import { resolveShimashimajuniorEnergyTransfer } from './shimashimajuniorEnergyTransfer';

// resolveChainLink内のswitchに追加
case EffectType.SHIMASHIMAJUNIOR_ENERGY_TRANSFER: {
  return resolveShimashimajuniorEnergyTransfer(gameModel, gameChainLink);
}
```

---

### TASK 6: ChainBuilderをDIに登録

**ファイル**: [app.module.ts](server/src/modules/app.module.ts)

```typescript
import { ChainBuilder } from 'src/game/chains/builder';

@Module({
  // ...
  providers: [
    // ... 既存のproviders
    ChainBuilder,
  ],
})
```

---

### TASK 7: GameServiceにChainBuilderを統合

**ファイル**: [game.service.ts](server/src/services/game.service.ts)

```typescript
import { ChainBuilder } from 'src/game/chains/builder';

@Injectable()
export class GameService {
  constructor(
    // ... 既存のDI
    private chainBuilder: ChainBuilder,
    private chainResolver: ChainResolver,
  ) {}

  async dispatchAction(id: number, userId: string, data: GameActionDispatchInput) {
    return this.dataSource.transaction(async manager => {
      // ... 既存の処理

      const handledGameModel = this.gameActionHandler.handleAction(data, userId, grantedGameModel);

      // ChainBuilderでGamePendingEffectからGameChainを構築
      const builtGameModel = this.chainBuilder.buildChainIfNeeded(handledGameModel);

      // ChainResolverでGameChainを解決
      const resolvedGameModel = this.chainResolver.resolveChain(builtGameModel);

      return await manager.save(resolvedGameModel.toEntity());
    });
  }
}
```

---

### TASK 8: Specを作成

**ファイル**: `server/src/game/chains/resolvers/shimashimajuniorEnergyTransfer.spec.ts`（新規作成）

**ファイル**: `server/src/game/chains/builder.spec.ts`（新規作成）

---

### TASK 9: フォーマット・テスト実行

```bash
yarn generate-graphql-types
yarn workspace soulmonsters-server format
yarn workspace soulmonsters-server test
```

## 依存関係

```
TASK 1 → TASK 2 → TASK 3
              ↘
TASK 1 → TASK 4 → TASK 6 → TASK 7
              ↘
TASK 1 → TASK 5 → TASK 7 → TASK 8 → TASK 9
```

- TASK 1（EffectType追加）は他のすべてのタスクの前提条件
- TASK 2, 3, 4, 5は並行して作業可能（TASK 1完了後）
- TASK 6, 7はTASK 4, 5完了後
- TASK 8, 9は全実装完了後

## 将来の拡張ポイント

1. **複数のGamePendingEffect対応**: 現在は最初の1つだけ処理しているが、将来的にはユーザーが順序を選択できるようにする
2. **他の誘発効果の移行**: 進化したバクボムダン、相変わらずよく分からない花なども同様のパターンで移行可能
