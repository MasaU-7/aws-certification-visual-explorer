import { Edges, Html } from '@react-three/drei'
import {
  getManagementAzCenter,
  getManagementSubnetCenter,
  MANAGEMENT_AWS_CENTER,
  MANAGEMENT_AWS_SIZE,
  MANAGEMENT_AZ_SIZE,
  MANAGEMENT_SUBNET_SIZE,
  MANAGEMENT_VPC_SIZE,
  OPS_CENTER,
  OPS_SIZE,
} from '@/scene/management/managementLayout'
import {
  AWS_CLOUD_COLOR,
  AZ_COLOR,
  PRIVATE_COLOR,
  PUBLIC_COLOR,
  VPC_COLOR,
} from '@/scene/vpc/cityLayout'
import type { AvailabilityZoneId, SubnetTier } from '@/types/aws'

const OPS_COLOR = '#E7157B'

function SubnetSlab({ az, tier }: { az: AvailabilityZoneId; tier: SubnetTier }) {
  const color = tier === 'public' ? PUBLIC_COLOR : PRIVATE_COLOR
  const [x, y, z] = getManagementSubnetCenter(az, tier)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={MANAGEMENT_SUBNET_SIZE} />
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
  const [x, y, z] = getManagementAzCenter(az)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={MANAGEMENT_AZ_SIZE} />
        <meshStandardMaterial color={AZ_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AZ_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, MANAGEMENT_AZ_SIZE[1] / 2 + 0.15, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--az">{az === 'az-a' ? 'AZ-a' : 'AZ-b'}</div>
      </Html>
    </group>
  )
}

export function ManagementDistricts() {
  return (
    <group>
      <mesh position={MANAGEMENT_AWS_CENTER}>
        <boxGeometry args={MANAGEMENT_AWS_SIZE} />
        <meshStandardMaterial color={AWS_CLOUD_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AWS_CLOUD_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[MANAGEMENT_AWS_CENTER[0], 2.02, MANAGEMENT_AWS_CENTER[2] - 4.25]}
        center
        distanceFactor={16}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--aws">AWS</div>
      </Html>

      <mesh position={[0, 0.62, 0.03]}>
        <boxGeometry args={MANAGEMENT_VPC_SIZE} />
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

      <mesh position={OPS_CENTER}>
        <boxGeometry args={OPS_SIZE} />
        <meshStandardMaterial color={OPS_COLOR} transparent opacity={0.05} depthWrite={false} />
        <Edges color={OPS_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[OPS_CENTER[0], 1.55, OPS_CENTER[2] - 3.45]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--ops">Ops</div>
      </Html>
    </group>
  )
}
