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
    { id: 'in-net', from: 'internet', to: 'igw', role: 'ingress' },
    { id: 'in-a', from: 'igw', to: 'alb-a', role: 'ingress' },
    { id: 'in-b', from: 'igw', to: 'alb-b', role: 'ingress' },
    { id: 'app-ec2-a', from: 'alb-a', to: 'ec2-a', role: 'app' },
    { id: 'app-ec2-b', from: 'alb-b', to: 'ec2-b', role: 'app' },
    { id: 'app-ecs-a', from: 'alb-a', to: 'ecs-a', role: 'app' },
    { id: 'app-ecs-b', from: 'alb-b', to: 'ecs-b', role: 'app' },
    { id: 'app-lambda-a', from: 'alb-a', to: 'lambda', role: 'app' },
    { id: 'app-lambda-b', from: 'alb-b', to: 'lambda', role: 'app' },
    { id: 'cw-scale', from: 'cloudwatch', to: 'asg', role: 'scale' },
    { id: 'scale-alb-a', from: 'asg', to: 'alb-a', role: 'scale' },
    { id: 'scale-alb-b', from: 'asg', to: 'alb-b', role: 'scale' },
    { id: 'scale-a', from: 'asg', to: 'ec2-a', role: 'scale' },
    { id: 'scale-b', from: 'asg', to: 'ec2-b', role: 'scale' },
    { id: 'ecs-on-a', from: 'ecs-a', to: 'ec2-a', role: 'app' },
    { id: 'ecs-on-b', from: 'ecs-b', to: 'ec2-b', role: 'app' },
    { id: 'batch-launch-a', from: 'batch', to: 'batch-a', role: 'scale' },
    { id: 'batch-launch-b', from: 'batch', to: 'batch-b', role: 'scale' },
    { id: 'batch-ec2-a', from: 'batch-a', to: 'ec2-a', role: 'app' },
    { id: 'batch-ec2-b', from: 'batch-b', to: 'ec2-b', role: 'app' },
    { id: 'batch-ecs-a', from: 'batch-a', to: 'ecs-a', role: 'app' },
    { id: 'batch-ecs-b', from: 'batch-b', to: 'ecs-b', role: 'app' },
    { id: 'batch-s3-a', from: 'batch-a', to: 's3', role: 'data' },
    { id: 'batch-s3-b', from: 'batch-b', to: 's3', role: 'data' },
    { id: 'event-s3', from: 's3', to: 'lambda', role: 'event' },
    { id: 'event-sqs', from: 'sqs', to: 'lambda', role: 'event' },
    { id: 'event-cw', from: 'cloudwatch', to: 'lambda', role: 'event' },
    { id: 'data-ddb', from: 'lambda', to: 'dynamodb', role: 'data' },
    { id: 'lambda-in-vpc', from: 'lambda', to: 'lambda-vpc', role: 'app' },
    { id: 'out-ec2-a', from: 'ec2-a', to: 'nat-a', role: 'egress' },
    { id: 'out-ec2-b', from: 'ec2-b', to: 'nat-b', role: 'egress' },
    { id: 'out-ecs-a', from: 'ecs-a', to: 'nat-a', role: 'egress' },
    { id: 'out-ecs-b', from: 'ecs-b', to: 'nat-b', role: 'egress' },
    { id: 'out-batch-a', from: 'batch-a', to: 'nat-a', role: 'egress' },
    { id: 'out-batch-b', from: 'batch-b', to: 'nat-b', role: 'egress' },
    { id: 'out-lambda-vpc', from: 'lambda-vpc', to: 'nat-a', role: 'egress' },
    { id: 'out-igw-a', from: 'nat-a', to: 'igw', role: 'egress' },
    { id: 'out-igw-b', from: 'nat-b', to: 'igw', role: 'egress' },
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
