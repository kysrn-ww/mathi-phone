import React, { useState, useEffect } from 'react';
import { formatCurrency, convertPrice } from '../utils/currency';
import { api } from '../utils/api';

const CurrencyConverter = ({ basePrice }) => {
  const [rates, setRates] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('ARS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchRates = async () => {
    try {
      const data = await api.getExchangeRates();
      setRates(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rates:', error);
      setLoading(false);
    }
  };

  const currencies = [
    { code: 'ARS', label: 'Pesos', icon: '🇦🇷' },
    { code: 'USD', label: 'Dólares', icon: '💵' },
    { code: 'USDT', label: 'USDT', icon: '💰' },
    { code: 'BTC', label: 'Bitcoin', icon: '₿' },
    { code: 'ETH', label: 'Ethereum', icon: 'Ξ' }
  ];

  if (loading || !rates) {
    return (
      <div className="currency-converter" data-testid="currency-converter">
        <div className="loading">Cargando tasas...</div>
      </div>
    );
  }

  return (
    <div className="currency-converter" data-testid="currency-converter">
      <div className="currency-selector">
        {currencies.map(currency => (
          <button
            key={currency.code}
            className={`currency-btn ${selectedCurrency === currency.code ? 'active' : ''}`}
            onClick={() => setSelectedCurrency(currency.code)}
            data-testid={`currency-btn-${currency.code}`}
          >
            <span className="currency-icon">{currency.icon}</span>
            <span className="currency-label">{currency.label}</span>
          </button>
        ))}
      </div>
      
      <div className="converted-price" data-testid="converted-price">
        {formatCurrency(convertPrice(basePrice, rates, selectedCurrency), selectedCurrency)}
      </div>
      
      <div className="exchange-info">
        <small>ⓘ Tasas actualizadas: {new Date(rates.timestamp).toLocaleTimeString('es-AR')}</small>
      </div>
    </div>
  );
};

export default CurrencyConverter;