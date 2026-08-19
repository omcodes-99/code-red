import React, { useState } from 'react';
import type { FRAClaim, MapLayerState } from '../../types';
import { MapHeader } from './MapHeader';
import { ClaimSelector } from './ClaimSelector';
import { GisMap } from './GisMap';
import { MapLayersPanel } from './MapLayersPanel';
import { MapControls } from './MapControls';
import { MapLegend } from './MapLegend';
import { EvidenceAssessment } from './EvidenceAssessment';
import { TemporalEvidence } from './TemporalEvidence';
import { SpatialSummary } from './SpatialSummary';

interface MapExplorerProps {
  claims: FRAClaim[];
  selectedClaim: FRAClaim;
  onSelectClaim: (claim: FRAClaim) => void;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({
  claims,
  selectedClaim,
  onSelectClaim,
}) => {
  const [layerState, setLayerState] = useState<MapLayerState>({
    forestLulc: true,
    claimBoundary: true,
    cadastralParcels: true,
    forestCompartment: true,
    protectedAreas: false,
    satelliteEvidence: true,
    potentialConflict: true,
  });

  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showCrosshair, setShowCrosshair] = useState<boolean>(false);

  const handleToggleLayer = (key: keyof MapLayerState) => {
    setLayerState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSetPreset = (preset: 'all' | 'cadastral' | 'conflict' | 'satellite') => {
    switch (preset) {
      case 'all':
        setLayerState({
          forestLulc: true,
          claimBoundary: true,
          cadastralParcels: true,
          forestCompartment: true,
          protectedAreas: true,
          satelliteEvidence: true,
          potentialConflict: true,
        });
        break;
      case 'cadastral':
        setLayerState({
          forestLulc: false,
          claimBoundary: true,
          cadastralParcels: true,
          forestCompartment: false,
          protectedAreas: false,
          satelliteEvidence: false,
          potentialConflict: false,
        });
        break;
      case 'satellite':
        setLayerState({
          forestLulc: true,
          claimBoundary: true,
          cadastralParcels: false,
          forestCompartment: false,
          protectedAreas: false,
          satelliteEvidence: true,
          potentialConflict: false,
        });
        break;
      case 'conflict':
        setLayerState({
          forestLulc: false,
          claimBoundary: true,
          cadastralParcels: true,
          forestCompartment: true,
          protectedAreas: true,
          satelliteEvidence: false,
          potentialConflict: true,
        });
        break;
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(2.5, +(prev + 0.25).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.75, +(prev - 0.25).toFixed(2)));
  };

  const handleResetView = () => {
    setZoomLevel(1.0);
  };

  const handleScrollToAssessment = () => {
    const el = document.getElementById('spatial-assessment-block');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className={`map-explorer-section ${isExpanded ? 'map-expanded-mode' : ''}`}
      id="map-section"
      aria-labelledby="map-explorer-heading"
    >
      <div className="gov-container">
        {/* 1. Official Page Header */}
        <MapHeader selectedClaim={selectedClaim} />

        {/* 2. Active Case Record Selector Strip */}
        <ClaimSelector
          claims={claims}
          selectedClaim={selectedClaim}
          onSelectClaim={onSelectClaim}
        />

        {/* 3. GIS Map Main Viewport Frame */}
        <div className="map-workspace-card">
          <div className="map-main-viewport">
            <GisMap
              selectedClaim={selectedClaim}
              layerState={layerState}
              zoomLevel={zoomLevel}
              showCrosshair={showCrosshair}
              onInspectDetails={handleScrollToAssessment}
            />

            {/* In-viewport Interactive GIS Controls */}
            <MapControls
              zoomLevel={zoomLevel}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetView={handleResetView}
              isExpanded={isExpanded}
              onToggleExpanded={() => setIsExpanded(!isExpanded)}
              showCrosshair={showCrosshair}
              onToggleCrosshair={() => setShowCrosshair(!showCrosshair)}
            />
          </div>

          {/* Map Footer Bar: Synchronized Multi-Symbology Legend */}
          <div className="map-workspace-footer">
            <MapLegend layerState={layerState} />
            <div className="map-footer-coords-tag font-mono">
              Projection: WGS 84 / UTM Zone 45N • Datum: GRS 1980
            </div>
          </div>
        </div>

        {/* 4. Below-the-Map Grid: [ Map Layers ] Alongside [ Spatial Evidence Assessment ] */}
        <div className="map-analysis-dual-grid mb-6">
          <div className="map-dual-col-left">
            <aside aria-label="Map Layers Control">
              <MapLayersPanel
                layerState={layerState}
                onToggleLayer={handleToggleLayer}
                onSetPreset={handleSetPreset}
              />
            </aside>
          </div>

          <div className="map-dual-col-right" id="spatial-assessment-block">
            <EvidenceAssessment claim={selectedClaim} />
          </div>
        </div>

        {/* 5. Multi-Temporal Land-Use Evidence (2018–2025 Historical Timeline) */}
        <div className="mb-6">
          <TemporalEvidence claim={selectedClaim} />
        </div>

        {/* 6. Spatial Analysis Summary Cards */}
        <div className="mb-6">
          <SpatialSummary claim={selectedClaim} />
        </div>

        {/* 7. Important Legal Disclaimer */}
        <div className="map-legal-disclaimer-card" role="note" aria-label="Statutory Decision Support Disclaimer">
          <div className="disclaimer-header">
            <span className="disclaimer-icon" aria-hidden="true">⚖️</span>
            <h4 className="disclaimer-title">Decision Support Only</h4>
          </div>
          <p className="disclaimer-text">
            BhoomiDrishti provides geospatial and historical information as supporting evidence for human review. It does not automatically approve or reject Forest Rights Act claims.
          </p>
        </div>
      </div>
    </section>
  );
};

