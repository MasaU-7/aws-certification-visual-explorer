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
]
