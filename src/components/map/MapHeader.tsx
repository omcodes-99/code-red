import React from 'react';
import type { FRAClaim } from '../../types';

interface MapHeaderProps {
  selectedClaim: FRAClaim;
}

export const MapHeader: React.FC<MapHeaderProps> = ({ selectedClaim }) => {
  return (
    <div className="map-explorer-header-block">
      <div className="header-left">
        <div className="section-badge">SPATIAL INTELLIGENCE</div>
        <h2 id="map-explorer-heading" className="section-title">
          Spatial Evidence Map
        </h2>
        <p className="section-subtext">
          Multi-layer cadastral and satellite land-use evidence visualizer
        </p>
      </div>

      <div className="map-header-location">
        <div className="location-pill" title="Pilot Verification Zone">
          <span className="location-pin" aria-hidden="true">📍</span>
          <span>{selectedClaim.district}, Odisha</span>
        </div>
        <span className="demo-data-badge" title="Demonstration GIS Prototype Data Only">
          Demo GIS Data
        </span>
      </div>
    </div>
  );
};
