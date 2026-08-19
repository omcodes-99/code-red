import React from 'react';
import type { FRAClaim } from '../../types';

interface EvidenceAssessmentProps {
  claim: FRAClaim;
}

export const EvidenceAssessment: React.FC<EvidenceAssessmentProps> = ({ claim }) => {
  const assessment = claim.spatialAssessment || {
    boundaryConfidence: 'High',
    confidenceMargin: '±3.2m',
    landUseConsistency: 'Continuous',
    satelliteEvidence: 'Available',
    satelliteObservationCount: '9 Seasons / 38 Passes',
    cadastralMatch: 'Strong',
    protectedAreaOverlapHectares: 0.00,
    forestOverlapHectares: 1.86,
    potentialConflictHectares: 0.12,
    cadastralKhasraNo: '142/3 (Plot A-9)',
    forestCompartmentNo: 'RF Compartment No. 42',
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'High':
        return <span className="status-badge badge-evidence-strong">High</span>;
      case 'Moderate':
        return <span className="status-badge badge-evidence-moderate">Moderate</span>;
      case 'Low':
        return <span className="status-badge badge-evidence-low">Attention Required</span>;
      default:
        return <span className="status-badge">{confidence}</span>;
    }
  };

  const getMatchBadge = (match: string) => {
    switch (match) {
      case 'Strong':
        return <span className="status-badge badge-evidence-strong">Strong</span>;
      case 'Moderate':
        return <span className="status-badge badge-evidence-moderate">Moderate</span>;
      default:
        return <span className="status-badge badge-review-alert">Attention Required</span>;
    }
  };

  const isProtectedOverlapZero = assessment.protectedAreaOverlapHectares === 0;

  return (
    <div className="spatial-evidence-assessment-card" aria-label="Spatial Evidence Assessment Panel">
      <div className="assessment-header">
        <div className="assessment-title-group">
          <div className="assessment-badge-tag">Statutory Synthesis</div>
          <h3 className="assessment-title">Spatial Evidence Assessment</h3>
          <p className="assessment-subtext">
            Geospatial correlation metrics across cadastral, forest boundary, and satellite records for{' '}
            <strong className="font-mono">{claim.id}</strong>
          </p>
        </div>
        <div className="assessment-status-pill">
          <span className="pill-dot"></span>
          <span>Decision Support Aid</span>
        </div>
      </div>

      <div className="assessment-metrics-grid">
        {/* 1. Boundary Confidence */}
        <div className="assessment-metric-card">
          <div className="metric-header-row">
            <span className="metric-title">Boundary Confidence</span>
            {getConfidenceBadge(assessment.boundaryConfidence)}
          </div>
          <div className="metric-main-value font-mono">
            {assessment.boundaryConfidence} <span className="sub-val">({assessment.confidenceMargin})</span>
          </div>
          <p className="metric-desc">
            Georeferenced GPS perimeter tolerance within prescribed SDLC survey accuracy limits.
          </p>
        </div>

        {/* 2. Land-use Consistency */}
        <div className="assessment-metric-card">
          <div className="metric-header-row">
            <span className="metric-title">Land-use Consistency</span>
            <span className="status-badge badge-evidence-strong">Strong</span>
          </div>
          <div className="metric-main-value text-green">
            {assessment.landUseConsistency}
          </div>
          <p className="metric-desc">
            Multi-year vegetative signature demonstrates uninterrupted customary agricultural use.
          </p>
        </div>

        {/* 3. Satellite Evidence */}
        <div className="assessment-metric-card">
          <div className="metric-header-row">
            <span className="metric-title">Satellite Evidence</span>
            <span className="status-badge badge-review-ready">Available</span>
          </div>
          <div className="metric-main-value text-navy">
            {assessment.satelliteEvidence}
          </div>
          <p className="metric-desc font-mono">
            {assessment.satelliteObservationCount}
          </p>
        </div>

        {/* 4. Cadastral Match */}
        <div className="assessment-metric-card">
          <div className="metric-header-row">
            <span className="metric-title">Cadastral Match</span>
            {getMatchBadge(assessment.cadastralMatch)}
          </div>
          <div className="metric-main-value">
            {assessment.cadastralMatch}
          </div>
          <p className="metric-desc">
            Aligned with Revenue Khasra <strong className="font-mono">{assessment.cadastralKhasraNo}</strong>.
          </p>
        </div>

        {/* 5. Protected Area Overlap */}
        <div className="assessment-metric-card">
          <div className="metric-header-row">
            <span className="metric-title">Protected Area Overlap</span>
            <span className={`status-badge ${isProtectedOverlapZero ? 'badge-evidence-strong' : 'badge-review-alert'}`}>
              {isProtectedOverlapZero ? 'None' : 'Attention Required'}
            </span>
          </div>
          <div className={`metric-main-value font-mono ${isProtectedOverlapZero ? 'text-green' : 'text-red'}`}>
            {isProtectedOverlapZero ? 'None' : `${assessment.protectedAreaOverlapHectares.toFixed(2)} ha`}
          </div>
          <p className="metric-desc">
            Zero intersection with Core Tiger Reserve or Wildlife Sanctuary boundaries.
          </p>
        </div>

        {/* 6. Potential Conflict */}
        <div className="assessment-metric-card">
          <div className="metric-header-row">
            <span className="metric-title">Potential Conflict</span>
            <span className={`status-badge ${assessment.potentialConflictHectares > 0.3 ? 'badge-review-alert' : assessment.potentialConflictHectares > 0 ? 'badge-evidence-moderate' : 'badge-evidence-strong'}`}>
              {assessment.potentialConflictHectares > 0.3 ? 'Attention Required' : assessment.potentialConflictHectares > 0 ? 'Moderate' : 'Strong'}
            </span>
          </div>
          <div className={`metric-main-value font-mono ${assessment.potentialConflictHectares > 0.2 ? 'text-red' : assessment.potentialConflictHectares > 0 ? 'text-amber' : 'text-green'}`}>
            {assessment.potentialConflictHectares > 0 ? `${assessment.potentialConflictHectares.toFixed(2)} ha` : 'None (0.00 ha)'}
          </div>
          <p className="metric-desc">
            Boundary buffer intersection with {assessment.forestCompartmentNo}.
          </p>
        </div>
      </div>

      <div className="assessment-footer-note">
        <span className="note-icon" aria-hidden="true">ℹ️</span>
        <p>
          These indicators are supporting evidence for human verification and do not determine legal eligibility.
        </p>
      </div>
    </div>
  );
};

