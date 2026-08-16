import type { ComponentType, SVGProps } from 'react'
import CategoryAnalytics from 'aws-react-icons/icons/CategoryAnalytics'
import CategoryApplicationIntegration from 'aws-react-icons/icons/CategoryApplicationIntegration'
import CategoryCompute from 'aws-react-icons/icons/CategoryCompute'
import CategoryDatabases from 'aws-react-icons/icons/CategoryDatabases'
import CategoryManagementTools from 'aws-react-icons/icons/CategoryManagementTools'
import CategoryNetworkingContentDelivery from 'aws-react-icons/icons/CategoryNetworkingContentDelivery'
import CategorySecurityIdentity from 'aws-react-icons/icons/CategorySecurityIdentity'
import CategoryStorage from 'aws-react-icons/icons/CategoryStorage'
import ArchitectureServiceAmazonAthena from 'aws-react-icons/icons/ArchitectureServiceAmazonAthena'
import ArchitectureServiceAmazonAurora from 'aws-react-icons/icons/ArchitectureServiceAmazonAurora'
import ArchitectureServiceAmazonCloudFront from 'aws-react-icons/icons/ArchitectureServiceAmazonCloudFront'
import ArchitectureServiceAmazonCloudWatch from 'aws-react-icons/icons/ArchitectureServiceAmazonCloudWatch'
import ArchitectureServiceAmazonDocumentDB from 'aws-react-icons/icons/ArchitectureServiceAmazonDocumentDB'
import ArchitectureServiceAmazonDynamoDB from 'aws-react-icons/icons/ArchitectureServiceAmazonDynamoDB'
import ArchitectureServiceAmazonEC2 from 'aws-react-icons/icons/ArchitectureServiceAmazonEC2'
import ArchitectureServiceAmazonEC2AutoScaling from 'aws-react-icons/icons/ArchitectureServiceAmazonEC2AutoScaling'
import ArchitectureServiceAmazonEFS from 'aws-react-icons/icons/ArchitectureServiceAmazonEFS'
import ArchitectureServiceAmazonElastiCache from 'aws-react-icons/icons/ArchitectureServiceAmazonElastiCache'
import ArchitectureServiceAmazonElasticBlockStore from 'aws-react-icons/icons/ArchitectureServiceAmazonElasticBlockStore'
import ArchitectureServiceAmazonElasticContainerService from 'aws-react-icons/icons/ArchitectureServiceAmazonElasticContainerService'
import ArchitectureServiceAmazonEMR from 'aws-react-icons/icons/ArchitectureServiceAmazonEMR'
import ArchitectureServiceAmazonFSx from 'aws-react-icons/icons/ArchitectureServiceAmazonFSx'
import ArchitectureServiceAmazonGuardDuty from 'aws-react-icons/icons/ArchitectureServiceAmazonGuardDuty'
import ArchitectureServiceAmazonInspector from 'aws-react-icons/icons/ArchitectureServiceAmazonInspector'
import ArchitectureServiceAmazonKeyspaces from 'aws-react-icons/icons/ArchitectureServiceAmazonKeyspaces'
import ArchitectureServiceAmazonKinesis from 'aws-react-icons/icons/ArchitectureServiceAmazonKinesis'
import ArchitectureServiceAmazonMacie from 'aws-react-icons/icons/ArchitectureServiceAmazonMacie'
import ArchitectureServiceAmazonMemoryDB from 'aws-react-icons/icons/ArchitectureServiceAmazonMemoryDB'
import ArchitectureServiceAmazonNeptune from 'aws-react-icons/icons/ArchitectureServiceAmazonNeptune'
import ArchitectureServiceAmazonQuickSuite from 'aws-react-icons/icons/ArchitectureServiceAmazonQuickSuite'
import ArchitectureServiceAmazonRDS from 'aws-react-icons/icons/ArchitectureServiceAmazonRDS'
import ArchitectureServiceAmazonRedshift from 'aws-react-icons/icons/ArchitectureServiceAmazonRedshift'
import ArchitectureServiceAmazonRoute53 from 'aws-react-icons/icons/ArchitectureServiceAmazonRoute53'
import ArchitectureServiceAmazonSimpleEmailService from 'aws-react-icons/icons/ArchitectureServiceAmazonSimpleEmailService'
import ArchitectureServiceAmazonSimpleNotificationService from 'aws-react-icons/icons/ArchitectureServiceAmazonSimpleNotificationService'
import ArchitectureServiceAmazonSimpleQueueService from 'aws-react-icons/icons/ArchitectureServiceAmazonSimpleQueueService'
import ArchitectureServiceAmazonSimpleStorageService from 'aws-react-icons/icons/ArchitectureServiceAmazonSimpleStorageService'
import ArchitectureServiceAmazonTimestream from 'aws-react-icons/icons/ArchitectureServiceAmazonTimestream'
import ArchitectureServiceAmazonVirtualPrivateCloud from 'aws-react-icons/icons/ArchitectureServiceAmazonVirtualPrivateCloud'
import ArchitectureServiceAWSBatch from 'aws-react-icons/icons/ArchitectureServiceAWSBatch'
import ArchitectureServiceAWSBudgets from 'aws-react-icons/icons/ArchitectureServiceAWSBudgets'
import ArchitectureServiceAWSCertificateManager from 'aws-react-icons/icons/ArchitectureServiceAWSCertificateManager'
import ArchitectureServiceAWSClientVPN from 'aws-react-icons/icons/ArchitectureServiceAWSClientVPN'
import ArchitectureServiceAWSCloudFormation from 'aws-react-icons/icons/ArchitectureServiceAWSCloudFormation'
import ArchitectureServiceAWSCloudHSM from 'aws-react-icons/icons/ArchitectureServiceAWSCloudHSM'
import ArchitectureServiceAWSCloudTrail from 'aws-react-icons/icons/ArchitectureServiceAWSCloudTrail'
import ArchitectureServiceAWSConfig from 'aws-react-icons/icons/ArchitectureServiceAWSConfig'
import ArchitectureServiceAWSCostExplorer from 'aws-react-icons/icons/ArchitectureServiceAWSCostExplorer'
import ArchitectureServiceAWSDataSync from 'aws-react-icons/icons/ArchitectureServiceAWSDataSync'
import ArchitectureServiceAWSDirectConnect from 'aws-react-icons/icons/ArchitectureServiceAWSDirectConnect'
import ArchitectureServiceAWSDirectoryService from 'aws-react-icons/icons/ArchitectureServiceAWSDirectoryService'
import ArchitectureServiceAWSFirewallManager from 'aws-react-icons/icons/ArchitectureServiceAWSFirewallManager'
import ArchitectureServiceAWSGlobalAccelerator from 'aws-react-icons/icons/ArchitectureServiceAWSGlobalAccelerator'
import ArchitectureServiceAWSIAMIdentityCenter from 'aws-react-icons/icons/ArchitectureServiceAWSIAMIdentityCenter'
import ArchitectureServiceAWSIdentityandAccessManagement from 'aws-react-icons/icons/ArchitectureServiceAWSIdentityandAccessManagement'
import ArchitectureServiceAWSKeyManagementService from 'aws-react-icons/icons/ArchitectureServiceAWSKeyManagementService'
import ArchitectureServiceAWSLambda from 'aws-react-icons/icons/ArchitectureServiceAWSLambda'
import ArchitectureServiceAWSOrganizations from 'aws-react-icons/icons/ArchitectureServiceAWSOrganizations'
import ArchitectureServiceAWSSecretsManager from 'aws-react-icons/icons/ArchitectureServiceAWSSecretsManager'
import ArchitectureServiceAWSSecurityHub from 'aws-react-icons/icons/ArchitectureServiceAWSSecurityHub'
import ArchitectureServiceAWSShield from 'aws-react-icons/icons/ArchitectureServiceAWSShield'
import ArchitectureServiceAWSSitetoSiteVPN from 'aws-react-icons/icons/ArchitectureServiceAWSSitetoSiteVPN'
import ArchitectureServiceAWSSnowball from 'aws-react-icons/icons/ArchitectureServiceAWSSnowball'
import ArchitectureServiceAWSStepFunctions from 'aws-react-icons/icons/ArchitectureServiceAWSStepFunctions'
import ArchitectureServiceAWSStorageGateway from 'aws-react-icons/icons/ArchitectureServiceAWSStorageGateway'
import ArchitectureServiceAWSSystemsManager from 'aws-react-icons/icons/ArchitectureServiceAWSSystemsManager'
import ArchitectureServiceAWSTransferFamily from 'aws-react-icons/icons/ArchitectureServiceAWSTransferFamily'
import ArchitectureServiceAWSTransitGateway from 'aws-react-icons/icons/ArchitectureServiceAWSTransitGateway'
import ArchitectureServiceAWSWAF from 'aws-react-icons/icons/ArchitectureServiceAWSWAF'
import ArchitectureServiceElasticLoadBalancing from 'aws-react-icons/icons/ArchitectureServiceElasticLoadBalancing'
import ResourceAmazonVPCInternetGateway from 'aws-react-icons/icons/ResourceAmazonVPCInternetGateway'
import ResourceAmazonVPCNATGateway from 'aws-react-icons/icons/ResourceAmazonVPCNATGateway'
import ResourceAmazonVPCVPNGateway from 'aws-react-icons/icons/ResourceAmazonVPCVPNGateway'
import ResourceAWSDirectConnectGateway from 'aws-react-icons/icons/ResourceAWSDirectConnectGateway'
import type { ServiceCategory } from '@/types/aws'

