// Author: Telvin Crasta | CC BY-NC 4.0
import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / 20);
    const drops = Array(cols).fill(0);
    const chars = '01{}[]()<>=+-*/&|!?@#$%^~;:,.';

    let animId;
    const draw = () => {
      ctx.fillStyle = 'rgba(30,30,46,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px JetBrains Mono';
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const brightness = Math.random();
        // Occasionally highlight with primary brand colors
        if (brightness > 0.98) {
            ctx.fillStyle = '#ff2d5540';
        } else if (brightness > 0.95) {
            ctx.fillStyle = '#0af40';
        } else {
            ctx.fillStyle = '#1e1e2e20';
        }
        
        ctx.fillText(char, i * 20, y * 20);
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.3 }} />;
}
