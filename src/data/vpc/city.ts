import { cityLink as L } from '@/data/cityLink'
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
    L('in-net', 'internet', 'igw', 'ingress'),
    L('in-a', 'igw', 'alb-a', 'ingress'),
    L('in-b', 'igw', 'alb-b', 'ingress'),
    L('dns-a', 'route53', 'alb-a', 'ingress', 'access'),
    L('dns-b', 'route53', 'alb-b', 'ingress', 'access'),
    L('app-a', 'alb-a', 'ec2-a', 'app'),
    L('app-b', 'alb-b', 'ec2-b', 'app'),
    L('db-a', 'ec2-a', 'rds-a', 'data'),
    L('db-b', 'ec2-b', 'rds-b', 'data'),
    L('out-a', 'ec2-a', 'nat-a', 'egress'),
    L('out-b', 'ec2-b', 'nat-b', 'egress'),
    L('out-igw-a', 'nat-a', 'igw', 'egress'),
    L('out-igw-b', 'nat-b', 'igw', 'egress'),
    L('dx-line', 'onprem', 'dx', 'hybrid', 'path', 'both'),
    L('dx-gw', 'dx', 'dxgw', 'hybrid', 'path', 'both'),
    L('dxgw-tgw', 'dxgw', 'tgw', 'hybrid', 'associate', 'none'),
    L('dxgw-vgw', 'dxgw', 'vgw', 'hybrid', 'associate', 'none'),
    L('vpn-over-net', 'onprem', 'internet', 'hybrid', 'path', 'both', 'internet'),
    L('vpn-in', 'internet', 'vpn', 'hybrid', 'path', 'fwd', 'internet'),
    L('vpn-vgw', 'vpn', 'vgw', 'hybrid', 'attach', 'none'),
    L('vgw-a', 'vgw', 'ec2-a', 'app'),
    L('vgw-b', 'vgw', 'ec2-b', 'app'),
    L('tgw-a', 'tgw', 'ec2-a', 'app'),
    L('tgw-b', 'tgw', 'ec2-b', 'app'),
    L('cvpn-in', 'internet', 'client-vpn', 'ingress', 'path', 'fwd', 'internet'),
    L('cvpn-a', 'client-vpn', 'ec2-a', 'app'),
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
