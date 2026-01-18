import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { getProductImage } from '../utils/productDefaults';

const AirpodsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1000);
  const [formData, setFormData] = useState({
    name: '',
    model: 'pro-2',
    type: 'pro',
    storage: '',
    color: '',
    condition: 'excellent',
    battery_health: 90,
    price_ars: '',
    price_usd: '',
    screen_size: '',
    chip: '',
    camera: '',
    features: '',
    available: true,
    warranty_months: 6,
    description: '',
    image_url: getProductImage('airpods', 'pro-2', 'pro'),
    category: 'airpods'
  });

  useEffect(() => {
    fetchProducts();
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    try {
      const data = await api.getExchangeRates();
      setExchangeRate(data.ars || 1000);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts({ category: 'airpods' });
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value) => {
    if (!value) return '';
    const cleanValue = value.replace(/[^\d]/g, '');
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handlePriceChange = (field, value) => {
    const cleanValue = value.replace(/[^\d]/g, '');
    const formattedValue = formatPrice(cleanValue);

    const newFormData = { ...formData, [field]: formattedValue };

    // Auto-calculate logic
    if (field === 'price_usd' && cleanValue) {
      const usd = parseFloat(cleanValue);
      const ars = Math.round(usd * exchangeRate);
      newFormData.price_ars = formatPrice(ars.toString());
    } else if (field === 'price_ars' && cleanValue) {
      const ars = parseFloat(cleanValue);
      const usd = Math.round(ars / exchangeRate);
      newFormData.price_usd = formatPrice(usd.toString());
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        price_ars: formData.price_ars ? parseFloat(formData.price_ars.replace(/\./g, '').replace(',', '.')) : 0,
        price_usd: formData.price_usd ? parseFloat(formData.price_usd.replace(/\./g, '').replace(',', '.')) : 0
      };

      if (editingProduct) {
        const response = await api.updateProduct(editingProduct.id, productData);
      } else {
        const response = await api.createProduct(productData);
      }

      fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto: ' + error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      features: product.features.join(', '),
      price_ars: product.price_ars.toString(),
      price_usd: product.price_usd.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await api.deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      model: 'pro-2',
      type: 'pro',
      storage: '',
      color: '',
      condition: 'excellent',
      battery_health: 90,
      price_ars: '',
      price_usd: '',
      screen_size: '',
      chip: '',
      camera: '',
      features: '',
      available: true,
      warranty_months: 6,
      description: '',
      image_url: getProductImage('airpods', 'pro-2', 'pro'),
      category: 'airpods'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Panel de AirPods</h1>
      </div>

      {showForm && (
        <div className="admin-modal">
          <div className="modal-content">
            <h2>{editingProduct ? 'Editar AirPods' : 'Agregar AirPods'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre del Producto</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: AirPods Pro 2nd Generation"
                  />
                </div>

                <div className="form-group">
                  <label>Modelo</label>
                  <select
                    value={formData.model}
                    onChange={(e) => {
                      const newModel = e.target.value;
                      const newImage = getProductImage('airpods', newModel, formData.type);
                      setFormData({ ...formData, model: newModel, image_url: newImage });
                    }}
                  >
                    <option value="pro-2">AirPods Pro 2</option>
                    <option value="3">AirPods 3</option>
                    <option value="max">AirPods Max</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      const newImage = getProductImage('airpods', formData.model, newType);
                      setFormData({ ...formData, type: newType, image_url: newImage });
                    }}
                  >
                    <option value="pro">Pro</option>
                    <option value="normal">Normal</option>
                    <option value="max">Max</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Ej: White, Black"
                  />
                </div>

                <div className="form-group">
                  <label>Condición</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  >
                    <option value="sealed">Sellado</option>
                    <option value="like-new">Como Nuevo</option>
                    <option value="excellent">Excelente</option>
                    <option value="good">Bueno</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Salud de Batería (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.battery_health}
                    onChange={(e) => setFormData({ ...formData, battery_health: parseInt(e.target.value) || 0 })}
                    placeholder="Ej: 90"
                  />
                </div>

                <div className="form-group">
                  <label>Precio ARS</label>
                  <input
                    type="text"
                    value={formData.price_ars}
                    onChange={(e) => handlePriceChange('price_ars', e.target.value)}
                    placeholder="Ej: 400.000"
                  />
                </div>

                <div className="form-group">
                  <label>Precio USD</label>
                  <input
                    type="text"
                    value={formData.price_usd}
                    onChange={(e) => handlePriceChange('price_usd', e.target.value)}
                    placeholder="Ej: 400"
                  />
                </div>

                <div className="form-group">
                  <label>Características (separadas por comas)</label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Ej: Active Noise Cancellation, Spatial Audio, Sweat Resistant"
                  />
                </div>

                <div className="form-group">
                  <label>Meses de Garantía</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={formData.warranty_months}
                    onChange={(e) => setFormData({ ...formData, warranty_months: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    placeholder="Describe los AirPods..."
                  />
                </div>

                <div className="form-group">
                  <label>URL de Imagen</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    />
                    Disponible
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  {editingProduct ? 'Actualizar' : 'Guardar'}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-table">
        <h2>AirPods ({products.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Modelo</th>
              <th>Color</th>
              <th>Precio ARS</th>
              <th>Batería</th>
              <th>Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.model}</td>
                <td>{product.color}</td>
                <td>${product.price_ars.toLocaleString()}</td>
                <td>{product.battery_health}%</td>
                <td>{product.available ? '✅' : '❌'}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(product)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(product.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="no-products">
            <p>No hay AirPods agregados aún</p>
          </div>
        )}
      </div>

      <div className="add-product-section">
        <button
          className="btn-add-product"
          onClick={() => {
            setShowForm(true);
            setEditingProduct(null);
            resetForm();
          }}
        >
          + Agregar Nuevos AirPods
        </button>
      </div>
    </div>
  );
};

export default AirpodsAdmin;
