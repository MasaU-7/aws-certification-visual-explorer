import { getManagementOccupant, managementCity } from '@/data/management'
import { ManagementDistricts } from '@/scene/management/ManagementDistricts'
import { getManagementOccupantPosition } from '@/scene/management/managementLayout'
import { CityEdges } from '@/scene/vpc/CityEdges'
import { CityOccupantNode } from '@/scene/vpc/CityOccupantNode'
import { useExplorerStore } from '@/store/explorerStore'

const CW_CHAIN = new Set([
  'cw-alb-a',
  'cw-alb-b',
  'cw-ec2-a',
  'cw-ec2-b',
  'cw-asg',
  'cw-sns',
  'cw-trail',
  'scale-alb-a',
  'scale-alb-b',
  'scale-a',
  'scale-b',
  'ssm-cw',
])
const TRAIL_CHAIN = new Set(['trail-s3', 'cw-trail', 'trail-config'])
const CONFIG_CHAIN = new Set(['config-s3', 'trail-config', 'cfn-config'])
const CFN_CHAIN = new Set(['cfn-ec2-a', 'cfn-ec2-b', 'cfn-asg', 'cfn-config'])
const SSM_CHAIN = new Set(['ssm-in', 'ssm-ec2-a', 'ssm-ec2-b', 'param-a', 'param-b', 'ssm-cw'])
const COST_CHAIN = new Set(['ce-budgets', 'budgets-sns'])

export function ManagementCityContent() {
  const selectOccupant = useExplorerStore((s) => s.selectOccupant)

  return (
    <>
      <color attach="background" args={['#070b14']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 10, 8]} intensity={1.15} color="#9ec9ff" />
      <pointLight position={[-6, 4, -4]} intensity={0.55} color="#E7157B" />

      <ManagementDistricts />
      <CityEdges
        city={managementCity}
        getOccupant={getManagementOccupant}
        getPosition={getManagementOccupantPosition}
        hubServiceId={null}
        extraLinkedFlowIds={(occupantId, serviceId) => {
          if (occupantId === 'cloudwatch' || serviceId === 'cloudwatch' || occupantId === 'asg' || serviceId === 'autoscaling') {
            return CW_CHAIN
          }
          if (occupantId === 'cloudtrail' || serviceId === 'cloudtrail') return TRAIL_CHAIN
          if (occupantId === 'config' || serviceId === 'config') return CONFIG_CHAIN
          if (occupantId === 'cfn' || serviceId === 'cloudformation') return CFN_CHAIN
          if (occupantId === 'ssm' || serviceId === 'systems-manager') return SSM_CHAIN
          if (occupantId === 'cost-explorer' || serviceId === 'cost-explorer' || occupantId === 'budgets' || serviceId === 'budgets') {
            return COST_CHAIN
          }
          return new Set()
        }}
      />
      {managementCity.occupants.map((occupant) => (
        <CityOccupantNode key={occupant.id} occupant={occupant} />
      ))}

      <mesh
        position={[0, -0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => selectOccupant(null)}
      >
        <circleGeometry args={[22, 64]} />
        <meshBasicMaterial color="#070b14" transparent opacity={0} />
      </mesh>
    </>
  )
}
