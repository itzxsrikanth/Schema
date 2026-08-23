import React, { useState, useRef } from 'react';
import { diseaseAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import { Stethoscope, Upload, AlertTriangle, ShieldCheck, MapPin, X, Sparkles, FileText, Check, Youtube, ExternalLink, Search } from 'lucide-react';

const ImageUpload = () => {
  const { lang, t, getCropName } = useLanguage();
  const fileInputRef = useRef(null);

  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [attachedImage, setAttachedImage] = useState(null); // base64 string
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [validationErr, setValidationErr] = useState('');

  const availableCrops = [
    { id: 'wheat', key: 'wheat' },
    { id: 'rice', key: 'rice' },
    { id: 'tomato', key: 'tomato' },
    { id: 'cotton', key: 'cotton' },
    { id: 'sugarcane', key: 'sugarcane' },
    { id: 'maize', key: 'maize' },
    { id: 'potato', key: 'potato' },
    { id: 'soybean', key: 'soybean' },
    { id: 'mustard', key: 'mustard' },
    { id: 'chana', key: 'chana' },
    { id: 'groundnut', key: 'groundnut' },
    { id: 'onion', key: 'onion' },
    { id: 'chili', key: 'chili' },
    { id: 'apple', key: 'apple' },
    { id: 'mango', key: 'mango' },
    { id: 'banana', key: 'banana' },
    { id: 'citrus', key: 'citrus' },
    { id: 'turmeric', key: 'turmeric' },
    { id: 'tea', key: 'tea' },
    { id: 'coffee', key: 'coffee' },
    { id: 'jute', key: 'jute' },
    { id: 'barley', key: 'barley' },
    { id: 'bajra', key: 'bajra' },
    { id: 'jowar', key: 'jowar' },
    { id: 'ragi', key: 'ragi' }
  ];

  // Process selected or dropped file
  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setValidationErr('');
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setAttachedImage(null);
    setFileName('');
    setFileSize('');
    setResult(null);
    setValidationErr('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!attachedImage) {
      setValidationErr('Please attach or capture a plant leaf photo before scanning.');
      return;
    }

    setValidationErr('');
    setLoading(true);
    try {
      const res = await diseaseAPI.detect({
        cropName: selectedCrop,
        imageBase64: attachedImage
      });
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      console.error('Disease detection error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to pick localized disease text strictly for selected language
  const getLocalizedDiseaseName = (det) => {
    if (lang === 'hi' && det.diseaseHindi) return det.diseaseHindi;
    return det.disease;
  };

  const getLocalizedSymptoms = (det) => {
    if (lang === 'hi' && det.symptomsHindi) return det.symptomsHindi;
    return det.symptoms;
  };

  const getLocalizedOrganic = (treat) => {
    if (lang === 'hi' && treat.organicHindi) return treat.organicHindi;
    return treat.organic;
  };

  const getLocalizedChemical = (treat) => {
    if (lang === 'hi' && treat.chemicalHindi) return treat.chemicalHindi;
    return treat.chemical;
  };

  // Dynamic Google Search URL in user language
  const getLocalizedSearchUrl = (diseaseName, cropKey) => {
    const localizedCrop = getCropName(cropKey);
    const query = encodeURIComponent(`${localizedCrop} ${diseaseName} treatment management ICAR guide`);
    return `https://www.google.com/search?q=${query}`;
  };

  // Dynamic YouTube Search URL in user language
  const getLocalizedYoutubeUrl = (diseaseName, cropKey) => {
    const localizedCrop = getCropName(cropKey);
    const query = encodeURIComponent(`${localizedCrop} ${diseaseName} treatment solution video`);
    return `https://www.youtube.com/results?search_query=${query}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>🔬 {t('diseaseDetect')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('diseaseDesc')}</p>
      </div>

      <div className="grid-2">
        {/* Photo Upload Panel */}
        <div className="glass-card">
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>{t('selectUploadTitle')}</h3>
          
          {/* Target Crop Select - Clean Single Language Only */}
          <div className="form-group">
            <label className="form-label">{t('targetCrop')}</label>
            <select 
              className="form-select" 
              value={selectedCrop} 
              onChange={e => setSelectedCrop(e.target.value)}
            >
              {availableCrops.map(c => (
                <option key={c.id} value={c.id}>
                  {getCropName(c.key)}
                </option>
              ))}
            </select>
          </div>

          {/* Validation Alert */}
          {validationErr && (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} />
              {validationErr}
            </div>
          )}

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />

          {/* Attach Box Container */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ 
              border: isDragging ? '2px dashed var(--primary-green)' : '2px dashed var(--glass-border)', 
              padding: attachedImage ? '16px' : '40px 20px', 
              borderRadius: '16px', 
              textAlign: 'center', 
              marginBottom: '24px', 
              background: isDragging ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {attachedImage ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative', width: '100%', maxHeight: '220px', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--primary-green)' }}>
                  <img 
                    src={attachedImage} 
                    alt="Attached plant leaf photo" 
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(15, 23, 42, 0.85)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} /> Photo Attached
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 4px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    📷 {fileName} ({fileSize})
                  </span>
                  <button 
                    type="button" 
                    onClick={handleRemovePhoto} 
                    className="btn-secondary" 
                    style={{ padding: '4px 10px', fontSize: '12px', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                  >
                    <X size={14} /> {t('removePhoto')}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
                  <Upload size={32} color="var(--primary-green)" />
                </div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#ffffff', marginBottom: '6px' }}>
                  {t('clickDropBox')}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {t('supportsText')}
                </div>
              </div>
            )}
          </div>

          {/* Main Analyze Button */}
          <button 
            onClick={handleAnalyze} 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '16px' }}
            disabled={loading}
          >
            <Stethoscope size={20} />
            {loading ? t('scanningBtn') : t('scanDiagnoseBtn')}
          </button>
        </div>

        {/* AI Results Panel */}
        <div>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-card" style={{ borderLeft: result.detection.severity === 'Critical' || result.detection.severity === 'High' ? '4px solid #ef4444' : '4px solid #f59e0b' }}>
                
                {/* Result Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '14px' }}>
                  <div>
                    <span className="badge-gold" style={{ background: result.detection.severity === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: result.detection.severity === 'Critical' ? '#fca5a5' : '#fbbf24' }}>
                      {t('severityLevel')}: {result.detection.severity}
                    </span>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', marginTop: '8px', color: '#ffffff' }}>
                      {getLocalizedDiseaseName(result.detection)}
                    </h3>
                    <div style={{ fontSize: '13px', color: 'var(--primary-green)', fontStyle: 'italic', marginTop: '2px' }}>
                      <em>{result.detection.scientificName}</em>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--primary-green)' }}>
                      {result.detection.confidence}%
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{t('aiConfidence')}</div>
                  </div>
                </div>

                {/* Google Knowledge Search Link in Selected Language */}
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <Search size={16} color="#60a5fa" />
                    <span>{t('googleKnowledgeBanner')}</span>
                  </div>
                  <a 
                    href={getLocalizedSearchUrl(getLocalizedDiseaseName(result.detection), selectedCrop)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-secondary" 
                    style={{ padding: '6px 14px', fontSize: '13px', textDecoration: 'none', color: '#60a5fa' }}
                  >
                    <span>{t('googleSearchBtn')}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* YouTube Solution Video Section in Selected Language */}
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
                    <Youtube size={20} color="#ef4444" />
                    <span>{t('youtubeVideoHeader')}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600', marginBottom: '12px' }}>
                    🎬 {getCropName(selectedCrop)} - {getLocalizedDiseaseName(result.detection)}
                  </div>
                  <a 
                    href={getLocalizedYoutubeUrl(getLocalizedDiseaseName(result.detection), selectedCrop)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary" 
                    style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', width: '100%', justifyContent: 'center', textDecoration: 'none', fontSize: '14px', padding: '12px' }}
                  >
                    <Youtube size={18} />
                    <span>{t('watchVideoBtn')}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* Symptoms Section */}
                <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '12px', marginBottom: '14px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#ffffff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} color="var(--primary-green)" />
                    {t('symptomsTitle')}
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {getLocalizedSymptoms(result.detection)}
                  </p>
                </div>

                {/* Organic Treatment */}
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '16px', borderRadius: '12px', marginBottom: '14px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: '700', fontSize: '14px', marginBottom: '6px' }}>
                    <ShieldCheck size={18} />
                    {t('organicRemedy')}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                    {getLocalizedOrganic(result.treatment)}
                  </div>
                </div>

                {/* Chemical Treatment */}
                <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '16px', borderRadius: '12px', marginBottom: '14px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: '700', fontSize: '14px', marginBottom: '6px' }}>
                    <AlertTriangle size={18} />
                    {t('chemicalRemedy')}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                    {getLocalizedChemical(result.treatment)}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--accent-gold)', marginTop: '8px', fontWeight: '600' }}>
                    🧪 Dosage / Ratio: {result.treatment.dosage}
                  </div>
                </div>

                {/* Nearby Mandis */}
                {result.nearbyMandis && (
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--glass-border)' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={16} color="var(--primary-green)" />
                      {t('nearbyMandisTitle')}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {result.nearbyMandis.map((m, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', background: 'rgba(15, 23, 42, 0.4)', padding: '10px 14px', borderRadius: '8px' }}>
                          <div>
                            <strong style={{ color: '#ffffff' }}>📍 {m.name}</strong>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{m.distanceKm} km away • Stock: {m.chemicalStock}</div>
                          </div>
                          <span className="badge-green">₹{m.pricePerQuintal}/Qtl</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px' }}>
              <Stethoscope size={52} color="var(--accent-gold)" style={{ marginBottom: '16px', opacity: 0.8 }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{t('awaitingInput')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '320px', lineHeight: '1.6' }}>
                {t('awaitingDesc')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
