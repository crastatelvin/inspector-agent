// Author: Telvin Crasta | CC BY-NC 4.0
import { motion } from 'framer-motion';

const GRADE_COLORS = { A: '#39ff14', B: '#0af', C: '#ffcc00', D: '#ff6b00', F: '#ff2d55' };

export default function ScoreGauge({ score = 0, grade = 'F' }) {
  const color = GRADE_COLORS[grade] || '#ff2d55';
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
      <div style={{ position: 'relative', width: '130px', height: '130px' }}>
        <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r={radius} fill="none"
            stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle
            cx="65" cy="65" r={radius}
            fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
          <motion.circle
            cx="65" cy="65" r={radius}
            fill="none" stroke={color} strokeWidth="14"
            strokeLinecap="round" opacity="0.1"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            style={{ fontSize: '2.5rem', fontWeight: '900', color, lineHeight: 1, textShadow: `0 0 10px ${color}40` }}
          >
            {grade}
          </motion.div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(205,214,244,0.5)', fontWeight: '700' }}>
            {score}/100
          </div>
        </div>
      </div>
    </div>
  );
}
