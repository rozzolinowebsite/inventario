import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Modal from '../components/Modal'
import useIsMobile from '../hooks/useIsMobile'
import useSort from '../hooks/useSort'

const btnPrimary = { backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }
const btnSecondary = { backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.5rem', padding: '0.45rem 0.875rem', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer' }
const lbl = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.375rem' }
const fRow = { marginBottom: '1rem' }
const card = { backgroundColor: '#1f2937', borderRadius: '0.75rem', border: '1px solid #374151', overflowX: 'auto' }
const thS = { padding: '0.6rem 1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', backgroundColor: '#111827', borderBottom: '1px solid #374151', textAlign: 'left', whiteSpace: 'nowrap', userSelect: 'none' }
const tdS = { padding: '0.7rem 1rem', fontSize: '0.875rem', color: '#d1d5db', borderBottom: '1px solid #111827', whiteSpace: 'nowrap' }

function SortTh({ label, colKey, sort, onSort, style = {} }) {
  const isActive = sort.key === colKey
  return (
    <th
      onClick={() => onSort(colKey)}
      style={{ ...thS, cursor: 'pointer', color: isActive ? '#93c5fd' : '#6b7280', ...style }}
    >
      {label}
      <span style={{ display: 'inline-flex', flexDirection: 'column', marginLeft: '0.35rem', verticalAlign: 'middle', lineHeight: 1, gap: '1px' }}>
        <svg width="8" height="5" viewBox="0 0 8 5" fill={isActive && sort.dir === 'asc' ? '#60a5fa' : '#374151'}><path d="M4 0L8 5H0z"/></svg>
        <svg width="8" height="5" viewBox="0 0 8 5" fill={isActive && sort.dir === 'desc' ? '#60a5fa' : '#374151'}><path d="M4 5L0 0H8z"/></svg>
      </span>
    </th>
  )
}

const TABS = ['Estantes', 'Cajas', 'Items']

