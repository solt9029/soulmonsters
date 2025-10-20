# 概要
- 変数名やメソッド名から自明な内容はコードコメントとして残さないでください。
- `.env`などの機密情報が書かれたファイルは絶対に読み込まないでください。
- 大きい作業内容がある場合、分割してAIタスク実行したいです。適宜memory-bankディレクトリの中にmarkdownファイルを作成して、次のAIタスクが途中経過を把握できるようにしてください。
- 指定がない限りnpmではなくyarnを使用してください。
- Specの実装をする時は、必ずSpecを実行して成功することを確認してください。
- 実装作業を完了する前に、`yarn format`などのコードフォーマットを必ず実行してください。
- コマンドを実行する時は、各ディレクトリ(client, server)にある`README.md`を確認したり、`package.json`を事前に確認してください。

# Spec実装方針ガイドライン

## 概要
`savePutCountGameState.spec.ts`の実装を通じて得られた、テストファイル作成時の標準的なアプローチと方針をドキュメント化。

## テストファイルの命名と配置
- ファイル名: `{関数名}.spec.ts`
- 配置場所: テスト対象ファイルと同じディレクトリ
- 例: `/server/src/game/actions/handlers/putSoul/savePutCountGameState.spec.ts`

## 基本構造パターン

### インポート構成
```typescript
import { GameEntity } from 'src/entities/game.entity';
import { GameStateEntity } from 'src/entities/game.state.entity';
import { StateType } from 'src/graphql';
import { savePutCountGameState } from './savePutCountGameState';
```

### テストケース構成
```typescript
describe('関数名', () => {
  it('should [期待される動作の説明]', () => {
    // テスト実装
  });
});
```

## テストケース設計方針

### ケース数の最小化
- 代表的なケースのみをテスト対象とする
- `savePutCountGameState`の場合: 2つのケースで十分
  1. gameStateが存在しない場合（新規作成）
  2. gameStateが存在する場合（更新）

### モックデータの作成
- `new GameEntity()` / `new GameStateEntity()`を使用
- 必要最小限のプロパティのみを設定
- テストに関係ないプロパティは省略

## 型安全性への対応

### 型ガード使用パターン（推奨）
```typescript
const state = result.gameStates[0]?.state;

expect(state?.type).toBe(StateType.PUT_SOUL_COUNT);

if (state?.type === StateType.PUT_SOUL_COUNT) {
  expect(state.data.gameUserId).toBe(1);
  expect(state.data.value).toBe(1);
}
```

### 型アサーション使用パターン（非推奨）
```typescript
expect((result.gameStates[0]?.state.data as { gameUserId: number; value: number }).gameUserId).toBe(1);
```

### 推奨理由
- 型ガードを使用することでTypeScriptの型システムを活用
- `as`による型アサーションを避け、より安全で読みやすいコード
- 条件分岐内で型が自動的に絞り込まれる

## アサーション戦略

### 段階的検証
1. 配列の長さ確認: `expect(result.gameStates).toHaveLength(1)`
2. 型の確認: `expect(result.gameStates[0]?.state.type).toBe(StateType.PUT_SOUL_COUNT)`
3. データの確認: プロパティごとに個別検証

### 値の検証
- 初期化の場合: `value: 1`を期待
- インクリメントの場合: 元の値 + 1を期待

## 参考実装との整合性

### 既存テストとの統一
- `putSoulGameCard.spec.ts`と同様の構造を踏襲
- インポート文の順序を統一
- describeブロックの命名規則を統一

### コードスタイル
- 日本語でのコメントは避ける（テスト説明文は英語）
- 簡潔で読みやすい実装を心がける

## 今後の適用指針

### 新しいテストファイル作成時
1. 既存の参考実装を確認
2. テストケースを最小限に絞る
3. 型ガードを活用した型安全な実装
4. このガイドラインに従った構造で実装

### 注意点
- 過度に複雑なテストケースは避ける
- エッジケースよりも基本動作の確認を優先
- 型エラーが発生した場合は型ガードを優先し、型アサーション（`as`）は最終手段として使用
- ユニオン型を扱う際は条件分岐による型の絞り込みを活用