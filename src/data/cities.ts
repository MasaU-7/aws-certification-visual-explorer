import {
  cdnCity,
  getCdnOccupant,
  getCdnPrimaryOccupantId,
  isCdnCityEntry,
  isCdnCityService,
} from '@/data/cdn'
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
import type { CityView, SceneView, ServiceCategory, VpcCityDefinition } from '@/types/aws'

const CITY_BY_VIEW: Record<CityView, VpcCityDefinition> = {
  'network-city': vpcCity,
  'compute-city': computeCity,
  'cdn-city': cdnCity,
}

const CATEGORY_BY_CITY: Record<CityView, ServiceCategory> = {
  'network-city': 'network',
  'compute-city': 'compute',
  'cdn-city': 'cdn',
}

const DEFAULT_SERVICE_BY_CITY: Record<CityView, string> = {
  'network-city': 'vpc',
  'compute-city': 'ec2',
  'cdn-city': 'cloudfront',
}

export function isCityView(view: SceneView): view is CityView {
  return view === 'network-city' || view === 'compute-city' || view === 'cdn-city'
}

export function getCityDefinition(view: CityView): VpcCityDefinition {
  return CITY_BY_VIEW[view]
}

export function defaultCityService(view: CityView) {
  return DEFAULT_SERVICE_BY_CITY[view]
}

export function getEntryCity(serviceId: string): CityView | null {
  if (isNetworkCityEntry(serviceId)) return 'network-city'
  if (isComputeCityEntry(serviceId)) return 'compute-city'
  if (isCdnCityEntry(serviceId)) return 'cdn-city'
  return null
}

export function isServiceInCity(view: CityView, serviceId: string) {
  if (view === 'compute-city') return isComputeCityService(serviceId)
  if (view === 'cdn-city') return isCdnCityService(serviceId)
  return isVpcCityService(serviceId)
}

export function cityContainingService(serviceId: string, current: CityView): CityView | null {
  if (isServiceInCity(current, serviceId)) return current
  if (isComputeCityService(serviceId)) return 'compute-city'
  if (isVpcCityService(serviceId)) return 'network-city'
  if (isCdnCityService(serviceId)) return 'cdn-city'
  return null
}

export function getActiveOccupant(view: SceneView, id: string) {
  if (view === 'compute-city') return getComputeOccupant(id)
  if (view === 'network-city') return getVpcOccupant(id)
  if (view === 'cdn-city') return getCdnOccupant(id)
  return undefined
}

export function getActivePrimaryOccupantId(view: CityView, serviceId: string | null) {
  if (view === 'compute-city') return getComputePrimaryOccupantId(serviceId)
  if (view === 'cdn-city') return getCdnPrimaryOccupantId(serviceId)
  return getVpcPrimaryOccupantId(serviceId)
}

export function categoryForCity(view: CityView): ServiceCategory {
  return CATEGORY_BY_CITY[view]
}
