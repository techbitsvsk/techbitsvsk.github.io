import { useEffect } from "react";

const post = {
  title: "The Architects of Insight",
  subtitle: "A Tale of Data Kingdoms",
  author: "Sravan Vadaga",
  readTime: "4 min read",
  date: "May 2025",
  heroImage: "https://miro.medium.com/1*8eJQjZlX9SrnQPOklsLv9g.png",
};

function PullQuote({ children }) {
  return (
    <div style={{
      borderLeft: "3px solid #7b9eb8",
      margin: "2.5rem 0",
      padding: "1rem 1.5rem",
      background: "linear-gradient(90deg, #7b9eb808 0%, transparent 100%)",
    }}>
      <p style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "1.2rem",
        fontStyle: "italic",
        color: "#e8d5b0",
        lineHeight: 1.6,
        margin: 0,
      }}>
        {children}
      </p>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section style={{ marginBottom: "3rem" }}>
      {title && (
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "1.6rem",
          fontWeight: 700,
          color: "#e8d5b0",
          marginBottom: subtitle ? "0.25rem" : "1.25rem",
          marginTop: 0,
          letterSpacing: "-0.02em",
        }}>
          {title}
        </h2>
      )}
      {subtitle && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.7rem",
          color: "#7b9eb8",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "1.25rem",
        }}>
          {subtitle}
        </div>
      )}
      {children}
    </section>
  );
}

function P({ children, style = {} }) {
  return (
    <p style={{
      fontFamily: "'Lora', Georgia, serif",
      fontSize: "1.05rem",
      lineHeight: 1.85,
      color: "#c8bfb0",
      marginTop: 0,
      marginBottom: "1.25rem",
      ...style,
    }}>
      {children}
    </p>
  );
}

function Keyword({ children }) {
  return (
    <strong style={{ color: "#e8d5b0" }}>{children}</strong>
  );
}

