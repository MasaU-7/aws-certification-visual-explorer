import { getCityOccupant } from '@/data/vpc'
import { fixtureIcons, serviceIcons } from '@/data/icons'
import { getServiceById } from '@/data/services'
import { useExplorerStore } from '@/store/explorerStore'
import type { AvailabilityZoneId, CityOccupantKind, SubnetTier } from '@/types/aws'

const AZ_LABEL = { 'az-a': 'AZ-a', 'az-b': 'AZ-b' } as const
const TIER_LABEL = { public: 'Public', private: 'Private' } as const

export function ServiceInspector() {
  const selectedServiceId = useExplorerStore((s) => s.selectedServiceId)
  const selectedOccupantId = useExplorerStore((s) => s.selectedOccupantId)
  const sceneView = useExplorerStore((s) => s.sceneView)
  const selectService = useExplorerStore((s) => s.selectService)
  const selectOccupant = useExplorerStore((s) => s.selectOccupant)

  const occupant = selectedOccupantId ? getCityOccupant(selectedOccupantId) : undefined
  const service = selectedServiceId ? getServiceById(selectedServiceId) : undefined

  if (sceneView === 'vpc-city' && selectedServiceId === 'vpc' && !occupant) return null

  if (!occupant && !service) return null

  const close = () => {
    if (occupant) selectOccupant(null)
    else selectService(null)
  }

  if (occupant && !service) {
    const Icon = occupant.kind === 'igw' || occupant.kind === 'nat' ? fixtureIcons[occupant.kind] : undefined

    return (
      <aside className="inspector" aria-label="都市の要素">
        <header className="inspector__header">
          {Icon ? (
            <span className="inspector__icon" aria-hidden>
              <Icon size={28} />
            </span>
          ) : (
            <div className="inspector__swatch" style={{ background: '#9ED4FF' }} aria-hidden />
          )}
          <h2>{occupant.label}</h2>
          <button type="button" className="inspector__close" onClick={close}>
            ×
          </button>
        </header>
        <LocationSection az={occupant.az} tier={occupant.tier} kind={occupant.kind} />
      </aside>
    )
  }

  if (!service) return null

  const Icon = serviceIcons[service.id]

  return (
    <aside className="inspector" aria-label="サービス関係">
      <header className="inspector__header">
        {Icon ? (
          <span className="inspector__icon" aria-hidden>
            <Icon size={28} />
          </span>
        ) : (
          <div
            className="inspector__swatch"
            style={{ background: service.visual.color }}
            aria-hidden
          />
        )}
        <h2>{service.name}</h2>
        <button type="button" className="inspector__close" onClick={close}>
          ×
        </button>
      </header>

      {occupant && <LocationSection az={occupant.az} tier={occupant.tier} kind={occupant.kind} />}

      <section>
        <h3>つながる先</h3>
        <ul className="chip-list">
          {service.relationships.map((rel) => {
            const RelIcon = serviceIcons[rel]
            return (
              <li key={rel}>
                <button
                  type="button"
                  className="rel-chip"
                  onClick={() => {
                    const target = getServiceById(rel)
                    if (target) selectService(target.id)
                  }}
                >
                  {RelIcon && (
                    <span className="rel-chip__icon" aria-hidden>
                      <RelIcon size={16} />
                    </span>
                  )}
                  {getServiceById(rel)?.name ?? rel}
                </button>
              </li>
            )
          })}
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

function LocationSection({
  az,
  tier,
  kind,
}: {
  az: AvailabilityZoneId | null
  tier: SubnetTier | null
  kind: CityOccupantKind
}) {
  const chips: string[] = []
  if (kind === 'internet') chips.push('outside')
  if (kind === 'igw') chips.push('edge')
  if (az) chips.push(AZ_LABEL[az])
  if (tier) chips.push(TIER_LABEL[tier])
  if (chips.length === 0) return null

  return (
    <section>
      <h3>場所</h3>
      <ul className="chip-list">
        {chips.map((chip) => (
          <li key={chip}>
            <span className={`rel-chip is-static loc-chip loc-chip--${chip.toLowerCase()}`}>{chip}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
