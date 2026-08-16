import { getStorageOccupant, storageCity } from '@/data/storage'
import { StorageDistricts } from '@/scene/storage/StorageDistricts'
import { getStorageOccupantPosition } from '@/scene/storage/storageLayout'
import { CityEdges } from '@/scene/vpc/CityEdges'
import { CityOccupantNode } from '@/scene/vpc/CityOccupantNode'
import { useExplorerStore } from '@/store/explorerStore'

const S3_INBOUND = new Set(['sftp-s3', 'sgw-s3', 'sync-s3', 'snow-s3', 'ec2-s3-a'])
const HYBRID_IN = new Set(['site-sgw', 'sgw-s3', 'site-sync', 'sync-s3', 'sync-efs', 'sync-fsx', 'site-snow', 'snow-s3'])
const EFS_SPAN = new Set(['efs-a', 'efs-b', 'efs-ha'])
const FSX_SPAN = new Set(['fsx-a', 'fsx-b', 'fsx-ha'])

export function StorageCityContent() {
  const selectOccupant = useExplorerStore((s) => s.selectOccupant)

  return (
    <>
      <color attach="background" args={['#070b14']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 10, 8]} intensity={1.15} color="#9ec9ff" />
      <pointLight position={[-6, 4, -4]} intensity={0.55} color="#7AA116" />

      <StorageDistricts />
      <CityEdges
        city={storageCity}
        getOccupant={getStorageOccupant}
        getPosition={getStorageOccupantPosition}
        hubServiceId={null}
        extraLinkedFlowIds={(occupantId, serviceId) => {
          if (occupantId === 's3' || serviceId === 's3') return S3_INBOUND
          if (serviceId === 'efs' || occupantId === 'efs-a' || occupantId === 'efs-b') return EFS_SPAN
          if (serviceId === 'fsx' || occupantId === 'fsx-a' || occupantId === 'fsx-b') return FSX_SPAN
          if (
            occupantId === 'onprem' ||
            occupantId === 'sgw' ||
            occupantId === 'snowball' ||
            occupantId === 'datasync' ||
            serviceId === 'storage-gateway' ||
            serviceId === 'snowball' ||
            serviceId === 'datasync'
          ) {
            return HYBRID_IN
          }
          return new Set()
        }}
      />
      {storageCity.occupants.map((occupant) => (
        <CityOccupantNode key={occupant.id} occupant={occupant} />
      ))}

      <mesh
        position={[0, -0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => selectOccupant(null)}
      >
        <circleGeometry args={[22, 64]} />
        <meshBasicMaterial color="#070b14" transparent opacity={0} />
      </mesh>
    </>
  )
}
