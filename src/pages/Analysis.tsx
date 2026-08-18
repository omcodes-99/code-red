import React, { useState } from 'react';
import { useNavigation } from '../router';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Alert } from '../components/common/Alert';
import { mockClaims } from '../data/mockData';

export const Analysis: React.FC = () => {
  const { navigate } = useNavigation();
  const [selectedClaimId, setSelectedClaimId] = useState<string>('FRA-2025-001');
  const [selectedYear, setSelectedYear] = useState<string>('2024');

  const activeClaim = mockClaims.find((c) => c.id === selectedClaimId) || mockClaims[0];

  return (
    <div className="page-analysis">
      {/* Banner */}
      <div className="gov-page-banner">
        <div className="gov-container">
          <div className="banner-breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Evidence Analysis Workbench</span>
          </div>
          <h1 className="banner-page-title">Geospatial Evidence Analysis Workbench</h1>
          <p className="banner-page-subtitle">
            Multi-temporal satellite synthesis, boundary overlap inspection, and evidentiary confidence scoring
          </p>
        </div>
      </div>

      <div className="gov-container page-content-container">
        {/* Developer Integration Note */}
        <div className="dev-handover-notice">
          <Badge variant="saffron">Developer Notice</Badge>
          <p>
            <strong>Frontend Developer 3 Module:</strong> This screen serves as the dedicated spatial and evidence analysis workbench placeholder. Person 3 can integrate advanced GIS map toolbars, spectral NDVI charts, temporal sliders, and ML model outputs here.
          </p>
        </div>

        {/* Claim Selector Header */}
        <div className="analysis-selector-bar">
          <div className="selector-field">
            <label htmlFor="claim-select-input" className="selector-label">
              Active Claim for Analysis:
            </label>
            <select
              id="claim-select-input"
              value={selectedClaimId}
              onChange={(e) => setSelectedClaimId(e.target.value)}
              className="gov-select-field selector-dropdown"
            >
              {mockClaims.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.claimantName} ({c.claimType}, {c.district})
                </option>
              ))}
            </select>
          </div>

          <div className="selector-tags">
            <Badge variant="navy">Village: {activeClaim.gramPanchayat}</Badge>
            <Badge variant="info">Area: {activeClaim.areaHectares} ha</Badge>
            <Badge variant={activeClaim.evidenceStatus === 'Strong' ? 'success' : 'warning'}>
              Status: {activeClaim.evidenceStatus}
            </Badge>
          </div>
        </div>

        {/* 2-Column Workbench Grid */}
        <div className="workbench-grid mb-6">
          {/* Left Column: Spatial Analysis Viewport */}
          <div className="workbench-left-col">
            <Card
              title="Spatial Layer Analysis Viewport"
              subtitle={`Cadastral parcel & Satellite overlay for ${activeClaim.id}`}
              variant="bordered"
              badge={<Badge variant="success">Georeferenced</Badge>}
            >
              <div className="workbench-map-box">
                {/* Temporal Time Slider Controls */}
                <div className="temporal-slider-bar">
                  <span className="temporal-label">Historical Time Baseline:</span>
                  <div className="year-pills">
                    {['2005 (Baseline)', '2010', '2015', '2020', '2024 (Current)'].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        className={`year-pill ${selectedYear === yr.split(' ')[0] ? 'active' : ''}`}
                        onClick={() => setSelectedYear(yr.split(' ')[0])}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spatial Map Diagram */}
                <div className="workbench-canvas-frame">
                  <div className="canvas-crosshair top-left">+</div>
                  <div className="canvas-crosshair top-right">+</div>
                  <div className="canvas-crosshair bottom-left">+</div>
                  <div className="canvas-crosshair bottom-right">+</div>

                  <div className="canvas-center-badge">
                    <h4>{activeClaim.claimantName}</h4>
                    <p className="font-mono">Lat: {activeClaim.coordinates.lat}° N, Lng: {activeClaim.coordinates.lng}° E</p>
                    <span className="cadastral-match-text">✓ Continuous Cultivation detected in {selectedYear}</span>
                  </div>

                  <div className="canvas-layers-legend">
                    <span className="legend-item"><span className="dot bg-green" /> Parcel Polygon</span>
                    <span className="legend-item"><span className="dot bg-amber" /> RF #42 Boundary</span>
                    <span className="legend-item"><span className="dot bg-blue" /> Cadastral Grid</span>
                  </div>
                </div>

                {/* Layer Toggle Strip */}
                <div className="layer-toggles-strip">
                  <label className="toggle-checkbox">
                    <input type="checkbox" defaultChecked />
                    <span>NDVI Vegetation Index</span>
                  </label>
                  <label className="toggle-checkbox">
                    <input type="checkbox" defaultChecked />
                    <span>Cadastral Survey Layer</span>
                  </label>
                  <label className="toggle-checkbox">
                    <input type="checkbox" defaultChecked />
                    <span>Forest Compartment Boundaries</span>
                  </label>
                  <label className="toggle-checkbox">
                    <input type="checkbox" />
                    <span>Waterbody & Drainage Proximity</span>
                  </label>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Evidentiary Audit Scores */}
          <div className="workbench-right-col">
            <Card
              title="Evidentiary Synthesis Scorecard"
              subtitle="Algorithmic indicators for committee review"
              variant="accent-navy"
              className="mb-6"
            >
              <div className="score-summary-box">
                <div className="score-number-big">84<span className="score-denom">/100</span></div>
                <div className="score-desc">
                  <strong>High Confidence Score</strong>
                  <p>Satisfies multi-temporal consistency criteria under FRA Rule 12A.</p>
                </div>
              </div>

              <div className="indicator-progress-list">
                <div className="progress-row">
                  <div className="progress-labels">
                    <span>Pre-2005 Cultivation Baseline</span>
                    <strong>92% (Consistent)</strong>
                  </div>
                  <div className="progress-track"><div className="progress-fill fill-green" style={{ width: '92%' }} /></div>
                </div>

                <div className="progress-row">
                  <div className="progress-labels">
                    <span>Canopy Clearance Stability</span>
                    <strong>85% (Continuous)</strong>
                  </div>
                  <div className="progress-track"><div className="progress-fill fill-green" style={{ width: '85%' }} /></div>
                </div>

                <div className="progress-row">
                  <div className="progress-labels">
                    <span>Cadastral Boundary Alignment</span>
                    <strong>78% (Minor Edge Overlap)</strong>
                  </div>
                  <div className="progress-track"><div className="progress-fill fill-amber" style={{ width: '78%' }} /></div>
                </div>

                <div className="progress-row">
                  <div className="progress-labels">
                    <span>Documentary Record Validation</span>
                    <strong>80% (Quorum Met)</strong>
                  </div>
                  <div className="progress-track"><div className="progress-fill fill-green" style={{ width: '80%' }} /></div>
                </div>
              </div>
            </Card>

            <Card
              title="Statutory Scrutiny Checklist"
              subtitle="SDLC / DLC Review Items"
              variant="bordered"
            >
              <ul className="statutory-checklist">
                <li className="checklist-item done">
                  <span className="check-icon">✓</span>
                  <span>Gram Sabha verification resolution verified on record</span>
                </li>
                <li className="checklist-item done">
                  <span className="check-icon">✓</span>
                  <span>No recorded overlap with Critical Wildlife Habitat (CWH)</span>
                </li>
                <li className="checklist-item pending">
                  <span className="check-icon">⏳</span>
                  <span>Awaiting Sub-Divisional Officer (SDO) joint field signature</span>
                </li>
              </ul>

              <div className="mt-4">
                <Button variant="primary" fullWidth onClick={() => alert('Demo: Evidentiary Dossier exported as PDF for SDLC meeting.')}>
                  Generate SDLC Evidence Dossier (PDF)
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <Alert type="notice" title="Human-in-the-Loop Safeguard">
          Algorithmic scores are purely evidentiary aids. The final determination of title remains exclusively with the Sub-Divisional and District Level Committees.
        </Alert>
      </div>
    </div>
  );
};
