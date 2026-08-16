import type { AvailabilityZoneId, CityOccupant, SubnetTier } from '@/types/aws'

const AZ_X: Record<AvailabilityZoneId, number> = {
  'az-a': -2.35,
  'az-b': 2.35,
}

const TIER_Z: Record<SubnetTier, number> = {
  public: 1.32,
  private: -1.38,
}

export const MANAGEMENT_SUBNET_SIZE: [number, number, number] = [4.35, 0.06, 2.55]
export const MANAGEMENT_AZ_SIZE: [number, number, number] = [4.55, 1.55, 5.55]
export const MANAGEMENT_VPC_SIZE: [number, number, number] = [9.5, 1.75, 6.05]
export const MANAGEMENT_AWS_SIZE: [number, number, number] = [17.4, 2.08, 9.15]
export const MANAGEMENT_AWS_CENTER: [number, number, number] = [1.75, 0.74, 0.05]
export const OPS_CENTER: [number, number, number] = [6.45, 0.72, 0.05]
export const OPS_SIZE: [number, number, number] = [4.55, 1.35, 7.35]

export function getManagementAzCenter(az: AvailabilityZoneId): [number, number, number] {
  return [AZ_X[az], 0.55, 0.03]
}

export function getManagementSubnetCenter(az: AvailabilityZoneId, tier: SubnetTier): [number, number, number] {
  return [AZ_X[az], 0.02, TIER_Z[tier]]
}

const FIXED_POSITIONS: Record<string, [number, number, number]> = {
  internet: [0, 1.85, 5.65],
  igw: [0, 0.55, 3.55],
  cloudwatch: [5.55, 1.15, 2.85],
  asg: [7.35, 1.15, 2.85],
  cloudtrail: [5.55, 1.15, 1.45],
  config: [7.35, 1.15, 1.45],
  s3: [5.55, 1.15, 0.05],
  cfn: [7.35, 1.15, 0.05],
  ssm: [5.55, 1.15, -1.35],
  sns: [7.35, 1.15, -1.35],
  'cost-explorer': [5.55, 1.15, -2.75],
  budgets: [7.35, 1.15, -2.75],
}

export function getManagementOccupantPosition(occupant: CityOccupant): [number, number, number] {
  const fixed = FIXED_POSITIONS[occupant.id]
  if (fixed) return fixed
  if (!occupant.az || !occupant.tier) return [0, 0.42, 0]

  if (occupant.tier === 'public') {
    const [cx, , cz] = getManagementSubnetCenter(occupant.az, 'public')
    const dx = occupant.kind === 'nat' ? 0.95 : -0.95
    return [cx + dx, 0.42, cz]
  }

  const [cx, , cz] = getManagementSubnetCenter(occupant.az, 'private')
  return [cx, 0.42, cz]
}
