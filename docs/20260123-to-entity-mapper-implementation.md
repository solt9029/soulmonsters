# ToEntityMapper実装完了

## 概要
Phase 3として、ToEntityMapperクラスの実装が完了しました。各ModelからEntityへの変換ロジックを、独立したMapperクラスに移行しました。

## 完了した作業

### 1. ToEntityMapperクラスの作成 ✅
以下のMapperクラスを作成しました：

#### 依存なし（基本クラス）
- [server/src/mappers/to-entity/card.to-entity.mapper.ts](server/src/mappers/to-entity/card.to-entity.mapper.ts)
- [server/src/mappers/to-entity/deck.to-entity.mapper.ts](server/src/mappers/to-entity/deck.to-entity.mapper.ts)
- [server/src/mappers/to-entity/game-state.to-entity.mapper.ts](server/src/mappers/to-entity/game-state.to-entity.mapper.ts)

#### 依存あり（中間クラス）
- [server/src/mappers/to-entity/game-user.to-entity.mapper.ts](server/src/mappers/to-entity/game-user.to-entity.mapper.ts)
  - DeckToEntityMapperに依存
- [server/src/mappers/to-entity/game-card.to-entity.mapper.ts](server/src/mappers/to-entity/game-card.to-entity.mapper.ts)
  - CardToEntityMapperに依存

#### 最上位クラス
- [server/src/mappers/to-entity/game.to-entity.mapper.ts](server/src/mappers/to-entity/game.to-entity.mapper.ts)
  - GameUserToEntityMapper, GameCardToEntityMapper, GameStateToEntityMapperに依存

### 2. Modelクラスの`toEntity()`メソッド更新 ✅
各Modelクラスの`toEntity()`メソッドを、Mapperを使う実装に変更しました：

#### 削除されたtoEntityメソッド
- [server/src/models/card.model.ts](server/src/models/card.model.ts) - ユーザーにより削除
- [server/src/models/deck.model.ts](server/src/models/deck.model.ts) - ユーザーにより削除

#### Mapperを使用するように更新
- [server/src/models/game-state.model.ts](server/src/models/game-state.model.ts:35-38)
  ```typescript
  toEntity(): GameStateEntity {
    const mapper = new GameStateToEntityMapper();
    return mapper.toEntity(this);
  }
  ```

- [server/src/models/game-user.model.ts](server/src/models/game-user.model.ts:22-25)
  ```typescript
  toEntity(): GameUserEntity {
    const mapper = new GameUserToEntityMapper(new DeckToEntityMapper());
    return mapper.toEntity(this);
  }
  ```

- [server/src/models/game-card.model.ts](server/src/models/game-card.model.ts:32-35)
  ```typescript
  toEntity(): GameCardEntity {
    const mapper = new GameCardToEntityMapper(new CardToEntityMapper());
    return mapper.toEntity(this);
  }
  ```

- [server/src/models/game.model.ts](server/src/models/game.model.ts:31-38)
  ```typescript
  toEntity(): GameEntity {
    const mapper = new GameToEntityMapper(
      new GameUserToEntityMapper(new DeckToEntityMapper()),
      new GameCardToEntityMapper(new CardToEntityMapper()),
      new GameStateToEntityMapper(),
    );
    return mapper.toEntity(this);
  }
  ```

## 技術的なポイント

### Mapperのインスタンス化
各Model内の`toEntity()`メソッドで、必要なMapperをインスタンス化しています。これにより：
- handlerなど既存のコードを変更せずに済む
- `gameModel.toEntity()`の呼び出しは変わらない
- 内部的にはMapperに委譲されている

### 依存関係の解決
ToEntityMapperは以下の依存関係を持ちます：
```
GameToEntityMapper
├── GameUserToEntityMapper
│   └── DeckToEntityMapper
├── GameCardToEntityMapper
│   └── CardToEntityMapper
└── GameStateToEntityMapper
```

各Mapperのコンストラクタで依存Mapperをインスタンス化することで、依存関係を解決しています。

## 今後の作業

### Phase 5: テストと検証
1. 既存のSpecを実行して動作確認
2. 必要に応じてMapperのテストを追加

### 将来的な改善（オプション）
1. **DI化の検討**
   - NestJSの`@Injectable()`を活用してMapperをDIコンテナで管理
   - 現状は各メソッド内でインスタンス化しているが、将来的にはDI化も可能

2. **toEntity()メソッドの完全削除**
   - 現在はModel内に`toEntity()`メソッドが残っている
   - 全ての呼び出し箇所を直接Mapperに置き換えることで、完全にModelから変換ロジックを削除可能
   - ただし、多くの箇所で`model.toEntity()`が使われているため、大規模な変更が必要

## 影響範囲

### 新規作成ファイル
- `server/src/mappers/to-entity/card.to-entity.mapper.ts`
- `server/src/mappers/to-entity/deck.to-entity.mapper.ts`
- `server/src/mappers/to-entity/game-state.to-entity.mapper.ts`
- `server/src/mappers/to-entity/game-user.to-entity.mapper.ts`
- `server/src/mappers/to-entity/game-card.to-entity.mapper.ts`
- `server/src/mappers/to-entity/game.to-entity.mapper.ts`

### 更新ファイル
- `server/src/models/game-state.model.ts`
- `server/src/models/game-user.model.ts`
- `server/src/models/game-card.model.ts`
- `server/src/models/game.model.ts`

### 修正不要（既存のまま）
- 全てのhandlerファイル（`gameModel.toEntity()`の呼び出しはそのまま）
- 全てのvalidatorファイル
- GameServiceなど

## まとめ
ToEntityMapperの実装により、Model→Entity変換ロジックが独立したMapperクラスに移行されました。既存のコードはほぼ変更せず、内部的にMapperを使う形で実装されています。
