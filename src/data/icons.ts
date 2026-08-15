import type { ComponentType, SVGProps } from 'react'
import CategoryApplicationIntegration from 'aws-react-icons/icons/CategoryApplicationIntegration'
import CategoryCompute from 'aws-react-icons/icons/CategoryCompute'
import CategoryDatabases from 'aws-react-icons/icons/CategoryDatabases'
import CategoryManagementTools from 'aws-react-icons/icons/CategoryManagementTools'
import CategoryNetworkingContentDelivery from 'aws-react-icons/icons/CategoryNetworkingContentDelivery'
import CategorySecurityIdentity from 'aws-react-icons/icons/CategorySecurityIdentity'
import CategoryStorage from 'aws-react-icons/icons/CategoryStorage'
import ArchitectureServiceAmazonCloudFront from 'aws-react-icons/icons/ArchitectureServiceAmazonCloudFront'
import ArchitectureServiceAmazonCloudWatch from 'aws-react-icons/icons/ArchitectureServiceAmazonCloudWatch'
import ArchitectureServiceAmazonDynamoDB from 'aws-react-icons/icons/ArchitectureServiceAmazonDynamoDB'
import ArchitectureServiceAmazonEC2 from 'aws-react-icons/icons/ArchitectureServiceAmazonEC2'
import ArchitectureServiceAmazonEC2AutoScaling from 'aws-react-icons/icons/ArchitectureServiceAmazonEC2AutoScaling'
import ArchitectureServiceAmazonRDS from 'aws-react-icons/icons/ArchitectureServiceAmazonRDS'
import ArchitectureServiceAmazonRoute53 from 'aws-react-icons/icons/ArchitectureServiceAmazonRoute53'
import ArchitectureServiceAmazonSimpleNotificationService from 'aws-react-icons/icons/ArchitectureServiceAmazonSimpleNotificationService'
import ArchitectureServiceAmazonSimpleQueueService from 'aws-react-icons/icons/ArchitectureServiceAmazonSimpleQueueService'
import ArchitectureServiceAmazonSimpleStorageService from 'aws-react-icons/icons/ArchitectureServiceAmazonSimpleStorageService'
import ArchitectureServiceAmazonVirtualPrivateCloud from 'aws-react-icons/icons/ArchitectureServiceAmazonVirtualPrivateCloud'
import ArchitectureServiceAWSIdentityandAccessManagement from 'aws-react-icons/icons/ArchitectureServiceAWSIdentityandAccessManagement'
import ArchitectureServiceAWSLambda from 'aws-react-icons/icons/ArchitectureServiceAWSLambda'
import ArchitectureServiceElasticLoadBalancing from 'aws-react-icons/icons/ArchitectureServiceElasticLoadBalancing'
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
}
