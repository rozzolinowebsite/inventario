import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useIsMobile from '../hooks/useIsMobile'

const statCards = [
  { key: 'espacios', label: 'Espacios', sub: 'lugares físicos', color: '#3b82f6', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { key: 'estantes', label: 'Estantes', sub: 'en todos los espacios', color: '#10b981', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg> },
  { key: 'cajas', label: 'Cajas', sub: 'contenedores', color: '#f59e0b', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
  { key: 'items', label: 'Items', sub: 'objetos registrados', color: '#a78bfa', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
]

const quickLinks = [
  { label: 'Nuevo espacio', sub: 'Taller, Pañol, Contenedor...', to: '/espacios', color: '#1d4ed8', bg: '#1e3a5f', icon: '🏠' },
  { label: 'Nuevo item', sub: 'Agregar un objeto al inventario', to: '/items', color: '#065f46', bg: '#1a3a2e', icon: '📋' },
]

const card = { backgroundColor: '#1f2937', borderRadius: '0.75rem', border: '1px solid #374151' }

export default function Dashboard() {
  const isMobile = useIsMobile()
  const [stats, setStats] = useState({ espacios: 0, estantes: 0, cajas: 0, items: 0, recientes: [], sin_stock: [] })
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/dashboard').then((r) => setStats(r.data)).catch(() => {})
  }, [])

  const sinStock = stats.sin_stock ?? []

  return (
    <div>
      {/* Alerta sin stock */}
      {sinStock.length > 0 && (
        <div style={{ backgroundColor: '#1c0a0a', border: '1px solid #dc2626', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0, marginTop: '0.1rem' }}>
            <svg width="20" height="20" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.5rem' }}>
              {sinStock.length === 1 ? '1 item sin stock' : `${sinStock.length} items sin stock`}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {sinStock.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/items/${item.id}`)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: '0.5rem' }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fca5a5' }}>{item.nombre}</span>
                  {item.ubicacion && item.ubicacion !== '—' && (
                    <span style={{ fontSize: '0.72rem', color: '#7f1d1d', backgroundColor: '#450a0a', padding: '0.15rem 0.5rem', borderRadius: '999px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {item.ubicacion}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Accesos rápidos */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span>⚡</span> Accesos rápidos
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {quickLinks.map((q) => (
            <button key={q.to} onClick={() => navigate(q.to)}
              style={{ backgroundColor: q.bg, border: `1px solid ${q.color}44`, borderRadius: '0.75rem', padding: '1rem 1.25rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <span style={{ fontSize: '1.5rem' }}>{q.icon}</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f9fafb', marginBottom: '0.2rem' }}>{q.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{q.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#f9fafb', marginBottom: '0.2rem' }}>Dashboard</h1>
          <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Resumen general del inventario</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {statCards.map(({ key, label, sub, color, icon }) => (
          <div key={key} style={{ ...card, padding: isMobile ? '1rem' : '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
              <div style={{ color, opacity: 0.8 }}>{icon}</div>
            </div>
            <div style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 800, color, lineHeight: 1, marginBottom: '0.25rem' }}>{stats[key]}</div>
            <div style={{ fontSize: '0.7rem', color: '#4b5563' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Items recientes */}
      {stats.recientes?.length > 0 && (
        <div style={{ ...card, padding: '1.25rem' }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            Últimos items agregados
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {stats.recientes.map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(`/items/${item.id}`)}
                style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: '0.25rem', padding: '0.5rem 0', borderBottom: '1px solid #111827', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '0.875rem', color: item.cantidad === 0 ? '#f87171' : '#d1d5db', fontWeight: item.cantidad === 0 ? 600 : 400 }}>
                  {item.nombre}
                  {item.cantidad === 0 && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', backgroundColor: '#450a0a', color: '#f87171', padding: '0.1rem 0.4rem', borderRadius: '999px', fontWeight: 700 }}>SIN STOCK</span>}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', backgroundColor: '#111827', padding: '0.2rem 0.625rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>{item.ubicacion}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
