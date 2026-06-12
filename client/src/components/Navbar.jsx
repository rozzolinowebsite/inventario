import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/productos', label: 'Productos' },
  { to: '/proveedores', label: 'Proveedores' },
  { to: '/movimientos', label: 'Movimientos' },
  { to: '/reportes', label: 'Reportes' },
]

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '56px', gap: '2rem' }}>
          <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            📦 Inventario
          </span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  padding: '0.375rem 0.875rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  backgroundColor: isActive ? '#334155' : 'transparent',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
