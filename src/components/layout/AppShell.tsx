import { CertFilterBar } from './CertFilterBar'
import { ModeSwitcher } from './ModeSwitcher'
import { ServiceInspector } from './ServiceInspector'
import { WorldScene } from '@/scene/WorldScene'
import { certifications } from '@/data/certifications'
import { useExplorerStore } from '@/store/explorerStore'

export function AppShell() {
  const certificationId = useExplorerStore((s) => s.certificationId)
  const cert = certifications.find((c) => c.id === certificationId)

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
          <p className="stage-caption__world">AWS World</p>
          <p className="stage-caption__cert">{cert?.fullName ?? certificationId}</p>
          <p className="stage-caption__hint">カテゴリを選ぶ → サービスが現れる</p>
        </div>
        <ServiceInspector />
      </main>

      <footer className="bottom-bar">
        <ModeSwitcher />
      </footer>
    </div>
  )
}
