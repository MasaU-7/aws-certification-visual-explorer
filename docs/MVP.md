# MVP 範囲

## 対象資格

**AWS Certified Solutions Architect – Associate (SAA-C03)** のみ

## MVP に含めるサービス

- VPC / EC2 / ELB(ALB) / Auto Scaling
- S3 / RDS / DynamoDB
- IAM / CloudFront / Route 53
- Lambda / SQS / SNS / CloudWatch

## MVP 画面

1. **トップ: AWS World** — カテゴリ球 + 関係線、SAA 範囲が点灯
2. **カテゴリ選択** — 配下サービスが周囲に出現
3. **サービス選択** — 関係先・シナリオをインスペクタ表示（文章説明は出さない）
4. **モード切替 UI** — Explore のみ動作、Scenario / Architecture はプレースホルダ

## MVP 非機能

| 項目 | 方針 |
|------|------|
| コスト | 完全無料（静的ホスティング + リポジトリのみ） |
| 認証 | なし |
| データ | リポジトリ内 TypeScript / JSON |
| セキュア | 秘密情報ゼロ、依存最小、HTTPS 配信のみ |
| 対応ブラウザ | 最新 Chrome / Edge / Firefox / Safari |

## フェーズ計画

| Phase | 内容 | 状態 |
|-------|------|------|
| 1 | AWS World + SAA フィルター | MVP |
| 2 | サービス同士の関係可視化強化 | 次 |
| 3 | VPC / SG 等の3D領域表現 | VPC City（AZ / Public / Private） |
| 4 | 通信・イベントアニメーション | 次 |
| 5 | Scenario Mode | 次 |
| 6 | SAA Exam Guide 対応の明示 / 図集 | 次 |

## 成功条件（MVP）

- ユーザーが「SAA の範囲」をマップ上一目で把握できる
- 文章をほぼ読まずに、カテゴリ→サービス→関係の探索ができる
- `npm run build` で静的成果物ができ、無料ホストに載せられる
