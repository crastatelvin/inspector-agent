// Author: Telvin Crasta | MIT
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Sparkles, Layout, Lightbulb, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import SeverityBadge from './SeverityBadge';

const CAT_ICONS = {
  security: <Shield size={14} />,
  performance: <Zap size={14} />,
  quality: <Sparkles size={14} />,
  best_practice: <Layout size={14} />,
  suggestion: <Lightbulb size={14} />
};

const SEV_COLORS = {
  critical: '#ff2d55', high: '#ff6b00',
  medium: '#ffcc00', low: '#0af', info: '#00d2d3'
};

export default function IssueCard({ issue, index, onApplyFix }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const color = SEV_COLORS[issue.severity] || '#00d2d3';

  const copyToClipboard = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(issue.fix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        border: `1px solid ${color}20`,
        borderLeft: `4px solid ${color}`,
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '0.7rem',
        background: 'rgba(28,28,46,0.4)',
        backdropFilter: 'blur(5px)'
      }}
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.7rem',
          padding: '0.8rem 1rem',
          cursor: 'pointer',
          background: expanded ? `${color}08` : 'transparent'
        }}
      >
        <span style={{ color: color, flexShrink: 0, display: 'flex' }}>
          {CAT_ICONS[issue.category] || '⚠'}
        </span>
        <span style={{ flex: 1, fontSize: '0.75rem', fontWeight: '700',
          color: '#cdd6f4', overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap' }}>
          {issue.title}
        </span>
        <SeverityBadge severity={issue.severity} />
        {issue.line > 0 && (
          <span style={{ fontSize: '0.6rem', color: 'rgba(205,214,244,0.3)',
            whiteSpace: 'nowrap', fontWeight: '800' }}>
            L{issue.line}
          </span>
        )}
        <span style={{ color: 'rgba(205,214,244,0.2)', flexShrink: 0 }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </div>

      {/* Expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', borderTop: '1px solid rgba(205,214,244,0.05)' }}
          >
            <div style={{ padding: '1rem' }}>
                {/* Description */}
                <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.55rem', color: `${color}80`,
                    letterSpacing: '2px', marginBottom: '0.4rem', fontWeight: '800' }}>
                    ANALYSIS
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(205,214,244,0.8)',
                    lineHeight: 1.6 }}>
                    {issue.description}
                </p>
                </div>

                {/* Fix */}
                {issue.fix && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.55rem', color: '#39ff1480',
                            letterSpacing: '2px', fontWeight: '800' }}>
                            PROPOSED FIX
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                                onClick={copyToClipboard}
                                style={{ background: 'transparent', border: 'none', color: 'rgba(205,214,244,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                                {copied ? <Check size={12} color="#39ff14" /> : <Copy size={12} />}
                                <span style={{ fontSize: '0.6rem' }}>{copied ? 'COPIED' : 'COPY'}</span>
                            </button>
                        </div>
                    </div>
                    <pre style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(57,255,20,0.1)',
                    borderRadius: '6px', padding: '0.8rem',
                    fontSize: '0.72rem', color: '#a6e3a1',
                    overflowX: 'auto', whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word', lineHeight: 1.5,
                    maxHeight: '200px', overflowY: 'auto',
                    fontFamily: "'JetBrains Mono', monospace"
                    }}>
                    {issue.fix}
                    </pre>
                </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
