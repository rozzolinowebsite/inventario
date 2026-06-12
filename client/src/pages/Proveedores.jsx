import { useEffect, useState } from 'react'
import axios from 'axios'
import Table from '../components/Table'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'

const EMPTY = { nombre: '', contacto: '', telefono: '', email: '' }
const card = { backgroundColor: '#1f2937', borderRadius: '0.75rem', border: '1px solid #374151' }
const btnPrimary = { backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.125rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }
const btnSecondary = { backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }
const lbl = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.375rem' }
const fRow = { marginBottom: '1rem' }
const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }

export default function Proveedores() {
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  const load = () => axios.get('/api/proveedores').then((r) => setData(r.data))
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setModal(true) }
  const openEdit = (row) => { setForm({ ...row }); setEditId(row.id); setError(''); setModal(true) }
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    try {
      editId ? await axios.put(`/api/proveedores/${editId}`, form) : await axios.post('/api/proveedores', form)
      setModal(false); load()
    } catch (err) { setError(err.response?.data?.error || 'Error al guardar') }
  }

  const handleDelete = async (row) => {
    if (!confirm(`¿Eliminar "${row.nombre}"?`)) return
    await axios.delete(`/api/proveedores/${row.id}`); load()
  }

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'contacto', label: 'Contacto' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
  ]

  return (
    <div>
      <PageHeader title="Proveedores" subtitle="Gestión de proveedores y contactos" action={<button onClick={openCreate} style={btnPrimary}>+ Nuevo proveedor</button>} />
      <div style={card}><Table columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} /></div>

      {modal && (
        <Modal title={editId ? 'Editar proveedor' : 'Nuevo proveedor'} onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.5rem 0.75rem', backgroundColor: '#450a0a', borderRadius: '0.375rem' }}>{error}</p>}
            <div style={fRow}><label style={lbl}>Nombre *</label><input className="input" value={form.nombre} onChange={set('nombre')} required placeholder="Nombre del proveedor" /></div>
            <div style={fRow}><label style={lbl}>Contacto</label><input className="input" value={form.contacto} onChange={set('contacto')} placeholder="Nombre del contacto" /></div>
            <div style={g2}>
              <div><label style={lbl}>Teléfono</label><input className="input" value={form.telefono} onChange={set('telefono')} placeholder="011-xxxx-xxxx" /></div>
              <div><label style={lbl}>Email</label><input type="email" className="input" value={form.email} onChange={set('email')} placeholder="correo@ejemplo.com" /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setModal(false)} style={btnSecondary}>Cancelar</button>
              <button type="submit" style={btnPrimary}>{editId ? 'Guardar cambios' : 'Crear proveedor'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
