import React from 'react';
import { useCompare } from '../contexts/CompareContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCompare } = useCompare();
  const navigate = useNavigate();

  const getBatteryColor = (health) => {
    if (health >= 90) return 'battery-excellent';
    if (health >= 80) return 'battery-good';
    if (health >= 70) return 'battery-fair';
    return 'battery-low';
  };

  const getConditionBadge = (condition) => {
    const badges = {
      'sealed': { text: 'Sellado', class: 'badge-sealed' },
      'like-new': { text: 'Como Nuevo', class: 'badge-new' },
      'excellent': { text: 'Excelente', class: 'badge-excellent' },
      'good': { text: 'Bueno', class: 'badge-good' }
    };
    return badges[condition] || badges.good;
  };

  const handleAddToCompare = (e) => {
    e.stopPropagation();
    addToCompare(product);
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const conditionBadge = getConditionBadge(product.condition);

  return (
    <div className="product-card" onClick={handleViewDetails} data-testid="product-card">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-icon">
            {product.category === 'macbook' ? '💻' :
              product.category === 'watch' ? '⌚' :
                product.category === 'airpods' ? '🎧' :
                  product.category === 'ipad' ? '📱' :
                    product.category === 'accesorio' ? '🔌' : '📱'}
          </div>
        )}

        <div className="product-badges">
          <span className={`badge ${conditionBadge.class}`}>{conditionBadge.text}</span>
          {product.category !== 'accesorio' && (
            <span className={`badge badge-battery ${getBatteryColor(product.battery_health)}`}>
              {product.battery_health}% Batería
            </span>
          )}
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name" data-testid="product-name">{product.name}</h3>

        <div className="product-specs">
          <span>💾 {product.storage}</span>
          <span>🎨 {product.color}</span>
        </div>

        <p className="product-description">{product.screen_size} • {product.chip}</p>

        <div className="product-features">
          {product.features.slice(0, 4).map((feature, idx) => (
            <span key={idx} className="feature-tag">{feature}</span>
          ))}
        </div>

        <div className="product-footer">
          <div className="product-price-section">
            {product.price_currency === 'ARS' ? (
              <>
                <div className="product-price" data-testid="product-price">
                  ${product.price_ars.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                </div>
                <div className="product-price-usd">
                  USD ${product.price_usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
              </>
            ) : (
              <>
                <div className="product-price" data-testid="product-price">
                  USD ${product.price_usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
                <div className="product-price-ars">
                  ${product.price_ars.toLocaleString('es-AR', { maximumFractionDigits: 0 })} ARS
                </div>
              </>
            )}
          </div>

          <div className="product-actions">
            <button
              className="btn-compare"
              onClick={handleAddToCompare}
              data-testid="btn-add-to-compare"
            >
              🔄
            </button>
            <button className="btn-contact" data-testid="btn-contact">
              💬 Consultar
            </button>
          </div>
        </div>

        {product.warranty_months > 0 && (
          <div className="warranty-badge">
            ✅ Garantía {product.warranty_months} meses
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;