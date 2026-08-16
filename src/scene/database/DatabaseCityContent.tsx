import { databaseCity, getDatabaseOccupant } from '@/data/database'
import { DatabaseDistricts } from '@/scene/database/DatabaseDistricts'
import { getDatabaseOccupantPosition } from '@/scene/database/databaseLayout'
import { CityEdges } from '@/scene/vpc/CityEdges'
import { CityOccupantNode } from '@/scene/vpc/CityOccupantNode'
import { useExplorerStore } from '@/store/explorerStore'

const RDS_CHAIN = new Set(['aurora-rds', 'cache-rds-a', 'rds-ha', 'aurora-ab', 'aurora-bc', 'aurora-ca'])
const CACHE_CHAIN = new Set(['mem-cache', 'cache-rds-a', 'cache-ha'])
const REDSHIFT_CHAIN = new Set(['s3-rs-a', 'rs-qs-a'])
const SERVERLESS_CHAIN = new Set([
  'lambda-ddb',
  'lambda-ks',
  'lambda-ts',
  'kinesis-lambda',
  'kinesis-ts',
  'ec2-ddb-a',
  'ec2-ks-a',
])

export function DatabaseCityContent() {
  const selectOccupant = useExplorerStore((s) => s.selectOccupant)

  return (
    <>
      <color attach="background" args={['#070b14']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 10, 8]} intensity={1.15} color="#9ec9ff" />
      <pointLight position={[-6, 4, -4]} intensity={0.55} color="#C925D1" />

      <DatabaseDistricts />
      <CityEdges
        city={databaseCity}
        getOccupant={getDatabaseOccupant}
        getPosition={getDatabaseOccupantPosition}
        hubServiceId={null}
        extraLinkedFlowIds={(occupantId, serviceId) => {
          if (
            occupantId === 'rds-a' ||
            occupantId === 'rds-b' ||
            occupantId === 'aurora-a' ||
            occupantId === 'aurora-b' ||
            occupantId === 'aurora-c' ||
            serviceId === 'rds' ||
            serviceId === 'aurora'
          ) {
            return RDS_CHAIN
          }
          if (
            occupantId === 'cache-a' ||
            occupantId === 'cache-b' ||
            occupantId === 'mem-a' ||
            occupantId === 'mem-b' ||
            serviceId === 'elasticache' ||
            serviceId === 'memorydb'
          ) {
            return CACHE_CHAIN
          }
          if (occupantId === 'rs-a' || serviceId === 'redshift' || serviceId === 's3' || occupantId === 's3') {
            return REDSHIFT_CHAIN
          }
          if (
            occupantId === 'dynamodb' ||
            occupantId === 'keyspaces' ||
            occupantId === 'timestream' ||
            occupantId === 'lambda' ||
            occupantId === 'kinesis' ||
            serviceId === 'dynamodb' ||
            serviceId === 'keyspaces' ||
            serviceId === 'timestream'
          ) {
            return SERVERLESS_CHAIN
          }
          return new Set()
        }}
      />
      {databaseCity.occupants.map((occupant) => (
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
