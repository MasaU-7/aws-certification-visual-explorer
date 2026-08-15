import { QuadraticBezierLine } from '@react-three/drei'
import { getCityOccupant, vpcCity } from '@/data/vpc'
import { getArcMidpoint } from '@/scene/layout/serviceLayout'
import { FLOW_COLORS, getOccupantPosition } from '@/scene/vpc/cityLayout'
import { useExplorerStore } from '@/store/explorerStore'

export function CityEdges() {
  const selectedOccupantId = useExplorerStore((s) => s.selectedOccupantId)

  return (
    <>
      {vpcCity.flows.map((flow) => {
        const fromOcc = getCityOccupant(flow.from)
        const toOcc = getCityOccupant(flow.to)
        if (!fromOcc || !toOcc) return null
        const from = getOccupantPosition(fromOcc)
        const to = getOccupantPosition(toOcc)
        if (!from || !to) return null

        const linked =
          !selectedOccupantId ||
          flow.from === selectedOccupantId ||
          flow.to === selectedOccupantId
        const isEgress = flow.role === 'egress'
        const mid = getArcMidpoint(from, to, isEgress ? 0.55 : 0.28)

        return (
          <QuadraticBezierLine
            key={flow.id}
            start={from}
            end={to}
            mid={mid}
            color={FLOW_COLORS[flow.role]}
            lineWidth={linked ? (isEgress ? 1.5 : 2.1) : 1}
            transparent
            opacity={linked ? (isEgress ? 0.55 : 0.88) : 0.12}
            dashed={isEgress}
            dashScale={isEgress ? 1.8 : 1}
            gapSize={isEgress ? 0.1 : 0}
          />
        )
      })}
    </>
  )
}
