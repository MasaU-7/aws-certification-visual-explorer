import { QuadraticBezierLine } from '@react-three/drei'
import { getArcMidpoint } from '@/scene/layout/serviceLayout'
import type { ServiceEdgeView } from '@/scene/layout/relatedServices'

interface ServiceEdgesProps {
  edges: ServiceEdgeView[]
}

export function ServiceEdges({ edges }: ServiceEdgesProps) {
  if (edges.length === 0) return null

  return (
    <>
      {edges.map((edge) => {
        const isIntra = edge.kind === 'intra'
        const mid = getArcMidpoint(edge.from, edge.to, isIntra ? 0.35 : 0.45)

        return (
          <QuadraticBezierLine
            key={edge.key}
            start={edge.from}
            end={edge.to}
            mid={mid}
            color={isIntra ? '#9ed4ff' : '#6a9ec8'}
            lineWidth={isIntra ? 2 : 1.4}
            transparent
            opacity={isIntra ? 0.85 : 0.55}
            dashed={!isIntra}
            dashScale={isIntra ? 1 : 2}
            gapSize={isIntra ? 0 : 0.12}
          />
        )
      })}
    </>
  )
}
