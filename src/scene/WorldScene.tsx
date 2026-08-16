import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Suspense, useLayoutEffect, useMemo } from 'react'
import { isCityView } from '@/data/cities'
import { categoryNodes } from '@/data/categories'
import { getServicesForCertification } from '@/data/services'
import { useExplorerStore } from '@/store/explorerStore'
import { buildRelationshipGraph } from '@/scene/layout/relatedServices'
import { AnalyticsCityContent } from '@/scene/analytics/AnalyticsCityContent'
import { CdnCityContent } from '@/scene/cdn/CdnCityContent'
import { ComputeCityContent } from '@/scene/compute/ComputeCityContent'
import { DatabaseCityContent } from '@/scene/database/DatabaseCityContent'
import { IntegrationCityContent } from '@/scene/integration/IntegrationCityContent'
import { ManagementCityContent } from '@/scene/management/ManagementCityContent'
import { SecurityCityContent } from '@/scene/security/SecurityCityContent'
import { StorageCityContent } from '@/scene/storage/StorageCityContent'
import { VpcCityContent } from '@/scene/vpc/VpcCityContent'
import { CategoryOrb } from './nodes/CategoryOrb'
import { GhostServiceNode } from './nodes/GhostServiceNode'
import { ServiceNode } from './nodes/ServiceNode'
import { ServiceEdges } from './edges/ServiceEdges'
import { WorldEdges } from './edges/WorldEdges'

function SceneCamera() {
  const sceneView = useExplorerStore((s) => s.sceneView)
  const { camera } = useThree()

  useLayoutEffect(() => {
    if (sceneView === 'network-city') {
      camera.position.set(-2.6, 9.4, 14.2)
    } else if (sceneView === 'compute-city') {
      camera.position.set(-1.55, 9.4, 14.2)
    } else if (sceneView === 'cdn-city') {
      camera.position.set(3.55, 10.4, 16.4)
    } else if (sceneView === 'storage-city') {
      camera.position.set(-3.15, 9.6, 14.6)
    } else if (sceneView === 'database-city') {
      camera.position.set(-1.55, 11.2, 17.4)
    } else if (sceneView === 'security-city') {
      camera.position.set(-0.15, 10.6, 16.4)
    } else if (sceneView === 'integration-city') {
      camera.position.set(1.75, 10.2, 15.8)
    } else if (sceneView === 'analytics-city') {
      camera.position.set(1.75, 10.2, 15.8)
    } else if (sceneView === 'management-city') {
      camera.position.set(1.75, 10.6, 16.6)
    } else {
      camera.position.set(0, 2.4, 15)
    }
    camera.updateProjectionMatrix()
  }, [sceneView, camera])

  return null
}

function WorldContent() {
  const certificationId = useExplorerStore((s) => s.certificationId)
  const selectedCategoryId = useExplorerStore((s) => s.selectedCategoryId)
  const selectedServiceId = useExplorerStore((s) => s.selectedServiceId)
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

  const certServiceIds = useMemo(() => new Set(certServices.map((s) => s.id)), [certServices])

  const selectedCategory = categoryNodes.find((n) => n.id === selectedCategoryId)
  const servicesInCategory = selectedCategory
    ? certServices.filter((s) => s.category === selectedCategory.id)
    : []

  const relationshipGraph = useMemo(() => {
    if (!selectedCategory) {
      return { ghosts: [], edges: [] }
    }
    return buildRelationshipGraph(
      selectedServiceId,
      servicesInCategory,
      selectedCategory.position,
      certServiceIds,
      certServices,
    )
  }, [
    selectedCategory,
    selectedServiceId,
    servicesInCategory,
    certServiceIds,
    certServices,
  ])

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

      {selectedCategory && (
        <>
          <ServiceEdges edges={relationshipGraph.edges} />
          {relationshipGraph.ghosts.map(({ service, position }) => (
            <GhostServiceNode key={`ghost-${service.id}`} service={service} position={position} />
          ))}
          {servicesInCategory.map((service, index) => (
            <ServiceNode
              key={service.id}
              service={service}
              index={index}
              total={servicesInCategory.length}
              origin={selectedCategory.position}
            />
          ))}
        </>
      )}

      <mesh
        position={[0, -4.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => selectCategory(null)}
      >
        <circleGeometry args={[18, 64]} />
        <meshBasicMaterial color="#070b14" transparent opacity={0} />
      </mesh>
    </>
  )
}

export function WorldScene() {
  const sceneView = useExplorerStore((s) => s.sceneView)
  const isCity = isCityView(sceneView)
  const orbitTarget: [number, number, number] =
    sceneView === 'network-city'
      ? [-2.6, 0.28, 0.45]
      : sceneView === 'compute-city'
        ? [0.55, 0.28, 0.2]
        : sceneView === 'cdn-city'
          ? [0.35, 0.28, 0.55]
          : sceneView === 'storage-city'
            ? [-1.55, 0.28, 0.25]
            : sceneView === 'database-city'
              ? [0.65, 0.28, 0.15]
              : sceneView === 'security-city'
                ? [-0.15, 0.28, 0.15]
                : sceneView === 'integration-city'
                  ? [1.75, 0.28, 0.15]
                  : sceneView === 'analytics-city'
                    ? [1.75, 0.28, 0.15]
                    : sceneView === 'management-city'
                      ? [1.75, 0.28, 0.05]
                      : [0, 0, 0]

  return (
    <Canvas camera={{ position: [0, 2.4, 15], fov: 45 }} dpr={[1, 2]}>
      <Suspense fallback={null}>
        <SceneCamera />
        {sceneView === 'network-city' ? (
          <VpcCityContent />
        ) : sceneView === 'compute-city' ? (
          <ComputeCityContent />
        ) : sceneView === 'cdn-city' ? (
          <CdnCityContent />
        ) : sceneView === 'storage-city' ? (
          <StorageCityContent />
        ) : sceneView === 'database-city' ? (
          <DatabaseCityContent />
        ) : sceneView === 'security-city' ? (
          <SecurityCityContent />
        ) : sceneView === 'integration-city' ? (
          <IntegrationCityContent />
        ) : sceneView === 'analytics-city' ? (
          <AnalyticsCityContent />
        ) : sceneView === 'management-city' ? (
          <ManagementCityContent />
        ) : (
          <WorldContent />
        )}
        <OrbitControls
          enablePan
          enableZoom
          target={orbitTarget}
          minDistance={isCity ? 7 : 5}
          maxDistance={isCity ? 28 : 36}
          minPolarAngle={isCity ? 0.32 : 0}
          maxPolarAngle={isCity ? Math.PI * 0.48 : Math.PI * 0.85}
        />
      </Suspense>
    </Canvas>
  )
}
