import { useState, useEffect, useRef } from 'react';
import { signInWithMagicLink } from '../../lib/auth';
import AxonMascot from '../simulator/AxonMascot';

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
                The technical skills
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
                that got you promoted
              </h1>
              <h2 className="hero-h2" style={{
                ...fadeStyle(400),
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: 34, lineHeight: 1.15,
                color: 'rgba(255,255,255,0.4)', letterSpacing: '-0.02em',
              }}>
                are not the skills that<br />make you a great leader.
              </h2>
            </div>

            {/* Divider */}
            <div style={{
              ...fadeStyle(500),
              height: 1, background: 'rgba(0,200,255,0.2)', marginBottom: 28,
            }} />

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

          {/* ── Axon zone ── */}

          {/* "Closes the gap" label — sits just above Axon */}
          <div style={{
            ...fadeStyle(1600),
            position: 'absolute', bottom: '18%', left: '6%',
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: 13, color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            NeuroLeader closes that gap.
          </div>

          {/* Speech bubble quote — floats right of Axon */}
          <div style={{
            ...fadeStyle(2000),
            position: 'absolute', bottom: '22%', left: '44%',
            maxWidth: 200,
          }}>
            <div style={{
              background: 'rgba(255,179,64,0.08)',
              border: '1px solid rgba(255,179,64,0.2)',
              borderRadius: 12,
              borderBottomLeftRadius: 4,
              padding: '10px 14px',
            }}>
              <p style={{
                margin: 0, fontSize: 12, fontStyle: 'italic',
                color: '#FFB340', lineHeight: 1.6,
              }}>
                "The expertise that made you excellent is now the thing you have to lead through, not with."
              </p>
            </div>
            {/* Tail pointing left toward Axon */}
            <div style={{
              width: 8, height: 8,
              background: 'rgba(255,179,64,0.08)',
              border: '1px solid rgba(255,179,64,0.2)',
              borderTop: 'none', borderRight: 'none',
              transform: 'rotate(-45deg)',
              marginTop: -5, marginLeft: 10,
            }} />
          </div>

          {/* Axon + neuron burst */}
          <div className="axon-wrap" style={{
            ...fadeStyle(900),
            position: 'absolute', bottom: '-30%', left: '0%',
          }}>
            {/* Neuron particles */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {[
                { color: '#00C8FF', x: '62%', y: '12%', size: 7, delay: '0s',   dur: '2.8s' },
                { color: '#B88AFF', x: '78%', y: '30%', size: 5, delay: '0.4s', dur: '3.2s' },
                { color: '#00E896', x: '82%', y: '52%', size: 6, delay: '0.8s', dur: '2.5s' },
                { color: '#FFB340', x: '72%', y: '70%', size: 4, delay: '1.1s', dur: '3.6s' },
                { color: '#FF6B6B', x: '18%', y: '16%', size: 5, delay: '0.2s', dur: '3.0s' },
                { color: '#00C8FF', x: '8%',  y: '40%', size: 4, delay: '0.6s', dur: '2.6s' },
                { color: '#B88AFF', x: '12%', y: '62%', size: 7, delay: '1.4s', dur: '3.4s' },
                { color: '#00E896', x: '48%', y: '6%',  size: 5, delay: '0.9s', dur: '2.9s' },
                { color: '#FFB340', x: '88%', y: '18%', size: 4, delay: '0.3s', dur: '3.1s' },
                { color: '#FF6B6B', x: '28%', y: '78%', size: 6, delay: '1.6s', dur: '2.7s' },
              ].map((p, i) => (
                <div key={i} style={{
                  position: 'absolute', left: p.x, top: p.y,
                  width: p.size, height: p.size, borderRadius: '50%',
                  background: p.color, boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                  animation: `neuron-pulse ${p.dur} ${p.delay} ease-in-out infinite`,
                }} />
              ))}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.2 }}>
                <line x1="62%" y1="12%" x2="78%" y2="30%" stroke="#00C8FF" strokeWidth="0.8" />
                <line x1="78%" y1="30%" x2="82%" y2="52%" stroke="#B88AFF" strokeWidth="0.8" />
                <line x1="18%" y1="16%" x2="8%"  y2="40%" stroke="#FF6B6B" strokeWidth="0.8" />
                <line x1="8%"  y1="40%" x2="12%" y2="62%" stroke="#B88AFF" strokeWidth="0.8" />
                <line x1="48%" y1="6%"  x2="62%" y2="12%" stroke="#00E896" strokeWidth="0.8" />
              </svg>
            </div>
            <AxonMascot size={260} mood="wave" showQuip={false} entrance="portal" />
          </div>

          <style>{`
            @keyframes neuron-pulse {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.6); }
            }
          `}</style>
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
                  textAlign: 'left',
                }}>
                  <div style={{ width: 64, flexShrink: 0 }}>
                  <AxonMascot size={64} mood="wave" showQuip={false} entrance="none" />
                </div>
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
