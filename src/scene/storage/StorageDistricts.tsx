import { Edges, Html } from '@react-three/drei'
import {
  getStorageAzCenter,
  getStorageSubnetCenter,
  OBJECT_CENTER,
  OBJECT_SIZE,
  STORAGE_AWS_CENTER,
  STORAGE_AWS_SIZE,
  STORAGE_AZ_SIZE,
  STORAGE_ONPREM_CENTER,
  STORAGE_ONPREM_SIZE,
  STORAGE_SUBNET_SIZE,
  STORAGE_VPC_SIZE,
} from '@/scene/storage/storageLayout'
import {
  AWS_CLOUD_COLOR,
  AZ_COLOR,
  ONPREM_COLOR,
  PRIVATE_COLOR,
  PUBLIC_COLOR,
  VPC_COLOR,
} from '@/scene/vpc/cityLayout'
import type { AvailabilityZoneId, SubnetTier } from '@/types/aws'

const OBJECT_COLOR = '#7AA116'

function SubnetSlab({ az, tier }: { az: AvailabilityZoneId; tier: SubnetTier }) {
  const color = tier === 'public' ? PUBLIC_COLOR : PRIVATE_COLOR
  const [x, y, z] = getStorageSubnetCenter(az, tier)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={STORAGE_SUBNET_SIZE} />
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
  const [x, y, z] = getStorageAzCenter(az)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={STORAGE_AZ_SIZE} />
        <meshStandardMaterial color={AZ_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AZ_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, STORAGE_AZ_SIZE[1] / 2 + 0.15, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--az">{az === 'az-a' ? 'AZ-a' : 'AZ-b'}</div>
      </Html>
    </group>
  )
}

export function StorageDistricts() {
  return (
    <group>
      <mesh position={STORAGE_AWS_CENTER}>
        <boxGeometry args={STORAGE_AWS_SIZE} />
        <meshStandardMaterial color={AWS_CLOUD_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AWS_CLOUD_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[STORAGE_AWS_CENTER[0], 2.02, STORAGE_AWS_CENTER[2] - 3.5]}
        center
        distanceFactor={16}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--aws">AWS</div>
      </Html>

      <mesh position={[0, 0.62, 0.03]}>
        <boxGeometry args={STORAGE_VPC_SIZE} />
        <meshStandardMaterial color={VPC_COLOR} transparent opacity={0.04} depthWrite={false} />
        <Edges color={VPC_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, 1.72, -2.85]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--vpc">VPC</div>
      </Html>
      <Html position={[0, 0.55, 2.78]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--public">Public</div>
      </Html>
      <Html position={[0, 0.55, -2.82]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--private">Private</div>
      </Html>

      <AzDistrict az="az-a" />
      <AzDistrict az="az-b" />
      <SubnetSlab az="az-a" tier="public" />
      <SubnetSlab az="az-b" tier="public" />
      <SubnetSlab az="az-a" tier="private" />
      <SubnetSlab az="az-b" tier="private" />

      <mesh position={OBJECT_CENTER}>
        <boxGeometry args={OBJECT_SIZE} />
        <meshStandardMaterial color={OBJECT_COLOR} transparent opacity={0.06} depthWrite={false} />
        <Edges color={OBJECT_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[OBJECT_CENTER[0], 1.55, OBJECT_CENTER[2] - 2.35]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--origin">Object</div>
      </Html>

      <mesh position={STORAGE_ONPREM_CENTER}>
        <boxGeometry args={STORAGE_ONPREM_SIZE} />
        <meshStandardMaterial color={ONPREM_COLOR} transparent opacity={0.07} depthWrite={false} />
        <Edges color={ONPREM_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[STORAGE_ONPREM_CENTER[0], 1.48, STORAGE_ONPREM_CENTER[2]]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--onprem">On-prem</div>
      </Html>
    </group>
  )
}
