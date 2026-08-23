import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  LogIn, 
  Mail, 
  Lock, 
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    name: 'Srikanth / Ramesh Patel',
    location: 'Coimbatore, Tamil Nadu',
    email: 'srikanth@agrimail.in',
    password: 'password123',
    role: 'Medium Farm (4.5 Acres)',
    crops: 'Wheat, Sugarcane'
  },
  {
    name: 'Gurpreet Singh',
    location: 'Ludhiana, Punjab',
    email: 'gurpreet.singh@agrimail.in',
    password: 'password123',
    role: 'Grain Farm (6.0 Acres)',
    crops: 'Paddy, Wheat'
  }
];

const LoginForm = () => {
  const [email, setEmail] = useState('srikanth@agrimail.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleDemoSelect = async (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErr('');
    setLoading(true);
    try {
      await login(acc.email, acc.password);
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#ffffff' }}>
          {t('login') || 'Sign In to Farm Platform'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Enter your account details or select a preloaded profile below.
        </p>
      </div>

      {/* Preloaded Farm Profiles Selector */}
      <div style={{
        background: 'rgba(15, 28, 48, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quick Access Profiles
          </span>
          <span style={{ fontSize: '11px', color: '#34d399', fontWeight: '600' }}>Pre-filled</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {DEMO_ACCOUNTS.map((acc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleDemoSelect(acc)}
              style={{
                background: 'rgba(10, 19, 35, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.background = 'rgba(10, 19, 35, 0.8)';
              }}
            >
              <div>
                <strong style={{ fontSize: '13px', color: '#f1f5f9', display: 'block' }}>{acc.name}</strong>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{acc.location} • {acc.role}</span>
              </div>
              <span style={{ fontSize: '11.5px', color: '#34d399', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
                Sign In <ChevronRight size={13} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {err && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
          {err}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Email Address</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="e.g. farmer@agrimail.in"
              required 
              style={{ paddingLeft: '40px' }}
            />
            <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#64748b' }} />
          </div>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>Password</label>
            <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>Default: password123</span>
          </div>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'} 
              className="form-control" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ paddingLeft: '40px', paddingRight: '40px' }}
            />
            <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#64748b' }} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%', justifyContent: 'center', marginTop: '6px', padding: '12px', fontSize: '14.5px' }}
          disabled={loading}
        >
          <LogIn size={16} />
          {loading ? 'Authenticating...' : (t('login') || 'Sign In to Dashboard')}
        </button>
      </form>

      {/* Registration Link */}
      <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
        New Farmer?{' '}
        <Link to="/signup" style={{ color: '#34d399', textDecoration: 'none', fontWeight: '700' }}>
          Create Farmer Profile →
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
