import React from 'react';

const FilterSection = ({ filters, onFilterChange }) => {
  const models = ['all', '17', '16', '15', '14', '13', '12', '11', 'se'];
  const types = ['all', 'pro-max', 'pro', 'plus', 'normal', 'mini', 'se'];
  const conditions = ['all', 'sealed', 'like-new', 'excellent', 'good'];
  const batteries = ['all', '90-100', '80-89', '70-79', 'below-70'];

  const typeLabels = {
    'all': 'Todos',
    'pro-max': 'Pro Max',
    'pro': 'Pro',
    'plus': 'Plus',
    'normal': 'Normal',
    'mini': 'Mini',
    'se': 'SE'
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
      
      {/* Model Filter */}
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
              {model === 'all' ? 'Todos' : `iPhone ${model.toUpperCase()}`}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
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
              {typeLabels[type]}
            </button>
          ))}
        </div>
      </div>

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
    </div>
  );
};

export default FilterSection;