import { Link } from 'react-router-dom'
import BlogSidebar from '../components/BlogSidebar'
import { useTocHighlight } from '../hooks/useTocHighlight'

const toc = [
  { id: 'fabrica',   title: 'Architect Fabrica — Microsoft Fabric', level: 2 },
  { id: 'databrix',  title: 'Architect Databrix — Databricks',      level: 2 },
  { id: 'kingdoms',  title: 'The kingdoms decide',                   level: 2 },
  { id: 'choice',    title: 'The nature of the choice',              level: 2 },
]

export default function ArchitectsPost() {
  useTocHighlight()

  return (
    <div className="blog-layout">
      <BlogSidebar toc={toc} />

      <article className="blog-content">
        <div className="blog-meta">
          <span className="blog-cat">Comparative Architecture</span>
          <span style={{ color: 'var(--border)', fontSize: '0.8rem' }}>·</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>Narrative</span>
        </div>

        <h1>The Architects of Insight</h1>
        <p className="blog-subtitle">A Tale of Data Kingdoms</p>

        <p>
          A metaphorical exploration of data platform choices, comparing the unified approach of
          Microsoft Fabric with the open flexibility of Databricks Lakehouse.
        </p>

        <p>
          In the sprawling realm of Data, where information flowed like vast rivers and insights were precious jewels,
          two master architects rose to prominence: Architect Fabrica of the Unified Domain, and Architect Databrix,
          Champion of the Open Lakehouse. Both promised to help kingdoms organise their chaotic data landscapes,
          govern their information wisely, and unlock untold analytical power. Yet their methods and masterpieces,
          while aiming for similar grand outcomes, were distinctly different.
        </p>

        <h2 id="fabrica">Architect Fabrica — "Simplicity through Unity"</h2>

        <p>
          Architect Fabrica, representing Microsoft Fabric, was a visionary of holistic integration. She arrived
          in a kingdom and, with a sweep of her hand, proposed OneLake — a single, magnificent logical reservoir
          where all the kingdom's data, from every province and outpost, would appear as one.
          <em>"No more scattered ponds and hidden streams!"</em> she'd declare.
        </p>

        <p>
          Her approach was that of a SaaS maestro; much of the foundational work — the plumbing and the
          infrastructure — was handled by her expert guilds, allowing the kingdom's denizens to focus on
          using the data, not building the aqueducts. Her blueprints favoured tools that worked in perfect
          harmony: Data Factory for channelling data streams, Spark engines for powerful transformations,
          and Power BI for crafting luminous insight-tapestries, all under one roof.
          Governance was overseen by the wise Sage Purview, whose gaze extended across the entire estate.
        </p>

        <p>
          When it came to connecting with neighbouring lands, like the frosty plains of Iceberg, Fabrica's
          engineers would build elegant Shortcuts or pathways that made Iceberg's structures usable within
          OneLake — sometimes gently reshaping them to fit the unified design. Data from other cloud
          continents like Amazon S3 or Google Cloud could also be viewed through these magical Shortcuts,
          appearing as if they were part of OneLake itself. Security was a well-guarded citadel, leveraging
          the strength of Microsoft Entra ID.
        </p>

        <h2 id="databrix">Architect Databrix — "Power through Flexibility and Openness"</h2>

        <p>
          Across the valley stood Architect Databrix, the champion of the Open Lakehouse, often seen with
          her trusted companion, the Unity Catalog — a sentient grimoire of governance.
          Her foundation was Delta Lake, an open-standard marvel that brought reliability and performance
          to the wilder data lakes. The Unity Catalog was her masterpiece: a central codex that defined
          every rule, every permission, every lineage thread for all data and AI artefacts.
          <em>"Define once, secure everywhere!"</em> was its motto.
        </p>

        <p>
          She offered kingdoms the tools to build highly customised, powerful data estates that could span
          multiple cloud territories — AWS, Azure, GCP. When the Iceberg envoys arrived, Databrix offered
          UniForm — a clever way for Delta Lake blueprints to be read perfectly by Iceberg tools without
          needing to rebuild or copy the underlying data structures.
        </p>

        <p>
          For data virtualisation, Databrix employed Lakehouse Federation — sending skilled emissaries to
          query distant databases like MySQL, PostgreSQL, or even Snowflake, directly in their native lands,
          bringing back only the required knowledge, all while the Unity Catalog meticulously logged and
          governed these interactions. Security was a fortress of the kingdom's own design — highly
          configurable, with customer-managed keys and intricate network architectures.
        </p>

        <h2 id="kingdoms">The kingdoms decide</h2>

        <p>
          Those deeply allied with the Azure Sovereignty, who valued a swift all-in-one solution where
          many complexities were managed for them, often found Architect Fabrica's vision compelling.
          Her OneLake promised a single source of truth, and her integrated toolkit felt familiar and efficient.
        </p>

        <p>
          However, kingdoms with diverse territories across multiple cloud territories — or those who
          cherished the ability to fine-tune every aspect of their data estate and build upon open standards —
          were drawn to Architect Databrix and her Unity Catalog. They valued granular control, the robust
          native governance that travelled with the data, and the flexibility to choose the best tools for
          every unique challenge.
        </p>

        <h2 id="choice">The nature of the choice</h2>

        <blockquote>
          <p>
            The choice was not of a lesser or greater architect, but of the path that best suited the
            kingdom's own character, its existing alliances, and its grand vision for the future of its Data Estate.
          </p>
        </blockquote>

        <p>
          Each architect offered a journey towards enlightenment, paved with different marvels of engineering
          and governance, promising a future where data was not a burden, but a source of boundless wisdom and power.
        </p>

        <div className="blog-related">
          <h4>Continue Reading</h4>
          <div className="blog-related-links">
            <Link to="/writing/voronoi">The Voronoi Platform Architecture: Equilibrium for Enterprise Data</Link>
            <Link to="/writing/fabric">Building a Full Microsoft Fabric Platform</Link>
          </div>
        </div>
      </article>
    </div>
  )
}
