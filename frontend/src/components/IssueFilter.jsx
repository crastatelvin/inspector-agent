// Author: Telvin Crasta | CC BY-NC 4.0
export default function IssueFilter({ active, onChange }) {
  const filters = [
    { id: 'all', label: 'ALL', color: '#cdd6f4' },
    { id: 'critical', label: 'CRITICAL', color: '#ff2d55' },
    { id: 'high', label: 'HIGH', color: '#ff6b00' },
    { id: 'security', label: 'SECURITY', color: '#ff2d55' },
    { id: 'performance', label: 'PERF', color: '#ff6b00' },
    { id: 'quality', label: 'QUALITY', color: '#ffcc00' },
    { id: 'suggestion', label: 'SUGGEST', color: '#00d2d3' },
  ];

  return (
    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap',
      marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px' }}>
      {filters.map(f => (
        <button key={f.id} onClick={() => onChange(f.id)} style={{
          background: active === f.id ? `${f.color}20` : 'transparent',
          border: `1px solid ${active === f.id ? f.color : 'rgba(205,214,244,0.05)'}`,
          color: active === f.id ? f.color : 'rgba(205,214,244,0.3)',
          padding: '0.3rem 0.7rem', borderRadius: '4px', cursor: 'pointer',
          fontSize: '0.6rem', fontWeight: '800', letterSpacing: '1px', transition: 'all 0.2s',
          outline: 'none'
        }}>
          {f.label}
        </button>
      ))}
    </div>
  );
}
