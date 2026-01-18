import React from 'react';

const Categories = () => {
  const categories = [
    {
      icon: '📱',
      title: 'iPhones',
      description: 'Desde el iPhone 11 hasta el iPhone 17 Pro Max. Encuentra el modelo perfecto para ti con filtros avanzados.'
    },
    {
      icon: '💻',
      title: 'MacBooks',
      description: 'MacBook Air y Pro con chips M3. Potencia y portabilidad en su máxima expresión.'
    },
    {
      icon: '⌚',
      title: 'Apple Watch',
      description: 'Series 9, SE y Ultra. Tu salud y fitness en tu muñeca.'
    },
    {
      icon: '🎧',
      title: 'AirPods',
      description: 'AirPods Pro 2, AirPods 3 y AirPods Max. Audio excepcional.'
    },
    {
      icon: '📱',
      title: 'iPads',
      description: 'iPad Pro, Air y mini. Creatividad y productividad sin límites.'
    },
    {
      icon: '🔌',
      title: 'Accesorios',
      description: 'Cables, cargadores, fundas y más. Complementos esenciales.'
    }
  ];

  return (
    <section className="categories" id="categories" data-testid="categories-section">
      <h2 className="section-title" data-testid="categories-title">Nuestras Categorías</h2>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div className="category-card" key={index} data-testid={`category-card-${index}`}>
            <div className="category-icon">{category.icon}</div>
            <h3>{category.title}</h3>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;