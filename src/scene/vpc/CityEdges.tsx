import { QuadraticBezierLine } from '@react-three/drei'
import { getCityOccupant, vpcCity } from '@/data/vpc'
import { getArcMidpoint } from '@/scene/layout/serviceLayout'
import { FLOW_COLORS, getOccupantPosition, isInternetVpnHop } from '@/scene/vpc/cityLayout'
import { useExplorerStore } from '@/store/explorerStore'

function isLinkedOccupant(
  occupant: { id: string; serviceId?: string },
  selectedOccupantId: string | null,
  selectedServiceId: string | null,
) {
  if (occupant.id === selectedOccupantId) return true
  return Boolean(occupant.serviceId && occupant.serviceId === selectedServiceId)
}

const VPN_TUNNEL_FLOWS = new Set(['vpn-over-net', 'vpn-in', 'vpn-vgw', 'vgw-a', 'vgw-b'])

export function CityEdges() {
  const selectedOccupantId = useExplorerStore((s) => s.selectedOccupantId)
  const selectedServiceId = useExplorerStore((s) => s.selectedServiceId)

  return (
    <>
      {vpcCity.flows.map((flow) => {
        const fromOcc = getCityOccupant(flow.from)
        const toOcc = getCityOccupant(flow.to)
        if (!fromOcc || !toOcc) return null
        const from = getOccupantPosition(fromOcc)
        const to = getOccupantPosition(toOcc)
        if (!from || !to) return null

        const focused =
          Boolean(selectedOccupantId) || Boolean(selectedServiceId && selectedServiceId !== 'vpc')
        const vpnFocus =
          selectedOccupantId === 'vpn' ||
          selectedOccupantId === 'vgw' ||
          selectedOccupantId === 'onprem' ||
          selectedServiceId === 'site-to-site-vpn' ||
          selectedServiceId === 'vpn-gateway'
        const linked =
          !focused ||
          isLinkedOccupant(fromOcc, selectedOccupantId, selectedServiceId) ||
          isLinkedOccupant(toOcc, selectedOccupantId, selectedServiceId) ||
          (vpnFocus && VPN_TUNNEL_FLOWS.has(flow.id))
        const dashed = flow.role === 'egress' || isInternetVpnHop(flow.from, flow.to)
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
