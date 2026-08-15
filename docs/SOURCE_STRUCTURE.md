# プロジェクトソース構成

```text
aws-certification-visual-explorer/
├── .cursor/rules/          # AI / 開発ルール
├── .github/                # （将来）Pages / Actions
├── docs/                   # 仕様・計画（実装の正ではないが方針の正）
│   ├── FEATURES.md
│   ├── MVP.md
│   ├── TECH_STACK.md
│   └── SOURCE_STRUCTURE.md
├── public/                 # 静的アセット
├── src/
│   ├── components/         # DOM UI（バー・インスペクタ等）
│   │   └── layout/
│   ├── data/               # 学習データの単一ソース
│   │   ├── certifications/
│   │   ├── services/
│   │   ├── scenarios/
│   │   ├── vpc/
│   │   └── categories.ts
│   ├── scene/              # R3F / Three 空間
│   │   ├── nodes/
│   │   ├── edges/
│   │   ├── layout/
│   │   ├── vpc/
│   │   └── WorldScene.tsx
│   ├── store/              # Zustand
│   ├── styles/
│   ├── types/
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## レイヤ責務

| 層 | 責務 | 禁則 |
|----|------|------|
| `data/` | サービス・資格・シナリオ定義 | UI や Three 依存を書かない |
| `scene/` | 3D 表現・インタラクション | 長文説明 UI を埋め込まない |
| `components/` | シェル・フィルター・インスペクタ | 3D ロジックを肥大化させない |
| `store/` | 選択状態・モード | 永続化サーバを仮定しない |

## データ拡張の作法

新しいサービスを足すとき:

1. `src/data/services/` に定義を追加
2. `relationships` / `certifications` / `scenarios` を埋める
3. 必要なら `scene/nodes` に見た目を追加

→ マップ・フィルター・Scenario が同じ定義を参照する。
