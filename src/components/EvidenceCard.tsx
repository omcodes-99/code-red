import React from 'react';
import type { EvidenceSummaryItem } from '../types';

interface EvidenceCardProps {
  evidenceItems: EvidenceSummaryItem[];
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidenceItems }) => {
  const getStatusBadge = (status: EvidenceSummaryItem['status'], label: string) => {
    switch (status) {
      case 'optimal':
        return <span className="evidence-badge badge-optimal">✓ {label}</span>;
      case 'moderate':
        return <span className="evidence-badge badge-moderate">ℹ {label}</span>;
      case 'action-required':
        return <span className="evidence-badge badge-action">⚠ {label}</span>;
      default:
        return <span className="evidence-badge">{label}</span>;
    }
  };

  const getTierIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return '🌱';
      case 1:
        return '🛰️';
      case 2:
        return '🗺️';
      case 3:
        return '⚖️';
      default:
        return '📊';
    }
  };

  return (
    <section className="evidence-section" id="evidence-section" aria-labelledby="evidence-heading">
      <div className="gov-container">
        <div className="section-header-row">
          <div>
            <div className="section-badge">EVIDENTIARY SYNTHESIS HIERARCHY</div>
            <h2 id="evidence-heading" className="section-title">
              Evidence Summary & Verification Indicators
            </h2>
            <p className="section-subtext">
              Four-tier geospatial corroboration framework structured for Gram Sabha, SDLC, and DLC verification
            </p>
          </div>
          <div className="evidence-audit-tag">
            <span>Supporting Evidence Protocol</span>
          </div>
        </div>

        {/* Evidence Hierarchy Summary Notice */}
        <div className="evidence-hierarchy-nav-strip">
          <div className="hierarchy-step">
            <span className="step-num">1</span>
            <span className="step-txt">Land-Use (LULC)</span>
          </div>
          <span className="step-arrow">→</span>
          <div className="hierarchy-step">
            <span className="step-num">2</span>
            <span className="step-txt">Historical Satellite</span>
          </div>
          <span className="step-arrow">→</span>
          <div className="hierarchy-step">
            <span className="step-num">3</span>
            <span className="step-txt">Spatial Overlap</span>
          </div>
          <span className="step-arrow">→</span>
          <div className="hierarchy-step">
            <span className="step-num">4</span>
            <span className="step-txt">Quality & Confidence</span>
          </div>
        </div>

        <div className="evidence-grid">
          {evidenceItems.map((item, index) => (
            <div key={item.id} className="evidence-card">
              <div className="evidence-card-header">
                <div className="evidence-title-group">
                  <span className="evidence-tier-badge">
                    {getTierIcon(index)} Tier {index + 1}
                  </span>
                  <h3 className="evidence-card-title">{item.title}</h3>
                  <p className="evidence-card-subtitle">{item.subtitle}</p>
                </div>
                {getStatusBadge(item.status, item.statusLabel)}
              </div>

              <div className="evidence-highlight-val">
                <span className="evidence-main-value">{item.value}</span>
              </div>

              <p className="evidence-description">{item.description}</p>

              <div className="evidence-metrics-row">
                {item.metrics.map((metric, idx) => (
                  <div key={idx} className="evidence-metric-item">
                    <span className="metric-tag">{metric.label}:</span>
                    <strong className="metric-data font-mono">{metric.val}</strong>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Decision Support Safeguard Note */}
        <div className="evidence-footer-disclaimer-note">
          <span className="note-icon" aria-hidden="true">ℹ️</span>
          <p>
            <strong>Statutory Safeguard:</strong> Geospatial indices and algorithmic consistency scores provide objective physical context to assist human review. They do not automatically approve or reject Forest Rights Act claims; final determination rests exclusively with the statutory authorities.
          </p>
        </div>
      </div>
    </section>
  );
};

