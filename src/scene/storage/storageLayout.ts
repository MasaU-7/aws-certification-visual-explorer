import type { AvailabilityZoneId, CityOccupant, SubnetTier } from '@/types/aws'

const AZ_X: Record<AvailabilityZoneId, number> = {
  'az-a': -2.35,
  'az-b': 2.35,
}

const TIER_Z: Record<SubnetTier, number> = {
  public: 1.32,
  private: -1.48,
}

export const STORAGE_SUBNET_SIZE: [number, number, number] = [4.35, 0.06, 2.62]
export const STORAGE_AZ_SIZE: [number, number, number] = [4.55, 1.55, 5.65]
export const STORAGE_VPC_SIZE: [number, number, number] = [9.5, 1.75, 6.15]
export const STORAGE_AWS_SIZE: [number, number, number] = [16.6, 2.08, 7.65]
export const STORAGE_AWS_CENTER: [number, number, number] = [0.55, 0.74, 0.28]
export const OBJECT_CENTER: [number, number, number] = [6.05, 0.72, 1.05]
export const OBJECT_SIZE: [number, number, number] = [3.55, 1.35, 5.15]
export const STORAGE_ONPREM_CENTER: [number, number, number] = [-9.85, 0.64, 0.03]
export const STORAGE_ONPREM_SIZE: [number, number, number] = [2.55, 1.25, 4.15]

export function getStorageAzCenter(az: AvailabilityZoneId): [number, number, number] {
  return [AZ_X[az], 0.55, 0.03]
}

export function getStorageSubnetCenter(az: AvailabilityZoneId, tier: SubnetTier): [number, number, number] {
  return [AZ_X[az], 0.02, TIER_Z[tier]]
}

function getPrivateSlot(
  az: AvailabilityZoneId,
  col: 0 | 1,
  row: 0 | 1,
): [number, number, number] {
  const [cx, , cz] = getStorageSubnetCenter(az, 'private')
  const dx = col === 0 ? -0.95 : 0.95
  const dz = row === 0 ? 0.52 : -0.52
  return [cx + dx, 0.42, cz + dz]
}

const FIXED_POSITIONS: Record<string, [number, number, number]> = {
  internet: [0, 1.85, 5.55],
  igw: [0, 0.55, 3.55],
  transfer: [6.05, 1.15, 2.85],
  datasync: [6.05, 1.15, 1.25],
  s3: [6.05, 1.15, -0.45],
  onprem: [-9.85, 0.95, 1.15],
  sgw: [-9.85, 0.95, -0.15],
  snowball: [-9.85, 0.95, -1.35],
}

export function getStorageOccupantPosition(occupant: CityOccupant): [number, number, number] {
  const fixed = FIXED_POSITIONS[occupant.id]
  if (fixed) return fixed
  if (!occupant.az || !occupant.tier) return [0, 0.42, 0]

  if (occupant.tier === 'public') {
    const [cx, , cz] = getStorageSubnetCenter(occupant.az, 'public')
    return [cx + 0.95, 0.42, cz]
  }

  if (occupant.serviceId === 'ebs') return getPrivateSlot(occupant.az, 1, 0)
  if (occupant.serviceId === 'efs') return getPrivateSlot(occupant.az, 0, 1)
  if (occupant.serviceId === 'fsx') return getPrivateSlot(occupant.az, 1, 1)
  return getPrivateSlot(occupant.az, 0, 0)
}
