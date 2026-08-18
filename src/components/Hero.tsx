import React from 'react';

interface HeroProps {
  onViewClaimsClick?: () => void;
  onExploreMapClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewClaimsClick, onExploreMapClick }) => {
  const handleScroll = (id: string, callback?: () => void) => {
    if (callback) {
      callback();
    }
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-banner" aria-labelledby="hero-heading">
      <div className="gov-container hero-inner">
        <div className="hero-content">
          <div className="hero-meta-bar">
            <span className="hero-dept-tag">FRA 2006 Portal</span>
            <span className="meta-sep">•</span>
            <span className="hero-district-tag">Pilot Region: Sambalpur & Mayurbhanj (Odisha)</span>
          </div>

          <h1 id="hero-heading" className="hero-title">
            Forest Rights Claim Decision Support
          </h1>

          <p className="hero-subtitle">
            Evidence-backed geospatial assessment for transparent and informed claim verification.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleScroll('claims-section', onViewClaimsClick)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              View Claims
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleScroll('map-section', onExploreMapClick)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
              </svg>
              Explore Map
            </button>
          </div>
        </div>

        <div className="hero-badges-aside" aria-hidden="true">
          <div className="hero-badge-card">
            <div className="badge-card-header">
              <span className="badge-card-icon">🛰️</span>
              <span className="badge-card-title">Geospatial Audit</span>
            </div>
            <p className="badge-card-text">
              Multi-temporal Earth Observation cross-matching with Cadastral & Forest Compartment boundary layers.
            </p>
          </div>

          <div className="hero-badge-card">
            <div className="badge-card-header">
              <span className="badge-card-icon">⚖️</span>
              <span className="badge-card-title">Statutory Alignment</span>
            </div>
            <p className="badge-card-text">
              Structured to assist Sub-Divisional (SDLC) & District Level Committees (DLC) in evidence synthesis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
