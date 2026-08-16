import { QuadraticBezierLine } from '@react-three/drei'
import { useLayoutEffect, useRef } from 'react'
import { Mesh, Vector3 } from 'three'
import { getArcMidpoint } from '@/scene/layout/serviceLayout'
import {
  flowBulge,
  flowColor,
  flowDashScale,
  flowGapSize,
  flowIsDashed,
  flowLineWidth,
  flowOpacity,
} from '@/scene/edges/cityFlowStyle'
import { useExplorerStore } from '@/store/explorerStore'
import type { CityOccupant, VpcCityDefinition } from '@/types/aws'

function isLinkedOccupant(
  occupant: { id: string; serviceId?: string },
  selectedOccupantId: string | null,
  selectedServiceId: string | null,
) {
  if (occupant.id === selectedOccupantId) return true
  return Boolean(occupant.serviceId && occupant.serviceId === selectedServiceId)
}

function quadraticPoint(
  start: [number, number, number],
  mid: [number, number, number],
  end: [number, number, number],
  t: number,
): Vector3 {
  const u = 1 - t
  return new Vector3(
    u * u * start[0] + 2 * u * t * mid[0] + t * t * end[0],
    u * u * start[1] + 2 * u * t * mid[1] + t * t * end[1],
    u * u * start[2] + 2 * u * t * mid[2] + t * t * end[2],
  )
}

function FlowArrow({
  start,
  mid,
  end,
  towardEnd,
  color,
  opacity,
}: {
  start: [number, number, number]
  mid: [number, number, number]
  end: [number, number, number]
  towardEnd: boolean
  color: string
  opacity: number
}) {
  const ref = useRef<Mesh>(null)

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const t = towardEnd ? 0.86 : 0.14
    const tNext = towardEnd ? 0.97 : 0.03
    const from = quadraticPoint(start, mid, end, t)
    const to = quadraticPoint(start, mid, end, tNext)
    const dir = to.sub(from).normalize()
    mesh.position.copy(from)
    mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), dir)
  }, [start, mid, end, towardEnd])

  return (
    <mesh ref={ref}>
      <coneGeometry args={[0.055, 0.15, 8]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  )
}

interface CityEdgesProps {
  city: VpcCityDefinition
  getOccupant: (id: string) => CityOccupant | undefined
  getPosition: (occupant: CityOccupant) => [number, number, number]
  hubServiceId?: string | null
  extraLinkedFlowIds?: (selectedOccupantId: string | null, selectedServiceId: string | null) => Set<string>
}

export function CityEdges({
  city,
  getOccupant,
  getPosition,
  hubServiceId = 'vpc',
  extraLinkedFlowIds,
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
        const dashed = flowIsDashed(flow)
        const mid = getArcMidpoint(from, to, flowBulge(flow))
        const color = flowColor(flow)
        const opacity = flowOpacity(flow, linked)
        const showFwd = linked && (flow.direction === 'fwd' || flow.direction === 'both')
        const showBack = linked && flow.direction === 'both'

        return (
          <group key={flow.id}>
            <QuadraticBezierLine
              start={from}
              end={to}
              mid={mid}
              color={color}
              lineWidth={flowLineWidth(flow, linked)}
              transparent
              opacity={opacity}
              dashed={dashed}
              dashScale={dashed ? flowDashScale(flow) : 1}
              gapSize={dashed ? flowGapSize(flow) : 0}
            />
            {showFwd ? (
              <FlowArrow start={from} mid={mid} end={to} towardEnd color={color} opacity={opacity} />
            ) : null}
            {showBack ? (
              <FlowArrow start={from} mid={mid} end={to} towardEnd={false} color={color} opacity={opacity} />
            ) : null}
          </group>
        )
      })}
    </>
  )
}
