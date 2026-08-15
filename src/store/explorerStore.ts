import { create } from 'zustand'
import type { AppMode, CertificationId } from '@/types/aws'

interface ExplorerState {
  certificationId: CertificationId
  mode: AppMode
  selectedCategoryId: string | null
  selectedServiceId: string | null
  zoomLevel: number
  setCertification: (id: CertificationId) => void
  setMode: (mode: AppMode) => void
  selectCategory: (id: string | null) => void
  selectService: (id: string | null) => void
  setZoomLevel: (level: number) => void
}

export const useExplorerStore = create<ExplorerState>((set) => ({
  certificationId: 'SAA-C03',
  mode: 'explore',
  selectedCategoryId: null,
  selectedServiceId: null,
  zoomLevel: 0,
  setCertification: (id) => set({ certificationId: id, selectedServiceId: null }),
  setMode: (mode) => set({ mode }),
  selectCategory: (id) => set({ selectedCategoryId: id, selectedServiceId: null }),
  selectService: (id) => set({ selectedServiceId: id }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
}))
