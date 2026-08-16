import { cityLink as L } from '@/data/cityLink'
import type { VpcCityDefinition } from '@/types/aws'

const CDN_CITY_SERVICES = new Set(['cloudfront', 'global-accelerator'])

/**
 * SAA の CDN / Edge を 1 画面に置く。
 * CloudFront は Region A の Origin（S3 / Lambda / ALB）へ戻る。
 * Global Accelerator は Region A の NLB と Region B の NLB へ Anycast。
 * Origin VPC は 1 AZ。AZ 横断は本筋ではない。
 */
export const cdnCity: VpcCityDefinition = {
  id: 'saa-cdn-city',
  azs: ['az-a'],
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
    { id: 'nlb-a', kind: 'service', label: 'NLB', az: 'az-a', tier: 'public', serviceId: 'elb' },
    { id: 'ec2-a', kind: 'service', label: 'EC2', az: 'az-a', tier: 'private', serviceId: 'ec2' },
    { id: 'nlb-r2', kind: 'service', label: 'NLB', az: null, tier: null, serviceId: 'elb' },
    { id: 'ec2-r2', kind: 'service', label: 'EC2', az: null, tier: null, serviceId: 'ec2' },
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
    L('ga-nlb-a', 'ga', 'nlb-a', 'app'),
    L('ga-nlb-r2', 'ga', 'nlb-r2', 'app'),
    L('app-a', 'alb-a', 'ec2-a', 'app'),
    L('nlb-app-a', 'nlb-a', 'ec2-a', 'app'),
    L('nlb-app-r2', 'nlb-r2', 'ec2-r2', 'app'),
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
