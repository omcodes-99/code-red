import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ClaimBoundaryFeature } from '../../types/claimDraft';
import type { HistoricalObservationConfig } from '../../data/historicalObservations';
import { SAMBALPUR_CENTER, SAMBALPUR_DEFAULT_ZOOM, formatHectares } from '../../utils/claimBoundary';

interface HistoricalObservationMapProps {
  claimId: string;
  claimFeature: ClaimBoundaryFeature;
  areaHectares: number;
  observation: HistoricalObservationConfig;
}

interface HistoricalMapControllerProps {
  claimId: string;
  claimFeature: ClaimBoundaryFeature;
  areaHectares: number;
  observation: HistoricalObservationConfig;
}

const HistoricalMapController: React.FC<HistoricalMapControllerProps> = ({
  claimId,
  claimFeature,
  areaHectares,
  observation,
}) => {
  const map = useMap();
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    map.whenReady(() => {
      map.invalidateSize();
    });
  }, [map]);

  useEffect(() => {
    if (layerGroupRef.current) {
      map.removeLayer(layerGroupRef.current);
    }

    const group = new L.LayerGroup();
    layerGroupRef.current = group;
    map.addLayer(group);

    // Overlay the EXACT submitted GeoJSON claim boundary polygon
    if (claimFeature) {
      const claimLayer = L.geoJSON(claimFeature as unknown as GeoJSON.GeoJsonObject, {
        style: {
          color: '#F59E0B', // Crisp Gold/Amber stroke for maximum clarity on historical satellite background
          weight: 3.5,
          fillColor: '#0F2744',
          fillOpacity: 0.22,
          dashArray: '1, 0',
        },
      });

      claimLayer.bindTooltip(
        `<div><strong>Claim ID: ${claimId}</strong><br/>Area: ${formatHectares(areaHectares)} ha<br/><em>Overlay on ${observation.year} Observation</em></div>`,
        { permanent: false, sticky: true }
      );

      group.addLayer(claimLayer);

      // Focus map bounds on the claim polygon
      if (claimFeature.geometry.coordinates[0]?.length) {
        try {
          const bounds = claimLayer.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 17 });
          }
        } catch {
          // Ignore bound errors if invalid coordinates
        }
      }
    }

    return () => {
      if (layerGroupRef.current) {
        map.removeLayer(layerGroupRef.current);
        layerGroupRef.current = null;
      }
    };
  }, [map, claimFeature, claimId, areaHectares, observation]);

  return null;
};

export const HistoricalObservationMap: React.FC<HistoricalObservationMapProps> = ({
  claimId,
  claimFeature,
  areaHectares,
  observation,
}) => {
  const firstCoord = claimFeature?.geometry?.coordinates?.[0]?.[0];
  const center: [number, number] = firstCoord
    ? [firstCoord[1], firstCoord[0]]
    : SAMBALPUR_CENTER;

  return (
    <div className="historical-observation-map-container" style={{ position: 'relative' }}>
      {/* Visual Observation Header Ribbon on Map */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '8px 14px',
          backgroundColor: '#0F2744',
          color: '#ffffff',
          fontSize: '0.82rem',
          borderRadius: '4px 4px 0 0',
          borderBottom: '2px solid #F59E0B',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 700, color: '#FDE68A', fontSize: '0.9rem' }}>
            🛰️ Observation Year: {observation.year}
          </span>
          <span style={{ color: '#94A3B8' }}>|</span>
          <span>Sensor: {observation.sensor}</span>
          <span style={{ color: '#94A3B8' }}>|</span>
          <span>Acquisition: {observation.acquisitionDate}</span>
        </div>
        <div
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            color: '#FDE68A',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {observation.datasetType}
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="claim-boundary-map-wrap" style={{ position: 'relative' }}>
        <MapContainer
          key={`hist-map-${observation.year}`}
          center={center}
          zoom={SAMBALPUR_DEFAULT_ZOOM}
          zoomControl
          className="claim-boundary-map"
          scrollWheelZoom
          style={{ minHeight: '440px', width: '100%' }}
        >
          <TileLayer
            key={`tile-layer-${observation.year}`}
            attribution={observation.tileAttribution}
            url={observation.tileLayerUrl}
          />
          <HistoricalMapController
            claimId={claimId}
            claimFeature={claimFeature}
            areaHectares={areaHectares}
            observation={observation}
          />
        </MapContainer>

        {/* On-Map Floating Overlay Watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '12px',
            zIndex: 1000,
            backgroundColor: 'rgba(15, 39, 68, 0.88)',
            color: '#F8FAFC',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '0.72rem',
            lineHeight: 1.4,
            border: '1px solid rgba(245, 158, 11, 0.5)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
            pointerEvents: 'none',
            maxWidth: '320px',
          }}
        >
          <div style={{ fontWeight: 700, color: '#FDE68A' }}>
            Historical Observation Pass ({observation.year})
          </div>
          <div>Scene: {observation.sceneId} · {observation.resolution}</div>
          <div style={{ color: '#CBD5E1', fontSize: '0.68rem', marginTop: '2px' }}>
            Claim boundary overlaid on historical observation.
          </div>
        </div>
      </div>

      {/* Map Legend Bar */}
      <div className="spatial-map-legend-bar">
        <span className="legend-title">Map Overlay Legend:</span>
        <div className="legend-items-list">
          <div className="legend-item">
            <span className="legend-color-box border-amber bg-navy" />
            <span>Submitted Claim Polygon ({claimId}) — GeoJSON Demarcation</span>
          </div>
          <div className="legend-item">
            <span
              style={{
                display: 'inline-block',
                width: '14px',
                height: '14px',
                backgroundColor: '#1E293B',
                border: '1px solid #94A3B8',
                borderRadius: '2px',
                marginRight: '6px',
              }}
            />
            <span>Historical Earth Observation Layer ({observation.year})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
