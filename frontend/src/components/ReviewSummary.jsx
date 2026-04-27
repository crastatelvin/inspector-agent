// Author: Telvin Crasta | CC BY-NC 4.0
import { motion } from 'framer-motion';
import ScoreGauge from './ScoreGauge';

export default function ReviewSummary({ result }) {
  if (!result) return null;

  const counts = result.issue_counts || {};
  const severities = [
    { key: 'critical', color: '#ff2d55', label: 'CRITICAL' },
    { key: 'high', color: '#ff6b00', label: 'HIGH' },
    { key: 'medium', color: '#ffcc00', label: 'MEDIUM' },
    { key: 'low', color: '#0af', label: 'LOW' },
    { key: 'info', color: '#00d2d3', label: 'INFO' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-bright"
      style={{ marginBottom: '1rem', background: 'rgba(30,30,46,0.8)', backdropFilter: 'blur(10px)' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1.5rem',
        alignItems: 'center' }}>
        <ScoreGauge score={result.score} grade={result.grade} />

        <div>
          {/* Language + metrics */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem',
            flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem',
              background: 'rgba(0,170,255,0.1)', border: '1px solid rgba(0,170,255,0.3)',
              borderRadius: '4px', color: '#0af', fontWeight: '800' }}>
              {result.language?.toUpperCase()}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'rgba(205,214,244,0.4)', fontWeight: '600', alignSelf: 'center' }}>
              {result.metrics?.code_lines} lines • {result.metrics?.char_count} chars • ~{result.metrics?.estimated_tokens} tokens
            </span>
          </div>

          {/* Summary */}
          <p style={{ fontSize: '0.85rem', color: 'rgba(205,214,244,0.7)',
            lineHeight: 1.6, marginBottom: '1rem', fontStyle: 'italic' }}>
            "{result.summary}"
          </p>

          {/* Severity breakdown */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {severities.map(s => counts[s.key] > 0 && (
              <div key={s.key} style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.2rem 0.6rem',
                background: `${s.color}10`,
                border: `1px solid ${s.color}30`,
                borderRadius: '4px'
              }}>
                <span style={{ 
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: s.color, display: 'inline-block',
                  boxShadow: `0 0 8px ${s.color}` }} />
                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: s.color }}>
                  {counts[s.key]} {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
