import React from 'react';
import type { FRAClaim } from '../../types';

interface SpatialSummaryProps {
  claim: FRAClaim;
}

export const SpatialSummary: React.FC<SpatialSummaryProps> = ({ claim }) => {
  const assessment = claim.spatialAssessment;

  const claimArea = claim.areaHectares;
  const forestOverlap = assessment ? assessment.forestOverlapHectares : (claimArea * 0.76);
  const protectedOverlap = assessment ? assessment.protectedAreaOverlapHectares : 0.00;
  const potentialConflict = assessment ? assessment.potentialConflictHectares : 0.12;
  const evidenceQuality = claim.evidenceStatus || 'Moderate';

  const summaryCards = [
    {
      id: 'claim-area',
      title: 'Claim Area',
      value: `${claimArea.toFixed(2)} ha`,
      subtext: `Demarcated plot for ${claim.id}`,
      badgeText: claim.claimType === 'Individual (IFR)' ? 'IFR Parcel' : 'CFR Area',
      colorTheme: 'blue',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      ),
    },
    {
      id: 'forest-overlap',
      title: 'Forest/LULC Overlap',
      value: `${forestOverlap.toFixed(2)} ha`,
      subtext: 'Forest land boundary intersection',
      badgeText: 'Customary Forest',
      colorTheme: 'green',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L4 14h4v8h8v-8h4L12 2z"></path>
        </svg>
      ),
    },
    {
      id: 'protected-area',
      title: 'Protected Area Overlap',
      value: `${protectedOverlap.toFixed(2)} ha`,
      subtext: 'Sanctuary or Core Reserve intersection',
      badgeText: protectedOverlap === 0 ? 'Nil Overlap' : 'Attention Required',
      colorTheme: protectedOverlap === 0 ? 'green' : 'red',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
    },
    {
      id: 'potential-conflict',
      title: 'Potential Conflict',
      value: `${potentialConflict.toFixed(2)} ha`,
      subtext: 'Dispute zone or buffer intersection',
      badgeText: potentialConflict > 0.2 ? 'Attention Required' : potentialConflict > 0 ? 'Buffer Overlap' : 'Clear',
      colorTheme: potentialConflict > 0.2 ? 'red' : potentialConflict > 0 ? 'amber' : 'green',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      ),
    },
    {
      id: 'evidence-quality',
      title: 'Evidence Quality',
      value: evidenceQuality,
      subtext: 'Composite radiometric & spatial score',
      badgeText: evidenceQuality === 'Strong' ? 'High Fidelity' : evidenceQuality === 'Moderate' ? 'Verified' : 'Under Review',
      colorTheme: evidenceQuality === 'Strong' ? 'green' : evidenceQuality === 'Moderate' ? 'blue' : 'amber',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 14 14"></polyline>
        </svg>
      ),
    },
  ];

  return (
    <div className="spatial-summary-section" aria-label="Spatial Analysis Summary Cards">
      <div className="spatial-summary-header">
        <h4 className="spatial-summary-title">Spatial Analysis Summary</h4>
        <span className="spatial-summary-tag">Geospatial Overlay Summary</span>
      </div>

      <div className="spatial-summary-grid">
        {summaryCards.map((card) => (
          <div key={card.id} className={`stat-card stat-card--${card.colorTheme}`}>
            <div className="stat-card-top">
              <span className="stat-card-icon" aria-hidden="true">
                {card.icon}
              </span>
              <span className={`stat-badge stat-badge--${card.colorTheme}`}>
                {card.badgeText}
              </span>
            </div>
            <div className="stat-value-container">
              <span className="stat-number font-mono">{card.value}</span>
            </div>
            <h3 className="stat-card-title">{card.title}</h3>
            <p className="stat-card-subtext">{card.subtext}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

