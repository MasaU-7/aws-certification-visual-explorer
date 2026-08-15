import { certifications } from '@/data/certifications'
import { useExplorerStore } from '@/store/explorerStore'
import type { CertificationId } from '@/types/aws'

export function CertFilterBar() {
  const certificationId = useExplorerStore((s) => s.certificationId)
  const setCertification = useExplorerStore((s) => s.setCertification)

  return (
    <div className="cert-bar" role="toolbar" aria-label="資格フィルター">
      {certifications.map((cert) => {
        const selected = certificationId === cert.id
        return (
          <button
            key={cert.id}
            type="button"
            className={`cert-chip ${selected ? 'is-active' : ''} ${cert.active ? '' : 'is-disabled'}`}
            disabled={!cert.active}
            title={cert.active ? cert.fullName : `${cert.fullName}（準備中）`}
            onClick={() => setCertification(cert.id as CertificationId)}
          >
            {cert.shortLabel}
          </button>
        )
      })}
    </div>
  )
}
