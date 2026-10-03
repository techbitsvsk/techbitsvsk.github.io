/* Registry mapping content/motion.js keys to the built-in SVG
   diagrams. A manifest entry with a real `src` never reaches
   this map — Media renders the file instead. */

import StranglerFig from './StranglerFig'
import OrchestrationChoreography from './OrchestrationChoreography'
import HybridSplit from './HybridSplit'
import IcebergLakehouse from './IcebergLakehouse'
import ZeroTrustProvisioning from './ZeroTrustProvisioning'
import GovernedAgent from './GovernedAgent'
import CrossCloudFailover from './CrossCloudFailover'
import ActiveActive from './ActiveActive'
import ReplicateRelocateFederate from './ReplicateRelocateFederate'
import LineageGraph from './LineageGraph'

export const motionComponents = {
  'strangler-fig': StranglerFig,
  'orchestration-choreography': OrchestrationChoreography,
  'hybrid-split': HybridSplit,
  'iceberg-lakehouse': IcebergLakehouse,
  'zero-trust-provisioning': ZeroTrustProvisioning,
  'governed-agent': GovernedAgent,
  'cross-cloud-failover': CrossCloudFailover,
  'active-active': ActiveActive,
  'replicate-relocate-federate': ReplicateRelocateFederate,
  'lineage-graph': LineageGraph,
}
