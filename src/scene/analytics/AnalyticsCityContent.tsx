import { analyticsCity, getAnalyticsOccupant } from '@/data/analytics'
import { AnalyticsDistricts } from '@/scene/analytics/AnalyticsDistricts'
import { getAnalyticsOccupantPosition } from '@/scene/analytics/analyticsLayout'
import { CityEdges } from '@/scene/vpc/CityEdges'
import { CityOccupantNode } from '@/scene/vpc/CityOccupantNode'
import { useExplorerStore } from '@/store/explorerStore'

const STREAM_CHAIN = new Set(['pub-a', 'kin-lambda', 'kin-emr', 'kin-s3', 'kin-ts', 'lambda-s3'])
const EMR_CHAIN = new Set(['kin-emr', 'emr-launch-a', 'emr-on-a', 'emr-s3-a'])
const LAKE_CHAIN = new Set(['kin-s3', 'lambda-s3', 'emr-s3-a', 'athena-s3', 's3-rs-a'])
const BI_CHAIN = new Set(['qs-in', 'athena-qs', 'rs-qs-a', 'rds-qs-a', 'athena-s3'])

export function AnalyticsCityContent() {
  const selectOccupant = useExplorerStore((s) => s.selectOccupant)

  return (
    <>
      <color attach="background" args={['#070b14']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 10, 8]} intensity={1.15} color="#9ec9ff" />
      <pointLight position={[-6, 4, -4]} intensity={0.55} color="#1B9A8E" />

      <AnalyticsDistricts />
      <CityEdges
        city={analyticsCity}
        getOccupant={getAnalyticsOccupant}
        getPosition={getAnalyticsOccupantPosition}
        hubServiceId={null}
        extraLinkedFlowIds={(occupantId, serviceId) => {
          if (occupantId === 'kinesis' || serviceId === 'kinesis') return STREAM_CHAIN
          if (occupantId === 'emr' || occupantId === 'emr-a' || serviceId === 'emr') {
            return EMR_CHAIN
          }
          if (occupantId === 's3' || serviceId === 's3' || occupantId === 'athena' || serviceId === 'athena') {
            return LAKE_CHAIN
          }
          if (occupantId === 'quicksight' || serviceId === 'quicksight') return BI_CHAIN
          return new Set()
        }}
      />
      {analyticsCity.occupants.map((occupant) => (
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
