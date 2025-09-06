import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import './AuthModal.css';
import AuthModal from './AuthModal';
import HistorySidebar from "./HistorySidebar";

function App() {
  // Content for the bottom section
  const sectionContent = {
    Introduction: {
      heading: "Introduction",
      text: `A polar function is a mathematical relation expressed in the polar coordinate system, where each point on a plane is represented by two quantities: its distance from the origin, called the radius r, and the angle θ, measured from the positive x-axis. Unlike the Cartesian system, which uses the form y=f(x), polar functions are written as r=f(θ). This form is particularly advantageous for describing curves that exhibit circular, radial, or symmetric properties, many of which are complex or cumbersome to represent in Cartesian coordinates. Conversion between polar and Cartesian systems is straightforward using the transformations x=rcos(θ) and y=rsin(θ). Because of these characteristics, polar functions are widely applied in physics, engineering, computer graphics, and fields where rotational or radial symmetry naturally arises.

Several well-known families of curves can be elegantly represented in polar form:

Circle – One of the simplest curves in polar coordinates, the general form is given by r=a or r=acos(θ), r=asin(θ). For example, r=4 represents a circle of radius 4 centered at the origin, while r=6cos(θ) represents a circle of radius 3 centered at (3, 0).

Cardioid – A heart-shaped curve, expressed as r=a(1+cosθ) or r=a(1+sinθ). For instance, r=1+cosθ generates a cardioid symmetric about the x-axis, whereas r=2(1+sinθ) produces a cardioid symmetric about the y-axis.

Rose Curve – Known for its petal-like structure, the rose curve takes the form r=acos(kθ) or r=asin(kθ). The parameter k determines the number of petals: if k is odd, the number of petals equals k, and if k is even, the number of petals equals 2k. For example, r=cos(3θ) generates a rose with three petals, while r=2sin(4θ) produces a rose with eight petals.

Lemniscate – An infinity-shaped curve (∞), expressed as r²=a²cos(2θ) or r²=a²sin(2θ). The equation r²=cos(2θ) yields a lemniscate aligned along the x-axis, whereas r²=9sin(2θ) gives a lemniscate rotated at 45 degrees.

Spiral Curves – Represent growth or expansion around the pole. Two common forms are the Archimedean spiral, r=a+bθ, and the logarithmic spiral, r=ae^{bθ}. For example, r=θ represents an Archimedean spiral beginning at the pole, while r=2e^{0.2θ} describes a logarithmic spiral that expands outward exponentially.

These families of curves illustrate the power of polar functions in describing a wide range of geometric patterns. Their ability to express symmetry and radial structures makes them indispensable in both theoretical mathematics and practical applications.`
    },
    Circles: {
      heading: "Circles",
      text: "This is a placeholder for Circles. Replace with your own content."
    },
    Cardioids: {
      heading: "Cardioids",
      text: "This is a placeholder for Cardioids. Replace with your own content."
    },
    Rose: {
      heading: "Rose Curves",
      text: "This is a placeholder for Rose Curves. Replace with your own content."
    },
    Lemniscates: {
      heading: "Lemniscates",
      text: "This is a placeholder for Lemniscates. Replace with your own content."
    },
    Spirals: {
      heading: "Spirals",
      text: "This is a placeholder for Spirals. Replace with your own content."
    },
    Conics: {
      heading: "Conics",
      text: "This is a placeholder for Conics. Replace with your own content."
    }
  };
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
    <>
      {/* Auth Modal */}
      <AuthModal open={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} />
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
                <li className="submenu-item" onClick={() => setActive('Rose')}>k odd</li>
                <li className="submenu-item" onClick={() => setActive('Rose')}>k even</li>
              </ul>
            </li>
            <li className={`menu-item ${active === 'Lemniscates' ? 'active' : ''}`} onClick={() => setActive('Lemniscates')}>Lemniscates</li>
            <li className={`menu-item submenu-parent ${openSubmenu.Spirals ? 'open' : ''}`}>
              <div className="menu-label" onClick={() => toggleSub('Spirals')}>Spirals</div>
              <ul className={`submenu ${openSubmenu.Spirals ? 'open' : ''}`}>
                <li className="submenu-item" onClick={() => setActive('Spirals')}>Archimedean</li>
                <li className="submenu-item" onClick={() => setActive('Spirals')}>Logarithmic</li>
              </ul>
            </li>
            <li className={`menu-item ${active === 'Conics' ? 'active' : ''}`} onClick={() => setActive('Conics')}>Conics</li>
          </ul>
        </nav>
      </div>
    </div>
    {/* Content Section Below Main Layout */}
    {active && sectionContent[active] && (
      <div className="content-section fade-in">
        <h2>{sectionContent[active].heading}</h2>
        <p>{sectionContent[active].text}</p>
      </div>
    )}
    </>
  );
}

export default App;
