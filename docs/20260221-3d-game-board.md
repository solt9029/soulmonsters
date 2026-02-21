# 3D ゲームボード実装ドキュメント

## 概要

`/games/:id` のゲーム画面を React Three Fiber (WebGL) を使った3D表示に置き換えた。
カードが実際のテーブルの上に置かれているように見える俯瞰視点のゲームボードを実現している。

---

## 技術スタック

| パッケージ | バージョン | 用途 |
|---|---|---|
| `@react-three/fiber` | ^9.x | React の JSX で Three.js を書けるようにするレンダラー |
| `@react-three/drei` | ^9.x | `useTexture` など便利なヘルパー集 |
| `three` | ^0.183.x | Three.js 本体 |
| `@types/three` | ^0.183.x | TypeScript 型定義 |

---

## ファイル構成

```
client/src/
├── hooks/
│   └── useGameCardClick.ts          # カードクリック処理フック（2D/3D共用）
└── components/game/
    ├── GameCardArea.tsx              # ゲームボード全体（3D Canvas + HTML オーバーレイ）
    └── three/
        ├── GameBoard3D.tsx           # Canvas ラッパー（カメラ・ライト・全ゾーン）
        ├── TableMesh.tsx             # テーブル面メッシュ
        ├── ZoneCards3D.tsx           # ゾーンごとのカード配置
        ├── ThreeGameCard.tsx         # 個別カードの 3D メッシュ
        └── ThreeGameCardStack.tsx    # Deck/Morgue のスタック表示
```

---

## 3D シーン設計

### カメラ

```
position: [0, 18, 20]
fov: 45
lookAt: [0, 0, 0]（デフォルト）
```

プレイヤー側の後方上空からテーブルを見下ろす視点。
`position[1]`（Y）を上げると視点が高くなり、`position[2]`（Z）を上げるとプレイヤー側に引く。

### ライティング

| 種類 | 設定 | 効果 |
|---|---|---|
| `ambientLight` | intensity 0.6 | 全体の基本明るさ |
| `directionalLight` | position [5,15,5], intensity 1.2 | メインライト（影を落とす） |
| `pointLight` | position [0,8,0], intensity 0.4, color #4466aa | 青みがかったフィルライト |

### ボード・ゾーン座標系

テーブル面は Y=0 の XZ 平面。

| Zone | 自分 (player) | 相手 (opponent) |
|---|---|---|
| Hand | [0, 0, 9.5] | [0, 0, -9.5] |
| Battle | [0, 0, 3.5] | [0, 0, -3.5] |
| Soul | [-4.5, 0, 6.5] | [4.5, 0, -6.5] |
| Morgue | [5.5, 0, 6.5] | [-5.5, 0, -6.5] |
| Deck | [5.5, 0, 3.5] | [-5.5, 0, -3.5] |

カード間隔: 1.6 units（`CARD_SPACING` 定数）

---

## カードのレンダリング詳細

### ジオメトリ

`boxGeometry args={[1.4, 0.02, 2.0]}`（width, thickness, height）

- CARD_W = 1.4（横幅）
- CARD_D = 0.02（厚さ）
- CARD_H = 2.0（縦の長さ）

### マテリアルインデックス（重要）

BoxGeometry のフェイス順序：

| Index | 面 | ローテーションなし（フラット）で向く方向 |
|---|---|---|
| 0 | +X | 右 |
| 1 | -X | 左 |
| **2** | **+Y** | **上（テーブル面から見える = フロントテクスチャ）** |
| **3** | **-Y** | **下（テーブル面に接する = バックテクスチャ）** |
| 4 | +Z | 奥（プレイヤー側から見て向こう） |
| 5 | -Z | 手前 |

### 回転ルール

#### フラットカード（Hand 以外: Battle, Soul）

```
rotation={[0, isDefence ? Math.PI / 2 : 0, 0]}
position.y = 0.025（BASE_Y_FLAT）
```

- Y 軸が上を向き、カード面（mat2）がカメラから見える
- Defence は Y 軸回転90度でカードを横向きに

#### 手札カード（Hand）

```
rotation={[Math.PI / 2, 0, 0]}
position.y = CARD_H / 2 = 1.0（カード中心がテーブル面から1.0上）
```

- X 軸+π/2 回転で local +Y → world +Z（カメラ方向）
- mat2 がカメラ方向（手前）を向き、フロントテクスチャが表示される

#### なぜ `rotation.x = -π/2` ではダメなのか

`-π/2` を使うと local +Y → world -Z（カメラと逆方向）になり、カードが縦向きに立つが、フロントテクスチャが裏側を向いてしまう。
`+π/2` を使うと local +Y → world +Z（カメラ方向）が正しく前を向く。

### ホバーアニメーション

フラットカードのみ適用。`useFrame` で Y 座標を lerp:

```ts
const targetY = hovered ? BASE_Y_FLAT + HOVER_FLOAT : BASE_Y_FLAT;
meshRef.current.position.y = THREE.MathUtils.lerp(current, targetY, 0.12);
```

