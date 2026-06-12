import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import useIsMobile from '../hooks/useIsMobile'
import useSort from '../hooks/useSort'

const card = { backgroundColor: '#1f2937', borderRadius: '0.75rem', border: '1px solid #374151' }
const thS = { padding: '0.6rem 1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', backgroundColor: '#111827', borderBottom: '1px solid #374151', textAlign: 'left', whiteSpace: 'nowrap', userSelect: 'none' }
const tdS = { padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#d1d5db', borderBottom: '1px solid #111827', whiteSpace: 'nowrap' }

function SortTh({ label, colKey, sort, onSort, style = {} }) {
  const isActive = sort.key === colKey
  return (
    <th onClick={() => onSort(colKey)} style={{ ...thS, cursor: 'pointer', color: isActive ? '#93c5fd' : '#6b7280', ...style }}>
      {label}
      <span style={{ display: 'inline-flex', flexDirection: 'column', marginLeft: '0.35rem', verticalAlign: 'middle', gap: '1px' }}>
        <svg width="8" height="5" viewBox="0 0 8 5" fill={isActive && sort.dir === 'asc' ? '#60a5fa' : '#374151'}><path d="M4 0L8 5H0z"/></svg>
        <svg width="8" height="5" viewBox="0 0 8 5" fill={isActive && sort.dir === 'desc' ? '#60a5fa' : '#374151'}><path d="M4 5L0 0H8z"/></svg>
      </span>
    </th>
  )
}

export default function CajaDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [data, setData] = useState(null)

  const load = () =>
    axios.get(`/api/cajas/${id}`)
      .then(r => setData(r.data))
      .catch(() => navigate('/cajas'))

  useEffect(() => { load() }, [id])

  const { sorted, sortKey, sortDir, handleSort } = useSort(data?.items ?? [], 'nombre')

  if (!data) return <div style={{ color: '#6b7280', padding: '2rem' }}>Cargando...</div>

  const { caja, items } = data

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/espacios')} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.875rem', padding: 0 }}>Espacios</button>
        {caja.espacio_id && (
          <>
            <span style={{ color: '#374151' }}>›</span>
            <button onClick={() => navigate(`/espacios/${caja.espacio_id}`)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.875rem', padding: 0 }}>{caja.espacio_nombre}</button>
          </>
        )}
        {caja.estante_id && (
          <>
            <span style={{ color: '#374151' }}>›</span>
            <button onClick={() => navigate(`/estantes/${caja.estante_id}`)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.875rem', padding: 0 }}>{caja.estante_nombre}</button>
          </>
        )}
        <span style={{ color: '#374151' }}>›</span>
        <span style={{ fontSize: '0.875rem', color: '#f9fafb', fontWeight: 600 }}>{caja.nombre}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#451a03', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, border: '1px solid #78350f' }}>
            📦
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#f9fafb', margin: 0 }}>{caja.nombre}</h1>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', backgroundColor: '#111827', border: '1px solid #374151', padding: '0.2rem 0.55rem', borderRadius: '999px', fontFamily: 'monospace' }}>
                #{String(caja.id).padStart(4, '0')}
              </span>
            </div>
            {caja.descripcion && <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem', margin: 0 }}>{caja.descripcion}</p>}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ ...card, padding: '1.25rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.625rem' }}>Items</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#a78bfa', lineHeight: 1 }}>{caja.total_items}</div>
          <div style={{ fontSize: '0.72rem', color: '#4b5563', marginTop: '0.25rem' }}>objetos dentro</div>
        </div>

        {caja.estante_id ? (
          <div style={{ ...card, padding: '1.25rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.625rem' }}>Estante</div>
            <div onClick={() => navigate(`/estantes/${caja.estante_id}`)} style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', lineHeight: 1.3, cursor: 'pointer' }}>
              📏 {caja.estante_nombre}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#4b5563', marginTop: '0.25rem' }}>ir al estante</div>
          </div>
        ) : (
          <div style={{ ...card, padding: '1.25rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.625rem' }}>Estante</div>
            <div style={{ fontSize: '0.875rem', color: '#4b5563', fontStyle: 'italic' }}>Sin estante asignado</div>
          </div>
        )}

        {caja.espacio_id ? (
          <div style={{ ...card, padding: '1.25rem', gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.625rem' }}>Espacio</div>
            <div onClick={() => navigate(`/espacios/${caja.espacio_id}`)} style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3b82f6', lineHeight: 1.3, cursor: 'pointer' }}>
              🏠 {caja.espacio_nombre}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#4b5563', marginTop: '0.25rem' }}>ir al espacio</div>
          </div>
        ) : (
          <div style={{ ...card, padding: '1.25rem', gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.625rem' }}>Espacio</div>
            <div style={{ fontSize: '0.875rem', color: '#4b5563', fontStyle: 'italic' }}>Sin espacio asignado</div>
          </div>
        )}
      </div>

      {/* Lista de items */}
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
        Contenido de la caja
      </div>
      <div style={{ ...card, overflowX: 'auto' }}>
        {items.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#4b5563', fontSize: '0.875rem' }}>
            Esta caja está vacía.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <SortTh label="Nombre" colKey="nombre" sort={{ key: sortKey, dir: sortDir }} onSort={handleSort} />
              <SortTh label="Cant." colKey="cantidad" sort={{ key: sortKey, dir: sortDir }} onSort={handleSort} style={{ textAlign: 'center' }} />
              {!isMobile && <SortTh label="Descripción" colKey="descripcion" sort={{ key: sortKey, dir: sortDir }} onSort={handleSort} />}
            </tr></thead>
            <tbody>
              {sorted.map((row, i) => {
                const base = i % 2 === 0 ? '#1f2937' : '#1a2332'
                return (
                  <tr key={row.id} style={{ backgroundColor: base }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#263348'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = base}
                  >
                    <td style={tdS}>
                      <span onClick={() => navigate(`/items/${row.id}`)} style={{ fontWeight: 600, color: '#60a5fa', cursor: 'pointer' }}>
                        {row.nombre}
                      </span>
                      {isMobile && row.descripcion && (
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '0.1rem' }}>{row.descripcion}</div>
                      )}
                    </td>
                    <td style={{ ...tdS, textAlign: 'center', color: row.cantidad === 0 ? '#ef4444' : '#d1d5db', fontWeight: row.cantidad === 0 ? 700 : 400 }}>
                      {row.cantidad}{row.cantidad === 0 && ' ⚠'}
                    </td>
                    {!isMobile && <td style={{ ...tdS, color: '#6b7280' }}>{row.descripcion || '—'}</td>}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
