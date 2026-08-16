import { getCityOccupant, vpcCity } from '@/data/vpc'
import { CityDistricts } from '@/scene/vpc/CityDistricts'
import { CityEdges } from '@/scene/vpc/CityEdges'
import { CityOccupantNode } from '@/scene/vpc/CityOccupantNode'
import { getOccupantPosition, isInternetVpnHop } from '@/scene/vpc/cityLayout'
import { useExplorerStore } from '@/store/explorerStore'

const VPN_TUNNEL_FLOWS = new Set(['vpn-over-net', 'vpn-in', 'vpn-vgw', 'vgw-a', 'vgw-b'])

export function VpcCityContent() {
  const selectOccupant = useExplorerStore((s) => s.selectOccupant)

  return (
    <>
      <color attach="background" args={['#070b14']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 10, 8]} intensity={1.15} color="#9ec9ff" />
      <pointLight position={[-6, 4, -4]} intensity={0.45} color="#8C4FFF" />

      <CityDistricts />
      <CityEdges
        city={vpcCity}
        getOccupant={getCityOccupant}
        getPosition={getOccupantPosition}
        extraLinkedFlowIds={(occupantId, serviceId) => {
          const vpnFocus =
            occupantId === 'vpn' ||
            occupantId === 'vgw' ||
            occupantId === 'onprem' ||
            serviceId === 'site-to-site-vpn' ||
            serviceId === 'vpn-gateway'
          return vpnFocus ? VPN_TUNNEL_FLOWS : new Set()
        }}
        isDashed={(flow) => flow.role === 'egress' || isInternetVpnHop(flow.from, flow.to)}
      />
      {vpcCity.occupants.map((occupant) => (
        <CityOccupantNode key={occupant.id} occupant={occupant} />
      ))}

      <mesh
        position={[0, -0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => selectOccupant(null)}
      >
        <circleGeometry args={[22, 64]} />
        <meshBasicMaterial color="#070b14" transparent opacity={0} />
      </mesh>
    </>
  )
}
