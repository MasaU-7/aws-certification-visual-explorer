import { cityLink as L } from '@/data/cityLink'
import type { VpcCityDefinition } from '@/types/aws'

const STORAGE_CITY_SERVICES = new Set([
  's3',
  'ebs',
  'efs',
  'fsx',
  'storage-gateway',
  'snowball',
  'transfer-family',
  'datasync',
])

/**
 * SAA の Storage を 1 画面に置く。
 * EBS は同一 AZ の EC2 にアタッチ。EFS / FSx は VPC 内でマウント。
 * S3 は Region（VPC 外）。Private の EC2 は NAT 経由で届く。
 * Transfer は Internet から S3 / EFS へ。DataSync はオンライン同期。
 * Storage Gateway は On-prem から S3。Snowball はオフライン搬入。
 */
export const storageCity: VpcCityDefinition = {
  id: 'saa-storage-city',
  azs: ['az-a', 'az-b'],
  occupants: [
    { id: 'internet', kind: 'internet', label: 'Internet', az: null, tier: null },
    { id: 'igw', kind: 'igw', label: 'IGW', az: null, tier: null },
    { id: 'nat-a', kind: 'nat', label: 'NAT', az: 'az-a', tier: 'public' },
    { id: 'nat-b', kind: 'nat', label: 'NAT', az: 'az-b', tier: 'public' },
    { id: 'ec2-a', kind: 'service', label: 'EC2', az: 'az-a', tier: 'private', serviceId: 'ec2' },
    { id: 'ec2-b', kind: 'service', label: 'EC2', az: 'az-b', tier: 'private', serviceId: 'ec2' },
    { id: 'ebs-a', kind: 'service', label: 'EBS', az: 'az-a', tier: 'private', serviceId: 'ebs' },
    { id: 'ebs-b', kind: 'service', label: 'EBS', az: 'az-b', tier: 'private', serviceId: 'ebs' },
    { id: 'efs-a', kind: 'service', label: 'EFS', az: 'az-a', tier: 'private', serviceId: 'efs' },
    { id: 'efs-b', kind: 'service', label: 'EFS', az: 'az-b', tier: 'private', serviceId: 'efs' },
    { id: 'fsx-a', kind: 'service', label: 'FSx', az: 'az-a', tier: 'private', serviceId: 'fsx' },
    { id: 'fsx-b', kind: 'service', label: 'FSx', az: 'az-b', tier: 'private', serviceId: 'fsx' },
    { id: 's3', kind: 'service', label: 'S3', az: null, tier: null, serviceId: 's3' },
    { id: 'transfer', kind: 'service', label: 'Transfer', az: null, tier: null, serviceId: 'transfer-family' },
    { id: 'datasync', kind: 'service', label: 'DataSync', az: null, tier: null, serviceId: 'datasync' },
    { id: 'sgw', kind: 'service', label: 'Storage GW', az: null, tier: null, serviceId: 'storage-gateway' },
    { id: 'snowball', kind: 'service', label: 'Snowball', az: null, tier: null, serviceId: 'snowball' },
    { id: 'onprem', kind: 'onprem', label: 'Site', az: null, tier: null },
  ],
  flows: [
    L('in-net', 'internet', 'igw', 'ingress'),
    L('sftp-in', 'internet', 'transfer', 'ingress'),
    L('sftp-s3', 'transfer', 's3', 'data'),
    L('sftp-efs', 'transfer', 'efs-a', 'data'),
    L('ebs-a', 'ebs-a', 'ec2-a', 'data', 'attach', 'none'),
    L('ebs-b', 'ebs-b', 'ec2-b', 'data', 'attach', 'none'),
    L('efs-a', 'efs-a', 'ec2-a', 'data', 'attach', 'none'),
    L('efs-b', 'efs-b', 'ec2-b', 'data', 'attach', 'none'),
    L('fsx-a', 'fsx-a', 'ec2-a', 'data', 'attach', 'none'),
    L('fsx-b', 'fsx-b', 'ec2-b', 'data', 'attach', 'none'),
    L('ec2-s3-a', 'ec2-a', 's3', 'data', 'access'),
    L('ec2-s3-b', 'ec2-b', 's3', 'data', 'access'),
    L('out-a', 'ec2-a', 'nat-a', 'egress'),
    L('out-b', 'ec2-b', 'nat-b', 'egress'),
    L('out-igw-a', 'nat-a', 'igw', 'egress'),
    L('out-igw-b', 'nat-b', 'igw', 'egress'),
    L('site-sgw', 'onprem', 'sgw', 'hybrid'),
    L('sgw-s3', 'sgw', 's3', 'hybrid'),
    L('site-sync', 'onprem', 'datasync', 'hybrid'),
    L('sync-s3', 'datasync', 's3', 'data'),
    L('sync-efs', 'datasync', 'efs-a', 'data'),
    L('sync-fsx', 'datasync', 'fsx-a', 'data'),
    L('site-snow', 'onprem', 'snowball', 'hybrid', 'path', 'fwd', 'offline'),
    L('snow-s3', 'snowball', 's3', 'hybrid', 'path', 'fwd', 'offline'),
  ],
}

export function getStorageOccupant(id: string) {
  return storageCity.occupants.find((o) => o.id === id)
}

export function isStorageCityEntry(serviceId: string) {
  return STORAGE_CITY_SERVICES.has(serviceId)
}

export function isStorageCityService(serviceId: string) {
  return isStorageCityEntry(serviceId) || storageCity.occupants.some((o) => o.serviceId === serviceId)
}

export function getStoragePrimaryOccupantId(serviceId: string | null) {
  if (!serviceId) return null
  return storageCity.occupants.find((o) => o.serviceId === serviceId)?.id ?? null
}
