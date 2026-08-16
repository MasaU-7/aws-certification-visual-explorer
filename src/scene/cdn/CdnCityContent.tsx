import { cdnCity, getCdnOccupant } from '@/data/cdn'
import { CdnDistricts } from '@/scene/cdn/CdnDistricts'
import { getCdnOccupantPosition } from '@/scene/cdn/cdnLayout'
import { CityEdges } from '@/scene/vpc/CityEdges'
import { CityOccupantNode } from '@/scene/vpc/CityOccupantNode'
import { useExplorerStore } from '@/store/explorerStore'

const CF_ORIGIN_FLOWS = new Set([
  'cf-lambda-edge',
  'cf-s3',
  'cf-lambda',
  'cf-igw',
  'igw-a',
  'igw-b',
  'app-a',
  'app-b',
])
const GA_ENDPOINT_FLOWS = new Set(['ga-nlb-a', 'ga-nlb-b', 'nlb-app-a', 'nlb-app-b'])
const LAMBDA_FLOWS = new Set(['cf-lambda-edge', 'cf-lambda'])

export function CdnCityContent() {
  const selectOccupant = useExplorerStore((s) => s.selectOccupant)

  return (
    <>
      <color attach="background" args={['#070b14']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 10, 8]} intensity={1.15} color="#9ec9ff" />
      <pointLight position={[-6, 4, -4]} intensity={0.55} color="#A78BFA" />

      <CdnDistricts />
      <CityEdges
        city={cdnCity}
        getOccupant={getCdnOccupant}
        getPosition={getCdnOccupantPosition}
        hubServiceId={null}
        extraLinkedFlowIds={(occupantId, serviceId) => {
          if (occupantId === 'cloudfront' || serviceId === 'cloudfront') return CF_ORIGIN_FLOWS
          if (occupantId === 'ga' || serviceId === 'global-accelerator') return GA_ENDPOINT_FLOWS
          if (occupantId === 'lambda-edge' || occupantId === 'lambda' || serviceId === 'lambda') {
            return LAMBDA_FLOWS
          }
          return new Set()
        }}
        isDashed={(flow) => flow.id === 'cf-s3' || flow.id === 'cf-igw' || flow.id === 'cf-lambda'}
      />
      {cdnCity.occupants.map((occupant) => (
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
