import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../contexts/CompareContext';
import CurrencyConverter from '../components/CurrencyConverter';

const Compare = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="compare-empty" data-testid="compare-empty">
        <div className="compare-empty-content">
          <h2>No hay productos para comparar</h2>
          <p>Agrega productos desde el catálogo para compararlos aquí</p>
          <button onClick={() => navigate('/')} className="btn-back" data-testid="btn-back-home">
            Ir al catálogo
          </button>
        </div>
      </div>
    );
  }

  const specs = [
    { key: 'storage', label: 'Almacenamiento' },
    { key: 'color', label: 'Color' },
    { key: 'screen_size', label: 'Pantalla' },
    { key: 'chip', label: 'Chip' },
    { key: 'camera', label: 'Cámara' },
    { key: 'battery_health', label: 'Batería', format: (val) => `${val}%` },
    { key: 'condition', label: 'Estado' },
    { key: 'warranty_months', label: 'Garantía', format: (val) => `${val} meses` }
  ];

  return (
    <div className="compare-page" data-testid="compare-page">
      <div className="compare-container">
        <div className="compare-header">
          <div>
            <button onClick={() => navigate(-1)} className="btn-back" data-testid="btn-back">
              ← Volver
            </button>
            <h1 className="compare-title" data-testid="compare-title">Comparar Productos</h1>
            <p className="compare-subtitle">
              Comparando {compareList.length} {compareList.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <button 
            onClick={clearCompare} 
            className="btn-clear-compare"
            data-testid="btn-clear-compare"
          >
            🗑️ Limpiar todo
          </button>
        </div>

        <div className="compare-grid" data-testid="compare-grid">
          {compareList.map((product, idx) => (
            <div key={product.id} className="compare-card" data-testid={`compare-card-${idx}`}>
              <button 
                className="btn-remove-compare" 
                onClick={() => removeFromCompare(product.id)}
                data-testid={`btn-remove-${idx}`}
              >
                ✕
              </button>
              
              <div className="compare-card-image">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} />
                ) : (
                  <div className="product-icon">📱</div>
                )}
              </div>

              <h3 className="compare-card-title">{product.name}</h3>

              <div className="compare-card-specs">
                {specs.map(spec => (
                  <div key={spec.key} className="compare-spec-row">
                    <span className="compare-spec-label">{spec.label}</span>
                    <span className="compare-spec-value">
                      {spec.format 
                        ? spec.format(product[spec.key]) 
                        : product[spec.key]
                      }
                    </span>
                  </div>
                ))}
              </div>

              <div className="compare-card-features">
                <h4>Características</h4>
                <div className="features-tags">
                  {product.features.slice(0, 4).map((feature, fidx) => (
                    <span key={fidx} className="feature-tag">{feature}</span>
                  ))}
                </div>
              </div>

              <div className="compare-card-price">
                <h4>Precio</h4>
                <CurrencyConverter basePrice={product.price_ars} />
              </div>

              <div className="compare-card-actions">
                <button 
                  onClick={() => navigate(`/product/${product.id}`)} 
                  className="btn-view-details"
                  data-testid={`btn-view-details-${idx}`}
                >
                  Ver detalles
                </button>
                <button className="btn-contact" data-testid={`btn-contact-${idx}`}>
                  💬 Consultar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Compare;