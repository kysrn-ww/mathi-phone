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
        <h1 className="hero-title" data-testid="hero-title">
          Mathi Ph<svg viewBox="0 0 24 24" fill="currentColor" className="apple-logo-purple"><path d="M17.05 20.28c-.96.95-2.04 1.9-3.26 1.9-1.2 0-1.59-.73-3.01-.73-1.43 0-1.87.71-3.01.73-1.18.02-2.42-1.05-3.38-2.01-1.96-1.96-3.41-5.54-3.41-8.63 0-5.1 3.31-7.79 6.45-7.79 1.64 0 3.09.99 4.01.99.91 0 2.64-1.19 4.56-1.19 1.05 0 3.99.38 5.61 2.76-.13.08-3.35 1.95-3.35 5.8 0 4.6 4.02 6.22 4.07 6.24-.03.09-.64 2.19-2.14 4.38-.65.95-1.33 1.9-2.4 1.9-1.07 0-1.37-.65-2.6-.65-1.23 0-1.58.65-2.6.65-1.02 0-1.74-.95-2.39-1.9zM15.48 2c.9-1.09 1.5-2.61 1.33-4.12-1.3.05-2.87.86-3.8 1.95-.84.97-1.58 2.53-1.38 4 1.45.11 2.94-.74 3.85-1.83z" /></svg>ne
        </h1>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Av+presidente+castillo"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-location"
        >
          📍 Av. Presidente Castillo
        </a>
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