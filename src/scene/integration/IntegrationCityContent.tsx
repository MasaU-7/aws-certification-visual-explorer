import { getIntegrationOccupant, integrationCity } from '@/data/integration'
import { IntegrationDistricts } from '@/scene/integration/IntegrationDistricts'
import { getIntegrationOccupantPosition } from '@/scene/integration/integrationLayout'
import { CityEdges } from '@/scene/vpc/CityEdges'
import { CityOccupantNode } from '@/scene/vpc/CityOccupantNode'
import { useExplorerStore } from '@/store/explorerStore'

const FANOUT_CHAIN = new Set(['pub-a', 'pub-b', 'fan-sqs', 'fan-lambda', 'fan-ses', 'mail'])
const QUEUE_CHAIN = new Set(['fan-sqs', 'poll-lambda', 'poll-ecs-a', 'poll-ecs-b'])
const SFN_CHAIN = new Set([
  'sfn-lambda',
  'sfn-sqs',
  'sfn-sns',
  'sfn-ecs-a',
  'sfn-ecs-b',
  'sfn-batch',
  'batch-launch-a',
  'batch-launch-b',
])
const EMAIL_CHAIN = new Set(['fan-ses', 'mail'])

export function IntegrationCityContent() {
  const selectOccupant = useExplorerStore((s) => s.selectOccupant)

  return (
    <>
      <color attach="background" args={['#070b14']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 10, 8]} intensity={1.15} color="#9ec9ff" />
      <pointLight position={[-6, 4, -4]} intensity={0.55} color="#E7157B" />

      <IntegrationDistricts />
      <CityEdges
        city={integrationCity}
        getOccupant={getIntegrationOccupant}
        getPosition={getIntegrationOccupantPosition}
        hubServiceId={null}
        extraLinkedFlowIds={(occupantId, serviceId) => {
          if (occupantId === 'sns' || serviceId === 'sns') return FANOUT_CHAIN
          if (occupantId === 'sqs' || serviceId === 'sqs') return QUEUE_CHAIN
          if (occupantId === 'sfn' || serviceId === 'step-functions' || occupantId === 'batch' || serviceId === 'batch') {
            return SFN_CHAIN
          }
          if (occupantId === 'ses' || serviceId === 'ses') return EMAIL_CHAIN
          return new Set()
        }}
      />
      {integrationCity.occupants.map((occupant) => (
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
