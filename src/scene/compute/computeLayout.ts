import type { AvailabilityZoneId, CityOccupant, SubnetTier } from '@/types/aws'

const AZ_X: Record<AvailabilityZoneId, number> = {
  'az-a': -2.35,
  'az-b': 2.35,
  'az-c': 0,
}

const TIER_Z: Record<SubnetTier, number> = {
  public: 1.32,
  private: -1.38,
}

export const COMPUTE_SUBNET_SIZE: [number, number, number] = [4.35, 0.06, 2.55]
export const COMPUTE_AZ_SIZE: [number, number, number] = [4.55, 1.55, 5.55]
export const COMPUTE_VPC_SIZE: [number, number, number] = [9.5, 1.75, 6.05]
export const COMPUTE_AWS_SIZE: [number, number, number] = [16.4, 2.08, 7.55]
export const COMPUTE_AWS_CENTER: [number, number, number] = [-1.95, 0.74, 0.28]
export const MANAGED_CENTER: [number, number, number] = [-6.95, 0.72, 1.35]
export const MANAGED_SIZE: [number, number, number] = [3.75, 1.35, 4.85]

export function getComputeAzCenter(az: AvailabilityZoneId): [number, number, number] {
  return [AZ_X[az], 0.55, 0.03]
}

export function getComputeSubnetCenter(az: AvailabilityZoneId, tier: SubnetTier): [number, number, number] {
  return [AZ_X[az], 0.02, TIER_Z[tier]]
}

function getPrivateSlot(
  az: AvailabilityZoneId,
  col: 0 | 1,
  row: 0 | 1,
): [number, number, number] {
  const [cx, , cz] = getComputeSubnetCenter(az, 'private')
  const dx = col === 0 ? -0.95 : 0.95
  const dz = row === 0 ? 0.48 : -0.48
  return [cx + dx, 0.42, cz + dz]
}

const FIXED_POSITIONS: Record<string, [number, number, number]> = {
  internet: [0, 1.85, 5.55],
  igw: [0, 0.55, 3.55],
  cloudwatch: [0, 2.08, 0.55],
  s3: [-6.25, 1.15, 2.95],
  sqs: [-6.25, 1.15, 1.35],
  dynamodb: [-6.25, 1.15, -0.25],
  lambda: [-7.75, 1.15, 1.35],
  asg: [0, 1.72, -1.15],
  batch: [-7.75, 1.15, 2.95],
}

export function getComputeOccupantPosition(occupant: CityOccupant): [number, number, number] {
  const fixed = FIXED_POSITIONS[occupant.id]
  if (fixed) return fixed
  if (!occupant.az || !occupant.tier) return [0, 0.42, 0]

  if (occupant.tier === 'public') {
    const [cx, , cz] = getComputeSubnetCenter(occupant.az, 'public')
    const dx = occupant.kind === 'nat' ? 0.95 : -0.95
    return [cx + dx, 0.42, cz]
  }

  if (occupant.id === 'lambda-vpc') return getPrivateSlot(occupant.az, 0, 1)
  if (occupant.serviceId === 'batch') return getPrivateSlot(occupant.az, 1, 1)
  if (occupant.serviceId === 'ecs') return getPrivateSlot(occupant.az, 1, 0)
  return getPrivateSlot(occupant.az, 0, 0)
}

