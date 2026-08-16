import type { AvailabilityZoneId, CityOccupant, SubnetTier } from '@/types/aws'

const AZ_X: Record<AvailabilityZoneId, number> = {
  'az-a': 0,
  'az-b': 0,
  'az-c': 0,
}

const TIER_Z: Record<SubnetTier, number> = {
  public: 1.32,
  private: -1.38,
}

export const ANALYTICS_SUBNET_SIZE: [number, number, number] = [4.35, 0.06, 2.55]
export const ANALYTICS_AZ_SIZE: [number, number, number] = [4.55, 1.55, 5.55]
export const ANALYTICS_VPC_SIZE: [number, number, number] = [5.05, 1.75, 6.05]
export const ANALYTICS_AWS_SIZE: [number, number, number] = [13.2, 2.08, 7.85]
export const ANALYTICS_AWS_CENTER: [number, number, number] = [2.55, 0.74, 0.22]
export const LAKE_CENTER: [number, number, number] = [5.55, 0.72, 0.45]
export const LAKE_SIZE: [number, number, number] = [4.55, 1.35, 5.95]

export function getAnalyticsAzCenter(az: AvailabilityZoneId): [number, number, number] {
  return [AZ_X[az], 0.55, 0.03]
}

export function getAnalyticsSubnetCenter(az: AvailabilityZoneId, tier: SubnetTier): [number, number, number] {
  return [AZ_X[az], 0.02, TIER_Z[tier]]
}

function getPrivateSlot(
  az: AvailabilityZoneId,
  col: 0 | 1,
  row: 0 | 1,
): [number, number, number] {
  const [cx, , cz] = getAnalyticsSubnetCenter(az, 'private')
  const dx = col === 0 ? -0.95 : 0.95
  const dz = row === 0 ? 0.48 : -0.48
  return [cx + dx, 0.42, cz + dz]
}

const FIXED_POSITIONS: Record<string, [number, number, number]> = {
  internet: [0, 1.85, 5.65],
  igw: [0, 0.55, 3.55],
  kinesis: [4.65, 1.15, 2.65],
  lambda: [6.45, 1.15, 2.65],
  s3: [5.55, 1.15, 1.05],
  athena: [4.65, 1.15, -0.45],
  quicksight: [6.45, 1.15, -0.45],
  timestream: [4.65, 1.15, -1.95],
  emr: [6.45, 1.15, -1.95],
}

export function getAnalyticsOccupantPosition(occupant: CityOccupant): [number, number, number] {
  const fixed = FIXED_POSITIONS[occupant.id]
  if (fixed) return fixed
  if (!occupant.az || !occupant.tier) return [0, 0.42, 0]

  if (occupant.tier === 'public') {
    const [cx, , cz] = getAnalyticsSubnetCenter(occupant.az, 'public')
    const dx = occupant.kind === 'nat' ? 0.95 : -0.95
    return [cx + dx, 0.42, cz]
  }

  if (occupant.serviceId === 'emr') return getPrivateSlot(occupant.az, 1, 0)
  if (occupant.serviceId === 'redshift') return getPrivateSlot(occupant.az, 1, 1)
  if (occupant.serviceId === 'rds') return getPrivateSlot(occupant.az, 0, 1)
  return getPrivateSlot(occupant.az, 0, 0)
}
