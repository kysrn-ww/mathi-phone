import React from 'react';

const FilterSection = ({ filters, onFilterChange }) => {
  const categories = ['all', 'iphone', 'macbook', 'watch', 'airpods', 'ipad', 'accesorio'];

  const getModels = () => {
    switch (filters.category) {
      case 'iphone':
        return ['all', '16', '15', '14', '13', '12', '11', 'se'];
      case 'macbook':
        return ['all', 'air', 'pro'];
      case 'watch':
        return ['all', 'series-9', 'ultra-2', 'se'];
      case 'airpods':
        return ['all', 'pro-2', '3', 'max'];
      case 'ipad':
        return ['all', 'pro', 'air', 'mini'];
      case 'accesorio':
        return ['all', 'lightning', 'usb-c', 'magsafe', 'pencil', 'keyboard', 'airtag'];
      default:
        return ['all'];
    }
  };

  const getTypes = () => {
    switch (filters.category) {
      case 'iphone':
        return ['all', 'pro-max', 'pro', 'plus', 'normal', 'mini', 'se'];
      case 'macbook':
        return ['all', 'm1', 'm2', 'm3', '14', '16'];
      case 'watch':
        return ['all', 'normal', 'ultra', 'se'];
      case 'airpods':
        return ['all', 'pro', 'normal', 'max'];
      case 'ipad':
        return ['all', 'pro', 'air', 'mini'];
      case 'accesorio':
        return ['all', 'lightning', 'usb-c', 'magsafe', 'pencil', 'keyboard', 'airtag'];
      default:
        return ['all'];
    }
  };

  const models = getModels();
  const types = getTypes();
  const conditions = ['all', 'sealed', 'like-new', 'excellent', 'good'];
  const batteries = ['all', '90-100', '80-89', '70-79', 'below-70'];

  const categoryLabels = {
    'all': 'Todos',
    'iphone': 'iPhone',
    'macbook': 'MacBook',
    'watch': 'Apple Watch',
    'airpods': 'AirPods',
    'ipad': 'iPad',
    'accesorio': 'Accesorio'
  };

  const typeLabels = {
    'all': 'Todos',
    'pro-max': 'Pro Max',
    'pro': 'Pro',
    'plus': 'Plus',
    'normal': 'Normal',
    'mini': 'Mini',
    'se': 'SE',
    'm1': 'M1',
    'm2': 'M2',
    'm3': 'M3',
    '14': '14"',
    '16': '16"',
    'ultra': 'Ultra',
    'lightning': 'Lightning',
    'usb-c': 'USB-C',
    'magsafe': 'MagSafe',
    'pencil': 'Pencil',
    'keyboard': 'Keyboard',
    'airtag': 'AirTag'
  };

  const conditionLabels = {
    'all': 'Todos',
    'sealed': 'Sellado',
    'like-new': 'Como Nuevo',
    'excellent': 'Excelente',
    'good': 'Bueno'
  };

  const batteryLabels = {
    'all': 'Todas',
    '90-100': '90-100%',
    '80-89': '80-89%',
    '70-79': '70-79%',
    'below-70': 'Menos de 70%'
  };

  return (
    <div className="filter-section" data-testid="filter-section">
      <h3 className="filter-title">Filtros</h3>

      {/* Category Filter */}
      <div className="filter-group">
        <label className="filter-label">Categoría</label>
        <div className="filter-options">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filters.category === cat ? 'active' : ''}`}
              onClick={() => {
                onFilterChange('category', cat);
                onFilterChange('model', 'all');
                onFilterChange('type', 'all');
              }}
              data-testid={`filter-category-${cat}`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Model Filter */}
      {models.length > 1 && (
        <div className="filter-group">
          <label className="filter-label">Modelo</label>
          <div className="filter-options">
            {models.map(model => (
              <button
                key={model}
                className={`filter-btn ${filters.model === model ? 'active' : ''}`}
                onClick={() => onFilterChange('model', model)}
                data-testid={`filter-model-${model}`}
              >
                {model === 'all' ? 'Todos' : model.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Type Filter */}
      {types.length > 1 && (
        <div className="filter-group">
          <label className="filter-label">Tipo</label>
          <div className="filter-options">
            {types.map(type => (
              <button
                key={type}
                className={`filter-btn ${filters.type === type ? 'active' : ''}`}
                onClick={() => onFilterChange('type', type)}
                data-testid={`filter-type-${type}`}
              >
                {typeLabels[type] || type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Condition Filter */}
      <div className="filter-group">
        <label className="filter-label">Estado</label>
        <div className="filter-options">
          {conditions.map(condition => (
            <button
              key={condition}
              className={`filter-btn ${filters.condition === condition ? 'active' : ''}`}
              onClick={() => onFilterChange('condition', condition)}
              data-testid={`filter-condition-${condition}`}
            >
              {conditionLabels[condition]}
            </button>
          ))}
        </div>
      </div>

      {/* Battery Filter */}
      {filters.category !== 'accesorio' && (
        <div className="filter-group">
          <label className="filter-label">Batería</label>
          <div className="filter-options">
            {batteries.map(battery => (
              <button
                key={battery}
                className={`filter-btn ${filters.battery === battery ? 'active' : ''}`}
                onClick={() => onFilterChange('battery', battery)}
                data-testid={`filter-battery-${battery}`}
              >
                {batteryLabels[battery]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;