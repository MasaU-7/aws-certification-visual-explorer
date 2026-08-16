import { Edges, Html } from '@react-three/drei'
import { cdnCity } from '@/data/cdn'
import {
  CDN_AZ_SIZE,
  CDN_EDGE_CENTER,
  CDN_EDGE_SIZE,
  CDN_ORIGIN_CENTER,
  CDN_ORIGIN_SIZE,
  CDN_REGION_A_CENTER,
  CDN_REGION_A_SIZE,
  CDN_REGION_B_CENTER,
  CDN_REGION_B_SIZE,
  CDN_SUBNET_SIZE,
  CDN_VPC_SIZE,
  getCdnAzCenter,
  getCdnSubnetCenter,
} from '@/scene/cdn/cdnLayout'
import {
  AWS_CLOUD_COLOR,
  AZ_COLOR,
  PRIVATE_COLOR,
  PUBLIC_COLOR,
  VPC_COLOR,
} from '@/scene/vpc/cityLayout'
import { AZ_LABEL, type AvailabilityZoneId, type SubnetTier } from '@/types/aws'

const EDGE_COLOR = '#A78BFA'

function SubnetSlab({ az, tier }: { az: AvailabilityZoneId; tier: SubnetTier }) {
  const color = tier === 'public' ? PUBLIC_COLOR : PRIVATE_COLOR
  const [x, y, z] = getCdnSubnetCenter(az, tier)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={CDN_SUBNET_SIZE} />
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
  const [x, y, z] = getCdnAzCenter(az)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={CDN_AZ_SIZE} />
        <meshStandardMaterial color={AZ_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AZ_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, CDN_AZ_SIZE[1] / 2 + 0.15, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--az">{AZ_LABEL[az]}</div>
      </Html>
    </group>
  )
}

export function CdnDistricts() {
  return (
    <group>
      <mesh position={CDN_EDGE_CENTER}>
        <boxGeometry args={CDN_EDGE_SIZE} />
        <meshStandardMaterial color={EDGE_COLOR} transparent opacity={0.06} depthWrite={false} />
        <Edges color={EDGE_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[CDN_EDGE_CENTER[0], 1.72, CDN_EDGE_CENTER[2]]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--edge">Edge</div>
      </Html>

      <mesh position={CDN_REGION_A_CENTER}>
        <boxGeometry args={CDN_REGION_A_SIZE} />
        <meshStandardMaterial color={AWS_CLOUD_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AWS_CLOUD_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[CDN_REGION_A_CENTER[0], 2.02, CDN_REGION_A_CENTER[2] - 2.85]}
        center
        distanceFactor={16}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--aws">Region A</div>
      </Html>

      <mesh position={[0, 0.62, -0.92]}>
        <boxGeometry args={CDN_VPC_SIZE} />
        <meshStandardMaterial color={VPC_COLOR} transparent opacity={0.04} depthWrite={false} />
        <Edges color={VPC_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, 1.72, -3.35]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--vpc">VPC</div>
      </Html>
      <Html position={[0, 0.55, 1.28]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--public">Public</div>
      </Html>
      <Html position={[0, 0.55, -3.22]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--private">Private</div>
      </Html>

      {cdnCity.azs.map((az) => (
        <AzDistrict key={az} az={az} />
      ))}
      {cdnCity.azs.map((az) => (
        <SubnetSlab key={`${az}-public`} az={az} tier="public" />
      ))}
      {cdnCity.azs.map((az) => (
        <SubnetSlab key={`${az}-private`} az={az} tier="private" />
      ))}

      <mesh position={CDN_ORIGIN_CENTER}>
        <boxGeometry args={CDN_ORIGIN_SIZE} />
        <meshStandardMaterial color="#7AA116" transparent opacity={0.06} depthWrite={false} />
        <Edges color="#7AA116" threshold={15} />
      </mesh>
      <Html
        position={[CDN_ORIGIN_CENTER[0], 1.55, CDN_ORIGIN_CENTER[2] - 1.85]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--origin">Origin</div>
      </Html>

      <mesh position={CDN_REGION_B_CENTER}>
        <boxGeometry args={CDN_REGION_B_SIZE} />
        <meshStandardMaterial color={AWS_CLOUD_COLOR} transparent opacity={0.05} depthWrite={false} />
        <Edges color={AWS_CLOUD_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[CDN_REGION_B_CENTER[0], 1.72, CDN_REGION_B_CENTER[2] - 1.95]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--aws">Region B</div>
      </Html>
    </group>
  )
}
