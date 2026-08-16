import { Edges, Html } from '@react-three/drei'
import {
  COMPUTE_AWS_CENTER,
  COMPUTE_AWS_SIZE,
  COMPUTE_AZ_SIZE,
  COMPUTE_SUBNET_SIZE,
  COMPUTE_VPC_SIZE,
  getComputeAzCenter,
  getComputeSubnetCenter,
  MANAGED_CENTER,
  MANAGED_SIZE,
} from '@/scene/compute/computeLayout'
import {
  AWS_CLOUD_COLOR,
  AZ_COLOR,
  PRIVATE_COLOR,
  PUBLIC_COLOR,
  VPC_COLOR,
} from '@/scene/vpc/cityLayout'
import type { AvailabilityZoneId, SubnetTier } from '@/types/aws'

function SubnetSlab({ az, tier }: { az: AvailabilityZoneId; tier: SubnetTier }) {
  const color = tier === 'public' ? PUBLIC_COLOR : PRIVATE_COLOR
  const [x, y, z] = getComputeSubnetCenter(az, tier)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={COMPUTE_SUBNET_SIZE} />
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
  const [x, y, z] = getComputeAzCenter(az)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={COMPUTE_AZ_SIZE} />
        <meshStandardMaterial color={AZ_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AZ_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, COMPUTE_AZ_SIZE[1] / 2 + 0.15, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--az">{az === 'az-a' ? 'AZ-a' : 'AZ-b'}</div>
      </Html>
    </group>
  )
}

export function ComputeDistricts() {
  return (
    <group>
      <mesh position={COMPUTE_AWS_CENTER}>
        <boxGeometry args={COMPUTE_AWS_SIZE} />
        <meshStandardMaterial color={AWS_CLOUD_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AWS_CLOUD_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[COMPUTE_AWS_CENTER[0], 2.02, COMPUTE_AWS_CENTER[2] - 3.45]}
        center
        distanceFactor={16}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--aws">AWS</div>
      </Html>

      <mesh position={[0, 0.62, 0.03]}>
        <boxGeometry args={COMPUTE_VPC_SIZE} />
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

      <mesh position={MANAGED_CENTER}>
        <boxGeometry args={MANAGED_SIZE} />
        <meshStandardMaterial color="#ED7100" transparent opacity={0.05} depthWrite={false} />
        <Edges color="#ED7100" threshold={15} />
      </mesh>
      <Html
        position={[MANAGED_CENTER[0], 1.55, MANAGED_CENTER[2] - 2.15]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--managed">Managed</div>
      </Html>
    </group>
  )
}
