import { Html } from '@react-three/drei'
import { serviceIcons } from '@/data/icons'
import { useExplorerStore } from '@/store/explorerStore'
import type { AwsService } from '@/types/aws'

interface ServiceNodeProps {
  service: AwsService
  index: number
  total: number
  origin: [number, number, number]
}

export function ServiceNode({ service, index, total, origin }: ServiceNodeProps) {
  const selectService = useExplorerStore((s) => s.selectService)
  const selectedServiceId = useExplorerStore((s) => s.selectedServiceId)
  const isSelected = selectedServiceId === service.id
  const Icon = serviceIcons[service.id]

  const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2
  const radius = 1.8
  const x = origin[0] + Math.cos(angle) * radius
  const y = origin[1] + Math.sin(angle) * radius * 0.65
  const z = origin[2] + 0.4

  return (
    <group position={[x, y, z]}>
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
          color={isSelected ? '#ffffff' : '#101820'}
          emissive={service.visual.color}
          emissiveIntensity={isSelected ? 0.45 : 0.15}
          roughness={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {Icon && (
        <Html center distanceFactor={9} style={{ pointerEvents: 'none' }}>
          <div className="scene-icon scene-icon--service">
            <Icon size={40} />
          </div>
        </Html>
      )}

      <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            textShadow: '0 1px 6px rgba(0,0,0,0.9)',
            transform: 'translateY(34px)',
            userSelect: 'none',
          }}
        >
          {service.name}
        </div>
      </Html>
    </group>
  )
}
