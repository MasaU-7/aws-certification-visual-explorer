import { create } from 'zustand'
import {
  categoryForCity,
  cityContainingService,
  defaultCityService,
  getActiveOccupant,
  getActivePrimaryOccupantId,
  getEntryCity,
  isCityView,
  isServiceInCity,
} from '@/data/cities'
import { getServiceById } from '@/data/services'
import type { AppMode, CertificationId, CityView, SceneView } from '@/types/aws'

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
  enterCity: (view: CityView, serviceId?: string) => void
  exitCity: () => void
  setZoomLevel: (level: number) => void
}

export const useExplorerStore = create<ExplorerState>((set, get) => ({
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
    set((state) => {
      if (!id) {
        return { selectedServiceId: null, selectedOccupantId: null }
      }
      if (!isCityView(state.sceneView)) {
        return { selectedServiceId: id, selectedOccupantId: null }
      }
      const nextView = cityContainingService(id, state.sceneView)
      if (!nextView) {
        return { selectedServiceId: id, selectedOccupantId: null, sceneView: 'world' }
      }
      return {
        sceneView: nextView,
        selectedCategoryId: categoryForCity(nextView),
        selectedServiceId: id,
        selectedOccupantId: getActivePrimaryOccupantId(nextView, id),
      }
    }),
  clickService: (id) =>
    set((state) => {
      if (state.selectedServiceId === id) {
        const entry = getEntryCity(id)
        if (entry && state.sceneView === 'world') {
          return {
            sceneView: entry,
            selectedCategoryId: categoryForCity(entry),
            selectedServiceId: id,
            selectedOccupantId: getActivePrimaryOccupantId(entry, id),
          }
        }
        return {
          selectedServiceId: null,
          selectedOccupantId: null,
        }
      }

      if (isCityView(state.sceneView) && !isServiceInCity(state.sceneView, id)) {
        const nextView = cityContainingService(id, state.sceneView)
        if (nextView) {
          return {
            sceneView: nextView,
            selectedCategoryId: categoryForCity(nextView),
            selectedServiceId: id,
            selectedOccupantId: getActivePrimaryOccupantId(nextView, id),
          }
        }
        return {
          selectedServiceId: id,
          selectedOccupantId: null,
          sceneView: 'world',
        }
      }

      return {
        selectedServiceId: id,
        selectedOccupantId: isCityView(state.sceneView)
          ? getActivePrimaryOccupantId(state.sceneView, id)
          : null,
        sceneView: state.sceneView,
      }
    }),
  selectOccupant: (id) => {
    if (!id) {
      set({ selectedOccupantId: null, selectedServiceId: null })
      return
    }
    const occupant = getActiveOccupant(get().sceneView, id)
    set({
      selectedOccupantId: id,
      selectedServiceId: occupant?.serviceId ?? null,
    })
  },
  enterCity: (view, serviceId) => {
    const id = serviceId ?? defaultCityService(view)
    set({
      sceneView: view,
      selectedCategoryId: categoryForCity(view),
      selectedServiceId: id,
      selectedOccupantId: getActivePrimaryOccupantId(view, id),
    })
  },
  exitCity: () =>
    set((state) => {
      const service = state.selectedServiceId ? getServiceById(state.selectedServiceId) : undefined
      const fallbackCategory = isCityView(state.sceneView) ? categoryForCity(state.sceneView) : 'network'
      return {
        sceneView: 'world',
        selectedOccupantId: null,
        selectedServiceId:
          state.selectedServiceId ??
          (isCityView(state.sceneView) ? defaultCityService(state.sceneView) : 'vpc'),
        selectedCategoryId: service?.category ?? fallbackCategory,
      }
    }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
}))
