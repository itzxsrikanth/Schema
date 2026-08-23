import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import WeatherWidget from './WeatherWidget';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Stethoscope, 
  Sparkles, 
  Landmark, 
  ArrowRight, 
  Layers, 
  MapPin, 
  User, 
  CheckCircle2, 
  ChevronRight,
  Droplets,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const farmerName = user?.name || 'Farmer';
  const farmLocation = user?.location || 'Coimbatore, Tamil Nadu';
  const farmSize = user?.farmSize || 4.5;
  const soilType = user?.soilType ? (user.soilType.charAt(0).toUpperCase() + user.soilType.slice(1) + ' Soil') : 'Alluvial Soil';
  const cropList = user?.crops?.length ? user.crops.join(', ') : 'Wheat, Sugarcane, Tomato';

  const todayDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Live APMC Mandi Market Ticker (Clean, Professional) */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 165, 233, 0.08) 50%, rgba(245, 158, 11, 0.08) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: '#059669',
            color: '#ffffff',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.04em'
          }}>
            APMC MANDI
          </span>
          <span style={{ color: '#cbd5e1', fontWeight: '500' }}>
            Wheat: <strong style={{ color: '#34d399' }}>₹2,420/Qtl</strong> • Tomato: <strong style={{ color: '#38bdf8' }}>₹1,850/Qtl</strong> • Sugarcane: <strong style={{ color: '#fbbf24' }}>₹3,150/Ton</strong> • Cotton: <strong style={{ color: '#c084fc' }}>₹7,200/Qtl</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '12px' }}>
          <Activity size={14} color="#34d399" />
          <span>Market Status: <strong>Open & Active</strong></span>
        </div>
      </div>

      {/* Executive Farm Overview Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 28, 48, 0.9) 0%, rgba(10, 20, 36, 0.8) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '22px 26px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
              {t('welcomeFarmer') || 'Welcome back,'} {farmerName}
            </h1>
            <span style={{
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '11.5px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <CheckCircle2 size={13} /> Active Account
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '13.5px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={14} color="#38bdf8" />
              <strong style={{ color: '#f1f5f9' }}>{farmLocation}</strong>
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Layers size={14} color="#34d399" />
              <strong style={{ color: '#f1f5f9' }}>{farmSize} Acres</strong> ({soilType})
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sprout size={14} color="#fbbf24" />
              <span>Crops: <strong style={{ color: '#f1f5f9' }}>{cropList}</strong></span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</span>
            <strong style={{ fontSize: '13px', color: '#ffffff' }}>{todayDate}</strong>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <User size={14} />
            <span>Farm Profile</span>
          </button>
        </div>
      </div>

      {/* 4 Performance KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* KPI 1: Soil Fertility */}
        <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '4px solid #10b981', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Soil & Nutrient Index</span>
            <Sprout size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>
            Grade A+ (Optimal)
          </div>
          <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
            {soilType} • Balanced NPK
          </div>
        </div>

        {/* KPI 2: Govt Subsidies */}
        <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '4px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '6px', cursor: 'pointer' }} onClick={() => navigate('/schemes')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Government Subsidies</span>
            <Landmark size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>
            Up to ₹3.56 Lakhs
          </div>
          <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>5 Matched Schemes</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* KPI 3: Daily Field Plan */}
        <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '4px solid #f59e0b', display: 'flex', flexDirection: 'column', gap: '6px', cursor: 'pointer' }} onClick={() => navigate('/advisory')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Field Irrigation</span>
            <Droplets size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>
            Scheduled Window
          </div>
          <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Morning Window Active</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* KPI 4: Crop Protection */}
        <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '4px solid #8b5cf6', display: 'flex', flexDirection: 'column', gap: '6px', cursor: 'pointer' }} onClick={() => navigate('/disease-detection')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Plant Health</span>
            <Stethoscope size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>
            Diagnostic Scanner
          </div>
          <div style={{ fontSize: '12px', color: '#c084fc', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Scan Leaf for Diagnosis</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {/* Live Agromet Station Weather Widget */}
      <WeatherWidget location={farmLocation} />

      {/* 4 Core Agricultural Modules */}
      <div>
        <div style={{ marginBottom: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#ffffff' }}>
            Farm Operations & Decision Modules
          </h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Select a module to manage your field operations
          </span>
        </div>

        <div className="grid-2">
          {/* Card 1: Crop Recommendation */}
          <div 
            className="glass-card" 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              gap: '16px',
              borderTop: '3px solid #10b981'
            }} 
            onClick={() => navigate('/crop-recommendation')}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '10px', borderRadius: '10px' }}>
                  <Sprout size={22} />
                </div>
                <span className="badge-green">NPK & Climate Matching</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px', color: '#ffffff' }}>
                {t('cropRec')}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: '1.5', margin: 0 }}>
                {t('cropRecDesc')}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: '600', fontSize: '13.5px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
              <span>{t('getRecommendation')}</span>
              <ArrowRight size={15} />
            </div>
          </div>

          {/* Card 2: Disease Diagnostic Scanner */}
          <div 
            className="glass-card" 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              gap: '16px',
              borderTop: '3px solid #f59e0b'
            }} 
            onClick={() => navigate('/disease-detection')}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '10px', borderRadius: '10px' }}>
                  <Stethoscope size={22} />
                </div>
                <span className="badge-gold">Diagnostic Scanner</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px', color: '#ffffff' }}>
                {t('diseaseDetect')}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: '1.5', margin: 0 }}>
                {t('diseaseDesc')}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: '600', fontSize: '13.5px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
              <span>{t('analyzePlant')}</span>
              <ArrowRight size={15} />
            </div>
          </div>

          {/* Card 3: Daily Agricultural Advisory */}
          <div 
            className="glass-card" 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              gap: '16px',
              borderTop: '3px solid #0ea5e9'
            }} 
            onClick={() => navigate('/advisory')}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', padding: '10px', borderRadius: '10px' }}>
                  <Sparkles size={22} />
                </div>
                <span className="badge-blue">Location & Weather Linked</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px', color: '#ffffff' }}>
                {t('advisory')}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: '1.5', margin: 0 }}>
                {t('advisoryDesc')}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: '600', fontSize: '13.5px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
              <span>{t('generateAdvisory')}</span>
              <ArrowRight size={15} />
            </div>
          </div>

          {/* Card 4: Govt Schemes & Subsidies */}
          <div 
            className="glass-card" 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              gap: '16px',
              borderTop: '3px solid #8b5cf6'
            }} 
            onClick={() => navigate('/schemes')}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', padding: '10px', borderRadius: '10px' }}>
                  <Landmark size={22} />
                </div>
                <span className="badge-purple">Direct Benefit Transfer</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px', color: '#ffffff' }}>
                {t('schemes')}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: '1.5', margin: 0 }}>
                {t('schemesDesc')}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontWeight: '600', fontSize: '13.5px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
              <span>{t('matchGovtSchemes')}</span>
              <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
