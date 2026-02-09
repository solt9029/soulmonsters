# GameChain/GameChainLinkのID設計: UUID採用について

## 背景

GameChainとGameChainLinkは、DB保存前にメモリ上で複数のインスタンスが同時に存在するケースがある。例えば、SOUL_CANONの効果処理中にAIKAWARAZUの効果が誘発し、両方のGameChainがメモリ上に存在する状況など。

## 問題

他のエンティティ（Card, Deck, GameUser等）と同様に`id: number`（auto increment）を使用すると、DB保存前は`id`が`undefined`になる。

```typescript
// 問題のあるコード例
gameModel.gameChains = gameModel.gameChains.map(chain =>
  chain.id === gameChainLink.gameChainId  // undefined === undefined → true（全マッチ）
    ? new GameChainModel({...})
    : chain,
);
```

`undefined === undefined`は`true`になるため、複数のChainがある場合に意図しないマッチングが発生し、データが上書きされるバグが起きる。

参考: https://github.com/solt9029/soulmonsters/pull/60#issuecomment-3821228486

## 検討した選択肢

### 1. UUID形式にする（採用）

GameChainとGameChainLinkのIDをUUID（string）に変更する。

- メリット: DB保存前でも一意のIDを生成できる。シンプルで直感的
- デメリット: 他のテーブル（Card, Deck等）との一貫性がなくなる

### 2. orderIndexで識別する

GameChainにorderIndexを設け、gameId + orderIndexの組み合わせでユニークにする。

- メリット: ID形式を変更しなくてよい
- デメリット: 開発者はIDで識別しようとするのが自然なため、バグを生みやすい

### 3. 一時的な負のIDを使う

DB保存前は負の数をIDとして使用し、保存後に正の数に変換する。

- メリット: 既存のID比較ロジックを変更しなくてよい
- デメリット: 「本物のID」と「一時ID」の区別が暗黙的で分かりにくい。変換処理が必要

### 4. オブジェクト参照で比較する

`===`でオブジェクト参照を直接比較する。

- メリット: IDの形式を変更しなくてよい
- デメリット: `new GameChainModel({...chain})`のようにスプレッド構文を使うと参照が変わるため、現在のimmutableな更新パターンと相性が悪い

## 決定: UUID形式を採用

以下の理由からUUID形式を採用する。

1. **GameChain/GameChainLinkは特殊なドメイン**: ゲーム中の「チェーン処理」という一時的なエンティティであり、Card, Deck, GameUserなどの「永続的なマスターデータ/ユーザーデータ」とは性質が異なる

2. **同じ問題が起きやすいエンティティ**: 「DB保存前にメモリ上で複数インスタンスが同時に存在する」という特性を持つエンティティはGameChain/GameChainLinkに限定される

3. **シンプルさ**: 作成時点で有効なIDが存在するため、「このIDはまだ保存されていない」という状態を気にする必要がない

4. **業界標準**: UUIDは広く使われているパターンであり、将来の拡張（分散システム等）にも対応しやすい

## 実装方針

- `GameChainModel.id`を`number`から`string`に変更
- `GameChainLinkModel.id`を`number`から`string`に変更
- `GameChainLinkModel.gameChainId`を`number`から`string`に変更
- 対応するDBテーブルのカラム型も変更
- インスタンス生成時に`crypto.randomUUID()`等でIDを生成
