import type { AwsService } from '@/types/aws'

/** カテゴリ球周囲の内側リング半径 */
export const SERVICE_RING_RADIUS = 2.2

function ringForIndex(index: number, total: number): { index: number; total: number; radius: number } {
  if (total <= 8) {
    const radius = total >= 6 ? SERVICE_RING_RADIUS + 0.2 : SERVICE_RING_RADIUS
    return { index, total, radius }
  }

  const innerCount = Math.ceil(total / 2)
  const isOuter = index >= innerCount
  return {
    index: isOuter ? index - innerCount : index,
    total: isOuter ? total - innerCount : innerCount,
    radius: isOuter ? SERVICE_RING_RADIUS * 1.55 : SERVICE_RING_RADIUS,
  }
}

/**
 * カテゴリ原点を中心に、サービスを楕円リング上へ配置する。
 * 数が多いカテゴリは二重リングにして重なりを避ける。
 */
export function getServiceLayoutPosition(
  index: number,
  total: number,
  origin: [number, number, number],
): [number, number, number] {
  const ring = ringForIndex(index, total)
  const angle = (ring.index / Math.max(ring.total, 1)) * Math.PI * 2 - Math.PI / 2
  const x = origin[0] + Math.cos(angle) * ring.radius
  const y = origin[1] + Math.sin(angle) * ring.radius * 0.65
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
