import React from 'react';
import type { FRAClaim } from '../../types';

interface ActiveClaimPopupProps {
  claim: FRAClaim;
  onClose?: () => void;
  onInspectDetails?: () => void;
}

export const ActiveClaimPopup: React.FC<ActiveClaimPopupProps> = ({
  claim,
  onClose,
  onInspectDetails,
}) => {
  const assessment = claim.spatialAssessment;

  return (
    <div className="active-claim-popup" role="dialog" aria-label={`Active Claim Details: ${claim.id}`}>
      <div className="popup-header">
        <div className="popup-title-row">
          <span className="popup-status-dot"></span>
          <span className="popup-claim-id font-mono">{claim.id}</span>
          <span className="popup-active-tag">Active Plot</span>
        </div>
        {onClose && (
          <button
            type="button"
            className="popup-close-btn"
            onClick={onClose}
            aria-label="Close plot popup"
          >
            ×
          </button>
        )}
      </div>

      <div className="popup-body">
        <div className="popup-claimant-info">
          <div className="info-row">
            <span className="info-label">Claimant:</span>
            <strong className="info-value">{claim.claimantName}</strong>
          </div>
          <div className="info-row">
            <span className="info-label">Community:</span>
            <span className="info-value">{claim.tribeOrCommunity}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Extent:</span>
            <span className="info-value text-green font-mono font-bold">
              {claim.areaHectares.toFixed(2)} ha
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Land-use:</span>
            <span className="info-value text-amber font-semibold">
              Cultivation observed
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Evidence:</span>
            <span className={`status-badge badge-evidence-${claim.evidenceStatus.toLowerCase().replace(/\s+/g, '-')}`}>
              {claim.evidenceStatus}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Cadastral Ref:</span>
            <span className="info-value font-mono">
              {claim.khasraNumber || (assessment ? assessment.cadastralKhasraNo : 'Khasra Plot')}
            </span>
          </div>
        </div>

        <div className="popup-metrics-grid">
          <div className="popup-metric-item">
            <span className="metric-tag">Boundary Confidence</span>
            <strong className="metric-val text-green">
              {assessment ? `${assessment.boundaryConfidence} (${assessment.confidenceMargin})` : 'High (±3.2m)'}
            </strong>
          </div>
          <div className="popup-metric-item">
            <span className="metric-tag">LULC Consistency</span>
            <strong className="metric-val text-amber">
              {assessment ? assessment.landUseConsistency : 'Continuous'}
            </strong>
          </div>
        </div>

        <div className="popup-coords-row font-mono">
          <span>{claim.coordinates.lat.toFixed(4)}° N, {claim.coordinates.lng.toFixed(4)}° E</span>
          <span className="coord-chip">{claim.district}</span>
        </div>
      </div>

      {onInspectDetails && (
        <div className="popup-footer">
          <button
            type="button"
            className="popup-inspect-btn"
            onClick={onInspectDetails}
          >
            Review Spatial Evidence & Assessment ↓
          </button>
        </div>
      )}
    </div>
  );
};

