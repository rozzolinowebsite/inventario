import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Modal from '../components/Modal'
import useIsMobile from '../hooks/useIsMobile'

const lbl = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.375rem' }
const fRow = { marginBottom: '1rem' }
const cardBase = { backgroundColor: '#1f2937', borderRadius: '0.75rem', border: '1px solid #374151' }

const LOCATION_STEPS = [
  { key: 'espacio_nombre', icon: '🏠' },
  { key: 'estante_nombre', icon: '📏' },
  { key: 'caja_nombre', icon: '📦' },
]

export default function ItemDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [item, setItem] = useState(null)
  const [espacios, setEspacios] = useState([])
  const [estantes, setEstantes] = useState([])
  const [cajas, setCajas] = useState([])
  const [estantesFiltrados, setEstantesFiltrados] = useState([])
  const [cajasFiltradas, setCajasFiltradas] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({})
  const [error, setError] = useState('')

  const load = () =>
    axios.get(`/api/items/${id}`)
      .then(r => setItem(r.data))
      .catch(() => navigate('/items'))

  useEffect(() => {
    load()
    axios.get('/api/espacios').then(r => setEspacios(r.data))
    axios.get('/api/estantes').then(r => setEstantes(r.data))
    axios.get('/api/cajas').then(r => setCajas(r.data))
  }, [id])

  const set = (f) => (e) => {
    const newForm = { ...form, [f]: e.target.value }
    if (f === 'espacio_id') {
      newForm.estante_id = ''; newForm.caja_id = ''
      setEstantesFiltrados(estantes.filter(s => String(s.espacio_id) === e.target.value))
      setCajasFiltradas(cajas.filter(c => String(c.espacio_id) === e.target.value))
    }
    setForm(newForm)
  }

  const openEdit = () => {
    setForm({
      nombre: item.nombre,
      descripcion: item.descripcion || '',
      cantidad: item.cantidad,
      espacio_id: item.espacio_id || '',
      estante_id: item.estante_id || '',
      caja_id: item.caja_id || '',
    })
    setEstantesFiltrados(estantes.filter(s => s.espacio_id === item.espacio_id))
    setCajasFiltradas(cajas.filter(c => c.espacio_id === item.espacio_id))
    setError('')
    setModal(true)
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault(); setError('')
    const payload = {
      ...form,
      espacio_id: form.espacio_id || null,
      estante_id: form.estante_id || null,
      caja_id: form.caja_id || null,
    }
    try {
      await axios.put(`/api/items/${id}`, payload)
      setModal(false); load()
    } catch (err) { setError(err.response?.data?.error || 'Error') }
  }

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar "${item.nombre}"? Esta acción no se puede deshacer.`)) return
    await axios.delete(`/api/items/${id}`)
    navigate('/items')
  }

  if (!item) return <div style={{ color: '#6b7280', padding: '2rem' }}>Cargando...</div>

  const locationSteps = LOCATION_STEPS.map(s => ({ icon: s.icon, label: item[s.key] })).filter(s => s.label)

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/items')} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.875rem', padding: 0 }}>
          Items
        </button>
        <span style={{ color: '#374151' }}>›</span>
        <span style={{ fontSize: '0.875rem', color: '#f9fafb', fontWeight: 600 }}>{item.nombre}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#2e1065', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.625rem', flexShrink: 0, border: '1px solid #4c1d95' }}>
            🔩
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#f9fafb', margin: 0 }}>
                {item.nombre}
              </h1>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', backgroundColor: '#111827', border: '1px solid #374151', padding: '0.2rem 0.55rem', borderRadius: '999px', fontFamily: 'monospace' }}>
                #{String(item.id).padStart(4, '0')}
              </span>
            </div>
            {item.descripcion && (
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem', marginBottom: 0 }}>{item.descripcion}</p>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', flexShrink: 0 }}>
          <button
            onClick={openEdit}
            style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.125rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            style={{ backgroundColor: 'transparent', color: '#f87171', border: '1px solid #dc262644', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ ...cardBase, padding: '1.25rem', ...(item.cantidad === 0 ? { borderColor: '#dc2626', backgroundColor: '#1c0a0a' } : {}) }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: item.cantidad === 0 ? '#f87171' : '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.625rem' }}>
            {item.cantidad === 0 ? '⚠ Sin stock' : 'Cantidad'}
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: item.cantidad === 0 ? '#ef4444' : '#a78bfa', lineHeight: 1 }}>{item.cantidad}</div>
          <div style={{ fontSize: '0.72rem', color: item.cantidad === 0 ? '#7f1d1d' : '#4b5563', marginTop: '0.25rem' }}>unidades</div>
        </div>
        <div style={{ ...cardBase, padding: '1.25rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.625rem' }}>ID</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#60a5fa', lineHeight: 1, fontFamily: 'monospace' }}>
            #{String(item.id).padStart(4, '0')}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#4b5563', marginTop: '0.25rem' }}>identificador único</div>
        </div>
        <div style={{ ...cardBase, padding: '1.25rem', gridColumn: isMobile ? '1 / -1' : 'auto' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.625rem' }}>Registrado</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#d1d5db', lineHeight: 1.3 }}>
            {new Date(item.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#4b5563', marginTop: '0.25rem' }}>fecha de creación</div>
        </div>
      </div>

      {/* Ubicación */}
      <div style={{ ...cardBase, padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem' }}>Ubicación</div>
        {locationSteps.length === 0 ? (
          <span style={{ color: '#4b5563', fontSize: '0.875rem', fontStyle: 'italic' }}>Sin ubicación asignada</span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            {locationSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {i > 0 && <span style={{ color: '#4b5563', fontSize: '1.1rem', lineHeight: 1 }}>›</span>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem', padding: '0.5rem 0.875rem' }}>
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>{step.icon}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db' }}>{step.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Descripción */}
      {item.descripcion && (
        <div style={{ ...cardBase, padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>Descripción</div>
          <p style={{ fontSize: '0.9rem', color: '#d1d5db', lineHeight: 1.65, margin: 0 }}>{item.descripcion}</p>
        </div>
      )}

      {/* Modal editar */}
      {modal && (
        <Modal title="Editar item" onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#450a0a', borderRadius: '0.375rem' }}>{error}</p>}
            <div style={fRow}><label style={lbl}>Nombre *</label><input className="input" value={form.nombre} onChange={set('nombre')} required placeholder="Ej: Llave 10mm" /></div>
            <div style={fRow}><label style={lbl}>Descripción</label><input className="input" value={form.descripcion} onChange={set('descripcion')} placeholder="Detalle adicional" /></div>
            <div style={fRow}><label style={lbl}>Cantidad</label><input type="number" min="0" className="input" value={form.cantidad} onChange={set('cantidad')} /></div>
            <div style={{ borderTop: '1px solid #374151', paddingTop: '1rem', marginBottom: '0.25rem' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ubicación</p>
            </div>
            <div style={fRow}>
              <label style={lbl}>Espacio</label>
              <select className="input" value={form.espacio_id} onChange={set('espacio_id')}>
                <option value="">Sin asignar</option>
                {espacios.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={lbl}>Estante</label>
                <select className="input" value={form.estante_id} onChange={set('estante_id')} disabled={!form.espacio_id}>
                  <option value="">Sin estante</option>
                  {estantesFiltrados.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Caja</label>
                <select className="input" value={form.caja_id} onChange={set('caja_id')} disabled={!form.espacio_id}>
                  <option value="">Sin caja</option>
                  {cajasFiltradas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setModal(false)} style={{ backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem', cursor: 'pointer' }}>Cancelar</button>
              <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.125rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Guardar cambios</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
