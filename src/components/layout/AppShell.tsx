import { useEffect } from 'react'
import { CertFilterBar } from './CertFilterBar'
import { ModeSwitcher } from './ModeSwitcher'
import { ServiceInspector } from './ServiceInspector'
import { WorldScene } from '@/scene/WorldScene'
import { certifications } from '@/data/certifications'
import { useExplorerStore } from '@/store/explorerStore'

export function AppShell() {
  const certificationId = useExplorerStore((s) => s.certificationId)
  const sceneView = useExplorerStore((s) => s.sceneView)
  const exitVpcCity = useExplorerStore((s) => s.exitVpcCity)
  const cert = certifications.find((c) => c.id === certificationId)
  const isCity = sceneView === 'vpc-city'

  useEffect(() => {
    if (!isCity) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') exitVpcCity()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isCity, exitVpcCity])

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <span className="brand__mark">AWS</span>
          <span className="brand__title">Visual Explorer</span>
        </div>
        <CertFilterBar />
      </header>

      <main className="stage">
        <WorldScene />
        <div className="stage-caption">
          {isCity ? (
            <>
              <p className="stage-caption__world">VPC City</p>
              <p className="stage-caption__cert">Internet · AWS · On-prem</p>
              <p className="stage-caption__hint">DX は専用 · VPN は Internet 経由</p>
              <button type="button" className="stage-caption__back" onClick={exitVpcCity}>
                AWS World
              </button>
            </>
          ) : (
            <>
              <p className="stage-caption__world">AWS World</p>
              <p className="stage-caption__cert">{cert?.fullName ?? certificationId}</p>
              <p className="stage-caption__hint">1回で関係 · 2回で中へ</p>
            </>
          )}
        </div>
        <ServiceInspector />
      </main>

      <footer className="bottom-bar">
        <ModeSwitcher />
      </footer>
    </div>
  )
}
