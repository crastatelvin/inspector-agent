// Author: Telvin Crasta | MIT
import { motion } from 'framer-motion';

export default function ScanBeam({ scanning }) {
  if (!scanning) return null;
  return (
    <motion.div
      initial={{ top: '0%' }}
      animate={{ top: ['0%', '100%', '0%'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', left: 0, right: 0, height: '4px', zIndex: 100,
        background: 'linear-gradient(90deg, transparent, #0af, #39ff14, #0af, transparent)',
        boxShadow: '0 0 20px #0af, 0 0 40px rgba(0,170,255,0.4)',
        pointerEvents: 'none'
      }}
    />
  );
}
