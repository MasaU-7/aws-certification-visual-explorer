import type { AvailabilityZoneId, CityFlowRole, CityOccupant, SubnetTier } from '@/types/aws'

export const VPC_COLOR = '#8C4FFF'
export const AZ_COLOR = '#E8A317'
export const PUBLIC_COLOR = '#3FA36A'
export const PRIVATE_COLOR = '#3D7EC9'
export const INTERNET_COLOR = '#9ED4FF'
export const AWS_CLOUD_COLOR = '#5B8DEF'
export const ONPREM_COLOR = '#8A93A6'

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
export const AWS_CLOUD_SIZE: [number, number, number] = [11.55, 2.08, 7.15]
export const ONPREM_SIZE: [number, number, number] = [2.35, 1.25, 3.55]

/** VPC + VGW / TGW / DX GW / Client VPN。Internet と On-prem は外側。 */
export const AWS_CLOUD_CENTER: [number, number, number] = [-1.05, 0.74, 0.38]
export const ONPREM_CENTER: [number, number, number] = [-9.85, 0.64, 0.03]

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

const FIXED_POSITIONS: Record<string, [number, number, number]> = {
  route53: [0, 2.42, 6.78],
  internet: [0, 1.85, 5.55],
  igw: [0, 0.55, 3.42],
  tgw: [-5.35, 0.55, 1.05],
  dxgw: [-6.2, 0.55, 0.03],
  dx: [-7.7, 0.55, 0.03],
  vpn: [-5.95, 0.55, -1.32],
  vgw: [-4.55, 0.55, -1.32],
  'client-vpn': [-5.35, 0.55, 2.18],
  onprem: [-9.85, 0.95, 0.03],
}

export const FLOW_COLORS: Record<CityFlowRole, string> = {
  ingress: '#9ED4FF',
  app: '#ED7100',
  data: '#C925D1',
  egress: '#7AA116',
  hybrid: '#A78BFA',
  scale: '#FFB020',
  event: '#E7157B',
}

export function getOccupantPosition(occupant: CityOccupant): [number, number, number] {
  const fixed = FIXED_POSITIONS[occupant.id]
  if (fixed) return fixed
  if (!occupant.az || !occupant.tier) return [0, 0.42, 0]

  const slot: 0 | 1 = occupant.kind === 'nat' || occupant.serviceId === 'rds' ? 1 : 0
  return getZoneSlot(occupant.az, occupant.tier, slot)
}