`HOVER_FLOAT = 0.3`（浮き上がる高さ）、`0.12`（lerp 係数 = 速度）で調整可能。

### 選択状態

```ts
emissive: new THREE.Color(isSelected ? '#ff2200' : '#000000'),
emissiveIntensity: isSelected ? 0.5 : 0,
```

コスト/ターゲットとして選択されたカードは赤いエミッシブグローが付く。

---

## HTML オーバーレイ

3D Canvas の上に CSS `position: absolute` で重ねているもの:

- **上部**: 相手プレイヤー情報（`GameUser isYours={false}`）
- **下部**: 自分のプレイヤー情報（`GameUser isYours={true}`）
- **左上**: アクションアラート、エラーメッセージ

`pointer-events: none` を親に、`pointer-events: auto` を操作可能な要素に設定することで、
3D キャンバスへのマウスイベント（レイキャスト）とHTMLボタンの両立を実現している。

---

## よく修正するポイント

### カメラ視点を変えたい

[GameBoard3D.tsx](../client/src/components/game/three/GameBoard3D.tsx) の `camera` prop:

```tsx
camera={{ position: [0, 18, 20], fov: 45 }}
```

- `position[1]`（Y）↑ → より真上から見下ろす
- `position[2]`（Z）↑ → プレイヤー側に引く（ボードが小さく見える）
- `fov` ↑ → 視野角が広がる（魚眼レンズ的）

### ゾーンの位置を変えたい

[ZoneCards3D.tsx](../client/src/components/game/three/ZoneCards3D.tsx) の `ZONE_POSITIONS`:

```ts
const ZONE_POSITIONS: Record<ZoneKey, [number, number, number]> = {
  [`${Zone.Hand}_player`]: [0, 0, 7.5],
  ...
};
```

座標は `[X, Y, Z]`。テーブル面は Y=0 なので Y は基本 0 のまま。
X でゾーンの左右位置、Z でプレイヤー側/相手側の距離を調整。

### カード間隔を変えたい

[ZoneCards3D.tsx](../client/src/components/game/three/ZoneCards3D.tsx) の `CARD_SPACING = 1.6`

### カードサイズを変えたい

[ThreeGameCard.tsx](../client/src/components/game/three/ThreeGameCard.tsx) の定数:

```ts
const CARD_W = 1.4;   // 横幅
const CARD_H = 2.0;   // 縦の長さ
const CARD_D = 0.02;  // 厚さ
```

ThreeGameCardStack も同じ定数を持っているので合わせて変更する。

### ホバーの浮き上がり量・速度を変えたい

[ThreeGameCard.tsx](../client/src/components/game/three/ThreeGameCard.tsx):

```ts
const HOVER_FLOAT = 0.3;  // 浮き上がる高さ（3D units）
// lerp 係数（0.12）を上げると速く、下げると遅くなる
meshRef.current.position.y = THREE.MathUtils.lerp(current, targetY, 0.12);
```

### 選択時のグロー色・強度を変えたい

[ThreeGameCard.tsx](../client/src/components/game/three/ThreeGameCard.tsx):

```ts
emissive: new THREE.Color(isSelected ? '#ff2200' : '#000000'),
emissiveIntensity: isSelected ? 0.5 : 0,
```

`emissiveIntensity` を上げると光が強くなる。

### テーブルの色・材質を変えたい

[TableMesh.tsx](../client/src/components/game/three/TableMesh.tsx):

```tsx
<meshStandardMaterial color="#1a3a2a" roughness={0.9} metalness={0.05} />
```

- `color`: テーブルの色（現在はダークグリーンのフェルト）
- `roughness`: 0=鏡面, 1=完全拡散（マット）
- `metalness`: 0=非金属, 1=金属

### ライティングを変えたい

[GameBoard3D.tsx](../client/src/components/game/three/GameBoard3D.tsx):

```tsx
<ambientLight intensity={0.6} />
<directionalLight position={[5, 15, 5]} intensity={1.2} castShadow />
<pointLight position={[0, 8, 0]} intensity={0.4} color="#4466aa" />
```

`ambientLight` を上げると全体が明るくなる。
`directionalLight` の `position` でメインライトの方向が変わる。
`pointLight` の `color` でシーン全体の色味を変えられる。

### 新しいアクションステップでカードを選択可能にしたい

[useGameCardClick.ts](../client/src/hooks/useGameCardClick.ts) にロジックを追加する。
ゲーム操作のロジックは 2D/3D 共通でこのフックに集約されている。

---

## 既知の制約・注意点

- Three.js 本体が約490KB（gzip後）あるため、バンドルサイズ警告が出るが動作上は問題ない
- `useTexture` は URL をキーにキャッシュするため、同じ画像を複数カードが使っても1回しかロードされない
- カードテクスチャは Suspense でラップされており、ロード完了まではカードが非表示になる
- `pointer-events: none` のオーバーレイ内で HTML インタラクションを追加する場合は `pointer-events: auto` を忘れずに設定する
