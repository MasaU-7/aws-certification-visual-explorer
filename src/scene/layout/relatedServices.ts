import { categoryNodes } from '@/data/categories'
import { getServiceById } from '@/data/services'
import { buildServicePositionMap, getServiceLayoutPosition } from '@/scene/layout/serviceLayout'
import type { AwsService, CategoryNode, ServiceCategory } from '@/types/aws'

export interface GhostServiceView {
  service: AwsService
  position: [number, number, number]
}

export interface ServiceEdgeView {
  key: string
  from: [number, number, number]
  to: [number, number, number]
  kind: 'intra' | 'ghost'
}

export interface RelationshipGraph {
  ghosts: GhostServiceView[]
  edges: ServiceEdgeView[]
}

function getServicePositionInHomeCategory(
  service: AwsService,
  certServices: AwsService[],
  categoryById: Map<ServiceCategory, CategoryNode>,
): [number, number, number] | null {
  const category = categoryById.get(service.category)
  if (!category) return null

  const siblings = certServices.filter((s) => s.category === service.category)
  const index = siblings.findIndex((s) => s.id === service.id)
  if (index < 0) return null

  return getServiceLayoutPosition(index, siblings.length, category.position)
}

export function buildRelationshipGraph(
  selectedServiceId: string | null,
  servicesInCategory: AwsService[],
  categoryOrigin: [number, number, number],
  certServiceIds: Set<string>,
  certServices: AwsService[],
): RelationshipGraph {
  if (!selectedServiceId) {
    return { ghosts: [], edges: [] }
  }

  const source = getServiceById(selectedServiceId)
  if (!source) {
    return { ghosts: [], edges: [] }
  }

  const categoryById = new Map(categoryNodes.map((n) => [n.id, n]))
  const positionsInCategory = buildServicePositionMap(servicesInCategory, categoryOrigin)

  const sourcePos =
    positionsInCategory.get(selectedServiceId) ??
    getServicePositionInHomeCategory(source, certServices, categoryById)

  if (!sourcePos) {
    return { ghosts: [], edges: [] }
  }

  const ghostMap = new Map<string, GhostServiceView>()
  const edges: ServiceEdgeView[] = []

  const ensureGhost = (service: AwsService) => {
    const existing = ghostMap.get(service.id)
    if (existing) return existing

    const position = getServicePositionInHomeCategory(service, certServices, categoryById)
    if (!position) return null

    const view = { service, position }
    ghostMap.set(service.id, view)
    return view
  }

  if (!positionsInCategory.has(selectedServiceId)) {
    ensureGhost(source)
  }

  for (const targetId of source.relationships) {
    if (!certServiceIds.has(targetId)) continue

    const target = getServiceById(targetId)
    if (!target) continue

    const inCategory = positionsInCategory.has(targetId)
    if (inCategory) {
      const targetPos = positionsInCategory.get(targetId)!
      edges.push({
        key: `${selectedServiceId}->${targetId}`,
        from: sourcePos,
        to: targetPos,
        kind: 'intra',
      })
      continue
    }

    const ghost = ensureGhost(target)
    if (!ghost) continue

    edges.push({
      key: `${selectedServiceId}->${targetId}`,
      from: sourcePos,
      to: ghost.position,
      kind: 'ghost',
    })
  }

  return {
    ghosts: Array.from(ghostMap.values()),
    edges,
  }
}
