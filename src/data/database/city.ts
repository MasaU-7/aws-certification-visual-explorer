import { cityLink as L } from '@/data/cityLink'
import type { VpcCityDefinition } from '@/types/aws'

const DATABASE_CITY_SERVICES = new Set([
  'rds',
  'aurora',
  'dynamodb',
  'redshift',
  'elasticache',
  'memorydb',
  'neptune',
  'documentdb',
  'keyspaces',
  'timestream',
])

/**
 * SAA の Databases を 1 画面に置く。
 * アプリ層（ALB / NAT / EC2）は 1 AZ。DB の HA だけが AZ をまたぐ。
 * RDS は 2 AZ。Aurora は 3 AZ。ElastiCache / MemoryDB / Neptune / DocumentDB は 2 AZ。
 * Redshift は倉庫が本筋なので 1 AZ。DynamoDB / Keyspaces / Timestream は Serverless。
 */
export const databaseCity: VpcCityDefinition = {
  id: 'saa-database-city',
  azs: ['az-a', 'az-b', 'az-c'],
  occupants: [
    { id: 'internet', kind: 'internet', label: 'Internet', az: null, tier: null },
    { id: 'igw', kind: 'igw', label: 'IGW', az: null, tier: null },
    { id: 'lambda', kind: 'service', label: 'Lambda', az: null, tier: null, serviceId: 'lambda' },
    { id: 'kinesis', kind: 'service', label: 'Kinesis', az: null, tier: null, serviceId: 'kinesis' },
    { id: 's3', kind: 'service', label: 'S3', az: null, tier: null, serviceId: 's3' },
    { id: 'dynamodb', kind: 'service', label: 'DynamoDB', az: null, tier: null, serviceId: 'dynamodb' },
    { id: 'keyspaces', kind: 'service', label: 'Keyspaces', az: null, tier: null, serviceId: 'keyspaces' },
    { id: 'timestream', kind: 'service', label: 'Timestream', az: null, tier: null, serviceId: 'timestream' },
    { id: 'quicksight', kind: 'service', label: 'QuickSight', az: null, tier: null, serviceId: 'quicksight' },
    { id: 'alb-a', kind: 'service', label: 'ALB', az: 'az-a', tier: 'public', serviceId: 'elb' },
    { id: 'nat-a', kind: 'nat', label: 'NAT', az: 'az-a', tier: 'public' },
    { id: 'ec2-a', kind: 'service', label: 'EC2', az: 'az-a', tier: 'private', serviceId: 'ec2' },
    { id: 'cache-a', kind: 'service', label: 'ElastiCache', az: 'az-a', tier: 'private', serviceId: 'elasticache' },
    { id: 'cache-b', kind: 'service', label: 'ElastiCache', az: 'az-b', tier: 'private', serviceId: 'elasticache' },
    { id: 'mem-a', kind: 'service', label: 'MemoryDB', az: 'az-a', tier: 'private', serviceId: 'memorydb' },
    { id: 'mem-b', kind: 'service', label: 'MemoryDB', az: 'az-b', tier: 'private', serviceId: 'memorydb' },
    { id: 'rds-a', kind: 'service', label: 'RDS', az: 'az-a', tier: 'private', serviceId: 'rds' },
    { id: 'rds-b', kind: 'service', label: 'RDS', az: 'az-b', tier: 'private', serviceId: 'rds' },
    { id: 'aurora-a', kind: 'service', label: 'Aurora', az: 'az-a', tier: 'private', serviceId: 'aurora' },
    { id: 'aurora-b', kind: 'service', label: 'Aurora', az: 'az-b', tier: 'private', serviceId: 'aurora' },
    { id: 'aurora-c', kind: 'service', label: 'Aurora', az: 'az-c', tier: 'private', serviceId: 'aurora' },
    { id: 'rs-a', kind: 'service', label: 'Redshift', az: 'az-a', tier: 'private', serviceId: 'redshift' },
    { id: 'nep-a', kind: 'service', label: 'Neptune', az: 'az-a', tier: 'private', serviceId: 'neptune' },
    { id: 'nep-b', kind: 'service', label: 'Neptune', az: 'az-b', tier: 'private', serviceId: 'neptune' },
    { id: 'doc-a', kind: 'service', label: 'DocumentDB', az: 'az-a', tier: 'private', serviceId: 'documentdb' },
    { id: 'doc-b', kind: 'service', label: 'DocumentDB', az: 'az-b', tier: 'private', serviceId: 'documentdb' },
  ],
  flows: [
    L('in-net', 'internet', 'igw', 'ingress'),
    L('in-a', 'igw', 'alb-a', 'ingress'),
    L('app-a', 'alb-a', 'ec2-a', 'app'),
    L('ec2-cache-a', 'ec2-a', 'cache-a', 'data'),
    L('ec2-mem-a', 'ec2-a', 'mem-a', 'data'),
    L('ec2-rds-a', 'ec2-a', 'rds-a', 'data'),
    L('ec2-aurora-a', 'ec2-a', 'aurora-a', 'data'),
    L('ec2-rs-a', 'ec2-a', 'rs-a', 'data'),
    L('ec2-nep-a', 'ec2-a', 'nep-a', 'data'),
    L('ec2-doc-a', 'ec2-a', 'doc-a', 'data'),
    L('rds-ha', 'rds-a', 'rds-b', 'data', 'path', 'both'),
    L('aurora-ab', 'aurora-a', 'aurora-b', 'data', 'path', 'both'),
    L('aurora-bc', 'aurora-b', 'aurora-c', 'data', 'path', 'both'),
    L('aurora-ca', 'aurora-c', 'aurora-a', 'data', 'path', 'both'),
    L('cache-ha', 'cache-a', 'cache-b', 'data', 'path', 'both'),
    L('mem-ha', 'mem-a', 'mem-b', 'data', 'path', 'both'),
    L('nep-ha', 'nep-a', 'nep-b', 'data', 'path', 'both'),
    L('doc-ha', 'doc-a', 'doc-b', 'data', 'path', 'both'),
    L('cache-rds-a', 'cache-a', 'rds-a', 'data', 'access'),
    L('aurora-rds', 'aurora-a', 'rds-a', 'app', 'associate', 'none'),
    L('mem-cache', 'mem-a', 'cache-a', 'app', 'associate', 'none'),
    L('lambda-ddb', 'lambda', 'dynamodb', 'data', 'access'),
    L('lambda-ks', 'lambda', 'keyspaces', 'data', 'access'),
    L('lambda-ts', 'lambda', 'timestream', 'data', 'access'),
    L('kinesis-lambda', 'kinesis', 'lambda', 'event'),
    L('kinesis-ts', 'kinesis', 'timestream', 'event'),
    L('ec2-ddb-a', 'ec2-a', 'dynamodb', 'data', 'access'),
    L('ec2-ks-a', 'ec2-a', 'keyspaces', 'data', 'access'),
    L('s3-rs-a', 's3', 'rs-a', 'data', 'access'),
    L('rs-qs-a', 'rs-a', 'quicksight', 'data', 'access'),
    L('out-a', 'ec2-a', 'nat-a', 'egress'),
    L('out-igw-a', 'nat-a', 'igw', 'egress'),
  ],
}

export function getDatabaseOccupant(id: string) {
  return databaseCity.occupants.find((o) => o.id === id)
}

export function isDatabaseCityEntry(serviceId: string) {
  return DATABASE_CITY_SERVICES.has(serviceId)
}

export function isDatabaseCityService(serviceId: string) {
  return isDatabaseCityEntry(serviceId) || databaseCity.occupants.some((o) => o.serviceId === serviceId)
}

export function getDatabasePrimaryOccupantId(serviceId: string | null) {
  if (!serviceId) return null
  return databaseCity.occupants.find((o) => o.serviceId === serviceId)?.id ?? null
}
