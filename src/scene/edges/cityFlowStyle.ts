import type { CityFlow, CityLinkKind, CityLinkOverlay } from '@/types/aws'
import { FLOW_COLORS } from '@/scene/vpc/cityLayout'

export const LINK_KIND_LABEL: Record<CityLinkKind, string> = {
  path: '導線',
  attach: 'アタッチ',
  associate: '関連付け',
  access: 'アクセス可',
}

export const LINK_OVERLAY_LABEL: Record<CityLinkOverlay, string> = {
  internet: 'Internet 経由',
  offline: 'オフライン',
}

export const ATTACH_COLOR = '#FFB020'
export const ASSOCIATE_COLOR = '#C4B0FF'
export const ACCESS_COLOR = '#8FBC3A'

export function flowColor(flow: CityFlow): string {
  if (flow.kind === 'attach') return ATTACH_COLOR
  if (flow.kind === 'associate') return ASSOCIATE_COLOR
  if (flow.kind === 'access') return ACCESS_COLOR
  return FLOW_COLORS[flow.role]
}

export function flowIsDashed(flow: CityFlow): boolean {
  return flow.kind === 'access' || flow.kind === 'associate' || Boolean(flow.overlay)
}

export function flowDashScale(flow: CityFlow): number {
  if (flow.overlay === 'offline') return 3.4
  if (flow.overlay === 'internet') return 2.2
  if (flow.kind === 'associate') return 0.7
  if (flow.kind === 'access') return 1.6
  return 1
}

export function flowLineWidth(flow: CityFlow, linked: boolean): number {
  if (!linked) return 1
  if (flow.kind === 'attach') return 2.55
  if (flow.kind === 'associate') return 1.85
  if (flow.kind === 'access' || flow.overlay) return 1.55
  return 2.1
}

export function flowOpacity(flow: CityFlow, linked: boolean): number {
  if (!linked) return 0.12
  if (flow.kind === 'access' || flow.overlay) return 0.62
  if (flow.kind === 'associate') return 0.78
  return 0.9
}

export function flowGapSize(flow: CityFlow): number {
  if (flow.kind === 'associate') return 0.18
  if (flowIsDashed(flow)) return 0.1
  return 0
}

export function flowBulge(flow: CityFlow): number {
  if (flow.kind === 'attach' || flow.kind === 'associate') return 0.12
  if (flowIsDashed(flow)) return 0.5
  return 0.28
}
