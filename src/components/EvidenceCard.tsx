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

  return (
    <section className="evidence-section" id="evidence-section" aria-labelledby="evidence-heading">
      <div className="gov-container">
        <div className="section-header-row">
          <div>
            <div className="section-badge">Evidentiary Synthesis</div>
            <h2 id="evidence-heading" className="section-title">
              Evidence Summary & Verification Indicators
            </h2>
            <p className="section-subtext">
              Multi-source geospatial correlation and temporal verification pipeline for Forest Rights Act claim evaluation
            </p>
          </div>
          <div className="evidence-audit-tag">
            <span>Automated Pre-Screening v1.0</span>
          </div>
        </div>

        <div className="evidence-grid">
          {evidenceItems.map((item) => (
            <div key={item.id} className="evidence-card">
              <div className="evidence-card-header">
                <div>
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
                    <strong className="metric-data">{metric.val}</strong>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
