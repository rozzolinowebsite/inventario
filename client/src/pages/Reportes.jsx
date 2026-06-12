import { useEffect, useState } from 'react'
import axios from 'axios'

const card = { backgroundColor: '#1f2937', borderRadius: '0.75rem', border: '1px solid #374151', padding: '1.5rem' }
const thS = { padding: '0.6rem 0.75rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', borderBottom: '1px solid #374151', textAlign: 'left' }
const tdS = { padding: '0.75rem 0.75rem', fontSize: '0.875rem', color: '#d1d5db', borderBottom: '1px solid #111827' }

export default function Reportes() {
  const [stockBajo, setStockBajo] = useState([])
  const [movRecientes, setMovRecientes] = useState([])

  useEffect(() => {
    axios.get('/api/reportes/stock-bajo').then((r) => setStockBajo(r.data)).catch(() => {})
    axios.get('/api/reportes/movimientos-recientes').then((r) => setMovRecientes(r.data)).catch(() => {})
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f9fafb', marginBottom: '0.2rem' }}>Reportes</h1>
        <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Resúmenes y alertas del inventario</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span>⚠️</span>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f9fafb' }}>Stock bajo mínimo</h2>
            {stockBajo.length > 0 && (
              <span style={{ marginLeft: 'auto', backgroundColor: '#450a0a', color: '#f87171', fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.6rem', borderRadius: '999px' }}>
                {stockBajo.length}
              </span>
            )}
          </div>
          {stockBajo.length === 0
            ? <p style={{ fontSize: '0.875rem', color: '#4b5563', textAlign: 'center', padding: '1.5rem 0' }}>✅ Todos los productos tienen stock suficiente.</p>
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>
                  <th style={thS}>Producto</th>
                  <th style={{ ...thS, textAlign: 'right' }}>Stock</th>
                  <th style={{ ...thS, textAlign: 'right' }}>Mínimo</th>
                </tr></thead>
                <tbody>{stockBajo.map((p) => (
                  <tr key={p.id}>
                    <td style={tdS}>{p.nombre}</td>
                    <td style={{ ...tdS, textAlign: 'right', color: '#f87171', fontWeight: 700 }}>{p.stock}</td>
                    <td style={{ ...tdS, textAlign: 'right', color: '#4b5563' }}>{p.stock_minimo}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
        </div>

        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span>🔄</span>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f9fafb' }}>Últimos movimientos</h2>
          </div>
          {movRecientes.length === 0
            ? <p style={{ fontSize: '0.875rem', color: '#4b5563', textAlign: 'center', padding: '1.5rem 0' }}>Sin movimientos registrados.</p>
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>
                  <th style={thS}>Fecha</th>
                  <th style={thS}>Producto</th>
                  <th style={{ ...thS, textAlign: 'center' }}>Tipo</th>
                  <th style={{ ...thS, textAlign: 'right' }}>Cant.</th>
                </tr></thead>
                <tbody>{movRecientes.map((m) => (
                  <tr key={m.id}>
                    <td style={{ ...tdS, color: '#6b7280', fontSize: '0.8rem' }}>{new Date(m.fecha).toLocaleDateString('es-AR')}</td>
                    <td style={tdS}>{m.producto_nombre}</td>
                    <td style={{ ...tdS, textAlign: 'center' }}>
                      <span style={{ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: m.tipo === 'entrada' ? '#14532d' : '#450a0a', color: m.tipo === 'entrada' ? '#4ade80' : '#f87171' }}>
                        {m.tipo}
                      </span>
                    </td>
                    <td style={{ ...tdS, textAlign: 'right', fontWeight: 600 }}>{m.cantidad}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  )
}
