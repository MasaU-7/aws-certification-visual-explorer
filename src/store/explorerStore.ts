import { create } from 'zustand'
import { getCityOccupant, isVpcCityService } from '@/data/vpc'
import type { AppMode, CertificationId, SceneView } from '@/types/aws'

interface ExplorerState {
  certificationId: CertificationId
  mode: AppMode
  sceneView: SceneView
  selectedCategoryId: string | null
  selectedServiceId: string | null
  selectedOccupantId: string | null
  zoomLevel: number
  setCertification: (id: CertificationId) => void
  setMode: (mode: AppMode) => void
  selectCategory: (id: string | null) => void
  selectService: (id: string | null) => void
  clickService: (id: string) => void
  selectOccupant: (id: string | null) => void
  enterVpcCity: () => void
  exitVpcCity: () => void
  setZoomLevel: (level: number) => void
}

export const useExplorerStore = create<ExplorerState>((set) => ({
  certificationId: 'SAA-C03',
  mode: 'explore',
  sceneView: 'world',
  selectedCategoryId: null,
  selectedServiceId: null,
  selectedOccupantId: null,
  zoomLevel: 0,
  setCertification: (id) =>
    set({
      certificationId: id,
      selectedServiceId: null,
      selectedOccupantId: null,
      sceneView: 'world',
    }),
  setMode: (mode) => set({ mode }),
  selectCategory: (id) =>
    set({
      selectedCategoryId: id,
      selectedServiceId: null,
      selectedOccupantId: null,
      sceneView: 'world',
    }),
  selectService: (id) =>
    set((state) => ({
      selectedServiceId: id,
      selectedOccupantId: null,
      sceneView:
        id && state.sceneView === 'vpc-city' && !isVpcCityService(id)
          ? 'world'
          : state.sceneView,
    })),
  clickService: (id) =>
    set((state) => {
      if (state.selectedServiceId === id) {
        if (id === 'vpc' && state.sceneView === 'world') {
          return {
            sceneView: 'vpc-city' as const,
            selectedCategoryId: 'network',
            selectedServiceId: 'vpc',
            selectedOccupantId: null,
          }
        }
        return {
          selectedServiceId: null,
          selectedOccupantId: null,
        }
      }

      return {
        selectedServiceId: id,
        selectedOccupantId: null,
        sceneView:
          state.sceneView === 'vpc-city' && !isVpcCityService(id)
            ? 'world'
            : state.sceneView,
      }
    }),
  selectOccupant: (id) => {
    if (!id) {
      set({ selectedOccupantId: null, selectedServiceId: null })
      return
    }
    const occupant = getCityOccupant(id)
    set({
      selectedOccupantId: id,
      selectedServiceId: occupant?.serviceId ?? null,
    })
  },
  enterVpcCity: () =>
    set({
      sceneView: 'vpc-city',
      selectedCategoryId: 'network',
      selectedServiceId: 'vpc',
      selectedOccupantId: null,
    }),
  exitVpcCity: () =>
    set({
      sceneView: 'world',
      selectedOccupantId: null,
      selectedServiceId: 'vpc',
      selectedCategoryId: 'network',
    }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
}))
