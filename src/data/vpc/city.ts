import type { VpcCityDefinition } from '@/types/aws'

/**
 * SAA で頻出の 2AZ Web 構成を、都市の街区として固定配置する。
 * 文章ではなく「入口 / 内側 / 区切り」の位置関係が本体。
 */
export const vpcCity: VpcCityDefinition = {
  id: 'saa-web-vpc',
  azs: ['az-a', 'az-b'],
  occupants: [
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
  ],
  flows: [
    { id: 'in-net', from: 'internet', to: 'igw', role: 'ingress' },
    { id: 'in-a', from: 'igw', to: 'alb-a', role: 'ingress' },
    { id: 'in-b', from: 'igw', to: 'alb-b', role: 'ingress' },
    { id: 'app-a', from: 'alb-a', to: 'ec2-a', role: 'app' },
    { id: 'app-b', from: 'alb-b', to: 'ec2-b', role: 'app' },
    { id: 'db-a', from: 'ec2-a', to: 'rds-a', role: 'data' },
    { id: 'db-b', from: 'ec2-b', to: 'rds-b', role: 'data' },
    { id: 'out-a', from: 'ec2-a', to: 'nat-a', role: 'egress' },
    { id: 'out-b', from: 'ec2-b', to: 'nat-b', role: 'egress' },
    { id: 'out-igw-a', from: 'nat-a', to: 'igw', role: 'egress' },
    { id: 'out-igw-b', from: 'nat-b', to: 'igw', role: 'egress' },
  ],
}

export function getCityOccupant(id: string) {
  return vpcCity.occupants.find((o) => o.id === id)
}

export function isVpcCityService(serviceId: string) {
  return serviceId === 'vpc' || vpcCity.occupants.some((o) => o.serviceId === serviceId)
}
