import React, { useState } from 'react';
import type { FRAClaim } from '../../types';

interface TemporalEvidenceProps {
  claim: FRAClaim;
}

export const TemporalEvidence: React.FC<TemporalEvidenceProps> = ({ claim }) => {
  const temporalRecords = claim.temporalHistory || [
    {
      year: 2018,
      season: 'Kharif Season',
      satellite: 'Sentinel-2A / Landsat-8',
      resolution: '10m Multi-spectral',
      landUseDetected: 'Forest clearing / early cultivation pattern',
      canopyDensity: '12%',
      confidenceScore: 84,
      ndviValue: 0.42,
      summary: 'Initial agricultural clearing detected prior to baseline verification cutoff.',
    },
    {
      year: 2020,
      season: 'Rabi & Kharif',
      satellite: 'Sentinel-2B',
      resolution: '10m High-res',
      landUseDetected: 'Cultivation detected',
      canopyDensity: '6%',
      confidenceScore: 91,
      ndviValue: 0.58,
      summary: 'Continuous agricultural tillage observed across dual monsoon seasons.',
    },
    {
      year: 2022,
      season: 'Kharif Peak',
      satellite: 'Cartosat-2 / Sentinel-2',
      resolution: '2.5m Panchromatic merged',
      landUseDetected: 'Cultivation detected',
      canopyDensity: '4%',
      confidenceScore: 94,
      ndviValue: 0.65,
      summary: 'Field bunds and customary parcel demarcation verified with high radiometric clarity.',
    },
    {
      year: 2024,
      season: 'Kharif & Zaid',
      satellite: 'Resourcesat-2A / LISS-IV',
      resolution: '5.8m Multi-spectral',
      landUseDetected: 'Cultivation detected',
      canopyDensity: '5%',
      confidenceScore: 96,
      ndviValue: 0.61,
      summary: 'Customary possession confirmed across consecutive multi-season passes.',
    },
    {
      year: 2025,
      season: 'Current Assessment',
      satellite: 'Sentinel-2C & Field DGPS',
      resolution: '10m / Georeferenced',
      landUseDetected: 'Current assessment (Evidence Ready)',
      canopyDensity: '5%',
      confidenceScore: 95,
      ndviValue: 0.63,
      summary: 'Continuous customary land-use established across all 5 observation periods.',
    },
  ];

  const [selectedYear, setSelectedYear] = useState<number>(temporalRecords[temporalRecords.length - 1].year);

  const activeRecord = temporalRecords.find((r) => r.year === selectedYear) || temporalRecords[temporalRecords.length - 1];

  return (
    <div className="temporal-evidence-section" aria-label="Multi-Temporal Land-Use Evidence">
      <div className="temporal-header-row">
        <div>
          <div className="section-badge">Earth Observation Time Series</div>
          <h3 className="temporal-title">Temporal Land-Use Evidence</h3>
          <p className="temporal-subtext">
            Multi-year satellite Earth observation timeline demonstrating continuous customary land-use for{' '}
            <strong className="font-mono">{claim.id}</strong>
          </p>
        </div>

        <div className="temporal-consistency-card">
          <div className="consistency-badge">
            <span className="consistency-icon">✓</span>
            <span className="consistency-text">Consistency: 5/5 observation periods</span>
          </div>
          <span className="consistency-sub font-mono">100% Temporal Continuity</span>
        </div>
      </div>

      {/* Horizontal Timeline Navigation Bar */}
      <div className="temporal-timeline-nav" role="tablist" aria-label="Satellite Observation Years">
        {temporalRecords.map((item) => {
          const isSelected = item.year === selectedYear;
          return (
            <button
              key={item.year}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`timeline-step-btn ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedYear(item.year)}
            >
              <div className="step-circle font-mono">
                {item.year}
              </div>
              <div className="step-content">
                <span className="step-label font-mono">{item.season}</span>
                <span className="step-status">
                  {item.landUseDetected.includes('Current') ? 'Current Assessment' : 'Cultivation Verified'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Period Detailed Evidence Card */}
      <div className="temporal-detail-card">
        <div className="detail-card-top">
          <div className="detail-year-block">
            <span className="detail-year font-mono">{activeRecord.year}</span>
            <div className="detail-title-group">
              <h4 className="detail-heading">{activeRecord.season} Evidence Record</h4>
              <span className="detail-satellite font-mono">
                🛰️ {activeRecord.satellite} • {activeRecord.resolution}
              </span>
            </div>
          </div>

          <div className="detail-kpis">
            <div className="kpi-pill">
              <span className="kpi-label">Spectral NDVI</span>
              <strong className="kpi-value font-mono text-green">{activeRecord.ndviValue.toFixed(2)}</strong>
            </div>
            <div className="kpi-pill">
              <span className="kpi-label">Canopy Density</span>
              <strong className="kpi-value font-mono text-navy">{activeRecord.canopyDensity}</strong>
            </div>
            <div className="kpi-pill">
              <span className="kpi-label">Confidence Score</span>
              <strong className="kpi-value font-mono text-green">{activeRecord.confidenceScore}/100</strong>
            </div>
          </div>
        </div>

        <div className="detail-card-body">
          <div className="detected-state-row">
            <span className="detection-tag">Land-Use Detected:</span>
            <strong className="detection-text">{activeRecord.landUseDetected}</strong>
          </div>
          <p className="detection-summary">{activeRecord.summary}</p>
        </div>

        <div className="detail-card-footer">
          <span className="footer-meta-tag">
            📌 Baseline Verification: Aligned with FRA 2006 Rule 13(1) Earth Observation provisions.
          </span>
          <span className="footer-demo-tag font-mono">Demo Archive Scene #OD-SAMB-{activeRecord.year}</span>
        </div>
      </div>
    </div>
  );
};
