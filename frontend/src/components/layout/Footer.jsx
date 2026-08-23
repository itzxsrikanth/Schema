import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--glass-border)',
      background: 'rgba(15, 23, 42, 0.9)',
      padding: '24px',
      textAlign: 'center',
      marginTop: 'auto',
      color: 'var(--text-secondary)',
      fontSize: '14px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <strong style={{ color: '#ffffff' }}>🌾 KisanAI - Smart Agriculture Advisory Platform</strong>
          <span style={{ marginLeft: '12px' }}>© 2026 AI for Farmers</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Empowering Farmers with AI & Data</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
