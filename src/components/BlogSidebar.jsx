import { Link, useLocation } from 'react-router-dom'

const essays = [
  { path: '/writing/voronoi',    title: 'The Voronoi Platform Architecture' },
  { path: '/writing/architects', title: 'The Architects of Insight' },
  { path: '/writing/fabric',     title: 'Building a Full Fabric Platform' },
]

export default function BlogSidebar({ toc = [] }) {
  const { pathname } = useLocation()

  return (
    <aside className="blog-sidebar">
      {toc.length > 0 && (
        <div className="sidebar-section">
          <p className="sidebar-label">On this page</p>
          <ul className="toc-list">
            {toc.map(item => (
              <li key={item.id} className={item.level === 3 ? 'toc-h3' : ''}>
                <a href={`#${item.id}`}>{item.title}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="sidebar-section">
        <p className="sidebar-label">All essays</p>
        <ul className="sidebar-blog-links">
          {essays.map(e => (
            <li key={e.path}>
              <Link
                to={e.path}
                className={pathname === e.path ? 'current' : ''}
              >
                {e.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">Connect</p>
        <ul className="sidebar-blog-links">
          <li>
            <a href="https://linkedin.com/in/sravankumarvadaga" target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
          </li>
          <li>
            <a href="https://github.com/techbitsvsk" target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
          </li>
        </ul>
      </div>
    </aside>
  )
}
