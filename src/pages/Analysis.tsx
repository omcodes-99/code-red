import React, { useMemo, useState } from 'react';
import { useNavigation } from '../router';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Alert } from '../components/common/Alert';
import { getClaimDraft } from '../utils/claimDraftStore';
import { formatHectares } from '../utils/claimBoundary';
import { analyzeClaimBoundary, type SpatialAnalysisSummary } from '../utils/spatialAnalysis';
import { SpatialAnalysisMap } from '../components/map/SpatialAnalysisMap';
import type { ClaimBoundaryFeature, ClaimDraft } from '../types/claimDraft';
import { mockClaims } from '../data/mockData';

function parseClaimIdFromUrl(currentPath: string): string | null {
  if (typeof window === 'undefined') return null;
  const search = currentPath.includes('?') ? currentPath.split('?')[1] : window.location.search;
  const params = new URLSearchParams(search);
  return params.get('claimId');
}

/** Fallback generator to create a valid GeoJSON polygon for mock claims if selected. */
function createMockFeatureFromCoords(claimId: string, lat: number, lng: number): ClaimBoundaryFeature {
  const dLat = 0.0018;
  const dLng = 0.0022;
  return {
    type: 'Feature',
    properties: { claimId },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [lng - dLng, lat - dLat],
          [lng + dLng, lat - dLat * 0.8],
          [lng + dLng * 0.9, lat + dLat],
          [lng - dLng * 0.8, lat + dLat * 1.1],
          [lng - dLng, lat - dLat],
        ],
      ],
    },
  };
}

