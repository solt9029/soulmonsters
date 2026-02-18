# 概要
- 変数名やメソッド名から自明な内容はコードコメントとして残さないでください。
- `.env`などの機密情報が書かれたファイルは絶対に読み込まないでください。
- 大きい作業内容がある場合、分割してAIタスク実行したいです。適宜docsディレクトリの中に設計や実装タスクをまとめたmarkdownファイルを作成して、次のAIタスクが途中経過を把握できるようにしてください。
- 指定がない限りnpmではなくyarnを使用してください。
- Specの実装をする時は、必ずSpecを実行して成功することを確認してください。
- 実装作業を完了する前に、`yarn format`などのコードフォーマットを必ず実行してください。
  - serverのテスト: `yarn workspace soulmonsters-server test`
  - serverのフォーマット: `yarn workspace soulmonsters-server format`
  - clientのフォーマット: `yarn workspace soulmonsters-client format`
- 実装作業を完了する前に、`yarn build`などを実行して必ずビルドが通ることを確認してください。
- GraphQLのスキーマを編集した場合、ルートディレクトリで以下のコマンドを実行すればclient, serverの両方の型ファイルが自動生成されます。
  - `yarn generate-graphql-types`

# ドメイン知識
- **gameCardとcardの区別**: gameCardとcardは明確に異なる存在です。gameCardのことをcardと省略しないでください。
  - Card: カードのマスターデータ（テンプレート）。カード自体の基本情報（名前、種類、攻撃力、防御力など）
  - GameCard: ゲーム中の実際のカードインスタンス。Cardの情報を持ちつつ、ゲーム状態（ゾーン、位置、バトルポジションなど）を持つ
- **Effect型のGameCardIdフィールド命名規約**: 効果の対象をいつ決定するかによって命名を使い分けてください。
  - `targetGameCardId`: 効果の発動時にプレイヤーが対象を選ぶもの（例: SOUL_CANON, NATSUKASHINORUDE_POWER_DOWN）
  - `selectedGameCardId`: 効果の解決時にプレイヤーが対象を選ぶもの（例: HAMONTAKI_SPECIAL_SUMMON）

# server
- importは相対パスではなく絶対パスを使用してください。
- `as any`は使わないでください。できる限り正しい型を定義・指定してください。
- specの新規作成や大幅な修正はserver-spec-implementerに任せてください。リネームや軽微な修正は直接行って構いません。

# client
- 現状特にルールなし。必要に応じてREADMEを呼んだり、既存実装を真似しながら実装してください。
