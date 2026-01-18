import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompare } from '../contexts/CompareContext';
import { api } from '../utils/api';
import CurrencyConverter from '../components/CurrencyConverter';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCompare } = useCompare();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await api.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container" data-testid="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container" data-testid="error-container">
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate('/')} className="btn-back">
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-page" data-testid="product-detail-page">
      <div className="product-detail-container">
        <button onClick={() => navigate(-1)} className="btn-back" data-testid="btn-back">
          ← Volver
        </button>

        <div className="product-detail-content">
          <div className="product-detail-image">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} />
            ) : (
              <div className="product-icon-large">📱</div>
            )}
          </div>

          <div className="product-detail-info">
            <h1 className="product-detail-title" data-testid="product-title">{product.name}</h1>
            
            <div className="product-detail-badges">
              <span className="badge badge-condition">{product.condition}</span>
              <span className="badge badge-battery">{product.battery_health}% Batería</span>
              {product.warranty_months > 0 && (
                <span className="badge badge-warranty">✅ {product.warranty_months} meses garantía</span>
              )}
            </div>

            <div className="product-detail-specs">
              <div className="spec-item">
                <span className="spec-label">Almacenamiento</span>
                <span className="spec-value">{product.storage}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Color</span>
                <span className="spec-value">{product.color}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Pantalla</span>
                <span className="spec-value">{product.screen_size}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Chip</span>
                <span className="spec-value">{product.chip}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Cámara</span>
                <span className="spec-value">{product.camera}</span>
              </div>
            </div>

            <div className="product-detail-features">
              <h3>Características</h3>
              <div className="features-list">
                {product.features.map((feature, idx) => (
                  <span key={idx} className="feature-badge">✓ {feature}</span>
                ))}
              </div>
            </div>

            {product.description && (
              <div className="product-detail-description">
                <h3>Descripción</h3>
                <p>{product.description}</p>
              </div>
            )}

            <div className="product-detail-price-section">
              <h3>Precio en diferentes monedas</h3>
              <CurrencyConverter basePrice={product.price_ars} />
            </div>

            <div className="product-detail-actions">
              <button 
                className="btn-add-compare" 
                onClick={() => addToCompare(product)}
                data-testid="btn-add-to-compare"
              >
                🔄 Agregar a comparación
              </button>
              <button className="btn-contact-primary" data-testid="btn-contact-primary">
                💬 Consultar disponibilidad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;