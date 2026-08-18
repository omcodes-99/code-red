import React from 'react';

interface MapControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  showCrosshair: boolean;
  onToggleCrosshair: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetView,
  isExpanded,
  onToggleExpanded,
  showCrosshair,
  onToggleCrosshair,
}) => {
  return (
    <div className="gis-map-controls" aria-label="GIS Map Viewport Controls">
      <div className="control-btn-group">
        <button
          type="button"
          className="gis-control-btn"
          onClick={onZoomIn}
          title="Zoom In (Increase Resolution)"
          aria-label="Zoom in on map"
        >
          <span className="control-icon">+</span>
        </button>

        <div className="zoom-level-badge font-mono" title={`Current Zoom: ${zoomLevel.toFixed(1)}x`}>
          {zoomLevel.toFixed(1)}x
        </div>

        <button
          type="button"
          className="gis-control-btn"
          onClick={onZoomOut}
          title="Zoom Out (Broader View)"
          aria-label="Zoom out of map"
        >
          <span className="control-icon">−</span>
        </button>
      </div>

      <div className="control-divider"></div>

      <div className="control-btn-group">
        <button
          type="button"
          className="gis-control-btn"
          onClick={onResetView}
          title="Reset View (Center Active Claim)"
          aria-label="Reset map view to default"
        >
          <span className="control-icon" style={{ fontSize: '14px' }}>⟲</span>
        </button>

        <button
          type="button"
          className={`gis-control-btn ${showCrosshair ? 'active' : ''}`}
          onClick={onToggleCrosshair}
          title="Toggle Inspection Crosshair Grid"
          aria-label="Toggle inspection crosshair"
        >
          <span className="control-icon" style={{ fontSize: '13px' }}>⌖</span>
        </button>

        <button
          type="button"
          className={`gis-control-btn ${isExpanded ? 'active' : ''}`}
          onClick={onToggleExpanded}
          title={isExpanded ? 'Collapse Map View' : 'Expand Fullscreen Map View'}
          aria-label="Toggle expanded map view"
        >
          <span className="control-icon" style={{ fontSize: '12px' }}>
            {isExpanded ? '🗗' : '⛶'}
          </span>
        </button>
      </div>
    </div>
  );
};
