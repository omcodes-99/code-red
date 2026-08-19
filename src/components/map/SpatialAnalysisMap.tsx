import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ClaimBoundaryFeature } from '../../types/claimDraft';
import { SAMBALPUR_SYNTHETIC_LAYERS } from '../../data/sambalpur-demo';
import { SAMBALPUR_CENTER, SAMBALPUR_DEFAULT_ZOOM, formatHectares } from '../../utils/claimBoundary';

export interface SpatialMapLayerVisibility {
  claimBoundary: boolean;
  forest: boolean;
  protectedArea: boolean;
  agriculture: boolean;
  water: boolean;
}

interface SpatialAnalysisMapProps {
  claimId: string;
  claimFeature: ClaimBoundaryFeature;
  areaHectares: number;
}

interface MapLayersControllerProps {
  claimId: string;
  claimFeature: ClaimBoundaryFeature;
  areaHectares: number;
  visibility: SpatialMapLayerVisibility;
}

const MapLayersController: React.FC<MapLayersControllerProps> = ({
  claimId,
  claimFeature,
  areaHectares,
  visibility,
}) => {
  const map = useMap();
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    map.whenReady(() => {
      map.invalidateSize();
    });
  }, [map]);

  useEffect(() => {
    if (layersGroupRef.current) {
      map.removeLayer(layersGroupRef.current);
    }

    const group = new L.LayerGroup();
    layersGroupRef.current = group;
    map.addLayer(group);

    // 1. Agriculture Layer
    if (visibility.agriculture) {
      const agConfig = SAMBALPUR_SYNTHETIC_LAYERS.agriculture;
      const agLayer = L.geoJSON(agConfig.geojson as GeoJSON.GeoJsonObject, {
        style: {
          color: agConfig.color,
          weight: 2,
          fillColor: agConfig.fillColor,
          fillOpacity: 0.25,
          dashArray: '4, 4',
        },
      });
      agLayer.bindTooltip('🌱 Customary Agrarian & Traditional Cultivation (Synthetic)', { sticky: true });
      group.addLayer(agLayer);
    }

    // 2. Protected Area Layer
    if (visibility.protectedArea) {
      const paConfig = SAMBALPUR_SYNTHETIC_LAYERS.protected_area;
      const paLayer = L.geoJSON(paConfig.geojson as GeoJSON.GeoJsonObject, {
        style: {
          color: paConfig.color,
          weight: 2,
          fillColor: paConfig.fillColor,
          fillOpacity: 0.28,
          dashArray: '6, 6',
        },
      });
      paLayer.bindTooltip('🛡️ Wildlife Sanctuary Eco-Sensitive Buffer (Synthetic)', { sticky: true });
      group.addLayer(paLayer);
    }

    // 3. Forest / LULC Layer
    if (visibility.forest) {
      const forConfig = SAMBALPUR_SYNTHETIC_LAYERS.forest;
      const forLayer = L.geoJSON(forConfig.geojson as GeoJSON.GeoJsonObject, {
        style: {
          color: forConfig.color,
          weight: 2,
          fillColor: forConfig.fillColor,
          fillOpacity: 0.32,
        },
      });
      forLayer.bindTooltip('🌲 Reserve Forest Compartment #42 (LULC Synthetic)', { sticky: true });
      group.addLayer(forLayer);
    }

    // 4. Waterbody & Drainage Layer
    if (visibility.water) {
      const watConfig = SAMBALPUR_SYNTHETIC_LAYERS.water;
      const watLayer = L.geoJSON(watConfig.geojson as GeoJSON.GeoJsonObject, {
        style: {
          color: watConfig.color,
          weight: 2,
          fillColor: watConfig.fillColor,
          fillOpacity: 0.35,
        },
      });
      watLayer.bindTooltip('💧 Village Stream & Drainage Corridor (Synthetic)', { sticky: true });
      group.addLayer(watLayer);
    }

    // 5. User Claim Polygon (Top layer)
    let claimLayer: L.GeoJSON | null = null;
    if (visibility.claimBoundary && claimFeature) {
      claimLayer = L.geoJSON(claimFeature as unknown as GeoJSON.GeoJsonObject, {
        style: {
          color: '#F59E0B', // Bright Gold/Amber stroke
          weight: 3.5,
          fillColor: '#0C2340',
          fillOpacity: 0.3,
          dashArray: '1, 0',
        },
      });
      claimLayer.bindTooltip(
        `📌 Claim ID: ${claimId} (${formatHectares(areaHectares)} ha)`,
        { permanent: false, sticky: true }
      );
      group.addLayer(claimLayer);
    }

    // Fit map bounds to claim polygon with margin
    if (claimLayer && claimFeature.geometry.coordinates[0]?.length) {
      try {
        const bounds = claimLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [60, 60], maxZoom: 17 });
        }
      } catch {
        // Ignore bounds fitting errors if empty
      }
    }

    return () => {
      if (layersGroupRef.current) {
        map.removeLayer(layersGroupRef.current);
        layersGroupRef.current = null;
      }
    };
  }, [map, claimFeature, claimId, areaHectares, visibility]);

  return null;
};

