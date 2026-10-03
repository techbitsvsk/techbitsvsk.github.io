/* ============================================================
   Animated media manifest.

   One entry per animation. While `src` is null the page renders
   the matching built-in animated SVG from
   components/motion/index.jsx — crisp at any size, a few KB,
   and themed with the site palette.

   TO SWAP IN A REAL RECORDING
   ---------------------------
   1. Put the file in  public/assets/motion/
   2. Set `src` below, plus `poster` (a still frame — shown
      before load and to anyone who prefers reduced motion).

        src:    '/assets/motion/strangler-fig.mp4',
        poster: '/assets/motion/strangler-fig.jpg',

   That is the whole change. Nothing else needs editing.

   FORMAT NOTE
   -----------
   MP4 (H.264) or WebM, not GIF. A 5-second screen capture is
   roughly 8–15 MB as a GIF and 400–800 KB as an MP4, and a GIF
   cannot be paused — which fails WCAG 2.2.2 for any loop over
   five seconds. `.gif` still works if that is what you have.

   To convert what you already have:
     ffmpeg -i in.gif -movflags faststart -pix_fmt yuv420p \
       -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" out.mp4
     ffmpeg -i out.mp4 -vframes 1 poster.jpg
   ============================================================ */

export const motionAssets = {
  'strangler-fig': {
    src: null,
    poster: null,
    aspectRatio: '16 / 10',
    caption:
      'The decomposition: the WebLogic risk monolith gives way to a shared Spring Boot framework, with business logic packaged as a bundle of JARs. Each jar runs with the framework as its own standalone process, and CQRS separates risk computation from reporting. Report generation falls from 12 hours to under two — BCBS 239 P5 timeliness, in practice.',
    alt: 'A monolithic application progressively replaced by a shared framework plus business-logic JARs, orchestrated by BPMN activities that each dispatch a standalone job, with report generation dropping from 12 hours to under 2 hours.',
  },

  'orchestration-choreography': {
    src: null,
    poster: null,
    aspectRatio: '16 / 10',
    caption:
      'The two control planes, working as one rather than competing. Choreography sits on top and is reactive: upstream feed events decide when ingestion may start, with cross-check validation, dependencies between feeds, and a fall back to the prior feed when the holiday calendar says a source is not publishing. Orchestration sits underneath and is deterministic: a BPMN process decides the order, dispatches each activity as a standalone job, and owns reruns, the holiday calendar, and what-if scenarios fanned out as multiple batches. Events release work downward, finished jobs raise events back up, and the balance between the two follows what the workload needs — which in a credit-risk context is a BCBS 239 obligation, not a preference.',
    alt: 'An event-driven choreography plane deciding when feeds may be ingested, above a BPMN orchestration plane deciding the order and dispatching standalone jobs, with work released downward and completion events raised back up.',
  },

  'hybrid-split': {
    src: null,
    poster: null,
    aspectRatio: '16 / 10',
    caption:
      'The hybrid split: 5% of workloads held on-premises by regulatory obligation, 95% in the cloud, with compute free to move across the boundary. The orchestration layer is the same shape as the BPMN orchestrator that preceded it, re-expressed in open tooling — Apache Airflow in containers, driving Spark jobs on whichever side of the boundary the data sits.',
    alt: 'A platform divided into a small on-premises zone and a large cloud zone, with compute and data moving between them across a governed boundary, and a containerised Apache Airflow layer beneath scheduling Spark jobs into both zones.',
  },

  'iceberg-lakehouse': {
    src: null,
    poster: null,
    aspectRatio: '16 / 10',
    caption:
      'One Iceberg table, every engine: Kafka ingest lands once, and Glue, EMR and Athena all read the same snapshot through Lake Formation.',
    alt: 'Streaming ingest landing into a single Apache Iceberg table, which is then read in parallel by three separate query and processing engines.',
  },

  'zero-trust-provisioning': {
    src: null,
    poster: null,
    aspectRatio: '16 / 10',
    caption:
      'Zero-trust provisioning: a workspace specification merges in Git, a service principal applies it, and the governed workspace emerges with controls already inherited. No standing human access at any point.',
    alt: 'A specification committed to Git, applied by a service principal through a CI/CD pipeline, producing a governed workspace with security controls already applied.',
  },

  'governed-agent': {
    src: null,
    poster: null,
    aspectRatio: '16 / 10',
    caption:
      'One governed data product, published once with its entities, relationships, business rules and contracts, reached through four callers — Fabric, Microsoft 365, any compatible agent over the Model Context Protocol, and a domain orchestrator. The agent is not a black box: the governed source determines the tool rather than the agent choosing freely, so there is no translation layer to maintain. Security follows the user, enforced at the data and catalogue layers rather than inside the agent, which is what makes the choice of caller reversible. Nothing publishes until it has been through the Agent Development Lifecycle — the whole cycle, not a gate at the end.',
    alt: 'A single governed data product feeding a Fabric data agent that selects DAX, SQL or KQL according to the source, serving four different callers, with user-following security enforced at the data layer and an agent development lifecycle beneath.',
  },

  'cross-cloud-failover': {
    src: null,
    poster: null,
    aspectRatio: '16 / 10',
    caption:
      'Cross-cloud failover: AWS and Azure on a shared Iceberg and Kafka foundation, with one governance model. Traffic drains to the secondary and the run emits a supervisory audit artefact.',
    alt: 'Traffic failing over from a primary AWS region to a secondary Azure region across a shared data foundation, producing an audit record.',
  },

  'active-active': {
    src: null,
    poster: null,
    aspectRatio: '16 / 10',
    caption:
      'Resiliency Category 0: both regions serve live writes on Iceberg, with Nessie as the versioned catalog and Polaris as the open catalog API. The hard problem here is commit coordination, not failover — and the honest costs are split-brain risk and roughly double the spend.',
    alt: 'Two production regions both serving live writes, coordinating commits through a global coordinator, replicating data and catalog metadata between them, and merging regional branches into main.',
  },

  'replicate-relocate-federate': {
    src: null,
    poster: null,
    aspectRatio: '16 / 10',
    caption:
      'Where data sits is a residency decision before it is an engineering one. Only then does the question become which of three moves applies: replicate a governed copy, relocate the data to where the compute already is, or leave it in place and federate to it so the query travels instead. Three principles hold underneath whichever move is chosen — data stays near the compute that uses it, integrations align to what the platform provides natively rather than to connectors we would have to maintain, and data that should not move is virtualised through federation.',
    alt: 'Three placement options side by side — replicate a copy to the compute side, relocate the data to the compute side, or leave the data at origin and send the query to it — above three principles: data near to compute, native integrations first, and virtualise via federation.',
  },

  'lineage-graph': {
    src: null,
    poster: null,
    aspectRatio: '16 / 10',
    caption:
      'Column lineage as a graph: a five-hop traversal from a reported figure back to its raw source, answered in milliseconds and askable in plain English.',
    alt: 'A knowledge graph of columns and datasets, with a five-hop path lighting up from a reported figure back to its original source.',
  },
}

/** Resolve a manifest key, tolerating a missing entry. */
export const getMotionAsset = key => (key ? motionAssets[key] ?? null : null)
