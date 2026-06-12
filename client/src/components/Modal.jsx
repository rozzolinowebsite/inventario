import { useEffect } from 'react'
import useIsMobile from '../hooks/useIsMobile'

export default function Modal({ title, onClose, children }) {
  const isMobile = useIsMobile()

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{
        position: 'relative', backgroundColor: '#1f2937',
        borderRadius: isMobile ? '1rem 1rem 0 0' : '0.875rem',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        width: '100%',
        maxWidth: isMobile ? '100%' : '480px',
        margin: isMobile ? '0' : '0 1rem',
        maxHeight: isMobile ? '92vh' : '85vh',
        overflowY: 'auto',
        zIndex: 10,
        border: '1px solid #374151',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.125rem 1.5rem', borderBottom: '1px solid #374151', position: 'sticky', top: 0, backgroundColor: '#1f2937', zIndex: 1 }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f9fafb' }}>{title}</h2>
          <button onClick={onClose} style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: '0.25rem' }}>×</button>
        </div>
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  )
}
