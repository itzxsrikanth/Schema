import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { schemeAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage, INDIAN_STATES } from '../../../context/LanguageContext';
import { 
  Landmark, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Filter, 
  User, 
  Sparkles, 
  Layers, 
  DollarSign, 
  MapPin, 
  Edit3, 
  RefreshCw,
  Save,
  Check
} from 'lucide-react';

const SchemesForm = () => {
  const { user, updateUserProfile } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  // Initialize from user profile details
  const [formData, setFormData] = useState({
    landSize: user?.farmSize ?? 4.5,
    state: user?.state || user?.location?.split(',')[1]?.trim() || 'Maharashtra',
    income: user?.income || 220000,
    crops: user?.crops || ['Wheat', 'Sugarcane']
  });

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedToProfile, setSavedToProfile] = useState(false);

  // Sync state if user profile changes in AuthContext
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        landSize: user.farmSize ?? prev.landSize,
        state: user.state || user.location?.split(',')[1]?.trim() || prev.state,
        income: user.income || prev.income,
        crops: user.crops || prev.crops
      }));
    }
  }, [user]);

  const fetchSchemes = async (data = formData) => {
    setLoading(true);
    try {
      const res = await schemeAPI.match(data);
      if (res.data.success) {
        setSchemes(res.data.data.schemes);
      }
    } catch (err) {
      console.error('Scheme matcher error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes(formData);
  }, [formData.landSize, formData.state, formData.income]);

  // Quick save to user profile
  const handleSaveToProfile = async () => {
    try {
      await updateUserProfile({
        farmSize: parseFloat(formData.landSize) || 2.5,
        state: formData.state,
        income: parseFloat(formData.income) || 200000
      });
      setSavedToProfile(true);
      setTimeout(() => setSavedToProfile(false), 3000);
    } catch (e) {
      console.warn('Profile save note:', e.message);
    }
  };

  const eligibleSchemesCount = schemes.filter(s => s.isEligible).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>🏛️ {t('schemes')}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Central & State Government Schemes, Kisan Credit Card, Subsidies and Crop Insurance matched to your land and income criteria.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
        >
          <User size={16} color="var(--primary-green)" />
          <span>Edit Farmer Profile</span>
        </button>
      </div>

      {/* Profile Link Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(56, 189, 248, 0.1) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '14px',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#34d399',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            border: '1px solid rgba(16, 185, 129, 0.4)'
          }}>
            🧑‍🌾
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontSize: '16px', color: '#ffffff' }}>{user?.name || 'Farmer Account'}</strong>
              <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
                Profile Connected
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '3px' }}>
              📍 <strong>{formData.state}</strong> • 🌾 <strong>{formData.landSize} Acres</strong> • 💰 Annual Income: <strong>₹{Number(formData.income).toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: '#34d399', fontWeight: '700' }}>
            ✓ {eligibleSchemesCount} of {schemes.length} Schemes Eligible
          </span>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Edit3 size={14} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Filter / Customization Box */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={20} color="var(--primary-green)" />
            {t('eligibilityFilter') || 'Eligibility Criteria Filter'}
          </h3>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleSaveToProfile}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: savedToProfile ? '#34d399' : 'inherit' }}
            >
              {savedToProfile ? <Check size={14} color="#34d399" /> : <Save size={14} />}
              <span>{savedToProfile ? 'Saved to Profile!' : 'Save as Profile Defaults'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); fetchSchemes(); }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: '600' }}>{t('farmSize')}</label>
              <input 
                type="number" 
                step="0.1" 
                min="0.1"
                className="form-control" 
                value={formData.landSize} 
                onChange={e => setFormData({ ...formData, landSize: e.target.value })} 
                required 
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: '600' }}>{t('selectState')}</label>
              <select 
                className="form-select" 
                value={formData.state} 
                onChange={e => setFormData({ ...formData, state: e.target.value })}
              >
                {INDIAN_STATES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: '600' }}>{t('annualIncome')}</label>
              <input 
                type="number" 
                step="1000"
                className="form-control" 
                value={formData.income} 
                onChange={e => setFormData({ ...formData, income: e.target.value })} 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '16px', gap: '10px' }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '10px 20px', fontSize: '14px' }}>
              <Landmark size={16} />
              {loading ? (t('checkingBtn') || 'Recalculating...') : (t('recalculateBtn') || 'Recalculate Schemes')}
            </button>
          </div>
        </form>
      </div>

      {/* Schemes Grid */}
      <div className="grid-2">
        {schemes.map(scheme => (
          <div 
            key={scheme.schemeId} 
            className="glass-card" 
            style={{ 
              borderLeft: scheme.isEligible ? '4px solid var(--primary-green)' : '4px solid #ef4444', 
              opacity: scheme.isEligible ? 1 : 0.75,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '17.5px', fontWeight: '800', margin: 0 }}>
                    {lang === 'hi' ? scheme.nameHindi : scheme.name}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--accent-gold)', fontWeight: '700', marginTop: '3px' }}>
                    {t('maxBenefit') || 'Max Benefit'}: ₹{scheme.benefit.toLocaleString('en-IN')}
                  </div>
                </div>
                {scheme.isEligible ? (
                  <span className="badge-green" style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                    <CheckCircle size={14} /> {t('eligible')}
                  </span>
                ) : (
                  <span className="badge-gold" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderColor: '#ef4444', whiteSpace: 'nowrap' }}>
                    <XCircle size={14} /> {t('notEligible')}
                  </span>
                )}
              </div>

              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.5' }}>
                {lang === 'hi' ? scheme.descriptionHindi : scheme.description}
              </p>

              {/* Reasons / Requirements */}
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px 12px', borderRadius: '8px', marginBottom: '14px', fontSize: '12.5px' }}>
                <div style={{ color: scheme.isEligible ? '#34d399' : '#f87171', fontWeight: '600', marginBottom: '4px' }}>
                  {scheme.isEligible ? '✓ Eligibility Verified:' : '⚠️ Eligibility Criteria Gap:'}
                </div>
                <div style={{ color: '#cbd5e1' }}>
                  {scheme.reasons?.join(' • ')}
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '12.5px' }}>
                <strong>{t('reqDocs')}:</strong>
                <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {scheme.documentsRequired.join(' • ')}
                </div>
              </div>
            </div>

            <a 
              href={scheme.applicationUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'center', fontSize: '13px', textDecoration: 'none' }}
            >
              <span>{t('applyPortal')}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemesForm;
