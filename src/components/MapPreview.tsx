import React from 'react';
import type { FRAClaim } from '../types';

interface MapPreviewProps {
  selectedClaim?: FRAClaim;
  onOpenExplorer?: () => void;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  selectedClaim,
  onOpenExplorer,
}) => {
  return (
    <section className="map-section" id="map-section" aria-labelledby="map-preview-heading">
      <div className="gov-container">
        <div className="section-header-row">
          <div>
            <div className="section-badge">Spatial Intelligence Preview</div>
            <h2 id="map-preview-heading" className="section-title">
              Spatial Evidence Map
            </h2>
            <p className="section-subtext">
              Multi-layer cadastral and satellite land-use evidence visualizer
            </p>
          </div>
          <div className="map-header-location">
            <div className="location-pill">
              <span className="location-pin" aria-hidden="true">📍</span>
              <span>Sambalpur, Odisha</span>
            </div>
            <span className="demo-data-badge">Demo GIS Data</span>
          </div>
        </div>

        {/* Map Panel Frame */}
        <div className="map-panel-card">
          {/* Top Control Strip inside Map */}
          <div className="map-toolbar">
            <div className="map-layers-info">
              <span className="layer-chip active">
                <span className="layer-dot forest"></span> Forest Canopy (LULC)
              </span>
              <span className="layer-chip active">
                <span className="layer-dot cadastral"></span> Cadastral Parcels
              </span>
              <span className="layer-chip active">
                <span className="layer-dot claim"></span> Claim Boundary
              </span>
              <span className="layer-chip">
                <span className="layer-dot rf"></span> Reserve Forest Compartment #42
              </span>
            </div>

            <div className="map-coord-display font-mono">
              <span>LAT: {selectedClaim ? selectedClaim.coordinates.lat.toFixed(4) : '21.4678'}° N</span>
              <span className="coord-sep">|</span>
              <span>LNG: {selectedClaim ? selectedClaim.coordinates.lng.toFixed(4) : '83.9784'}° E</span>
              <span className="coord-sep">|</span>
              <span>ZOOM: 16x (Cadastral Level)</span>
            </div>
          </div>

          {/* Map Vector Graphic Canvas Placeholder */}
          <div className="map-canvas-container" role="img" aria-label="Cadastral Map graphic representing land parcel boundaries in Sambalpur, Odisha">
            <svg
              className="map-vector-canvas"
              viewBox="0 0 1000 520"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#233a32" strokeWidth="0.75" strokeDasharray="3,3" />
                </pattern>

                {/* Forest Canopy Texture */}
                <pattern id="forestPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="3" fill="#1b4d3e" opacity="0.6"/>
                  <circle cx="2" cy="2" r="2" fill="#163e32" opacity="0.4"/>
                </pattern>

                {/* Diagonal Stripes for Conflict Zone */}
                <pattern id="conflictStripe" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="12" stroke="#dc2626" strokeWidth="2.5" opacity="0.4" />
                </pattern>
              </defs>

              {/* Base terrain fill */}
              <rect width="1000" height="520" fill="#0f1f1a" />
              <rect width="1000" height="520" fill="url(#gridPattern)" />

              {/* Topographic Contour Lines (SVG representation) */}
              <path d="M 0 120 Q 250 80, 500 150 T 1000 110" fill="none" stroke="#1d4034" strokeWidth="1.5" />
              <path d="M 0 240 Q 300 200, 600 280 T 1000 220" fill="none" stroke="#1d4034" strokeWidth="1.5" />
              <path d="M 0 380 Q 200 420, 550 350 T 1000 410" fill="none" stroke="#1d4034" strokeWidth="1.5" />

              {/* Reserve Forest / Protected Area polygon */}
              <polygon
                points="420,40 960,30 980,480 620,490 540,280"
                fill="#15362b"
                fillOpacity="0.75"
                stroke="#15803d"
                strokeWidth="2"
                strokeDasharray="6,4"
              />
              <text x="720" y="90" fill="#34d399" fontSize="13" fontWeight="600" letterSpacing="0.05em">
                RESERVE FOREST COMPARTMENT NO. 42
              </text>

              {/* Village Settlement / Habitation Buffer */}
              <polygon
                points="50,60 380,40 340,320 60,300"
                fill="#162923"
                stroke="#375248"
                strokeWidth="1.5"
              />
              <text x="110" y="85" fill="#94a3b8" fontSize="12" fontWeight="500">
                VILLAGE REVENUE JURISDICTION: BHATRA
              </text>

              {/* Cadastral Land Parcel Subdivision Grid */}
              <polygon points="80,100 220,90 200,210 90,200" fill="#1a332a" stroke="#2e5345" strokeWidth="1" />
              <polygon points="220,90 350,85 330,220 200,210" fill="#1e3a30" stroke="#2e5345" strokeWidth="1" />
              <polygon points="90,200 200,210 180,290 80,280" fill="#1a332a" stroke="#2e5345" strokeWidth="1" />
              <polygon points="200,210 330,220 310,295 180,290" fill="#1e3a30" stroke="#2e5345" strokeWidth="1" />

              {/* Potential Conflict Area (Buffer Zone Overlap) */}
              <polygon
                points="480,220 580,210 560,310 460,300"
                fill="url(#conflictStripe)"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4,2"
              />
              <text x="470" y="200" fill="#f87171" fontSize="11" fontWeight="600">
                OVERLAP / BUFFER ZONE (0.12 ha)
              </text>

              {/* Primary Focused Claim Boundary Polygon (Highlighted) */}
              <g className="claim-highlight-group">
                <polygon
                  points="280,140 490,130 510,270 300,290"
                  fill="#059669"
                  fillOpacity="0.35"
                  stroke="#10b981"
                  strokeWidth="3.5"
                />
                {/* Vertex Markers */}
                <circle cx="280" cy="140" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="490" cy="130" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="510" cy="270" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="300" cy="290" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

                {/* Claim Annotation Label Box */}
                <rect x="310" y="170" width="180" height="56" rx="6" fill="#0c2340" stroke="#10b981" strokeWidth="1.5" />
                <text x="322" y="190" fill="#f8fafc" fontSize="12" fontWeight="700">
                  {selectedClaim ? selectedClaim.id : 'FRA-2025-001'} (Active Plot)
                </text>
                <text x="322" y="206" fill="#94a3b8" fontSize="11">
                  Claimant: {selectedClaim ? selectedClaim.claimantName : 'Rameshwar Majhi'}
                </text>
                <text x="322" y="219" fill="#10b981" fontSize="10" fontWeight="600">
                  Extent: {selectedClaim ? selectedClaim.areaHectares : '2.43'} ha • Cultivation Confirmed
                </text>
              </g>

              {/* Compass Indicator (North Arrow) */}
              <g transform="translate(940, 70)">
                <circle cx="0" cy="0" r="22" fill="#0c2340" stroke="#334155" strokeWidth="1.5" />
                <polygon points="0,-16 6,4 0,0" fill="#dc2626" />
                <polygon points="0,16 -6,-4 0,0" fill="#94a3b8" />
                <text x="-4" y="-7" fill="#ffffff" fontSize="9" fontWeight="800">N</text>
              </g>

              {/* Scale Bar */}
              <g transform="translate(50, 480)">
                <rect x="0" y="-12" width="160" height="18" fill="#0c2340" rx="3" opacity="0.85" />
                <line x1="10" y1="0" x2="150" y2="0" stroke="#f8fafc" strokeWidth="2.5" />
                <line x1="10" y1="-5" x2="10" y2="5" stroke="#f8fafc" strokeWidth="2" />
                <line x1="80" y1="-3" x2="80" y2="3" stroke="#f8fafc" strokeWidth="1.5" />
                <line x1="150" y1="-5" x2="150" y2="5" stroke="#f8fafc" strokeWidth="2" />
                <text x="10" y="-8" fill="#e2e8f0" fontSize="9">0m</text>
                <text x="70" y="-8" fill="#e2e8f0" fontSize="9">250m</text>
                <text x="135" y="-8" fill="#e2e8f0" fontSize="9">500m</text>
              </g>
            </svg>

            {/* Map Overlay Floating Info Card */}
            <div className="map-floating-overlay">
              <div className="floating-title">
                <span className="pin-dot"></span>
                <span>Plot Inspection View</span>
              </div>
              <p className="floating-desc">
                Georeferenced boundary plot for <strong>{selectedClaim ? selectedClaim.id : 'FRA-2025-001'}</strong> in Jujomura Tehsil.
              </p>
              <div className="floating-metrics">
                <div>
                  <span className="metric-lbl">Boundary Confidence</span>
                  <span className="metric-val text-green">High (±3.2m)</span>
                </div>
                <div>
                  <span className="metric-lbl">LULC Consistency</span>
                  <span className="metric-val text-amber">Continuous</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Footer: Legend & Action Button */}
          <div className="map-footer-bar">
            {/* Required Map Legend */}
            <div className="map-legend" aria-label="Map Layer Legend">
              <span className="legend-heading">Legend:</span>
              <div className="legend-item">
                <span className="legend-swatch swatch-forest"></span>
                <span>Forest / LULC</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-claim"></span>
                <span>Claim Boundary</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-protected"></span>
                <span>Protected Area</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-conflict"></span>
                <span>Potential Conflict</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              className="btn btn-primary map-explore-btn"
              onClick={onOpenExplorer}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
              </svg>
              Open Map Explorer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
