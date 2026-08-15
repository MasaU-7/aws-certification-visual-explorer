import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Suspense, useMemo } from 'react'
import { categoryNodes } from '@/data/categories'
import { getServicesForCertification } from '@/data/services'
import { useExplorerStore } from '@/store/explorerStore'
import { CategoryOrb } from './nodes/CategoryOrb'
import { ServiceNode } from './nodes/ServiceNode'
import { WorldEdges } from './edges/WorldEdges'

function WorldContent() {
  const certificationId = useExplorerStore((s) => s.certificationId)
  const selectedCategoryId = useExplorerStore((s) => s.selectedCategoryId)
  const selectCategory = useExplorerStore((s) => s.selectCategory)

  const certServices = useMemo(
    () => getServicesForCertification(certificationId),
    [certificationId],
  )

  const highlightedCategories = useMemo(
    () => new Set(certServices.map((s) => s.category)),
    [certServices],
  )

  const categoryServiceCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const s of certServices) {
      counts.set(s.category, (counts.get(s.category) ?? 0) + 1)
    }
    return counts
  }, [certServices])

  const selectedCategory = categoryNodes.find((n) => n.id === selectedCategoryId)
  const servicesInCategory = selectedCategory
    ? certServices.filter((s) => s.category === selectedCategory.id)
    : []

  return (
    <>
      <color attach="background" args={['#070b14']} />
      <ambientLight intensity={0.45} />
      <pointLight position={[8, 10, 6]} intensity={1.2} color="#9ec9ff" />
      <pointLight position={[-6, -4, 4]} intensity={0.5} color="#ff9a5c" />
      <Stars radius={80} depth={40} count={2500} factor={3} saturation={0} fade speed={0.4} />

      <WorldEdges nodes={categoryNodes} highlightedCategories={highlightedCategories} />

      {categoryNodes.map((node) => {
        const inScope = highlightedCategories.has(node.id)
        return (
          <CategoryOrb
            key={node.id}
            node={node}
            active={inScope}
            dimmed={!inScope}
            serviceCount={categoryServiceCounts.get(node.id) ?? 0}
          />
        )
      })}

      {selectedCategory &&
        servicesInCategory.map((service, index) => (
          <ServiceNode
            key={service.id}
            service={service}
            index={index}
            total={servicesInCategory.length}
            origin={selectedCategory.position}
          />
        ))}

      <mesh
        position={[0, -4.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => selectCategory(null)}
      >
        <circleGeometry args={[12, 64]} />
        <meshBasicMaterial color="#070b14" transparent opacity={0} />
      </mesh>
    </>
  )
}

export function WorldScene() {
  return (
    <Canvas camera={{ position: [0, 2, 12], fov: 45 }} dpr={[1, 2]}>
      <Suspense fallback={null}>
        <WorldContent />
        <OrbitControls
          enablePan
          enableZoom
          minDistance={5}
          maxDistance={28}
          maxPolarAngle={Math.PI * 0.85}
        />
      </Suspense>
    </Canvas>
  )
}
