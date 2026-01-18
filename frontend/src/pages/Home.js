import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import SearchBar from '../components/SearchBar';
import FilterSection from '../components/FilterSection';
import ProductCard from '../components/ProductCard';
import Contact from '../components/Contact';
import { api } from '../utils/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    model: 'all',
    type: 'all',
    condition: 'all',
    battery: 'all'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products...');
      const data = await api.getProducts();
      console.log('Products received:', data);
      console.log('Setting products state...');
      setProducts(data);
      setFilteredProducts(data);
      console.log('Products state set. Loading set to false.');
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
      console.log('Loading set to false.');
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Apply model filter
    if (filters.model !== 'all') {
      filtered = filtered.filter(p => p.model === filters.model);
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    // Apply condition filter
    if (filters.condition !== 'all') {
      filtered = filtered.filter(p => p.condition === filters.condition);
    }

    // Apply battery filter
    if (filters.battery !== 'all') {
      switch (filters.battery) {
        case '90-100':
          filtered = filtered.filter(p => p.battery_health >= 90);
          break;
        case '80-89':
          filtered = filtered.filter(p => p.battery_health >= 80 && p.battery_health < 90);
          break;
        case '70-79':
          filtered = filtered.filter(p => p.battery_health >= 70 && p.battery_health < 80);
          break;
        case 'below-70':
          filtered = filtered.filter(p => p.battery_health < 70);
          break;
        default:
          break;
      }
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const name = (p.name || '').toLowerCase();
        const model = (p.model || '').toLowerCase();
        const color = (p.color || '').toLowerCase();
        const chip = (p.chip || '').toLowerCase();
        const storage = (p.storage || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        const description = (p.description || '').toLowerCase();

        return name.includes(query) ||
          model.includes(query) ||
          color.includes(query) ||
          chip.includes(query) ||
          storage.includes(query) ||
          category.includes(query) ||
          description.includes(query);
      });
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="home-page" data-testid="home-page">
      <Hero />
      <Categories onCategorySelect={(cat) => setFilters(prev => ({ ...prev, category: cat, model: 'all', type: 'all' }))} />
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FilterSection
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <section className="catalog-section" id="catalog" data-testid="catalog-section">
        <div className="catalog-container">
          <div className="catalog-header">
            <h2 className="catalog-title" data-testid="catalog-title">Catálogo</h2>
            <p className="catalog-subtitle">
              Explora nuestra completa colección de iPhones , MacBooks , Airpods y accesorios. Desde el modelo más económico hasta el más potente.
            </p>
          </div>

          {loading ? (
            <div className="loading-container" data-testid="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <>
              <div className="products-count" data-testid="products-count">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
              </div>

              <div className="products-grid" data-testid="products-grid">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="no-products" data-testid="no-products">
                    <p>🔍 No se encontraron productos</p>
                    <p>Debug: Products array length: {products.length}</p>
                    <p>Debug: Filtered products length: {filteredProducts.length}</p>
                    <p>Debug: Loading state: {loading.toString()}</p>
                    <button
                      className="btn-reset-filters"
                      onClick={() => {
                        setFilters({
                          category: 'all',
                          model: 'all',
                          type: 'all',
                          condition: 'all',
                          battery: 'all'
                        });
                        setSearchQuery('');
                      }}
                      data-testid="btn-reset-filters"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <Contact />
    </div>
  );
};

export default Home;