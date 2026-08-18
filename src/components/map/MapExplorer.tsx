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
    satelliteEvidence: false,
    potentialConflict: true,
  });

  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showCrosshair, setShowCrosshair] = useState<boolean>(false);
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState<boolean>(true);

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
        {/* 1. Official Header */}
        <MapHeader selectedClaim={selectedClaim} />

        {/* 2. Active Case Record Selector Strip */}
        <ClaimSelector
          claims={claims}
          selectedClaim={selectedClaim}
          onSelectClaim={onSelectClaim}
        />

        {/* 3. Main Map Workspace Layout */}
        <div className="map-workspace-card">
          <div className="map-workspace-grid">
            {/* Left/Main Map Container */}
            <div className="map-main-viewport">
              <GisMap
                selectedClaim={selectedClaim}
                layerState={layerState}
                zoomLevel={zoomLevel}
                showCrosshair={showCrosshair}
                onInspectDetails={handleScrollToAssessment}
              />

              {/* In-viewport Interactive Controls */}
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

              {/* Mobile/Tablet Layer Panel Toggle Trigger */}
              <button
                type="button"
                className="layers-toggle-drawer-btn"
                onClick={() => setIsLayersPanelOpen(!isLayersPanelOpen)}
                aria-expanded={isLayersPanelOpen}
              >
                🥞 {isLayersPanelOpen ? 'Hide Layers' : 'Show Layers'}
              </button>
            </div>

            {/* Right Side Map Layers Control Panel */}
            {isLayersPanelOpen && (
              <aside className="map-sidebar-layers" aria-label="Map Layer Settings">
                <MapLayersPanel
                  layerState={layerState}
                  onToggleLayer={handleToggleLayer}
                  onSetPreset={handleSetPreset}
                />
              </aside>
            )}
          </div>

          {/* Map Footer Bar: Synchronized Legend */}
          <div className="map-workspace-footer">
            <MapLegend layerState={layerState} />
            <div className="map-footer-coords-tag font-mono">
              Projection: WGS 84 / UTM Zone 45N • Datum: GRS 1980
            </div>
          </div>
        </div>

        {/* 4. Spatial Summary Cards */}
        <SpatialSummary claim={selectedClaim} />

        {/* 5. Spatial Evidence Assessment Panel */}
        <div id="spatial-assessment-block">
          <EvidenceAssessment claim={selectedClaim} />
        </div>

        {/* 6. Multi-Temporal Land-Use Evidence (2018–2025 Timeline) */}
        <TemporalEvidence claim={selectedClaim} />
      </div>
    </section>
  );
};
