import {
  computeCity,
  getComputeOccupant,
  getComputePrimaryOccupantId,
  isComputeCityEntry,
  isComputeCityService,
} from '@/data/compute'
import {
  getCityOccupant as getVpcOccupant,
  getPrimaryOccupantId as getVpcPrimaryOccupantId,
  isNetworkCityEntry,
  isVpcCityService,
  vpcCity,
} from '@/data/vpc'
import type { CityView, SceneView, VpcCityDefinition } from '@/types/aws'

export function isCityView(view: SceneView): view is CityView {
  return view === 'network-city' || view === 'compute-city'
}

export function getCityDefinition(view: CityView): VpcCityDefinition {
  return view === 'compute-city' ? computeCity : vpcCity
}

export function getEntryCity(serviceId: string): CityView | null {
  if (isNetworkCityEntry(serviceId)) return 'network-city'
  if (isComputeCityEntry(serviceId)) return 'compute-city'
  return null
}

export function isServiceInCity(view: CityView, serviceId: string) {
  return view === 'compute-city' ? isComputeCityService(serviceId) : isVpcCityService(serviceId)
}

export function cityContainingService(serviceId: string, current: CityView): CityView | null {
  if (isServiceInCity(current, serviceId)) return current
  if (isComputeCityService(serviceId)) return 'compute-city'
  if (isVpcCityService(serviceId)) return 'network-city'
  return null
}

export function getActiveOccupant(view: SceneView, id: string) {
  if (view === 'compute-city') return getComputeOccupant(id)
  if (view === 'network-city') return getVpcOccupant(id)
  return undefined
}

export function getActivePrimaryOccupantId(view: CityView, serviceId: string | null) {
  return view === 'compute-city'
    ? getComputePrimaryOccupantId(serviceId)
    : getVpcPrimaryOccupantId(serviceId)
}

export function categoryForCity(view: CityView): 'network' | 'compute' {
  return view === 'compute-city' ? 'compute' : 'network'
}
