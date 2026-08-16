import { QuadraticBezierLine } from '@react-three/drei'
import { getArcMidpoint } from '@/scene/layout/serviceLayout'
import { FLOW_COLORS } from '@/scene/vpc/cityLayout'
import { useExplorerStore } from '@/store/explorerStore'
import type { CityFlow, CityOccupant, VpcCityDefinition } from '@/types/aws'

function isLinkedOccupant(
  occupant: { id: string; serviceId?: string },
  selectedOccupantId: string | null,
  selectedServiceId: string | null,
) {
  if (occupant.id === selectedOccupantId) return true
  return Boolean(occupant.serviceId && occupant.serviceId === selectedServiceId)
}

interface CityEdgesProps {
  city: VpcCityDefinition
  getOccupant: (id: string) => CityOccupant | undefined
  getPosition: (occupant: CityOccupant) => [number, number, number]
  hubServiceId?: string | null
  extraLinkedFlowIds?: (selectedOccupantId: string | null, selectedServiceId: string | null) => Set<string>
  isDashed?: (flow: CityFlow) => boolean
}

export function CityEdges({
  city,
  getOccupant,
  getPosition,
  hubServiceId = 'vpc',
  extraLinkedFlowIds,
  isDashed,
}: CityEdgesProps) {
  const selectedOccupantId = useExplorerStore((s) => s.selectedOccupantId)
  const selectedServiceId = useExplorerStore((s) => s.selectedServiceId)
  const extra = extraLinkedFlowIds?.(selectedOccupantId, selectedServiceId) ?? new Set<string>()

  return (
    <>
      {city.flows.map((flow) => {
        const fromOcc = getOccupant(flow.from)
        const toOcc = getOccupant(flow.to)
        if (!fromOcc || !toOcc) return null
        const from = getPosition(fromOcc)
        const to = getPosition(toOcc)
        if (!from || !to) return null

        const focused =
          Boolean(selectedOccupantId) || Boolean(selectedServiceId && selectedServiceId !== hubServiceId)
        const linked =
          !focused ||
          isLinkedOccupant(fromOcc, selectedOccupantId, selectedServiceId) ||
          isLinkedOccupant(toOcc, selectedOccupantId, selectedServiceId) ||
          extra.has(flow.id)
        const dashed = isDashed ? isDashed(flow) : flow.role === 'egress'
        const mid = getArcMidpoint(from, to, dashed ? 0.55 : 0.28)

        return (
          <QuadraticBezierLine
            key={flow.id}
            start={from}
            end={to}
            mid={mid}
            color={FLOW_COLORS[flow.role]}
            lineWidth={linked ? (dashed ? 1.5 : 2.1) : 1}
            transparent
            opacity={linked ? (dashed ? 0.55 : 0.88) : 0.12}
            dashed={dashed}
            dashScale={dashed ? 1.8 : 1}
            gapSize={dashed ? 0.1 : 0}
          />
        )
      })}
    </>
  )
}
