import React, { useState, useEffect } from 'react';
import { weatherAPI } from '../../services/api';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  CloudRain, 
  MapPin, 
  Sun, 
  CloudFog, 
  Compass, 
  Calendar,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const WeatherWidget = ({ location = 'Nashik, Maharashtra' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    weatherAPI.getForecast(location)
      .then(res => {
        if (isMounted && res.data.success) {
          setWeather(res.data.data);
        }
      })
      .catch(err => console.warn('Weather fetch warning:', err))
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, [location]);

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading Live Field Weather Forecast...
      </div>
    );
  }

  if (!weather) return null;

  const isRain = weather.rainfall > 0 || weather.condition?.toLowerCase().includes('rain');
  const sprayCondition = weather.windSpeed < 15 && !isRain ? 'Optimal (Low Wind & Dry)' : 'Caution (Check Rain/Wind)';

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', overflow: 'hidden' }}>
      {/* Top Bar: Location & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            padding: '6px 10px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            <MapPin size={15} />
            <span>{weather.location}</span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Live Agromet Station
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '12px',
            background: sprayCondition.includes('Optimal') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: sprayCondition.includes('Optimal') ? '#34d399' : '#fbbf24',
            border: sprayCondition.includes('Optimal') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <CheckCircle2 size={13} /> Spray Window: {sprayCondition}
          </span>
        </div>
      </div>

      {/* Main Meteorological Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center' }}>
        {/* Left: Temperature & Main Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ fontSize: '52px', fontWeight: '800', lineHeight: 1, letterSpacing: '-0.03em', color: '#ffffff' }}>
            {weather.temperature}°C
          </div>
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
              {weather.condition}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'capitalize' }}>
              {weather.description}
            </div>
          </div>
        </div>

        {/* Right: Key Atmospheric Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
              <Droplets size={14} /> Humidity
            </div>
            <strong style={{ fontSize: '16px', color: '#ffffff' }}>{weather.humidity}%</strong>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
              <CloudRain size={14} /> Rainfall
            </div>
            <strong style={{ fontSize: '16px', color: '#ffffff' }}>{weather.rainfall} mm</strong>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
              <Wind size={14} /> Wind
            </div>
            <strong style={{ fontSize: '16px', color: '#ffffff' }}>{weather.windSpeed} km/h</strong>
          </div>
        </div>
      </div>

      {/* 4-Day Micro-Climate Agricultural Forecast */}
      {weather.forecast && (
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
          {weather.forecast.map((f, i) => (
            <div 
              key={i} 
              style={{ 
                background: i === 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.45)', 
                border: i === 0 ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                padding: '10px 14px', 
                borderRadius: '8px', 
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: i === 0 ? '#34d399' : 'var(--text-secondary)' }}>{f.day}</span>
                <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '600' }}>☔ {f.rainProb}</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>
                {f.tempHigh}° <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>/ {f.tempLow}°</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {f.condition}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
