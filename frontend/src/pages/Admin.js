import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { getProductImage } from '../utils/productDefaults';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1000);
  const [formData, setFormData] = useState({
    name: '',
    model: '16',
    type: 'pro-max',
    storage: '256GB',
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
    image_url: getProductImage('iphone', '16', 'pro-max'),
    category: 'iphone'
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
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
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

      console.log('Submitting product:', productData);

      if (editingProduct) {
        const response = await api.updateProduct(editingProduct.id, productData);
        console.log('Update response:', response);
      } else {
        const response = await api.createProduct(productData);
        console.log('Create response:', response);
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

  const formatPrice = (value) => {
    if (!value) return '';
    // Remove all non-digit characters
    const cleanValue = value.replace(/[^\d]/g, '');
    // Add dots as thousand separators
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handlePriceChange = (field, value) => {
    // Remove all non-digit characters
    const cleanValue = value.replace(/[^\d]/g, '');
    // Format with dots
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

  const resetForm = () => {
    setFormData({
      name: '',
      model: '16',
      type: 'pro-max',
      storage: '256GB',
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
      image_url: getProductImage('iphone', '16', 'pro-max'),
      category: 'iphone'
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
        <h1>Panel de Administración Principal</h1>
        <div className="admin-actions">
          <a href="/admin/exchange-rates" className="btn-exchange">
            💰 Gestionar Dólar (${exchangeRate})
          </a>
        </div>
      </div>

      <div className="admin-categories">
        <h2>Selecciona una categoría para administrar:</h2>
        <div className="category-grid">
          <a href="/admin/iphones" className="category-card">
            <div className="category-icon">📱</div>
            <h3>iPhones</h3>
            <p>Administrar iPhone 11, 12, 13, 14, 15, 16, 17, SE</p>
          </a>

          <a href="/admin/macbooks" className="category-card">
            <div className="category-icon">💻</div>
            <h3>MacBooks</h3>
            <p>Administrar MacBook Air, Pro, modelos M1/M2/M3</p>
          </a>

          <a href="/admin/apple-watch" className="category-card">
            <div className="category-icon">⌚</div>
            <h3>Apple Watch</h3>
            <p>Administrar Series 7, 8, 9, SE, Ultra</p>
          </a>

          <a href="/admin/airpods" className="category-card">
            <div className="category-icon">🎧</div>
            <h3>AirPods</h3>
            <p>Administrar AirPods, AirPods Pro, AirPods Max</p>
          </a>

          <a href="/admin/ipads" className="category-card">
            <div className="category-icon">📱</div>
            <h3>iPads</h3>
            <p>Administrar iPad Air, Pro, Mini, modelos estándar</p>
          </a>

          <a href="/admin/accesorios" className="category-card">
            <div className="category-icon">🔌</div>
            <h3>Accesorios</h3>
            <p>Administrar Magic Keyboard, Apple Pencil, AirTag, cables</p>
          </a>
        </div>
      </div>

      {showForm && (
        <div className="admin-modal">
          <div className="modal-content">
            <h2>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      const newImage = getProductImage(newCategory, formData.model, formData.type);
                      setFormData({ ...formData, category: newCategory, image_url: newImage });
                    }}
                  >
                    <option value="iphone">iPhone</option>
                    <option value="macbook">MacBook</option>
                    <option value="watch">Apple Watch</option>
                    <option value="airpods">AirPods</option>
                    <option value="ipad">iPad</option>
                    <option value="accesorio">Accesorio</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Nombre del Producto</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: iPhone 16 Pro Max"
                  />
                </div>

                <div className="form-group">
                  <label>Modelo</label>
                  <select
                    value={formData.model}
                    onChange={(e) => {
                      const newModel = e.target.value;
                      const newImage = getProductImage(formData.category, newModel, formData.type);
                      setFormData({ ...formData, model: newModel, image_url: newImage });
                    }}
                  >
                    {formData.category === 'iphone' && (
                      <>
                        <option value="16">iPhone 16</option>
                        <option value="15">iPhone 15</option>
                        <option value="14">iPhone 14</option>
                        <option value="13">iPhone 13</option>
                        <option value="12">iPhone 12</option>
                        <option value="11">iPhone 11</option>
                        <option value="se">iPhone SE</option>
                      </>
                    )}
                    {formData.category === 'macbook' && (
                      <>
                        <option value="air">MacBook Air</option>
                        <option value="pro">MacBook Pro</option>
                      </>
                    )}
                    {formData.category === 'watch' && (
                      <>
                        <option value="series-9">Series 9</option>
                        <option value="ultra-2">Ultra 2</option>
                        <option value="se">SE</option>
                      </>
                    )}
                    {formData.category === 'airpods' && (
                      <>
                        <option value="pro-2">AirPods Pro 2</option>
                        <option value="3">AirPods 3</option>
                        <option value="max">AirPods Max</option>
                      </>
                    )}
                    {formData.category === 'ipad' && (
                      <>
                        <option value="pro">iPad Pro</option>
                        <option value="air">iPad Air</option>
                        <option value="mini">iPad Mini</option>
                      </>
                    )}
                    {formData.category === 'accesorio' && (
                      <>
                        <option value="lightning">Lightning</option>
                        <option value="usb-c">USB-C</option>
                        <option value="magsafe">MagSafe</option>
                        <option value="pencil">Pencil</option>
                        <option value="keyboard">Keyboard</option>
                        <option value="airtag">AirTag</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      const newImage = getProductImage(formData.category, formData.model, newType);
                      setFormData({ ...formData, type: newType, image_url: newImage });
                    }}
                  >
                    {formData.category === 'iphone' && (
                      <>
                        <option value="normal">Normal</option>
                        <option value="pro">Pro</option>
                        <option value="pro-max">Pro Max</option>
                        <option value="plus">Plus</option>
                        <option value="mini">Mini</option>
                        <option value="se">SE</option>
                      </>
                    )}
                    {formData.category === 'macbook' && (
                      <>
                        <option value="m1">M1</option>
                        <option value="m2">M2</option>
                        <option value="m3">M3</option>
                        <option value="14">14"</option>
                        <option value="16">16"</option>
                      </>
                    )}
                    {formData.category === 'watch' && (
                      <>
                        <option value="normal">Normal</option>
                        <option value="ultra">Ultra</option>
                        <option value="se">SE</option>
                      </>
                    )}
                    {formData.category === 'airpods' && (
                      <>
                        <option value="pro">Pro</option>
                        <option value="normal">Normal</option>
                        <option value="max">Max</option>
                      </>
                    )}
                    {formData.category === 'ipad' && (
                      <>
                        <option value="pro">Pro</option>
                        <option value="air">Air</option>
                        <option value="mini">Mini</option>
                      </>
                    )}
                    {formData.category === 'accesorio' && (
                      <>
                        <option value="lightning">Lightning</option>
                        <option value="usb-c">USB-C</option>
                        <option value="magsafe">MagSafe</option>
                        <option value="pencil">Pencil</option>
                        <option value="keyboard">Keyboard</option>
                        <option value="airtag">AirTag</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Almacenamiento</label>
                  <select
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  >
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Ej: Plateado, Negro, Azul"
                  />
                </div>

                <div className="form-group">
                  <label>Condición</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  >
                    <option value="sealed">Sellado</option>
                    {formData.category !== 'accesorio' && (
                      <>
                        <option value="like-new">Como Nuevo</option>
                        <option value="excellent">Excelente</option>
                        <option value="good">Bueno</option>
                      </>
                    )}
                  </select>
                </div>

                {formData.category !== 'accesorio' && (
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
                )}

                <div className="form-group">
                  <label>Precio ARS</label>
                  <input
                    type="text"
                    value={formData.price_ars}
                    onChange={(e) => handlePriceChange('price_ars', e.target.value)}
                    placeholder="Ej: 1.500.000"
                  />
                </div>

                <div className="form-group">
                  <label>Precio USD</label>
                  <input
                    type="text"
                    value={formData.price_usd}
                    onChange={(e) => handlePriceChange('price_usd', e.target.value)}
                    placeholder="Ej: 1.500"
                  />
                </div>

                <div className="form-group">
                  <label>Tamaño de Pantalla</label>
                  <input
                    type="text"
                    value={formData.screen_size}
                    onChange={(e) => setFormData({ ...formData, screen_size: e.target.value })}
                    placeholder="Ej: 6.7 Super Retina XDR"
                  />
                </div>

                <div className="form-group">
                  <label>Chip</label>
                  <input
                    type="text"
                    value={formData.chip}
                    onChange={(e) => setFormData({ ...formData, chip: e.target.value })}
                    placeholder="Ej: A18 Pro"
                  />
                </div>

                <div className="form-group">
                  <label>Cámara</label>
                  <input
                    type="text"
                    value={formData.camera}
                    onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
                    placeholder="Ej: 48MP Principal + 12MP Ultra Gran Angular"
                  />
                </div>

                <div className="form-group">
                  <label>Características (separadas por comas)</label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Ej: 5G, ProMotion 120Hz, Dynamic Island"
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
                    placeholder="Describe el producto..."
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
        <h2>Productos ({products.length})</h2>
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
            <p>No hay productos agregados aún</p>
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
          + Agregar Nuevo Producto
        </button>
      </div>
    </div>
  );
};

export default Admin;
