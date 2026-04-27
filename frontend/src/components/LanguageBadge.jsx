// Author: Telvin Crasta | MIT
const LANG_COLORS = {
  python: '#3776ab', javascript: '#f7df1e', typescript: '#3178c6',
  java: '#ed8b00', cpp: '#00599c', go: '#00acd7', rust: '#ce422b',
  sql: '#e38c00', html: '#e34c26', css: '#1572b6', unknown: '#64748b'
};

export default function LanguageBadge({ language }) {
  const color = LANG_COLORS[language?.toLowerCase()] || '#64748b';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.25rem 0.75rem',
      background: `${color}15`,
      border: `1px solid ${color}40`,
      borderRadius: '4px',
      fontSize: '0.7rem', fontWeight: '800', color,
      letterSpacing: '1px'
    }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%',
        background: color, boxShadow: `0 0 8px ${color}` }} />
      {language?.toUpperCase() || 'AUTO'}
    </span>
  );
}
