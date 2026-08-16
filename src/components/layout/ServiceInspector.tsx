import { getActiveOccupant, isCityView } from '@/data/cities'
import { fixtureIcons, serviceIcons } from '@/data/icons'
import { getServiceById } from '@/data/services'
import { useExplorerStore } from '@/store/explorerStore'
import type { CityOccupant } from '@/types/aws'

const AZ_LABEL = { 'az-a': 'AZ-a', 'az-b': 'AZ-b' } as const
const TIER_LABEL = { public: 'Public', private: 'Private' } as const

export function ServiceInspector() {
  const selectedServiceId = useExplorerStore((s) => s.selectedServiceId)
  const selectedOccupantId = useExplorerStore((s) => s.selectedOccupantId)
  const sceneView = useExplorerStore((s) => s.sceneView)
  const selectService = useExplorerStore((s) => s.selectService)
  const selectOccupant = useExplorerStore((s) => s.selectOccupant)

  const occupant = selectedOccupantId ? getActiveOccupant(sceneView, selectedOccupantId) : undefined
  const service = selectedServiceId ? getServiceById(selectedServiceId) : undefined

  if (isCityView(sceneView) && selectedServiceId === 'vpc' && !occupant) return null

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
            <div
              className="inspector__swatch"
              style={{ background: '#9ED4FF' }}
              aria-hidden
            />
          )}
          <h2>{occupant.label}</h2>
          <button type="button" className="inspector__close" onClick={close}>
            ×
          </button>
        </header>
        <LocationSection occupant={occupant} />
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

      {occupant && <LocationSection occupant={occupant} />}

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

function LocationSection({ occupant }: { occupant: CityOccupant }) {
  const sceneView = useExplorerStore((s) => s.sceneView)
  const chips: string[] = []
  if (occupant.kind === 'internet') chips.push('outside')
  if (occupant.kind === 'igw') {
    chips.push(sceneView === 'cdn-city' ? 'region' : 'AWS', sceneView === 'cdn-city' ? 'VPC' : 'edge')
  }
  if (occupant.kind === 'onprem') chips.push('on-prem')
  if (occupant.id === 'lambda') {
    chips.push(
      ...(sceneView === 'cdn-city'
        ? ['region', 'origin']
        : ['AWS', 'managed', 'outside VPC']),
    )
  }
  if (occupant.id === 'lambda-edge') chips.push('edge', 'PoP', 'Lambda@Edge')
  if (occupant.id === 'lambda-vpc') chips.push('in VPC')
  if (occupant.id === 'asg') chips.push('AWS', 'group')
  if (occupant.id === 'cloudwatch') chips.push('AWS', 'metrics')
  if (occupant.id === 'dynamodb') chips.push('AWS', 'managed')
  if (occupant.id === 'batch' && !occupant.az) chips.push('AWS', 'scheduler')
  if (occupant.serviceId === 'ecs' && occupant.az) chips.push('task')
  if (occupant.serviceId === 's3' && !occupant.az) {
    chips.push(sceneView === 'cdn-city' ? 'region' : 'AWS', sceneView === 'cdn-city' ? 'origin' : 'event')
  }
  if (occupant.serviceId === 'sqs' && !occupant.az) chips.push('AWS', 'event')
  if (occupant.serviceId === 'cloudfront') chips.push('edge', 'PoP', 'cache')
  if (occupant.serviceId === 'global-accelerator') chips.push('edge', 'anycast')
  if (occupant.serviceId === 'waf' || occupant.serviceId === 'shield') chips.push('edge')
  if (occupant.serviceId === 'acm') chips.push('edge', 'tls')
  if (occupant.serviceId === 'elb' && sceneView === 'cdn-city') {
    chips.push('origin', occupant.id.startsWith('nlb') ? 'L4' : 'L7')
  }
  if (occupant.serviceId === 'route53') chips.push('outside', 'dns')
  if (occupant.serviceId === 'direct-connect') chips.push('DX location', 'dedicated')
  if (occupant.serviceId === 'site-to-site-vpn') chips.push('over Internet')
  if (occupant.serviceId === 'vpn-gateway') chips.push('AWS', 'VPC', 'edge')
  if (occupant.serviceId === 'client-vpn') chips.push('AWS', 'VPC', 'over Internet')
  if (occupant.serviceId === 'transit-gateway' || occupant.serviceId === 'direct-connect-gateway') {
    chips.push('AWS')
  }
  if (occupant.az) chips.push(AZ_LABEL[occupant.az])
  if (occupant.tier) chips.push(TIER_LABEL[occupant.tier])
  if (chips.length === 0) return null

  return (
    <section>
      <h3>場所</h3>
      <ul className="chip-list">
        {chips.map((chip) => (
          <li key={chip}>
            <span className={`rel-chip is-static loc-chip loc-chip--${chip.toLowerCase().replace(/\s+/g, '-')}`}>{chip}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
