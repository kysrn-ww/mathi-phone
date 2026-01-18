import React from 'react';

const Hero = () => {
  const scrollToCatalog = () => {
    const catalog = document.getElementById('catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero" id="hero" data-testid="hero-section">
      <div className="hero-content">
        <h1 className="hero-title" data-testid="hero-title">Mathi Phone</h1>
        <p className="hero-subtitle" data-testid="hero-subtitle">
          Tu tienda Apple premium. Descubre la colección completa de dispositivos con la mejor calidad y precio.
        </p>
        <button 
          className="cta-button" 
          onClick={scrollToCatalog}
          data-testid="hero-cta-button"
        >
          Explorar Productos
        </button>
      </div>
      
      <div className="hero-gradient"></div>
    </section>
  );
};

export default Hero;