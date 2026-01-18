import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCompare } from '../contexts/CompareContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
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
           Mathi Phone
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
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
            data-testid="theme-toggle-btn"
          >
            {isDark ? '☀️' : '🌙'}
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