# Mapper Migration Design

## 概要
ModelとEntityの変換ロジックを、Model/Repositoryから独立したMapperクラスに移行する設計。

## 背景
現状、以下の問題がある:
- `Model.toEntity()`: Modelクラスに変換ロジックが混在
- `Repository.toModel()`: Repositoryクラスに変換ロジックが混在
- 責務が分離されておらず、テストやメンテナンスが困難

## 解決策: 双方向Mapperパターン

### 命名
- Entity → Model: `{Entity名}ToModelMapper`（例: `GameToModelMapper`）
- Model → Entity: `{Model名}ToEntityMapper`（例: `GameToEntityMapper`）

### ディレクトリ構造
```
server/src/
  mappers/
    to-model/
      game.to-model.mapper.ts
      game-card.to-model.mapper.ts
      game-state.to-model.mapper.ts
      game-user.to-model.mapper.ts
      deck.to-model.mapper.ts
      card.to-model.mapper.ts
    to-entity/
      game.to-entity.mapper.ts
      game-card.to-entity.mapper.ts
      game-state.to-entity.mapper.ts
      game-user.to-entity.mapper.ts
      deck.to-entity.mapper.ts
      card.to-entity.mapper.ts
```

### 実装パターン

#### ToModelMapper（Entity → Model）
```typescript
@Injectable()
export class CardToModelMapper {
  toModel(entity: CardEntity): CardModel {
    return new CardModel({
      id: entity.id,
      name: entity.name,
      // ... 他のプロパティ
    });
  }
}

@Injectable()
export class GameToModelMapper {
  constructor(
    private readonly gameUserToModelMapper: GameUserToModelMapper,
    private readonly gameCardToModelMapper: GameCardToModelMapper,
    private readonly gameStateToModelMapper: GameStateToModelMapper,
  ) {}

  toModel(entity: GameEntity): GameModel {
    return new GameModel({
      id: entity.id,
      // ... 他のプロパティ
      gameUsers: (entity.gameUsers ?? []).map(e => this.gameUserToModelMapper.toModel(e)),
      gameCards: (entity.gameCards ?? []).map(e => this.gameCardToModelMapper.toModel(e)),
      gameStates: (entity.gameStates ?? []).map(e => this.gameStateToModelMapper.toModel(e)),
    });
  }
}
```

#### ToEntityMapper（Model → Entity）
```typescript
@Injectable()
export class CardToEntityMapper {
  toEntity(model: CardModel): CardEntity {
    return new CardEntity({
      id: model.id,
      name: model.name,
      // ... 他のプロパティ
    });
  }
}

@Injectable()
export class GameToEntityMapper {
  constructor(
    private readonly gameUserToEntityMapper: GameUserToEntityMapper,
    private readonly gameCardToEntityMapper: GameCardToEntityMapper,
    private readonly gameStateToEntityMapper: GameStateToEntityMapper,
  ) {}

  toEntity(model: GameModel): GameEntity {
    return new GameEntity({
      id: model.id,
      // ... 他のプロパティ
      gameUsers: model.gameUsers.map(m => this.gameUserToEntityMapper.toEntity(m)),
      gameCards: model.gameCards.map(m => this.gameCardToEntityMapper.toEntity(m)),
      gameStates: model.gameStates.map(m => this.gameStateToEntityMapper.toEntity(m)),
    });
  }
}
```

## 移行手順

### Phase 1: ToModelMapperクラスの作成
1. `server/src/mappers/to-model/` ディレクトリを作成
2. 各EntityからModelへの変換を行うMapperクラスを作成
   - 依存関係の少ないものから順に作成（Card, Deck, GameState）
   - 次に中間層（GameUser, GameCard）
   - 最後に最上位層（Game）

### Phase 2: Repositoryの移行
1. RepositoryでToModelMapperを依存注入
2. 既存の`toModel()`関数呼び出しを`mapper.toModel()`に置換
3. Repository内の`toModel`関数を削除

### Phase 3: ToEntityMapperクラスの作成
1. `server/src/mappers/to-entity/` ディレクトリを作成
2. 各ModelからEntityへの変換を行うMapperクラスを作成
   - 同様に依存関係の少ないものから順に作成

### Phase 4: Modelの移行
1. Modelの`toEntity()`メソッド呼び出しを`mapper.toEntity()`に置換
2. Model内の`toEntity()`メソッドを削除

### Phase 5: テストと検証
1. 既存のSpecを実行して動作確認
2. 必要に応じてMapperのテストを追加

## 依存関係の整理

### ToModelMapper作成順序（依存が少ない順）
1. `CardToModelMapper` - 依存なし
2. `DeckToModelMapper` - 依存なし
3. `GameStateToModelMapper` - 依存なし
4. `GameUserToModelMapper` - DeckToModelMapperに依存
5. `GameCardToModelMapper` - CardToModelMapperに依存
6. `GameToModelMapper` - GameUserToModelMapper, GameCardToModelMapper, GameStateToModelMapperに依存

### ToEntityMapper作成順序（依存が少ない順）
1. `CardToEntityMapper` - 依存なし
2. `DeckToEntityMapper` - 依存なし
3. `GameStateToEntityMapper` - 依存なし
4. `GameUserToEntityMapper` - DeckToEntityMapperに依存
5. `GameCardToEntityMapper` - CardToEntityMapperに依存
6. `GameToEntityMapper` - GameUserToEntityMapper, GameCardToEntityMapper, GameStateToEntityMapperに依存

## 特記事項

### actionTypesの扱い
- `GameUserModel` と `GameCardModel` の `actionTypes` は、Databaseで保持していないため、Entity => Model化する際には常に空配列がセットされる
- この仕様をToModelMapperに移行する

### Nullableな値の扱い
- Entity => Model: `entity.deck ? this.deckToModelMapper.toModel(entity.deck) : undefined`
- Model => Entity: `model.deck ? this.deckToEntityMapper.toEntity(model.deck) : undefined`

## 利点
1. **単一責務の原則**:
   - ToModelMapperはEntity→Model変換のみ
   - ToEntityMapperはModel→Entity変換のみ
2. **明確な責務の分離**: 方向性が明確で理解しやすい
3. **テスタビリティ**: 各Mapperを独立してテスト可能
4. **再利用性**: 複数の箇所でMapperを利用可能
5. **保守性**: 変換ロジックの変更が一箇所で完結
6. **DIの活用**: NestJSのDIコンテナで管理され、モックやテストが容易
7. **循環参照の回避**: 双方向の変換が別クラスなので、循環参照が発生しにくい
