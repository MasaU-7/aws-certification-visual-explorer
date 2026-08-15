import type { AwsService } from '@/types/aws'

/** カテゴリ球周囲のサービスリング半径 */
export const SERVICE_RING_RADIUS = 1.8

/**
 * カテゴリ原点を中心に、サービスを楕円リング上へ配置する。
 * ServiceNode と ServiceEdges で同じ座標を共有する。
 */
export function getServiceLayoutPosition(
  index: number,
  total: number,
  origin: [number, number, number],
): [number, number, number] {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2
  const x = origin[0] + Math.cos(angle) * SERVICE_RING_RADIUS
  const y = origin[1] + Math.sin(angle) * SERVICE_RING_RADIUS * 0.65
  const z = origin[2] + 0.4
  return [x, y, z]
}

export function buildServicePositionMap(
  services: AwsService[],
  origin: [number, number, number],
): Map<string, [number, number, number]> {
  const map = new Map<string, [number, number, number]>()
  for (let i = 0; i < services.length; i++) {
    map.set(services[i].id, getServiceLayoutPosition(i, services.length, origin))
  }
  return map
}

/** 2点間のベジェ中間点 — 線を少し持ち上げて重なりを減らす */
export function getArcMidpoint(
  from: [number, number, number],
  to: [number, number, number],
  bulge = 0.35,
): [number, number, number] {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const dz = to[2] - from[2]
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
  const lift = Math.min(bulge, dist * 0.25)
  return [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + lift, (from[2] + to[2]) / 2]
}
