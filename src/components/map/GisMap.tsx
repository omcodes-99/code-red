import React, { useState, useRef } from 'react';
import type { FRAClaim, MapLayerState } from '../../types';
import { ActiveClaimPopup } from './ActiveClaimPopup';

interface GisMapProps {
  selectedClaim: FRAClaim;
  layerState: MapLayerState;
  zoomLevel: number;
  showCrosshair: boolean;
  onInspectDetails?: () => void;
}

export const GisMap: React.FC<GisMapProps> = ({
  selectedClaim,
  layerState,
  zoomLevel,
  showCrosshair,
  onInspectDetails,
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Default polygon points if not defined
  const polygonPoints = selectedClaim.polygonPoints || [
    { x: 310, y: 150 },
    { x: 490, y: 140 },
    { x: 520, y: 280 },
    { x: 330, y: 295 },
  ];

  const polygonSvgPoints = polygonPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Calculate polygon centroid for positioning label
  const centroidX = Math.round(polygonPoints.reduce((acc, p) => acc + p.x, 0) / polygonPoints.length);
  const centroidY = Math.round(polygonPoints.reduce((acc, p) => acc + p.y, 0) / polygonPoints.length);

  // Mouse move handler for coordinates readout
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const baseLat = selectedClaim.coordinates.lat;
    const baseLng = selectedClaim.coordinates.lng;

    // Convert SVG pixel deltas to approximate GPS coordinate readout
    const latDelta = ((260 - y) / 520) * 0.04;
    const lngDelta = ((x - 500) / 1000) * 0.06;

    setCursorCoords({
      lat: +(baseLat + latDelta).toFixed(5),
      lng: +(baseLng + lngDelta).toFixed(5),
    });

    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPanOffset((prev) => ({ x: prev.x + dx * 0.5, y: prev.y + dy * 0.5 }));
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const currentLat = cursorCoords ? cursorCoords.lat : selectedClaim.coordinates.lat;
  const currentLng = cursorCoords ? cursorCoords.lng : selectedClaim.coordinates.lng;

  return (
    <div className="gis-map-wrapper" aria-label="Geospatial Map Area">
      {/* Top Map Toolbar / Status Bar */}
      <div className="map-toolbar">
        <div className="map-layers-info">
          {layerState.forestLulc && (
            <span className="layer-chip active">
              <span className="layer-dot forest"></span> Forest / LULC
            </span>
          )}
          {layerState.claimBoundary && (
            <span className="layer-chip active">
              <span className="layer-dot claim"></span> Claim Boundary
            </span>
          )}
          {layerState.cadastralParcels && (
            <span className="layer-chip active">
              <span className="layer-dot cadastral"></span> Cadastral Parcels
            </span>
          )}
          {layerState.forestCompartment && (
            <span className="layer-chip active">
              <span className="layer-dot rf"></span> RF Compartment #42
            </span>
          )}
          {layerState.satelliteEvidence && (
            <span className="layer-chip active">
              <span className="layer-dot satellite"></span> Satellite EO
            </span>
          )}
          {layerState.potentialConflict && (
            <span className="layer-chip active" style={{ borderColor: '#ef4444' }}>
              <span className="layer-dot conflict"></span> Conflict Buffer
            </span>
          )}
        </div>

        <div className="map-coord-display font-mono">
          <span className="coord-chip-active">
            📍 LAT: {currentLat.toFixed(4)}° N
          </span>
          <span className="coord-sep">|</span>
          <span className="coord-chip-active">
            LNG: {currentLng.toFixed(4)}° E
          </span>
          <span className="coord-sep">|</span>
          <span className="coord-res font-mono">
            ZOOM: {(zoomLevel * 16).toFixed(0)}x (Cadastral DGPS)
          </span>
        </div>
      </div>

      {/* SVG Canvas Map Display */}
      <div
        className="map-canvas-container"
        role="img"
        aria-label={`Spatial cadastral land parcel boundary map for ${selectedClaim.id} in ${selectedClaim.block}, ${selectedClaim.district}`}
      >
        <svg
          className="map-vector-canvas"
          viewBox="0 0 1000 520"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setCursorCoords(null);
            setIsDragging(false);
          }}
          style={{
            cursor: isDragging ? 'grabbing' : 'crosshair',
          }}
        >
          <defs>
            {/* Coordinate Grid Pattern */}
            <pattern id="gisGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1d382e" strokeWidth="0.75" strokeDasharray="3,3" />
              <circle cx="0" cy="0" r="1.2" fill="#38bdf8" opacity="0.4" />
            </pattern>

            {/* Sub-grid pattern */}
            <pattern id="gisSubGridPattern" width="160" height="160" patternUnits="userSpaceOnUse">
              <rect width="160" height="160" fill="none" stroke="#254d3e" strokeWidth="1.2" />
            </pattern>

            {/* Forest Canopy Texture Pattern */}
            <pattern id="gisForestPattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="3.5" fill="#1b4d3e" opacity="0.7" />
              <circle cx="4" cy="4" r="2.2" fill="#163e32" opacity="0.5" />
              <circle cx="20" cy="6" r="1.8" fill="#163e32" opacity="0.5" />
            </pattern>

            {/* Satellite NDVI Spectral False-Color Pattern */}
            <pattern id="satelliteTexture" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="#0d251d" />
              <rect x="0" y="0" width="30" height="30" fill="#123327" opacity="0.7" />
              <rect x="30" y="30" width="30" height="30" fill="#123327" opacity="0.7" />
              <circle cx="30" cy="30" r="14" fill="#154233" opacity="0.4" />
            </pattern>

            {/* Conflict Zone Diagonal Stripe Pattern */}
            <pattern
              id="gisConflictStripe"
              width="14"
              height="14"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="14" stroke="#dc2626" strokeWidth="3" opacity="0.55" />
            </pattern>

            {/* Glow Filter for Active Claim Boundary */}
            <filter id="claimGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Interactive Scaled Canvas Container */}
          <g
            transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
            style={{ transformOrigin: '500px 260px', transition: isDragging ? 'none' : 'transform 0.2s ease-out' }}
          >
            {/* 1. Base Terrain Fill */}
            <rect width="1000" height="520" fill="#0c1a15" />
            <rect width="1000" height="520" fill="url(#gisGridPattern)" />
            <rect width="1000" height="520" fill="url(#gisSubGridPattern)" />

            {/* 2. Topographic & Contour Lines */}
            <path d="M 0 110 Q 250 70, 500 140 T 1000 100" fill="none" stroke="#1b3d31" strokeWidth="1.5" />
            <path d="M 0 230 Q 300 190, 600 270 T 1000 210" fill="none" stroke="#1b3d31" strokeWidth="1.5" />
            <path d="M 0 370 Q 200 410, 550 340 T 1000 400" fill="none" stroke="#1b3d31" strokeWidth="1.5" />

            {/* 3. Satellite Evidence Layer (Multi-Spectral Raster Composite) */}
            {layerState.satelliteEvidence && (
              <g className="layer-satellite-group" opacity="0.85">
                <rect x="20" y="20" width="960" height="480" fill="url(#satelliteTexture)" rx="4" />
                <text x="35" y="45" fill="#38bdf8" fontSize="11" fontWeight="700" letterSpacing="0.06em">
                  🛰️ SENTINEL-2 MULTI-SPECTRAL COMPOSITE (B8-B4-B3 FALSE COLOR NDVI)
                </text>
              </g>
            )}

            {/* 4. Forest / LULC Canopy Layer */}
            {layerState.forestLulc && (
              <g className="layer-forest-group">
                <polygon
                  points="30,40 970,30 980,490 580,500 520,290 20,310"
                  fill="url(#gisForestPattern)"
                  opacity="0.9"
                />
                <polygon
                  points="390,30 970,20 980,490 590,490 530,270"
                  fill="#15362b"
                  fillOpacity="0.45"
                />
                <text x="640" y="60" fill="#34d399" fontSize="12" fontWeight="700" letterSpacing="0.08em">
                  LULC CLASS: DENSE & OPEN DECIDUOUS FOREST CANOPY
                </text>
              </g>
            )}

            {/* 5. Forest Compartment Boundary (RF Compartment #42) */}
            {layerState.forestCompartment && (
              <g className="layer-compartment-group">
                <polygon
                  points="420,35 965,25 985,485 625,495 540,275"
                  fill="none"
                  stroke="#15803d"
                  strokeWidth="2.5"
                  strokeDasharray="8,5"
                />
                <text x="680" y="85" fill="#4ade80" fontSize="12" fontWeight="700" letterSpacing="0.06em">
                  RESERVE FOREST COMPARTMENT NO. 42 (FOREST DEPT)
                </text>
              </g>
            )}

            {/* 6. Protected Area Boundary Layer */}
            {layerState.protectedAreas && (
              <g className="layer-protected-group">
                <polygon
                  points="550,20 980,15 990,360 700,380"
                  fill="#112920"
                  fillOpacity="0.75"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <text x="750" y="140" fill="#a7f3d0" fontSize="11" fontWeight="700">
                  SANCTUARY ECO-BUFFER (500m)
                </text>
              </g>
            )}

            {/* 7. Cadastral Revenue Land Parcels Grid */}
            {layerState.cadastralParcels && (
              <g className="layer-cadastral-group">
                {/* Village Revenue Outer Jurisdiction */}
                <polygon
                  points="40,50 390,35 350,330 50,310"
                  fill="#162c24"
                  stroke="#2e5345"
                  strokeWidth="2"
                />
                <text x="60" y="75" fill="#94a3b8" fontSize="12" fontWeight="600">
                  REVENUE VILLAGE JURISDICTION: {selectedClaim.gramPanchayat.toUpperCase()}
                </text>

                {/* Subdivided Cadastral Plots */}
                <polygon points="70,95 210,85 190,205 80,195" fill="#1a362c" stroke="#3b6e5b" strokeWidth="1.2" />
                <text x="120" y="150" fill="#64748b" fontSize="11" fontWeight="600">Khasra 141</text>

                <polygon points="210,85 340,80 320,215 190,205" fill="#1d3d32" stroke="#3b6e5b" strokeWidth="1.2" />
                <text x="240" y="145" fill="#64748b" fontSize="11" fontWeight="600">Khasra 142/1</text>

                <polygon points="80,195 190,205 170,285 70,275" fill="#1a362c" stroke="#3b6e5b" strokeWidth="1.2" />
                <text x="110" y="245" fill="#64748b" fontSize="11" fontWeight="600">Khasra 143</text>

                <polygon points="190,205 320,215 300,290 170,285" fill="#1d3d32" stroke="#3b6e5b" strokeWidth="1.2" />
                <text x="225" y="255" fill="#64748b" fontSize="11" fontWeight="600">Khasra 144</text>
              </g>
            )}

            {/* 8. Potential Conflict Overlap Zone */}
            {layerState.potentialConflict && (
              <g className="layer-conflict-group">
                <polygon
                  points="470,210 590,200 570,310 450,300"
                  fill="url(#gisConflictStripe)"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="5,3"
                />
                <circle cx="510" cy="255" r="3" fill="#ef4444" />
                <text x="455" y="195" fill="#f87171" fontSize="11" fontWeight="700">
                  OVERLAP / BUFFER DISPUTE (0.12 ha)
                </text>
              </g>
            )}

            {/* 9. Focused Active Claim Boundary (High-Precision Interactive Polygon) */}
            {layerState.claimBoundary && (
              <g
                className="claim-boundary-active-group"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsPopupVisible(!isPopupVisible)}
              >
                {/* Highlight Halo */}
                <polygon
                  points={polygonSvgPoints}
                  fill="#059669"
                  fillOpacity="0.4"
                  stroke="#34d399"
                  strokeWidth="4"
                  filter="url(#claimGlow)"
                />

                {/* Main Distinct Boundary Line */}
                <polygon
                  points={polygonSvgPoints}
                  fill="#059669"
                  fillOpacity="0.3"
                  stroke="#10b981"
                  strokeWidth="3"
                />

                {/* Interactive Survey Vertex Nodes */}
                {polygonPoints.map((point, index) => (
                  <g key={index}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="5.5"
                      fill="#d97706"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={point.x + 8}
                      y={point.y - 6}
                      fill="#fef3c7"
                      fontSize="9"
                      fontWeight="700"
                      className="font-mono"
                    >
                      P{index + 1}
                    </text>
                  </g>
                ))}

                {/* On-plot Center Identifier */}
                <g transform={`translate(${centroidX - 80}, ${centroidY - 20})`}>
                  <rect
                    width="160"
                    height="40"
                    rx="4"
                    fill="#08162b"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    opacity="0.95"
                  />
                  <text x="80" y="16" fill="#f8fafc" fontSize="11" fontWeight="700" textAnchor="middle">
                    {selectedClaim.id} (Active Plot)
                  </text>
                  <text x="80" y="30" fill="#34d399" fontSize="10" fontWeight="600" textAnchor="middle">
                    {selectedClaim.areaHectares.toFixed(2)} ha • {selectedClaim.claimantName}
                  </text>
                </g>
              </g>
            )}

            {/* 10. Inspection Crosshair Overlay */}
            {showCrosshair && (
              <g className="crosshair-group" opacity="0.65">
                <line x1="500" y1="0" x2="500" y2="520" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="0" y1="260" x2="1000" y2="260" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,4" />
                <circle cx="500" cy="260" r="16" fill="none" stroke="#38bdf8" strokeWidth="1" />
                <circle cx="500" cy="260" r="2" fill="#38bdf8" />
              </g>
            )}
          </g>

          {/* Fixed Compass Indicator (North Arrow) */}
          <g transform="translate(940, 65)">
            <circle cx="0" cy="0" r="22" fill="#08162b" stroke="#334155" strokeWidth="1.5" />
            <polygon points="0,-16 6,4 0,0" fill="#dc2626" />
            <polygon points="0,16 -6,-4 0,0" fill="#94a3b8" />
            <text x="-4" y="-7" fill="#ffffff" fontSize="9" fontWeight="800">N</text>
            <text x="-3" y="13" fill="#64748b" fontSize="8" fontWeight="700">S</text>
          </g>

          {/* Fixed Scale Bar */}
          <g transform="translate(50, 480)">
            <rect x="0" y="-14" width="170" height="20" fill="#08162b" rx="3" opacity="0.9" stroke="#1e293b" strokeWidth="1" />
            <line x1="10" y1="0" x2="160" y2="0" stroke="#f8fafc" strokeWidth="2.5" />
            <line x1="10" y1="-6" x2="10" y2="6" stroke="#f8fafc" strokeWidth="2" />
            <line x1="85" y1="-4" x2="85" y2="4" stroke="#f8fafc" strokeWidth="1.5" />
            <line x1="160" y1="-6" x2="160" y2="6" stroke="#f8fafc" strokeWidth="2" />
            <text x="10" y="-9" fill="#e2e8f0" fontSize="9" className="font-mono">0m</text>
            <text x="75" y="-9" fill="#e2e8f0" fontSize="9" className="font-mono">250m</text>
            <text x="145" y="-9" fill="#e2e8f0" fontSize="9" className="font-mono">500m</text>
          </g>
        </svg>

        {/* Floating Active Claim Popup Card */}
        {isPopupVisible && (
          <ActiveClaimPopup
            claim={selectedClaim}
            onClose={() => setIsPopupVisible(false)}
            onInspectDetails={onInspectDetails}
          />
        )}
      </div>
    </div>
  );
};
