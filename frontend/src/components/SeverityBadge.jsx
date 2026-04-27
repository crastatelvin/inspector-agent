// Author: Telvin Crasta | MIT
import { motion } from 'framer-motion';

const SEV_CONFIG = {
  critical: { color: '#ff2d55', label: 'CRITICAL', icon: '🔴' },
  high:     { color: '#ff6b00', label: 'HIGH',     icon: '🟠' },
  medium:   { color: '#ffcc00', label: 'MEDIUM',   icon: '🟡' },
  low:      { color: '#0af',    label: 'LOW',      icon: '🔵' },
  info:     { color: '#00d2d3', label: 'INFO',     icon: '🔵' },
};

export default function SeverityBadge({ severity, animate = false }) {
  const cfg = SEV_CONFIG[severity] || SEV_CONFIG.info;
  return (
    <motion.span
      animate={animate ? { boxShadow: [`0 0 4px ${cfg.color}`, `0 0 12px ${cfg.color}`, `0 0 4px ${cfg.color}`] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
        padding: '0.1rem 0.45rem',
        background: `${cfg.color}15`,
        border: `1px solid ${cfg.color}40`,
        borderRadius: '4px',
        fontSize: '0.6rem', fontWeight: '800', color: cfg.color,
        letterSpacing: '1px', whiteSpace: 'nowrap'
      }}
    >
      {cfg.label}
    </motion.span>
  );
}
