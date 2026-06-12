import useIsMobile from '../hooks/useIsMobile'

export default function PageHeader({ title, subtitle, action }) {
  const isMobile = useIsMobile()
  return (
    <div style={{
      display: 'flex',
      alignItems: isMobile ? 'flex-start' : 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '0.75rem',
    }}>
      <div>
        <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: '#f9fafb', marginBottom: '0.2rem' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{subtitle}</p>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  )
}
