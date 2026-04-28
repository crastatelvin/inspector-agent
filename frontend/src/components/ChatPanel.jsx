// Author: Telvin Crasta | MIT
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';

export default function ChatPanel({ isOpen, onClose, history, onSendMessage, isSending, code, language }) {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = () => {
    if (!input.trim() || isSending) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'fixed', right: 0, top: 0, bottom: 0, width: '380px',
            background: 'rgba(30,30,46,0.98)', backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(0,170,255,0.2)',
            zIndex: 100, display: 'flex', flexDirection: 'column',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.2rem', borderBottom: '1px solid rgba(205,214,244,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', 
                background: 'linear-gradient(135deg, #0af, #00d2d3)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(0,170,255,0.6)', letterSpacing: '2px', fontWeight: '800' }}>
                  AI COMPANION
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#cdd6f4' }}>
                  INSPECTOR CHAT
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(205,214,244,0.4)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            style={{ flex: 1, overflowY: 'auto', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {history.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '4rem', color: 'rgba(205,214,244,0.2)' }}>
                    <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.1 }} />
                    <p style={{ fontSize: '0.8rem', fontWeight: '500' }}>Ask me anything about your code.<br/>I'm context-aware.</p>
                </div>
            )}
            {history.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ 
                    padding: '0.8rem 1rem', 
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    background: msg.role === 'user' ? 'rgba(0,170,255,0.1)' : 'rgba(205,214,244,0.05)',
                    border: msg.role === 'user' ? '1px solid rgba(0,170,255,0.2)' : '1px solid rgba(205,214,244,0.05)',
                    color: msg.role === 'user' ? '#0af' : '#cdd6f4',
                    borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                    borderBottomLeftRadius: msg.role === 'assistant' ? '2px' : '12px',
                    whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(205,214,244,0.2)', fontWeight: '700', textTransform: 'uppercase' }}>
                  {msg.role === 'user' ? 'YOU' : 'INSPECTOR'}
                </div>
              </motion.div>
            ))}
            {isSending && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'rgba(0,170,255,0.5)' }}>
                    <Loader2 size={14} className="animate-spin" />
                    <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>INSPECTOR IS THINKING...</span>
                </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '1.2rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(205,214,244,0.06)' }}>
            <div style={{ position: 'relative' }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask a question..."
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(205,214,244,0.1)',
                  borderRadius: '12px', padding: '0.8rem 2.8rem 0.8rem 1rem', color: '#cdd6f4', fontSize: '0.85rem',
                  outline: 'none', resize: 'none', height: '80px', fontFamily: 'inherit', transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(0,170,255,0.4)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(205,214,244,0.1)'}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isSending}
                style={{
                  position: 'absolute', right: '0.8rem', bottom: '0.8rem',
                  background: input.trim() ? '#0af' : 'rgba(205,214,244,0.05)',
                  border: 'none', borderRadius: '8px', width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: input.trim() ? '#000' : 'rgba(205,214,244,0.2)',
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                <Send size={16} />
              </button>
            </div>
            <div style={{ marginTop: '0.8rem', fontSize: '0.55rem', color: 'rgba(205,214,244,0.2)', textAlign: 'center', fontWeight: '700' }}>
              PRESS ENTER TO SEND • SHIFT+ENTER FOR NEW LINE
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
