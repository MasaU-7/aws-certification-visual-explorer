import { Html } from '@react-three/drei'
import { fixtureIcons, serviceIcons } from '@/data/icons'
import { getServiceById } from '@/data/services'
import { getOccupantPosition, INTERNET_COLOR } from '@/scene/vpc/cityLayout'
import { useExplorerStore } from '@/store/explorerStore'
import type { CityOccupant } from '@/types/aws'

interface CityOccupantNodeProps {
  occupant: CityOccupant
}

export function CityOccupantNode({ occupant }: CityOccupantNodeProps) {
  const selectedOccupantId = useExplorerStore((s) => s.selectedOccupantId)
  const selectOccupant = useExplorerStore((s) => s.selectOccupant)
  const isSelected = selectedOccupantId === occupant.id
  const [x, y, z] = getOccupantPosition(occupant)
  const serviceColor = occupant.serviceId
    ? getServiceById(occupant.serviceId)?.visual.color
    : '#8C4FFF'

  if (occupant.kind === 'internet') {
    return (
      <group position={[x, y, z]}>
        <mesh
          onClick={(e) => {
            e.stopPropagation()
            selectOccupant(isSelected ? null : occupant.id)
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default'
          }}
        >
          <icosahedronGeometry args={[0.28, 1]} />
          <meshStandardMaterial
            color={INTERNET_COLOR}
            emissive={INTERNET_COLOR}
            emissiveIntensity={isSelected ? 0.9 : 0.45}
            roughness={0.25}
            transparent
            opacity={0.9}
          />
        </mesh>
        <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div className="scene-label scene-label--city">{occupant.label}</div>
        </Html>
      </group>
    )
  }

  const Icon =
    occupant.kind === 'igw' || occupant.kind === 'nat'
      ? fixtureIcons[occupant.kind]
      : occupant.serviceId
        ? serviceIcons[occupant.serviceId]
        : undefined

  return (
    <group position={[x, y, z]} scale={isSelected ? 1.08 : 1}>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          selectOccupant(isSelected ? null : occupant.id)
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <boxGeometry args={[0.52, 0.52, 0.14]} />
        <meshStandardMaterial
          color={isSelected ? '#ffffff' : '#101820'}
          emissive={serviceColor}
          emissiveIntensity={isSelected ? 0.5 : 0.16}
          roughness={0.5}
          transparent
          opacity={0.88}
        />
      </mesh>

      {Icon && (
        <Html center distanceFactor={9} style={{ pointerEvents: 'none' }}>
          <div className="scene-icon scene-icon--service">
            <Icon size={36} />
          </div>
        </Html>
      )}

      <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div className="scene-label scene-label--city">{occupant.label}</div>
      </Html>
    </group>
  )
}
