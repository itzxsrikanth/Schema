import React, { useState } from 'react';
import { cropAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import { Sprout, Sliders } from 'lucide-react';

const CropForm = () => {
  const { t, getCropName } = useLanguage();
  const [formData, setFormData] = useState({
    soilType: 'black',
    nitrogen: 100,
    phosphorus: 50,
    potassium: 50,
    ph: 6.5,
    rainfall: 800,
    temperature: 26,
    location: 'Maharashtra'
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await cropAPI.recommend(formData);
      if (res.data.success) {
        setResults(res.data.data.recommendations);
      }
    } catch (err) {
      console.error('Crop recommendation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>🌾 {t('cropRec')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('cropRecDesc')}</p>
      </div>

      <div className="grid-2">
        {/* Form Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={20} color="var(--primary-green)" />
            {t('soilType')} & Soil Test Parameters
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t('soilType')}</label>
              <select className="form-select" value={formData.soilType} onChange={e => setFormData({ ...formData, soilType: e.target.value })}>
                <option value="black">Black Soil</option>
                <option value="alluvial">Alluvial Soil</option>
                <option value="red">Red Soil</option>
                <option value="laterite">Laterite Soil</option>
                <option value="sandy">Sandy Soil</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Nitrogen (N)</label>
                <input type="number" className="form-control" value={formData.nitrogen} onChange={e => setFormData({ ...formData, nitrogen: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phosphorus (P)</label>
                <input type="number" className="form-control" value={formData.phosphorus} onChange={e => setFormData({ ...formData, phosphorus: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Potassium (K)</label>
                <input type="number" className="form-control" value={formData.potassium} onChange={e => setFormData({ ...formData, potassium: e.target.value })} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Soil pH ({formData.ph})</label>
                <input type="range" min="4.0" max="9.0" step="0.1" className="form-control" value={formData.ph} onChange={e => setFormData({ ...formData, ph: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Annual Rainfall (mm)</label>
                <input type="number" className="form-control" value={formData.rainfall} onChange={e => setFormData({ ...formData, rainfall: e.target.value })} required />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} disabled={loading}>
              <Sprout size={18} />
              {loading ? t('scanningBtn') : t('calculateBtn')}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div>
          {results ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700' }}>{t('cropRec')}</h3>
              {results.slice(0, 4).map((crop, idx) => (
                <div key={crop.cropId} className="glass-card" style={{ borderLeft: idx === 0 ? '4px solid var(--primary-green)' : '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: '700' }}>
                        {getCropName(crop.cropId || crop.name)}
                      </h4>
                      <span className="badge-green">{crop.season} Season</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-green)' }}>{crop.matchPercentage}%</span>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Suitability Match</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px', background: 'rgba(15, 23, 42, 0.4)', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
                    <div>
                      <div style={{ color: 'var(--text-secondary)' }}>Expected Yield</div>
                      <strong style={{ color: '#ffffff' }}>{crop.estimatedYieldQuintalPerAcre} Quintal/Acre</strong>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)' }}>Mandi Spot Price</div>
                      <strong style={{ color: 'var(--accent-gold)' }}>₹{crop.estimatedPricePerQuintalRupees}/Quintal</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px' }}>
              <Sprout size={48} color="var(--primary-green)" style={{ marginBottom: '16px', opacity: 0.8 }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{t('cropRec')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '300px' }}>
                {t('cropRecDesc')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropForm;
