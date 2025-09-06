
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import './AuthModal.css';
import AuthForms from './AuthForms';

function App() {
  const [active, setActive] = useState('Introduction');
  const [openSubmenu, setOpenSubmenu] = useState({});
  const [promptText, setPromptText] = useState('');
  const canvasRef = useRef(null);

  const toggleSub = (key) => setOpenSubmenu(prev => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const onResize = () => {
      drawPolarFromInput(promptText);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [promptText]);

  const [plotUrl, setPlotUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function sanitizeExpression(expr) {
    if (!expr) return null;
    // replace unicode theta with variable name
    expr = expr.replace(/θ/g, 'theta');
    // replace pi symbol
    expr = expr.replace(/π/g, 'Math.PI');
    // caret to exponent
    expr = expr.replace(/\^/g, '**');
    // prefix math functions
    const funcs = ['sin','cos','tan','asin','acos','atan','sqrt','abs','pow','log','exp','max','min'];
    funcs.forEach(fn => {
      const re = new RegExp('\\b' + fn + '\\b', 'g');
      expr = expr.replace(re, 'Math.' + fn);
    });
    // allow 'pi' word
    expr = expr.replace(/\bpi\b/g, 'Math.PI');
    // remove any characters that are obviously unsafe (keep alphanum, Math, operators, parentheses, dot, comma, spaces, asterisk)
    // this is a light sanitization — don't evaluate user-provided code from untrusted sources in production
    if (!/^[0-9a-zA-Z_\s+\-*/().,\*\*MathPI]+$/.test(expr)) {
      // allow Math and common chars — fail if suspicious
      // fallback: still try but caller should handle exceptions
    }
    return expr;
  }

  function drawPolarFromInput(input) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    // handle high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // clear
    ctx.clearRect(0,0,rect.width, rect.height);

    let expr = input || '';
    if (!expr) {
      // nothing to draw
      ctx.fillStyle = '#666';
      ctx.font = '14px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No polar equation provided', rect.width/2, rect.height/2);
      return;
    }

    // extract RHS if 'r=' present
    const parts = expr.split('=');
    if (parts.length > 1) expr = parts.slice(1).join('=');
    expr = expr.trim();
    expr = sanitizeExpression(expr);
    if (!expr) return;

    // create function
    let f;
    try {
      f = new Function('theta', 'return ' + expr + ';');
    } catch (err) {
      ctx.fillStyle = 'red';
      ctx.textAlign = 'center';
      ctx.fillText('Invalid expression', rect.width/2, rect.height/2);
      return;
    }

    // sample points
    const points = [];
    const samples = 1200;
    const thetaMax = Math.PI * 2;
    let maxR = 0;
    for (let i=0;i<=samples;i++){
      const t = thetaMax * i / samples;
      let r;
      try { r = Number(f(t)); } catch(e) { r = NaN; }
      if (!isFinite(r)) r = 0;
      maxR = Math.max(maxR, Math.abs(r));
      points.push({t, r});
    }
    if (maxR === 0) maxR = 1;

    // scale and draw
    const cx = rect.width/2 / dpr;
    const cy = rect.height/2 / dpr;
    const scale = Math.min(rect.width, rect.height) * 0.45 / maxR;

    // draw axes
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(rect.width/dpr, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, rect.height/dpr);
    ctx.stroke();

    // draw curve
    ctx.strokeStyle = '#2b6ef6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i=0;i<points.length;i++){
      const {t,r} = points[i];
      const x = r * Math.cos(t);
      const y = r * Math.sin(t);
      const px = cx + x*scale;
      const py = cy - y*scale;
      if (i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.stroke();
  }

  async function handleSend() {
    setError(null);
    setPlotUrl(null);
    const expr = (promptText || '').trim();
    if (!expr) return;

    setLoading(true);
    try {
      // call backend plot endpoint
      const res = await fetch('http://localhost:5000/plot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expr })
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `${res.status} ${res.statusText}`);
      }

      const j = await res.json();
      if (j.url) {
        // construct absolute URL (assumes backend on localhost:5000)
        const base = 'http://localhost:5000';
        setPlotUrl(base + j.url);
      } else {
        // fallback: try to load image blob if backend returned image directly
        try {
          const blob = await res.blob();
          if (blob.type && blob.type.startsWith('image/')) {
            setPlotUrl(URL.createObjectURL(blob));
          } else {
            throw new Error('Unexpected response format');
          }
        } catch (e) {
          throw new Error('Invalid server response');
        }
      }
    } catch (err) {
      setError(err.message || String(err));
      // also try client-side drawing as fallback
      try { drawPolarFromInput(promptText); } catch (e) { /* ignore */ }
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="app-root">
      <aside className="left-sidebar">
        <div className="section-header">
          <h3>Left Sidebar</h3>
        </div>
        <div className="left-label">Left (20%)</div>
      </aside>

      <main className="main-content">
        <div className="section-header">
          <h3>Main Workspace</h3>
        </div>
        <header className="topbar">
          <div className="title">2D graph interpretation and 3D modeling</div>
          <div className="auth">
            <button className="pill sign-in">Sign In</button>
            <button className="pill sign-up">Sign Up</button>
          </div>
        </header>

        <section className="main-body">
          <div className="center-split">
            <div className="half top-half">
              <div className="half-header"><h4>2D Preview</h4></div>
              <div className="half-content">
                {plotUrl ? (
                  <img src={plotUrl} alt="2D plot" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 6 }} />
                ) : (
                  <canvas ref={canvasRef} className="plot-canvas" />
                )}
              </div>
            </div>

            <div className="half bottom-half">
              <div className="half-header"><h4>3D Model</h4></div>
              <div className="half-content">
                <div className="placeholder">3D model preview will appear here (placeholder)</div>
              </div>
            </div>
          </div>
        </section>

        <div className="input-bar">
          <input
            className="prompt-input"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder={"Type polar eqn, e.g. r=sin(3θ)"}
          />
          <button className="send-btn" onClick={handleSend}>Send</button>
        </div>
      </main>

  <AuthForms />
      <aside className="right-sidebar">
        <div className="section-header">
          <h3>Right Sidebar</h3>
        </div>
        <nav>
          <ul className="menu">
            <li className={`menu-item ${active === 'Home' ? 'active' : ''}`} onClick={() => setActive('Home')}>Home</li>
            <li className={`menu-item ${active === 'Introduction' ? 'active' : ''}`} onClick={() => setActive('Introduction')}>Introduction</li>
            <li className={`menu-item ${active === 'Circles' ? 'active' : ''}`} onClick={() => setActive('Circles')}>Circles</li>
            <li className={`menu-item ${active === 'Cardioids' ? 'active' : ''}`} onClick={() => setActive('Cardioids')}>Cardioids</li>

            <li className={`menu-item submenu-parent ${openSubmenu.Rose ? 'open' : ''}`}>
              <div className="menu-label" onClick={() => toggleSub('Rose')}>Rose Curves</div>
              <ul className={`submenu ${openSubmenu.Rose ? 'open' : ''}`}>
                <li className="submenu-item">k odd</li>
                <li className="submenu-item">k even</li>
              </ul>
            </li>

            <li className={`menu-item ${active === 'Lemniscates' ? 'active' : ''}`} onClick={() => setActive('Lemniscates')}>Lemniscates</li>

            <li className={`menu-item submenu-parent ${openSubmenu.Spirals ? 'open' : ''}`}>
              <div className="menu-label" onClick={() => toggleSub('Spirals')}>Spirals</div>
              <ul className={`submenu ${openSubmenu.Spirals ? 'open' : ''}`}>
                <li className="submenu-item">Archimedean</li>
                <li className="submenu-item">Logarithmic</li>
              </ul>
            </li>

            <li className={`menu-item ${active === 'Conics' ? 'active' : ''}`} onClick={() => setActive('Conics')}>Conics</li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export default App;