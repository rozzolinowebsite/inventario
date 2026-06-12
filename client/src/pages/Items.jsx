import { useEffect, useState } from 'react'
import axios from 'axios'
import Table from '../components/Table'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { useNavigate } from 'react-router-dom'
import useIsMobile from '../hooks/useIsMobile'
import useSort from '../hooks/useSort'

const EMPTY = { nombre: '', descripcion: '', cantidad: 1, espacio_id: '', estante_id: '', caja_id: '' }
const card = { backgroundColor: '#1f2937', borderRadius: '0.75rem', border: '1px solid #374151' }
const btnPrimary = { backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.125rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }
const btnSecondary = { backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }
const lbl = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.375rem' }
const fRow = { marginBottom: '1rem' }

export default function Items() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const { sorted, sortKey, sortDir, handleSort } = useSort(data, 'nombre')
  const [espacios, setEspacios] = useState([])
  const [estantes, setEstantes] = useState([])
  const [cajas, setCajas] = useState([])
  const [estantesFiltrados, setEstantesFiltrados] = useState([])
  const [cajasFiltradas, setCajasFiltradas] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const load = () => {
    const q = search ? `?q=${encodeURIComponent(search)}` : ''
    axios.get(`/api/items${q}`).then((r) => setData(r.data))
    axios.get('/api/espacios').then((r) => setEspacios(r.data))
    axios.get('/api/estantes').then((r) => setEstantes(r.data))
    axios.get('/api/cajas').then((r) => setCajas(r.data))
  }
  useEffect(() => { load() }, [search])

  const set = (f) => (e) => {
    const newForm = { ...form, [f]: e.target.value }
    if (f === 'espacio_id') {
      newForm.estante_id = ''; newForm.caja_id = ''
      setEstantesFiltrados(estantes.filter(s => String(s.espacio_id) === e.target.value))
      setCajasFiltradas(cajas.filter(c => String(c.espacio_id) === e.target.value))
    }
    setForm(newForm)
  }

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setEstantesFiltrados([]); setCajasFiltradas([]); setModal(true) }
  const openEdit = (row) => {
    setForm({ nombre: row.nombre, descripcion: row.descripcion || '', cantidad: row.cantidad, espacio_id: row.espacio_id || '', estante_id: row.estante_id || '', caja_id: row.caja_id || '' })
    setEstantesFiltrados(estantes.filter(s => s.espacio_id === row.espacio_id))
    setCajasFiltradas(cajas.filter(c => c.espacio_id === row.espacio_id))
    setEditId(row.id); setError(''); setModal(true)
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault(); setError('')
    const payload = { ...form, espacio_id: form.espacio_id || null, estante_id: form.estante_id || null, caja_id: form.caja_id || null }
    try {
      editId ? await axios.put(`/api/items/${editId}`, payload) : await axios.post('/api/items', payload)
      setModal(false); load()
    } catch (err) { setError(err.response?.data?.error || 'Error') }
  }

  const handleDelete = async (row) => {
    if (!confirm(`¿Eliminar "${row.nombre}"?`)) return
    await axios.delete(`/api/items/${row.id}`); load()
  }

  const columns = isMobile
    ? [
        { key: 'nombre', label: 'Nombre', sortable: true, render: (v, row) => (
          <div onClick={() => navigate(`/items/${row.id}`)} style={{ cursor: 'pointer' }}>
            <div style={{ fontWeight: 600, color: '#60a5fa' }}>{v}</div>
            {row.ubicacion && <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '0.15rem' }}>{row.ubicacion}</div>}
          </div>
        )},
        { key: 'cantidad', label: 'Cant.', sortable: true, render: (v) => <span style={{ fontWeight: 700, color: v === 0 ? '#ef4444' : '#d1d5db' }}>{v}{v === 0 && ' ⚠'}</span> },
      ]
    : [
        { key: 'nombre', label: 'Nombre', sortable: true, render: (v, row) => (
          <span onClick={() => navigate(`/items/${row.id}`)} style={{ fontWeight: 600, color: '#60a5fa', cursor: 'pointer' }}>{v}</span>
        )},
        { key: 'ubicacion', label: 'Ubicación', sortable: true, render: (v) => (
          <span style={{ fontSize: '0.8rem', backgroundColor: '#111827', color: '#9ca3af', padding: '0.2rem 0.625rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>{v}</span>
        )},
        { key: 'cantidad', label: 'Cant.', sortable: true, render: (v) => <span style={{ fontWeight: 700, color: v === 0 ? '#ef4444' : '#d1d5db' }}>{v}{v === 0 && ' ⚠'}</span> },
        { key: 'descripcion', label: 'Descripción', sortable: true, render: (v) => v || '—' },
      ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#f9fafb', marginBottom: '0.2rem' }}>Items</h1>
          <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Todos los objetos registrados</p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            className="input"
            style={{ width: isMobile ? '100%' : '220px' }}
            placeholder="🔍 Buscar item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={openCreate} style={{ ...btnPrimary, whiteSpace: 'nowrap' }}>+ Nuevo item</button>
        </div>
      </div>

      <div style={card}><Table columns={columns} data={sorted} onEdit={openEdit} onDelete={handleDelete} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} /></div>

      {modal && (
        <Modal title={editId ? 'Editar item' : 'Nuevo item'} onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#450a0a', borderRadius: '0.375rem' }}>{error}</p>}
            <div style={fRow}><label style={lbl}>Nombre *</label><input className="input" value={form.nombre} onChange={set('nombre')} required placeholder="Ej: Llave 10mm, Cable HDMI" /></div>
            <div style={fRow}><label style={lbl}>Descripción</label><input className="input" value={form.descripcion} onChange={set('descripcion')} placeholder="Detalle adicional" /></div>
            <div style={fRow}><label style={lbl}>Cantidad</label><input type="number" min="0" className="input" value={form.cantidad} onChange={set('cantidad')} /></div>

            <div style={{ borderTop: '1px solid #374151', paddingTop: '1rem', marginBottom: '0.25rem' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ubicación</p>
            </div>
            <div style={fRow}>
              <label style={lbl}>Espacio</label>
              <select className="input" value={form.espacio_id} onChange={set('espacio_id')}>
                <option value="">Sin asignar</option>
                {espacios.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={lbl}>Estante</label>
                <select className="input" value={form.estante_id} onChange={set('estante_id')} disabled={!form.espacio_id}>
                  <option value="">Sin estante</option>
                  {estantesFiltrados.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Caja</label>
                <select className="input" value={form.caja_id} onChange={set('caja_id')} disabled={!form.espacio_id}>
                  <option value="">Sin caja</option>
                  {cajasFiltradas.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setModal(false)} style={btnSecondary}>Cancelar</button>
              <button type="submit" style={btnPrimary}>{editId ? 'Guardar' : 'Crear item'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