type AwsIcon = ComponentType<SVGProps<SVGElement> & { size?: number | string }>

/** Official AWS Architecture Icons (via aws-react-icons). */
export const categoryIcons: Record<ServiceCategory, AwsIcon> = {
  compute: CategoryCompute,
  network: CategoryNetworkingContentDelivery,
  security: CategorySecurityIdentity,
  storage: CategoryStorage,
  database: CategoryDatabases,
  cdn: CategoryNetworkingContentDelivery,
  integration: CategoryApplicationIntegration,
  management: CategoryManagementTools,
  analytics: CategoryAnalytics,
}

export const serviceIcons: Record<string, AwsIcon> = {
  ec2: ArchitectureServiceAmazonEC2,
  lambda: ArchitectureServiceAWSLambda,
  elb: ArchitectureServiceElasticLoadBalancing,
  autoscaling: ArchitectureServiceAmazonEC2AutoScaling,
  vpc: ArchitectureServiceAmazonVirtualPrivateCloud,
  route53: ArchitectureServiceAmazonRoute53,
  s3: ArchitectureServiceAmazonSimpleStorageService,
  rds: ArchitectureServiceAmazonRDS,
  dynamodb: ArchitectureServiceAmazonDynamoDB,
  iam: ArchitectureServiceAWSIdentityandAccessManagement,
  cloudfront: ArchitectureServiceAmazonCloudFront,
  sqs: ArchitectureServiceAmazonSimpleQueueService,
  sns: ArchitectureServiceAmazonSimpleNotificationService,
  cloudwatch: ArchitectureServiceAmazonCloudWatch,
  ecs: ArchitectureServiceAmazonElasticContainerService,
  batch: ArchitectureServiceAWSBatch,
  'direct-connect': ArchitectureServiceAWSDirectConnect,
  'site-to-site-vpn': ArchitectureServiceAWSSitetoSiteVPN,
  'vpn-gateway': ResourceAmazonVPCVPNGateway,
  'client-vpn': ArchitectureServiceAWSClientVPN,
  'direct-connect-gateway': ResourceAWSDirectConnectGateway,
  'transit-gateway': ArchitectureServiceAWSTransitGateway,
  'global-accelerator': ArchitectureServiceAWSGlobalAccelerator,
  ebs: ArchitectureServiceAmazonElasticBlockStore,
  efs: ArchitectureServiceAmazonEFS,
  fsx: ArchitectureServiceAmazonFSx,
  'storage-gateway': ArchitectureServiceAWSStorageGateway,
  snowball: ArchitectureServiceAWSSnowball,
  'transfer-family': ArchitectureServiceAWSTransferFamily,
  datasync: ArchitectureServiceAWSDataSync,
  aurora: ArchitectureServiceAmazonAurora,
  redshift: ArchitectureServiceAmazonRedshift,
  elasticache: ArchitectureServiceAmazonElastiCache,
  memorydb: ArchitectureServiceAmazonMemoryDB,
  neptune: ArchitectureServiceAmazonNeptune,
  documentdb: ArchitectureServiceAmazonDocumentDB,
  keyspaces: ArchitectureServiceAmazonKeyspaces,
  timestream: ArchitectureServiceAmazonTimestream,
  organizations: ArchitectureServiceAWSOrganizations,
  'identity-center': ArchitectureServiceAWSIAMIdentityCenter,
  'directory-service': ArchitectureServiceAWSDirectoryService,
  kms: ArchitectureServiceAWSKeyManagementService,
  cloudhsm: ArchitectureServiceAWSCloudHSM,
  acm: ArchitectureServiceAWSCertificateManager,
  'secrets-manager': ArchitectureServiceAWSSecretsManager,
  guardduty: ArchitectureServiceAmazonGuardDuty,
  'security-hub': ArchitectureServiceAWSSecurityHub,
  macie: ArchitectureServiceAmazonMacie,
  inspector: ArchitectureServiceAmazonInspector,
  shield: ArchitectureServiceAWSShield,
  waf: ArchitectureServiceAWSWAF,
  'firewall-manager': ArchitectureServiceAWSFirewallManager,
  'step-functions': ArchitectureServiceAWSStepFunctions,
  ses: ArchitectureServiceAmazonSimpleEmailService,
  emr: ArchitectureServiceAmazonEMR,
  kinesis: ArchitectureServiceAmazonKinesis,
  athena: ArchitectureServiceAmazonAthena,
  quicksight: ArchitectureServiceAmazonQuickSuite,
  cloudtrail: ArchitectureServiceAWSCloudTrail,
  config: ArchitectureServiceAWSConfig,
  cloudformation: ArchitectureServiceAWSCloudFormation,
  'systems-manager': ArchitectureServiceAWSSystemsManager,
  'cost-explorer': ArchitectureServiceAWSCostExplorer,
  budgets: ArchitectureServiceAWSBudgets,
}

export const fixtureIcons: Record<'igw' | 'nat', AwsIcon> = {
  igw: ResourceAmazonVPCInternetGateway,
  nat: ResourceAmazonVPCNATGateway,
}
