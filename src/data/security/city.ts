import { cityLink as L } from '@/data/cityLink'
import type { VpcCityDefinition } from '@/types/aws'

const SECURITY_CITY_SERVICES = new Set([
  'iam',
  'organizations',
  'identity-center',
  'directory-service',
  'kms',
  'cloudhsm',
  'acm',
  'secrets-manager',
  'guardduty',
  'security-hub',
  'macie',
  'inspector',
  'shield',
  'waf',
  'firewall-manager',
])

/**
 * SAA の Security を 1 画面に置く。
 * 主サービスはアカウント / リージョン / Edge。AZ 横断は本筋ではないので VPC は 1 AZ。
 * Identity は Organizations / IAM / Identity Center / FMS / KMS / Secrets。
 * Directory / CloudHSM は VPC 内。検出は Security Hub に集約。
 */
export const securityCity: VpcCityDefinition = {
  id: 'saa-security-city',
  azs: ['az-a'],
  occupants: [
    { id: 'internet', kind: 'internet', label: 'Internet', az: null, tier: null },
    { id: 'waf', kind: 'service', label: 'WAF', az: null, tier: null, serviceId: 'waf' },
    { id: 'shield', kind: 'service', label: 'Shield', az: null, tier: null, serviceId: 'shield' },
    { id: 'acm', kind: 'service', label: 'ACM', az: null, tier: null, serviceId: 'acm' },
    { id: 'cloudfront', kind: 'service', label: 'CloudFront', az: null, tier: null, serviceId: 'cloudfront' },
    { id: 'igw', kind: 'igw', label: 'IGW', az: null, tier: null },
    { id: 'organizations', kind: 'service', label: 'Organizations', az: null, tier: null, serviceId: 'organizations' },
    { id: 'iam', kind: 'service', label: 'IAM', az: null, tier: null, serviceId: 'iam' },
    { id: 'identity-center', kind: 'service', label: 'Identity Center', az: null, tier: null, serviceId: 'identity-center' },
    { id: 'fms', kind: 'service', label: 'Firewall Manager', az: null, tier: null, serviceId: 'firewall-manager' },
    { id: 'kms', kind: 'service', label: 'KMS', az: null, tier: null, serviceId: 'kms' },
    { id: 'secrets', kind: 'service', label: 'Secrets Manager', az: null, tier: null, serviceId: 'secrets-manager' },
    { id: 'security-hub', kind: 'service', label: 'Security Hub', az: null, tier: null, serviceId: 'security-hub' },
    { id: 'guardduty', kind: 'service', label: 'GuardDuty', az: null, tier: null, serviceId: 'guardduty' },
    { id: 'inspector', kind: 'service', label: 'Inspector', az: null, tier: null, serviceId: 'inspector' },
    { id: 'macie', kind: 'service', label: 'Macie', az: null, tier: null, serviceId: 'macie' },
    { id: 'config', kind: 'service', label: 'Config', az: null, tier: null, serviceId: 'config' },
    { id: 'cloudtrail', kind: 'service', label: 'CloudTrail', az: null, tier: null, serviceId: 'cloudtrail' },
    { id: 's3', kind: 'service', label: 'S3', az: null, tier: null, serviceId: 's3' },
    { id: 'alb-a', kind: 'service', label: 'ALB', az: 'az-a', tier: 'public', serviceId: 'elb' },
    { id: 'nat-a', kind: 'nat', label: 'NAT', az: 'az-a', tier: 'public' },
    { id: 'ec2-a', kind: 'service', label: 'EC2', az: 'az-a', tier: 'private', serviceId: 'ec2' },
    { id: 'hsm-a', kind: 'service', label: 'CloudHSM', az: 'az-a', tier: 'private', serviceId: 'cloudhsm' },
    { id: 'ds-a', kind: 'service', label: 'Directory', az: 'az-a', tier: 'private', serviceId: 'directory-service' },
    { id: 'rds-a', kind: 'service', label: 'RDS', az: 'az-a', tier: 'private', serviceId: 'rds' },
  ],
  flows: [
    L('in-cf', 'internet', 'cloudfront', 'ingress'),
    L('waf-cf', 'waf', 'cloudfront', 'app', 'associate', 'none'),
    L('shield-cf', 'shield', 'cloudfront', 'app', 'associate', 'none'),
    L('acm-cf', 'acm', 'cloudfront', 'app', 'associate', 'none'),
    L('cf-igw', 'cloudfront', 'igw', 'app'),
    L('in-a', 'igw', 'alb-a', 'ingress'),
    L('waf-alb-a', 'waf', 'alb-a', 'app', 'associate', 'none'),
    L('acm-alb-a', 'acm', 'alb-a', 'app', 'associate', 'none'),
    L('app-a', 'alb-a', 'ec2-a', 'app'),
    L('out-a', 'ec2-a', 'nat-a', 'egress'),
    L('out-igw-a', 'nat-a', 'igw', 'egress'),
    L('org-iam', 'organizations', 'iam', 'app', 'associate', 'none'),
    L('org-sso', 'organizations', 'identity-center', 'app', 'associate', 'none'),
    L('org-fms', 'organizations', 'fms', 'app', 'associate', 'none'),
    L('sso-iam', 'identity-center', 'iam', 'app', 'associate', 'none'),
    L('sso-ds-a', 'identity-center', 'ds-a', 'hybrid', 'access'),
    L('iam-kms', 'iam', 'kms', 'app', 'access'),
    L('iam-secrets', 'iam', 'secrets', 'app', 'access'),
    L('kms-hsm-a', 'kms', 'hsm-a', 'data', 'associate', 'none'),
    L('secrets-kms', 'secrets', 'kms', 'data', 'access'),
    L('secrets-rds-a', 'secrets', 'rds-a', 'data', 'access'),
    L('fms-waf', 'fms', 'waf', 'app', 'associate', 'none'),
    L('fms-shield', 'fms', 'shield', 'app', 'associate', 'none'),
    L('trail-gd', 'cloudtrail', 'guardduty', 'event'),
    L('s3-macie', 's3', 'macie', 'data', 'access'),
    L('insp-ec2-a', 'inspector', 'ec2-a', 'data', 'access'),
    L('gd-hub', 'guardduty', 'security-hub', 'event'),
    L('insp-hub', 'inspector', 'security-hub', 'event'),
    L('macie-hub', 'macie', 'security-hub', 'event'),
    L('config-hub', 'config', 'security-hub', 'event'),
    L('fms-hub', 'fms', 'security-hub', 'event'),
  ],
}

export function getSecurityOccupant(id: string) {
  return securityCity.occupants.find((o) => o.id === id)
}

export function isSecurityCityEntry(serviceId: string) {
  return SECURITY_CITY_SERVICES.has(serviceId)
}

export function isSecurityCityService(serviceId: string) {
  return isSecurityCityEntry(serviceId) || securityCity.occupants.some((o) => o.serviceId === serviceId)
}

export function getSecurityPrimaryOccupantId(serviceId: string | null) {
  if (!serviceId) return null
  return securityCity.occupants.find((o) => o.serviceId === serviceId)?.id ?? null
}
