import type {
  CityFlow,
  CityFlowRole,
  CityLinkDirection,
  CityLinkKind,
  CityLinkOverlay,
} from '@/types/aws'

export function cityLink(
  id: string,
  from: string,
  to: string,
  role: CityFlowRole,
  kind: CityLinkKind = 'path',
  direction: CityLinkDirection = 'fwd',
  overlay?: CityLinkOverlay,
): CityFlow {
  return overlay
    ? { id, from, to, role, kind, direction, overlay }
    : { id, from, to, role, kind, direction }
}
