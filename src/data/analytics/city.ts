import { cityLink as L } from '@/data/cityLink'
import type { VpcCityDefinition } from '@/types/aws'

const ANALYTICS_CITY_SERVICES = new Set(['emr', 'kinesis', 'athena', 'quicksight'])

/**
 * SAA の Analytics を 1 画面に置く。
 * 主サービスは Lake（Kinesis / Athena / QuickSight / S3）。AZ 横断は本筋ではないので VPC は 1 AZ。
 * EMR クラスタは VPC 内（EC2 上）。Athena は S3 を SQL。QuickSight は Athena / Redshift / RDS を見る。
 */
export const analyticsCity: VpcCityDefinition = {
  id: 'saa-analytics-city',
  azs: ['az-a'],
  occupants: [
    { id: 'internet', kind: 'internet', label: 'Internet', az: null, tier: null },
    { id: 'igw', kind: 'igw', label: 'IGW', az: null, tier: null },
    { id: 'kinesis', kind: 'service', label: 'Kinesis', az: null, tier: null, serviceId: 'kinesis' },
    { id: 'lambda', kind: 'service', label: 'Lambda', az: null, tier: null, serviceId: 'lambda' },
    { id: 's3', kind: 'service', label: 'S3', az: null, tier: null, serviceId: 's3' },
    { id: 'athena', kind: 'service', label: 'Athena', az: null, tier: null, serviceId: 'athena' },
    { id: 'quicksight', kind: 'service', label: 'QuickSight', az: null, tier: null, serviceId: 'quicksight' },
    { id: 'timestream', kind: 'service', label: 'Timestream', az: null, tier: null, serviceId: 'timestream' },
    { id: 'emr', kind: 'service', label: 'EMR', az: null, tier: null, serviceId: 'emr' },
    { id: 'alb-a', kind: 'service', label: 'ALB', az: 'az-a', tier: 'public', serviceId: 'elb' },
    { id: 'nat-a', kind: 'nat', label: 'NAT', az: 'az-a', tier: 'public' },
    { id: 'ec2-a', kind: 'service', label: 'EC2', az: 'az-a', tier: 'private', serviceId: 'ec2' },
    { id: 'emr-a', kind: 'service', label: 'EMR', az: 'az-a', tier: 'private', serviceId: 'emr' },
    { id: 'rds-a', kind: 'service', label: 'RDS', az: 'az-a', tier: 'private', serviceId: 'rds' },
    { id: 'rs-a', kind: 'service', label: 'Redshift', az: 'az-a', tier: 'private', serviceId: 'redshift' },
  ],
  flows: [
    L('in-net', 'internet', 'igw', 'ingress'),
    L('in-a', 'igw', 'alb-a', 'ingress'),
    L('app-a', 'alb-a', 'ec2-a', 'app'),
    L('qs-in', 'internet', 'quicksight', 'ingress', 'path', 'fwd', 'internet'),
    L('pub-a', 'ec2-a', 'kinesis', 'event'),
    L('kin-lambda', 'kinesis', 'lambda', 'event'),
    L('kin-emr', 'kinesis', 'emr', 'event'),
    L('kin-s3', 'kinesis', 's3', 'data', 'access'),
    L('kin-ts', 'kinesis', 'timestream', 'event'),
    L('lambda-s3', 'lambda', 's3', 'data', 'access'),
    L('emr-launch-a', 'emr', 'emr-a', 'scale'),
    L('emr-on-a', 'emr-a', 'ec2-a', 'app', 'attach', 'none'),
    L('emr-s3-a', 'emr-a', 's3', 'data', 'access'),
    L('athena-s3', 'athena', 's3', 'data', 'access'),
    L('athena-qs', 'athena', 'quicksight', 'data', 'access'),
    L('s3-rs-a', 's3', 'rs-a', 'data', 'access'),
    L('rs-qs-a', 'rs-a', 'quicksight', 'data', 'access'),
    L('rds-qs-a', 'rds-a', 'quicksight', 'data', 'access'),
    L('ec2-rds-a', 'ec2-a', 'rds-a', 'data'),
    L('out-a', 'ec2-a', 'nat-a', 'egress'),
    L('out-emr-a', 'emr-a', 'nat-a', 'egress'),
    L('out-igw-a', 'nat-a', 'igw', 'egress'),
  ],
}

export function getAnalyticsOccupant(id: string) {
  return analyticsCity.occupants.find((o) => o.id === id)
}

export function isAnalyticsCityEntry(serviceId: string) {
  return ANALYTICS_CITY_SERVICES.has(serviceId)
}

export function isAnalyticsCityService(serviceId: string) {
  return isAnalyticsCityEntry(serviceId) || analyticsCity.occupants.some((o) => o.serviceId === serviceId)
}

export function getAnalyticsPrimaryOccupantId(serviceId: string | null) {
  if (!serviceId) return null
  return analyticsCity.occupants.find((o) => o.serviceId === serviceId)?.id ?? null
}
