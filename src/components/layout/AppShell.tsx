import { useEffect } from 'react'
import { CertFilterBar } from './CertFilterBar'
import { CityLinkLegend } from './CityLinkLegend'
import { ModeSwitcher } from './ModeSwitcher'
import { ServiceInspector } from './ServiceInspector'
import { WorldScene } from '@/scene/WorldScene'
import { certifications } from '@/data/certifications'
import { isCityView } from '@/data/cities'
import { useExplorerStore } from '@/store/explorerStore'

export function AppShell() {
  const certificationId = useExplorerStore((s) => s.certificationId)
  const sceneView = useExplorerStore((s) => s.sceneView)
  const exitCity = useExplorerStore((s) => s.exitCity)
  const cert = certifications.find((c) => c.id === certificationId)
  const isCity = isCityView(sceneView)
  const isCompute = sceneView === 'compute-city'
  const isCdn = sceneView === 'cdn-city'
  const isStorage = sceneView === 'storage-city'
  const isDatabase = sceneView === 'database-city'

  useEffect(() => {
    if (!isCity) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') exitCity()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isCity, exitCity])

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
          {isCompute ? (
            <>
              <p className="stage-caption__world">Compute City</p>
              <p className="stage-caption__cert">VPC 内 · Managed</p>
              <p className="stage-caption__hint">Lambda は既定で VPC 外</p>
              <button type="button" className="stage-caption__back" onClick={exitCity}>
                AWS World
              </button>
            </>
          ) : isCdn ? (
            <>
              <p className="stage-caption__world">CDN / Edge City</p>
              <p className="stage-caption__cert">Edge · Region origin</p>
              <p className="stage-caption__hint">CF はキャッシュ · GA は Anycast</p>
              <button type="button" className="stage-caption__back" onClick={exitCity}>
                AWS World
              </button>
            </>
          ) : isStorage ? (
            <>
              <p className="stage-caption__world">Storage City</p>
              <p className="stage-caption__cert">VPC · Object · On-prem</p>
              <p className="stage-caption__hint">EBS はアタッチ · S3 は API</p>
              <button type="button" className="stage-caption__back" onClick={exitCity}>
                AWS World
              </button>
            </>
          ) : isDatabase ? (
            <>
              <p className="stage-caption__world">Databases City</p>
              <p className="stage-caption__cert">VPC 内 · Serverless</p>
              <p className="stage-caption__hint">RDS は Multi-AZ · DynamoDB は VPC 外</p>
              <button type="button" className="stage-caption__back" onClick={exitCity}>
                AWS World
              </button>
            </>
          ) : isCity ? (
            <>
              <p className="stage-caption__world">Networking City</p>
              <p className="stage-caption__cert">Internet · AWS · On-prem</p>
              <p className="stage-caption__hint">DX は専用 · VPN は Internet 経由</p>
              <button type="button" className="stage-caption__back" onClick={exitCity}>
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
        <CityLinkLegend />
      </main>

      <footer className="bottom-bar">
        <ModeSwitcher />
      </footer>
    </div>
  )
}
