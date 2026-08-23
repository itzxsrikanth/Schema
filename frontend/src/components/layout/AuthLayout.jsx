import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import { 
  Sprout, 
  Stethoscope, 
  Sparkles, 
  Landmark, 
  Globe, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';

const AuthLayout = () => {
  const { t, lang, changeLanguage } = useLanguage();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#060c17',
      color: '#f8fafc',
      fontFamily: 'var(--font-main)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Left Visual Showcase Hero Panel */}
      <div style={{
        flex: '1.2',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '52px',
        overflow: 'hidden',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(6, 12, 23, 0.88) 0%, rgba(6, 12, 23, 0.65) 50%, rgba(6, 12, 23, 0.95) 100%)'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('/images/agritech_hero_bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
          zIndex: 0,
          filter: 'saturate(1.15) contrast(1.05)'
        }} />

        {/* Ambient Lighting */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Content Overlays */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {/* Top Brand Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <Sprout size={24} color="#ffffff" />
              </div>
              <div>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em', display: 'block', lineHeight: 1.1 }}>
                  {t('brandName')}
                </span>
                <span style={{ fontSize: '11px', color: '#34d399', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Agricultural Intelligence Platform
                </span>
              </div>
            </NavLink>

            <span style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#34d399',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              backdropFilter: 'blur(8px)'
            }}>
              Enterprise Agritech Suite
            </span>
          </div>

          {/* Headline & Mission */}
          <div style={{ maxWidth: '580px' }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '800',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              marginBottom: '14px',
              color: '#ffffff'
            }}>
              Precision Agronomy, Crop Diagnostics & <span style={{
                background: 'linear-gradient(135deg, #34d399 0%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Direct Benefit Subsidies</span>.
            </h1>
            <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
              An integrated farm management operating system designed for Indian agriculture—delivering soil-calibrated crop recommendations, leaf disease pathology, localized weather forecasts, and government scheme eligibility.
            </p>
          </div>

          {/* 4 Clean Feature Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', maxWidth: '620px' }}>
            <div style={{
              background: 'rgba(15, 28, 48, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '10px', color: '#34d399' }}>
                <Sprout size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: '#ffffff', display: 'block' }}>Crop Recommendation</strong>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>NPK & climate yield matching</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 28, 48, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '10px', color: '#fbbf24' }}>
                <Stethoscope size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: '#ffffff', display: 'block' }}>Plant Disease Diagnosis</strong>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>ICAR-guided treatment steps</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 28, 48, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <div style={{ background: 'rgba(14, 165, 233, 0.15)', padding: '10px', borderRadius: '10px', color: '#38bdf8' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: '#ffffff', display: 'block' }}>Daily Farm Advisory</strong>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Irrigation & local Mandi data</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 28, 48, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '10px', borderRadius: '10px', color: '#c084fc' }}>
                <Landmark size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: '#ffffff', display: 'block' }}>Government Subsidies</strong>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>PM-KISAN, KCC, PMFBY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Platform Metrics */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '32px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#34d399' }}>28 States</div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Agro-climatic coverage</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#38bdf8' }}>11 Languages</div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Multi-lingual support</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#fbbf24' }}>25+ Crops</div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Agronomic database</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '12px' }}>
            <CheckCircle2 size={14} color="#34d399" />
            <span>Secure Cloud Platform</span>
          </div>
        </div>
      </div>

      {/* Right Form Card Side */}
      <div style={{
        flex: '1',
        minWidth: '380px',
        maxWidth: '540px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 32px',
        background: 'linear-gradient(180deg, #091222 0%, #060c17 100%)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Top Language Dropdown */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '5px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <Globe size={15} color="#94a3b8" />
            <select 
              value={lang} 
              onChange={(e) => changeLanguage(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code} style={{ background: '#0a1424', color: '#ffffff' }}>
                  {l.native} ({l.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Form Box */}
        <div className="glass-card" style={{
          width: '100%',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
