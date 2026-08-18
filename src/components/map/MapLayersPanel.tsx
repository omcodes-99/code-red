import React from 'react';
import type { MapLayerState } from '../../types';

interface MapLayersPanelProps {
  layerState: MapLayerState;
  onToggleLayer: (layerKey: keyof MapLayerState) => void;
  onSetPreset: (preset: 'all' | 'cadastral' | 'conflict' | 'satellite') => void;
}

export const MapLayersPanel: React.FC<MapLayersPanelProps> = ({
  layerState,
  onToggleLayer,
  onSetPreset,
}) => {
  const layersConfig: {
    key: keyof MapLayerState;
    label: string;
    description: string;
    swatchClass: string;
    tag: string;
  }[] = [
    {
      key: 'forestLulc',
      label: 'Forest / LULC',
      description: 'Land Use & Land Cover spectral classification polygon',
      swatchClass: 'swatch-forest',
      tag: 'Vector LULC',
    },
    {
      key: 'claimBoundary',
      label: 'Claim Boundary',
      description: 'Georeferenced FRA claim polygon and survey vertices',
      swatchClass: 'swatch-claim',
      tag: 'FRA Boundary',
    },
    {
      key: 'cadastralParcels',
      label: 'Cadastral Parcels',
      description: 'Village revenue cadastral grid & parcel Khasra numbers',
      swatchClass: 'swatch-cadastral',
      tag: 'Revenue Survey',
    },
    {
      key: 'forestCompartment',
      label: 'Forest Compartment',
      description: 'Reserve Forest compartment demarcations & working circle',
      swatchClass: 'swatch-compartment',
      tag: 'Compartment #42',
    },
    {
      key: 'protectedAreas',
      label: 'Protected Areas',
      description: 'Eco-sensitive zones, Wildlife Sanctuaries & National Parks',
      swatchClass: 'swatch-protected',
      tag: 'Sanctuary Buffer',
    },
    {
      key: 'satelliteEvidence',
      label: 'Satellite Evidence',
      description: 'High-res multi-spectral satellite imagery & NDVI overlay',
      swatchClass: 'swatch-satellite',
      tag: 'Sentinel / EO',
    },
    {
      key: 'potentialConflict',
      label: 'Potential Conflict',
      description: 'Dispute zones, forest overlap & unauthorized buffer zones',
      swatchClass: 'swatch-conflict',
      tag: 'Overlap Alert',
    },
  ];

  const activeCount = Object.values(layerState).filter(Boolean).length;

  return (
    <div className="map-layers-panel" aria-label="Map Layers Control">
      <div className="layers-panel-header">
        <div className="layers-title-row">
          <span className="layers-icon" aria-hidden="true">🥞</span>
          <h3 className="layers-title">Map Layers</h3>
          <span className="active-layers-counter font-mono">
            {activeCount}/{layersConfig.length} Active
          </span>
        </div>
        <p className="layers-subtitle">
          Toggle geospatial overlays to analyze parcel evidence and jurisdictional intersections
        </p>
      </div>

      {/* Preset Quick Filters */}
      <div className="layer-presets-bar">
        <span className="preset-label">Quick Views:</span>
        <div className="preset-buttons">
          <button
            type="button"
            className="preset-btn"
            onClick={() => onSetPreset('all')}
            title="Enable all GIS overlay layers"
          >
            All
          </button>
          <button
            type="button"
            className="preset-btn"
            onClick={() => onSetPreset('cadastral')}
            title="Focus on cadastral revenue parcels and claim boundary"
          >
            Cadastral
          </button>
          <button
            type="button"
            className="preset-btn"
            onClick={() => onSetPreset('satellite')}
            title="Focus on satellite optical evidence and LULC"
          >
            Satellite
          </button>
          <button
            type="button"
            className="preset-btn"
            onClick={() => onSetPreset('conflict')}
            title="Highlight overlap disputes and buffer zones"
          >
            Disputes
          </button>
        </div>
      </div>

      {/* Layer Toggle Checkbox List */}
      <ul className="layers-toggle-list" role="group" aria-label="Geospatial Map Layers">
        {layersConfig.map((layer) => {
          const isActive = layerState[layer.key];
          return (
            <li
              key={layer.key}
              className={`layer-toggle-item ${isActive ? 'active' : 'inactive'}`}
              onClick={() => onToggleLayer(layer.key)}
            >
              <div className="layer-item-left">
                <input
                  type="checkbox"
                  id={`layer-${layer.key}`}
                  checked={isActive}
                  onChange={() => onToggleLayer(layer.key)}
                  onClick={(e) => e.stopPropagation()}
                  className="gov-checkbox"
                  aria-label={`Toggle layer: ${layer.label}`}
                />
                <span className={`layer-swatch-indicator ${layer.swatchClass}`}></span>
                <div className="layer-info">
                  <label htmlFor={`layer-${layer.key}`} className="layer-name">
                    {layer.label}
                  </label>
                  <span className="layer-description">{layer.description}</span>
                </div>
              </div>
              <span className="layer-tag">{layer.tag}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
