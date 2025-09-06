import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import './AuthModal.css';
import AuthModal from './AuthModal';
import HistorySidebar from "./HistorySidebar";

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [active, setActive] = useState('Introduction');
  const [openSubmenu, setOpenSubmenu] = useState({});
  const [promptText, setPromptText] = useState('');
  const canvasRef = useRef(null);
    const [history, setHistory] = useState([]);
    const [activeHistoryIdx, setActiveHistoryIdx] = useState(-1);

  const toggleSub = (key) => setOpenSubmenu(prev => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const onResize = () => {
  // drawPolarFromInput(promptText); // Removed: function not defined
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [promptText]);

  const [plotUrl, setPlotUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ FIXED sanitizeExpression
  function sanitizeExpression(expr) {
    if (!expr) return null;
    expr = expr.replace(/θ/g, 'theta'); // replace unicode theta
    expr = expr.replace(/π/g, 'Math.PI'); // replace pi
    expr = expr.replace(/\^/g, '**'); // caret → exponent

    const funcs = [
      'sin','cos','tan','asin','acos','atan',
      'sqrt','abs','pow','log','exp','max','min'
    ];
    funcs.forEach(fn => {
      const re = new RegExp('\\b' + fn + '\\b', 'g');
      expr = expr.replace(re, 'Math.' + fn);
    });

    return expr; // ✅ only return string
  }

  async function handleSend() {
    setError(null);
    setPlotUrl(null);
    const expr = (promptText || '').trim();
    if (!expr) return;

  // Add to history
  setHistory(prev => [...prev, expr]);
  setActiveHistoryIdx(history.length);

    setLoading(true);
    try {
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
        const base = 'http://localhost:5000';
        setPlotUrl(base + j.url);
      } else {
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
  // try { drawPolarFromInput(promptText); } catch (e) { /* ignore */ } // Removed: function not defined
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-root">
      {/* Left Sidebar */}
  <div className="left-sidebar" style={{background: '#000', color: '#fff'}}>
  <div style={{padding: '16px', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem'}}>Your Graphs</div>
        <div style={{overflowY: 'auto', height: 'calc(100vh - 60px)'}}>
          {history.length === 0 ? (
            <div style={{color: '#bbb', padding: '12px 16px'}}>No history yet.</div>
          ) : (
            history.map((item, idx) => (
              <div key={idx} style={{color: '#eee', padding: '8px 16px'}}>
                {idx + 1}. {item}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <main className="main-content">
        <div className="section-header">
          <h3>2D graph interpretation and 3D modeling</h3>
        </div>

        <header className="topbar" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          {/* Empty or title can go here if needed */}
          <div></div>
          <div className="auth" style={{display: 'flex', gap: '12px'}}>
            <button className="pill sign-in" onClick={() => { setAuthMode('login'); setAuthOpen(true); }}>Sign In</button>
            <button className="pill sign-up" onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}>Sign Up</button>
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


      {/* Right Sidebar */}
      <div className="right-sidebar">
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
      </div>
    </div>
  );
}

export default App;
