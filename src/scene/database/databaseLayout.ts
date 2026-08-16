import type { AvailabilityZoneId, CityOccupant, SubnetTier } from '@/types/aws'

const AZ_X: Record<AvailabilityZoneId, number> = {
  'az-a': -4.45,
  'az-b': 0,
  'az-c': 4.45,
}

const TIER_Z: Record<SubnetTier, number> = {
  public: 1.72,
  private: -1.78,
}

export const DATABASE_SUBNET_SIZE: [number, number, number] = [4.15, 0.06, 3.42]
export const DATABASE_AZ_SIZE: [number, number, number] = [4.35, 1.55, 6.85]
export const DATABASE_VPC_SIZE: [number, number, number] = [13.7, 1.75, 7.35]
export const DATABASE_AWS_SIZE: [number, number, number] = [21.4, 2.08, 8.75]
export const DATABASE_AWS_CENTER: [number, number, number] = [-2.15, 0.74, 0.22]
export const SERVERLESS_CENTER: [number, number, number] = [-9.35, 0.72, 1.05]
export const SERVERLESS_SIZE: [number, number, number] = [4.35, 1.35, 5.85]

export function getDatabaseAzCenter(az: AvailabilityZoneId): [number, number, number] {
  return [AZ_X[az], 0.55, 0.03]
}

export function getDatabaseSubnetCenter(az: AvailabilityZoneId, tier: SubnetTier): [number, number, number] {
  return [AZ_X[az], 0.02, TIER_Z[tier]]
}

function getPrivateSlot(
  az: AvailabilityZoneId,
  col: 0 | 1 | 2,
  row: 0 | 1 | 2,
): [number, number, number] {
  const [cx, , cz] = getDatabaseSubnetCenter(az, 'private')
  const dx = col === 0 ? -1.18 : col === 1 ? 0 : 1.18
  const dz = row === 0 ? 1.05 : row === 1 ? 0.05 : -0.95
  return [cx + dx, 0.42, cz + dz]
}

const FIXED_POSITIONS: Record<string, [number, number, number]> = {
  internet: [0, 1.85, 6.15],
  igw: [0, 0.55, 4.05],
  lambda: [-10.15, 1.15, 3.05],
  dynamodb: [-8.55, 1.15, 3.05],
  keyspaces: [-10.15, 1.15, 1.45],
  timestream: [-8.55, 1.15, 1.45],
  kinesis: [-10.15, 1.15, -0.15],
  s3: [-8.55, 1.15, -0.15],
  quicksight: [-9.35, 1.15, -1.65],
}

export function getDatabaseOccupantPosition(occupant: CityOccupant): [number, number, number] {
  const fixed = FIXED_POSITIONS[occupant.id]
  if (fixed) return fixed
  if (!occupant.az || !occupant.tier) return [0, 0.42, 0]

  if (occupant.tier === 'public') {
    const [cx, , cz] = getDatabaseSubnetCenter(occupant.az, 'public')
    const dx = occupant.kind === 'nat' ? 0.95 : -0.95
    return [cx + dx, 0.42, cz]
  }

  if (occupant.serviceId === 'elasticache') return getPrivateSlot(occupant.az, 1, 0)
  if (occupant.serviceId === 'memorydb') return getPrivateSlot(occupant.az, 2, 0)
  if (occupant.serviceId === 'rds') return getPrivateSlot(occupant.az, 0, 1)
  if (occupant.serviceId === 'aurora') return getPrivateSlot(occupant.az, 1, 1)
  if (occupant.serviceId === 'redshift') return getPrivateSlot(occupant.az, 2, 1)
  if (occupant.serviceId === 'neptune') return getPrivateSlot(occupant.az, 0, 2)
  if (occupant.serviceId === 'documentdb') return getPrivateSlot(occupant.az, 1, 2)
  return getPrivateSlot(occupant.az, 0, 0)
}
