import { getCityDefinition, isCityView } from '@/data/cities'
import {
  flowColor,
  LINK_KIND_LABEL,
  LINK_OVERLAY_LABEL,
} from '@/scene/edges/cityFlowStyle'
import { FLOW_COLORS } from '@/scene/vpc/cityLayout'
import { useExplorerStore } from '@/store/explorerStore'
import type { CityFlow, CityLinkKind, CityLinkOverlay } from '@/types/aws'

const KIND_ORDER: CityLinkKind[] = ['path', 'attach', 'associate', 'access']
const OVERLAY_ORDER: CityLinkOverlay[] = ['internet', 'offline']

const KIND_SAMPLE: Record<CityLinkKind, CityFlow> = {
  path: {
    id: 'legend-path',
    from: 'a',
    to: 'b',
    role: 'app',
    kind: 'path',
    direction: 'fwd',
  },
  attach: {
    id: 'legend-attach',
    from: 'a',
    to: 'b',
    role: 'data',
    kind: 'attach',
    direction: 'none',
  },
  associate: {
    id: 'legend-associate',
    from: 'a',
    to: 'b',
    role: 'hybrid',
    kind: 'associate',
    direction: 'none',
  },
  access: {
    id: 'legend-access',
    from: 'a',
    to: 'b',
    role: 'data',
    kind: 'access',
    direction: 'fwd',
  },
}

function LineSwatch({
  color,
  dashed,
  dotted,
  arrows = 'fwd',
}: {
  color: string
  dashed?: boolean
  dotted?: boolean
  arrows?: 'fwd' | 'both' | 'none'
}) {
  const broken = dashed || dotted
  return (
    <span className="city-legend__swatch" aria-hidden>
      {arrows === 'both' ? (
        <span className="city-legend__caret city-legend__caret--left" style={{ borderRightColor: color }} />
      ) : null}
      <span
        className={`city-legend__line${dashed ? ' is-dashed' : ''}${dotted ? ' is-dotted' : ''}`}
        style={{ background: broken ? 'transparent' : color, borderColor: color }}
      />
      {arrows === 'fwd' || arrows === 'both' ? (
        <span className="city-legend__caret" style={{ borderLeftColor: color }} />
      ) : null}
    </span>
  )
}

export function CityLinkLegend() {
  const sceneView = useExplorerStore((s) => s.sceneView)
  if (!isCityView(sceneView)) return null

  const flows = getCityDefinition(sceneView).flows
  const kinds = KIND_ORDER.filter((kind) => flows.some((f) => f.kind === kind))
  const overlays = OVERLAY_ORDER.filter((overlay) => flows.some((f) => f.overlay === overlay))
  const hasBoth = flows.some((f) => f.direction === 'both')
  const pathRoles = [...new Set(flows.filter((f) => f.kind === 'path').map((f) => f.role))]

  return (
    <aside className="city-legend" aria-label="線の凡例">
      <p className="city-legend__title">線</p>
      <ul className="city-legend__list">
        {kinds.map((kind) => (
          <li key={kind}>
            <LineSwatch
              color={kind === 'path' ? FLOW_COLORS.ingress : flowColor(KIND_SAMPLE[kind])}
              dashed={kind === 'access'}
              dotted={kind === 'associate'}
              arrows={kind === 'attach' || kind === 'associate' ? 'none' : 'fwd'}
            />
            <span>{LINK_KIND_LABEL[kind]}</span>
          </li>
        ))}
        {hasBoth ? (
          <li>
            <LineSwatch color={FLOW_COLORS.hybrid} arrows="both" />
            <span>双方向</span>
          </li>
        ) : null}
        {overlays.map((overlay) => (
          <li key={overlay}>
            <LineSwatch color={FLOW_COLORS.hybrid} dashed arrows="fwd" />
            <span>{LINK_OVERLAY_LABEL[overlay]}</span>
          </li>
        ))}
      </ul>
      {pathRoles.length > 1 ? (
        <ul className="city-legend__roles">
          {pathRoles.map((role) => (
            <li key={role}>
              <span className="city-legend__dot" style={{ background: FLOW_COLORS[role] }} />
              {role}
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  )
}
