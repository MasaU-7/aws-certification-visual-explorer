# AWS Certification Visual Explorer

> AWSを読むのではなく、動かして理解する。

資格範囲を巨大な視覚モデルとして探索するフロントエンドアプリです。  
**MVP は SAA-C03 のみ。** バックエンドなし・ログインなし・完全無料運用を前提とします。

## クイックスタート

```bash
npm install
npm run dev
```

## ドキュメント

| 文書 | 内容 |
|------|------|
| [docs/FEATURES.md](docs/FEATURES.md) | 欲しい機能一覧 |
| [docs/MVP.md](docs/MVP.md) | MVP 範囲とフェーズ |
| [docs/TECH_STACK.md](docs/TECH_STACK.md) | 技術スタック |
| [docs/SOURCE_STRUCTURE.md](docs/SOURCE_STRUCTURE.md) | ソース構成 |
| [docs/GIT_FLOW.md](docs/GIT_FLOW.md) | Git Flow |

## 技術概要

- React + TypeScript + Vite
- React Three Fiber / Three.js
- Zustand
- 静的ホスティング（GitHub Pages 想定）
- アイコン: [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/)（`aws-react-icons` 経由）

## ブランチ

- `main` — 本番相当
- `develop` — 統合
- `feature/*` — 機能開発

## ライセンス

個人学習プロジェクト。AWS は Amazon Web Services, Inc. の商標です。本プロジェクトは AWS 非公式です。
