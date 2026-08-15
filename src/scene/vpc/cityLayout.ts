import type { AvailabilityZoneId, CityOccupant, SubnetTier } from '@/types/aws'

export const VPC_COLOR = '#8C4FFF'
export const AZ_COLOR = '#E8A317'
export const PUBLIC_COLOR = '#3FA36A'
export const PRIVATE_COLOR = '#3D7EC9'
export const INTERNET_COLOR = '#9ED4FF'

const AZ_X: Record<AvailabilityZoneId, number> = {
  'az-a': -2.15,
  'az-b': 2.15,
}

const TIER_Z: Record<SubnetTier, number> = {
  public: 1.28,
  private: -1.22,
}

export const SUBNET_SIZE: [number, number, number] = [3.95, 0.06, 2.28]
export const AZ_SIZE: [number, number, number] = [4.15, 1.55, 5.05]
export const VPC_SIZE: [number, number, number] = [8.7, 1.75, 5.55]

export function getAzCenter(az: AvailabilityZoneId): [number, number, number] {
  return [AZ_X[az], 0.55, 0.03]
}

export function getSubnetCenter(az: AvailabilityZoneId, tier: SubnetTier): [number, number, number] {
  return [AZ_X[az], 0.02, TIER_Z[tier]]
}

/** Public: ALB then NAT. Private: EC2 then RDS. */
export function getZoneSlot(
  az: AvailabilityZoneId,
  tier: SubnetTier,
  slot: 0 | 1,
): [number, number, number] {
  const [cx, , cz] = getSubnetCenter(az, tier)
  const dx = slot === 0 ? -0.85 : 0.85
  return [cx + dx, 0.42, cz]
}

export const GATE_POSITIONS = {
  internet: [0, 1.85, 5.55] as [number, number, number],
  igw: [0, 0.55, 3.42] as [number, number, number],
}

export const FLOW_COLORS: Record<'ingress' | 'app' | 'data' | 'egress', string> = {
  ingress: '#9ED4FF',
  app: '#ED7100',
  data: '#C925D1',
  egress: '#7AA116',
}

export function getOccupantPosition(occupant: CityOccupant): [number, number, number] {
  if (occupant.id === 'internet') return GATE_POSITIONS.internet
  if (occupant.id === 'igw') return GATE_POSITIONS.igw
  if (!occupant.az || !occupant.tier) return [0, 0.42, 0]

  const slot: 0 | 1 = occupant.kind === 'nat' || occupant.serviceId === 'rds' ? 1 : 0
  return getZoneSlot(occupant.az, occupant.tier, slot)
}
