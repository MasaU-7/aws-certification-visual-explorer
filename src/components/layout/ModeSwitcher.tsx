import { useExplorerStore } from '@/store/explorerStore'
import type { AppMode } from '@/types/aws'

const MODES: Array<{ id: AppMode; label: string; ready: boolean }> = [
  { id: 'explore', label: 'Explore', ready: true },
  { id: 'scenario', label: 'Scenario', ready: false },
  { id: 'architecture', label: 'Architecture', ready: false },
]

export function ModeSwitcher() {
  const mode = useExplorerStore((s) => s.mode)
  const setMode = useExplorerStore((s) => s.setMode)

  return (
    <nav className="mode-bar" aria-label="モード">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          className={`mode-btn ${mode === m.id ? 'is-active' : ''}`}
          disabled={!m.ready}
          title={m.ready ? m.label : `${m.label}（Phase 後続）`}
          onClick={() => setMode(m.id)}
        >
          {m.label}
        </button>
      ))}
    </nav>
  )
}
