import { Edges, Html } from '@react-three/drei'
import { databaseCity } from '@/data/database'
import {
  DATABASE_AWS_CENTER,
  DATABASE_AWS_SIZE,
  DATABASE_AZ_SIZE,
  DATABASE_SUBNET_SIZE,
  DATABASE_VPC_SIZE,
  getDatabaseAzCenter,
  getDatabaseSubnetCenter,
  SERVERLESS_CENTER,
  SERVERLESS_SIZE,
} from '@/scene/database/databaseLayout'
import {
  AWS_CLOUD_COLOR,
  AZ_COLOR,
  PRIVATE_COLOR,
  PUBLIC_COLOR,
  VPC_COLOR,
} from '@/scene/vpc/cityLayout'
import { AZ_LABEL, type AvailabilityZoneId, type SubnetTier } from '@/types/aws'

const SERVERLESS_COLOR = '#C925D1'

function SubnetSlab({ az, tier }: { az: AvailabilityZoneId; tier: SubnetTier }) {
  const color = tier === 'public' ? PUBLIC_COLOR : PRIVATE_COLOR
  const [x, y, z] = getDatabaseSubnetCenter(az, tier)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={DATABASE_SUBNET_SIZE} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.18}
          transparent
          opacity={0.22}
          roughness={0.6}
        />
        <Edges color={color} threshold={15} />
      </mesh>
    </group>
  )
}

function AzDistrict({ az }: { az: AvailabilityZoneId }) {
  const [x, y, z] = getDatabaseAzCenter(az)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={DATABASE_AZ_SIZE} />
        <meshStandardMaterial color={AZ_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AZ_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, DATABASE_AZ_SIZE[1] / 2 + 0.15, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--az">{AZ_LABEL[az]}</div>
      </Html>
    </group>
  )
}

export function DatabaseDistricts() {
  return (
    <group>
      <mesh position={DATABASE_AWS_CENTER}>
        <boxGeometry args={DATABASE_AWS_SIZE} />
        <meshStandardMaterial color={AWS_CLOUD_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AWS_CLOUD_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[DATABASE_AWS_CENTER[0], 2.02, DATABASE_AWS_CENTER[2] - 4.05]}
        center
        distanceFactor={16}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--aws">AWS</div>
      </Html>

      <mesh position={[0, 0.62, 0.03]}>
        <boxGeometry args={DATABASE_VPC_SIZE} />
        <meshStandardMaterial color={VPC_COLOR} transparent opacity={0.04} depthWrite={false} />
        <Edges color={VPC_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, 1.72, -3.35]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--vpc">VPC</div>
      </Html>
      <Html position={[-4.45, 0.55, 3.28]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--public">Public</div>
      </Html>
      <Html position={[-4.45, 0.55, -3.38]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--private">Private</div>
      </Html>

      {databaseCity.azs.map((az) => (
        <AzDistrict key={az} az={az} />
      ))}
      {databaseCity.azs.map((az) => (
        <SubnetSlab key={`${az}-public`} az={az} tier="public" />
      ))}
      {databaseCity.azs.map((az) => (
        <SubnetSlab key={`${az}-private`} az={az} tier="private" />
      ))}

      <mesh position={SERVERLESS_CENTER}>
        <boxGeometry args={SERVERLESS_SIZE} />
        <meshStandardMaterial color={SERVERLESS_COLOR} transparent opacity={0.05} depthWrite={false} />
        <Edges color={SERVERLESS_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[SERVERLESS_CENTER[0], 1.55, SERVERLESS_CENTER[2] - 2.65]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--serverless">Serverless</div>
      </Html>
    </group>
  )
}