export const SpatialAnalysisMap: React.FC<SpatialAnalysisMapProps> = ({
  claimId,
  claimFeature,
  areaHectares,
}) => {
  const [visibility, setVisibility] = useState<SpatialMapLayerVisibility>({
    claimBoundary: true,
    forest: true,
    protectedArea: true,
    agriculture: true,
    water: true,
  });

  const toggleLayer = (key: keyof SpatialMapLayerVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Derive center from claim polygon or fallback
  const firstCoord = claimFeature?.geometry?.coordinates?.[0]?.[0];
  const center: [number, number] = firstCoord
    ? [firstCoord[1], firstCoord[0]]
    : SAMBALPUR_CENTER;

  return (
    <div className="spatial-analysis-map-container">
      {/* Layer Toggle Bar */}
      <div className="spatial-layer-controls-strip">
        <span className="controls-label">Toggle GIS Overlays:</span>
        <div className="controls-chips">
          <button
            type="button"
            className={`layer-toggle-btn ${visibility.claimBoundary ? 'active' : ''}`}
            onClick={() => toggleLayer('claimBoundary')}
            style={{
              borderColor: visibility.claimBoundary ? '#D97706' : undefined,
              backgroundColor: visibility.claimBoundary ? '#FEF3C7' : undefined,
            }}
          >
            <span className="dot" style={{ backgroundColor: '#F59E0B' }} />
            Claim Boundary
          </button>

          <button
            type="button"
            className={`layer-toggle-btn ${visibility.forest ? 'active' : ''}`}
            onClick={() => toggleLayer('forest')}
            style={{
              borderColor: visibility.forest ? '#15803D' : undefined,
              backgroundColor: visibility.forest ? '#DCFCE7' : undefined,
            }}
          >
            <span className="dot" style={{ backgroundColor: '#16A34A' }} />
            Forest / LULC
          </button>

          <button
            type="button"
            className={`layer-toggle-btn ${visibility.protectedArea ? 'active' : ''}`}
            onClick={() => toggleLayer('protectedArea')}
            style={{
              borderColor: visibility.protectedArea ? '#C2410C' : undefined,
              backgroundColor: visibility.protectedArea ? '#FFEDD5' : undefined,
            }}
          >
            <span className="dot" style={{ backgroundColor: '#EA580C' }} />
            Protected Area
          </button>

          <button
            type="button"
            className={`layer-toggle-btn ${visibility.agriculture ? 'active' : ''}`}
            onClick={() => toggleLayer('agriculture')}
            style={{
              borderColor: visibility.agriculture ? '#A16207' : undefined,
              backgroundColor: visibility.agriculture ? '#FEF9C3' : undefined,
            }}
          >
            <span className="dot" style={{ backgroundColor: '#CA8A04' }} />
            Agriculture
          </button>

          <button
            type="button"
            className={`layer-toggle-btn ${visibility.water ? 'active' : ''}`}
            onClick={() => toggleLayer('water')}
            style={{
              borderColor: visibility.water ? '#0369A1' : undefined,
              backgroundColor: visibility.water ? '#E0F2FE' : undefined,
            }}
          >
            <span className="dot" style={{ backgroundColor: '#0284C7' }} />
            Waterbody
          </button>
        </div>
      </div>

      {/* Leaflet Map Frame */}
      <div className="claim-boundary-map-wrap">
        <MapContainer
          center={center}
          zoom={SAMBALPUR_DEFAULT_ZOOM}
          zoomControl
          className="claim-boundary-map"
          scrollWheelZoom
        >
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          <MapLayersController
            claimId={claimId}
            claimFeature={claimFeature}
            areaHectares={areaHectares}
            visibility={visibility}
          />
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="spatial-map-legend-bar">
        <span className="legend-title">Map Legend:</span>
        <div className="legend-items-list">
          <div className="legend-item">
            <span className="legend-color-box border-amber bg-navy" />
            <span>Submitted Claim Polygon</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box bg-forest" />
            <span>Reserve Forest #42 (Synthetic LULC)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box bg-protected" />
            <span>Sanctuary Buffer (Synthetic ESZ)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box bg-agri" />
            <span>Customary Agrarian (Synthetic)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box bg-water" />
            <span>Stream Corridor (Synthetic 30m)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
