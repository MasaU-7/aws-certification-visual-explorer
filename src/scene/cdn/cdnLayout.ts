import type { AvailabilityZoneId, CityOccupant, SubnetTier } from '@/types/aws'

const AZ_X: Record<AvailabilityZoneId, number> = {
  'az-a': 0,
  'az-b': 0,
  'az-c': 0,
}

const TIER_Z: Record<SubnetTier, number> = {
  public: 0.22,
  private: -2.12,
}

export const CDN_SUBNET_SIZE: [number, number, number] = [4.35, 0.06, 2.05]
export const CDN_AZ_SIZE: [number, number, number] = [4.55, 1.55, 4.65]
export const CDN_VPC_SIZE: [number, number, number] = [5.05, 1.75, 5.15]
export const CDN_REGION_A_SIZE: [number, number, number] = [11.4, 2.08, 6.35]
export const CDN_REGION_A_CENTER: [number, number, number] = [2.35, 0.74, -0.85]
export const CDN_REGION_B_SIZE: [number, number, number] = [3.55, 1.55, 4.35]
export const CDN_REGION_B_CENTER: [number, number, number] = [10.35, 0.74, -0.85]
export const CDN_EDGE_SIZE: [number, number, number] = [14.35, 1.55, 2.45]
export const CDN_EDGE_CENTER: [number, number, number] = [3.35, 0.78, 3.62]
export const CDN_ORIGIN_SIZE: [number, number, number] = [3.35, 1.35, 4.15]
export const CDN_ORIGIN_CENTER: [number, number, number] = [5.95, 0.72, -0.75]

export function getCdnAzCenter(az: AvailabilityZoneId): [number, number, number] {
  return [AZ_X[az], 0.55, -0.92]
}

export function getCdnSubnetCenter(az: AvailabilityZoneId, tier: SubnetTier): [number, number, number] {
  return [AZ_X[az], 0.02, TIER_Z[tier]]
}

const FIXED_POSITIONS: Record<string, [number, number, number]> = {
  route53: [3.35, 2.42, 7.05],
  internet: [3.35, 1.85, 5.85],
  waf: [-1.15, 0.92, 4.05],
  shield: [-1.15, 0.92, 3.15],
  acm: [0.55, 0.92, 2.85],
  cloudfront: [1.55, 0.92, 3.85],
  'lambda-edge': [3.05, 0.92, 3.85],
  ga: [5.35, 0.92, 3.62],
  igw: [0, 0.55, 1.72],
  s3: [5.95, 1.15, 0.35],
  lambda: [5.95, 1.15, -1.55],
  'nlb-r2': [10.35, 1.15, 0.25],
  'ec2-r2': [10.35, 1.15, -1.45],
}

export function getCdnOccupantPosition(occupant: CityOccupant): [number, number, number] {
  const fixed = FIXED_POSITIONS[occupant.id]
  if (fixed) return fixed
  if (!occupant.az || !occupant.tier) return [0, 0.42, 0]

  const [cx, , cz] = getCdnSubnetCenter(occupant.az, occupant.tier)
  if (occupant.tier === 'public') {
    const dx = occupant.id.startsWith('nlb') ? 0.95 : -0.95
    return [cx + dx, 0.42, cz]
  }
  return [cx, 0.42, cz]
}
