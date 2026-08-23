import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import { 
  Sprout, 
  LayoutDashboard, 
  Stethoscope, 
  Sparkles, 
  Landmark, 
  LogOut, 
  Globe, 
  User 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, lang, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <NavLink to="/" className="logo-brand">
          <div className="logo-icon">🌾</div>
          <span style={{ fontWeight: '800', letterSpacing: '-0.02em' }}>{t('brandName')}</span>
        </NavLink>

        {/* Nav Navigation Links */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={16} />
            <span>{t('dashboard')}</span>
          </NavLink>
          <NavLink to="/crop-recommendation" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Sprout size={16} />
            <span>{t('cropRec')}</span>
          </NavLink>
          <NavLink to="/disease-detection" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Stethoscope size={16} />
            <span>{t('diseaseDetect')}</span>
          </NavLink>
          <NavLink to="/advisory" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Sparkles size={16} />
            <span>{t('advisory')}</span>
          </NavLink>
          <NavLink to="/schemes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Landmark size={16} />
            <span>{t('schemes')}</span>
          </NavLink>

          {/* Dedicated User Profile Link */}
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <div style={{
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              <User size={13} />
            </div>
            <span>Profile</span>
          </NavLink>

          {/* Clean Language Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '5px 10px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            marginLeft: '4px'
          }}>
            <Globe size={15} color="#94a3b8" />
            <select 
              value={lang} 
              onChange={(e) => changeLanguage(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#e2e8f0',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code} style={{ background: '#0b1320', color: '#ffffff' }}>
                  {l.native} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {user ? (
            <button 
              onClick={handleLogout} 
              className="btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '13px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.25)', marginLeft: '4px' }}
              title="Sign out of your farmer account"
            >
              <LogOut size={14} />
              <span>{t('logout')}</span>
            </button>
          ) : (
            <NavLink to="/login" className="btn-primary" style={{ padding: '6px 14px', fontSize: '13px', textDecoration: 'none', marginLeft: '4px' }}>
              <span>{t('login')}</span>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
