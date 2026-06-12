import { useEffect, useState } from 'react'
import axios from 'axios'
import Table from '../components/Table'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'

const EMPTY = { producto_id: '', tipo: 'entrada', cantidad: '', nota: '' }
const card = { backgroundColor: '#1f2937', borderRadius: '0.75rem', border: '1px solid #374151' }
const btnPrimary = { backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.125rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }
const btnSecondary = { backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }
const lbl = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.375rem' }
const fRow = { marginBottom: '1rem' }

const badge = (tipo) => ({
  display: 'inline-block', padding: '0.2rem 0.625rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
  backgroundColor: tipo === 'entrada' ? '#14532d' : '#450a0a',
  color: tipo === 'entrada' ? '#4ade80' : '#f87171',
})

export default function Movimientos() {
  const [data, setData] = useState([])
  const [productos, setProductos] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  const load = () => {
    axios.get('/api/movimientos').then((r) => setData(r.data))
    axios.get('/api/productos').then((r) => setProductos(r.data))
  }
  useEffect(() => { load() }, [])

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    try {
      await axios.post('/api/movimientos', form)
      setModal(false); load()
    } catch (err) { setError(err.response?.data?.error || 'Error al guardar') }
  }

  const columns = [
    { key: 'fecha', label: 'Fecha', render: (v) => new Date(v).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) },
    { key: 'producto_nombre', label: 'Producto' },
    { key: 'tipo', label: 'Tipo', render: (v) => <span style={badge(v)}>{v.charAt(0).toUpperCase() + v.slice(1)}</span> },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'nota', label: 'Nota' },
  ]

  return (
    <div>
      <PageHeader title="Movimientos" subtitle="Entradas y salidas de stock" action={<button onClick={() => { setForm(EMPTY); setError(''); setModal(true) }} style={btnPrimary}>+ Registrar movimiento</button>} />
      <div style={card}><Table columns={columns} data={data} /></div>

      {modal && (
        <Modal title="Nuevo movimiento" onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.5rem 0.75rem', backgroundColor: '#450a0a', borderRadius: '0.375rem' }}>{error}</p>}
            <div style={fRow}>
              <label style={lbl}>Producto *</label>
              <select className="input" value={form.producto_id} onChange={set('producto_id')} required>
                <option value="">Seleccionar producto...</option>
                {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div style={fRow}>
              <label style={lbl}>Tipo de movimiento</label>
              <select className="input" value={form.tipo} onChange={set('tipo')}>
                <option value="entrada">Entrada — incrementa stock</option>
                <option value="salida">Salida — reduce stock</option>
              </select>
            </div>
            <div style={fRow}><label style={lbl}>Cantidad *</label><input type="number" min="1" className="input" value={form.cantidad} onChange={set('cantidad')} required placeholder="0" /></div>
            <div style={fRow}><label style={lbl}>Nota</label><input className="input" value={form.nota} onChange={set('nota')} placeholder="Observación opcional..." /></div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setModal(false)} style={btnSecondary}>Cancelar</button>
              <button type="submit" style={btnPrimary}>Registrar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
