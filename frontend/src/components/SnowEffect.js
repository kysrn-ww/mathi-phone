import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './SnowEffect.css';

const SnowEffect = () => {
    const { showSnow } = useTheme();
    const snowflakes = Array.from({ length: 50 });

    if (!showSnow) return null;

    return (
        <div className="snow-container" aria-hidden="true">
            {snowflakes.map((_, index) => (
                <div
                    key={index}
                    className="snowflake"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 10 + 5}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: Math.random(),
                        fontSize: `${Math.random() * 10 + 10}px`
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    );
};

export default SnowEffect;
