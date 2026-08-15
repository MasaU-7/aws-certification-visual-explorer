import { Edges, Html } from '@react-three/drei'
import { serviceIcons } from '@/data/icons'
import { useExplorerStore } from '@/store/explorerStore'
import type { AwsService } from '@/types/aws'

interface GhostServiceNodeProps {
  service: AwsService
  position: [number, number, number]
}

export function GhostServiceNode({ service, position }: GhostServiceNodeProps) {
  const selectService = useExplorerStore((s) => s.selectService)
  const selectedServiceId = useExplorerStore((s) => s.selectedServiceId)
  const isSelected = selectedServiceId === service.id
  const Icon = serviceIcons[service.id]

  return (
    <group position={position} scale={isSelected ? 0.95 : 0.88}>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          selectService(isSelected ? null : service.id)
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <boxGeometry args={[0.5, 0.5, 0.12]} />
        <meshStandardMaterial
          color={isSelected ? '#ffffff' : '#0a1018'}
          emissive={service.visual.color}
          emissiveIntensity={isSelected ? 0.35 : 0.08}
          roughness={0.6}
          transparent
          opacity={isSelected ? 0.7 : 0.42}
        />
        <Edges
          color={isSelected ? '#b8dcff' : '#5a7a9a'}
          threshold={15}
          linewidth={1}
        />
      </mesh>

      {Icon && (
        <Html center distanceFactor={9} style={{ pointerEvents: 'none' }}>
          <div
            className={`scene-icon scene-icon--service scene-icon--ghost${isSelected ? ' is-selected' : ''}`}
          >
            <Icon size={36} />
          </div>
        </Html>
      )}

      <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div
          className={`scene-label scene-label--ghost${isSelected ? ' is-selected' : ''}`}
        >
          {service.name}
        </div>
      </Html>
    </group>
  )
}
