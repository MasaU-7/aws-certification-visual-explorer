import type { CertificationMeta } from '@/types/aws'

export const certifications: CertificationMeta[] = [
  {
    id: 'SAA-C03',
    shortLabel: 'SAA',
    fullName: 'AWS Certified Solutions Architect – Associate',
    active: true,
  },
  {
    id: 'CLF-C02',
    shortLabel: 'CLF',
    fullName: 'AWS Certified Cloud Practitioner',
    active: false,
  },
  {
    id: 'DVA-C02',
    shortLabel: 'DVA',
    fullName: 'AWS Certified Developer – Associate',
    active: false,
  },
  {
    id: 'SOA-C03',
    shortLabel: 'SOA',
    fullName: 'AWS Certified SysOps Administrator – Associate',
    active: false,
  },
]
