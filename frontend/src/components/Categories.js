import React from 'react';
import { Smartphone, Laptop, Watch, Headphones, Tablet, Zap } from 'lucide-react';

const Categories = ({ onCategorySelect }) => {
  const categories = [
    {
      id: 'iphone',
      icon: <Smartphone size={40} />,
      title: 'iPhones',
      description: 'Desde el iPhone 11 hasta el iPhone 17 Pro Max. Encuentra el modelo perfecto para ti con filtros avanzados.'
    },
    {
      id: 'macbook',
      icon: <Laptop size={40} />,
      title: 'MacBooks',
      description: 'MacBook Air y Pro con chips M3. Potencia y portabilidad en su máxima expresión.'
    },
    {
      id: 'watch',
      icon: <Watch size={40} />,
      title: 'Apple Watch',
      description: 'Series 9, SE y Ultra. Tu salud y fitness en tu muñeca.'
    },
    {
      id: 'airpods',
      icon: <Headphones size={40} />,
      title: 'AirPods',
      description: 'AirPods Pro 2, AirPods 3 y AirPods Max. Audio excepcional.'
    },
    {
      id: 'ipad',
      icon: <Tablet size={40} />,
      title: 'iPads',
      description: 'iPad Pro, Air y mini. Creatividad y productividad sin límites.'
    },
    {
      id: 'accesorio',
      icon: <Zap size={40} />,
      title: 'Accesorios',
      description: 'Cables, cargadores, fundas y más. Complementos esenciales.'
    }
  ];

  return (
    <section className="categories" id="categories" data-testid="categories-section">
      <h2 className="section-title" data-testid="categories-title">Nuestras Categorías</h2>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div
            className="category-card"
            key={index}
            data-testid={`category-card-${index}`}
            onClick={() => onCategorySelect && onCategorySelect(category.id)}
            style={{ cursor: 'pointer' }}
          >
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