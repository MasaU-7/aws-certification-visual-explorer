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
  databaseCity,
  getDatabaseOccupant,
  getDatabasePrimaryOccupantId,
  isDatabaseCityEntry,
  isDatabaseCityService,
} from '@/data/database'
import {
  getIntegrationOccupant,
  getIntegrationPrimaryOccupantId,
  isIntegrationCityEntry,
  isIntegrationCityService,
  integrationCity,
} from '@/data/integration'
import {
  getSecurityOccupant,
  getSecurityPrimaryOccupantId,
  isSecurityCityEntry,
  isSecurityCityService,
  securityCity,
} from '@/data/security'
import {
  getStorageOccupant,
  getStoragePrimaryOccupantId,
  isStorageCityEntry,
  isStorageCityService,
  storageCity,
} from '@/data/storage'
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
  'storage-city': storageCity,
  'database-city': databaseCity,
  'security-city': securityCity,
  'integration-city': integrationCity,
}

const CATEGORY_BY_CITY: Record<CityView, ServiceCategory> = {
  'network-city': 'network',
  'compute-city': 'compute',
  'cdn-city': 'cdn',
  'storage-city': 'storage',
  'database-city': 'database',
  'security-city': 'security',
  'integration-city': 'integration',
}

const DEFAULT_SERVICE_BY_CITY: Record<CityView, string> = {
  'network-city': 'vpc',
  'compute-city': 'ec2',
  'cdn-city': 'cloudfront',
  'storage-city': 's3',
  'database-city': 'rds',
  'security-city': 'iam',
  'integration-city': 'sns',
}

export function isCityView(view: SceneView): view is CityView {
  return (
    view === 'network-city' ||
    view === 'compute-city' ||
    view === 'cdn-city' ||
    view === 'storage-city' ||
    view === 'database-city' ||
    view === 'security-city' ||
    view === 'integration-city'
  )
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
  if (isStorageCityEntry(serviceId)) return 'storage-city'
  if (isDatabaseCityEntry(serviceId)) return 'database-city'
  if (isSecurityCityEntry(serviceId)) return 'security-city'
  if (isIntegrationCityEntry(serviceId)) return 'integration-city'
  return null
}

export function isServiceInCity(view: CityView, serviceId: string) {
  if (view === 'compute-city') return isComputeCityService(serviceId)
  if (view === 'cdn-city') return isCdnCityService(serviceId)
  if (view === 'storage-city') return isStorageCityService(serviceId)
  if (view === 'database-city') return isDatabaseCityService(serviceId)
  if (view === 'security-city') return isSecurityCityService(serviceId)
  if (view === 'integration-city') return isIntegrationCityService(serviceId)
  return isVpcCityService(serviceId)
}

export function cityContainingService(serviceId: string, current: CityView): CityView | null {
  if (isServiceInCity(current, serviceId)) return current
  const entry = getEntryCity(serviceId)
  if (entry) return entry
  if (isComputeCityService(serviceId)) return 'compute-city'
  if (isVpcCityService(serviceId)) return 'network-city'
  if (isCdnCityService(serviceId)) return 'cdn-city'
  if (isStorageCityService(serviceId)) return 'storage-city'
  if (isDatabaseCityService(serviceId)) return 'database-city'
  if (isSecurityCityService(serviceId)) return 'security-city'
  if (isIntegrationCityService(serviceId)) return 'integration-city'
  return null
}

export function getActiveOccupant(view: SceneView, id: string) {
  if (view === 'compute-city') return getComputeOccupant(id)
  if (view === 'network-city') return getVpcOccupant(id)
  if (view === 'cdn-city') return getCdnOccupant(id)
  if (view === 'storage-city') return getStorageOccupant(id)
  if (view === 'database-city') return getDatabaseOccupant(id)
  if (view === 'security-city') return getSecurityOccupant(id)
  if (view === 'integration-city') return getIntegrationOccupant(id)
  return undefined
}

export function getActivePrimaryOccupantId(view: CityView, serviceId: string | null) {
  if (view === 'compute-city') return getComputePrimaryOccupantId(serviceId)
  if (view === 'cdn-city') return getCdnPrimaryOccupantId(serviceId)
  if (view === 'storage-city') return getStoragePrimaryOccupantId(serviceId)
  if (view === 'database-city') return getDatabasePrimaryOccupantId(serviceId)
  if (view === 'security-city') return getSecurityPrimaryOccupantId(serviceId)
  if (view === 'integration-city') return getIntegrationPrimaryOccupantId(serviceId)
  return getVpcPrimaryOccupantId(serviceId)
}

export function categoryForCity(view: CityView): ServiceCategory {
  return CATEGORY_BY_CITY[view]
}
