// Author: Telvin Crasta | CC BY-NC 4.0
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, AlertCircle } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import IssueCard from '../components/IssueCard';
import ReviewSummary from '../components/ReviewSummary';
import IssueFilter from '../components/IssueFilter';
import LanguageBadge from '../components/LanguageBadge';
import useReview from '../hooks/useReview';

export default function ReviewPage() {
  const {
    code, setCode, language, setLanguage,
    reviewing, scanning, result, wsLog, error,
    activeFilter, setActiveFilter,
    filteredIssues, runReview
  } = useReview();

  const latestLog = wsLog[wsLog.length - 1];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column',
      position: 'relative', zIndex: 1, background: '#1e1e2e' }}>

      {/* Header */}
      <header style={{
        padding: '0.8rem 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(205,214,244,0.06)',
        background: 'rgba(30,30,46,0.98)', backdropFilter: 'blur(15px)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div>
            <div style={{ fontSize: '0.55rem', color: 'rgba(0,170,255,0.4)',
              letterSpacing: '5px', marginBottom: '0.1rem', fontWeight: '800' }}>
              PROJECT: INSPECTOR
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '4px',
              color: '#0af', textShadow: '0 0 25px rgba(0,170,255,0.4)', margin: 0 }}>
              INSPECTOR
            </h1>
          </div>
          <AnimatePresence>
            {result && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <LanguageBadge language={result.language} />
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Status Console */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
                {latestLog && (
                <motion.div 
                    key={latestLog.message}
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    style={{ 
                        fontSize: '0.65rem', 
                        color: 'rgba(0,210,211,0.6)', 
                        fontFamily: "'JetBrains Mono', monospace",
                        background: 'rgba(0,0,0,0.3)',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        border: '1px solid rgba(0,210,211,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Terminal size={12} />
                    <span style={{ letterSpacing: '1px' }}>{latestLog.message.toUpperCase()}</span>
                </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            disabled={reviewing}
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(205,214,244,0.1)',
              borderRadius: '6px', padding: '0.4rem 0.8rem',
              color: 'rgba(205,214,244,0.7)', fontSize: '0.7rem',
              outline: 'none', cursor: 'pointer', fontWeight: '700'
            }}
          >
            <option value="">AUTO-DETECT</option>
            {['python','javascript','typescript','java','cpp','go','rust','sql'].map(l => (
              <option key={l} value={l}>{l.toUpperCase()}</option>
            ))}
          </select>

          <motion.button
            whileHover={!reviewing && code.trim() ? { scale: 1.02, boxShadow: '0 0 30px rgba(0,170,255,0.4)' } : {}}
            whileTap={!reviewing && code.trim() ? { scale: 0.98 } : {}}
            onClick={runReview}
            disabled={reviewing || !code.trim()}
            style={{
              background: reviewing ? 'rgba(0,170,255,0.1)'
                : !code.trim() ? 'rgba(30,30,46,1)'
                : 'linear-gradient(135deg, #0af, #00d2d3)',
              border: reviewing ? '1px solid rgba(0,170,255,0.3)' : 'none',
              borderRadius: '6px',
              padding: '0.5rem 1.4rem',
              color: reviewing ? '#0af' : code.trim() ? '#000' : 'rgba(205,214,244,0.1)',
              fontWeight: '900', fontSize: '0.75rem', letterSpacing: '1.5px',
              cursor: reviewing || !code.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              transition: 'all 0.3s ease'
            }}
          >
            {reviewing ? (
              <><motion.div animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'flex' }}><Search size={14} /></motion.div> ANALYZING...</>
            ) : (
                <><Search size={14} /> REVIEW CODE</>
            )}
          </motion.button>
        </div>
      </header>

      {/* Main split layout */}
      <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 480px',
        minHeight: 0, overflow: 'hidden' }}>

        {/* Left — Editor */}
        <div style={{ padding: '1.2rem', overflowY: 'auto',
          borderRight: '1px solid rgba(205,214,244,0.06)', background: 'rgba(0,0,0,0.1)' }}>
          <CodeEditor
            code={code}
            onChange={setCode}
            scanning={scanning}
            language={result?.language || language}
          />
          <AnimatePresence>
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: '1rem', color: '#ff2d55',
                    fontSize: '0.7rem', padding: '0.8rem 1rem',
                    background: 'rgba(255,45,85,0.08)',
                    borderRadius: '8px', border: '1px solid rgba(255,45,85,0.2)',
                    display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '700' }}
                >
                <AlertCircle size={16} /> {error.toUpperCase()}
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right — Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column',
          padding: '1.2rem', overflowY: 'auto', gap: '0.8rem', background: 'rgba(30,30,46,0.3)' }}>

          {/* Results Summary */}
          <AnimatePresence>
            {result && <ReviewSummary result={result} />}
          </AnimatePresence>

          {/* Filters */}
          {result && (
            <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'transparent' }}>
                <IssueFilter
                active={activeFilter}
                onChange={setActiveFilter}
                />
            </div>
          )}

          {/* Issues List */}
          <div style={{ flex: 1 }}>
            <AnimatePresence mode="popLayout">
                {filteredIssues.length > 0 ? (
                <motion.div layout>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(205,214,244,0.25)',
                    letterSpacing: '4px', marginBottom: '1rem', fontWeight: '800' }}>
                    {filteredIssues.length} DETECTED ISSUES
                    </div>
                    {filteredIssues.map((issue, i) => (
                    <IssueCard key={`${issue.title}-${i}`} issue={issue} index={i} />
                    ))}
                </motion.div>
                ) : result ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '4rem 2rem',
                    color: '#39ff14', fontSize: '0.85rem', fontWeight: '700',
                    background: 'rgba(57,255,20,0.03)', borderRadius: '12px', border: '1px dashed rgba(57,255,20,0.1)' }}>
                    ✓ SYSTEM SECURE: NO ISSUES MATCHING FILTER
                </motion.div>
                ) : (
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    style={{ textAlign: 'center', padding: '6rem 2rem',
                    color: 'rgba(205,214,244,0.15)', fontSize: '0.8rem', lineHeight: 2.5,
                    fontFamily: "'JetBrains Mono', monospace" }}
                >
                    {'>'} INITIALIZING INSPECTOR CORE...<br />
                    {'>'} WAITING FOR SOURCE INPUT<br />
                    {'>'} TARGET SCAN READY<br />
                    <motion.span animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}>█</motion.span>
                </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '0.5rem 1.5rem', textAlign: 'center',
        color: 'rgba(205,214,244,0.15)', fontSize: '0.6rem', fontWeight: '700',
        borderTop: '1px solid rgba(205,214,244,0.04)', background: 'rgba(0,0,0,0.2)',
        letterSpacing: '1px' }}>
        INSPECTOR v1.0 • AI-DRIVEN CODE AUDIT • BUILT BY TELVIN CRASTA • CC BY-NC 4.0
      </footer>
    </div>
  );
}
