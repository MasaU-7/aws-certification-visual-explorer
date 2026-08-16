# MVP 範囲

## 対象資格

**AWS Certified Solutions Architect – Associate (SAA-C03)** のみ

## MVP に含めるサービス（AWS World）

SAA-C03 で構成の選択肢になるものをノードにする。リソースや廃止方向のものはノードにしない。

- Compute: EC2 / Lambda / Auto Scaling / ECS / Batch
- Networking: VPC / ELB / Route 53 / Direct Connect / Site-to-Site VPN / VPN GW / Client VPN / Direct Connect GW / Transit Gateway
- CDN / Edge: CloudFront / Global Accelerator
- Storage: S3 / EBS / EFS / FSx / Storage Gateway / Snowball / Transfer Family / DataSync
- Databases: RDS / Aurora / DynamoDB / Redshift / ElastiCache / MemoryDB / Neptune / DocumentDB / Keyspaces / Timestream
- Security: IAM / Organizations / IAM Identity Center / Directory Service / KMS / CloudHSM / ACM / Secrets Manager / GuardDuty / Security Hub / Macie / Inspector / Shield / WAF / Firewall Manager
- Integration: SQS / SNS / Step Functions / SES
- Analytics: EMR / Kinesis / Athena / QuickSight
- Management: CloudWatch / CloudTrail / Config / CloudFormation / Systems Manager / Cost Explorer / Budgets

### World に出さない（意図的）

| 対象 | 理由 | 代わり |
|------|------|--------|
| AMI | サービスではなく EC2 の作り方 | EC2 の concepts |
| AWS アカウント | 課金境界でありサービスではない | Organizations の concepts（multi-account） |
| SWF | Step Functions が代替。図鑑化を避ける | Step Functions |
| QLDB | 新規利用停止方向。専用 DB の並びを増やさない | Neptune 等の用途選択 |
| Data Pipeline | Glue / Athena / EMR 側へ寄っている | EMR / Athena / Kinesis |

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
| 3 | VPC / SG 等の3D領域表現 | Networking City（AZ / Public / Private） |
| 4 | 通信・イベントアニメーション | 次 |
| 5 | Scenario Mode | 次 |
| 6 | SAA Exam Guide 対応の明示 / 図集 | World 範囲を拡充。図集は次 |

## 成功条件（MVP）

- ユーザーが「SAA の範囲」をマップ上一目で把握できる
- 文章をほぼ読まずに、カテゴリ→サービス→関係の探索ができる
- `npm run build` で静的成果物ができ、無料ホストに載せられる
