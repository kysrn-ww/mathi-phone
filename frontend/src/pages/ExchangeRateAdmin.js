import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

const ExchangeRateAdmin = () => {
    const [rates, setRates] = useState({
        USD: 1,
        ARS: 1000,
        USDT: 1
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = async () => {
        try {
            setLoading(true);
            const data = await api.getExchangeRates();
            // El backend retorna un objeto con usd, ars, usdt, etc.
            // Pero el POST espera un objeto con las claves en mayúsculas (USD, ARS)
            setRates({
                USD: data.usd || 1,
                ARS: data.ars || 1000,
                USDT: data.usdt || 1
            });
        } catch (error) {
            console.error('Error fetching rates:', error);
            setMessage({ type: 'error', text: 'Error al cargar las tasas de cambio' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage({ type: '', text: '' });

            await api.updateExchangeRates(rates);

            setMessage({ type: 'success', text: 'Tasas de cambio actualizadas correctamente' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error updating rates:', error);
            setMessage({ type: 'error', text: 'Error al actualizar las tasas de cambio' });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRates(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando tasas de cambio...</p>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Gestionar Tasas de Cambio</h1>
                <a href="/admin" className="btn-back">Volver al Panel</a>
            </div>

            <div className="exchange-rate-form-container">
                <form onSubmit={handleSubmit} className="exchange-rate-form">
                    <div className="form-group">
                        <label>Dólar (USD)</label>
                        <input
                            type="number"
                            name="USD"
                            value={rates.USD}
                            onChange={handleChange}
                            step="0.01"
                            required
                        />
                        <p className="help-text">Valor base (normalmente 1)</p>
                    </div>

                    <div className="form-group">
                        <label>Peso Argentino (ARS)</label>
                        <input
                            type="number"
                            name="ARS"
                            value={rates.ARS}
                            onChange={handleChange}
                            step="1"
                            required
                        />
                        <p className="help-text">Valor del dólar en pesos (ej: 1100)</p>
                    </div>

                    <div className="form-group">
                        <label>USDT / Dólar Cripto</label>
                        <input
                            type="number"
                            name="USDT"
                            value={rates.USDT}
                            onChange={handleChange}
                            step="0.01"
                            required
                        />
                        <p className="help-text">Valor del USDT respecto al USD</p>
                    </div>

                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <button type="submit" className="btn-save" disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>

            <div className="exchange-rate-info">
                <h3>¿Cómo funciona?</h3>
                <p>
                    Estas tasas se utilizan para calcular automáticamente los precios en el panel de administración.
                    Si actualizas el valor del ARS aquí, los nuevos productos que agregues usarán este valor por defecto.
                </p>
            </div>
        </div>
    );
};

export default ExchangeRateAdmin;
