import { cityLink as L } from '@/data/cityLink'
import type { VpcCityDefinition } from '@/types/aws'

const INTEGRATION_CITY_SERVICES = new Set(['sqs', 'sns', 'step-functions', 'ses'])

/**
 * SAA の Integration を 1 画面に置く。
 * SNS / SQS / Step Functions / SES / Lambda は VPC 外（Bus）。
 * SNS は fan-out（SQS / Lambda / SES）。SQS は pull。
 * Step Functions は Lambda / ECS / Batch / SQS / SNS を順に動かす。
 * SES は Internet へメール。EC2 は NAT 経由で Bus へ publish。
 */
export const integrationCity: VpcCityDefinition = {
  id: 'saa-integration-city',
  azs: ['az-a', 'az-b'],
  occupants: [
    { id: 'internet', kind: 'internet', label: 'Internet', az: null, tier: null },
    { id: 'igw', kind: 'igw', label: 'IGW', az: null, tier: null },
    { id: 'sns', kind: 'service', label: 'SNS', az: null, tier: null, serviceId: 'sns' },
    { id: 'sqs', kind: 'service', label: 'SQS', az: null, tier: null, serviceId: 'sqs' },
    { id: 'ses', kind: 'service', label: 'SES', az: null, tier: null, serviceId: 'ses' },
    { id: 'sfn', kind: 'service', label: 'Step Functions', az: null, tier: null, serviceId: 'step-functions' },
    { id: 'lambda', kind: 'service', label: 'Lambda', az: null, tier: null, serviceId: 'lambda' },
    { id: 'dynamodb', kind: 'service', label: 'DynamoDB', az: null, tier: null, serviceId: 'dynamodb' },
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
  ],
  flows: [
    L('in-net', 'internet', 'igw', 'ingress'),
    L('in-a', 'igw', 'alb-a', 'ingress'),
    L('in-b', 'igw', 'alb-b', 'ingress'),
    L('app-a', 'alb-a', 'ec2-a', 'app'),
    L('app-b', 'alb-b', 'ec2-b', 'app'),
    L('app-ecs-a', 'alb-a', 'ecs-a', 'app'),
    L('app-ecs-b', 'alb-b', 'ecs-b', 'app'),
    L('pub-a', 'ec2-a', 'sns', 'event'),
    L('pub-b', 'ec2-b', 'sns', 'event'),
    L('fan-sqs', 'sns', 'sqs', 'event'),
    L('fan-lambda', 'sns', 'lambda', 'event'),
    L('fan-ses', 'sns', 'ses', 'event'),
    L('mail', 'ses', 'internet', 'egress', 'path', 'fwd', 'internet'),
    L('poll-lambda', 'sqs', 'lambda', 'event'),
    L('poll-ecs-a', 'sqs', 'ecs-a', 'event'),
    L('poll-ecs-b', 'sqs', 'ecs-b', 'event'),
    L('lambda-ddb', 'lambda', 'dynamodb', 'data', 'access'),
    L('sfn-lambda', 'sfn', 'lambda', 'app'),
    L('sfn-sqs', 'sfn', 'sqs', 'event'),
    L('sfn-sns', 'sfn', 'sns', 'event'),
    L('sfn-ecs-a', 'sfn', 'ecs-a', 'app'),
    L('sfn-ecs-b', 'sfn', 'ecs-b', 'app'),
    L('sfn-batch', 'sfn', 'batch', 'app'),
    L('batch-launch-a', 'batch', 'batch-a', 'scale'),
    L('batch-launch-b', 'batch', 'batch-b', 'scale'),
    L('out-a', 'ec2-a', 'nat-a', 'egress'),
    L('out-b', 'ec2-b', 'nat-b', 'egress'),
    L('out-ecs-a', 'ecs-a', 'nat-a', 'egress'),
    L('out-ecs-b', 'ecs-b', 'nat-b', 'egress'),
    L('out-batch-a', 'batch-a', 'nat-a', 'egress'),
    L('out-batch-b', 'batch-b', 'nat-b', 'egress'),
    L('out-igw-a', 'nat-a', 'igw', 'egress'),
    L('out-igw-b', 'nat-b', 'igw', 'egress'),
  ],
}

export function getIntegrationOccupant(id: string) {
  return integrationCity.occupants.find((o) => o.id === id)
}

export function isIntegrationCityEntry(serviceId: string) {
  return INTEGRATION_CITY_SERVICES.has(serviceId)
}

export function isIntegrationCityService(serviceId: string) {
  return isIntegrationCityEntry(serviceId) || integrationCity.occupants.some((o) => o.serviceId === serviceId)
}

export function getIntegrationPrimaryOccupantId(serviceId: string | null) {
  if (!serviceId) return null
  return integrationCity.occupants.find((o) => o.serviceId === serviceId)?.id ?? null
}
