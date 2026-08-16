import type { AvailabilityZoneId, CityOccupant, SubnetTier } from '@/types/aws'

const AZ_X: Record<AvailabilityZoneId, number> = {
  'az-a': 0,
  'az-b': 0,
  'az-c': 0,
}

const TIER_Z: Record<SubnetTier, number> = {
  public: 1.42,
  private: -1.58,
}

export const SECURITY_SUBNET_SIZE: [number, number, number] = [4.55, 0.06, 2.82]
export const SECURITY_AZ_SIZE: [number, number, number] = [4.75, 1.55, 5.95]
export const SECURITY_VPC_SIZE: [number, number, number] = [5.25, 1.75, 6.45]
export const SECURITY_AWS_SIZE: [number, number, number] = [16.4, 2.08, 8.35]
export const SECURITY_AWS_CENTER: [number, number, number] = [0, 0.74, 0.22]
export const IDENTITY_CENTER: [number, number, number] = [-6.15, 0.72, 0.15]
export const IDENTITY_SIZE: [number, number, number] = [4.15, 1.35, 6.05]
export const DETECT_CENTER: [number, number, number] = [6.15, 0.72, 0.25]
export const DETECT_SIZE: [number, number, number] = [4.55, 1.35, 6.25]
export const EDGE_CENTER: [number, number, number] = [0, 0.92, 4.72]
export const EDGE_SIZE: [number, number, number] = [4.85, 1.15, 2.15]

export function getSecurityAzCenter(az: AvailabilityZoneId): [number, number, number] {
  return [AZ_X[az], 0.55, 0.03]
}

export function getSecuritySubnetCenter(az: AvailabilityZoneId, tier: SubnetTier): [number, number, number] {
  return [AZ_X[az], 0.02, TIER_Z[tier]]
}

function getPrivateSlot(
  az: AvailabilityZoneId,
  col: 0 | 1,
  row: 0 | 1,
): [number, number, number] {
  const [cx, , cz] = getSecuritySubnetCenter(az, 'private')
  const dx = col === 0 ? -1.05 : 1.05
  const dz = row === 0 ? 0.62 : -0.62
  return [cx + dx, 0.42, cz + dz]
}

const FIXED_POSITIONS: Record<string, [number, number, number]> = {
  internet: [0, 1.85, 6.25],
  waf: [-1.55, 1.15, 5.15],
  shield: [0, 1.15, 5.15],
  acm: [1.55, 1.15, 5.15],
  cloudfront: [0, 1.15, 4.05],
  igw: [0, 0.55, 3.45],
  organizations: [-6.75, 1.15, 2.35],
  iam: [-5.35, 1.15, 2.35],
  'identity-center': [-6.75, 1.15, 0.75],
  fms: [-5.35, 1.15, 0.75],
  kms: [-6.75, 1.15, -0.85],
  secrets: [-5.35, 1.15, -0.85],
  'security-hub': [6.15, 1.15, 2.55],
  guardduty: [5.15, 1.15, 1.05],
  inspector: [7.15, 1.15, 1.05],
  macie: [5.15, 1.15, -0.35],
  config: [7.15, 1.15, -0.35],
  cloudtrail: [5.15, 1.15, -1.75],
  s3: [7.15, 1.15, -1.75],
}

export function getSecurityOccupantPosition(occupant: CityOccupant): [number, number, number] {
  const fixed = FIXED_POSITIONS[occupant.id]
  if (fixed) return fixed
  if (!occupant.az || !occupant.tier) return [0, 0.42, 0]

  if (occupant.tier === 'public') {
    const [cx, , cz] = getSecuritySubnetCenter(occupant.az, 'public')
    const dx = occupant.kind === 'nat' ? 1.05 : -1.05
    return [cx + dx, 0.42, cz]
  }

  if (occupant.serviceId === 'cloudhsm') return getPrivateSlot(occupant.az, 1, 0)
  if (occupant.serviceId === 'directory-service') return getPrivateSlot(occupant.az, 0, 1)
  if (occupant.serviceId === 'rds') return getPrivateSlot(occupant.az, 1, 1)
  return getPrivateSlot(occupant.az, 0, 0)
}
