import { getServiceById } from '@/data/services'
import { useExplorerStore } from '@/store/explorerStore'

export function ServiceInspector() {
  const selectedServiceId = useExplorerStore((s) => s.selectedServiceId)
  const selectService = useExplorerStore((s) => s.selectService)

  if (!selectedServiceId) return null

  const service = getServiceById(selectedServiceId)
  if (!service) return null

  return (
    <aside className="inspector" aria-label="サービス関係">
      <header className="inspector__header">
        <div
          className="inspector__swatch"
          style={{ background: service.visual.color }}
          aria-hidden
        />
        <h2>{service.name}</h2>
        <button type="button" className="inspector__close" onClick={() => selectService(null)}>
          ×
        </button>
      </header>

      <section>
        <h3>つながる先</h3>
        <ul className="chip-list">
          {service.relationships.map((rel) => (
            <li key={rel}>
              <button
                type="button"
                className="rel-chip"
                onClick={() => {
                  const target = getServiceById(rel)
                  if (target) selectService(target.id)
                }}
              >
                {rel}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>登場シナリオ</h3>
        <ul className="chip-list">
          {service.scenarios.map((sc) => (
            <li key={sc}>
              <span className="rel-chip is-static">{sc}</span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
