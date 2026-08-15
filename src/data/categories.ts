import type { CategoryNode } from '@/types/aws'

/**
 * AWS World layout — Network をハブに置く。
 * 公式カテゴリ名に寄せつつ、CDN/Edge は配信の位置が分かるよう分離。
 */
export const categoryNodes: CategoryNode[] = [
  { id: 'cdn', label: 'CDN / Edge', position: [0, 3.2, 0], color: '#8C4FFF' },
  { id: 'compute', label: 'Compute', position: [-4.2, 1.4, 0], color: '#ED7100' },
  { id: 'network', label: 'Networking', position: [0, 0.4, 0], color: '#8C4FFF' },
  { id: 'security', label: 'Security', position: [4.2, 1.4, 0], color: '#DD344C' },
  { id: 'database', label: 'Databases', position: [-3.2, -2.2, 0], color: '#C925D1' },
  { id: 'storage', label: 'Storage', position: [3.2, -2.2, 0], color: '#7AA116' },
  { id: 'integration', label: 'Integration', position: [-5.8, -0.4, 0], color: '#E7157B' },
  { id: 'management', label: 'Management', position: [5.8, -0.4, 0], color: '#E7157B' },
]
