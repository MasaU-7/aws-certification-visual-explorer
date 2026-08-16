import { Edges, Html } from '@react-three/drei'
import {
  ANALYTICS_AWS_CENTER,
  ANALYTICS_AWS_SIZE,
  ANALYTICS_AZ_SIZE,
  ANALYTICS_SUBNET_SIZE,
  ANALYTICS_VPC_SIZE,
  getAnalyticsAzCenter,
  getAnalyticsSubnetCenter,
  LAKE_CENTER,
  LAKE_SIZE,
} from '@/scene/analytics/analyticsLayout'
import {
  AWS_CLOUD_COLOR,
  AZ_COLOR,
  PRIVATE_COLOR,
  PUBLIC_COLOR,
  VPC_COLOR,
} from '@/scene/vpc/cityLayout'
import type { AvailabilityZoneId, SubnetTier } from '@/types/aws'

const LAKE_COLOR = '#1B9A8E'

function SubnetSlab({ az, tier }: { az: AvailabilityZoneId; tier: SubnetTier }) {
  const color = tier === 'public' ? PUBLIC_COLOR : PRIVATE_COLOR
  const [x, y, z] = getAnalyticsSubnetCenter(az, tier)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={ANALYTICS_SUBNET_SIZE} />
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
  const [x, y, z] = getAnalyticsAzCenter(az)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={ANALYTICS_AZ_SIZE} />
        <meshStandardMaterial color={AZ_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AZ_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, ANALYTICS_AZ_SIZE[1] / 2 + 0.15, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--az">{az === 'az-a' ? 'AZ-a' : 'AZ-b'}</div>
      </Html>
    </group>
  )
}

export function AnalyticsDistricts() {
  return (
    <group>
      <mesh position={ANALYTICS_AWS_CENTER}>
        <boxGeometry args={ANALYTICS_AWS_SIZE} />
        <meshStandardMaterial color={AWS_CLOUD_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AWS_CLOUD_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[ANALYTICS_AWS_CENTER[0], 2.02, ANALYTICS_AWS_CENTER[2] - 3.55]}
        center
        distanceFactor={16}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--aws">AWS</div>
      </Html>

      <mesh position={[0, 0.62, 0.03]}>
        <boxGeometry args={ANALYTICS_VPC_SIZE} />
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

      <AzDistrict az="az-a" />
      <AzDistrict az="az-b" />
      <SubnetSlab az="az-a" tier="public" />
      <SubnetSlab az="az-b" tier="public" />
      <SubnetSlab az="az-a" tier="private" />
      <SubnetSlab az="az-b" tier="private" />

      <mesh position={LAKE_CENTER}>
        <boxGeometry args={LAKE_SIZE} />
        <meshStandardMaterial color={LAKE_COLOR} transparent opacity={0.05} depthWrite={false} />
        <Edges color={LAKE_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[LAKE_CENTER[0], 1.55, LAKE_CENTER[2] - 2.75]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--lake">Lake</div>
      </Html>
    </group>
  )
}
