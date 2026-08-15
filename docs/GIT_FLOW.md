# Git Flow

## ブランチ

| ブランチ | 用途 |
|----------|------|
| `main` | 本番相当（デプロイ可能） |
| `develop` | 統合ブランチ（日々の開発の受け皿） |
| `feature/*` | 機能開発 |
| `release/*` | リリース準備 |
| `hotfix/*` | `main` の緊急修正 |

## 基本フロー

```text
main
  └── develop
        └── feature/xxx  →  develop へ merge
              └── release/x.y.z → main + develop へ merge
```

## ルール

1. `main` / `develop` へ直接コミットしない（緊急 hotfix を除く）
2. feature は `develop` から切る
3. PR は小さく、1 PR = 1 意図
4. 秘密情報・個人データをコミットしない
5. コミットメッセージは「なぜ」を短く（日本語可）

## 初期セットアップ後の作業例

```bash
git checkout develop
git checkout -b feature/vpc-city-view
# ... work ...
git push -u origin HEAD
# PR: feature/vpc-city-view → develop
```
