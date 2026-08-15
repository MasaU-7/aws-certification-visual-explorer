# 技術スタック

## 決定

| 層 | 採用 | 理由 |
|----|------|------|
| UI | React 19 + TypeScript | コンポーネント分割と型安全 |
| バンドラ | Vite | 高速・静的出力が簡単 |
| 3D | Three.js + React Three Fiber + Drei | 3D表現の標準、React と親和 |
| 状態 | Zustand | 軽量、バックエンド不要に十分 |
| データ | `src/data/**` TypeScript | Git 管理・レビュー容易・無料 |
| アイコン | AWS Architecture Icons（`aws-react-icons`） | 公式セット準拠・無料利用可 |
| ホスト | GitHub Pages（または Cloudflare Pages） | 無料・CI なしでも可 |
| リポジトリ | GitHub + Git Flow | 無料・可視化・協働 |

## 採用しないもの

- Next.js / SSR（サーバー不要のため過剰）
- バックエンド / DB / Auth
- AWS 実リソース（コスト・権限・複雑性）
- 有料 CDN / 有料解析

## セキュリティ方針（無料 × セキュア）

1. 秘密情報をコードに置かない（`.env` はコミット禁止、そもそも不要を目指す）
2. 依存は最小限、定期的に `npm audit`
3. ユーザー入力を扱う機能は Scenario 導入時にサニタイズ前提で設計
4. 外部スクリプト・広告・トラッカーなし
5. デフォルトで静的アセットのみ配信（攻撃面が極小）

## ローカル開発

```bash
npm install
npm run dev
```

## デプロイ（GitHub Pages）

```bash
npm run deploy
```

`vite.config.ts` の `base: './'` により相対パスで Pages 配信可能。
