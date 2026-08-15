import type { CategoryNode } from '@/types/aws'

/**
 * AWS World layout — Network をハブに置く。
 * Analytics は DB / Storage と隣り合わせ（用途選択の位置関係）。
 */
export const categoryNodes: CategoryNode[] = [
  { id: 'cdn', label: 'CDN / Edge', position: [0, 3.6, 0], color: '#8C4FFF' },
  { id: 'compute', label: 'Compute', position: [-5.2, 1.8, 0], color: '#ED7100' },
  { id: 'network', label: 'Networking', position: [0, 0.5, 0], color: '#8C4FFF' },
  { id: 'security', label: 'Security', position: [5.2, 1.8, 0], color: '#DD344C' },
  { id: 'database', label: 'Databases', position: [-5.0, -2.6, 0], color: '#C925D1' },
  { id: 'analytics', label: 'Analytics', position: [0, -3.4, 0], color: '#1B9A8E' },
  { id: 'storage', label: 'Storage', position: [5.0, -2.6, 0], color: '#7AA116' },
  { id: 'integration', label: 'Integration', position: [-6.6, -0.3, 0], color: '#E7157B' },
  { id: 'management', label: 'Management', position: [6.6, -0.3, 0], color: '#E7157B' },
]
