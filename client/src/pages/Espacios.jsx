import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'

const EMPTY = { nombre: '', descripcion: '' }
const btnPrimary = { backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.125rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }
const btnSecondary = { backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }
const lbl = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.375rem' }
const fRow = { marginBottom: '1rem' }

const icons = ['🏠', '🔧', '📦', '🏭', '🚛', '🗄️', '🏗️', '🧰']

export default function Espacios() {
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const load = () => axios.get('/api/espacios').then((r) => setData(r.data))
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setModal(true) }
  const openEdit = (e, row) => { e.stopPropagation(); setForm({ nombre: row.nombre, descripcion: row.descripcion || '' }); setEditId(row.id); setError(''); setModal(true) }

  const handleSubmit = async (ev) => {
    ev.preventDefault(); setError('')
    try {
      editId ? await axios.put(`/api/espacios/${editId}`, form) : await axios.post('/api/espacios', form)
      setModal(false); load()
    } catch (err) { setError(err.response?.data?.error || 'Error') }
  }

  const handleDelete = async (e, row) => {
    e.stopPropagation()
    if (!confirm(`¿Eliminar espacio "${row.nombre}"? Se eliminarán también sus estantes.`)) return
    await axios.delete(`/api/espacios/${row.id}`); load()
  }

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value })
  const getIcon = (nombre) => {
    const n = nombre.toLowerCase()
    if (n.includes('taller')) return '🔧'
    if (n.includes('pañol') || n.includes('depósito')) return '🗄️'
    if (n.includes('contenedor')) return '📦'
    if (n.includes('galpón') || n.includes('galpon')) return '🏭'
    return '🏠'
  }

  return (
    <div>
      <PageHeader title="Espacios" subtitle="Lugares físicos de almacenamiento" action={<button onClick={openCreate} style={btnPrimary}>+ Nuevo espacio</button>} />

      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#4b5563' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
          <p style={{ fontSize: '0.875rem' }}>No hay espacios creados. Creá el primero.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {data.map((row) => (
            <div
              key={row.id}
              onClick={() => navigate(`/espacios/${row.id}`)}
              style={{ backgroundColor: '#1f2937', borderRadius: '0.875rem', border: '1px solid #374151', padding: '1.5rem', cursor: 'pointer', transition: 'border-color 0.15s, transform 0.1s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2.5rem' }}>{getIcon(row.nombre)}</div>
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <button onClick={(e) => openEdit(e, row)} style={{ ...btnSecondary, padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}>Editar</button>
                  <button onClick={(e) => handleDelete(e, row)} style={{ backgroundColor: 'transparent', color: '#f87171', border: '1px solid #dc262633', borderRadius: '0.375rem', padding: '0.25rem 0.625rem', fontSize: '0.75rem', cursor: 'pointer' }}>Eliminar</button>
                </div>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f9fafb', marginBottom: '0.25rem' }}>{row.nombre}</h3>
              {row.descripcion && <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.875rem' }}>{row.descripcion}</p>}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid #374151' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>📏 <strong style={{ color: '#d1d5db' }}>{row.total_estantes}</strong> estantes</span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>📦 <strong style={{ color: '#d1d5db' }}>{row.total_cajas}</strong> cajas</span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>📋 <strong style={{ color: '#d1d5db' }}>{row.total_items}</strong> items</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={editId ? 'Editar espacio' : 'Nuevo espacio'} onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#450a0a', borderRadius: '0.375rem' }}>{error}</p>}
            <div style={fRow}><label style={lbl}>Nombre *</label><input className="input" value={form.nombre} onChange={set('nombre')} required placeholder="Ej: Taller, Pañol, Contenedor" /></div>
            <div style={fRow}><label style={lbl}>Descripción</label><input className="input" value={form.descripcion} onChange={set('descripcion')} placeholder="Descripción opcional" /></div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setModal(false)} style={btnSecondary}>Cancelar</button>
              <button type="submit" style={btnPrimary}>{editId ? 'Guardar' : 'Crear espacio'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
