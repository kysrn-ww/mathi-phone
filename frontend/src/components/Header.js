import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCompare } from '../contexts/CompareContext';
import { useNavigate } from 'react-router-dom';
import { Snowflake } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { showSnow, toggleSnow } = useTheme();
  const { compareList } = useCompare();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`} data-testid="main-header">
      <nav className="nav-container">
        <div className="logo" onClick={() => navigate('/')} data-testid="logo">
          Mathi Ph<svg viewBox="0 0 24 24" fill="currentColor" className="apple-logo-purple"><path d="M17.05 20.28c-.96.95-2.04 1.9-3.26 1.9-1.2 0-1.59-.73-3.01-.73-1.43 0-1.87.71-3.01.73-1.18.02-2.42-1.05-3.38-2.01-1.96-1.96-3.41-5.54-3.41-8.63 0-5.1 3.31-7.79 6.45-7.79 1.64 0 3.09.99 4.01.99.91 0 2.64-1.19 4.56-1.19 1.05 0 3.99.38 5.61 2.76-.13.08-3.35 1.95-3.35 5.8 0 4.6 4.02 6.22 4.07 6.24-.03.09-.64 2.19-2.14 4.38-.65.95-1.33 1.9-2.4 1.9-1.07 0-1.37-.65-2.6-.65-1.23 0-1.58.65-2.6.65-1.02 0-1.74-.95-2.39-1.9zM15.48 2c.9-1.09 1.5-2.61 1.33-4.12-1.3.05-2.87.86-3.8 1.95-.84.97-1.58 2.53-1.38 4 1.45.11 2.94-.74 3.85-1.83z" /></svg>ne
        </div>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`} data-testid="nav-links">
          <li><button onClick={() => scrollToSection('hero')} data-testid="nav-home">Inicio</button></li>
          <li><button onClick={() => scrollToSection('categories')} data-testid="nav-categories">Categorías</button></li>
          <li><button onClick={() => scrollToSection('catalog')} data-testid="nav-catalog">Productos</button></li>
          <li><button onClick={() => scrollToSection('contact')} data-testid="nav-contact">Contacto</button></li>
          <li>
            <button
              onClick={() => navigate('/compare')}
              className="compare-btn"
              data-testid="nav-compare-btn"
            >
              🔄 Comparar ({compareList.length})
            </button>
          </li>
        </ul>

        <div className="header-actions">
          <button
            className={`theme-toggle ${showSnow ? 'active' : ''}`}
            onClick={toggleSnow}
            aria-label="Toggle snow"
            data-testid="theme-toggle-btn"
            title={showSnow ? "Desactivar nieve" : "Activar nieve"}
          >
            <Snowflake size={20} color={showSnow ? "#0071e3" : "#86868b"} />
          </button>

          <div
            className={`menu-toggle ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="menu-toggle"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;