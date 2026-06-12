const tdStyle = { padding: '0.75rem 1rem', color: '#d1d5db', fontSize: '0.875rem', borderBottom: '1px solid #1f2937' }
const thStyle = { padding: '0.65rem 1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6b7280', backgroundColor: '#111827', borderBottom: '1px solid #374151', textAlign: 'left' }

function SortIcon({ dir }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', marginLeft: '0.35rem', verticalAlign: 'middle', lineHeight: 1, gap: '1px' }}>
      <svg width="8" height="5" viewBox="0 0 8 5" fill={dir === 'asc' ? '#60a5fa' : '#374151'}><path d="M4 0L8 5H0z"/></svg>
      <svg width="8" height="5" viewBox="0 0 8 5" fill={dir === 'desc' ? '#60a5fa' : '#374151'}><path d="M4 5L0 0H8z"/></svg>
    </span>
  )
}

export default function Table({ columns, data, onEdit, onDelete, sortKey, sortDir, onSort }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#4b5563', fontSize: '0.875rem' }}>
        No hay registros para mostrar.
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => {
              const sortable = onSort && col.sortable !== false
              const isActive = sortKey === col.key
              return (
                <th
                  key={col.key}
                  onClick={sortable ? () => onSort(col.key) : undefined}
                  style={{
                    ...thStyle,
                    cursor: sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    color: isActive ? '#93c5fd' : '#6b7280',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={sortable ? e => { if (!isActive) e.currentTarget.style.color = '#9ca3af' } : undefined}
                  onMouseLeave={sortable ? e => { if (!isActive) e.currentTarget.style.color = '#6b7280' } : undefined}
                >
                  {col.label}
                  {sortable && <SortIcon dir={isActive ? sortDir : null} />}
                </th>
              )
            })}
            {(onEdit || onDelete) && (
              <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              style={{ backgroundColor: i % 2 === 0 ? '#1f2937' : '#1a2332' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#263348'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#1f2937' : '#1a2332'}
            >
              {columns.map((col) => (
                <td key={col.key} style={tdStyle}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        style={{ fontSize: '0.8rem', fontWeight: 500, color: '#60a5fa', background: 'none', border: '1px solid #1d4ed833', borderRadius: '0.375rem', padding: '0.25rem 0.75rem', cursor: 'pointer', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed820'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >Editar</button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        style={{ fontSize: '0.8rem', fontWeight: 500, color: '#f87171', background: 'none', border: '1px solid #dc262633', borderRadius: '0.375rem', padding: '0.25rem 0.75rem', cursor: 'pointer', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#dc262620'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >Eliminar</button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
