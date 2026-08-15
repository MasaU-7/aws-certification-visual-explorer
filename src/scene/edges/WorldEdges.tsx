import { Line } from '@react-three/drei'
import type { CategoryNode } from '@/types/aws'

/**
 * Category 関係線 — 「依存・通信のハブ」として Networking を中心に。
 * サービス間の詳細エッジは Phase 2 で data/relationships へ移す。
 */
const EDGES: Array<[CategoryNode['id'], CategoryNode['id']]> = [
  // hub
  ['cdn', 'network'],
  ['compute', 'network'],
  ['storage', 'network'],
  ['database', 'network'],
  ['security', 'network'],
  // spokes that commonly co-design with compute
  ['compute', 'database'],
  ['compute', 'integration'],
  ['storage', 'cdn'],
  // ops / identity orbit
  ['security', 'management'],
  ['compute', 'management'],
]

interface WorldEdgesProps {
  nodes: CategoryNode[]
  highlightedCategories: Set<string>
}

export function WorldEdges({ nodes, highlightedCategories }: WorldEdgesProps) {
  const byId = new Map(nodes.map((n) => [n.id, n]))

  return (
    <>
      {EDGES.map(([a, b]) => {
        const na = byId.get(a)
        const nb = byId.get(b)
        if (!na || !nb) return null
        const lit = highlightedCategories.has(a) && highlightedCategories.has(b)
        return (
          <Line
            key={`${a}-${b}`}
            points={[na.position, nb.position]}
            color={lit ? '#7ec8ff' : '#2a3a4a'}
            lineWidth={lit ? 1.5 : 0.8}
            transparent
            opacity={lit ? 0.7 : 0.25}
          />
        )
      })}
    </>
  )
}
