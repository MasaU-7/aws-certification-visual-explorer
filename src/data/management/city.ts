import { cityLink as L } from '@/data/cityLink'
import type { VpcCityDefinition } from '@/types/aws'

const MANAGEMENT_CITY_SERVICES = new Set([
  'cloudwatch',
  'cloudtrail',
  'config',
  'cloudformation',
  'systems-manager',
  'cost-explorer',
  'budgets',
])

/**
 * SAA の Management を 1 画面に置く。
 * Ops はリージョンサービス。観測対象の VPC は 1 AZ で足りる。
 * CloudWatch はメトリクスとアラーム。Trail / Config は S3 へ残す。
 * SSM Session は Internet→SSM→EC2。Budgets は SNS。
 */
export const managementCity: VpcCityDefinition = {
  id: 'saa-management-city',
  azs: ['az-a'],
  occupants: [
    { id: 'internet', kind: 'internet', label: 'Internet', az: null, tier: null },
    { id: 'igw', kind: 'igw', label: 'IGW', az: null, tier: null },
    { id: 'cloudwatch', kind: 'service', label: 'CloudWatch', az: null, tier: null, serviceId: 'cloudwatch' },
    { id: 'asg', kind: 'service', label: 'Auto Scaling', az: null, tier: null, serviceId: 'autoscaling' },
    { id: 'cloudtrail', kind: 'service', label: 'CloudTrail', az: null, tier: null, serviceId: 'cloudtrail' },
    { id: 'config', kind: 'service', label: 'Config', az: null, tier: null, serviceId: 'config' },
    { id: 's3', kind: 'service', label: 'S3', az: null, tier: null, serviceId: 's3' },
    { id: 'cfn', kind: 'service', label: 'CloudFormation', az: null, tier: null, serviceId: 'cloudformation' },
    { id: 'ssm', kind: 'service', label: 'Systems Manager', az: null, tier: null, serviceId: 'systems-manager' },
    { id: 'sns', kind: 'service', label: 'SNS', az: null, tier: null, serviceId: 'sns' },
    { id: 'cost-explorer', kind: 'service', label: 'Cost Explorer', az: null, tier: null, serviceId: 'cost-explorer' },
    { id: 'budgets', kind: 'service', label: 'Budgets', az: null, tier: null, serviceId: 'budgets' },
    { id: 'alb-a', kind: 'service', label: 'ALB', az: 'az-a', tier: 'public', serviceId: 'elb' },
    { id: 'nat-a', kind: 'nat', label: 'NAT', az: 'az-a', tier: 'public' },
    { id: 'ec2-a', kind: 'service', label: 'EC2', az: 'az-a', tier: 'private', serviceId: 'ec2' },
  ],
  flows: [
    L('in-net', 'internet', 'igw', 'ingress'),
    L('in-a', 'igw', 'alb-a', 'ingress'),
    L('app-a', 'alb-a', 'ec2-a', 'app'),
    L('cw-alb-a', 'alb-a', 'cloudwatch', 'event'),
    L('cw-ec2-a', 'ec2-a', 'cloudwatch', 'event'),
    L('cw-asg', 'cloudwatch', 'asg', 'scale', 'access'),
    L('scale-alb-a', 'asg', 'alb-a', 'scale', 'attach', 'none'),
    L('scale-a', 'asg', 'ec2-a', 'scale', 'attach', 'none'),
    L('cw-sns', 'cloudwatch', 'sns', 'event'),
    L('cw-trail', 'cloudtrail', 'cloudwatch', 'event'),
    L('trail-s3', 'cloudtrail', 's3', 'data', 'access'),
    L('config-s3', 'config', 's3', 'data', 'access'),
    L('trail-config', 'cloudtrail', 'config', 'event'),
    L('cfn-config', 'cfn', 'config', 'app', 'associate', 'none'),
    L('cfn-asg', 'cfn', 'asg', 'scale'),
    L('cfn-ec2-a', 'cfn', 'ec2-a', 'scale'),
    L('ssm-in', 'internet', 'ssm', 'ingress', 'path', 'fwd', 'internet'),
    L('ssm-ec2-a', 'ssm', 'ec2-a', 'app', 'access'),
    L('param-a', 'ec2-a', 'ssm', 'data', 'access'),
    L('ssm-cw', 'ssm', 'cloudwatch', 'event'),
    L('ce-budgets', 'cost-explorer', 'budgets', 'app', 'associate', 'none'),
    L('budgets-sns', 'budgets', 'sns', 'event'),
    L('out-a', 'ec2-a', 'nat-a', 'egress'),
    L('out-igw-a', 'nat-a', 'igw', 'egress'),
  ],
}

export function getManagementOccupant(id: string) {
  return managementCity.occupants.find((o) => o.id === id)
}

export function isManagementCityEntry(serviceId: string) {
  return MANAGEMENT_CITY_SERVICES.has(serviceId)
}

export function isManagementCityService(serviceId: string) {
  return isManagementCityEntry(serviceId) || managementCity.occupants.some((o) => o.serviceId === serviceId)
}

export function getManagementPrimaryOccupantId(serviceId: string | null) {
  if (!serviceId) return null
  return managementCity.occupants.find((o) => o.serviceId === serviceId)?.id ?? null
}
