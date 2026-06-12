import { NavLink } from 'react-router-dom'
import SearchBar from './SearchBar'

const links = [
  {
    to: '/dashboard', label: 'Dashboard',
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  },
  {
    to: '/espacios', label: 'Espacios',
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  },
  {
    to: '/cajas', label: 'Cajas',
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  },
  {
    to: '/items', label: 'Items',
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
  },
]

export default function Sidebar({ open, onClose, isMobile }) {
  const sidebarStyle = {
    width: '220px',
    minWidth: '220px',
    backgroundColor: '#0d1117',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    borderRight: '1px solid #1f2937',
    ...(isMobile ? {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 200,
      transform: open ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.25s ease',
    } : {
      position: 'sticky',
      top: 0,
    }),
  }

  return (
    <aside style={sidebarStyle}>
      <div style={{ padding: '1.25rem', borderBottom: '1px solid #1f2937', position: 'relative' }}>
        <div style={{ width: '36px', height: '36px', backgroundColor: '#2563eb', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.625rem' }}>
          <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
          </svg>
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f9fafb', lineHeight: 1.2 }}>Inventario</div>
        <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '0.2rem' }}>Gestión de ubicaciones</div>
        {isMobile && (
          <button
            onClick={onClose}
            style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, padding: '0.25rem' }}
          >×</button>
        )}
      </div>

      <SearchBar onNavigate={onClose} isMobile={isMobile} />

      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={isMobile ? onClose : undefined}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
              fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
              color: isActive ? '#ffffff' : '#9ca3af',
              backgroundColor: isActive ? '#2563eb' : 'transparent',
              transition: 'all 0.15s',
            })}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af', flexShrink: 0 }}>PR</div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f3f4f6' }}>Paulo Rozzolino</div>
          <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Administrador</div>
        </div>
      </div>
    </aside>
  )
}
