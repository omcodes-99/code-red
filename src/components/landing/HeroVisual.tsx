import React from 'react';
import { useTranslation } from 'react-i18next';

export const HeroVisual: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="hero-visual-container" aria-label={t('visual.aria')}>
      <div className="hero-visual-card">
        {/* Top Visual Toolbar */}
        <div className="visual-top-bar">
          <div className="visual-indicator-dots">
            <span className="dot dot-red" />
            <span className="dot dot-amber" />
            <span className="dot dot-green" />
          </div>
          <div className="visual-header-title">
            <span>{t('visual.engine')}</span>
          </div>
          <div className="visual-status-pill">
            <span className="live-dot" /> {t('visual.liveOverlay')}
          </div>
        </div>

        {/* The Spatial Map Graphics Area */}
        <div className="visual-map-display">
          <svg
            className="visual-map-svg"
            viewBox="0 0 460 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label={t('visual.mapAria')}
          >
            <defs>
              {/* Background Grid Pattern */}
              <pattern id="heroGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e2e8f0" strokeWidth="0.7" />
              </pattern>
              
              {/* Subtle Linear Gradients for Gov Theme */}
              <linearGradient id="parcelFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#15803d" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#15803d" stopOpacity="0.08" />
              </linearGradient>

              <linearGradient id="bufferFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.03" />
              </linearGradient>
            </defs>

            {/* Base Coordinate Grid */}
            <rect width="460" height="280" fill="#f8fafc" />
            <rect width="460" height="280" fill="url(#heroGrid)" />

            {/* Contour & Natural Feature Lines */}
            <path
              d="M -10 90 Q 120 70 240 110 T 470 80"
              stroke="#cbd5e1"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              fill="none"
            />
            <path
              d="M -10 160 Q 140 180 260 140 T 470 170"
              stroke="#cbd5e1"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              fill="none"
            />

            {/* Forest Reserve Compartment Boundary (RF #42) */}
            <path
              d="M 290 20 L 440 20 L 440 250 L 320 250 L 290 140 Z"
              fill="#0c2340"
              fillOpacity="0.04"
              stroke="#0c2340"
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
            <text x="330" y="45" fill="#475569" fontSize="10" fontFamily="sans-serif" fontWeight="600">
              {t('visual.reservedForest')}
            </text>

            {/* Surrounding Cadastral Parcels */}
            <polygon points="30,40 120,30 140,110 40,120" stroke="#94a3b8" strokeWidth="1" fill="#ffffff" fillOpacity="0.7" />
            <polygon points="140,110 260,95 240,180 130,170" stroke="#94a3b8" strokeWidth="1" fill="#ffffff" fillOpacity="0.7" />
            <polygon points="40,120 130,170 110,245 20,230" stroke="#94a3b8" strokeWidth="1" fill="#ffffff" fillOpacity="0.7" />
            
            {/* Active Claim Polygon (Individual Forest Right Claim) */}
            <polygon
              points="145,55 270,45 285,150 160,165"
              fill="url(#parcelFill)"
              stroke="#15803d"
              strokeWidth="2.4"
            />

            {/* Buffer Boundary */}
            <polygon
              points="135,45 280,35 298,160 150,178"
              fill="url(#bufferFill)"
              stroke="#d97706"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />

            {/* GPS Survey Nodes */}
            <circle cx="145" cy="55" r="4" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="270" cy="45" r="4" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="285" cy="150" r="4" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="160" cy="165" r="4" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />

            {/* Central Claim Pin & Target Area Marker */}
            <g transform="translate(205, 95)">
              <circle cx="0" cy="0" r="16" fill="#0c2340" fillOpacity="0.1" />
              <circle cx="0" cy="0" r="6" fill="#d97706" />
              <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
            </g>

            {/* Map Labels */}
            <rect x="155" y="118" width="105" height="24" rx="4" fill="#0c2340" />
            <text x="207" y="134" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {t('visual.claimId')}
            </text>

            <rect x="25" y="248" width="130" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
            <text x="32" y="262" fill="#0f172a" fontSize="9" fontFamily="monospace" fontWeight="600">
              📍 21.4678° N, 83.9784° E
            </text>
          </svg>

          {/* Floating Live Verification Badges */}
          <div className="floating-metric-card top-right-card">
            <div className="metric-icon-box success">✓</div>
            <div className="metric-text-content">
              <span className="metric-title">{t('visual.temporalContinuity')}</span>
              <span className="metric-value">{t('visual.verified')}</span>
            </div>
          </div>

          <div className="floating-metric-card bottom-left-card">
            <div className="metric-icon-box navy">🛰️</div>
            <div className="metric-text-content">
              <span className="metric-title">{t('visual.cadastralBoundaryMatch')}</span>
              <span className="metric-value">{t('visual.hectares')}</span>
            </div>
          </div>
        </div>

        {/* Visual Footer Info Strip */}
        <div className="visual-bottom-bar">
          <div className="evidence-pill">
            <span className="pill-dot bg-green" />
            <span>{t('visual.ndviBaseline')}</span>
          </div>
          <div className="evidence-pill">
            <span className="pill-dot bg-amber" />
            <span>{t('visual.gramSabhaAudit')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