export const Analysis: React.FC = () => {
  const { currentPath, navigate } = useNavigation();
  const urlClaimId = parseClaimIdFromUrl(currentPath);

  const activeDraft: ClaimDraft | null = useMemo(() => getClaimDraft(), []);

  // Determine active claim ID from URL or active draft or default mock claim
  const [selectedClaimId, setSelectedClaimId] = useState<string>(() => {
    if (urlClaimId) return urlClaimId;
    if (activeDraft?.id) return activeDraft.id;
    return 'FRA-2025-001';
  });

  const isActiveDraftSelected = activeDraft && selectedClaimId === activeDraft.id;

  // Resolve active claim metadata
  const activeClaimMeta = useMemo(() => {
    if (isActiveDraftSelected && activeDraft) {
      return {
        id: activeDraft.id,
        claimantName: activeDraft.claimantName || 'Claimant (Registered)',
        tribeOrCommunity: activeDraft.tribeOrCommunity || 'Scheduled Tribe / OTFD',
        district: activeDraft.district || 'Sambalpur',
        block: activeDraft.block || 'Jujomura',
        gramPanchayat: activeDraft.gramPanchayat || 'Bhatra',
        village: activeDraft.village || 'Majhipada',
        state: activeDraft.state || 'Odisha',
        claimType: activeDraft.claimCategory || 'Individual (IFR)',
        declaredArea: activeDraft.claimedAreaHectares || '—',
        boundaryFeature: activeDraft.boundary?.geojson || null,
        boundaryStatus: activeDraft.boundary?.boundaryStatus || 'draft',
      };
    }

    const found = mockClaims.find((c) => c.id === selectedClaimId) || mockClaims[0];
    const mockFeature = createMockFeatureFromCoords(found.id, found.coordinates.lat, found.coordinates.lng);
    return {
      id: found.id,
      claimantName: found.claimantName,
      tribeOrCommunity: found.tribeOrCommunity,
      district: found.district,
      block: found.block,
      gramPanchayat: found.gramPanchayat,
      village: found.gramPanchayat,
      state: 'Odisha',
      claimType: found.claimType,
      declaredArea: String(found.areaHectares),
      boundaryFeature: mockFeature,
      boundaryStatus: 'submitted',
    };
  }, [isActiveDraftSelected, activeDraft, selectedClaimId]);

  // Execute real Turf.js spatial analysis dynamically
  const spatialSummary: SpatialAnalysisSummary | null = useMemo(() => {
    if (!activeClaimMeta.boundaryFeature) return null;
    return analyzeClaimBoundary(activeClaimMeta.boundaryFeature, activeClaimMeta.id);
  }, [activeClaimMeta.boundaryFeature, activeClaimMeta.id]);

  const hasBoundary = Boolean(activeClaimMeta.boundaryFeature);

  return (
    <div className="page-analysis">
      {/* Government Banner */}
      <div className="gov-page-banner">
        <div className="gov-container">
          <div className="banner-breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-sep">/</span>
            <span onClick={() => navigate('/claim')} className="breadcrumb-link">Claim Registration</span>
            <span className="breadcrumb-sep">/</span>
            <span onClick={() => navigate('/claim/boundary')} className="breadcrumb-link">Define Boundary</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Geospatial Evidence Analysis</span>
          </div>
          <h1 className="banner-page-title">Geospatial Evidence Analysis Workbench</h1>
          <p className="banner-page-subtitle">
            Autonomous multi-layer spatial intersection, geometric overlap scrutiny, and evidentiary validation under FRA 2006
          </p>
        </div>
      </div>

      <div className="gov-container page-content-container">
        {/* Synthetic GIS Dataset Transparency Notice */}
        <div className="mb-6">
          <Alert
            type="warning"
            title="Prototype / Synthetic GIS Data Notice"
          >
            The environmental and administrative layers displayed below (Reserve Forest #42, Sanctuary Eco-Sensitive Buffer, Customary Agriculture, Stream Drainage) are synthetic demonstration datasets generated for the Sambalpur demonstration area. <strong>All geometric intersections and area percentages are calculated in real-time from the submitted GeoJSON claim boundary.</strong>
          </Alert>
        </div>

        {/* Claim Selector & Identity Header */}
        <div className="analysis-selector-bar mb-6">
          <div className="selector-field">
            <label htmlFor="claim-select-input" className="selector-label">
              Active Claim for Spatial Analysis:
            </label>
            <select
              id="claim-select-input"
              value={selectedClaimId}
              onChange={(e) => setSelectedClaimId(e.target.value)}
              className="gov-select-field selector-dropdown"
            >
              {activeDraft ? (
                <option value={activeDraft.id}>
                  {activeDraft.id} — {activeDraft.claimantName || 'Newly Submitted Claim'} ({activeDraft.claimCategory || 'IFR'}, {activeDraft.district || 'Sambalpur'}) [Active Draft]
                </option>
              ) : null}
              {mockClaims.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.claimantName} ({c.claimType}, {c.district})
                </option>
              ))}
            </select>
          </div>

          <div className="selector-tags">
            <Badge variant="navy">Village: {activeClaimMeta.village || activeClaimMeta.gramPanchayat}</Badge>
            <Badge variant="info">District: {activeClaimMeta.district}</Badge>
            <Badge variant={hasBoundary ? 'success' : 'warning'}>
              {hasBoundary ? 'Boundary GeoJSON Georeferenced' : 'Boundary Pending'}
            </Badge>
          </div>
        </div>

        {!activeClaimMeta.boundaryFeature || !spatialSummary ? (
          <Card title="No Claim Boundary Registered" variant="bordered" className="mb-6">
            <Alert type="warning" title="Polygon Demarcation Required">
              No closed GeoJSON boundary polygon was found for Claim ID <strong>{activeClaimMeta.id}</strong>.
              Demarcate the claim parcel first on the Sambalpur demonstration map.
            </Alert>
            <div className="mt-4 flex gap-3">
              <Button variant="primary" onClick={() => navigate('/claim/boundary')}>
                Define Claim Boundary on Map
              </Button>
              <Button variant="secondary" onClick={() => navigate('/claim')}>
                Return to Claim Form
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* 1. Claimant & Claim Particulars Card */}
            <Card
              title={`Claim Particulars: ${activeClaimMeta.id}`}
              subtitle="Registered claim identity and spatial demarcation summary"
              variant="accent-navy"
              className="mb-6"
              badge={
                <Badge variant={activeClaimMeta.boundaryStatus === 'submitted' ? 'success' : 'warning'}>
                  {activeClaimMeta.boundaryStatus === 'submitted' ? 'Boundary Submitted' : 'Boundary Draft'}
                </Badge>
              }
            >
              <div className="track-meta-grid">
                <div className="track-meta-item">
                  <span className="meta-lbl">Claim ID</span>
                  <span className="meta-val font-bold">{activeClaimMeta.id}</span>
                </div>
                <div className="track-meta-item">
                  <span className="meta-lbl">Claimant / Community</span>
                  <span className="meta-val">{activeClaimMeta.claimantName}</span>
                </div>
                <div className="track-meta-item">
                  <span className="meta-lbl">Tribe / Category</span>
                  <span className="meta-val">{activeClaimMeta.tribeOrCommunity} ({activeClaimMeta.claimType})</span>
                </div>
                <div className="track-meta-item">
                  <span className="meta-lbl">Location (Village / GP)</span>
                  <span className="meta-val">{activeClaimMeta.village}, GP: {activeClaimMeta.gramPanchayat}</span>
                </div>
                <div className="track-meta-item">
                  <span className="meta-lbl">District & State</span>
                  <span className="meta-val">{activeClaimMeta.district}, {activeClaimMeta.state}</span>
                </div>
                <div className="track-meta-item">
                  <span className="meta-lbl">Claimed Area (Declared / GIS)</span>
                  <span className="meta-val font-bold text-navy-900">
                    {activeClaimMeta.declaredArea} ha (Declared) · {formatHectares(spatialSummary.totalClaimAreaHectares)} ha (GIS Polygon)
                  </span>
                </div>
              </div>
            </Card>

            {/* 2. Dynamically Calculated Result Cards */}
            <div className="spatial-results-grid">
              {/* Claimed Area */}
              <div className="spatial-result-card">
                <div>
                  <div className="result-label">Claimed Area</div>
                  <div className="result-value">{formatHectares(spatialSummary.totalClaimAreaHectares)} ha</div>
                </div>
                <div className="result-sub">
                  <span>Geographic Polygon</span>
                  <span className="result-pct pct-green">100.0% Base</span>
                </div>
              </div>

              {/* Forest / LULC Overlap */}
              <div className="spatial-result-card card-forest">
                <div>
                  <div className="result-label">Forest/LULC Overlap</div>
                  <div className="result-value">{formatHectares(spatialSummary.forestOverlap.overlapAreaHectares)} ha</div>
                </div>
                <div className="result-sub">
                  <span>Reserve Forest #42</span>
                  <span className={`result-pct ${spatialSummary.forestOverlap.overlapPercentage > 0 ? 'pct-amber' : 'pct-gray'}`}>
                    {spatialSummary.forestOverlap.overlapPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Protected Area Overlap */}
              <div className="spatial-result-card card-protected">
                <div>
                  <div className="result-label">Protected Area Overlap</div>
                  <div className="result-value">{formatHectares(spatialSummary.protectedAreaOverlap.overlapAreaHectares)} ha</div>
                </div>
                <div className="result-sub">
                  <span>Sanctuary Buffer</span>
                  <span className={`result-pct ${spatialSummary.protectedAreaOverlap.overlapPercentage > 0 ? 'pct-amber' : 'pct-gray'}`}>
                    {spatialSummary.protectedAreaOverlap.overlapPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Agriculture Overlap */}
              <div className="spatial-result-card card-agri">
                <div>
                  <div className="result-label">Agriculture Overlap</div>
                  <div className="result-value">{formatHectares(spatialSummary.agricultureOverlap.overlapAreaHectares)} ha</div>
                </div>
                <div className="result-sub">
                  <span>Customary Cultivation</span>
                  <span className={`result-pct ${spatialSummary.agricultureOverlap.overlapPercentage > 0 ? 'pct-green' : 'pct-gray'}`}>
                    {spatialSummary.agricultureOverlap.overlapPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Water Overlap */}
              <div className="spatial-result-card card-water">
                <div>
                  <div className="result-label">Water Overlap</div>
                  <div className="result-value">{formatHectares(spatialSummary.waterOverlap.overlapAreaHectares)} ha</div>
                </div>
                <div className="result-sub">
                  <span>Drainage Corridor</span>
                  <span className={`result-pct ${spatialSummary.waterOverlap.overlapPercentage > 0 ? 'pct-blue' : 'pct-gray'}`}>
                    {spatialSummary.waterOverlap.overlapPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Real Interactive Leaflet Spatial Analysis Map */}
            <Card
              title="Claim Geospatial Evidence Analysis Map"
              subtitle="Submitted claim polygon overlaid on synthetic Sambalpur GIS layers · Esri World Imagery"
              variant="bordered"
              badge={<Badge variant="navy">Dynamic GIS Overlay</Badge>}
              className="mb-6"
            >
              <SpatialAnalysisMap
                claimId={activeClaimMeta.id}
                claimFeature={activeClaimMeta.boundaryFeature}
                areaHectares={spatialSummary.totalClaimAreaHectares}
              />
            </Card>

            {/* 4. Potential Layer Overlaps Breakdown Table */}
            <Card
              title="Potential Layer Overlaps"
              subtitle="Automated geometric intersection breakdown across surveyed administrative and environmental layers"
              variant="bordered"
              className="mb-6"
            >
              <div style={{ overflowX: 'auto' }}>
                <table className="spatial-overlap-table">
                  <thead>
                    <tr>
                      <th>Surveyed GIS Layer</th>
                      <th>Layer Category</th>
                      <th>Overlap Area</th>
                      <th>Coverage (%)</th>
                      <th>Automated Status</th>
                      <th>Statutory Verification Advisory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spatialSummary.allLayers.map((layer) => (
                      <tr key={layer.layerId}>
                        <td>
                          <strong>{layer.layerName}</strong>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            Prototype / Synthetic GIS Data
                          </div>
                        </td>
                        <td>
                          <span style={{ color: layer.color, fontWeight: 600 }}>
                            {layer.category}
                          </span>
                        </td>
                        <td>
                          <strong>{formatHectares(layer.overlapAreaHectares)} ha</strong>
                        </td>
                        <td>
                          <span className={`result-pct ${layer.overlapPercentage > 0 ? 'pct-amber' : 'pct-gray'}`}>
                            {layer.overlapPercentage.toFixed(1)}%
                          </span>
                        </td>
                        <td>
                          <Badge variant={layer.requiresVerification ? 'warning' : 'success'}>
                            {layer.status}
                          </Badge>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem', color: layer.requiresVerification ? '#b45309' : '#15803d' }}>
                            {layer.statusNote}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <Alert type="notice" title="Statutory Review Safeguard (FRA 2006 Rule 12A)">
                  These automated spatial calculations are evidentiary decision-support aids for the Sub-Divisional Level Committee (SDLC) and District Level Committee (DLC). Under the statutory provisions of the Forest Rights Act, 2006, <strong>potential overlaps do not constitute claim invalidation or rejection</strong>; they flag specific parcel segments that require ground truthing by the Forest Rights Committee (FRC) and joint field verification teams.
                </Alert>
              </div>

              <div className="mt-6 flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-2">
                  <Button variant="secondary" size="md" onClick={() => navigate('/claim/boundary')}>
                    Modify Claim Boundary
                  </Button>
                  <Button variant="outline" size="md" onClick={() => navigate('/dashboard')}>
                    Claims Dashboard
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="md" onClick={() => navigate('/track')}>
                    Track Statutory Status
                  </Button>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
