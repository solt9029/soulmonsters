# チェーン対応リファクタリングTODO

チェーンシステムの設計詳細は `docs/20260123-chain.md` を参照。

`effectRuteruteDraw`で実装済みのパターンを他のアクションハンドラーにも適用する。

## パターン

- **Action Handler**: コスト処理 + GameChain/GameChainLink生成
- **Chain Resolver**: 効果処理 + GameChainLinkをRESOLVEDに変更

## 対象ハンドラー

### 1. effectNatsukashinorudePowerDown
- コスト: `subtractUserEnergy(2)`
- 効果: GameState(EFFECT_NATSUKASHINORUDE_POWER_DOWN)を生成し、対象モンスターの攻撃力を700下げる
- payload: `{ gameCard, targetGameCard }`

### 2. effectSupernewvoltsDestroyMonster
- コスト: なし
- 効果: デッキトップをモルグへ + 対象モンスターをモルグへ + 効果使用回数GameState保存
- payload: `{ gameCard, targetGameCard }`

### 3. effectEmeraldEnergyIncrease
- コスト: なし
- 効果: エナジー+1 + 効果使用回数GameState保存
- payload: `{ gameCard }`

### 4. effectFreshFishDraw
- コスト: `subtractUserEnergy(3)`
- 効果: 2枚ドロー + 効果使用回数GameState保存
- payload: `{ gameCard }`

### 5. effectSpeedDragonBirdChangePosition
- コスト: `moveCostGameCardsToMorgue`
- 効果: 対象モンスターのバトルポジション変更
- payload: `{ gameCard, costGameCards, targetGameCard }`

### 6. useSoulCanon
- コスト: `moveCostGameCardsToMorgue`
- 効果: 対象GameCardをモルグへ移動
- payload: `{ costGameCards, targetGameCard }`

## 対象外ハンドラー（チェーンブロックを作らない）

- `finishEndTime` / `startBattleTime` / `startDrawTime` / `startEndTime` / `startEnergyTime` / `startPutTime` / `startSomethingTime` — フェーズ遷移
- `putSoul` — ソウル配置
- `attack` — 攻撃処理（ダメージ計算含む）
- `summonMonster` — 召喚処理
- `changeBattlePosition` — バトルポジション変更

## 各ハンドラーでの作業手順

1. EffectTypeをGraphQLスキーマに追加（未追加の場合）
2. Action Handlerをコスト処理 + GameChain/GameChainLink生成のみに変更
3. `server/src/game/chains/resolvers/` に個別resolver関数を作成
4. `ChainResolver.resolveChainLink`のswitchに新しいEffectTypeを追加
5. Specを作成・実行して動作確認
6. `yarn workspace soulmonsters-server format` を実行
