import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Table from '../components/Table'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import useSort from '../hooks/useSort'

const EMPTY = { nombre: '', descripcion: '', espacio_id: '', estante_id: '' }
const card = { backgroundColor: '#1f2937', borderRadius: '0.75rem', border: '1px solid #374151' }
const btnPrimary = { backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.125rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }
const btnSecondary = { backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }
const lbl = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.375rem' }
const fRow = { marginBottom: '1rem' }

export default function Cajas() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const { sorted, sortKey, sortDir, handleSort } = useSort(data, 'nombre')
  const [espacios, setEspacios] = useState([])
  const [estantes, setEstantes] = useState([])
  const [estantesFiltrados, setEstantesFiltrados] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    axios.get('/api/cajas').then((r) => setData(r.data))
    axios.get('/api/espacios').then((r) => setEspacios(r.data))
    axios.get('/api/estantes').then((r) => setEstantes(r.data))
  }
  useEffect(() => { load() }, [])

  const set = (f) => (e) => {
    const newForm = { ...form, [f]: e.target.value }
    if (f === 'espacio_id') { newForm.estante_id = ''; setEstantesFiltrados(estantes.filter(s => String(s.espacio_id) === e.target.value)) }
    setForm(newForm)
  }

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setEstantesFiltrados([]); setModal(true) }
  const openEdit = (row) => {
    setForm({ nombre: row.nombre, descripcion: row.descripcion || '', espacio_id: row.espacio_id || '', estante_id: row.estante_id || '' })
    setEstantesFiltrados(estantes.filter(s => s.espacio_id === row.espacio_id))
    setEditId(row.id); setError(''); setModal(true)
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault(); setError('')
    const payload = { ...form, espacio_id: form.espacio_id || null, estante_id: form.estante_id || null }
    try {
      editId ? await axios.put(`/api/cajas/${editId}`, payload) : await axios.post('/api/cajas', payload)
      setModal(false); load()
    } catch (err) { setError(err.response?.data?.error || 'Error') }
  }

  const handleDelete = async (row) => {
    if (!confirm(`¿Eliminar caja "${row.nombre}"?`)) return
    await axios.delete(`/api/cajas/${row.id}`); load()
  }

  const columns = [
    { key: 'nombre', label: 'Nombre', sortable: true, render: (v, row) => <span onClick={() => navigate(`/cajas/${row.id}`)} style={{ fontWeight: 600, color: '#f59e0b', cursor: 'pointer' }}>{v}</span> },
    { key: 'espacio_nombre', label: 'Espacio', sortable: true },
    { key: 'estante_nombre', label: 'Estante', sortable: true, render: (v) => v || <span style={{ color: '#4b5563' }}>—</span> },
    { key: 'descripcion', label: 'Descripción', sortable: true, render: (v) => v || '—' },
    { key: 'total_items', label: 'Items', sortable: true, render: (v) => <span style={{ backgroundColor: '#1e3a5f', color: '#60a5fa', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>{v}</span> },
  ]

  return (
    <div>
      <PageHeader title="Cajas" subtitle="Contenedores dentro de los espacios" action={<button onClick={openCreate} style={btnPrimary}>+ Nueva caja</button>} />
      <div style={card}><Table columns={columns} data={sorted} onEdit={openEdit} onDelete={handleDelete} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} /></div>

      {modal && (
        <Modal title={editId ? 'Editar caja' : 'Nueva caja'} onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#450a0a', borderRadius: '0.375rem' }}>{error}</p>}
            <div style={fRow}><label style={lbl}>Nombre *</label><input className="input" value={form.nombre} onChange={set('nombre')} required placeholder="Ej: Caja de herramientas" /></div>
            <div style={fRow}><label style={lbl}>Descripción</label><input className="input" value={form.descripcion} onChange={set('descripcion')} placeholder="Descripción opcional" /></div>
            <div style={fRow}>
              <label style={lbl}>Espacio</label>
              <select className="input" value={form.espacio_id} onChange={set('espacio_id')}>
                <option value="">Sin espacio</option>
                {espacios.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>
            <div style={fRow}>
              <label style={lbl}>Estante (opcional)</label>
              <select className="input" value={form.estante_id} onChange={set('estante_id')} disabled={!form.espacio_id}>
                <option value="">Sin estante</option>
                {estantesFiltrados.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setModal(false)} style={btnSecondary}>Cancelar</button>
              <button type="submit" style={btnPrimary}>{editId ? 'Guardar' : 'Crear'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