export default function EspacioDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [detalle, setDetalle] = useState(null)
  const [tab, setTab] = useState('Estantes')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [estSort, setEstSort] = useState({ key: 'nombre', dir: 'asc' })
  const [cajaSort, setCajaSort] = useState({ key: 'nombre', dir: 'asc' })
  const [itemSort, setItemSort] = useState({ key: 'nombre', dir: 'asc' })

  const makeSort = (_state, setState) => (key) => {
    setState(s => ({ key, dir: s.key === key ? (s.dir === 'asc' ? 'desc' : 'asc') : 'asc' }))
  }

  const sortRows = (rows, { key, dir }) => {
    if (!rows || !key) return rows
    return [...rows].sort((a, b) => {
      const va = a[key] ?? ''; const vb = b[key] ?? ''
      const cmp = typeof va === 'number' && typeof vb === 'number'
        ? va - vb
        : String(va).localeCompare(String(vb), 'es', { numeric: true, sensitivity: 'base' })
      return dir === 'asc' ? cmp : -cmp
    })
  }

  const load = () => axios.get(`/api/espacios/${id}/detalle`).then((r) => setDetalle(r.data)).catch(() => navigate('/espacios'))

  useEffect(() => { load() }, [id])

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  const openCreate = (type) => { setForm({}); setEditId(null); setError(''); setModal(type) }
  const openEdit = (type, row) => { setForm({ ...row }); setEditId(row.id); setError(''); setModal(type) }

  const handleSubmit = async (ev, type) => {
    ev.preventDefault(); setError('')
    const url = { estante: '/api/estantes', caja: '/api/cajas', item: '/api/items' }[type]
    const payload = { ...form, espacio_id: id }
    try {
      editId ? await axios.put(`${url}/${editId}`, payload) : await axios.post(url, payload)
      setModal(null); load()
    } catch (err) { setError(err.response?.data?.error || 'Error') }
  }

  const handleDelete = async (type, rowId) => {
    if (!confirm('¿Eliminar este registro?')) return
    const url = { estante: '/api/estantes', caja: '/api/cajas', item: '/api/items' }[type]
    await axios.delete(`${url}/${rowId}`); load()
  }

  if (!detalle) return <div style={{ color: '#6b7280', padding: '2rem' }}>Cargando...</div>

  const { espacio, estantes, cajas, items } = detalle

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button onClick={() => navigate('/espacios')} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.875rem' }}>Espacios</button>
        <span style={{ color: '#374151' }}>›</span>
        <span style={{ fontSize: '0.875rem', color: '#f9fafb', fontWeight: 600 }}>{espacio.nombre}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#f9fafb', marginBottom: '0.25rem' }}>{espacio.nombre}</h1>
          {espacio.descripcion && <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{espacio.descripcion}</p>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => openCreate('estante')} style={btnSecondary}>+ Estante</button>
          <button onClick={() => openCreate('caja')} style={btnSecondary}>+ Caja</button>
          <button onClick={() => openCreate('item')} style={btnPrimary}>+ Item</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', borderBottom: '1px solid #374151' }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', border: 'none', padding: '0.625rem 0.875rem', fontSize: isMobile ? '0.8rem' : '0.875rem', fontWeight: 600, cursor: 'pointer',
            color: tab === t ? '#3b82f6' : '#6b7280',
            borderBottom: tab === t ? '2px solid #3b82f6' : '2px solid transparent',
            marginBottom: '-1px', transition: 'color 0.15s', whiteSpace: 'nowrap',
          }}>
            {t === 'Estantes' ? `Estantes (${estantes.length})` : t === 'Cajas' ? `Cajas (${cajas.length})` : `Items (${items.length})`}
          </button>
        ))}
      </div>

      {/* Estantes */}
      {tab === 'Estantes' && (
        <div style={card}>
          {estantes.length === 0
            ? <div style={{ padding: '2.5rem', textAlign: 'center', color: '#4b5563', fontSize: '0.875rem' }}>No hay estantes en este espacio.</div>
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>
                  <SortTh label="Nombre" colKey="nombre" sort={estSort} onSort={makeSort(estSort, setEstSort)} />
                  {!isMobile && <SortTh label="Descripción" colKey="descripcion" sort={estSort} onSort={makeSort(estSort, setEstSort)} />}
                  <SortTh label="Cajas" colKey="total_cajas" sort={estSort} onSort={makeSort(estSort, setEstSort)} style={{ textAlign: 'center' }} />
                  <SortTh label="Items" colKey="total_items" sort={estSort} onSort={makeSort(estSort, setEstSort)} style={{ textAlign: 'center' }} />
                  <th style={{ ...thS, textAlign: 'right' }}>Acciones</th>
                </tr></thead>
                <tbody>{sortRows(estantes, estSort).map((row, i) => {
                  const base = i % 2 === 0 ? '#1f2937' : '#1a2332'
                  return (
                    <tr key={row.id} style={{ backgroundColor: base }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#263348'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = base}
                    >
                      <td style={tdS}>
                        <span onClick={() => navigate(`/estantes/${row.id}`)} style={{ fontWeight: 600, color: '#10b981', cursor: 'pointer' }}>{row.nombre}</span>
                      </td>
                      {!isMobile && <td style={tdS}>{row.descripcion || '—'}</td>}
                      <td style={{ ...tdS, textAlign: 'center' }}>{row.total_cajas}</td>
                      <td style={{ ...tdS, textAlign: 'center' }}>{row.total_items}</td>
                      <td style={{ ...tdS, textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button onClick={() => openEdit('estante', row)} style={{ fontSize: '0.78rem', color: '#60a5fa', background: 'none', border: '1px solid #1d4ed833', borderRadius: '0.375rem', padding: '0.2rem 0.6rem', cursor: 'pointer' }}>Editar</button>
                          <button onClick={() => handleDelete('estante', row.id)} style={{ fontSize: '0.78rem', color: '#f87171', background: 'none', border: '1px solid #dc262633', borderRadius: '0.375rem', padding: '0.2rem 0.6rem', cursor: 'pointer' }}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}</tbody>
              </table>
            )}
        </div>
      )}

      {/* Cajas */}
      {tab === 'Cajas' && (
        <div style={card}>
          {cajas.length === 0
            ? <div style={{ padding: '2.5rem', textAlign: 'center', color: '#4b5563', fontSize: '0.875rem' }}>No hay cajas en este espacio.</div>
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>
                  <SortTh label="Nombre" colKey="nombre" sort={cajaSort} onSort={makeSort(cajaSort, setCajaSort)} />
                  {!isMobile && <SortTh label="Estante" colKey="estante_nombre" sort={cajaSort} onSort={makeSort(cajaSort, setCajaSort)} />}
                  {!isMobile && <SortTh label="Descripción" colKey="descripcion" sort={cajaSort} onSort={makeSort(cajaSort, setCajaSort)} />}
                  <SortTh label="Items" colKey="total_items" sort={cajaSort} onSort={makeSort(cajaSort, setCajaSort)} style={{ textAlign: 'center' }} />
                  <th style={{ ...thS, textAlign: 'right' }}>Acciones</th>
                </tr></thead>
                <tbody>{sortRows(cajas, cajaSort).map((row, i) => {
                  const base = i % 2 === 0 ? '#1f2937' : '#1a2332'
                  return (
                    <tr key={row.id} style={{ backgroundColor: base }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#263348'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = base}
                    >
                      <td style={tdS}>
                        <span onClick={() => navigate(`/cajas/${row.id}`)} style={{ fontWeight: 600, color: '#f59e0b', cursor: 'pointer' }}>{row.nombre}</span>
                        {isMobile && row.estante_nombre && <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{row.estante_nombre}</div>}
                      </td>
                      {!isMobile && <td style={tdS}>{row.estante_nombre || <span style={{ color: '#4b5563' }}>Sin estante</span>}</td>}
                      {!isMobile && <td style={tdS}>{row.descripcion || '—'}</td>}
                      <td style={{ ...tdS, textAlign: 'center' }}>{row.total_items}</td>
                      <td style={{ ...tdS, textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button onClick={() => openEdit('caja', row)} style={{ fontSize: '0.78rem', color: '#60a5fa', background: 'none', border: '1px solid #1d4ed833', borderRadius: '0.375rem', padding: '0.2rem 0.6rem', cursor: 'pointer' }}>Editar</button>
                          <button onClick={() => handleDelete('caja', row.id)} style={{ fontSize: '0.78rem', color: '#f87171', background: 'none', border: '1px solid #dc262633', borderRadius: '0.375rem', padding: '0.2rem 0.6rem', cursor: 'pointer' }}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}</tbody>
              </table>
            )}
        </div>
      )}

      {/* Items */}
      {tab === 'Items' && (
        <div style={card}>
          {items.length === 0
            ? <div style={{ padding: '2.5rem', textAlign: 'center', color: '#4b5563', fontSize: '0.875rem' }}>No hay items en este espacio.</div>
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>
                  <SortTh label="Nombre" colKey="nombre" sort={itemSort} onSort={makeSort(itemSort, setItemSort)} />
                  {!isMobile && <SortTh label="Estante" colKey="estante_nombre" sort={itemSort} onSort={makeSort(itemSort, setItemSort)} />}
                  {!isMobile && <SortTh label="Caja" colKey="caja_nombre" sort={itemSort} onSort={makeSort(itemSort, setItemSort)} />}
                  <SortTh label="Cant." colKey="cantidad" sort={itemSort} onSort={makeSort(itemSort, setItemSort)} style={{ textAlign: 'center' }} />
                  {!isMobile && <SortTh label="Descripción" colKey="descripcion" sort={itemSort} onSort={makeSort(itemSort, setItemSort)} />}
                  <th style={{ ...thS, textAlign: 'right' }}>Acciones</th>
                </tr></thead>
                <tbody>{sortRows(items, itemSort).map((row, i) => {
                  const base = i % 2 === 0 ? '#1f2937' : '#1a2332'
                  return (
                  <tr key={row.id} style={{ backgroundColor: base }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#263348'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = base}
                  >
                    <td style={tdS}>
                      <div onClick={() => navigate(`/items/${row.id}`)} style={{ fontWeight: 600, color: '#60a5fa', cursor: 'pointer' }}>{row.nombre}</div>
                      {isMobile && (row.estante_nombre || row.caja_nombre) && (
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '0.1rem' }}>
                          {[row.estante_nombre, row.caja_nombre].filter(Boolean).join(' › ')}
                        </div>
                      )}
                    </td>
                    {!isMobile && <td style={tdS}>{row.estante_nombre || '—'}</td>}
                    {!isMobile && <td style={tdS}>{row.caja_nombre || '—'}</td>}
                    <td style={{ ...tdS, textAlign: 'center', color: row.cantidad === 0 ? '#ef4444' : '#d1d5db', fontWeight: row.cantidad === 0 ? 700 : 400 }}>{row.cantidad}{row.cantidad === 0 && ' ⚠'}</td>
                    {!isMobile && <td style={tdS}>{row.descripcion || '—'}</td>}
                    <td style={{ ...tdS, textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => openEdit('item', row)} style={{ fontSize: '0.78rem', color: '#60a5fa', background: 'none', border: '1px solid #1d4ed833', borderRadius: '0.375rem', padding: '0.2rem 0.6rem', cursor: 'pointer' }}>Editar</button>
                        <button onClick={() => handleDelete('item', row.id)} style={{ fontSize: '0.78rem', color: '#f87171', background: 'none', border: '1px solid #dc262633', borderRadius: '0.375rem', padding: '0.2rem 0.6rem', cursor: 'pointer' }}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                  )
                })}</tbody>
              </table>
            )}
        </div>
      )}

      {/* Modal estante */}
      {modal === 'estante' && (
        <Modal title={editId ? 'Editar estante' : 'Nuevo estante'} onClose={() => setModal(null)}>
          <form onSubmit={(e) => handleSubmit(e, 'estante')}>
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#450a0a', borderRadius: '0.375rem' }}>{error}</p>}
            <div style={fRow}><label style={lbl}>Nombre *</label><input className="input" value={form.nombre || ''} onChange={set('nombre')} required placeholder="Ej: Estante A, Mueble 1" /></div>
            <div style={fRow}><label style={lbl}>Descripción</label><input className="input" value={form.descripcion || ''} onChange={set('descripcion')} placeholder="Descripción opcional" /></div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setModal(null)} style={btnSecondary}>Cancelar</button>
              <button type="submit" style={btnPrimary}>{editId ? 'Guardar' : 'Crear'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal caja */}
      {modal === 'caja' && (
        <Modal title={editId ? 'Editar caja' : 'Nueva caja'} onClose={() => setModal(null)}>
          <form onSubmit={(e) => handleSubmit(e, 'caja')}>
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#450a0a', borderRadius: '0.375rem' }}>{error}</p>}
            <div style={fRow}><label style={lbl}>Nombre *</label><input className="input" value={form.nombre || ''} onChange={set('nombre')} required placeholder="Ej: Caja de herramientas" /></div>
            <div style={fRow}><label style={lbl}>Descripción</label><input className="input" value={form.descripcion || ''} onChange={set('descripcion')} placeholder="Descripción opcional" /></div>
            <div style={fRow}>
              <label style={lbl}>Estante (opcional)</label>
              <select className="input" value={form.estante_id || ''} onChange={set('estante_id')}>
                <option value="">Sin estante asignado</option>
                {estantes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setModal(null)} style={btnSecondary}>Cancelar</button>
              <button type="submit" style={btnPrimary}>{editId ? 'Guardar' : 'Crear'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal item */}
      {modal === 'item' && (
        <Modal title={editId ? 'Editar item' : 'Nuevo item'} onClose={() => setModal(null)}>
          <form onSubmit={(e) => handleSubmit(e, 'item')}>
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#450a0a', borderRadius: '0.375rem' }}>{error}</p>}
            <div style={fRow}><label style={lbl}>Nombre *</label><input className="input" value={form.nombre || ''} onChange={set('nombre')} required placeholder="Ej: Llave 10mm" /></div>
            <div style={fRow}><label style={lbl}>Descripción</label><input className="input" value={form.descripcion || ''} onChange={set('descripcion')} placeholder="Descripción opcional" /></div>
            <div style={fRow}><label style={lbl}>Cantidad</label><input type="number" min="0" className="input" value={form.cantidad ?? 0} onChange={set('cantidad')} /></div>
            <div style={fRow}>
              <label style={lbl}>Estante (opcional)</label>
              <select className="input" value={form.estante_id || ''} onChange={set('estante_id')}>
                <option value="">Sin estante</option>
                {estantes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>
            <div style={fRow}>
              <label style={lbl}>Caja (opcional)</label>
              <select className="input" value={form.caja_id || ''} onChange={set('caja_id')}>
                <option value="">Sin caja</option>
                {cajas.map((c) => <option key={c.id} value={c.id}>{c.nombre}{c.estante_nombre ? ` (${c.estante_nombre})` : ''}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setModal(null)} style={btnSecondary}>Cancelar</button>
              <button type="submit" style={btnPrimary}>{editId ? 'Guardar' : 'Crear'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
