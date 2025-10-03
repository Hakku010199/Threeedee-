import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import './AuthModal.css';
import AuthModal from './AuthModal';
import HistorySidebar from "./HistorySidebar";
import ThreeDModel from './ThreeDModel'; 

function App() {
  // Content for the bottom section
  const sectionContent = {
    Home: {
      heading: "Welcome to Polar Function Visualizer",
      text: "Select a topic from the menu to learn more about polar functions and their mathematical properties."
    },
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
      text: `A circle is one of the simplest and most fundamental shapes in mathematics, and its representation in polar coordinates is particularly elegant. In the polar system, a circle centered at the origin is described by the equation r = a, where a is the radius. Every point on the circle is at a constant distance from the origin, regardless of the angle θ.

Circles can also be represented with their centers offset from the origin using equations like r = a·cos(θ) or r = a·sin(θ). For example:
• r = 4 describes a circle of radius 4 centered at the origin.
• r = 6·cos(θ) describes a circle of radius 3 centered at (3, 0).
• r = 6·sin(θ) describes a circle of radius 3 centered at (0, 3).

These forms are derived from the relationships between polar and Cartesian coordinates:
• x = r·cos(θ)
• y = r·sin(θ)

Circles are foundational in geometry and appear in countless applications, from engineering and physics to computer graphics and natural phenomena. Their symmetry and simplicity make them a key starting point for exploring more complex polar curves.`
    },
    Cardioids: {
      heading: "Cardioids",
      text: `A cardioid is a heart-shaped curve that appears frequently in mathematics and physics, especially in the study of acoustics and optics. In polar coordinates, a cardioid is described by the equation r = a(1 + cosθ) or r = a(1 + sinθ), where a is a constant that determines the size of the cardioid.

The curve is symmetric about the x-axis for r = a(1 + cosθ) and about the y-axis for r = a(1 + sinθ). The cardioid has a cusp at the pole (origin) and a maximum radius of 2a. Its unique shape makes it useful for modeling phenomena such as sound wave patterns and antenna radiation.

Cardioids are a special case of the limaçon family of curves and are notable for their simple yet elegant polar equations.`
    },
    Rose: {
      heading: "Rose Curves",
      text: `Rose curves are a family of mathematical curves that produce petal-like patterns. Their general polar form is r = a·cos(kθ) or r = a·sin(kθ), where a determines the size and k determines the number of petals.

If k is odd, the curve has k petals; if k is even, it has 2k petals. For example, r = cos(3θ) creates a three-petaled rose, while r = 2·sin(4θ) creates an eight-petaled rose.

Rose curves are visually striking and are often used to demonstrate the beauty and symmetry of polar equations. They are also studied in the context of harmonic motion and signal processing.`
    },
    Lemniscates: {
      heading: "Lemniscates",
      text: `A lemniscate is a figure-eight or infinity-shaped curve. In polar coordinates, the most common forms are r² = a²·cos(2θ) and r² = a²·sin(2θ), where a controls the size of the lemniscate.

The lemniscate of Bernoulli (r² = a²·cos(2θ)) is aligned along the x-axis, while r² = a²·sin(2θ) is rotated by 45 degrees. These curves are important in complex analysis and have applications in physics, engineering, and the study of elliptic functions.

Lemniscates are notable for their symmetry and their appearance in various natural and mathematical contexts.`
    },
    Spirals: {
      heading: "Spirals",
      text: `Spirals are curves that wind around a central point, getting progressively farther away as they revolve. In polar coordinates, two common types are the Archimedean spiral (r = a + bθ) and the logarithmic spiral (r = a·e^{bθ}).

The Archimedean spiral increases linearly with θ, resulting in equally spaced turns. The logarithmic spiral increases exponentially, so the spacing between turns grows rapidly. Spirals are found in nature (such as in shells and galaxies), engineering, and art.

Their mathematical properties make them useful for modeling growth, waves, and rotational motion.`
    },
    Conics: {
      heading: "Conics",
      text: `Conic sections (or conics) are curves obtained by intersecting a plane with a cone. In polar coordinates, the general equation for a conic section with the focus at the pole is r = (e·d)/(1 + e·cosθ), where e is the eccentricity and d is the distance from the directrix to the pole.

Depending on the value of e, the conic can be a circle (e = 0), ellipse (0 < e < 1), parabola (e = 1), or hyperbola (e > 1). Conics are fundamental in geometry, astronomy, and physics, describing planetary orbits, reflective properties, and more.

Their polar representation highlights the relationship between distance and angle, making them especially useful in orbital mechanics and optics.`
    }
  };
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [active, setActive] = useState('Home');
  const contentRef = useRef(null);
  // Username state (simulate login for now)
  const [username, setUsername] = useState('just-hakku'); // Replace with null if you want to hide by default

  // Scroll to content section if not in view when active changes
  useEffect(() => {
    if (contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [active]);
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
  const [redDivColor, setRedDivColor] = useState('#dc3545');
  const [threeDPrompt, setThreeDPrompt] = useState('');
  const [show3DModel, setShow3DModel] = useState(false);

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

  // Add to history (latest on top)
  setHistory(prev => [expr, ...prev]);
  setActiveHistoryIdx(0);

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

  // Function to handle 3D view generation
  const handle3DView = () => {
    const prompt = document.getElementById('3dprompt').value.trim();
    if (!prompt) {
      alert('Please enter a polar equation');
      return;
    }
    
    setThreeDPrompt(prompt);
    setShow3DModel(true);
    setRedDivColor('#000000');
    console.log('Generating 3D model for:', prompt);
  };

  return (
    <>
      {/* Auth Modal */}
      <AuthModal open={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} />
      <div className="app-root">
      {/* Left Sidebar */}
      <div className="left-sidebar" style={{background: '#000', color: '#fff'}}>
        {username && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '16px 16px 8px 16px',
            color: '#b3e5fc',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#222',
              marginRight: 8,
              fontSize: 18
            }}>
              <span role="img" aria-label="user">👤</span>
            </span>
            {username}
          </div>
        )}
        <div style={{padding: '0 16px 12px 16px', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem'}}>Your Graphs</div>
        <div style={{overflowY: 'auto', height: 'calc(100vh - 60px)'}}>
          {history.length === 0 ? (
            <div style={{color: '#bbb', padding: '12px 16px'}}>No history yet.</div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                style={{
                  color: '#eee',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #222'
                }}
              >
                <span>
                  {idx + 1}. {item}
                </span>
                <span style={{display: 'flex', gap: 8}}>
                  {/* Font Awesome Load (Upload) Icon with tooltip */}
                  <button
                    title="Load"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4fc3f7',
                      cursor: 'pointer',
                      fontSize: 20,
                      padding: 0,
                      position: 'relative'
                    }}
                    onClick={() => {
                      setPromptText(item);
                      setError(null);
                      setPlotUrl(null);
                      setLoading(true);
                      fetch('http://localhost:5000/plot', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ expr: item })
                      })
                        .then(res => {
                          if (!res.ok) return res.json().then(j => { throw new Error(j.error || `${res.status} ${res.statusText}`); });
                          return res.json();
                        })
                        .then(j => {
                          if (j.url) {
                            const base = 'http://localhost:5000';
                            setPlotUrl(base + j.url);
                          }
                        })
                        .catch(err => setError(err.message || String(err)))
                        .finally(() => setLoading(false));
                    }}
                    onMouseEnter={e => {
                      const tooltip = document.createElement('span');
                      tooltip.textContent = 'Load';
                      tooltip.style.position = 'absolute';
                      tooltip.style.bottom = '-24px';
                      tooltip.style.left = '50%';
                      tooltip.style.transform = 'translateX(-50%)';
                      tooltip.style.background = '#222';
                      tooltip.style.color = '#fff';
                      tooltip.style.padding = '2px 8px';
                      tooltip.style.borderRadius = '4px';
                      tooltip.style.fontSize = '0.85rem';
                      tooltip.style.whiteSpace = 'nowrap';
                      tooltip.className = 'history-tooltip';
                      e.currentTarget.appendChild(tooltip);
                    }}
                    onMouseLeave={e => {
                      const tooltip = e.currentTarget.querySelector('.history-tooltip');
                      if (tooltip) e.currentTarget.removeChild(tooltip);
                    }}
                  >
                    <i className="fa-solid fa-arrow-up-from-bracket"></i>
                  </button>
                  {/* Font Awesome Delete Icon */}
                  <button
                    title="Delete"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff5252',
                      cursor: 'pointer',
                      fontSize: 20,
                      padding: 0
                    }}
                    onClick={() => {
                      setHistory(prev => prev.filter((_, i) => i !== idx));
                    }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <main className="main-content">
        <div className="section-header">
          <h3 style={{
            fontFamily: 'Castellar, serif',
            fontWeight: 'bold',
            letterSpacing: '2px',
            fontSize: '2rem',
            color: '#222',
            textShadow: '1px 1px 2px #bbb'
          }}>
            2D graph interpretation and 3D modeling
          </h3>
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
            <div className="single-preview">
              <div className="half-header"><h4>2D Preview</h4></div>
              <div className="half-content">
                {plotUrl ? (
                  <img src={plotUrl} alt="2D plot" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 6 }} />
                ) : (
                  <canvas ref={canvasRef} className="plot-canvas" />
                )}
                {/* Show 3D model for rose curves and cardioids */}
                {promptText.match(
                  /r\s*=\s*[0-9.]+\s*\*\s*sin\(\s*[0-9]+θ\s*\)|r\s*=\s*[0-9.]+\s*\*\s*\(\s*1\s*\+\s*(sin|cos)\(\s*θ\s*\)\s*\)|r\s*=\s*[0-9.]+\s*\+\s*(sin|cos)\(\s*θ\s*\)|r\s*=\s*[0-9.]+\s*\+\s*[0-9.]+\s*\*\s*(sin|cos)\(\s*θ\s*\)/i
                ) ? (
                  <ThreeDModel expr={promptText} />
                ) : (
                  <div className="placeholder"></div>
                )}
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
          </ul>
        </nav>
      </div>
    </div>

    {/* Single 3D Placeholder - Only show when Home is active */}
    {active === 'Home' && (
      <div id="3d" style={{
        height: '1000px',
        width: '100%',
        backgroundColor: redDivColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '4rem',
        fontWeight: 'bold',
        margin: '20px 0',
        border: '5px solid #fff',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}>
        {show3DModel && threeDPrompt ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ThreeDModel expr={threeDPrompt} />
          </div>
        ) : (
          '3D'
        )}
      </div>
    )}

    {/* Prompt Box with View Button - Only show when Home is active */}
    {active === 'Home' && (
      <div style={{
        width: '100%',
        padding: '20px',
        margin: '20px 0',
        backgroundColor: '#f8f9fc',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(30,30,60,0.07)',
        border: '1px solid #e0e8ff'
      }}>
        <div style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <input
            id="3dprompt"
            type="text"
            placeholder="Enter polar equation (e.g., r=2*sin(4θ), r=1*(1+cos(θ)))"
            value={threeDPrompt}
            onChange={(e) => setThreeDPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handle3DView();
              }
            }}
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '1rem',
              border: '2px solid #ddd',
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              backgroundColor: 'white'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          <button
            id="view"
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'white',
              backgroundColor: '#667eea',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#5a6fd8';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#667eea';
              e.target.style.transform = 'translateY(0)';
            }}
            onClick={handle3DView}
          >
            View
          </button>
        </div>
        
        {/* Example equations */}
        <div style={{
          marginTop: '15px',
          fontSize: '0.9rem',
          color: '#666',
          textAlign: 'center'
        }}>
          <strong>Examples:</strong> r=2*sin(4θ) | r=1*(1+cos(θ)) | r=3+2*sin(θ) | r=1*sin(3θ)
        </div>
      </div>
    )}

    {/* Content Section Below Introduction Area */}
    {sectionContent[active] && active !== 'Home' && (
      <div
        ref={contentRef}
        className="content-section fade-in"
        style={{
          width: '100%',
          maxWidth: '100%',
          margin: '24px 0 0 0',
          background: '#f9f9fc',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(30,30,60,0.07)',
          textAlign: 'left'
        }}
      >
        <h2 style={{ textAlign: 'left' }}>{sectionContent[active].heading}</h2>
        {active === 'Introduction' ? (
          <div style={{ textAlign: 'left' }}>
            <p>
              A polar function is a mathematical relation expressed in the polar coordinate system, where each point on a plane is represented by two quantities: its distance from the origin, called the radius <b>r</b>, and the angle <b>θ</b>, measured from the positive x-axis. Unlike the Cartesian system, which uses the form <b>y=f(x)</b>, polar functions are written as <b>r=f(θ)</b>. This form is particularly advantageous for describing curves that exhibit circular, radial, or symmetric properties, many of which are complex or cumbersome to represent in Cartesian coordinates. Conversion between polar and Cartesian systems is straightforward using the transformations <b>x=r·cos(θ)</b> and <b>y=r·sin(θ)</b>. Because of these characteristics, polar functions are widely applied in physics, engineering, computer graphics, and fields where rotational or radial symmetry naturally arises.
            </p>
            <p>Several well-known families of curves can be elegantly represented in polar form:</p>
            <ol style={{ marginLeft: 24 }}>
              <li>
                <b>Circle</b> – One of the simplest curves in polar coordinates, the general form is given by <b>r=a</b> or <b>r=a·cos(θ)</b>, <b>r=a·sin(θ)</b>. For example, <b>r=4</b> represents a circle of radius 4 centered at the origin, while <b>r=6·cos(θ)</b> represents a circle of radius 3 centered at (3, 0).
              </li>
              <li>
                <b>Cardioid</b> – A heart-shaped curve, expressed as <b>r=a(1+cosθ)</b> or <b>r=a(1+sinθ)</b>. For instance, <b>r=1+cosθ</b> generates a cardioid symmetric about the x-axis, whereas <b>r=2(1+sinθ)</b> produces a cardioid symmetric about the y-axis.
              </li>
              <li>
                <b>Rose Curve</b> – Known for its petal-like structure, the rose curve takes the form <b>r=a·cos(kθ)</b> or <b>r=a·sin(kθ)</b>. The parameter <b>k</b> determines the number of petals: if <b>k</b> is odd, the number of petals equals <b>k</b>, and if <b>k</b> is even, the number of petals equals <b>2k</b>. For example, <b>r=cos(3θ)</b> generates a rose with three petals, while <b>r=2·sin(4θ)</b> produces a rose with eight petals.
              </li>
              <li>
                <b>Lemniscate</b> – An infinity-shaped curve (∞), expressed as <b>r²=a²·cos(2θ)</b> or <b>r²=a²·sin(2θ)</b>. The equation <b>r²=cos(2θ)</b> yields a lemniscate aligned along the x-axis, whereas <b>r²=9·sin(2θ)</b> gives a lemniscate rotated at 45 degrees.
              </li>
              <li>
                <b>Spiral Curves</b> – Represent growth or expansion around the pole. Two common forms are the Archimedean spiral, <b>r=a+bθ</b>, and the logarithmic spiral, <b>r=ae<sup>bθ</sup></b>. For example, <b>r=θ</b> represents an Archimedean spiral beginning at the pole, while <b>r=2e<sup>0.2θ</sup></b> describes a logarithmic spiral that expands outward exponentially.
              </li>
            </ol>
            <p>
              These families of curves illustrate the power of polar functions in describing a wide range of geometric patterns. Their ability to express symmetry and radial structures makes them indispensable in both theoretical mathematics and practical applications.
            </p>
          </div>
        ) : (
          <p>{sectionContent[active].text}</p>
        )}
      </div>
    )}
    </>
  );
}

export default App;
