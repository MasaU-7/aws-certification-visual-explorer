import { cityLink as L } from '@/data/cityLink'
import type { VpcCityDefinition } from '@/types/aws'

const COMPUTE_CITY_SERVICES = new Set(['ec2', 'lambda', 'autoscaling', 'ecs', 'batch'])

/**
 * Compute の置き場所を 1 画面に置く。
 * EC2 / ECS / Batch ワーカーは VPC 内。
 * Auto Scaling は ALB 配下の EC2 を増減（きっかけは CloudWatch）。
 * Lambda は既定で VPC 外。Private に置くと VPC 内の相手へ届く。
 * Batch は EC2 でも ECS でも走らせ、成果は S3。
 */
export const computeCity: VpcCityDefinition = {
  id: 'saa-compute-city',
  azs: ['az-a', 'az-b'],
  occupants: [
    { id: 'internet', kind: 'internet', label: 'Internet', az: null, tier: null },
    { id: 'igw', kind: 'igw', label: 'IGW', az: null, tier: null },
    { id: 'cloudwatch', kind: 'service', label: 'CloudWatch', az: null, tier: null, serviceId: 'cloudwatch' },
    { id: 's3', kind: 'service', label: 'S3', az: null, tier: null, serviceId: 's3' },
    { id: 'sqs', kind: 'service', label: 'SQS', az: null, tier: null, serviceId: 'sqs' },
    { id: 'dynamodb', kind: 'service', label: 'DynamoDB', az: null, tier: null, serviceId: 'dynamodb' },
    { id: 'lambda', kind: 'service', label: 'Lambda', az: null, tier: null, serviceId: 'lambda' },
    { id: 'asg', kind: 'service', label: 'Auto Scaling', az: null, tier: null, serviceId: 'autoscaling' },
    { id: 'batch', kind: 'service', label: 'Batch', az: null, tier: null, serviceId: 'batch' },
    { id: 'alb-a', kind: 'service', label: 'ALB', az: 'az-a', tier: 'public', serviceId: 'elb' },
    { id: 'alb-b', kind: 'service', label: 'ALB', az: 'az-b', tier: 'public', serviceId: 'elb' },
    { id: 'nat-a', kind: 'nat', label: 'NAT', az: 'az-a', tier: 'public' },
    { id: 'nat-b', kind: 'nat', label: 'NAT', az: 'az-b', tier: 'public' },
    { id: 'ec2-a', kind: 'service', label: 'EC2', az: 'az-a', tier: 'private', serviceId: 'ec2' },
    { id: 'ec2-b', kind: 'service', label: 'EC2', az: 'az-b', tier: 'private', serviceId: 'ec2' },
    { id: 'ecs-a', kind: 'service', label: 'ECS', az: 'az-a', tier: 'private', serviceId: 'ecs' },
    { id: 'ecs-b', kind: 'service', label: 'ECS', az: 'az-b', tier: 'private', serviceId: 'ecs' },
    { id: 'batch-a', kind: 'service', label: 'Batch', az: 'az-a', tier: 'private', serviceId: 'batch' },
    { id: 'batch-b', kind: 'service', label: 'Batch', az: 'az-b', tier: 'private', serviceId: 'batch' },
    { id: 'lambda-vpc', kind: 'service', label: 'Lambda', az: 'az-a', tier: 'private', serviceId: 'lambda' },
  ],
  flows: [
    L('in-net', 'internet', 'igw', 'ingress'),
    L('in-a', 'igw', 'alb-a', 'ingress'),
    L('in-b', 'igw', 'alb-b', 'ingress'),
    L('app-ec2-a', 'alb-a', 'ec2-a', 'app'),
    L('app-ec2-b', 'alb-b', 'ec2-b', 'app'),
    L('app-ecs-a', 'alb-a', 'ecs-a', 'app'),
    L('app-ecs-b', 'alb-b', 'ecs-b', 'app'),
    L('app-lambda-a', 'alb-a', 'lambda', 'app'),
    L('app-lambda-b', 'alb-b', 'lambda', 'app'),
    L('cw-scale', 'cloudwatch', 'asg', 'scale', 'access'),
    L('scale-alb-a', 'asg', 'alb-a', 'scale', 'attach', 'none'),
    L('scale-alb-b', 'asg', 'alb-b', 'scale', 'attach', 'none'),
    L('scale-a', 'asg', 'ec2-a', 'scale', 'attach', 'none'),
    L('scale-b', 'asg', 'ec2-b', 'scale', 'attach', 'none'),
    L('ecs-on-a', 'ecs-a', 'ec2-a', 'app', 'attach', 'none'),
    L('ecs-on-b', 'ecs-b', 'ec2-b', 'app', 'attach', 'none'),
    L('batch-launch-a', 'batch', 'batch-a', 'scale'),
    L('batch-launch-b', 'batch', 'batch-b', 'scale'),
    L('batch-ec2-a', 'batch-a', 'ec2-a', 'app', 'attach', 'none'),
    L('batch-ec2-b', 'batch-b', 'ec2-b', 'app', 'attach', 'none'),
    L('batch-ecs-a', 'batch-a', 'ecs-a', 'app', 'attach', 'none'),
    L('batch-ecs-b', 'batch-b', 'ecs-b', 'app', 'attach', 'none'),
    L('batch-s3-a', 'batch-a', 's3', 'data', 'access'),
    L('batch-s3-b', 'batch-b', 's3', 'data', 'access'),
    L('event-s3', 's3', 'lambda', 'event'),
    L('event-sqs', 'sqs', 'lambda', 'event'),
    L('event-cw', 'cloudwatch', 'lambda', 'event'),
    L('data-ddb', 'lambda', 'dynamodb', 'data', 'access'),
    L('lambda-in-vpc', 'lambda', 'lambda-vpc', 'app', 'attach', 'none'),
    L('out-ec2-a', 'ec2-a', 'nat-a', 'egress'),
    L('out-ec2-b', 'ec2-b', 'nat-b', 'egress'),
    L('out-ecs-a', 'ecs-a', 'nat-a', 'egress'),
    L('out-ecs-b', 'ecs-b', 'nat-b', 'egress'),
    L('out-batch-a', 'batch-a', 'nat-a', 'egress'),
    L('out-batch-b', 'batch-b', 'nat-b', 'egress'),
    L('out-lambda-vpc', 'lambda-vpc', 'nat-a', 'egress'),
    L('out-igw-a', 'nat-a', 'igw', 'egress'),
    L('out-igw-b', 'nat-b', 'igw', 'egress'),
  ],
}

export function getComputeOccupant(id: string) {
  return computeCity.occupants.find((o) => o.id === id)
}

export function isComputeCityEntry(serviceId: string) {
  return COMPUTE_CITY_SERVICES.has(serviceId)
}

export function isComputeCityService(serviceId: string) {
  return isComputeCityEntry(serviceId) || computeCity.occupants.some((o) => o.serviceId === serviceId)
}

export function getComputePrimaryOccupantId(serviceId: string | null) {
  if (!serviceId) return null
  return computeCity.occupants.find((o) => o.serviceId === serviceId)?.id ?? null
}
