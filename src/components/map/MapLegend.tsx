import React from 'react';
import type { MapLayerState } from '../../types';

interface MapLegendProps {
  layerState: MapLayerState;
}

export const MapLegend: React.FC<MapLegendProps> = ({ layerState }) => {
  return (
    <div className="gis-map-legend" aria-label="GIS Map Layer Legend">
      <span className="legend-label">Legend:</span>
      <div className="legend-items-wrap">
        {layerState.forestLulc && (
          <div className="legend-pill">
            <span className="legend-swatch swatch-forest"></span>
            <span>Forest / LULC</span>
          </div>
        )}

        {layerState.claimBoundary && (
          <div className="legend-pill">
            <span className="legend-swatch swatch-claim"></span>
            <span>Claim Boundary (Active Plot)</span>
          </div>
        )}

        {layerState.cadastralParcels && (
          <div className="legend-pill">
            <span className="legend-swatch swatch-cadastral"></span>
            <span>Cadastral Parcels</span>
          </div>
        )}

        {layerState.forestCompartment && (
          <div className="legend-pill">
            <span className="legend-swatch swatch-compartment"></span>
            <span>Forest Compartment #42</span>
          </div>
        )}

        {layerState.protectedAreas && (
          <div className="legend-pill">
            <span className="legend-swatch swatch-protected"></span>
            <span>Protected Area</span>
          </div>
        )}

        {layerState.satelliteEvidence && (
          <div className="legend-pill">
            <span className="legend-swatch swatch-satellite"></span>
            <span>Satellite Evidence (EO/NDVI)</span>
          </div>
        )}

        {layerState.potentialConflict && (
          <div className="legend-pill">
            <span className="legend-swatch swatch-conflict"></span>
            <span>Potential Conflict (Overlap)</span>
          </div>
        )}
      </div>
    </div>
  );
};
