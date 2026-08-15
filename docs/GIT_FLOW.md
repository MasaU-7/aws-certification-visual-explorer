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
6. **マージコミットを残す** — `develop` / `main` への取り込みは squash・rebase merge にしない

## マージ方針

ブランチ統合時は **Create a merge commit**（マージコミット）を使い、履歴を残す。

| やること | 理由 |
|----------|------|
| `feature/*` → `develop` は merge commit | feature の開始・完了が履歴に残る |
| `release/*` → `main` / `develop` も merge commit | リリース単位を追いやすい |
| Squash merge は使わない | コミット粒度と「なぜ」が失われる |
| Rebase merge は使わない | ブランチ境界が履歴から消える |
| **`develop` → `main` の PR は作らない** | 本番反映は必ず `release/*` 経由 |

GitHub PR マージ時: **Merge pull request**（Create a merge commit）を選ぶ。

`main` へ反映するとき:

```bash
git checkout develop
git pull origin develop
git checkout -b release/0.1.0
# リリース向けの最終調整（バージョン表記など）
git push -u origin release/0.1.0
# PR: release/0.1.0 → main（merge commit）
# 同じ release ブランチを develop にも merge してタグ・差分を揃える
```

```text
*   merge: feature/xxx into develop
|\
| * feat: ...
| * fix: ...
|/
* previous develop
```

## 初期セットアップ後の作業例

```bash
git checkout develop
git checkout -b feature/vpc-city-view
# ... work ...
git push -u origin HEAD
# PR: feature/vpc-city-view → develop
```
