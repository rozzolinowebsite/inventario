import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Fuse from 'fuse.js'
import axios from 'axios'

const TIPO_META = {
  espacio:  { label: 'Espacio',  color: '#3b82f6', bg: '#1e3a5f', icon: '🏠' },
  estante:  { label: 'Estante',  color: '#10b981', bg: '#14532d', icon: '📏' },
  caja:     { label: 'Caja',     color: '#f59e0b', bg: '#451a03', icon: '📦' },
  item:     { label: 'Item',     color: '#a78bfa', bg: '#2e1065', icon: '🔩' },
}

const fuseOptions = {
  keys: [
    { name: 'nombre',      weight: 0.6 },
    { name: 'descripcion', weight: 0.25 },
    { name: 'path',        weight: 0.15 },
  ],
  threshold: 0.42,
  distance: 200,
  minMatchCharLength: 2,
  includeScore: true,
  ignoreLocation: true,
}

export default function SearchBar({ onNavigate, isMobile }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [fuseIndex, setFuseIndex] = useState(null)
  const [selected, setSelected] = useState(-1)
  const inputRef = useRef(null)
  const panelRef = useRef(null)
  const wrapperRef = useRef(null)
  const navigate = useNavigate()

  const loadIndex = useCallback(() => {
    axios.get('/api/buscar').then(({ data }) => {
      setFuseIndex(new Fuse(data, fuseOptions))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    loadIndex()
    const interval = setInterval(loadIndex, 60000)
    return () => clearInterval(interval)
  }, [loadIndex])

  useEffect(() => {
    if (!fuseIndex || query.trim().length < 2) { setResults([]); setOpen(false); return }
    const raw = fuseIndex.search(query.trim()).slice(0, 12)
    setResults(raw.map(r => r.item))
    setOpen(true)
    setSelected(-1)
  }, [query, fuseIndex])

  useEffect(() => {
    const handler = (e) => {
      if (!panelRef.current?.contains(e.target) && !inputRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navigateTo = (item) => {
    setQuery(''); setOpen(false)
    if (onNavigate) onNavigate()
    if (item.tipo === 'espacio') navigate(`/espacios/${item.id}`)
    else if (item.tipo === 'estante') navigate(`/estantes/${item.id}`)
    else if (item.tipo === 'caja') navigate(`/cajas/${item.id}`)
    else navigate(`/items/${item.id}`)
  }

  const handleKey = (e) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, -1)) }
    if (e.key === 'Enter' && selected >= 0) navigateTo(results[selected])
    if (e.key === 'Escape') { setOpen(false); setQuery('') }
  }

  const grouped = results.reduce((acc, r) => {
    if (!acc[r.tipo]) acc[r.tipo] = []
    acc[r.tipo].push(r)
    return acc
  }, {})

  const highlight = (text, q) => {
    if (!text || !q) return text
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.split(re).map((part, i) =>
      re.test(part) ? <mark key={i} style={{ backgroundColor: '#2563eb44', color: '#93c5fd', borderRadius: '2px', padding: '0 1px' }}>{part}</mark> : part
    )
  }

  const panelDesktopStyle = {
    position: 'fixed',
    left: '228px',
    top: inputRef.current ? inputRef.current.getBoundingClientRect().bottom + 6 : 80,
    width: '340px',
  }
  const panelMobileStyle = {
    position: 'absolute',
    left: 0,
    top: 'calc(100% + 4px)',
    width: '100%',
  }

  const panelBaseStyle = {
    backgroundColor: '#111827',
    border: '1px solid #374151',
    borderRadius: '0.75rem',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    zIndex: 300,
    overflow: 'hidden',
    maxHeight: '60vh',
    overflowY: 'auto',
  }

  return (
    <div ref={wrapperRef} style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #1f2937', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <svg
          style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: '#4b5563', pointerEvents: 'none' }}
          width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Buscar..."
          style={{
            width: '100%', padding: '0.45rem 0.625rem 0.45rem 2rem',
            fontSize: '0.8rem', color: '#f1f5f9', background: '#1a2332',
            border: '1px solid #374151', borderRadius: '0.5rem', outline: 'none',
            fontFamily: 'inherit', transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => e.target.style.borderColor = '#4b5563'}
          onMouseLeave={e => e.target.style.borderColor = '#374151'}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false) }}
            style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
          >×</button>
        )}
      </div>

      {open && results.length > 0 && (
        <div
          ref={panelRef}
          style={{ ...(isMobile ? panelMobileStyle : panelDesktopStyle), ...panelBaseStyle }}
        >
          {['espacio', 'estante', 'caja', 'item'].map(tipo => {
            const grupo = grouped[tipo]
            if (!grupo) return null
            const meta = TIPO_META[tipo]
            return (
              <div key={tipo}>
                <div style={{ padding: '0.5rem 1rem 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', borderTop: tipo !== 'espacio' ? '1px solid #1f2937' : 'none' }}>
                  {meta.label}s
                </div>
                {grupo.map((item) => {
                  const globalIdx = results.indexOf(item)
                  return (
                    <button
                      key={item.id + tipo}
                      onClick={() => navigateTo(item)}
                      style={{
                        width: '100%', textAlign: 'left', background: selected === globalIdx ? '#1f2937' : 'transparent',
                        border: 'none', padding: '0.6rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1f2937'; setSelected(globalIdx) }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = selected === globalIdx ? '#1f2937' : 'transparent' }}
                    >
                      <div style={{ width: '28px', height: '28px', borderRadius: '0.375rem', backgroundColor: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>
                        {meta.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {highlight(item.nombre, query)}
                        </div>
                        {item.path && (
                          <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.path}
                          </div>
                        )}
                        {item.descripcion && (
                          <div style={{ fontSize: '0.7rem', color: '#4b5563', marginTop: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {highlight(item.descripcion, query)}
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: meta.color, backgroundColor: meta.bg, padding: '0.15rem 0.4rem', borderRadius: '999px', flexShrink: 0 }}>
                        {meta.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          })}

          <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid #1f2937', fontSize: '0.7rem', color: '#374151', display: 'flex', gap: '1rem' }}>
            <span>↑↓ navegar</span><span>↵ abrir</span><span>Esc cerrar</span>
          </div>
        </div>
      )}

      {open && query.trim().length >= 2 && results.length === 0 && (
        <div style={{ ...(isMobile ? panelMobileStyle : { position: 'fixed', left: '228px', top: inputRef.current ? inputRef.current.getBoundingClientRect().bottom + 6 : 80, width: '300px' }), backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.75rem', padding: '1.25rem', textAlign: 'center', color: '#4b5563', fontSize: '0.8rem', zIndex: 300 }}>
          Sin resultados para <strong style={{ color: '#6b7280' }}>"{query}"</strong>
        </div>
      )}
    </div>
  )
}
