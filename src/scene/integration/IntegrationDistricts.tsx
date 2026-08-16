import { Edges, Html } from '@react-three/drei'
import { integrationCity } from '@/data/integration'
import {
  BUS_CENTER,
  BUS_SIZE,
  getIntegrationAzCenter,
  getIntegrationSubnetCenter,
  INTEGRATION_AWS_CENTER,
  INTEGRATION_AWS_SIZE,
  INTEGRATION_AZ_SIZE,
  INTEGRATION_SUBNET_SIZE,
  INTEGRATION_VPC_SIZE,
} from '@/scene/integration/integrationLayout'
import {
  AWS_CLOUD_COLOR,
  AZ_COLOR,
  PRIVATE_COLOR,
  PUBLIC_COLOR,
  VPC_COLOR,
} from '@/scene/vpc/cityLayout'
import { AZ_LABEL, type AvailabilityZoneId, type SubnetTier } from '@/types/aws'

const BUS_COLOR = '#E7157B'

function SubnetSlab({ az, tier }: { az: AvailabilityZoneId; tier: SubnetTier }) {
  const color = tier === 'public' ? PUBLIC_COLOR : PRIVATE_COLOR
  const [x, y, z] = getIntegrationSubnetCenter(az, tier)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={INTEGRATION_SUBNET_SIZE} />
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
  const [x, y, z] = getIntegrationAzCenter(az)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={INTEGRATION_AZ_SIZE} />
        <meshStandardMaterial color={AZ_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AZ_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, INTEGRATION_AZ_SIZE[1] / 2 + 0.15, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--az">{AZ_LABEL[az]}</div>
      </Html>
    </group>
  )
}

export function IntegrationDistricts() {
  return (
    <group>
      <mesh position={INTEGRATION_AWS_CENTER}>
        <boxGeometry args={INTEGRATION_AWS_SIZE} />
        <meshStandardMaterial color={AWS_CLOUD_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AWS_CLOUD_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[INTEGRATION_AWS_CENTER[0], 2.02, INTEGRATION_AWS_CENTER[2] - 3.55]}
        center
        distanceFactor={16}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--aws">AWS</div>
      </Html>

      <mesh position={[0, 0.62, 0.03]}>
        <boxGeometry args={INTEGRATION_VPC_SIZE} />
        <meshStandardMaterial color={VPC_COLOR} transparent opacity={0.04} depthWrite={false} />
        <Edges color={VPC_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, 1.72, -2.78]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--vpc">VPC</div>
      </Html>
      <Html position={[0, 0.55, 2.72]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--public">Public</div>
      </Html>
      <Html position={[0, 0.55, -2.72]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--private">Private</div>
      </Html>

      {integrationCity.azs.map((az) => (
        <AzDistrict key={az} az={az} />
      ))}
      {integrationCity.azs.map((az) => (
        <SubnetSlab key={`${az}-public`} az={az} tier="public" />
      ))}
      {integrationCity.azs.map((az) => (
        <SubnetSlab key={`${az}-private`} az={az} tier="private" />
      ))}

      <mesh position={BUS_CENTER}>
        <boxGeometry args={BUS_SIZE} />
        <meshStandardMaterial color={BUS_COLOR} transparent opacity={0.05} depthWrite={false} />
        <Edges color={BUS_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[BUS_CENTER[0], 1.55, BUS_CENTER[2] - 2.75]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--bus">Bus</div>
      </Html>
    </group>
  )
}
