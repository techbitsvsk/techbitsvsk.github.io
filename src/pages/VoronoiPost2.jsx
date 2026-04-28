import { useState, useEffect } from "react";

const ACCENT  = "#5a9eb5";
const AMBER   = "#c87941";

const prose = {
  fontFamily: "'Lora', Georgia, serif",
  fontSize: "1rem",
  lineHeight: 1.85,
  color: "#c8bfb0",
  marginTop: 0,
  marginBottom: "1.1rem",
};

// ── data ──────────────────────────────────────────────────────────────────────

const clouds = [
  {
    id: "aws", name: "AWS", color: "#c8a050",
    tagline: "S3 as the canonical object store. Deepest Iceberg ecosystem.",
    services: ["S3 · object storage", "Glue Catalog · Iceberg REST Catalog", "Athena · serverless SQL", "EMR · managed Spark", "Lake Formation · access control", "SageMaker Lakehouse · unified analytics + ML"],
    workloads: ["Primary Iceberg table storage", "Heavy Spark batch transforms", "Ad-hoc Athena queries at S3 cost", "ML training via SageMaker Lakehouse (Glue Iceberg REST + fine-grained permissions)", "Cross-region replication source"],
    why: "S3's durability, pricing depth, and ecosystem breadth make it the default Iceberg storage layer. Athena makes ad-hoc SQL zero-cluster-management. EMR handles heavy Spark without Databricks DBU pricing. SageMaker Lakehouse unifies the analytics and ML surface on the same Glue Iceberg REST Catalog — Iceberg tables are queryable by both analytical engines and ML training jobs with one permission model.",
    avoid: "Glue Catalog as the *only* catalog surface. Glue APIs are AWS-native — non-AWS engines can't resolve them without SDK dependencies. Wrap with the Iceberg REST Catalog spec (Polaris) to stay portable.",
    egress: "$0.09 / GB after 1 GB/month. At petabyte scale this is your primary billing lever — and the vendor knows it.",
  },
  {
    id: "azure", name: "Azure", color: ACCENT,
    tagline: "Identity plane + Microsoft ecosystem. ADLS Gen2 + Entra ID + Purview.",
    services: ["ADLS Gen2 · object storage", "Microsoft Fabric / Synapse", "Microsoft Purview · governance", "Entra ID · enterprise identity", "Azure OpenAI · GenAI serving"],
    workloads: ["Identity and access control (Entra is the enterprise IdP)", "Compliance and governance (Purview)", "Power BI / Fabric reporting surface", "Azure OpenAI inference endpoints"],
    why: "Organisations with Microsoft Enterprise Agreements already pay for Azure. Entra ID as the IdP means every Iceberg table access resolves against the same identity graph as Office 365. Fabric Shortcuts read Iceberg on ADLS and S3 — multi-cloud data, Microsoft BI surface, no copy.",
    avoid: "OneLake as the Iceberg write path. Fabric Shortcuts are a read layer. Primary Iceberg writes should go to the domain's native object store — OneLake is the consumption surface, not the source of truth.",
    egress: "$0.087 / GB (first 10 TB). Azure-to-on-prem egress is meaningfully cheaper than AWS for hybrid scenarios — a real differentiator in regulated industries.",
  },
  {
    id: "gcp", name: "GCP", color: "#8aab7a",
    tagline: "AI/ML gravity. BigLake lets BigQuery query open Iceberg without format conversion.",
    services: ["GCS · object storage", "BigQuery · serverless analytics engine", "BigLake · Iceberg on GCS", "Vertex AI · managed ML platform", "Dataflow · streaming (Flink-compatible)"],
    workloads: ["AI/ML training (Vertex AI managed infra)", "Streaming ingestion (Dataflow → Iceberg)", "BigLake ad-hoc queries (BigQuery engine, open format)", "GenAI model serving (Gemini APIs)"],
    why: "BigLake is the key: BigQuery queries Iceberg tables on GCS. Open format, BigQuery's serverless engine, no proprietary internal format. Vertex AI's training infrastructure is the strongest multi-cloud ML option when Azure OpenAI is the serving endpoint — keep training and serving on best-fit clouds.",
    avoid: "BigQuery internal native tables for primary data products. Internal storage is proprietary. Any table that must be queryable by Spark, Trino, or Snowflake should live as Iceberg on GCS via BigLake — not inside BigQuery's managed storage.",
    egress: "$0.08 / GB after 1 TB/month. Committed Use Discounts available at enterprise volume. Negotiable — especially if you demonstrate a live Athena alternative.",
  },
];

const catalogs = [
  {
    name: "Apache Polaris", short: "Polaris", color: ACCENT,
    standard: "Iceberg REST Catalog (Apache spec)",
    open: true, branching: false, multiCloud: true,
    governance: "External — OPA / Apache Ranger",
    summary: "The emerging open standard. Snowflake donated Polaris to Apache. It implements the Iceberg REST Catalog API — the published spec that any engine with a REST client can speak. No proprietary SDK. No vendor registration required. The right default for any platform that must outlive a single vendor relationship.",
    engines: ["Spark", "Trino", "Flink", "Snowflake", "Athena", "Databricks"],
    tradeoff: "Governance is external — you wire in OPA or Ranger for fine-grained access control. That's the right separation of concerns, but it requires the policy layer to be built.",
  },
  {
    name: "Project Nessie", short: "Nessie", color: "#8aab7a",
    standard: "Iceberg REST Catalog + Git-like branching",
    open: true, branching: true, multiCloud: true,
    governance: "External",
    summary: "Git for the catalog. Nessie adds branch / tag / merge semantics to the catalog layer. You can branch a catalog, run a pipeline on the branch, validate results, then merge to main — or discard if validation fails. Blue/green data product releases. CI/CD for data. Zero-risk schema experiments.",
    engines: ["Spark", "Trino", "Flink", "Dremio"],
    tradeoff: "Engine support is narrower than Polaris — Snowflake and Athena don't speak Nessie's branching semantics. In on-prem production, Nessie sits behind a catalog-gateway: JWT validation and OPA 4-layer enforcement at the proxy, Nessie port never host-exposed. Branching-capable engines get it; others see a standard REST catalog. Implementation: github.com/techbitsvsk/catalog_sync",
  },
  {
    name: "Unity Catalog", short: "Unity", color: "#b8847b",
    standard: "Iceberg REST Catalog (Public Preview) + Delta Sharing + Glue Federation",
    open: false, branching: false, multiCloud: true,
    governance: "Built-in (Databricks-native)",
    summary: "The most capable catalog inside the Databricks universe — now with a standard REST endpoint. Column-level access, row filters, attribute-based policies, and audit logs are built in. Iceberg REST Catalog support (Public Preview) opens Unity to any REST-compatible engine: Spark, Trino, Flink, Fivetran, Kafka Connect — without a Databricks license for the catalog call. Delta Sharing remains the governed sharing protocol for cross-platform consumers.",
    engines: ["Spark (any — via REST Catalog)", "Trino", "Flink", "Databricks SQL", "Snowflake (Delta Sharing)", "Fivetran · Kafka Connect (REST)", "Power BI (connector)"],
    tradeoff: "Catalog remains Databricks-hosted — the REST endpoint is the exit valve, not catalog portability. Non-Databricks engines calling the REST Catalog need network access to Databricks and an OAuth2 service principal. DBU charges apply when Databricks compute runs the query, not when external engines read metadata. Consider Polaris if catalog portability independent of the Databricks control plane is a requirement.",
  },
  {
    name: "AWS Glue Catalog", short: "Glue", color: AMBER,
    standard: "Iceberg REST Catalog + Lake Formation + Catalog Federation",
    open: true, branching: false, multiCloud: true,
    governance: "Lake Formation (AWS-native)",
    summary: "Glue now exposes the standard Iceberg REST Catalog API — same open spec as Polaris and OneLake. Any REST-compatible engine (Spark, Trino, Flink, Athena) resolves tables without the AWS SDK. Federation extends its reach beyond AWS: Glue↔Databricks Unity (GA, bidirectional) — Unity shows Glue tables as native objects. Glue↔Snowflake via external catalog integration. Glue→Polaris fronts the whole estate as a vendor-neutral REST surface. SageMaker Lakehouse layers analytics + ML on the same Iceberg REST foundation with unified permissions and table optimizers.",
    engines: ["Spark (EMR · any)", "Athena", "Glue ETL", "Redshift Spectrum", "SageMaker (Lakehouse)", "Databricks (Glue foreign catalog)", "Snowflake (external catalog)"],
    tradeoff: "Native branching is not a Glue feature — use Nessie behind Polaris for branch/tag/merge on data pipelines. Multi-cloud reach is through federation, not native cross-cloud: Glue stays AWS-hosted and Lake Formation stays the permission plane. The strength is the AWS ecosystem depth — SageMaker Lakehouse, EMR, Athena, and Redshift all share one catalog with one governance model.",
  },
];

const engines = [
  { name: "Apache Spark",    read: true,  write: true,  streaming: true,  note: "Reference implementation. Full spec. The write path everything else integrates with."   },
  { name: "Trino / Presto",  read: true,  write: true,  streaming: false, note: "No cluster startup. Best ad-hoc engine. Vectorised reads. Production-grade Iceberg."    },
  { name: "Apache Flink",    read: true,  write: true,  streaming: true,  note: "Streaming inserts + CDC upserts. The Flink Iceberg sink handles row-level deletes."     },
  { name: "DuckDB",          read: true,  write: false, streaming: false, note: "Local analytics. Zero infra. Read-only. Invaluable for local data product validation."   },
  { name: "Snowflake",       read: true,  write: true,  streaming: false, note: "Iceberg Tables GA. External volume on S3/ADLS/GCS. Polaris catalog supported."          },
  { name: "BigQuery",        read: true,  write: false, streaming: false, note: "BigLake. Queries Iceberg on GCS with BigQuery's serverless engine. No write-back."      },
  { name: "Databricks",      read: true,  write: true,  streaming: true,  note: "Native. Delta UniForm exposes Delta tables as Iceberg to non-Databricks engines."       },
  { name: "Fabric / Synapse",read: true,  write: false, streaming: false, note: "Iceberg Shortcuts read ADLS or S3. Power BI and Fabric notebooks consume the table."    },
  { name: "Amazon Athena",   read: true,  write: true,  streaming: false, note: "Native Iceberg support on S3. Optimistic concurrency. Good for governed ad-hoc SQL."    },
  { name: "Apache Hive",     read: true,  write: true,  streaming: false, note: "Iceberg connector available. Primary use: legacy pipeline migration path."               },
];

// platform × platform interoperability matrix
const interopSources = [
  { id: "s3ice",    label: "AWS S3",       sub: "+ Iceberg",       color: "#c8a050" },
  { id: "adlsice",  label: "Azure ADLS",   sub: "+ Iceberg",       color: ACCENT    },
  { id: "gcsice",   label: "GCP GCS",      sub: "+ Iceberg",       color: "#8aab7a" },
  { id: "onprem",   label: "On-Prem",      sub: "HDFS / MinIO",    color: "#9b8ab8" },
  { id: "snow",     label: "Snowflake",    sub: "Horizon governed",    color: "#6ab4d4" },
  { id: "delta",    label: "Databricks",   sub: "Delta + UniForm",    color: "#b8847b" },
  { id: "onelake",  label: "Fabric",       sub: "OneLake · Iceberg REST", color: "#7b9eb8" },
];

const interopConsumers = [
  { id: "spark",    label: "Spark" },
  { id: "trino",    label: "Trino" },
  { id: "flink",    label: "Flink" },
  { id: "duckdb",   label: "DuckDB" },
  { id: "snowflake",label: "Snowflake" },
  { id: "bigquery", label: "BigQuery" },
  { id: "databricks",label:"Databricks" },
  { id: "fabric",   label: "Fabric" },
  { id: "athena",   label: "Athena" },
  { id: "onprk",    label: "On-Prem Spark" },
];

