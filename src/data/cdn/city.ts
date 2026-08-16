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
    { id: 'dns-cf', from: 'route53', to: 'cloudfront', role: 'ingress' },
    { id: 'dns-ga', from: 'route53', to: 'ga', role: 'ingress' },
    { id: 'in-cf', from: 'internet', to: 'cloudfront', role: 'ingress' },
    { id: 'in-ga', from: 'internet', to: 'ga', role: 'ingress' },
    { id: 'waf-cf', from: 'waf', to: 'cloudfront', role: 'app' },
    { id: 'shield-cf', from: 'shield', to: 'cloudfront', role: 'app' },
    { id: 'acm-cf', from: 'acm', to: 'cloudfront', role: 'app' },
    { id: 'cf-lambda-edge', from: 'cloudfront', to: 'lambda-edge', role: 'event' },
    { id: 'cf-s3', from: 'cloudfront', to: 's3', role: 'data' },
    { id: 'cf-lambda', from: 'cloudfront', to: 'lambda', role: 'app' },
    { id: 'cf-igw', from: 'cloudfront', to: 'igw', role: 'app' },
    { id: 'igw-a', from: 'igw', to: 'alb-a', role: 'ingress' },
    { id: 'igw-b', from: 'igw', to: 'alb-b', role: 'ingress' },
    { id: 'ga-nlb-a', from: 'ga', to: 'nlb-a', role: 'app' },
    { id: 'ga-nlb-b', from: 'ga', to: 'nlb-b', role: 'app' },
    { id: 'app-a', from: 'alb-a', to: 'ec2-a', role: 'app' },
    { id: 'app-b', from: 'alb-b', to: 'ec2-b', role: 'app' },
    { id: 'nlb-app-a', from: 'nlb-a', to: 'ec2-a', role: 'app' },
    { id: 'nlb-app-b', from: 'nlb-b', to: 'ec2-b', role: 'app' },
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
