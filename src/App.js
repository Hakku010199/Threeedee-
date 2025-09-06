
import React, { useState } from 'react';
import './App.css';

function App() {
  const [active, setActive] = useState('Introduction');
  const [openSubmenu, setOpenSubmenu] = useState({});

  const toggleSub = (key) => setOpenSubmenu(prev => ({ ...prev, [key]: !prev[key] }));

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
                <div className="placeholder">Enter polar eqn in the prompt to generate 2D graph (e.g. r=sin(3θ))</div>
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
          <input className="prompt-input" placeholder={"Type polar eqn, e.g. r=sin(3θ)"} />
          <button className="send-btn">Send</button>
        </div>
      </main>

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