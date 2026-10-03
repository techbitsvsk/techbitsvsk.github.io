/* ============================================================
   Profile — identity, contact, and the headline numbers.
   Single source for the Home hero, the About page, and SEO.
   ============================================================ */

/** First year as a working engineer. Everything else derives from this. */
export const START_YEAR = 2007

/** Years of experience, computed so it never goes stale. */
export const yearsOfExperience = new Date().getFullYear() - START_YEAR

export const profile = {
  name: 'Sravan Vadaga',
  role: 'Lead Platform Architect, VP',
  org: 'Barclays',
  location: 'Glasgow, Scotland',
  eyebrow: 'Enterprise Architecture · Financial Services · Glasgow, Scotland',
  disciplines: [
    'Data Strategy & Execution',
    'Multi-Cloud Platform',
    'Governed AI Adoption',
  ],
  email: 'sravankvadaga@gmail.com',
  linkedin: 'https://linkedin.com/in/sravankumarvadaga',
  github: 'https://github.com/techbitsvsk',
  githubHandle: 'techbitsvsk',
  certification: 'AWS Certified Solutions Architect — Professional',
}

/**
 * The opening of the bio. Verbatim from Sravan, with the year count
 * interpolated so the sentence stays true without an edit.
 */
export const intro = [
  `I've spent ${yearsOfExperience} years building and modernising data platforms in financial services. I started as a Java developer in ${START_YEAR}, and each step of my career since has widened the lens: from how a system is built, to how a solution serves the business, to how data is governed and trusted, to how an entire platform holds together across an enterprise.`,
  `What hasn't changed is that I still write code, because the best architecture decisions are made by people who understand how they will be built.`,
]

/**
 * The Home hero bio. Written to carry the three disciplines in
 * order — strategy and execution, multi-cloud platform, governed
 * AI adoption — and to close on the thesis the whole site argues.
 *
 * Deliberately does not repeat the "I still write code" line: that
 * runs further down the page, and on /about as chapter one.
 */
export const summary = `I've spent ${yearsOfExperience} years building and modernising data platforms in financial services. My work runs from data strategy through to its execution: multi-cloud platforms built on open formats, where residency decides whether data is replicated, relocated or federated, and governed AI adoption, where agents answer over those same governed data products, inside the same entitlements, with their working shown. Build the data product once, and reuse it in every agent.`

/**
 * Shorter form for search results and link previews, where the
 * hero paragraph would be truncated mid-sentence.
 */
export const metaDescription = `Data strategy and execution, multi-cloud platforms, and governed AI adoption in financial services — ${yearsOfExperience} years building the platforms that govern how data moves.`

/**
 * Headline metrics. Each one traces to a specific piece of work in
 * the career narrative — `chapter` is the About-page anchor.
 */
export const metrics = [
  {
    value: `${yearsOfExperience}`,
    suffix: '',
    label: 'Years of engineering\nleadership',
    chapter: 'widening-lens',
  },
  {
    value: '12',
    suffix: 'h → 2h',
    label: 'Risk report generation\nafter re-architecture',
    chapter: 'credit-risk',
  },
  {
    value: '8',
    suffix: 'mo',
    label: 'Regulatory delivery\nvs 3-year baseline',
    chapter: 'credit-risk',
  },
  {
    value: '95',
    suffix: '%',
    label: 'Cloud workloads, 5% held\non-premises by obligation',
    chapter: 'hybrid-pattern',
  },
  {
    value: '16',
    suffix: '',
    label: 'Architecture Decision\nRecords on Fabric',
    chapter: 'fabric',
  },
  {
    value: '3',
    suffix: '',
    label: 'Cloud platforms\nAWS · Azure · GCP',
    chapter: 'enterprise-platform',
  },
]

export const philosophy = {
  quote:
    'The architecture is the evidence. Not the claim. Build the system that governs the system — and the regulator’s question answers itself.',
  attribution: 'Sravan Vadaga',
  principles: [
    'Eliminate failure classes architecturally',
    'Governance as structure, not process',
    'The architecture is the regulatory evidence',
    'Platform over product',
  ],
}
