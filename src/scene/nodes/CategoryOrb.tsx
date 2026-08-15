import { Html } from '@react-three/drei'
import { useExplorerStore } from '@/store/explorerStore'
import type { CategoryNode } from '@/types/aws'

interface CategoryOrbProps {
  node: CategoryNode
  active: boolean
  dimmed: boolean
  serviceCount: number
}

export function CategoryOrb({ node, active, dimmed, serviceCount }: CategoryOrbProps) {
  const selectCategory = useExplorerStore((s) => s.selectCategory)
  const selectedCategoryId = useExplorerStore((s) => s.selectedCategoryId)
  const isSelected = selectedCategoryId === node.id

  const opacity = dimmed ? 0.18 : active ? 1 : 0.35
  const scale = isSelected ? 1.25 : 1

  return (
    <group position={node.position} scale={scale}>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          if (!dimmed) selectCategory(isSelected ? null : node.id)
        }}
        onPointerOver={() => {
          document.body.style.cursor = dimmed ? 'default' : 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isSelected ? 0.55 : 0.25}
          transparent
          opacity={opacity}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>
      <Html center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            color: dimmed ? 'rgba(255,255,255,0.25)' : '#fff',
            fontFamily: '"Segoe UI", system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: '0 1px 8px rgba(0,0,0,0.8)',
            transform: 'translateY(42px)',
            userSelect: 'none',
          }}
        >
          {node.label}
          {!dimmed && (
            <div style={{ fontSize: '10px', opacity: 0.7, fontWeight: 400 }}>
              {serviceCount}
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}
