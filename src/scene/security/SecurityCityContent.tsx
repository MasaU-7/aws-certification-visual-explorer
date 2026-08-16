import { getSecurityOccupant, securityCity } from '@/data/security'
import { SecurityDistricts } from '@/scene/security/SecurityDistricts'
import { getSecurityOccupantPosition } from '@/scene/security/securityLayout'
import { CityEdges } from '@/scene/vpc/CityEdges'
import { CityOccupantNode } from '@/scene/vpc/CityOccupantNode'
import { useExplorerStore } from '@/store/explorerStore'

const EDGE_CHAIN = new Set([
  'in-cf',
  'waf-cf',
  'shield-cf',
  'acm-cf',
  'waf-alb-a',
  'acm-alb-a',
  'fms-waf',
  'fms-shield',
])
const IDENTITY_CHAIN = new Set([
  'org-iam',
  'org-sso',
  'org-fms',
  'sso-iam',
  'sso-ds-a',
  'iam-kms',
  'iam-secrets',
])
const CRYPTO_CHAIN = new Set(['iam-kms', 'kms-hsm-a', 'secrets-kms', 'secrets-rds-a'])
const DETECT_CHAIN = new Set([
  'trail-gd',
  's3-macie',
  'insp-ec2-a',
  'gd-hub',
  'insp-hub',
  'macie-hub',
  'config-hub',
  'fms-hub',
])
const FMS_CHAIN = new Set(['org-fms', 'fms-waf', 'fms-shield', 'fms-hub'])

export function SecurityCityContent() {
  const selectOccupant = useExplorerStore((s) => s.selectOccupant)

  return (
    <>
      <color attach="background" args={['#070b14']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 10, 8]} intensity={1.15} color="#9ec9ff" />
      <pointLight position={[-6, 4, -4]} intensity={0.55} color="#DD344C" />

      <SecurityDistricts />
      <CityEdges
        city={securityCity}
        getOccupant={getSecurityOccupant}
        getPosition={getSecurityOccupantPosition}
        hubServiceId={null}
        extraLinkedFlowIds={(occupantId, serviceId) => {
          if (occupantId === 'fms' || serviceId === 'firewall-manager') {
            return FMS_CHAIN
          }
          if (
            occupantId === 'waf' ||
            occupantId === 'shield' ||
            occupantId === 'acm' ||
            occupantId === 'cloudfront' ||
            serviceId === 'waf' ||
            serviceId === 'shield' ||
            serviceId === 'acm'
          ) {
            return EDGE_CHAIN
          }
          if (
            occupantId === 'organizations' ||
            occupantId === 'iam' ||
            occupantId === 'identity-center' ||
            occupantId === 'ds-a' ||
            occupantId === 'ds-b' ||
            serviceId === 'organizations' ||
            serviceId === 'iam' ||
            serviceId === 'identity-center' ||
            serviceId === 'directory-service'
          ) {
            return IDENTITY_CHAIN
          }
          if (
            occupantId === 'kms' ||
            occupantId === 'secrets' ||
            occupantId === 'hsm-a' ||
            occupantId === 'hsm-b' ||
            occupantId === 'rds-a' ||
            occupantId === 'rds-b' ||
            serviceId === 'kms' ||
            serviceId === 'secrets-manager' ||
            serviceId === 'cloudhsm'
          ) {
            return CRYPTO_CHAIN
          }
          if (
            occupantId === 'security-hub' ||
            occupantId === 'guardduty' ||
            occupantId === 'inspector' ||
            occupantId === 'macie' ||
            occupantId === 'config' ||
            occupantId === 'cloudtrail' ||
            occupantId === 's3' ||
            serviceId === 'security-hub' ||
            serviceId === 'guardduty' ||
            serviceId === 'inspector' ||
            serviceId === 'macie'
          ) {
            return DETECT_CHAIN
          }
          return new Set()
        }}
      />
      {securityCity.occupants.map((occupant) => (
        <CityOccupantNode key={occupant.id} occupant={occupant} />
      ))}

      <mesh
        position={[0, -0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => selectOccupant(null)}
      >
        <circleGeometry args={[24, 64]} />
        <meshBasicMaterial color="#070b14" transparent opacity={0} />
      </mesh>
    </>
  )
}
