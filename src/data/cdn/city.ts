import { cityLink as L } from '@/data/cityLink'
import type { VpcCityDefinition } from '@/types/aws'

const CDN_CITY_SERVICES = new Set(['cloudfront', 'global-accelerator'])

/**
 * SAA の CDN / Edge を 1 画面に置く。
 * Edge（PoP）は Region の外。CloudFront はキャッシュして Origin へ戻る。
 * Lambda@Edge は Lambda を PoP で動かす（別サービスではない）。
 * Global Accelerator はキャッシュせず Anycast で NLB（L4）へ渡す。
 * Origin は S3 / リージョン Lambda（VPC 外）か ALB（Public）。
 */
export const cdnCity: VpcCityDefinition = {
  id: 'saa-cdn-city',
  azs: ['az-a', 'az-b'],
  occupants: [
    { id: 'route53', kind: 'service', label: 'Route 53', az: null, tier: null, serviceId: 'route53' },
    { id: 'internet', kind: 'internet', label: 'Internet', az: null, tier: null },
    { id: 'waf', kind: 'service', label: 'WAF', az: null, tier: null, serviceId: 'waf' },
    { id: 'shield', kind: 'service', label: 'Shield', az: null, tier: null, serviceId: 'shield' },
    { id: 'acm', kind: 'service', label: 'ACM', az: null, tier: null, serviceId: 'acm' },
    { id: 'cloudfront', kind: 'service', label: 'CloudFront', az: null, tier: null, serviceId: 'cloudfront' },
    { id: 'lambda-edge', kind: 'service', label: 'Lambda@Edge', az: null, tier: null, serviceId: 'lambda' },
    { id: 'ga', kind: 'service', label: 'GA', az: null, tier: null, serviceId: 'global-accelerator' },
    { id: 'igw', kind: 'igw', label: 'IGW', az: null, tier: null },
    { id: 's3', kind: 'service', label: 'S3', az: null, tier: null, serviceId: 's3' },
    { id: 'lambda', kind: 'service', label: 'Lambda', az: null, tier: null, serviceId: 'lambda' },
    { id: 'alb-a', kind: 'service', label: 'ALB', az: 'az-a', tier: 'public', serviceId: 'elb' },
    { id: 'alb-b', kind: 'service', label: 'ALB', az: 'az-b', tier: 'public', serviceId: 'elb' },
    { id: 'nlb-a', kind: 'service', label: 'NLB', az: 'az-a', tier: 'public', serviceId: 'elb' },
    { id: 'nlb-b', kind: 'service', label: 'NLB', az: 'az-b', tier: 'public', serviceId: 'elb' },
    { id: 'ec2-a', kind: 'service', label: 'EC2', az: 'az-a', tier: 'private', serviceId: 'ec2' },
    { id: 'ec2-b', kind: 'service', label: 'EC2', az: 'az-b', tier: 'private', serviceId: 'ec2' },
  ],
  flows: [
    L('dns-cf', 'route53', 'cloudfront', 'ingress', 'access'),
    L('dns-ga', 'route53', 'ga', 'ingress', 'access'),
    L('in-cf', 'internet', 'cloudfront', 'ingress'),
    L('in-ga', 'internet', 'ga', 'ingress'),
    L('waf-cf', 'waf', 'cloudfront', 'app', 'associate', 'none'),
    L('shield-cf', 'shield', 'cloudfront', 'app', 'associate', 'none'),
    L('acm-cf', 'acm', 'cloudfront', 'app', 'associate', 'none'),
    L('cf-lambda-edge', 'cloudfront', 'lambda-edge', 'event', 'associate', 'none'),
    L('cf-s3', 'cloudfront', 's3', 'data'),
    L('cf-lambda', 'cloudfront', 'lambda', 'app'),
    L('cf-igw', 'cloudfront', 'igw', 'app'),
    L('igw-a', 'igw', 'alb-a', 'ingress'),
    L('igw-b', 'igw', 'alb-b', 'ingress'),
    L('ga-nlb-a', 'ga', 'nlb-a', 'app'),
    L('ga-nlb-b', 'ga', 'nlb-b', 'app'),
    L('app-a', 'alb-a', 'ec2-a', 'app'),
    L('app-b', 'alb-b', 'ec2-b', 'app'),
    L('nlb-app-a', 'nlb-a', 'ec2-a', 'app'),
    L('nlb-app-b', 'nlb-b', 'ec2-b', 'app'),
  ],
}

export function getCdnOccupant(id: string) {
  return cdnCity.occupants.find((o) => o.id === id)
}

export function isCdnCityEntry(serviceId: string) {
  return CDN_CITY_SERVICES.has(serviceId)
}

export function isCdnCityService(serviceId: string) {
  return isCdnCityEntry(serviceId) || cdnCity.occupants.some((o) => o.serviceId === serviceId)
}

export function getCdnPrimaryOccupantId(serviceId: string | null) {
  if (!serviceId) return null
  return cdnCity.occupants.find((o) => o.serviceId === serviceId)?.id ?? null
}
