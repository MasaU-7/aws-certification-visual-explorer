import { Line } from '@react-three/drei'
import type { CategoryNode } from '@/types/aws'

const EDGES: Array<[CategoryNode['id'], CategoryNode['id']]> = [
  ['cdn', 'network'],
  ['compute', 'network'],
  ['network', 'security'],
  ['network', 'database'],
  ['network', 'storage'],
  ['compute', 'database'],
  ['compute', 'integration'],
  ['security', 'management'],
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