export default function ArchitectsPost() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{
      background: "#0a0a0a",
      minHeight: "100vh",
      fontFamily: "'Lora', Georgia, serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #7b9eb8; }
      `}</style>

      {/* Hero */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid #1e1e1e",
      }}>
        {/* Hero image */}
        <div style={{
          width: "100%",
          maxHeight: 420,
          overflow: "hidden",
          position: "relative",
        }}>
          <img
            src={post.heroImage}
            alt="The Architects of Insight"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              opacity: 0.75,
            }}
          />
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            background: "linear-gradient(to bottom, transparent, #0a0a0a)",
          }} />
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 2rem 3rem", position: "relative" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: "1.5rem",
          }}>
            <div style={{ width: 28, height: 1, background: "#7b9eb8" }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "#7b9eb8",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>
              Comparative Architecture · Narrative
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 900,
            color: "#f0e6d0",
            lineHeight: 1.15,
            marginBottom: "0.75rem",
            marginTop: 0,
            letterSpacing: "-0.03em",
          }}>
            {post.title}
          </h1>

          <p style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "1.15rem",
            fontStyle: "italic",
            color: "#8a7a65",
            marginBottom: "2rem",
            lineHeight: 1.5,
          }}>
            {post.subtitle}
          </p>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingTop: "1.5rem",
            borderTop: "1px solid #1e1e1e",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #7b9eb8, #2e5f82)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#0a0a0a", fontWeight: 700, fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              SV
            </div>
            <div>
              <div style={{ color: "#c8bfb0", fontSize: "0.85rem", fontFamily: "'JetBrains Mono', monospace" }}>
                {post.author}
              </div>
              <div style={{ color: "#4a4035", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                {post.date} · {post.readTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 2rem 6rem" }}>

        <Section title="">
          <P>
            In the sprawling realm of Data, where information flowed like vast rivers and insights were
            precious jewels, two master architects rose to prominence:
          </P>
          <P>
            <Keyword>Architect Fabrica</Keyword> of the Unified Domain, and <Keyword>Architect Databrix</Keyword>,
            Champion of the Open Lakehouse. Both promised to help kingdoms organise their chaotic data landscapes,
            govern their information wisely, and unlock untold analytical power. Yet, their methods and masterpieces,
            while aiming for similar grand outcomes, were <em>distinctly different</em>.
          </P>
        </Section>

        <Section title="Architect Fabrica" subtitle='"Simplicity through Unity" · Microsoft Fabric'>
          <P>
            Architect Fabrica, representing <Keyword>Microsoft Fabric</Keyword>, was a visionary of holistic
            integration. She arrived in a kingdom and, with a sweep of her hand, proposed <Keyword>OneLake</Keyword> —
            a single, magnificent, logical reservoir where all the kingdom's data, from every province and outpost,
            would appear as one. <em>"No more scattered ponds and hidden streams!"</em> she'd declare.
          </P>
          <P>
            Her approach was that of a SaaS maestro; much of the foundational work, the plumbing and the
            infrastructure, was handled by her expert guilds, allowing the kingdom's denizens to focus on using the
            data, not building the aqueducts. Her blueprints favoured tools that worked in perfect harmony, like
            <Keyword> Data Factory</Keyword> for channelling data streams, Spark engines for powerful transformations,
            and <Keyword>Power BI</Keyword> for crafting luminous insight-tapestries, all under one roof.
            Governance in Fabrica's domain was often overseen by the wise <Keyword>Sage Purview</Keyword>, whose
            gaze extended across the entire estate, ensuring order and compliance.
          </P>
          <P>
            When it came to connecting with neighbouring lands, like the frosty plains of <Keyword>Iceberg</Keyword>,
            Fabrica's engineers would often build elegant <Keyword>Shortcuts</Keyword> or pathways that made Iceberg's
            structures understandable and usable within OneLake, sometimes gently reshaping them to fit the unified
            design, ensuring all analytical engines in her domain could work with them seamlessly. Data from other
            cloud continents like Amazon S3 or Google Cloud could also be viewed through these magical Shortcuts,
            appearing as if they were part of OneLake itself.
          </P>
          <P>
            Automating the construction of new data edifices (DDLs) was managed through well-defined
            <Keyword> Deployment Pipelines</Keyword> and increasingly, through scrolls inscribed with
            <Keyword> Terraform</Keyword> spells, often guided by the kingdom's Azure DevOps scribes. Security was
            paramount; the Unified Domain was a well-guarded citadel, leveraging the strength of
            <Keyword> Microsoft Entra ID</Keyword>, with options for <Keyword>Private Links</Keyword> to create
            exclusive, secure pathways. Interacting with ancient data archives like <Keyword>Hive Metastore</Keyword> or
            <Keyword> AWS Glue</Keyword> often involved Sage Purview's mappers charting these external territories,
            or Data Factory envoys bringing forth the needed information.
          </P>
        </Section>

        <Section title="Architect Databrix" subtitle='"Power through Flexibility and Openness" · Databricks'>
          <P>
            Across the valley stood Architect Databrix, the champion of the <Keyword>Open Lakehouse</Keyword>, often
            seen with her trusted companion, the <Keyword>Unity Catalog</Keyword>, a sentient grimoire of governance.
            Databrix's philosophy was "Power through Flexibility and Openness." She offered kingdoms the tools to
            build highly customised, powerful data estates that could span multiple cloud territories — AWS, Azure, GCP.
          </P>
          <P>
            Her foundation was <Keyword>Delta Lake</Keyword>, an open-standard marvel that brought reliability and
            performance to the wilder data lakes. The Unity Catalog was her masterpiece of governance: a central
            codex that defined every rule, every permission, every lineage thread for all data and AI artefacts.
            <em> "Define once, secure everywhere!"</em> was its motto.
          </P>
          <P>
            When the Iceberg envoys arrived, Databrix, through Unity Catalog, offered <Keyword>UniForm</Keyword> —
            a clever way for Delta Lake blueprints to be read perfectly by Iceberg tools without needing to rebuild
            or copy the underlying data structures. This allowed for peaceful coexistence and collaboration.
          </P>
          <P>
            For data virtualisation, Databrix employed <Keyword>Lakehouse Federation</Keyword>, sending skilled
            emissaries to query distant databases like MySQL, PostgreSQL, or even Snowflake, directly in their native
            lands, bringing back only the required knowledge, all while the Unity Catalog meticulously logged and
            governed these interactions. The automation of DDLs in Databrix's projects was a well-honed craft,
            utilising powerful <Keyword>Terraform</Keyword> incantations and <Keyword>Databricks Asset Bundles</Keyword> to
            construct and modify data structures with precision and repeatability, often managed through sophisticated
            CI/CD guilds.
          </P>
          <P>
            Security was a fortress of the kingdom's own design, highly configurable with options for customer-managed
            keys and intricate network architectures, all overseen by the ever-watchful Unity Catalog. When it came
            to the ancient archives of <Keyword>Hive Metastore</Keyword> or <Keyword>AWS Glue</Keyword>, Unity Catalog
            didn't just map them; it could <em>federate</em> them, creating "foreign catalogs" that allowed these
            external libraries to be governed and queried as if they were part of Databrix's own domain, a testament
            to her commitment to interoperability and unified governance.
          </P>
        </Section>

        <Section title="The Kingdoms Decide">
          <P>
            The kingdoms of Data listened intently to both architects.
          </P>
          <P>
            Those deeply allied with the Azure Sovereignty, who valued a swift, all-in-one solution where many
            complexities were managed for them, often found Architect Fabrica's vision of the Unified Domain
            compelling. Her OneLake promised a single source of truth, and her integrated toolkit felt familiar
            and efficient.
          </P>
          <P>
            However, kingdoms with diverse territories across multiple cloud continents, or those who cherished
            the ability to fine-tune every aspect of their data estate and build upon open standards, were drawn
            to Architect Databrix and her Unity Catalog. They valued the granular control, the robust, native
            governance that travelled with the data, and the flexibility to choose the best tools for every
            unique challenge.
          </P>

          <PullQuote>
            The choice was not of a lesser or greater architect, but of the path that best suited the kingdom's
            own character, its existing alliances, and its grand vision for the future of its Data Estate.
          </PullQuote>

          <P>
            Each architect offered a journey towards enlightenment, paved with different marvels of engineering
            and governance, promising a future where data was not a burden, but a source of boundless wisdom
            and power.
          </P>
        </Section>

        {/* Tags */}
        <div style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid #1a1a1a",
        }}>
          {["Microsoft Fabric", "Databricks", "Comparative Architecture", "Data Mesh", "Unity Catalog", "OneLake"].map(tag => (
            <span key={tag} style={{
              background: "#111",
              border: "1px solid #222",
              color: "#4a4035",
              padding: "4px 10px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.06em",
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
