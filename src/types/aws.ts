/** Certification exam codes currently supported or planned */
export type CertificationId = 'SAA-C03' | 'CLF-C02' | 'DVA-C02' | 'SOA-C03'

export type ServiceCategory =
  | 'compute'
  | 'storage'
  | 'network'
  | 'database'
  | 'security'
  | 'integration'
  | 'management'
  | 'cdn'
  | 'analytics'

export type VisualShape =
  | 'server'
  | 'bucket'
  | 'network'
  | 'database'
  | 'identity'
  | 'scale'
  | 'queue'
  | 'topic'
  | 'function'
  | 'edge'
  | 'monitor'

export type AppMode = 'explore' | 'scenario' | 'architecture'

export type SceneView = 'world' | 'network-city' | 'compute-city' | 'cdn-city'

export type CityView = Exclude<SceneView, 'world'>

export type AvailabilityZoneId = 'az-a' | 'az-b'

export type SubnetTier = 'public' | 'private'

export type CityOccupantKind = 'internet' | 'igw' | 'nat' | 'service' | 'onprem'

export type CityFlowRole = 'ingress' | 'app' | 'data' | 'egress' | 'hybrid' | 'scale' | 'event'

export interface CityOccupant {
  id: string
  kind: CityOccupantKind
  label: string
  az: AvailabilityZoneId | null
  tier: SubnetTier | null
  /** Present when the occupant is an existing AwsService */
  serviceId?: string
}

export interface CityFlow {
  id: string
  from: string
  to: string
  role: CityFlowRole
}

export interface VpcCityDefinition {
  id: string
  azs: AvailabilityZoneId[]
  occupants: CityOccupant[]
  flows: CityFlow[]
}

export interface ServiceVisual {
  type: VisualShape
  color: string
  shape: string
}

export interface AwsService {
  id: string
  name: string
  category: ServiceCategory
  visual: ServiceVisual
  concepts: string[]
  relationships: string[]
  certifications: CertificationId[]
  scenarios: string[]
  /** Prefer empty — behavior over text */
  hint?: string
}

export interface CategoryNode {
  id: ServiceCategory
  label: string
  position: [number, number, number]
  color: string
}

export interface CertificationMeta {
  id: CertificationId
  shortLabel: string
  fullName: string
  active: boolean
}

export interface ScenarioDefinition {
  id: string
  title: string
  goal: string
  requiredServices: string[]
  certifications: CertificationId[]
}
