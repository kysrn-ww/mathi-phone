import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { getProductImage } from '../utils/productDefaults';

const AccesoriosAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    model: 'pencil',
    type: 'pencil',
    storage: '',
    color: '',
    condition: 'sealed',
    price_ars: '',
    price_usd: '',
    screen_size: '',
    chip: '',
    camera: '',
    features: '',
    available: true,
    warranty_months: 6,
    description: '',
    image_url: getProductImage('accesorio', 'pencil', 'pencil'),
    category: 'accesorio'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts({ category: 'accesorio' });
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
    setFormData({ ...formData, [field]: formattedValue });
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      try {
        const imageUrl = await api.uploadImage(file);
        setFormData({ ...formData, image_url: imageUrl });
        alert('Imagen subida exitosamente');
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error al subir la imagen: ' + error.message);
      }
    }
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
      model: 'pencil',
      type: 'pencil',
      storage: '',
      color: '',
      condition: 'sealed',
      price_ars: '',
      price_usd: '',
      screen_size: '',
      chip: '',
      camera: '',
      features: '',
      available: true,
      warranty_months: 6,
      description: '',
      image_url: getProductImage('accesorio', 'pencil', 'pencil'),
      category: 'accesorio'
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
        <h1>Panel de Accesorios</h1>
      </div>

      {showForm && (
        <div className="admin-modal">
          <div className="modal-content">
            <h2>{editingProduct ? 'Editar Accesorio' : 'Agregar Accesorio'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre del Producto</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Magic Keyboard, Apple Pencil, AirTag"
                  />
                </div>

                <div className="form-group">
                  <label>Tipo de Accesorio</label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      const newImage = getProductImage('accesorio', formData.model, newType);
                      setFormData({ ...formData, type: newType, model: newType, image_url: newImage });
                    }}
                  >
                    <option value="lightning">Lightning</option>
                    <option value="usb-c">USB-C</option>
                    <option value="magsafe">MagSafe</option>
                    <option value="pencil">Apple Pencil</option>
                    <option value="keyboard">Teclado</option>
                    <option value="airtag">AirTag</option>
                    <option value="case">Funda</option>
                    <option value="charger">Cargador</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Marca/Modelo</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Ej: Apple, Belkin, Anker"
                  />
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Ej: White, Black, Pink"
                  />
                </div>

                <div className="form-group">
                  <label>Condición</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  >
                    <option value="sealed">Sellado</option>
                  </select>
                </div>


                <div className="form-group">
                  <label>Precio ARS</label>
                  <input
                    type="text"
                    value={formData.price_ars}
                    onChange={(e) => handlePriceChange('price_ars', e.target.value)}
                    placeholder="Ej: 150.000"
                  />
                </div>

                <div className="form-group">
                  <label>Precio USD</label>
                  <input
                    type="text"
                    value={formData.price_usd}
                    onChange={(e) => handlePriceChange('price_usd', e.target.value)}
                    placeholder="Ej: 150"
                  />
                </div>

                <div className="form-group">
                  <label>Características (separadas por comas)</label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Ej: Bluetooth, Wireless, Rechargeable"
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
                    placeholder="Describe el accesorio..."
                  />
                </div>

                <div className="form-group">
                  <label>URL de Imagen</label>
                  <div className="image-upload-group">
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="btn-upload"
                      onClick={() => document.getElementById('image-upload').click()}
                    >
                      Subir Imagen
                    </button>
                  </div>
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
        <h2>Accesorios ({products.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Color</th>
              <th>Precio ARS</th>
              <th>Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.type}</td>
                <td>{product.color}</td>
                <td>${(product.price_ars || 0).toLocaleString()}</td>
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
            <p>No hay accesorios agregados aún</p>
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
          + Agregar Nuevo Accesorio
        </button>
      </div>
    </div>
  );
};

export default AccesoriosAdmin;
