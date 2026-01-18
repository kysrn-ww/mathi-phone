export const formatCurrency = (amount, currency = 'ARS') => {
  const formats = {
    ARS: { symbol: '$', decimals: 0 },
    USD: { symbol: 'USD $', decimals: 0 },
    USDT: { symbol: 'USDT $', decimals: 2 },
    BTC: { symbol: '₿', decimals: 8 },
    ETH: { symbol: 'Ξ', decimals: 6 }
  };
  
  const format = formats[currency] || formats.ARS;
  const formatted = amount.toFixed(format.decimals);
  
  return `${format.symbol} ${formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const convertPrice = (priceARS, rates, targetCurrency) => {
  if (!rates || !priceARS) return 0;
  
  const priceUSD = priceARS / rates.ars;
  
  switch(targetCurrency) {
    case 'USD':
      return priceUSD;
    case 'USDT':
      return priceUSD / rates.usdt;
    case 'BTC':
      return priceUSD / rates.btc;
    case 'ETH':
      return priceUSD / rates.eth;
    case 'ARS':
    default:
      return priceARS;
  }
};