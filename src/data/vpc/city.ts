import type { VpcCityDefinition } from '@/types/aws'

const NETWORK_CITY_SERVICES = new Set([
  'vpc',
  'elb',
  'route53',
  'direct-connect',
  'site-to-site-vpn',
  'vpn-gateway',
  'client-vpn',
  'direct-connect-gateway',
  'transit-gateway',
])

/**
 * SAA の Networking を 1 画面に置く。
 * AWS の内側（VPC / VGW / TGW / DX GW）と外側（Internet / On-prem）を分け、
 * Hybrid は場所ではなく On-prem→AWS の渡り方。
 * DX GW は VGW と TGW の両方へつながる。VPN は Internet 経由で VGW へ。
 */
export const vpcCity: VpcCityDefinition = {
  id: 'saa-web-vpc',
  azs: ['az-a', 'az-b'],
  occupants: [
    { id: 'route53', kind: 'service', label: 'Route 53', az: null, tier: null, serviceId: 'route53' },
    { id: 'internet', kind: 'internet', label: 'Internet', az: null, tier: null },
    { id: 'igw', kind: 'igw', label: 'IGW', az: null, tier: null },
    { id: 'alb-a', kind: 'service', label: 'ALB', az: 'az-a', tier: 'public', serviceId: 'elb' },
    { id: 'alb-b', kind: 'service', label: 'ALB', az: 'az-b', tier: 'public', serviceId: 'elb' },
    { id: 'nat-a', kind: 'nat', label: 'NAT', az: 'az-a', tier: 'public' },
    { id: 'nat-b', kind: 'nat', label: 'NAT', az: 'az-b', tier: 'public' },
    { id: 'ec2-a', kind: 'service', label: 'EC2', az: 'az-a', tier: 'private', serviceId: 'ec2' },
    { id: 'ec2-b', kind: 'service', label: 'EC2', az: 'az-b', tier: 'private', serviceId: 'ec2' },
    { id: 'rds-a', kind: 'service', label: 'RDS', az: 'az-a', tier: 'private', serviceId: 'rds' },
    { id: 'rds-b', kind: 'service', label: 'RDS', az: 'az-b', tier: 'private', serviceId: 'rds' },
    { id: 'tgw', kind: 'service', label: 'TGW', az: null, tier: null, serviceId: 'transit-gateway' },
    { id: 'dxgw', kind: 'service', label: 'DX GW', az: null, tier: null, serviceId: 'direct-connect-gateway' },
    { id: 'dx', kind: 'service', label: 'DX', az: null, tier: null, serviceId: 'direct-connect' },
    { id: 'vpn', kind: 'service', label: 'S2S VPN', az: null, tier: null, serviceId: 'site-to-site-vpn' },
    { id: 'vgw', kind: 'service', label: 'VPN GW', az: null, tier: null, serviceId: 'vpn-gateway' },
    { id: 'client-vpn', kind: 'service', label: 'Client VPN', az: null, tier: null, serviceId: 'client-vpn' },
    { id: 'onprem', kind: 'onprem', label: 'Site', az: null, tier: null },
  ],
  flows: [
    { id: 'in-net', from: 'internet', to: 'igw', role: 'ingress' },
    { id: 'in-a', from: 'igw', to: 'alb-a', role: 'ingress' },
    { id: 'in-b', from: 'igw', to: 'alb-b', role: 'ingress' },
    { id: 'dns-a', from: 'route53', to: 'alb-a', role: 'ingress' },
    { id: 'dns-b', from: 'route53', to: 'alb-b', role: 'ingress' },
    { id: 'app-a', from: 'alb-a', to: 'ec2-a', role: 'app' },
    { id: 'app-b', from: 'alb-b', to: 'ec2-b', role: 'app' },
    { id: 'db-a', from: 'ec2-a', to: 'rds-a', role: 'data' },
    { id: 'db-b', from: 'ec2-b', to: 'rds-b', role: 'data' },
    { id: 'out-a', from: 'ec2-a', to: 'nat-a', role: 'egress' },
    { id: 'out-b', from: 'ec2-b', to: 'nat-b', role: 'egress' },
    { id: 'out-igw-a', from: 'nat-a', to: 'igw', role: 'egress' },
    { id: 'out-igw-b', from: 'nat-b', to: 'igw', role: 'egress' },
    { id: 'dx-line', from: 'onprem', to: 'dx', role: 'hybrid' },
    { id: 'dx-gw', from: 'dx', to: 'dxgw', role: 'hybrid' },
    { id: 'dxgw-tgw', from: 'dxgw', to: 'tgw', role: 'hybrid' },
    { id: 'dxgw-vgw', from: 'dxgw', to: 'vgw', role: 'hybrid' },
    { id: 'vpn-over-net', from: 'onprem', to: 'internet', role: 'hybrid' },
    { id: 'vpn-in', from: 'internet', to: 'vpn', role: 'hybrid' },
    { id: 'vpn-vgw', from: 'vpn', to: 'vgw', role: 'hybrid' },
    { id: 'vgw-a', from: 'vgw', to: 'ec2-a', role: 'app' },
    { id: 'vgw-b', from: 'vgw', to: 'ec2-b', role: 'app' },
    { id: 'tgw-a', from: 'tgw', to: 'ec2-a', role: 'app' },
    { id: 'tgw-b', from: 'tgw', to: 'ec2-b', role: 'app' },
    { id: 'cvpn-in', from: 'internet', to: 'client-vpn', role: 'ingress' },
    { id: 'cvpn-a', from: 'client-vpn', to: 'ec2-a', role: 'app' },
  ],
}

export function getCityOccupant(id: string) {
  return vpcCity.occupants.find((o) => o.id === id)
}

export function isNetworkCityEntry(serviceId: string) {
  return NETWORK_CITY_SERVICES.has(serviceId)
}

export function isVpcCityService(serviceId: string) {
  return isNetworkCityEntry(serviceId) || vpcCity.occupants.some((o) => o.serviceId === serviceId)
}

export function getPrimaryOccupantId(serviceId: string | null) {
  if (!serviceId || serviceId === 'vpc') return null
  return vpcCity.occupants.find((o) => o.serviceId === serviceId)?.id ?? null
}