// t: native | bridge | connector | copy | self | none
// native   = Iceberg REST + direct file read, no vendor SDK
// bridge   = Iceberg format but needs cloud credential / extra config
// connector= proprietary protocol, functional but creates dependency
// copy     = ETL copy required, no live interop
// self     = same platform
// none     = not currently supported
const interopCells = {
  s3ice:   { spark:"native",    trino:"native",    flink:"native",    duckdb:"native",    snowflake:"bridge",    bigquery:"bridge",    databricks:"native",    fabric:"bridge",    athena:"native",    onprk:"bridge"    },
  adlsice: { spark:"native",    trino:"native",    flink:"native",    duckdb:"bridge",    snowflake:"bridge",    bigquery:"bridge",    databricks:"native",    fabric:"native",    athena:"connector", onprk:"bridge"    },
  gcsice:  { spark:"native",    trino:"native",    flink:"native",    duckdb:"bridge",    snowflake:"bridge",    bigquery:"native",    databricks:"native",    fabric:"none",      athena:"none",      onprk:"bridge"    },
  onprem:  { spark:"native",    trino:"native",    flink:"native",    duckdb:"bridge",    snowflake:"bridge",    bigquery:"none",      databricks:"bridge",    fabric:"none",      athena:"bridge",    onprk:"native"    },
  snow:    { spark:"connector", trino:"connector", flink:"none",      duckdb:"connector", snowflake:"self",      bigquery:"none",      databricks:"connector", fabric:"connector", athena:"none",      onprk:"connector" },
  delta:   { spark:"native",    trino:"native",    flink:"native",    duckdb:"bridge",    snowflake:"connector", bigquery:"bridge",    databricks:"self",      fabric:"connector", athena:"bridge",    onprk:"native"    },
  onelake: { spark:"bridge",    trino:"bridge",    flink:"bridge",    duckdb:"bridge",    snowflake:"bridge",    bigquery:"none",      databricks:"bridge",    fabric:"self",      athena:"none",      onprk:"bridge"    },
};

