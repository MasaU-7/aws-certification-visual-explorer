import type { CategoryNode } from '@/types/aws'

/** Layout positions for the AWS World map (Phase 1) */
export const categoryNodes: CategoryNode[] = [
  { id: 'compute', label: 'Compute', position: [-4, 1.5, 0], color: '#ED7100' },
  { id: 'network', label: 'Network', position: [0, 0.5, 0], color: '#8C4FFF' },
  { id: 'security', label: 'Security', position: [4, 1.2, 0], color: '#DD344C' },
  { id: 'storage', label: 'Storage', position: [3, -1.8, 0], color: '#7AA116' },
  { id: 'database', label: 'Database', position: [-3, -1.8, 0], color: '#C925D1' },
  { id: 'cdn', label: 'CDN / Edge', position: [0, 3, 0], color: '#8C4FFF' },
  { id: 'integration', label: 'Integration', position: [-5.5, -0.2, 0], color: '#E7157B' },
  { id: 'management', label: 'Management', position: [5.5, -0.2, 0], color: '#E7157B' },
]
