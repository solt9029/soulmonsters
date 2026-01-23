# カード効果トリガーシステム設計

## 目的

カードゲームにおいて「特定のイベントが発生したときに発動する効果」を汎用的に実装するためのシステムを構築する。

## 背景

現在、カード効果は個別にハードコーディングされている（例: ルテルテのドロー効果）。
しかし、「バトルゾーンからソウルゾーンに置かれたとき」などのトリガー条件は、複数のアクションで共通して発生するため、各アクション内に条件分岐を追加していくのは保守性が低い。

## 具体例: ニセキサンチョウ（カードID: 14）

**効果**: バトルゾーンからソウルゾーンに置かれたとき、その持ち主のプレイヤーは、エナジーが2増える。

この効果は以下のような状況で発動する:
- モンスターバトルで負けたとき
- カード効果で破壊されたとき
- その他、将来追加される可能性のあるアクション

## 設計方針

イベント駆動型アーキテクチャを採用する。最初はシンプルに実装し、必要に応じて抽象化を進める。

### フェーズ1: シンプルな実装（今回）

**ディレクトリ構成**:
```
server/src/game/
├── events/
│   └── index.ts          # イベント型定義を集約
└── effects/
    └── handlers/
        └── index.ts      # イベントハンドラー処理
```

ファイルサイズが大きくなったら個別ファイルに分割（例: `events/zoneChangedEvent.ts`）

### 1. イベント型定義 (Event Types)

**ファイル**: `server/src/game/events/index.ts`

```typescript
import { Zone } from '../../graphql';

export enum GameEventType {
  ZONE_CHANGED = 'ZONE_CHANGED',
}

export type ZoneChangedEvent = {
  type: GameEventType.ZONE_CHANGED;
  cardId: number;
  fromZone: Zone;
  toZone: Zone;
  ownerId: string;
};

export type GameEvent = ZoneChangedEvent;
```

### 2. イベントハンドラー (Event Handlers)

**ファイル**: `server/src/game/effects/handlers/index.ts`

ニセキサンチョウの効果をシンプルに実装。

```typescript
import { GameEvent, GameEventType } from '../../events';
import { GameModel } from '../../../models/game.model';
import { Zone } from '../../../graphql';
import { addUserEnergy } from '../../action/handlers/energy/addUserEnergy';

export function handleGameEvent(event: GameEvent, gameModel: GameModel): GameModel {
  if (event.type === GameEventType.ZONE_CHANGED) {
    return handleZoneChanged(event, gameModel);
  }
  return gameModel;
}

function handleZoneChanged(event: ZoneChangedEvent, gameModel: GameModel): GameModel {
  // バトル→ソウルへの移動を検出
  if (event.fromZone !== Zone.BATTLE || event.toZone !== Zone.SOUL) {
    return gameModel;
  }

  // 移動したカードを取得
  const movedCard = gameModel.gameCards.find(gc => gc.id === event.cardId);
  if (!movedCard) {
    return gameModel;
  }

  // ニセキサンチョウ（ID: 14）の効果: エナジー+2
  if (movedCard.card.id === 14) {
    gameModel = addUserEnergy(gameModel, event.ownerId, 2);
  }

  return gameModel;
}
```

### 3. 既存ハンドラーへの統合

**修正対象**: `server/src/game/action/handlers/attack/destroyMonster.ts`

```typescript
import { handleGameEvent } from '../../../effects/handlers';
import { GameEventType } from '../../../events';

export const destroyMonster = (gameModel: GameModel, gameCardId: number): GameModel => {
  const gameCard = gameModel.gameCards.find(card => card.id === gameCardId);
  if (!gameCard) throw new Error('Card not found');

  const previousZone = gameCard.zone;

  // ゾーン遷移実行
  gameModel.gameCards = gameModel.gameCards.map(card =>
    card.id === gameCardId
      ? new GameCardModel({
          ...card,
          zone: Zone.SOUL,
          position: calcNewSoulGameCardPosition(gameModel, card.currentUserId),
          battlePosition: null,
        })
      : card,
  );

  // イベント発火 & トリガー効果実行
  gameModel = handleGameEvent(
    {
      type: GameEventType.ZONE_CHANGED,
      cardId: gameCardId,
      fromZone: previousZone,
      toZone: Zone.SOUL,
      ownerId: gameCard.currentUserId,
    },
    gameModel
  );

  return gameModel;
};
```

### フェーズ2: 将来の拡張（必要になったら）

カードが増えて、同じようなハンドラーが増えてきたら:
- `game/effects/definitions/` を追加して効果定義層を導入
- `EffectExecutor` のような抽象化を検討
- カード効果をデータ駆動で定義

## 実装タスク

1. ✅ 設計ドキュメント作成（このファイル）
2. イベント型定義の実装 (`game/events/index.ts`)
3. イベントハンドラーの実装 (`game/effects/handlers/index.ts`) - ニセキサンチョウのみ
4. `addUserEnergy` ヘルパー関数の確認/追加
5. `destroyMonster.ts`への統合
6. テストの追加
7. 動作確認

## 利点

- **再利用性**: ゾーン遷移ロジックは既存のまま、効果定義は別ファイルに集約
- **拡張性**: 新しいカード効果は`CARD_EFFECTS`配列に追加するだけ
- **テスタビリティ**: イベント発火と効果実行が分離されているため、単体テストが容易
- **保守性**: カード効果が宣言的に定義されているため、仕様の把握が容易
- **型安全性**: TypeScriptの型システムで効果定義の誤りを検出可能

## 将来の拡張

- 複数のカードが同時にトリガーする場合の優先順位処理
- ターンプレイヤー優先ルールの実装（ルール: 同時発動時はターンプレイヤーから）
- カード効果のチェーン解決機能
- 効果の強制/任意選択のサポート
- 対象選択が必要な効果のサポート

## 参考

既存のカード効果実装例: `server/src/game/action/grantors/effectRuteruteDraw.ts`
