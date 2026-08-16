import type { AwsService, ServiceCategory, ServiceVisual } from '@/types/aws'

const SAA = ['SAA-C03'] as const

const COLOR: Record<ServiceCategory, string> = {
  compute: '#ED7100',
  storage: '#7AA116',
  network: '#8C4FFF',
  database: '#C925D1',
  security: '#DD344C',
  integration: '#E7157B',
  management: '#E7157B',
  cdn: '#8C4FFF',
  analytics: '#1B9A8E',
}

function visual(category: ServiceCategory, type: ServiceVisual['type'], shape: string): ServiceVisual {
  return { type, color: COLOR[category], shape }
}

function svc(
  id: string,
  name: string,
  category: ServiceCategory,
  type: ServiceVisual['type'],
  shape: string,
  concepts: string[],
  relationships: string[],
  scenarios: string[],
): AwsService {
  return {
    id,
    name,
    category,
    visual: visual(category, type, shape),
    concepts,
    relationships,
    certifications: [...SAA],
    scenarios,
  }
}

/**
 * SAA-C03 で AWS World に置くサービス。
 * ノードにしないもの（AMI / アカウント / SWF / QLDB / Data Pipeline）は
 * 関連サービスの concepts に残し、図鑑化しない。
 */
export const services: AwsService[] = [
  svc('ec2', 'EC2', 'compute', 'server', 'instance', ['compute', 'instance', 'ami', 'scaling'], ['vpc', 'ebs', 'elb', 'autoscaling', 'iam', 'ecs', 'systems-manager'], ['web-application', 'auto-scaling', 'high-availability']),
  svc('lambda', 'Lambda', 'compute', 'function', 'function', ['compute', 'event', 'serverless', 'lambda-at-edge'], ['s3', 'dynamodb', 'sqs', 'sns', 'iam', 'step-functions', 'kinesis', 'cloudfront'], ['event-driven', 'edge-performance']),
  svc('autoscaling', 'Auto Scaling', 'compute', 'scale', 'group', ['scaling', 'elasticity', 'availability'], ['ec2', 'elb', 'cloudwatch'], ['auto-scaling', 'web-application']),
  svc('ecs', 'ECS', 'compute', 'server', 'container', ['compute', 'container', 'orchestration'], ['ec2', 'elb', 'iam', 'efs', 'step-functions'], ['web-application']),
  svc('batch', 'Batch', 'compute', 'server', 'batch', ['compute', 'batch', 'queue'], ['ecs', 'ec2', 's3', 'iam', 'step-functions'], ['event-driven']),

  svc('elb', 'ELB / ALB', 'network', 'network', 'balancer', ['load-balancing', 'availability', 'nlb'], ['ec2', 'autoscaling', 'vpc', 'route53', 'waf', 'acm', 'global-accelerator'], ['web-application', 'high-availability', 'edge-performance']),
  svc('vpc', 'VPC', 'network', 'network', 'city', ['network', 'isolation', 'subnet', 'routing'], ['ec2', 'rds', 'elb', 'direct-connect', 'site-to-site-vpn', 'vpn-gateway', 'transit-gateway', 'client-vpn'], ['web-application', 'high-availability', 'hybrid-network']),
  svc('route53', 'Route 53', 'network', 'edge', 'dns', ['dns', 'routing', 'failover'], ['cloudfront', 'elb', 's3', 'global-accelerator'], ['web-application', 'edge-performance']),
  svc('direct-connect', 'Direct Connect', 'network', 'network', 'dx', ['hybrid', 'dedicated', 'private'], ['vpc', 'direct-connect-gateway', 'transit-gateway', 'vpn-gateway', 'site-to-site-vpn'], ['hybrid-network']),
  svc('site-to-site-vpn', 'Site-to-Site VPN', 'network', 'network', 'vpn', ['hybrid', 'encrypted', 'backup-path'], ['vpn-gateway', 'vpc', 'direct-connect', 'client-vpn'], ['hybrid-network']),
  svc('vpn-gateway', 'VPN GW', 'network', 'network', 'vgw', ['hybrid', 'vgw', 'vpc-attachment'], ['vpc', 'site-to-site-vpn', 'direct-connect-gateway', 'direct-connect'], ['hybrid-network']),
  svc('client-vpn', 'Client VPN', 'network', 'network', 'client-vpn', ['remote-access', 'managed-vpn'], ['vpc', 'directory-service', 'site-to-site-vpn'], ['hybrid-network']),
  svc('direct-connect-gateway', 'Direct Connect GW', 'network', 'network', 'dxgw', ['hybrid', 'multi-region', 'multi-account'], ['direct-connect', 'vpn-gateway', 'transit-gateway', 'vpc'], ['hybrid-network']),
  svc('transit-gateway', 'Transit Gateway', 'network', 'network', 'tgw', ['hub-spoke', 'transit', 'peering'], ['vpc', 'direct-connect', 'direct-connect-gateway'], ['hybrid-network']),

  svc('cloudfront', 'CloudFront', 'cdn', 'edge', 'cdn', ['cdn', 'edge', 'caching', 'lambda-at-edge'], ['s3', 'elb', 'lambda', 'route53', 'acm', 'waf', 'shield', 'global-accelerator'], ['web-application', 'static-site', 'edge-performance']),
  svc('global-accelerator', 'Global Accelerator', 'cdn', 'edge', 'anycast', ['anycast', 'static-ip', 'failover', 'nlb'], ['route53', 'elb', 'cloudfront'], ['edge-performance']),

  svc('s3', 'S3', 'storage', 'bucket', 'bucket', ['object-storage', 'durability', 'static-hosting'], ['cloudfront', 'lambda', 'iam', 'storage-gateway', 'macie', 'athena', 'datasync'], ['web-application', 'static-site', 'storage-choice']),
  svc('ebs', 'EBS', 'storage', 'bucket', 'block', ['block-storage', 'az-scope', 'snapshot'], ['ec2', 'rds'], ['storage-choice']),
  svc('efs', 'EFS', 'storage', 'bucket', 'nfs', ['shared-file', 'multi-az', 'nfs'], ['ec2', 'ecs', 's3', 'datasync'], ['storage-choice']),
  svc('fsx', 'FSx', 'storage', 'bucket', 'managed-file', ['windows-file', 'lustre', 'ontap'], ['directory-service', 'vpc', 's3', 'datasync'], ['storage-choice']),
  svc('storage-gateway', 'Storage Gateway', 'storage', 'bucket', 'hybrid-storage', ['hybrid', 'file-gateway', 'volume-gateway'], ['s3', 'ebs', 'snowball'], ['hybrid-network', 'storage-choice']),
  svc('snowball', 'Snowball', 'storage', 'bucket', 'snow', ['migration', 'offline', 'edge'], ['s3', 'datasync', 'storage-gateway'], ['storage-choice']),
  svc('transfer-family', 'Transfer Family', 'storage', 'bucket', 'sftp', ['sftp', 'ftps', 'managed-transfer'], ['s3', 'efs', 'iam'], ['storage-choice']),
  svc('datasync', 'DataSync', 'storage', 'bucket', 'sync', ['online-transfer', 'nfs', 'smb'], ['s3', 'efs', 'fsx', 'snowball'], ['storage-choice']),

  svc('rds', 'RDS', 'database', 'database', 'rdb', ['database', 'multi-az', 'backup'], ['vpc', 'iam', 'aurora', 'ebs'], ['web-application', 'high-availability']),
  svc('aurora', 'Aurora', 'database', 'database', 'aurora', ['database', 'mysql', 'postgresql'], ['rds', 'vpc', 'iam'], ['web-application', 'high-availability']),
  svc('dynamodb', 'DynamoDB', 'database', 'database', 'nosql', ['database', 'serverless', 'key-value'], ['lambda', 'iam'], ['event-driven']),
  svc('redshift', 'Redshift', 'database', 'database', 'warehouse', ['warehouse', 'columnar', 'olap'], ['s3', 'iam', 'vpc', 'quicksight'], ['analytics-path']),
  svc('elasticache', 'ElastiCache', 'database', 'database', 'cache', ['cache', 'redis', 'memcached'], ['vpc', 'rds', 'ec2', 'memorydb'], ['web-application']),
  svc('memorydb', 'MemoryDB', 'database', 'database', 'durable-redis', ['redis', 'durable', 'in-memory'], ['vpc', 'elasticache'], ['web-application']),
  svc('neptune', 'Neptune', 'database', 'database', 'graph', ['graph', 'gremlin', 'sparql'], ['vpc', 'iam'], ['data-choice']),
  svc('documentdb', 'DocumentDB', 'database', 'database', 'document', ['mongodb', 'document', 'json'], ['vpc', 'iam'], ['data-choice']),
  svc('keyspaces', 'Keyspaces', 'database', 'database', 'cassandra', ['cassandra', 'wide-column', 'serverless'], ['iam'], ['data-choice']),
  svc('timestream', 'Timestream', 'database', 'database', 'timeseries', ['timeseries', 'iot', 'serverless'], ['iam', 'kinesis'], ['data-choice']),

  svc('iam', 'IAM', 'security', 'identity', 'key', ['identity', 'permission', 'least-privilege'], ['ec2', 's3', 'lambda', 'organizations', 'identity-center', 'kms', 'secrets-manager'], ['web-application', 'secure-architecture']),
  svc('organizations', 'Organizations', 'security', 'identity', 'org', ['multi-account', 'scp', 'ou'], ['iam', 'identity-center', 'firewall-manager', 'cloudtrail'], ['secure-architecture']),
  svc('identity-center', 'IAM Identity Center', 'security', 'identity', 'sso', ['sso', 'workforce', 'permission-set'], ['iam', 'organizations', 'directory-service'], ['secure-architecture']),
  svc('directory-service', 'Directory Service', 'security', 'identity', 'ad', ['managed-ad', 'ad-connector', 'hybrid-identity'], ['identity-center', 'client-vpn', 'fsx'], ['hybrid-network', 'secure-architecture']),
  svc('kms', 'KMS', 'security', 'identity', 'cmk', ['encryption', 'cmk', 'envelope'], ['iam', 'cloudhsm', 'secrets-manager', 's3'], ['secure-architecture']),
  svc('cloudhsm', 'CloudHSM', 'security', 'identity', 'hsm', ['hsm', 'fips', 'single-tenant'], ['kms'], ['secure-architecture']),
  svc('acm', 'Certificate Manager', 'security', 'identity', 'cert', ['tls', 'certificate', 'renewal'], ['cloudfront', 'elb', 'waf'], ['web-application', 'secure-edge']),
  svc('secrets-manager', 'Secrets Manager', 'security', 'identity', 'secret', ['secret', 'rotation', 'credential'], ['iam', 'kms', 'rds', 'systems-manager'], ['secure-architecture']),
  svc('guardduty', 'GuardDuty', 'security', 'monitor', 'threat', ['threat-detection', 'findings'], ['cloudtrail', 'security-hub', 's3'], ['secure-architecture']),
  svc('security-hub', 'Security Hub', 'security', 'monitor', 'hub', ['findings', 'cspm', 'aggregation'], ['guardduty', 'inspector', 'macie', 'config', 'firewall-manager'], ['secure-architecture']),
  svc('macie', 'Macie', 'security', 'monitor', 'pii', ['pii', 's3', 'classification'], ['s3', 'security-hub'], ['secure-architecture']),
  svc('inspector', 'Inspector', 'security', 'monitor', 'vuln', ['vulnerability', 'ec2', 'container'], ['ec2', 'security-hub'], ['secure-architecture']),
  svc('shield', 'Shield', 'security', 'network', 'ddos', ['ddos', 'shield-advanced'], ['cloudfront', 'route53', 'waf', 'firewall-manager'], ['secure-edge']),
  svc('waf', 'WAF', 'security', 'network', 'waf', ['layer7', 'acl', 'bot'], ['cloudfront', 'elb', 'shield', 'firewall-manager', 'acm'], ['secure-edge']),
  svc('firewall-manager', 'Firewall Manager', 'security', 'network', 'fms', ['central-policy', 'org-scope'], ['waf', 'shield', 'organizations', 'security-hub'], ['secure-architecture', 'secure-edge']),

  svc('sqs', 'SQS', 'integration', 'queue', 'queue', ['queue', 'decoupling', 'async'], ['lambda', 'sns', 'step-functions'], ['event-driven']),
  svc('sns', 'SNS', 'integration', 'topic', 'topic', ['pub-sub', 'fan-out', 'notification'], ['sqs', 'lambda', 'ses', 'budgets'], ['event-driven']),
  svc('step-functions', 'Step Functions', 'integration', 'function', 'state-machine', ['orchestration', 'workflow', 'state'], ['lambda', 'sqs', 'sns', 'ecs', 'batch'], ['event-driven']),
  svc('ses', 'SES', 'integration', 'topic', 'email', ['email', 'outbound'], ['sns', 'iam'], ['event-driven']),

  svc('emr', 'EMR', 'analytics', 'monitor', 'hadoop', ['spark', 'hadoop', 'cluster'], ['s3', 'ec2', 'kinesis'], ['analytics-path']),
  svc('kinesis', 'Kinesis', 'analytics', 'queue', 'stream', ['stream', 'ingest', 'real-time'], ['lambda', 's3', 'emr', 'timestream'], ['analytics-path', 'event-driven']),
  svc('athena', 'Athena', 'analytics', 'monitor', 'query', ['sql', 's3', 'serverless'], ['s3', 'quicksight'], ['analytics-path']),
  svc('quicksight', 'QuickSight', 'analytics', 'monitor', 'bi', ['bi', 'dashboard', 'spice'], ['athena', 'redshift', 'rds'], ['analytics-path']),

  svc('cloudwatch', 'CloudWatch', 'management', 'monitor', 'metrics', ['monitoring', 'alarm', 'observability'], ['ec2', 'autoscaling', 'lambda', 'elb', 'cloudtrail'], ['auto-scaling', 'web-application']),
  svc('cloudtrail', 'CloudTrail', 'management', 'monitor', 'audit', ['api-log', 'audit', 'governance'], ['cloudwatch', 's3', 'guardduty', 'organizations'], ['secure-architecture']),
  svc('config', 'Config', 'management', 'monitor', 'compliance', ['config-rule', 'drift', 'inventory'], ['cloudtrail', 'security-hub', 'iam'], ['secure-architecture']),
  svc('cloudformation', 'CloudFormation', 'management', 'scale', 'stack', ['iac', 'stack', 'drift'], ['iam', 'config'], ['web-application']),
  svc('systems-manager', 'Systems Manager', 'management', 'monitor', 'ssm', ['session-manager', 'parameter-store', 'patch'], ['ec2', 'iam', 'secrets-manager', 'cloudwatch'], ['secure-architecture']),
  svc('cost-explorer', 'Cost Explorer', 'management', 'monitor', 'cost', ['cost', 'usage', 'forecast'], ['budgets', 'organizations'], ['cost-control']),
  svc('budgets', 'Budgets', 'management', 'monitor', 'budget', ['threshold', 'alert'], ['cost-explorer', 'sns'], ['cost-control']),
]

export function getServiceById(id: string): AwsService | undefined {
  return services.find((s) => s.id === id)
}

export function getServicesForCertification(certId: string): AwsService[] {
  return services.filter((s) => s.certifications.includes(certId as AwsService['certifications'][number]))
}
