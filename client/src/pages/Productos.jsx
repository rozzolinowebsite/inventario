import { useEffect, useState } from 'react'
import axios from 'axios'
import Table from '../components/Table'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'

const EMPTY = { nombre: '', categoria: '', stock: '', stock_minimo: '', precio: '', proveedor_id: '' }

const card = { backgroundColor: '#1f2937', borderRadius: '0.75rem', border: '1px solid #374151' }
const btnPrimary = { backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.125rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }
const btnSecondary = { backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }
const lbl = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.375rem' }
const fRow = { marginBottom: '1rem' }
const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }

export default function Productos() {
  const [data, setData] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    axios.get('/api/productos').then((r) => setData(r.data))
    axios.get('/api/proveedores').then((r) => setProveedores(r.data))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setModal(true) }
  const openEdit = (row) => { setForm({ ...row }); setEditId(row.id); setError(''); setModal(true) }
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    try {
      editId ? await axios.put(`/api/productos/${editId}`, form) : await axios.post('/api/productos', form)
      setModal(false); load()
    } catch (err) { setError(err.response?.data?.error || 'Error al guardar') }
  }

  const handleDelete = async (row) => {
    if (!confirm(`¿Eliminar "${row.nombre}"?`)) return
    await axios.delete(`/api/productos/${row.id}`); load()
  }

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'proveedor_nombre', label: 'Proveedor' },
    {
      key: 'stock', label: 'Stock', render: (v, row) => {
        const bajo = Number(v) <= Number(row.stock_minimo)
        return <span style={{ fontWeight: bajo ? 700 : 400, color: bajo ? '#f87171' : '#d1d5db', backgroundColor: bajo ? '#450a0a' : 'transparent', padding: bajo ? '0.15rem 0.5rem' : 0, borderRadius: '0.25rem' }}>{v}</span>
      }
    },
    { key: 'stock_minimo', label: 'Stock mín.' },
    { key: 'precio', label: 'Precio', render: (v) => v ? `$${Number(v).toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : '—' },
  ]

  return (
    <div>
      <PageHeader title="Productos" subtitle="Gestión del catálogo de productos" action={<button onClick={openCreate} style={btnPrimary}>+ Nuevo producto</button>} />
      <div style={card}><Table columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} /></div>

      {modal && (
        <Modal title={editId ? 'Editar producto' : 'Nuevo producto'} onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.5rem 0.75rem', backgroundColor: '#450a0a', borderRadius: '0.375rem' }}>{error}</p>}
            <div style={fRow}><label style={lbl}>Nombre *</label><input className="input" value={form.nombre} onChange={set('nombre')} required placeholder="Nombre del producto" /></div>
            <div style={fRow}><label style={lbl}>Categoría</label><input className="input" value={form.categoria} onChange={set('categoria')} placeholder="Ej: Papelería" /></div>
            <div style={g2}>
              <div><label style={lbl}>Stock actual</label><input type="number" className="input" value={form.stock} onChange={set('stock')} required min="0" placeholder="0" /></div>
              <div><label style={lbl}>Stock mínimo</label><input type="number" className="input" value={form.stock_minimo} onChange={set('stock_minimo')} min="0" placeholder="0" /></div>
            </div>
            <div style={fRow}><label style={lbl}>Precio</label><input type="number" step="0.01" className="input" value={form.precio} onChange={set('precio')} placeholder="0.00" /></div>
            <div style={fRow}>
              <label style={lbl}>Proveedor</label>
              <select className="input" value={form.proveedor_id} onChange={set('proveedor_id')}>
                <option value="">Sin proveedor</option>
                {proveedores.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setModal(false)} style={btnSecondary}>Cancelar</button>
              <button type="submit" style={btnPrimary}>{editId ? 'Guardar cambios' : 'Crear producto'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
