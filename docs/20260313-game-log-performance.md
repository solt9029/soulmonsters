# GameLog パフォーマンス改善設計

## 問題

gameLogs が増えるにつれて dispatchAction の処理が重くなる。

現状の（ナイーブな）処理フロー:
1. relation 経由で全 gameLogs を entity として読み込む
2. gameLogs が model に変換される
3. gameLogs を追加する処理が実行される（いろいろ）
4. 全 gameLogs が entity に変換される
5. 保存処理が走る

ゲームが進むほど gameLogs 件数が増えるため、1・4・5 のコストが線形に増加する。

## 改善方針

**「そのターンで新規追加した gameLogs だけを別途 INSERT する」**

### ロード時（ステップ1）

`findByIdWithRelationsAndLock` では gameLogs をロードしない（すでにコメントアウト済み）。
これにより `dispatchAction` 開始時点で `model.gameLogs = []` になる。

### アクション処理中（ステップ3）

`addGameLog` が呼ばれるたびに `model.gameLogs` に追加される。
既存ログは読み込んでいないため、`model.gameLogs` の中身は**そのターンの新規ログのみ**になる。

### 保存時（ステップ4・5）

`game.to-entity.mapper.ts` の gameLogs 変換はコメントアウトのまま維持する。
GameEntity の `gameLogs` プロパティを `undefined` のままにすることで、TypeORM が既存レコードに触らないようにする。

> **注意**: `undefined` と `[]` は TypeORM にとって別の意味を持つ。
> `[]` をセットして save すると TypeORM が既存 gameLogs の `gameId` を null にしようとする（orphanedRowAction: 'nullify'）。
> `undefined` のままにすることでこの問題を回避できる。

新規 gameLogs は GameEntity のカスケードに乗せず、直接 save する:

```typescript
// game.service.ts dispatchAction 内
const savedEntity = await manager.save(finalGameModel.toEntity()); // gameLogs 含まない

if (finalGameModel.gameLogs.length > 0) {
  const newLogEntities = finalGameModel.gameLogs.map(
    log => new GameLogEntity({ gameId: finalGameModel.id, message: log.message })
  );
  await manager.save(newLogEntities); // 新規ログだけ batch INSERT
}

return savedEntity;
```

## gameLogs の参照

dispatchAction の返り値には gameLogs を含めない。
gameLogs の表示が必要な場合は、別途 GraphQL の field resolver を用意して DB から直接取得する方針とする。

## まとめ

| 処理 | 変更前 | 変更後 |
|------|--------|--------|
| ロード | 全 gameLogs を読み込む | 読み込まない |
| 変換（model→entity） | 全 gameLogs を変換 | スキップ（undefined） |
| 保存 | 全 gameLogs を cascade save | 新規分のみ直接 INSERT |
| 計算量 | O(n) ゲーム進行に比例 | O(1) そのターンの追加数のみ |
