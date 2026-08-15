import type { ScenarioDefinition } from '@/types/aws'

/** MVP scenarios — architecture as learning outcome */
export const scenarios: ScenarioDefinition[] = [
  {
    id: 'web-application',
    title: '大量アクセスに耐える Web サービス',
    goal: 'ALB → EC2(+ASG) → RDS を Multi-AZ で組み立てる',
    requiredServices: ['cloudfront', 'elb', 'ec2', 'autoscaling', 'rds', 's3'],
    certifications: ['SAA-C03'],
  },
  {
    id: 'static-site',
    title: '静的サイトを世界へ配信',
    goal: 'S3 + CloudFront の流れを体感する',
    requiredServices: ['s3', 'cloudfront', 'route53'],
    certifications: ['SAA-C03'],
  },
  {
    id: 'event-driven',
    title: 'イベント駆動で処理をつなぐ',
    goal: 'SNS / SQS / Lambda の非同期の流れを見る',
    requiredServices: ['sns', 'sqs', 'lambda', 'dynamodb'],
    certifications: ['SAA-C03'],
  },
  {
    id: 'hybrid-network',
    title: 'オンプレと AWS をつなぐ',
    goal: 'DX / VPN / TGW の置き場所を見る',
    requiredServices: ['direct-connect', 'site-to-site-vpn', 'transit-gateway', 'vpc'],
    certifications: ['SAA-C03'],
  },
  {
    id: 'storage-choice',
    title: 'データの置き場を選ぶ',
    goal: 'S3 / EBS / EFS / FSx の役割の違いを位置で見る',
    requiredServices: ['s3', 'ebs', 'efs', 'fsx'],
    certifications: ['SAA-C03'],
  },
  {
    id: 'edge-performance',
    title: '世界中からの入口',
    goal: 'CloudFront と Global Accelerator の違いを線で見る',
    requiredServices: ['cloudfront', 'global-accelerator', 'route53', 'elb'],
    certifications: ['SAA-C03'],
  },
  {
    id: 'secure-edge',
    title: 'エッジで止める',
    goal: 'WAF / Shield / ACM が配信の手前にいることを見る',
    requiredServices: ['waf', 'shield', 'acm', 'cloudfront'],
    certifications: ['SAA-C03'],
  },
  {
    id: 'analytics-path',
    title: '溜めて・流して・見る',
    goal: 'Kinesis → S3 → Athena / Redshift の経路',
    requiredServices: ['kinesis', 's3', 'athena', 'redshift', 'quicksight'],
    certifications: ['SAA-C03'],
  },
  {
    id: 'data-choice',
    title: '用途で DB を選ぶ',
    goal: 'グラフ / ドキュメント / 時系列の置き場',
    requiredServices: ['neptune', 'documentdb', 'timestream', 'keyspaces'],
    certifications: ['SAA-C03'],
  },
  {
    id: 'cost-control',
    title: 'コストの上限を置く',
    goal: 'Explorer で見て Budgets で止める',
    requiredServices: ['cost-explorer', 'budgets'],
    certifications: ['SAA-C03'],
  },
]
