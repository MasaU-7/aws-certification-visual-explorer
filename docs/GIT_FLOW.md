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
        └── feature/xxx  →  develop へ merge（ローカル）
              └── release/x.y.z → main + develop へ merge（ローカル）
```

**プルリクエストは使わない。** ブランチを push したあと、ローカルで merge してから push する。

## ルール

1. `main` / `develop` へ直接コミットしない（緊急 hotfix を除く）
2. feature は `develop` から切る
3. 1 feature = 1 意図（ブランチとコミットを小さく保つ）
4. 秘密情報・個人データをコミットしない
5. コミットメッセージは「なぜ」を短く（日本語可）
6. **マージコミットを残す** — squash / rebase merge は使わない
7. **`develop` を `main` に直接マージしない** — `release/*` 経由のみ

## マージ方針

ブランチ統合はローカルで `git merge --no-ff` を使い、マージコミットを残す。

| やること | 理由 |
|----------|------|
| `feature/*` → `develop` は merge commit | feature の開始・完了が履歴に残る |
| `release/*` → `main` / `develop` も merge commit | リリース単位を追いやすい |
| Squash merge は使わない | コミット粒度と「なぜ」が失われる |
| Rebase merge は使わない | ブランチ境界が履歴から消える |

```text
*   merge: feature/xxx into develop
|\
| * feat: ...
| * fix: ...
|/
* previous develop
```

## 作業例

### feature を develop に取り込む

```bash
git checkout develop
git pull origin develop
git merge --no-ff feature/vpc-city-view
git push origin develop
```

### release を main に反映する

```bash
git checkout develop
git pull origin develop
git checkout -b release/0.1.0
# リリース向けの最終調整（バージョン表記など）
git checkout main
git pull origin main
git merge --no-ff release/0.1.0
git push origin main
git checkout develop
git merge --no-ff release/0.1.0
git push origin develop
```