const interopMechanisms = {
  s3ice: {
    spark:      { type:"native",    detail: "Polaris REST Catalog resolves table path. Spark reads Parquet via S3A driver. No vendor SDK — pure Iceberg spec.", ref: "https://iceberg.apache.org/docs/latest/spark-configuration/" },
    trino:      { type:"native",    detail: "Trino Iceberg connector + Polaris REST Catalog. Vectorised reads via S3A. Production-grade, no cluster warm-up.", ref: "https://trino.io/docs/current/connector/iceberg.html" },
    flink:      { type:"native",    detail: "Flink Iceberg sink writes; Flink source reads. Full streaming ACID support on S3. Same Polaris REST Catalog.", ref: "https://iceberg.apache.org/docs/latest/flink/" },
    duckdb:     { type:"native",    detail: "DuckDB httpfs or AWS S3 extension reads Iceberg metadata + Parquet files directly. Read-only; zero infrastructure.", ref: "https://duckdb.org/docs/extensions/iceberg.html" },
    snowflake:  { type:"bridge",    detail: "Snowflake External Volume on S3. Iceberg Tables feature (GA). Polaris REST Catalog optional; Snowflake can manage metadata. Needs AWS credential in Snowflake storage integration.", ref: "https://docs.snowflake.com/en/user-guide/tables-iceberg" },
    bigquery:   { type:"bridge",    detail: "BigLake external table with connection to S3. Cross-cloud — BigQuery queries Parquet on S3. Requires GCP–AWS credential link. Preview feature; egress cost applies.", ref: "https://cloud.google.com/bigquery/docs/iceberg-tables" },
    databricks: { type:"native",    detail: "Databricks reads Iceberg natively on S3. Can use Polaris REST Catalog or Databricks-managed Unity Catalog. No format conversion.", ref: "https://www.databricks.com/blog/announcing-full-apache-iceberg-support-databricks" },
    fabric:     { type:"bridge",    detail: "Fabric OneLake Shortcut to S3 Iceberg table. Reads Parquet files via shortcut. Power BI and Fabric notebooks consume without copy. Preview; credential delegation required.", ref: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-shortcuts" },
    athena:     { type:"native",    detail: "Native Iceberg support on S3 (Athena v3). Uses Glue Catalog or Iceberg REST Catalog. Optimistic concurrency for writes. Zero cluster management.", ref: "https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg.html" },
    onprk:      { type:"bridge",    detail: "On-prem Spark reads S3 via S3A driver with AWS credential (IAM role or access key). Polaris REST Catalog reachable over VPN/PrivateLink. Standard Iceberg after credential setup.", ref: "https://iceberg.apache.org/docs/latest/spark-configuration/" },
  },
  adlsice: {
    spark:      { type:"native",    detail: "ABFS driver + Polaris REST Catalog. Entra service principal or managed identity for auth. Same Iceberg spec — storage driver is the only Azure-specific dependency.", ref: "https://iceberg.apache.org/docs/latest/spark-configuration/" },
    trino:      { type:"native",    detail: "Trino Azure connector (ABFS) + Polaris REST. Entra credential in Trino config. Full Iceberg read/write once auth is wired.", ref: "https://trino.io/docs/current/connector/iceberg.html" },
    flink:      { type:"native",    detail: "Flink ADLS Gen2 connector + Iceberg sink. Streaming writes to Iceberg on ADLS. Entra service principal auth.", ref: "https://iceberg.apache.org/docs/latest/flink/" },
    duckdb:     { type:"bridge",    detail: "DuckDB Azure extension (azure_storage_scan). More config than S3 — requires Azure connection string or SAS token. Read-only.", ref: "https://duckdb.org/docs/extensions/azure" },
    snowflake:  { type:"bridge",    detail: "Snowflake External Volume on ADLS Gen2. Iceberg Tables feature. Needs Azure storage integration in Snowflake with Entra credential.", ref: "https://docs.snowflake.com/en/user-guide/tables-iceberg" },
    bigquery:   { type:"bridge",    detail: "BigLake connection to ADLS Gen2 (cross-cloud). Requires GCP–Azure credential bridge. Less mature than GCS BigLake. Egress applies.", ref: "https://cloud.google.com/bigquery/docs/iceberg-tables" },
    databricks: { type:"native",    detail: "Databricks on Azure natively reads ADLS Gen2. Delta and Iceberg both supported. Managed identity or service principal auth built into cluster config.", ref: "https://docs.databricks.com/en/connect/storage/azure-storage.html" },
    fabric:     { type:"native",    detail: "ADLS Gen2 is OneLake's underlying storage plane. Fabric reads Iceberg tables on ADLS without a Shortcut — it is the home location. Full read/write.", ref: "https://learn.microsoft.com/en-us/fabric/onelake/" },
    athena:     { type:"connector", detail: "Athena Federated Query: the official AWS ADLS Gen2 connector deploys as a Lambda function and uses the Azure Synapse JDBC interface with AAD auth. Supports predicate pushdown and passthrough queries. Can be registered as a federated catalog in AWS Glue with Lake Formation governance. Not a native path — Lambda quotas apply, throughput is lower than S3 Athena.", ref: "https://docs.aws.amazon.com/athena/latest/ug/connectors-adls-gen2.html" },
    onprk:      { type:"bridge",    detail: "On-prem Spark with ABFS driver reads ADLS Gen2. Entra service principal + network path (ExpressRoute / VPN) required. Polaris REST Catalog accessible over same network path.", ref: "https://iceberg.apache.org/docs/latest/spark-configuration/" },
  },
  gcsice: {
    spark:      { type:"native",    detail: "GCS connector + Polaris REST Catalog. Service account key or Workload Identity for auth. Standard Iceberg reads after credential config.", ref: "https://iceberg.apache.org/docs/latest/spark-configuration/" },
    trino:      { type:"native",    detail: "Trino GCS connector + Polaris REST. Service account auth. Vectorised Parquet reads. Same Iceberg spec as S3/ADLS.", ref: "https://trino.io/docs/current/connector/iceberg.html" },
    flink:      { type:"native",    detail: "Flink GCS connector + Iceberg sink/source. Dataflow on GCP runs managed Flink jobs writing Iceberg on GCS.", ref: "https://iceberg.apache.org/docs/latest/flink/" },
    duckdb:     { type:"bridge",    detail: "DuckDB GCS extension (experimental). Requires GCS credentials. Functional but less battle-tested than S3 path.", ref: "https://duckdb.org/docs/extensions/iceberg.html" },
    snowflake:  { type:"bridge",    detail: "Snowflake External Volume on GCS. Iceberg Tables feature. GCS storage integration with service account credential.", ref: "https://docs.snowflake.com/en/user-guide/tables-iceberg" },
    bigquery:   { type:"native",    detail: "BigLake — BigQuery's native path for Iceberg on GCS. Full BigQuery engine on open Iceberg format. No proprietary storage, BigQuery compute only.", ref: "https://cloud.google.com/bigquery/docs/iceberg-tables" },
    databricks: { type:"native",    detail: "Databricks on GCP natively reads GCS. Iceberg tables supported. Service account auth. Delta and Iceberg both available.", ref: "https://docs.databricks.com/en/connect/storage/gcs.html" },
    fabric:     { type:"none",      detail: "No native OneLake Shortcut to GCS. Cross-cloud gap — GCS Iceberg data is not directly accessible from Fabric without data movement or an intermediary." },
    athena:     { type:"none",      detail: "Athena is AWS-native and requires S3. Querying GCS from Athena has no supported path — data movement to S3 required." },
    onprk:      { type:"bridge",    detail: "On-prem Spark with GCS connector + service account JSON key. Network path to GCP required (VPN / Dedicated Interconnect). Iceberg reads work after credential and network setup.", ref: "https://iceberg.apache.org/docs/latest/spark-configuration/" },
  },
  onprem: {
    spark:      { type:"native",    detail: "catalog-gateway (Iceberg REST, JWT bearer) → OPA (4 layers: allow/deny, virtual-manifest RLS, column mask advisory, schema exclusion) → Nessie (PostgreSQL-backed, never host-exposed) → MinIO S3A. Cloud-sourced tables need a full metadata URI rewrite — Iceberg embeds absolute paths, so every pointer must resolve to MinIO before on-prem Spark can read them.", ref: "https://github.com/techbitsvsk/catalog_sync" },
    trino:      { type:"native",    detail: "Same catalog-gateway as Spark. L2 RLS is transparent: gateway writes a filtered manifest-list to MinIO and swaps the snapshot URL in the GET response — Trino downloads only permitted partition files with no cooperation required.", ref: "https://github.com/techbitsvsk/catalog_sync" },
    flink:      { type:"native",    detail: "Flink Iceberg sink commits streaming snapshots via catalog-gateway → Nessie. OPA validates write permission (namespace classification + table policy) before the register call forwards. Full streaming ACID on-prem.", ref: "https://iceberg.apache.org/docs/latest/flink/" },
    duckdb:     { type:"bridge",    detail: "DuckDB httpfs reads Parquet from MinIO S3-compatible endpoint. Iceberg metadata resolved via catalog-gateway REST (JWT required). Read-only — no DuckDB write path to Nessie. MinIO must be network-reachable.", ref: "https://duckdb.org/docs/extensions/iceberg.html" },
    snowflake:  { type:"bridge",    detail: "Snowflake External Volume on MinIO S3-compatible API over PrivateLink or VPN. catalog-gateway REST must be reachable from Snowflake's network — Snowflake resolves Iceberg metadata via REST, reads Parquet directly from MinIO.", ref: "https://docs.snowflake.com/en/user-guide/tables-iceberg-storage-integration-s3-compatible" },
    bigquery:   { type:"none",      detail: "No direct path. BigLake requires GCS. On-prem Iceberg must be replicated to GCS with full metadata URI rewrite (MinIO → GCS paths) before BigQuery can query it via BigLake." },
    databricks: { type:"bridge",    detail: "Databricks (cloud) reaches on-prem MinIO over ExpressRoute/DirectConnect. catalog-gateway is registered as the external catalog REST endpoint. BYOC or partner cluster configs support regulated environments.", ref: "https://docs.databricks.com/en/connect/storage/index.html" },
    fabric:     { type:"none",      detail: "No OneLake Shortcut to on-prem MinIO. Data must be replicated to ADLS Gen2 with metadata URI rewrite (MinIO → ADLS paths). Without rewrite, Shortcuts follow unreachable MinIO URIs." },
    athena:     { type:"bridge",    detail: "Athena treats MinIO as S3 via S3-compatible API over VPN/PrivateLink. catalog-gateway REST must be reachable from the Athena VPC. Functional but not AWS first-class — network path and S3-compatible endpoint config required.", ref: "https://docs.aws.amazon.com/athena/latest/ug/querying-with-athena.html" },
    onprk:      { type:"native",    detail: "Native. catalog-gateway + Nessie + MinIO. OAuth2 JWT for auth; OPA 4-layer enforcement (L1 allow/deny, L2 virtual-manifest RLS, L3 column mask advisory, L4 schema exclusion). Nessie never host-exposed — gateway mediates all REST calls.", ref: "https://github.com/techbitsvsk/catalog_sync" },
  },
  snow: {
    spark:      { type:"connector", detail: "Snowflake Spark Connector (proprietary JDBC/Arrow protocol). Functional for reads and writes. Creates a hard dependency on Snowflake SDK JAR versions. Not open spec.", ref: "https://docs.snowflake.com/en/user-guide/spark-connector" },
    trino:      { type:"connector", detail: "Snowflake JDBC connector for Trino. Read-only via standard SQL over JDBC. Proprietary protocol — not Iceberg REST. Performance limited by JDBC throughput.", ref: "https://docs.snowflake.com/en/user-guide/jdbc-configure" },
    flink:      { type:"none",      detail: "No mature native Flink-to-Snowflake streaming connector. Snowpipe Streaming exists for the reverse direction (Flink→Snowflake) but reads from Snowflake in Flink have no standard path." },
    duckdb:     { type:"connector", detail: "DuckDB Snowflake scanner extension (community). Pushes SQL to Snowflake, returns Arrow batches. Convenient for analyst workflows. Proprietary Snowflake protocol.", ref: "https://duckdb.org/docs/extensions/snowflake.html" },
    snowflake:  { type:"self",      detail: "Same platform." },
    bigquery:   { type:"none",      detail: "No native Snowflake→BigQuery live query path. Requires ETL: Snowflake export → GCS → BigQuery load. No live interop." },
    databricks: { type:"connector", detail: "Snowflake Horizon governs the outbound share. Databricks reads via Snowflake JDBC connector or Delta Sharing from Snowflake's side. Horizon Catalog-Linked Databases can also sync Snowflake with external Iceberg REST Catalogs — allowing Horizon governance to extend to Databricks Unity Catalog objects. Connector dependency remains for direct Snowflake→Databricks reads.", ref: "https://docs.snowflake.com/en/user-guide/data-sharing-provider" },
    fabric:     { type:"connector", detail: "Snowflake Horizon connector for Power BI / Fabric. Horizon policies (column masking, row access) apply to shared data before it reaches Fabric. Proprietary ODBC/JDBC protocol for BI surface; functional for reporting. Separate path: OneLake↔Snowflake interoperability (GA) allows Snowflake-managed Iceberg tables to live natively in OneLake — a cleaner architectural path than JDBC.", ref: "https://learn.microsoft.com/en-us/fabric/data-factory/connector-snowflake-overview" },
    athena:     { type:"none",      detail: "Athena cannot query Snowflake internal tables directly. Requires data movement to S3 (Snowflake COPY INTO → S3) before Athena can read." },
    onprk:      { type:"connector", detail: "Snowflake Spark Connector on on-prem Spark cluster. Functional but requires network path to Snowflake and SDK dependency.", ref: "https://docs.snowflake.com/en/user-guide/spark-connector" },
  },
  delta: {
    spark:      { type:"native",    detail: "Two paths: (1) Databricks Iceberg REST Catalog (Public Preview) — Spark catalog config points to the Databricks REST endpoint with an OAuth2 service principal; no UniForm dependency. (2) UniForm — Delta tables expose Iceberg metadata on object storage for direct file reads. REST Catalog is the cleaner path; UniForm remains the fallback for offline or air-gapped access.", ref: "https://www.databricks.com/blog/announcing-full-apache-iceberg-support-databricks" },
    trino:      { type:"native",    detail: "Databricks Iceberg REST Catalog (Public Preview) or UniForm. REST path: Trino catalog config points to Databricks REST endpoint with OAuth2 — no Polaris sidecar needed. UniForm path: Polaris-fronted Iceberg metadata on object storage. REST Catalog is simpler for managed tables.", ref: "https://www.databricks.com/blog/announcing-full-apache-iceberg-support-databricks" },
    flink:      { type:"native",    detail: "Databricks Iceberg REST Catalog (Public Preview): Flink Iceberg connector connects via standard Iceberg REST — no UniForm metadata refresh lag. Managed Iceberg tables on Databricks are directly writable and readable by Flink. Full streaming ACID on open spec.", ref: "https://www.databricks.com/blog/announcing-full-apache-iceberg-support-databricks" },
    duckdb:     { type:"bridge",    detail: "DuckDB reads Iceberg via UniForm-generated metadata. Read-only. Iceberg metadata must be up to date — UniForm syncs on write, not continuously.", ref: "https://duckdb.org/docs/extensions/delta.html" },
    snowflake:  { type:"connector", detail: "Delta Sharing protocol — Databricks exposes a Delta Share, Snowflake consumes via Delta Sharing reader. Open protocol but not Iceberg REST — separate governance integration required.", ref: "https://docs.snowflake.com/en/user-guide/delta-lake-sharing" },
    bigquery:   { type:"bridge",    detail: "UniForm exposes Delta as Iceberg; BigLake can read Iceberg on S3/ADLS/GCS. Cross-cloud credential required. Functional path for analytics use cases.", ref: "https://cloud.google.com/bigquery/docs/iceberg-tables" },
    databricks: { type:"self",      detail: "Same platform. Native Delta and Iceberg read/write." },
    fabric:     { type:"connector", detail: "Delta Sharing connector for Fabric (Shortcut to Delta Share). Open Delta Sharing protocol. Functional for governed sharing — not full Iceberg REST interop.", ref: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-shortcuts" },
    athena:     { type:"bridge",    detail: "Athena reads Delta-as-Iceberg via UniForm metadata on S3. Native Iceberg support in Athena applies to UniForm tables. Polaris REST Catalog or Glue Catalog with Iceberg tables.", ref: "https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg.html" },
    onprk:      { type:"native",    detail: "Databricks Iceberg REST Catalog (Public Preview): on-prem Spark points catalog at the Databricks REST endpoint with an OAuth2 service principal — same REST spec as any other Iceberg catalog. No UniForm dependency, no cloud storage SDK required for metadata resolution. Network path to Databricks control plane required.", ref: "https://www.databricks.com/blog/announcing-full-apache-iceberg-support-databricks" },
  },
  onelake: {
    spark:      { type:"bridge",    detail: "OneLake Iceberg REST Catalog endpoint (https://onelake.table.fabric.microsoft.com/iceberg). Spark connects via the Iceberg REST spec with an Entra bearer token — no raw ABFS SDK required. The REST endpoint abstracts storage; Parquet files read via OneLake storage behind the scenes. Bridge: Entra credential setup required, but open Iceberg protocol end-to-end.", ref: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-open-access" },
    trino:      { type:"bridge",    detail: "Trino Iceberg connector + OneLake Iceberg REST Catalog endpoint. Entra service principal credential in Trino catalog config. REST spec resolves table → metadata path. Vectorised Parquet reads via OneLake. Bridge: Entra credential config required, not zero-config, but no proprietary SDK.", ref: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-open-access" },
    flink:      { type:"bridge",    detail: "Flink Iceberg source + OneLake REST Catalog endpoint (https://onelake.table.fabric.microsoft.com/iceberg). Entra auth token in Flink config. Streaming reads from OneLake Iceberg tables via open Iceberg REST spec. Bridge: credential setup required, otherwise standard Iceberg protocol.", ref: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-open-access" },
    duckdb:     { type:"bridge",    detail: "Confirmed: DuckDB connects to OneLake via the Iceberg REST Catalog endpoint as an Iceberg-compatible client. OneLake Iceberg REST docs explicitly list DuckDB as a supported client. DuckDB resolves table metadata via REST, reads Parquet files. Read-only. Bridge: Entra credential and OneLake workspace URL required.", ref: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-open-access" },
    snowflake:  { type:"bridge",    detail: "GA. Snowflake↔OneLake interoperability is generally available. Snowflake creates a catalog integration pointing to the OneLake Iceberg REST endpoint. Snowflake queries OneLake Iceberg tables directly without ETL or data movement. Bidirectional: Snowflake-managed Iceberg tables can also be stored natively in OneLake. Entra auth via Snowflake storage integration.", ref: "https://docs.snowflake.com/en/user-guide/tables-iceberg-onelake" },
    bigquery:   { type:"none",      detail: "No BigLake connection to OneLake. Microsoft and Google have no native federation path for this direction. ETL to GCS required before BigQuery can query the data." },
    databricks: { type:"bridge",    detail: "Databricks connects to OneLake via the Iceberg REST Catalog endpoint with Entra service principal. Iceberg tables in OneLake are discoverable as external tables from Databricks. Delta Sharing from Fabric to Databricks (open Delta Sharing protocol) is an alternative path. Bridge: Entra credential required, but open spec.", ref: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-open-access" },
    fabric:     { type:"self",      detail: "Same platform. OneLake is Fabric's native storage." },
    athena:     { type:"none",      detail: "Athena is AWS-native and requires S3. No native path to OneLake/ADLS. Data movement to S3 required." },
    onprk:      { type:"bridge",    detail: "On-prem Spark connects to OneLake Iceberg REST endpoint over ExpressRoute / VPN with an Entra service principal credential. Same Iceberg REST spec as cloud Spark — the network path and credential are the only differences. Bridge: network architecture and Entra credential required.", ref: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-open-access" },
  },
};

const interopTypeConfig = {
  native:    { label: "Native · Open",     color: "#8aab7a", bg: "#8aab7a18" },
  bridge:    { label: "Iceberg bridge",    color: ACCENT,    bg: ACCENT + "18" },
  connector: { label: "Vendor connector",  color: AMBER,     bg: AMBER + "18" },
  copy:      { label: "Copy required",     color: "#b8847b", bg: "#b8847b18" },
  self:      { label: "Same platform",     color: "#3a3028", bg: "#111"       },
  none:      { label: "Not supported",     color: "#2a2a2a", bg: "#0a0a0a"    },
};

const lockInVectors = [
  {
    vector: "Data Format", color: AMBER,
    locked: "Proprietary storage: Delta (without UniForm), BigQuery internal tables, Synapse dedicated pools. The data exists — but only one vendor's engine reads it efficiently. Migration means a full ETL rewrite. The vendor knows this and prices accordingly.",
    open: "Apache Iceberg. The spec is published and Apache-governed. The format is Parquet files + JSON metadata on object storage. Any engine implementing the reader spec reads any Iceberg table — without asking the vendor's permission, without using the vendor's SDK, without a connector fee.",
    leverage: "When every engine reads your data, compute becomes a commodity market. You choose engine per workload on cost and capability — not on what the format will permit.",
  },
  {
    vector: "Catalog", color: ACCENT,
    locked: "Vendor catalog as the only discovery surface: Glue (AWS SDK required), Unity Catalog (Databricks metastore required), Synapse catalog (Azure-native). Adding a non-native engine requires a connector workaround or bypassing the catalog entirely — breaking governance in the process.",
    open: "Iceberg REST Catalog API. Apache-published specification. Apache Polaris implements it. Any engine with a REST catalog client — Spark, Trino, Flink, Snowflake, Athena — resolves tables via the same API call. No vendor SDK. No cloud credential delegation to a third-party metadata service.",
    leverage: "One catalog endpoint, every engine. When you add a new compute engine, you configure the REST catalog URL. The data is already registered. No migration, no re-registration, no renegotiation with the catalog vendor.",
  },
  {
    vector: "Compute", color: "#8aab7a",
    locked: "Compute bundled with storage costs: Databricks DBU pricing applies to every read of a Delta table in Unity. BigQuery slot pricing applies to every query of an internal table. The platform charges per query regardless of which engine you'd prefer — because switching engine means switching format.",
    open: "Storage-compute separation. Iceberg tables live in object storage billed at $0.02–0.025/GB/month. Compute is chosen per workload: Spark for heavy ETL, Trino for ad-hoc SQL, DuckDB for local validation, Snowflake for governed external sharing. Pay compute only when you use it, at the rate the engine charges.",
    leverage: "Run identical TPC-DS queries on Athena, Trino, and BigQuery against the same Iceberg table. Take the benchmark into the cloud renewal meeting. Real cost-per-query numbers — not vendor estimates — change the negotiation.",
  },
  {
    vector: "Egress", color: "#9b8ab8",
    locked: "Cloud egress pricing is the primary billing weapon vendors hold. Moving data out of AWS costs $0.09/GB. At petabyte scale, cross-cloud analytics become prohibitively expensive — effectively locking compute into the cloud where the data lives, regardless of which engine you'd prefer.",
    open: "Multi-cloud object storage replication for hot data products. S3-compatible APIs (Cloudflare R2 — zero egress fees, MinIO — self-hosted) as egress-free read endpoints. Iceberg's metadata layer means replication is data files + metadata files — the same table, readable in any region from any engine.",
    leverage: "Cloudflare R2 has zero egress fees and an S3-compatible API. Iceberg tables on R2 are readable by Spark, Trino, and DuckDB without modification. The credible threat of moving egress-heavy reads to R2 is a genuine lever in cloud renewal conversations — vendors have confirmed discounts in response to it.",
  },
];

const billingSteps = [
  {
    id: 1, label: "Benchmark First",
    actor: "Platform Engineering",
    detail: "Before any renewal negotiation, run identical TPC-DS queries across clouds against the same Iceberg table. Athena on AWS, BigLake on GCP, Synapse on Azure. Record: query latency, cost per TB scanned, egress if cross-region. These are real numbers — not vendor-supplied estimates. The benchmark is only honest when the format is open.",
    note: "This is why Iceberg is infrastructure, not a technology preference. Without a portable format you cannot benchmark honestly. The vendor who knows you cannot move will not offer you a better price.",
    artifact: "Benchmark report — latency × cost × egress across all three clouds",
  },
  {
    id: 2, label: "Quantify Egress Exposure",
    actor: "FinOps",
    detail: "Pull 90 days of billing. Segment egress into: intra-region, inter-region same cloud, cross-cloud, internet. For most data-heavy platforms, egress is 15–30% of total cloud spend. This number is your opening position — it represents spend you can credibly move to R2 or a secondary cloud.",
    note: "Cloud vendors will discount compute and storage aggressively in renewals. They almost never voluntarily discount egress. You must ask explicitly, and you must have the numbers.",
    artifact: "Egress spend breakdown — 90-day actuals by traffic class",
  },
  {
    id: 3, label: "Demonstrate Portability Live",
    actor: "Platform Engineering",
    detail: "Before the renewal meeting, run a live proof: a non-primary engine querying primary data. Trino cluster on GCP querying S3 Iceberg tables. BigQuery querying Iceberg on ADLS via BigLake. The technical demonstration that you *can* move matters more than a statement that you *might*. Vendors who believe you can move offer measurably better terms.",
    note: "This is the difference between negotiating leverage and negotiating bluster. Iceberg + Polaris REST Catalog makes portability operationally real — the proof takes one afternoon to set up.",
    artifact: "Live demo recording — cross-cloud Iceberg query with cost evidence",
  },
  {
    id: 4, label: "Negotiate Committed Use",
    actor: "CTO / FinOps",
    detail: "AWS Savings Plans: 1–3 year compute commitments at 30–60% below on-demand. GCP Committed Use Discounts: resource-based (VM types) or spend-based (flexible). Azure Reserved VM Instances: similar tiers. The critical rule: commit on compute resources, never on data format. A compute commitment can be honoured with different engines. A format commitment cannot be exited without a rewrite.",
    note: "Negotiate egress discounts as a condition of compute commitments. Large-spend customers can negotiate custom egress pricing — but only if they have the numbers and the demonstrated portability.",
    artifact: "Committed use schedule — compute tier × term × egress discount locked in writing",
  },
  {
    id: 5, label: "Maintain a Live Multi-Cloud Baseline",
    actor: "Platform Engineering",
    detail: "Keep at least one production workload running on a secondary cloud continuously — not as an experiment but as operational baseline. A data product that runs on both AWS and GCP means the decision to shift load is operational, not a migration project. Vendors distinguish between a customer who could move and one who is running elsewhere. Only the latter has full leverage.",
    note: "The security of multi-cloud comes not from moving — from being able to move without disruption. Iceberg makes that operationally real. The catalog REST endpoint, the format, the object storage path — all portable without application changes.",
    artifact: "Multi-cloud baseline runbook — secondary cloud workload, monitoring, failover SLA",
  },
];

const policyLayers = [
  {
    id: "opa",
    name: "Open Policy Agent",
    short: "OPA",
    color: "#8aab7a",
    plane: "Infrastructure",
    deployment: "On-premises sidecar · Kubernetes DaemonSet · API gateway plugin",
    tagline: "Policy-as-code for infrastructure. Governs the path to the data, not the data itself.",
    what: "OPA evaluates structured policies written in Rego against any JSON input — API request headers, Kubernetes admission requests, Terraform plans, CI/CD pipeline manifests. It returns allow/deny plus structured context. No data values ever pass through OPA. It governs who may reach the Iceberg REST Catalog endpoint and under what conditions.",
    decisions: [
      "Can this service principal call the Polaris REST Catalog to register a new table?",
      "Does this Terraform plan provision an Iceberg namespace in a permitted cloud region?",
      "Is this Spark job permitted to write to a Confidential-classified Iceberg namespace?",
      "Does this CI/CD pipeline run against a branch that has passed policy validation gates?",
    ],
    onprem: "OPA sidecar to the catalog-gateway (Iceberg REST proxy). Each catalog call triggers POST /v1/data/iceberg/policy — one round-trip returns all 4 decisions: L1 allow/deny, L2 row filter for virtual manifest-list RLS, L3 column mask definitions, L4 excluded columns for schema strip. Same Rego bundle as cloud — no cloud round-trip for on-prem enforcement. github.com/techbitsvsk/catalog_sync",
    integration: "catalog-gateway (Iceberg REST proxy, FastAPI), Kubernetes admission webhook, Terraform sentinel, Apache Ranger (OPA as external authz plugin), Kong / Nginx API gateways, Nessie (PostgreSQL-backed Iceberg catalog)",
  },
  {
    id: "immuta",
    name: "Immuta",
    short: "Immuta",
    color: ACCENT,
    plane: "Data Access",
    deployment: "SaaS control plane · on-prem enforcement agents",
    tagline: "Attribute-based access control at the query layer. Column masking, row filtering, purpose-based access — enforced at engine time.",
    what: "Immuta sits between the query engine and the data. It intercepts SQL at the engine integration layer — Snowflake, Databricks, Trino, Spark, BigQuery — and rewrites queries to enforce access policies before execution. Column masking replaces PII values with hashed or nulled equivalents. Row-level security filters to permitted partitions. Purpose-based access limits which downstream use cases can read Confidential data. No manual view creation. No per-dataset policy wiring.",
    decisions: [
      "Should this user's query see SSN values in plain text, partially masked, or hashed?",
      "Is this query executing under a permitted data purpose (risk reporting vs. marketing analytics)?",
      "Does this ML training job have a signed data use agreement for Confidential-tier Iceberg tables?",
      "Is this cross-LOB Iceberg table access permitted given the user's attribute set (role, team, geo, clearance)?",
    ],
    onprem: "Immuta enforcement agents deploy on-premises as lightweight engine plugins — the Spark integration runs as a Spark extension, the Trino integration as a plugin JAR. The Immuta control plane (SaaS or private cloud) holds the policy definitions. Enforcement is local — the agent makes a decision call to the control plane over a secured channel, executes the rewrite, and the data never leaves the on-prem environment. Policy definition is central; enforcement is distributed.",
    integration: "Snowflake, Databricks (Unity Catalog bridge), Trino, Apache Spark, BigQuery, Amazon Athena, Azure Synapse, Starburst",
  },
];

const policyPattern = [
  { layer: "Identity resolution", tool: "Entra ID / Okta", color: "#9b8ab8", desc: "Who is this caller? Identity is resolved first — group memberships, role assignments, geo, clearance level. Every downstream policy decision is predicated on a verified identity token." },
  { layer: "Infrastructure gate", tool: "OPA (on-prem + cloud)", color: "#8aab7a", desc: "May this identity reach the Iceberg REST Catalog at all? OPA evaluates: caller identity, requested namespace, classification tier, cloud region, CI/CD context. Returns allow/deny + policy context. Deployed on-prem as a sidecar — no cloud API latency for on-prem workloads." },
  { layer: "Catalog resolution", tool: "Apache Polaris (REST)", color: ACCENT, desc: "What is the current metadata location for this Iceberg table? Polaris resolves the table name to an S3 / ADLS / GCS path. OPA has already confirmed the caller may reach this namespace — Polaris serves the path." },
  { layer: "Data access control", tool: "Immuta", color: "#5a9eb5", desc: "What may the caller see within this table? Immuta intercepts the query at the engine layer and rewrites it — column masks applied, row filters injected, purpose-based access validated. The engine executes the rewritten query against Iceberg Parquet files. No data the caller is not permitted to see is returned." },
  { layer: "Audit emission", tool: "OpenLineage → Neo4j", color: "#c8a87a", desc: "Every access decision — allow and deny — emits an OpenLineage event. The event carries: identity, table accessed, policy version that governed the decision, purpose. Neo4j persists the access lineage graph. The auditor queries it in Cypher." },
];

const forceImpacts = [
  {
    force: "Physical Sovereignty", color: AMBER,
    before: "Domain stores data in the vendor's proprietary format. The domain owns the data in name — but the vendor's engine is required to read it. True sovereignty is limited by the format dependency.",
    after: "Domain owns Iceberg files in its cloud-native object store. No engine required to read the data — any Iceberg-compatible tool works. The domain can switch compute without migrating storage. Sovereignty is structural, not nominal.",
  },
  {
    force: "Marketplace", color: "#8aab7a",
    before: "Data products discoverable only within the vendor's catalog UI. A Databricks data product is visible in Unity; invisible to a Snowflake consumer unless a Delta Share is configured per-product, per-consumer.",
    after: "Data products registered in a Polaris REST Catalog endpoint. Any engine, any cloud, any consumer with catalog access discovers and queries the product directly. The marketplace is the catalog — not the vendor's UI.",
  },
  {
    force: "Governance", color: "#9b8ab8",
    before: "Governance policies live in vendor-native constructs: Lake Formation ACLs, Unity column masks, Purview sensitivity labels. Each is authoritative within its cloud. Cross-cloud governance requires manual reconciliation.",
    after: "OPA policies applied at the Iceberg REST Catalog layer. The same policy file governs table access regardless of which engine queries it or which cloud it runs on. Governance is a property of the catalog endpoint — not of the compute plane.",
  },
  {
    force: "Security", color: "#b8847b",
    before: "IAM policies scoped to cloud-native resources. An S3 bucket policy does not protect the same data when accessed via ADLS Shortcuts or BigLake. Each access path requires independent policy configuration.",
    after: "Iceberg REST Catalog requires authentication on every catalog operation. Data files are encrypted at rest in the object store. Access to the catalog endpoint — and therefore to the table metadata — is the single security boundary, independent of which engine or cloud makes the request.",
  },
];

const federationLinks = [
  {
    from: "AWS Glue Catalog",     fromColor: AMBER,
    to:   "Databricks Unity Catalog", toColor: "#b8847b",
    protocol: "Foreign Catalog (GA · bidirectional)",
    direction: "bidirectional",
    maturity: "GA",
    detail: "Unity Catalog federation connectors are GA. Databricks mounts an entire AWS Glue database as a foreign catalog — Glue-registered tables (Parquet, Delta, Iceberg) appear as Unity-native objects without ETL. Reverse: AWS Glue can access Databricks Unity Catalog data via the Iceberg REST endpoint using an OAuth2 Databricks service principal, governed by Lake Formation. Supports phased Unity Catalog adoption — no big-bang migration required.",
  },
  {
    from: "Microsoft Fabric OneLake", fromColor: "#7b9eb8",
    to:   "Spark · Trino · Flink · DuckDB · Snowflake", toColor: ACCENT,
    protocol: "Iceberg REST Catalog endpoint (GA → expanding)",
    direction: "outbound",
    maturity: "GA",
    detail: "OneLake exposes a standard Iceberg REST Catalog endpoint at https://onelake.table.fabric.microsoft.com/iceberg. Any Iceberg REST-compatible engine (Spark, Trino, Flink, DuckDB, PyIceberg, Snowflake) connects with an Entra bearer token — no raw ABFS SDK required. Snowflake↔OneLake interoperability is GA: Snowflake-managed Iceberg tables can be stored natively in OneLake, and Fabric data is automatically converted to Iceberg format for direct Snowflake access.",
  },
  {
    from: "Snowflake Horizon Catalog", fromColor: "#6ab4d4",
    to:   "Polaris · Glue · any Iceberg REST Catalog", toColor: "#8aab7a",
    protocol: "Catalog-Linked Databases (GA soon)",
    direction: "bidirectional",
    maturity: "Preview → GA",
    detail: "Snowflake Horizon Catalog-Linked Databases automatically sync with any Iceberg REST Catalog — Apache Polaris, Snowflake Open Catalog (managed Polaris), and AWS Glue. Horizon applies column masking, row access policies, and audit to external Iceberg objects synced from these catalogs, without moving the data. A single governance model spans Snowflake-native tables and open Iceberg tables managed by other catalogs.",
  },
  {
    from: "Databricks Unity Catalog", fromColor: "#b8847b",
    to:   "Spark · Trino · Flink · Fivetran · Kafka Connect", toColor: ACCENT,
    protocol: "Iceberg REST Catalog API (Public Preview)",
    direction: "outbound",
    maturity: "Public Preview",
    detail: "Databricks now exposes the standard Apache Iceberg REST Catalog API from Unity Catalog. Any REST-compatible engine — Spark, Trino, Flink, Fivetran, Kafka Connect, Redpanda — connects with an OAuth2 Databricks service principal. No Databricks SDK, no UniForm dependency for metadata resolution. Managed Iceberg tables get full read/write; Foreign tables (Glue, Snowflake Horizon, Hive) are read-accessible via Lakehouse Federation. Predictive Optimization handles snapshot expiration, file cleanup, and Liquid Clustering automatically.",
  },
  {
    from: "Databricks Delta Lake",    fromColor: "#b8847b",
    to:   "Snowflake · Fabric · any Delta Sharing client", toColor: "#9b8ab8",
    protocol: "Delta Sharing (Linux Foundation open protocol)",
    direction: "outbound",
    maturity: "GA",
    detail: "Delta Sharing is an open Linux Foundation protocol. Databricks publishes a share; any client with a Delta Sharing reader (Spark, pandas, Power BI, Trino, Snowflake, Fabric) consumes it without a Databricks license. Unity Catalog governs the share definition — consumers see only permitted tables and partitions. UniForm (Universal Format) additionally exposes Delta tables as Iceberg to Iceberg REST clients, without a separate share definition.",
  },
  {
    from: "Apache Polaris",           fromColor: ACCENT,
    to:   "All — universal federation hub", toColor: "#8aab7a",
    protocol: "Iceberg REST Catalog API (Apache spec)",
    direction: "bidirectional",
    maturity: "GA (Apache incubating)",
    detail: "Polaris is the universal adapter: it speaks Iceberg REST to all engines and can federate over Glue, Hive Metastore, and external object stores. A Polaris deployment in the center of the platform bridges domain-specific catalogs (Glue, Unity, OneLake) into a single REST endpoint. Snowflake Horizon Catalog-Linked Databases connect to Polaris as one of their federation sources. Every engine resolves the same namespace regardless of which domain catalog owns the underlying table.",
  },
];

// ── components ────────────────────────────────────────────────────────────────

function CloudMap({ clouds }) {
  const [active, setActive] = useState(null);
  const c = active !== null ? clouds[active] : null;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#1a1a1a", border: "1px solid #1e1e1e" }}>
        {clouds.map((cloud, i) => (
          <button key={cloud.id} onClick={() => setActive(active === i ? null : i)} style={{
            background: active === i ? cloud.color + "18" : "#0d0d0d",
            border: "none",
            borderBottom: `2px solid ${active === i ? cloud.color : "transparent"}`,
            padding: "1.5rem 1rem",
            cursor: "pointer",
            transition: "background 0.2s",
          }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.4rem", fontWeight: 900, color: active === i ? cloud.color : "#3a3028", marginBottom: 6, transition: "color 0.2s" }}>
              {cloud.name}
            </div>
            <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.75rem", fontStyle: "italic", color: active === i ? "#8a7a65" : "#2e2620", lineHeight: 1.4 }}>
              {cloud.tagline}
            </div>
          </button>
        ))}
      </div>

      {c ? (
        <div style={{ background: "#0d0d0d", border: `1px solid ${c.color}33`, borderLeft: `3px solid ${c.color}`, padding: "1.5rem", borderTop: "none" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.25rem" }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Services used</div>
              {c.services.map((s, i) => (
                <div key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: c.color, marginBottom: 5, paddingLeft: 10, borderLeft: `1px solid ${c.color}44` }}>{s}</div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Workloads placed here</div>
              {c.workloads.map((w, i) => (
                <div key={i} style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.8rem", color: "#8a7a65", marginBottom: 6, lineHeight: 1.5 }}>— {w}</div>
              ))}
            </div>
          </div>
          <div style={{ background: "#111", borderLeft: `2px solid ${c.color}55`, padding: "10px 14px", marginBottom: "0.75rem" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>Why this cloud</div>
            <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.87rem", color: "#8a7a65", lineHeight: 1.72 }}>{c.why}</p>
          </div>
          <div style={{ background: "#0f0f0f", borderLeft: "2px solid #c87941", padding: "10px 14px", marginBottom: "0.75rem" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "#c87941", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>What to avoid</div>
            <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.87rem", color: "#6a5a4a", lineHeight: 1.72 }}>{c.avoid}</p>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#4a4035" }}>
            egress — <span style={{ color: "#5a4a3a" }}>{c.egress}</span>
          </div>
        </div>
      ) : (
        <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderTop: "none", padding: "0.9rem", textAlign: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#2e2620" }}>click a cloud to see workload placement rationale</span>
        </div>
      )}
    </div>
  );
}

function CatalogCompare({ catalogs }) {
  const [active, setActive] = useState(0);
  const c = catalogs[active];

  return (
    <div>
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid #1e1e1e" }}>
        {catalogs.map((cat, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            background: "transparent", border: "none",
            borderBottom: active === i ? `2px solid ${cat.color}` : "2px solid transparent",
            color: active === i ? cat.color : "#4a4035",
            padding: "9px 16px", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
            letterSpacing: "0.07em", whiteSpace: "nowrap", transition: "all 0.2s",
          }}>
            {cat.short}
          </button>
        ))}
      </div>
      <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderTop: "none", padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: "1rem" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontWeight: 700, color: c.color, marginBottom: 4 }}>{c.name}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4a4035" }}>{c.standard}</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { label: "Open spec",    val: c.open },
              { label: "Branching",   val: c.branching },
              { label: "Multi-cloud", val: c.multiCloud },
            ].map(({ label, val }) => (
              <span key={label} style={{ background: val ? "#0d1f0d" : "#1a0d0d", border: `1px solid ${val ? "#8aab7a44" : "#b8847b44"}`, color: val ? "#8aab7a" : "#b8847b", padding: "3px 9px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem" }}>
                {val ? "✓" : "✗"} {label}
              </span>
            ))}
          </div>
        </div>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.9rem", color: "#8a7a65", lineHeight: 1.78, marginBottom: "1rem" }}>{c.summary}</p>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Engine support</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {c.engines.map(e => (
                <span key={e} style={{ background: "#111", border: `1px solid ${c.color}33`, color: c.color, padding: "2px 8px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>{e}</span>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Governance</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#6a5a4a" }}>{c.governance}</div>
          </div>
        </div>
        <div style={{ background: "#111", borderLeft: "2px solid #c87941", padding: "8px 14px" }}>
          <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.82rem", fontStyle: "italic", color: "#6a5a4a", lineHeight: 1.65 }}>{c.tradeoff}</p>
        </div>
      </div>
    </div>
  );
}

function InteropMatrix({ sources, consumers, cells, mechanisms, typeConfig }) {
  const [selected, setSelected] = useState(null);

  const detail = selected
    ? mechanisms[selected.src]?.[selected.con]
    : null;

  const handleClick = (srcId, conId) => {
    const t = cells[srcId]?.[conId];
    if (!t || t === "self" || t === "none") { setSelected(null); return; }
    setSelected(selected?.src === srcId && selected?.con === conId ? null : { src: srcId, con: conId });
  };

  const colW = 72;

  return (
    <div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "0.75rem" }}>
        {Object.entries(typeConfig).filter(([k]) => k !== "self").map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, background: v.color, opacity: 0.7 }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#4a4035" }}>{v.label}</span>
          </div>
        ))}
      </div>

      {/* Scrollable matrix */}
      <div style={{ overflowX: "auto", border: "1px solid #1e1e1e" }}>
        <div style={{ minWidth: consumers.length * colW + 160 }}>
          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: `160px repeat(${consumers.length}, ${colW}px)`, background: "#111", borderBottom: "1px solid #1e1e1e" }}>
            <div style={{ padding: "0.6rem 0.75rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#3a3028", letterSpacing: "0.08em" }}>SOURCE ↓  CONSUMER →</div>
            {consumers.map(c => (
              <div key={c.id} style={{ padding: "0.5rem 0.25rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "#4a4035", textAlign: "center", lineHeight: 1.3, borderLeft: "1px solid #1a1a1a" }}>
                {c.label}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {sources.map((src, ri) => (
            <div key={src.id} style={{ display: "grid", gridTemplateColumns: `160px repeat(${consumers.length}, ${colW}px)`, borderBottom: ri < sources.length - 1 ? "1px solid #141414" : "none" }}>
              {/* Row label */}
              <div style={{ padding: "0.65rem 0.75rem", background: "#0d0d0d", borderRight: "1px solid #1a1a1a" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: src.color, marginBottom: 2 }}>{src.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "#3a3028" }}>{src.sub}</div>
              </div>

              {/* Cells */}
              {consumers.map(con => {
                const t = cells[src.id]?.[con.id] || "none";
                const cfg = typeConfig[t];
                const isActive = selected?.src === src.id && selected?.con === con.id;
                const clickable = t !== "self" && t !== "none";
                return (
                  <div key={con.id}
                    onClick={() => handleClick(src.id, con.id)}
                    style={{
                      background: isActive ? cfg.color + "30" : t === "self" ? "#0d0d0d" : t === "none" ? "#080808" : cfg.bg,
                      borderLeft: "1px solid #141414",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: clickable ? "pointer" : "default",
                      minHeight: 40,
                      transition: "background 0.15s",
                    }}
                    title={clickable ? `${src.label} → ${con.label}: click for details` : undefined}
                  >
                    {t === "self"
                      ? <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#8aab7a" }}>✓</span>
                      : t === "none"
                      ? <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#1a1a1a" }}>✕</span>
                      : <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, opacity: isActive ? 1 : 0.75 }} />
                    }
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {detail && selected ? (
        <div style={{ marginTop: 1, background: "#0d0d0d", border: `1px solid ${typeConfig[detail.type].color}44`, borderLeft: `3px solid ${typeConfig[detail.type].color}`, padding: "1.1rem 1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: typeConfig[detail.type].color }}>
              {interopSources.find(s => s.id === selected.src)?.label} + {interopSources.find(s => s.id === selected.src)?.sub}
              {" → "}
              {interopConsumers.find(c => c.id === selected.con)?.label}
            </div>
            <span style={{ background: typeConfig[detail.type].bg, border: `1px solid ${typeConfig[detail.type].color}44`, color: typeConfig[detail.type].color, padding: "2px 8px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem" }}>
              {typeConfig[detail.type].label}
            </span>
          </div>
          <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.88rem", color: "#8a7a65", lineHeight: 1.75 }}>{detail.detail}</p>
          {detail.ref && (
            <a href={detail.ref} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "0.6rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: typeConfig[detail.type].color, opacity: 0.75, textDecoration: "none", borderBottom: `1px solid ${typeConfig[detail.type].color}44` }}>
              ↗ official docs
            </a>
          )}
        </div>
      ) : (
        <div style={{ marginTop: 1, background: "#080808", border: "1px solid #141414", padding: "0.7rem", textAlign: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#1e1e1e" }}>click any coloured cell for mechanism detail</span>
        </div>
      )}
    </div>
  );
}

function EngineMatrix({ engines }) {
  const col = { fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#4a4035" };
  const cell = { background: "#0d0d0d", borderBottom: "1px solid #141414", padding: "0.75rem 1rem", display: "flex", alignItems: "center" };

  return (
    <div style={{ border: "1px solid #1e1e1e", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "140px 60px 60px 80px 1fr", background: "#111", borderBottom: "1px solid #1e1e1e", padding: "0.6rem 1rem", gap: "0.5rem", alignItems: "center", minWidth: 520 }}>
        <div style={col}>Engine</div>
        <div style={{ ...col, textAlign: "center" }}>Read</div>
        <div style={{ ...col, textAlign: "center" }}>Write</div>
        <div style={{ ...col, textAlign: "center" }}>Streaming</div>
        <div style={col}>Note</div>
      </div>
      {engines.map((e, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 60px 60px 80px 1fr", gap: "0.5rem", alignItems: "center", background: i % 2 === 0 ? "#0d0d0d" : "#0a0a0a", borderBottom: "1px solid #141414", padding: "0.6rem 1rem", minWidth: 520 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: ACCENT }}>{e.name}</div>
          <div style={{ textAlign: "center", fontSize: "0.75rem", color: e.read ? "#8aab7a" : "#4a4035" }}>{e.read ? "✓" : "—"}</div>
          <div style={{ textAlign: "center", fontSize: "0.75rem", color: e.write ? "#8aab7a" : "#4a4035" }}>{e.write ? "✓" : "—"}</div>
          <div style={{ textAlign: "center", fontSize: "0.75rem", color: e.streaming ? "#8aab7a" : "#4a4035" }}>{e.streaming ? "✓" : "—"}</div>
          <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.78rem", color: "#6a5a4a", lineHeight: 1.5 }}>{e.note}</div>
        </div>
      ))}
    </div>
  );
}

function LockInAccordion({ vectors }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ border: "1px solid #1e1e1e" }}>
      {vectors.map((v, i) => (
        <div key={i} style={{ borderBottom: i < vectors.length - 1 ? "1px solid #1a1a1a" : "none", borderLeft: `3px solid ${v.color}` }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{
            width: "100%", background: "transparent", border: "none",
            padding: "1.1rem 1.5rem", cursor: "pointer", textAlign: "left",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
          }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "0.95rem", fontWeight: 700, color: open === i ? v.color : "#e8d5b0" }}>{v.vector} Lock-in</div>
            <span style={{ color: v.color, fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div style={{ padding: "0 1.5rem 1.5rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#c87941", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Locked state</div>
                <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.88rem", color: "#6a5a4a", lineHeight: 1.75 }}>{v.locked}</p>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#8aab7a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Open alternative</div>
                <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.88rem", color: "#8a7a65", lineHeight: 1.75 }}>{v.open}</p>
              </div>
              <div style={{ background: "#111", borderLeft: `2px solid ${v.color}`, padding: "8px 14px" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: v.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Negotiating leverage</div>
                <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.82rem", fontStyle: "italic", color: "#6a5a4a", lineHeight: 1.65 }}>{v.leverage}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function BillingFlow({ steps }) {
  const [active, setActive] = useState(0);
  const s = steps[active];
  return (
    <div>
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid #1e1e1e" }}>
        {steps.map((step, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            background: "transparent", border: "none",
            borderBottom: active === i ? `2px solid ${ACCENT}` : "2px solid transparent",
            color: active === i ? ACCENT : "#4a4035",
            padding: "9px 14px", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem",
            letterSpacing: "0.05em", whiteSpace: "nowrap", transition: "all 0.2s",
          }}>
            {step.id}. {step.label}
          </button>
        ))}
      </div>
      <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderTop: "none", padding: "1.5rem" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4a4035", marginBottom: 4 }}>Actor</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", color: "#e8d5b0", marginBottom: "1rem" }}>{s.actor}</div>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.92rem", color: "#8a7a65", lineHeight: 1.78, marginBottom: "1rem" }}>{s.detail}</p>
        <div style={{ background: "#111", borderLeft: `2px solid ${ACCENT}`, padding: "8px 14px", marginBottom: "1rem" }}>
          <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.82rem", fontStyle: "italic", color: "#6a5a4a", lineHeight: 1.65 }}>{s.note}</p>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#3a3028" }}>
          artifact — <span style={{ color: "#5a4a3a" }}>{s.artifact}</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <button onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0} style={{ background: "transparent", border: "1px solid #2a2a2a", color: active === 0 ? "#2a2a2a" : "#4a4035", padding: "6px 14px", cursor: active === 0 ? "default" : "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>← prev</button>
        <span style={{ color: "#2a2a2a", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", alignSelf: "center" }}>{active + 1} / {steps.length}</span>
        <button onClick={() => setActive(Math.min(steps.length - 1, active + 1))} disabled={active === steps.length - 1} style={{ background: "transparent", border: "1px solid #2a2a2a", color: active === steps.length - 1 ? "#2a2a2a" : "#4a4035", padding: "6px 14px", cursor: active === steps.length - 1 ? "default" : "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>next →</button>
      </div>
    </div>
  );
}

function PolicyEnforcementPanel({ layers }) {
  const [active, setActive] = useState(0);
  const c = layers[active];

  return (
    <div>
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid #1e1e1e" }}>
        {layers.map((layer, i) => (
          <button key={layer.id} onClick={() => setActive(i)} style={{
            background: "transparent", border: "none",
            borderBottom: active === i ? `2px solid ${layer.color}` : "2px solid transparent",
            color: active === i ? layer.color : "#4a4035",
            padding: "9px 16px", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
            letterSpacing: "0.07em", whiteSpace: "nowrap", transition: "all 0.2s",
          }}>
            {layer.short}
          </button>
        ))}
      </div>
      <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderTop: "none", padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: "1rem" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontWeight: 700, color: c.color, marginBottom: 4 }}>{c.name}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4a4035" }}>{c.plane} plane · {c.deployment}</div>
          </div>
        </div>
        <div style={{ borderLeft: `2px solid ${c.color}55`, paddingLeft: "1rem", marginBottom: "1.25rem" }}>
          <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.87rem", fontStyle: "italic", color: "#6a5a4a", lineHeight: 1.7 }}>{c.tagline}</p>
        </div>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.9rem", color: "#8a7a65", lineHeight: 1.78, marginBottom: "1.25rem" }}>{c.what}</p>
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Decisions it makes</div>
          {c.decisions.map((d, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 7 }}>
              <span style={{ color: c.color, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", paddingTop: 3, flexShrink: 0 }}>→</span>
              <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.85rem", color: "#8a7a65", lineHeight: 1.65 }}>{d}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#111", borderLeft: `2px solid ${c.color}`, padding: "10px 14px", marginBottom: "0.75rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: c.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>On-premises deployment</div>
          <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.87rem", color: "#6a5a4a", lineHeight: 1.72 }}>{c.onprem}</p>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#3a3028" }}>
          integrations — <span style={{ color: "#5a4a3a" }}>{c.integration}</span>
        </div>
      </div>
    </div>
  );
}

function PolicyStack({ steps }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ border: "1px solid #1e1e1e" }}>
      {steps.map((step, i) => (
        <div key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: "flex", gap: "1rem", alignItems: "flex-start",
            padding: "1rem 1.25rem",
            borderBottom: i < steps.length - 1 ? "1px solid #141414" : "none",
            borderLeft: `3px solid ${hovered === i ? step.color : step.color + "44"}`,
            background: hovered === i ? step.color + "08" : "#0d0d0d",
            transition: "all 0.2s",
          }}>
          <div style={{ minWidth: 20, paddingTop: 2, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: step.color }}>{i + 1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: step.color }}>{step.layer}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#3a3028", border: `1px solid ${step.color}33`, padding: "1px 7px" }}>{step.tool}</div>
            </div>
            <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.85rem", color: "#8a7a65", lineHeight: 1.7 }}>{step.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ForceImpactGrid({ impacts }) {
  const [active, setActive] = useState(null);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, background: "#1a1a1a", border: "1px solid #1e1e1e" }}>
        {impacts.map((imp, i) => (
          <button key={i} onClick={() => setActive(active === i ? null : i)} style={{
            background: active === i ? imp.color + "15" : "#0d0d0d",
            border: "none",
            borderBottom: `2px solid ${active === i ? imp.color : "transparent"}`,
            padding: "1rem 1.25rem", cursor: "pointer", textAlign: "left",
            transition: "background 0.2s",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: active === i ? imp.color : "#4a4035", transition: "color 0.2s" }}>{imp.force}</div>
          </button>
        ))}
      </div>
      {active !== null ? (
        <div style={{ background: "#0d0d0d", border: `1px solid ${impacts[active].color}33`, borderLeft: `3px solid ${impacts[active].color}`, borderTop: "none", padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "#c87941", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Before — proprietary stack</div>
              <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.87rem", color: "#6a5a4a", lineHeight: 1.75 }}>{impacts[active].before}</p>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "#8aab7a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>After — open plane</div>
              <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.87rem", color: "#8a7a65", lineHeight: 1.75 }}>{impacts[active].after}</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderTop: "none", padding: "0.9rem", textAlign: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#2e2620" }}>click a force to see the impact of the open plane</span>
        </div>
      )}
    </div>
  );
}

function FederationMap({ links }) {
  const [active, setActive] = useState(null);
  const link = active !== null ? links[active] : null;

  return (
    <div>
      <div style={{ display: "grid", gap: 1, background: "#1a1a1a", border: "1px solid #1e1e1e" }}>
        {links.map((l, i) => (
          <button key={i} onClick={() => setActive(active === i ? null : i)} style={{
            background: active === i ? "#111" : "#0d0d0d",
            border: "none",
            borderLeft: `3px solid ${active === i ? l.fromColor : "#1e1e1e"}`,
            padding: "0.9rem 1.25rem",
            cursor: "pointer",
            textAlign: "left",
            display: "grid",
            gridTemplateColumns: "minmax(160px,1fr) auto minmax(160px,1fr) auto",
            gap: "0.75rem",
            alignItems: "center",
            transition: "all 0.15s",
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: active === i ? l.fromColor : "#6a5a4a" }}>{l.from}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#3a3028" }}>{l.direction === "bidirectional" ? "⇄" : "→"}</span>
            <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.78rem", color: "#4a4035" }}>{l.to}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#8aab7a", background: "#8aab7a18", padding: "2px 6px", border: "1px solid #8aab7a33", whiteSpace: "nowrap" }}>{l.maturity}</span>
          </button>
        ))}
      </div>

      {link ? (
        <div style={{ background: "#0d0d0d", border: `1px solid ${link.fromColor}33`, borderLeft: `3px solid ${link.fromColor}`, borderTop: "none", padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: link.fromColor, letterSpacing: "0.1em", textTransform: "uppercase" }}>{link.protocol}</div>
          </div>
          <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.87rem", color: "#8a7a65", lineHeight: 1.75 }}>{link.detail}</p>
        </div>
      ) : (
        <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderTop: "none", padding: "0.9rem", textAlign: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#2e2620" }}>click a federation link to see the protocol and mechanism</span>
        </div>
      )}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function VoronoiPost2() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Lora', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: ${ACCENT}; }
        a { color: ${ACCENT}; }
        button:focus { outline: 1px solid ${ACCENT}55; }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", padding: "5rem 2rem 4rem", borderBottom: "1px solid #1e1e1e", overflow: "hidden" }}>
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}
          viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          {/* grid lattice — multi-cloud topology metaphor */}
          {[0,1,2,3,4,5,6,7].map(col =>
            [0,1,2,3,4].map(row => {
              const x = 60 + col * 100, y = 50 + row * 75;
              return <circle key={`${col}-${row}`} cx={x} cy={y} r="3" fill={ACCENT} />;
            })
          )}
          {[0,1,2,3,4,5,6].map(col =>
            [0,1,2,3,4].map(row => {
              const x = 60 + col * 100, y = 50 + row * 75;
              return <line key={`h-${col}-${row}`} x1={x} y1={y} x2={x+100} y2={y} stroke={ACCENT} strokeWidth="0.6" />;
            })
          )}
          {[0,1,2,3,4,5,6,7].map(col =>
            [0,1,2,3].map(row => {
              const x = 60 + col * 100, y = 50 + row * 75;
              return <line key={`v-${col}-${row}`} x1={x} y1={y} x2={x} y2={y+75} stroke={ACCENT} strokeWidth="0.6" />;
            })
          )}
        </svg>
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
            <div style={{ width: 28, height: 1, background: ACCENT }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              The Voronoi Platform Architecture · Part II
            </span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900, color: "#f0e6d0", lineHeight: 1.15, marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.03em" }}>
            The Physical and Catalog Planes
          </h1>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "1.1rem", fontStyle: "italic", color: "#8a7a65", marginBottom: "2rem", lineHeight: 1.5 }}>
            Firms under regulatory pressure — or carrying the concentration risk of a single cloud dependency — need a data ecosystem that moves with their governance. This is how to build a central Data Lakehouse across AWS, Azure, and GCP, with cost as a first-class constraint.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: "1.5rem", borderTop: "1px solid #1e1e1e" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${ACCENT}, #2a5a6a)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0a0a", fontWeight: 700, fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>SV</div>
            <div>
              <div style={{ color: "#c8bfb0", fontSize: "0.85rem", fontFamily: "'JetBrains Mono', monospace" }}>Sravan Vadaga</div>
              <div style={{ color: "#4a4035", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>April 2026 · 10 min read</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 2rem 6rem" }}>

        {/* 1. The question */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            The question nobody draws on the architecture diagram
          </h2>
          <p style={prose}>
            Before you build intelligence, governance, or observability on a polyglot multi-cloud platform,
            you have to answer one deceptively simple question: <em>where is the truth, and can every
            engine in your architecture find it?</em>
          </p>
          <p style={prose}>
            Most enterprise architecture diagrams show three clouds in separate boxes, arrows between them
            labelled "integration", and a governance layer floating above all three. What they don't show
            is the physical plane — the file format your data actually lives in, the catalog that tells
            engines where to find it, and the egress charges triggered every time data crosses a
            cloud boundary. Those are the decisions that determine whether your multi-cloud architecture
            is genuinely interoperable or expensively siloed.
          </p>
          <p style={prose}>
            Part I introduced the six-force model and the problem of governance arriving too late.
            Part II is about the physical infrastructure those forces operate on. Get the physical and
            catalog planes wrong, and the forces can never be balanced — because the data isn't
            portable enough to let you move the levers.
          </p>

          <div style={{ borderLeft: "3px solid #5a9eb5", margin: "2.5rem 0", padding: "1rem 1.5rem", background: "linear-gradient(90deg, #5a9eb508 0%, transparent 100%)" }}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", fontStyle: "italic", color: "#e8d5b0", lineHeight: 1.6, margin: 0 }}>
              The format your data lives in is the most consequential architectural decision you make.
              Everything else — engines, catalogs, clouds — can be changed later. The format cannot.
            </p>
          </div>
        </section>

        {/* 2. Iceberg */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            Apache Iceberg — the open contract that changes the platform
          </h2>
          <p style={prose}>
            Apache Iceberg is a table format specification — not a database, not a cloud service, not a
            vendor product. It defines how data files (Parquet, ORC, Avro) are organised on object
            storage, how their metadata is maintained, and how engines discover and read them. The spec
            is Apache-governed, publicly published, and owned by no single company.
          </p>
          <p style={prose}>
            That governance structure is the point. When you store data in Iceberg format on S3, ADLS,
            or GCS, you own the files. No cloud vendor's SDK is required to read them. No proprietary
            API sits between your data and any engine that implements the Iceberg reader spec. The format
            is the contract — and the contract belongs to Apache.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 1, background: "#1a1a1a", border: "1px solid #1e1e1e", margin: "1.5rem 0" }}>
            {[
              { cap: "ACID Transactions", desc: "Concurrent writes without corruption. Optimistic concurrency at the file level — no global lock." },
              { cap: "Schema Evolution", desc: "Add, rename, drop, reorder columns without rewriting data files. Column IDs, not names, track identity." },
              { cap: "Time Travel", desc: "Query any historical snapshot by timestamp or snapshot ID. Audit, reproduce, rollback — natively." },
              { cap: "Partition Evolution", desc: "Change partitioning strategy without rewriting existing data. New data uses new partitions; old data is unchanged." },
              { cap: "Row-level Deletes", desc: "GDPR deletions and CDC upserts without full file rewrites. Position deletes and equality deletes in the spec." },
              { cap: "Hidden Partitioning", desc: "Engine derives partition values from column transforms. Queries never need to include partition columns — partition pruning is automatic." },
            ].map(({ cap, desc }) => (
              <div key={cap} style={{ background: "#0d0d0d", padding: "1.1rem" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: ACCENT, marginBottom: 5 }}>{cap}</div>
                <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.8rem", color: "#6a5a4a", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>

          <p style={prose}>
            Each of these capabilities matters — but the multi-cloud strategic value is not in any
            individual feature. It is in the combination: <em>all of these capabilities are delivered
            by the format itself</em>, not by a proprietary engine or cloud service. Trino on GCP gets
            the same time-travel capability as Spark on AWS querying the same Iceberg table. The capability
            travels with the data, not with the vendor.
          </p>
        </section>

        {/* 3. Catalog plane */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            The catalog plane — the layer most architects underspecify
          </h2>
          <p style={prose}>
            Iceberg tables on object storage are findable only if an engine knows where their metadata
            lives. That is what a catalog provides: a registry of table names → metadata locations. Without
            a catalog, every engine must be told the exact S3 path to the metadata file. With one, every
            engine resolves <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85em", color: ACCENT }}>SELECT * FROM domain.product</code> against
            a shared registry — and gets back the right snapshot pointer for the current table state.
          </p>
          <p style={prose}>
            The Iceberg REST Catalog specification defines a vendor-neutral HTTP API for this resolution.
            An engine with a REST catalog client makes a standard HTTP call: <em>where is the current
            metadata for this table?</em> The catalog responds with an S3 path. The engine reads the
            Parquet files directly. No vendor SDK. No proprietary protocol. Any catalog that implements
            the REST spec is interchangeable from the engine's perspective.
          </p>
          <div style={{ borderLeft: "3px solid #c87941", margin: "2rem 0", padding: "1rem 1.5rem", background: "linear-gradient(90deg, #c8794108 0%, transparent 100%)" }}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.15rem", fontStyle: "italic", color: "#e8d5b0", lineHeight: 1.6, margin: 0 }}>
              The catalog choice is where vendor lock-in most commonly enters without being noticed.
              Select yours with the REST spec as the non-negotiable baseline.
            </p>
          </div>

          <CatalogCompare catalogs={catalogs} />
        </section>

        {/* 4. Multi-cloud placement */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            Placing the enterprise across three clouds
          </h2>
          <p style={prose}>
            Multi-cloud is not about running every workload everywhere. It is about placing each workload
            on the cloud whose capability and pricing model best fits it — and keeping every workload
            movable. The placement decision is driven by three questions: where is the data gravity,
            what is the identity plane, and which cloud's compute is most cost-effective for this
            specific workload type?
          </p>
          <p style={prose}>
            Iceberg decouples the answers. The data lives in the object store of the domain that owns it.
            The compute can be on any cloud, querying the Iceberg table via the REST catalog. Egress is
            the cost of that separation — and managing egress is where multi-cloud gets sophisticated.
            Click each cloud below to see workload placement rationale — the{" "}
            <a href="https://github.com/techbitsvsk/multicloud_repo" target="_blank" rel="noopener noreferrer">multicloud_repo</a>
            {" "}shows the same Bronze→Silver→Gold Spark pipeline running unchanged across AWS Glue, Fabric, and local Spark.
          </p>

          <div style={{ margin: "1.5rem 0" }}>
            <CloudMap clouds={clouds} />
          </div>

        </section>

        {/* 5. Engine matrix */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            The interoperability matrix — every engine on the same table
          </h2>
          <p style={prose}>
            The strategic value of Iceberg is that the same table — same S3 path, same Polaris catalog
            registration — is queryable by ten different engines without a copy, a transform, or a
            connector license. The matrix below shows the current state of engine support. Read support
            is nearly universal. Write and streaming support narrows the field to the engines you
            should run your ingestion workloads through.
          </p>

          <div style={{ margin: "1.5rem 0" }}>
            <EngineMatrix engines={engines} />
          </div>

          <p style={{ ...prose, color: "#6a5a4a", marginTop: "1rem" }}>
            The practical write path: Spark or Flink (full spec support). Expose via Polaris REST Catalog.
            Query via Trino for ad-hoc SQL, DuckDB for local validation, Snowflake or BigLake for governed external sharing.
            Each engine is swappable — the table does not change.
          </p>
        </section>

        {/* 6. Platform interoperability matrix */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            Platform-to-platform interoperability matrix
          </h2>
          <p style={prose}>
            The engine compatibility table shows what each engine can do with Iceberg. The matrix below
            shows what each <em>platform</em> can do with every other — including the mechanism, the
            open-ness of the path, and where gaps remain. Reading across a row answers: if my data
            lives here, who can query it and how? Reading down a column answers: what can this engine
            reach, and at what cost of dependency?
          </p>
          <p style={prose}>
            Four path types exist. <strong style={{ color: "#8aab7a" }}>Native · Open</strong> means the
            Iceberg REST Catalog + direct file read — no vendor SDK, no proprietary protocol, the open
            spec end to end. <strong style={{ color: ACCENT }}>Iceberg bridge</strong> means Iceberg
            format is used but cloud credentials or extra configuration are required — still
            interoperable, but not zero-config. <strong style={{ color: AMBER }}>Vendor connector</strong>
            means a proprietary protocol (JDBC, Delta Sharing, Snowflake Arrow) is involved — functional
            but creates a library dependency that may not travel. <strong style={{ color: "#b8847b" }}>Copy required</strong> means
            there is no live query path — data must be moved first.
          </p>

          <div style={{ margin: "1.5rem 0" }}>
            <InteropMatrix
              sources={interopSources}
              consumers={interopConsumers}
              cells={interopCells}
              mechanisms={interopMechanisms}
              typeConfig={interopTypeConfig}
            />
          </div>

          <p style={{ ...prose, color: "#6a5a4a" }}>
            The pattern is clear. When data lives in Iceberg on object storage (S3, ADLS, GCS, or
            on-prem MinIO), the top row of consumers — Spark, Trino, Flink — all reach it natively.
            The gaps concentrate in two places: Fabric OneLake as a source (Microsoft ecosystem is the
            consumption surface, not the origin), and Snowflake internal tables as a source (proprietary
            format requires a connector for every consumer). Both are arguments for keeping primary data
            in Iceberg on object storage and using Fabric and Snowflake as governed consumption layers,
            not as the source of truth.
          </p>
        </section>

        {/* 7. Federated Catalog Marketplace */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            The Federated Catalog Marketplace
          </h2>
          <p style={prose}>
            Your risk team is in Snowflake. Your ML team is in Databricks. Data engineering runs through Glue.
            None can see what the others have registered — until the platforms themselves started shipping
            federation protocols. Glue↔Unity foreign catalogs: GA, bidirectional. OneLake Iceberg REST endpoint:
            any engine with a REST client connects with an Entra token. Databricks Unity Catalog: Iceberg REST
            Catalog endpoint now in Public Preview — Spark, Trino, Flink connect directly without UniForm or a
            Databricks SDK. Snowflake Horizon Catalog-Linked Databases: syncs with any Iceberg REST catalog,
            applies Horizon governance to external objects without moving data. These are platform-level
            commitments, not one-off integrations.
          </p>
          <p style={prose}>
            The central marketplace is no longer a green-field build. Apache Polaris federates over all domain
            catalogs and presents a single REST namespace. OneLake is the Microsoft consumption surface — its
            Iceberg REST endpoint makes it machine-readable, not just a BI UI. The federation protocols exist.
            The next question is governance, discovery, and consumption at scale — which is Part III.
          </p>

          <div style={{ margin: "1.5rem 0" }}>
            <FederationMap links={federationLinks} />
          </div>

          <p style={{ ...prose, color: "#6a5a4a" }}>
            Strong consistency in this model means the catalog is the source of truth — not the copy,
            not the pipeline output, not the BI cache. A data product registered in Glue is visible in
            Unity Catalog as a foreign table. A Polaris-registered Iceberg table is discoverable from
            Horizon. An OneLake shortcut reads the same Parquet files as the Spark job that wrote them.
            No reconciliation step. No scheduled sync. The next phase of this architecture — governance,
            data product discovery, consumption pattern management, and OLAP/OLTP co-existence — is
            precisely what a federation-native marketplace enables. It is the subject of Part III.
          </p>
        </section>

        {/* 8. Policy enforcement */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            Central policy enforcement — OPA on-prem and Immuta at the query layer
          </h2>
          <p style={prose}>
            Ten engines, three clouds, one on-premises cluster. Who governs the door — and what they see
            through it — are two separate problems that require two separate enforcement planes. OPA
            governs the infrastructure path: can this identity reach this catalog namespace at this
            classification tier? Immuta governs what the query returns once access is permitted: which
            columns are masked, which rows are filtered, which purposes are authorised. Neither substitutes
            for the other. The on-prem implementation pattern is in{" "}
            <a href="https://github.com/techbitsvsk/catalog_sync" target="_blank" rel="noopener noreferrer">catalog_sync</a>
            {" "}— catalog-gateway + OPA sidecar + Nessie, with the 4-layer enforcement chain running locally.
          </p>

          <div style={{ margin: "1.5rem 0" }}>
            <PolicyEnforcementPanel layers={policyLayers} />
          </div>

          <p style={prose}>
            The critical design constraint: policy definition must be central, policy enforcement must be
            local. A Spark job running on an on-premises bare-metal cluster cannot accept 200ms round
            trips to a cloud API for every row access decision. OPA deployed as a sidecar evaluates
            Rego policies from a shared bundle — same policies as cloud, zero cloud latency. Immuta
            enforcement agents run as Spark extensions on the same cluster — the control plane is SaaS
            or private cloud, the enforcement is local.
          </p>

          <div style={{ margin: "1.5rem 0" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>End-to-end access decision chain</div>
            <PolicyStack steps={policyPattern} />
          </div>

          <p style={{ ...prose, color: "#6a5a4a" }}>
            The result: a data scientist on GCP Vertex AI and a risk analyst on an on-premises Spark
            cluster both query the same Iceberg table. Both pass through the same OPA infrastructure gate
            — same Rego bundle, different deployment. Both get their query rewritten by the same Immuta
            policy — same access control definitions, different enforcement agent. The audit trail for
            both is emitted to the same OpenLineage / Neo4j graph. One policy definition. Every
            environment. No environment-specific governance configuration.
          </p>
        </section>

        {/* 9. Lock-in audit */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            The vendor lock-in audit — four vectors, one open answer
          </h2>
          <p style={prose}>
            Most enterprise platforms have vendor lock-in across four distinct vectors simultaneously.
            Each vector is individually manageable. Together they make migration feel impossible — even
            when the technical work is not. The open plane breaks each vector independently. You do not
            need to solve all four at once. Start with format; the others follow.
          </p>

          <div style={{ margin: "1.5rem 0" }}>
            <LockInAccordion vectors={lockInVectors} />
          </div>
        </section>

        {/* 10. Billing negotiation */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            Negotiating billing from a position of strength
          </h2>
          <p style={prose}>
            Every cloud provider's renewal playbook assumes you are locked in. The conversation opens
            with compute discounts — committed use, reserved instances, savings plans. Egress discounts
            are not offered. They are conceded only when the customer demonstrates they can move. The
            five-step sequence below is how you walk into a renewal with real leverage.
          </p>
          <p style={prose}>
            The leverage is not a threat. It is a technical reality. An enterprise running Iceberg across
            open catalogs with a live secondary cloud workload is not making a negotiating bluff — it is
            describing its current operating state. That is a different conversation.
          </p>

          <div style={{ margin: "1.5rem 0" }}>
            <BillingFlow steps={billingSteps} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, background: "#1a1a1a", border: "1px solid #1e1e1e", margin: "1.5rem 0" }}>
            {[
              { cloud: "AWS", lever: "Savings Plans", typical: "30–60%", note: "Compute family commitments. 1 or 3 year. Flexible Savings Plans cover EC2 + Fargate + Lambda." },
              { cloud: "Azure", lever: "Reserved VM Instances", typical: "30–55%", note: "Per-VM-type commitments. Azure Hybrid Benefit stacks — bring Windows/SQL licences, reduce further." },
              { cloud: "GCP", lever: "Committed Use Discounts", typical: "28–57%", note: "Resource-based (specific VM types) or spend-based (flexible). Spend-based CUDs most portable across workload types." },
            ].map(({ cloud, lever, typical, note }) => (
              <div key={cloud} style={{ background: "#0d0d0d", padding: "1.1rem" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: ACCENT, marginBottom: 4 }}>{cloud}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#8a7a65", marginBottom: 4 }}>{lever}</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: "#e8d5b0", marginBottom: 6 }}>{typical}</div>
                <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.78rem", color: "#4a4035", lineHeight: 1.55 }}>{note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 11. Force impact */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            How the open plane strengthens the six forces
          </h2>
          <p style={prose}>
            The six-force model from Part I assumes domains have genuine physical sovereignty over their
            data. When the data is in a proprietary format, that sovereignty is nominal — the vendor's
            engine is required to access it. When the catalog is vendor-native, the marketplace is
            limited to that vendor's discovery UI. The open physical and catalog planes are what make the
            six-force equilibrium structurally achievable, not just aspirationally desirable.
          </p>

          <div style={{ margin: "1.5rem 0" }}>
            <ForceImpactGrid impacts={forceImpacts} />
          </div>
        </section>

        {/* 12. Frictional realities */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            The cost of doing this right
          </h2>
          <p style={prose}>
            The open plane is the correct architectural choice — but it is not a free one. Two costs are non-negotiable and routinely underestimated.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1, background: "#1a1a1a", border: "1px solid #1e1e1e", margin: "1.5rem 0" }}>
            <div style={{ background: "#0d0d0d", padding: "1.4rem", borderLeft: "3px solid #c87941" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#c87941", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>The Egress Trap</div>
              <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.88rem", color: "#8a7a65", lineHeight: 1.75 }}>
                Cross-cloud queries at petabyte scale generate egress fees that compound faster than compute savings. BigQuery reading Iceberg from S3, or Spark on GCP reading ADLS — each hop has a price. The answer is not to avoid cross-cloud; it is to co-locate compute with storage by default and treat cross-cloud reads as an exception that requires explicit cost justification, not a routine query path.
              </p>
            </div>
            <div style={{ background: "#0d0d0d", padding: "1.4rem", borderLeft: "3px solid #9b8ab8" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#9b8ab8", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>The Engineering Tax</div>
              <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.88rem", color: "#8a7a65", lineHeight: 1.75 }}>
                OPA sidecars need policy authors. Catalog proxies add latency and failure modes. Cross-cloud identity — mapping AWS IAM roles to Entra service principals to GCP service accounts — is genuine infrastructure work. This platform rewards a dedicated, senior platform engineering team. Running it understaffed produces exactly the complexity it was designed to escape.
              </p>
            </div>
          </div>
        </section>

        {/* TL;DR */}
        <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderLeft: `3px solid ${ACCENT}`, padding: "1.75rem", margin: "3rem 0 2rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4a4035", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
            The point — in one paragraph
          </div>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontStyle: "italic", color: "#c8bfb0", lineHeight: 1.8, margin: 0 }}>
            An enterprise that stores its data in Apache Iceberg, registers it in a Polaris REST Catalog,
            and places workloads on the cloud whose cost model best fits each workload is not doing
            multi-cloud for its own sake. It is building the physical conditions under which genuine
            vendor negotiation becomes possible — where "we can move" is a technical description, not
            a threat — and under which the six forces of the Voronoi architecture can be genuinely
            balanced, because the data is no longer trapped inside any single vendor's format, catalog,
            or egress pricing model.
          </p>
        </div>

        {/* Coming next */}
        <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: "2rem", marginTop: "3rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Coming Next · Part III
          </div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.25rem", color: ACCENT, marginBottom: "0.75rem" }}>
            The Marketplace Plane: Governed Discovery, Consumption, and the OLAP/OLTP divide
          </div>
          <p style={{ ...prose, color: "#4a4035", marginBottom: 0 }}>
            The federation protocols are in place. Glue, Unity, Polaris, OneLake, and Horizon all
            speak to each other. Now the question is: how do data consumers find, request, and consume
            data products at scale — and how does a single platform serve both analytical (OLAP) and
            operational (OLTP) patterns without two separate stacks? Part III covers the Marketplace
            force: data product discovery, access request and approval workflows, SLA and quality
            contracts, and the architectural patterns that let Iceberg serve both a risk model training
            job and a real-time operational API from the same table.
          </p>
        </div>

        {/* Back link */}
        <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "2rem", marginTop: "3rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Part I
          </div>
          <a href="/writing/voronoi" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1rem", color: AMBER, textDecoration: "none" }}>
            Ship Fast. Stay Governed. — The six-force equilibrium model →
          </a>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #1a1a1a" }}>
          {["Apache Iceberg", "Multi-Cloud", "Vendor Lock-In", "Iceberg REST Catalog", "Apache Polaris", "Cloud Economics", "Interoperability", "Data Sovereignty", "FinOps", "Platform Engineering", "Data Mesh", "Glue Federation", "Snowflake Horizon", "OneLake", "Delta Sharing", "Federated Catalog", "Data Marketplace"].map(tag => (
            <span key={tag} style={{ background: "#111", border: "1px solid #222", color: "#4a4035", padding: "4px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.06em" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
