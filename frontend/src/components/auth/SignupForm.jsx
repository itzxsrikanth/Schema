import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, INDIAN_STATES } from '../../context/LanguageContext';
import { UserPlus, User, Mail, MapPin, Layers, Sprout } from 'lucide-react';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91 9876543210',
    location: 'Coimbatore, Tamil Nadu',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    soilType: 'alluvial',
    farmSize: 4.5,
    income: 220000,
    language: 'en',
    crops: ['Wheat', 'Sugarcane']
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await signup(formData);
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '20px' }}>🌱</span>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#ffffff' }}>
            Register Farmer Profile
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', margin: 0 }}>
          Set up your farm parameters for AI recommendations & government schemes.
        </p>
      </div>

      {err && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
          {err}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Farmer Full Name *</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="form-control" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              placeholder="e.g. Srikanth / Ramesh Patel" 
              required 
              style={{ paddingLeft: '40px' }}
            />
            <User size={17} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
          </div>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Email Address *</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="email" 
              className="form-control" 
              value={formData.email} 
              onChange={e => setFormData({ ...formData, email: e.target.value })} 
              placeholder="farmer@agrimail.in" 
              required 
              style={{ paddingLeft: '40px' }}
            />
            <Mail size={17} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
          </div>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">{t('selectState')} *</label>
          <select 
            className="form-select" 
            value={formData.state} 
            onChange={e => setFormData({ ...formData, state: e.target.value, location: `${formData.district || 'City'}, ${e.target.value}` })}
          >
            {INDIAN_STATES.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">{t('soilType')}</label>
            <select 
              className="form-select" 
              value={formData.soilType} 
              onChange={e => setFormData({ ...formData, soilType: e.target.value })}
            >
              <option value="black">Black Cotton Soil (काली)</option>
              <option value="alluvial">Alluvial Loam (जलोढ़)</option>
              <option value="red">Red Soil (लाल)</option>
              <option value="laterite">Laterite (लैटेराइट)</option>
              <option value="sandy">Sandy Loam (बलुई)</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Farm Size (Acres) *</label>
            <input 
              type="number" 
              step="0.5" 
              min="0.1"
              className="form-control" 
              value={formData.farmSize} 
              onChange={e => setFormData({ ...formData, farmSize: parseFloat(e.target.value) || 2.5 })} 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%', justifyContent: 'center', marginTop: '6px', padding: '12px', fontSize: '15px' }}
          disabled={loading}
        >
          <UserPlus size={18} />
          {loading ? 'Creating Profile...' : 'Complete Registration'}
        </button>
      </form>

      <div style={{ textAlign: 'center', fontSize: '13.5px', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
        Already registered?{' '}
        <Link to="/login" style={{ color: '#34d399', textDecoration: 'none', fontWeight: '700' }}>
          Sign In Here →
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;
