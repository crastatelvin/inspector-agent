// Author: Telvin Crasta | CC BY-NC 4.0
import Editor from '@monaco-editor/react';
import ScanBeam from './ScanBeam';

export default function CodeEditor({ code, onChange, scanning, language }) {
  
  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Editor header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.7rem 1rem',
        background: 'rgba(30,30,46,0.95)',
        borderBottom: '1px solid rgba(205,214,244,0.06)',
        flexShrink: 0
      }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
          <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c, opacity: 0.8 }} />
        ))}
        <span style={{ fontSize: '0.65rem', color: 'rgba(205,214,244,0.5)', marginLeft: '0.5rem', fontWeight: '600' }}>
          {language?.toUpperCase() || 'AUTO'} • EDITOR
        </span>
      </div>

      {/* Code area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ScanBeam scanning={scanning} />
        <Editor
          height="100%"
          language={language || 'python'}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            roundedSelection: false,
            readOnly: scanning,
            cursorStyle: 'line',
            automaticLayout: true,
            padding: { top: 10, bottom: 10 }
          }}
          loading={<div style={{ color: 'rgba(205,214,244,0.2)', padding: '1rem' }}>Initializing IDE...</div>}
        />
      </div>
    </div>
  );
}
