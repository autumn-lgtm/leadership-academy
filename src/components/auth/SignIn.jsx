import { useState, useEffect, useRef } from 'react';
import { signInWithMagicLink } from '../../lib/auth';
import { AxonAvatar3D } from '../ui/AxonAvatar';

// Neural network background
function NeuralCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5,
    }));
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,200,255,${0.05 * (1 - d / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,200,255,0.2)';
        ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return (
    <canvas ref={ref} style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  );
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    const err = await signInWithMagicLink(email);
    setLoading(false);
    if (err) {
      setError(err.message || 'Something went wrong. Try again.');
    } else {
      setSent(true);
    }
  };

  const fadeStyle = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050810; }
        @keyframes axon-float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow-pulse {
          0%,100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .submit-btn:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 0 32px rgba(0,200,255,0.45) !important;
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        input:focus { outline: none; border-color: #00C8FF !important; box-shadow: 0 0 0 3px rgba(0,200,255,0.12); }
        @media (max-width: 768px) {
          .split-layout { flex-direction: column !important; }
          .left-panel { width: 100% !important; min-height: 60vh !important; padding: 40px 24px 120px !important; }
          .right-panel { width: 100% !important; padding: 40px 24px !important; }
          .axon-wrap { bottom: -60px !important; }
          .hero-h1 { font-size: 36px !important; }
          .hero-h2 { font-size: 28px !important; }
        }
      `}</style>

      <NeuralCanvas />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', minHeight: '100vh',
        fontFamily: "'DM Sans', sans-serif",
        background: '#050810',
      }} className="split-layout">

        {/* ── LEFT PANEL ── */}
        <div className="left-panel" style={{
          width: '55%', minHeight: '100vh',
          padding: '48px 56px 160px',
          display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden',
          borderRight: '1px solid rgba(255,255,255,0.04)',
        }}>

          {/* Wordmark */}
          <div style={{ ...fadeStyle(0), display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'linear-gradient(135deg, #00C8FF, #B88AFF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 18, color: '#050810',
            }}>N</div>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
              fontSize: 18, color: '#fff', letterSpacing: '-0.02em',
            }}>NeuroLeader</span>
          </div>

          {/* Main content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 40 }}>

            {/* Eyebrow */}
            <div style={{
              ...fadeStyle(100),
              fontSize: 11, fontWeight: 500, letterSpacing: '0.18em',
              color: '#00C8FF', textTransform: 'uppercase', marginBottom: 28,
            }}>
              Leadership Intelligence
            </div>

            {/* Hero headline */}
            <div style={{ marginBottom: 32 }}>
              <h1 className="hero-h1" style={{
                ...fadeStyle(200),
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: 48, lineHeight: 1.05,
                color: '#ffffff', marginBottom: 4,
                letterSpacing: '-0.03em',
              }}>
                The skills that made you
              </h1>
              <h1 className="hero-h1" style={{
                ...fadeStyle(300),
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: 48, lineHeight: 1.05,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(90deg, #B88AFF 0%, #00C8FF 35%, #00E896 65%, #FFB340 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', display: 'inline-block', marginBottom: 16,
              }}>
                excellent at your job
              </h1>
              <h2 className="hero-h2" style={{
                ...fadeStyle(400),
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: 34, lineHeight: 1.15,
                color: 'rgba(255,255,255,0.4)', letterSpacing: '-0.02em',
              }}>
                are not the skills that make you<br />an excellent leader.
              </h2>
            </div>

            {/* Divider */}
            <div style={{
              ...fadeStyle(500),
              height: 1, background: 'rgba(0,200,255,0.2)', marginBottom: 28,
            }} />

            {/* Subline */}
            <div style={{
              ...fadeStyle(600),
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
              fontSize: 20, color: '#fff', marginBottom: 32,
              textShadow: '0 0 30px rgba(0,200,255,0.4)',
            }}>
              NeuroLeader closes that gap.
            </div>

            {/* Proof badges */}
            <div style={{ ...fadeStyle(700), display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'Behavioral Map', color: '#00C8FF' },
                { label: 'Signal Detection', color: '#B88AFF' },
                { label: 'Style Translation', color: '#FFB340' },
              ].map(({ label, color }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 20, padding: '6px 14px',
                  fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Axon emerging from bottom */}
          <div className="axon-wrap" style={{
            ...fadeStyle(900),
            position: 'absolute', bottom: '-12%', left: '8%',
            animation: 'axon-float 4s ease-in-out infinite',
          }}>
            <AxonAvatar3D size={220} mood="wave" />
          </div>

          {/* Axonism near Axon */}
          <div style={{
            ...fadeStyle(1000),
            position: 'absolute', bottom: '8%', left: '38%',
            fontSize: 12, fontStyle: 'italic',
            color: '#FFB340', maxWidth: 200, lineHeight: 1.5,
          }}>
            "The pattern is running. You just have not looked at it yet."
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel" style={{
          width: '45%', minHeight: '100vh',
          background: '#0A0F1E',
          padding: '48px 56px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{ maxWidth: 400 }}>

            {!sent ? (
              <>
                <h2 style={{
                  ...fadeStyle(150),
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: 52, color: '#fff', letterSpacing: '-0.03em',
                  lineHeight: 1.05, marginBottom: 16,
                }}>
                  Take the Map.
                </h2>

                <p style={{
                  ...fadeStyle(250),
                  fontSize: 16, color: 'rgba(255,255,255,0.5)',
                  marginBottom: 40, lineHeight: 1.6,
                }}>
                  Enter your email. We will send you a link to begin.
                </p>

                <form onSubmit={handleSubmit} style={{ ...fadeStyle(350) }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{
                      width: '100%', padding: '16px 20px',
                      background: '#141929',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12, fontSize: 16,
                      color: '#fff', marginBottom: 14,
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />

                  {error && (
                    <p style={{
                      fontSize: 13, color: '#FF6B6B',
                      marginBottom: 12, lineHeight: 1.5,
                    }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="submit-btn"
                    style={{
                      width: '100%', padding: '16px',
                      background: '#00C8FF', color: '#050810',
                      fontFamily: "'Syne', sans-serif", fontWeight: 700,
                      fontSize: 16, borderRadius: 12,
                      border: 'none', cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      marginBottom: 24,
                    }}
                  >
                    {loading ? 'Sending...' : 'Send my link →'}
                  </button>
                </form>

                <div style={{
                  ...fadeStyle(500),
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: 24,
                }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
                    No account needed. No password. Just your email.
                  </p>
                </div>
              </>
            ) : (
              /* Success state */
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(0,232,150,0.1)',
                  border: '1px solid rgba(0,232,150,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M6 14l6 6 10-10" stroke="#00E896" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: 36, color: '#fff', marginBottom: 12,
                  letterSpacing: '-0.02em',
                }}>
                  Check your inbox.
                </h2>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>
                  We sent a link to <strong style={{ color: '#fff' }}>{email}</strong>
                </p>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  background: 'rgba(255,179,64,0.06)',
                  border: '1px solid rgba(255,179,64,0.15)',
                  borderRadius: 12, padding: '16px 18px',
                  textAlign: 'left',
                }}>
                  <AxonAvatar3D size={44} mood="idle" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: '#FFB340', fontStyle: 'italic', lineHeight: 1.6 }}>
                    "That took honesty. Most people answer assessments the way they want to be seen."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
