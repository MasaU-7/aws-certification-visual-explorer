import { computeCity, getComputeOccupant } from '@/data/compute'
import { ComputeDistricts } from '@/scene/compute/ComputeDistricts'
import { getComputeOccupantPosition } from '@/scene/compute/computeLayout'
import { CityEdges } from '@/scene/vpc/CityEdges'
import { CityOccupantNode } from '@/scene/vpc/CityOccupantNode'
import { useExplorerStore } from '@/store/explorerStore'

const SCALE_FLOWS = new Set([
  'cw-scale',
  'scale-alb-a',
  'scale-alb-b',
  'scale-a',
  'scale-b',
  'app-ec2-a',
  'app-ec2-b',
])

export function ComputeCityContent() {
  const selectOccupant = useExplorerStore((s) => s.selectOccupant)

  return (
    <>
      <color attach="background" args={['#070b14']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 10, 8]} intensity={1.15} color="#9ec9ff" />
      <pointLight position={[-6, 4, -4]} intensity={0.55} color="#ED7100" />

      <ComputeDistricts />
      <CityEdges
        city={computeCity}
        getOccupant={getComputeOccupant}
        getPosition={getComputeOccupantPosition}
        hubServiceId={null}
        extraLinkedFlowIds={(occupantId, serviceId) => {
          const scaleFocus = occupantId === 'asg' || serviceId === 'autoscaling'
          return scaleFocus ? SCALE_FLOWS : new Set()
        }}
      />
      {computeCity.occupants.map((occupant) => (
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
