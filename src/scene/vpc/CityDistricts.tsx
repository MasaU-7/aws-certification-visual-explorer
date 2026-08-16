import { Edges, Html } from '@react-three/drei'
import {
  AWS_CLOUD_CENTER,
  AWS_CLOUD_COLOR,
  AWS_CLOUD_SIZE,
  AZ_COLOR,
  AZ_SIZE,
  getAzCenter,
  getSubnetCenter,
  ONPREM_CENTER,
  ONPREM_COLOR,
  ONPREM_SIZE,
  PRIVATE_COLOR,
  PUBLIC_COLOR,
  SUBNET_SIZE,
  VPC_COLOR,
  VPC_SIZE,
} from '@/scene/vpc/cityLayout'
import type { AvailabilityZoneId, SubnetTier } from '@/types/aws'

function SubnetSlab({ az, tier }: { az: AvailabilityZoneId; tier: SubnetTier }) {
  const color = tier === 'public' ? PUBLIC_COLOR : PRIVATE_COLOR
  const [x, y, z] = getSubnetCenter(az, tier)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={SUBNET_SIZE} />
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
  const [x, y, z] = getAzCenter(az)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={AZ_SIZE} />
        <meshStandardMaterial color={AZ_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AZ_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, AZ_SIZE[1] / 2 + 0.15, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--az">{az === 'az-a' ? 'AZ-a' : 'AZ-b'}</div>
      </Html>
    </group>
  )
}

export function CityDistricts() {
  return (
    <group>
      <mesh position={AWS_CLOUD_CENTER}>
        <boxGeometry args={AWS_CLOUD_SIZE} />
        <meshStandardMaterial color={AWS_CLOUD_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AWS_CLOUD_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[AWS_CLOUD_CENTER[0], 2.02, AWS_CLOUD_CENTER[2] - 3.35]}
        center
        distanceFactor={16}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--aws">AWS</div>
      </Html>

      <mesh position={[0, 0.62, 0.03]}>
        <boxGeometry args={VPC_SIZE} />
        <meshStandardMaterial color={VPC_COLOR} transparent opacity={0.04} depthWrite={false} />
        <Edges color={VPC_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, 1.72, -2.55]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--vpc">VPC</div>
      </Html>
      <Html position={[0, 0.55, 2.55]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--public">Public</div>
      </Html>
      <Html position={[0, 0.55, -2.5]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--private">Private</div>
      </Html>

      <AzDistrict az="az-a" />
      <AzDistrict az="az-b" />
      <SubnetSlab az="az-a" tier="public" />
      <SubnetSlab az="az-b" tier="public" />
      <SubnetSlab az="az-a" tier="private" />
      <SubnetSlab az="az-b" tier="private" />

      <mesh position={ONPREM_CENTER}>
        <boxGeometry args={ONPREM_SIZE} />
        <meshStandardMaterial color={ONPREM_COLOR} transparent opacity={0.07} depthWrite={false} />
        <Edges color={ONPREM_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[ONPREM_CENTER[0], 1.48, ONPREM_CENTER[2]]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--onprem">On-prem</div>
      </Html>
    </group>
  )
}
