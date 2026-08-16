import { Edges, Html } from '@react-three/drei'
import { securityCity } from '@/data/security'
import {
  DETECT_CENTER,
  DETECT_SIZE,
  EDGE_CENTER,
  EDGE_SIZE,
  getSecurityAzCenter,
  getSecuritySubnetCenter,
  IDENTITY_CENTER,
  IDENTITY_SIZE,
  SECURITY_AWS_CENTER,
  SECURITY_AWS_SIZE,
  SECURITY_AZ_SIZE,
  SECURITY_SUBNET_SIZE,
  SECURITY_VPC_SIZE,
} from '@/scene/security/securityLayout'
import {
  AWS_CLOUD_COLOR,
  AZ_COLOR,
  PRIVATE_COLOR,
  PUBLIC_COLOR,
  VPC_COLOR,
} from '@/scene/vpc/cityLayout'
import { AZ_LABEL, type AvailabilityZoneId, type SubnetTier } from '@/types/aws'

const IDENTITY_COLOR = '#DD344C'
const DETECT_COLOR = '#E07A8A'
const EDGE_COLOR = '#C4B0FF'

function SubnetSlab({ az, tier }: { az: AvailabilityZoneId; tier: SubnetTier }) {
  const color = tier === 'public' ? PUBLIC_COLOR : PRIVATE_COLOR
  const [x, y, z] = getSecuritySubnetCenter(az, tier)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={SECURITY_SUBNET_SIZE} />
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
  const [x, y, z] = getSecurityAzCenter(az)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={SECURITY_AZ_SIZE} />
        <meshStandardMaterial color={AZ_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AZ_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, SECURITY_AZ_SIZE[1] / 2 + 0.15, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--az">{AZ_LABEL[az]}</div>
      </Html>
    </group>
  )
}

export function SecurityDistricts() {
  return (
    <group>
      <mesh position={SECURITY_AWS_CENTER}>
        <boxGeometry args={SECURITY_AWS_SIZE} />
        <meshStandardMaterial color={AWS_CLOUD_COLOR} transparent opacity={0.035} depthWrite={false} />
        <Edges color={AWS_CLOUD_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[SECURITY_AWS_CENTER[0], 2.02, SECURITY_AWS_CENTER[2] - 3.85]}
        center
        distanceFactor={16}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--aws">AWS</div>
      </Html>

      <mesh position={[0, 0.62, 0.03]}>
        <boxGeometry args={SECURITY_VPC_SIZE} />
        <meshStandardMaterial color={VPC_COLOR} transparent opacity={0.04} depthWrite={false} />
        <Edges color={VPC_COLOR} threshold={15} />
      </mesh>
      <Html position={[0, 1.72, -2.95]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--vpc">VPC</div>
      </Html>
      <Html position={[0, 0.55, 2.88]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--public">Public</div>
      </Html>
      <Html position={[0, 0.55, -2.92]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="city-sign city-sign--private">Private</div>
      </Html>

      <mesh position={EDGE_CENTER}>
        <boxGeometry args={EDGE_SIZE} />
        <meshStandardMaterial color={EDGE_COLOR} transparent opacity={0.05} depthWrite={false} />
        <Edges color={EDGE_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[EDGE_CENTER[0], 1.72, EDGE_CENTER[2] + 1.12]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--edge">Edge</div>
      </Html>

      {securityCity.azs.map((az) => (
        <AzDistrict key={az} az={az} />
      ))}
      {securityCity.azs.map((az) => (
        <SubnetSlab key={`${az}-public`} az={az} tier="public" />
      ))}
      {securityCity.azs.map((az) => (
        <SubnetSlab key={`${az}-private`} az={az} tier="private" />
      ))}

      <mesh position={IDENTITY_CENTER}>
        <boxGeometry args={IDENTITY_SIZE} />
        <meshStandardMaterial color={IDENTITY_COLOR} transparent opacity={0.05} depthWrite={false} />
        <Edges color={IDENTITY_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[IDENTITY_CENTER[0], 1.55, IDENTITY_CENTER[2] - 2.75]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--identity">Identity</div>
      </Html>

      <mesh position={DETECT_CENTER}>
        <boxGeometry args={DETECT_SIZE} />
        <meshStandardMaterial color={DETECT_COLOR} transparent opacity={0.05} depthWrite={false} />
        <Edges color={DETECT_COLOR} threshold={15} />
      </mesh>
      <Html
        position={[DETECT_CENTER[0], 1.55, DETECT_CENTER[2] - 2.85]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div className="city-sign city-sign--detect">Detect</div>
      </Html>
    </group>
  )
}
