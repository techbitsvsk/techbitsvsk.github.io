import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <div className="topbar">
        <Link to="/" className="brand">TechBits<span>VSK</span></Link>
        <nav className="site-nav">
          <NavLink
            to="/writing"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Writing
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Projects
          </NavLink>
          <a
            href="https://linkedin.com/in/sravankumarvadaga"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>
        </nav>
      </div>
    </header>
  )
}
