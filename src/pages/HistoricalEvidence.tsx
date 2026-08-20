import React, { useMemo, useState, useEffect } from 'react';
import { useNavigation } from '../router';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Alert } from '../components/common/Alert';
import { getClaimDraft, saveHistoricalObservation } from '../utils/claimDraftStore';
import { formatHectares } from '../utils/claimBoundary';
import {
  HISTORICAL_OBSERVATIONS,
  getHistoricalObservation,
  type HistoricalObservationConfig,
} from '../data/historicalObservations';
import { HistoricalObservationMap } from '../components/map/HistoricalObservationMap';
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

export const HistoricalEvidence: React.FC = () => {
  const { currentPath, navigate } = useNavigation();
  const urlClaimId = parseClaimIdFromUrl(currentPath);

  const [activeDraft, setActiveDraft] = useState<ClaimDraft | null>(() => getClaimDraft());

  // Determine active claim ID from URL or active draft or default mock claim
  const [selectedClaimId, setSelectedClaimId] = useState<string>(() => {
    if (urlClaimId) return urlClaimId;
    if (activeDraft?.id) return activeDraft.id;
    return 'FRA-2025-001';
  });

  // Selected year state (default: 2014 baseline or first configured year)
  const [selectedYear, setSelectedYear] = useState<number>(HISTORICAL_OBSERVATIONS[0].year);
  const [activeObservation, setActiveObservation] = useState<HistoricalObservationConfig>(
    HISTORICAL_OBSERVATIONS[0]
  );

  // Authority note input state for the current year
  const [observationNotes, setObservationNotes] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

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
        areaHectares: activeDraft.boundary?.areaHectares || 2.45,
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
      areaHectares: found.areaHectares || 2.45,
    };
  }, [isActiveDraftSelected, activeDraft, selectedClaimId]);

  // Sync active observation config when selected year changes
  useEffect(() => {
    const obs = getHistoricalObservation(selectedYear);
    setActiveObservation(obs);

    // Pre-populate note if already saved in active draft
    if (activeDraft?.historicalEvidence?.observations) {
      const existing = activeDraft.historicalEvidence.observations.find(
        (o) => o.year === selectedYear
      );
      setObservationNotes(existing ? existing.notes : '');
    } else {
      setObservationNotes('');
    }
    setSaveSuccessMsg(null);
  }, [selectedYear, activeDraft]);

  const handleViewEvidence = (year: number) => {
    setSelectedYear(year);
    const obs = getHistoricalObservation(year);
    setActiveObservation(obs);
  };

  const handleSaveNotes = () => {
    if (!selectedClaimId) return;

    const record = {
      year: selectedYear,
      observationLabel: activeObservation.label,
      notes: observationNotes.trim(),
      viewedAt: new Date().toISOString(),
      sensor: activeObservation.sensor,
    };

    if (isActiveDraftSelected) {
      const updated = saveHistoricalObservation(selectedClaimId, record);
      if (updated) {
        setActiveDraft(updated);
      }
    }

    setSaveSuccessMsg(`Observation notes for ${selectedYear} saved successfully.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const recordedObservations = activeDraft?.historicalEvidence?.observations || [];

  return (
    <div className="page-analysis page-historical-evidence">
      {/* Government Page Banner */}
      <div className="gov-page-banner">
        <div className="gov-container">
          <div className="banner-breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-sep">/</span>
            <span onClick={() => navigate('/claim')} className="breadcrumb-link">Claim Registration</span>
            <span className="breadcrumb-sep">/</span>
            <span onClick={() => navigate('/claim/boundary')} className="breadcrumb-link">Define Boundary</span>
            <span className="breadcrumb-sep">/</span>
            <span onClick={() => navigate(`/analysis?claimId=${activeClaimMeta.id}`)} className="breadcrumb-link">
              Geospatial Evidence Analysis
            </span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Historical Satellite Evidence</span>
          </div>
          <h1 className="banner-page-title">Historical Satellite Evidence</h1>
          <p className="banner-page-subtitle">
            Explore archived observations of the same claimed parcel across available historical dates.
          </p>
        </div>
      </div>

      <div className="gov-container page-content-container">
        {/* Prototype Data Transparency Notice */}
        <div className="mb-6">
          <Alert type="notice" title="Prototype Historical Observation — Demonstration Data">
            Archival satellite observation scenes displayed below are structured demonstration datasets for the Sambalpur demonstration area. <strong>The submitted claim polygon boundary from Phase 2 is overlaid identically across all selected years without alteration or re-creation.</strong>
          </Alert>
        </div>

        {/* Claim Selector & Identity Header */}
        <div className="analysis-selector-bar mb-6">
          <div className="selector-field">
            <label htmlFor="claim-select-input" className="selector-label">
              Active Claim for Historical Evidence:
            </label>
            <select
              id="claim-select-input"
              value={selectedClaimId}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedClaimId(newId);
                navigate(`/analysis/historical?claimId=${newId}`);
              }}
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
            <Badge variant={activeClaimMeta.boundaryFeature ? 'success' : 'warning'}>
              {activeClaimMeta.boundaryFeature ? 'Boundary GeoJSON Georeferenced' : 'Boundary Pending'}
            </Badge>
          </div>
        </div>

        {/* Claim Particulars Card */}
        <Card
          title={`Claim Identity: ${activeClaimMeta.id}`}
          subtitle="Registered claim identity and spatial demarcation particulars"
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
              <span className="meta-val font-bold text-navy-900">{activeClaimMeta.id}</span>
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
              <span className="meta-lbl">Village & Gram Panchayat</span>
              <span className="meta-val">{activeClaimMeta.village}, GP: {activeClaimMeta.gramPanchayat}</span>
            </div>
            <div className="track-meta-item">
              <span className="meta-lbl">District & State</span>
              <span className="meta-val">{activeClaimMeta.district}, {activeClaimMeta.state}</span>
            </div>
            <div className="track-meta-item">
              <span className="meta-lbl">Claimed Area (Declared / GIS)</span>
              <span className="meta-val font-bold text-navy-900">
                {activeClaimMeta.declaredArea} ha (Declared) · {formatHectares(activeClaimMeta.areaHectares)} ha (GIS Polygon)
              </span>
            </div>
          </div>
        </Card>

        {/* Step 3: Authority Selects the Year */}
        <Card
          title="Select Historical Observation"
          subtitle="Select a supported observation year to review physical land-cover evidence for the same demarcated boundary"
          variant="bordered"
          className="mb-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3" style={{ flex: '1 1 320px' }}>
              <label htmlFor="historical-year-select" className="font-semibold text-navy-900 text-sm">
                Observation Year:
              </label>
              <select
                id="historical-year-select"
                value={selectedYear}
                onChange={(e) => handleViewEvidence(Number(e.target.value))}
                className="gov-select-field"
                style={{
                  minWidth: '280px',
                  padding: '8px 12px',
                  border: '1.5px solid #0F2744',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
              >
                {HISTORICAL_OBSERVATIONS.map((obs) => (
                  <option key={obs.year} value={obs.year}>
                    {obs.year} — {obs.season} ({obs.sensor})
                  </option>
                ))}
              </select>

              <Button
                variant="primary"
                size="md"
                onClick={() => handleViewEvidence(selectedYear)}
              >
                View Historical Evidence
              </Button>
            </div>

            {/* Quick Year Pill Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-600 font-semibold">Supported Years:</span>
              {HISTORICAL_OBSERVATIONS.map((obs) => {
                const isSelected = obs.year === selectedYear;
                const hasNotes = recordedObservations.some((r) => r.year === obs.year && r.notes.length > 0);
                return (
                  <button
                    key={obs.year}
                    type="button"
                    onClick={() => handleViewEvidence(obs.year)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #0F2744' : '1px solid #CBD5E1',
                      backgroundColor: isSelected ? '#0F2744' : '#F8FAFC',
                      color: isSelected ? '#FFFFFF' : '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{obs.year}</span>
                    {hasNotes && <span style={{ color: isSelected ? '#FDE68A' : '#15803D' }}>•</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Step 4 & 5: Historical Map & Overlay */}
        <Card
          title={`Historical Earth Observation: ${activeObservation.year}`}
          subtitle="Archived spatial observation with identical submitted claim GeoJSON polygon overlay"
          variant="bordered"
          className="mb-6"
          badge={
            <Badge variant="navy">
              Pass Year: {activeObservation.year}
            </Badge>
          }
        >
          {/* Observation Information Summary */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              backgroundColor: '#F8FAFC',
              padding: '14px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              marginBottom: '16px',
            }}
          >
            <div>
              <span className="text-xs text-gray-500 block">Observation Year</span>
              <strong className="text-navy-900 text-sm">{activeObservation.year} ({activeObservation.season})</strong>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Claim ID</span>
              <strong className="text-navy-900 text-sm">{activeClaimMeta.id}</strong>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Village & District</span>
              <strong className="text-navy-900 text-sm">{activeClaimMeta.village}, {activeClaimMeta.district}</strong>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Sensor & Ground Resolution</span>
              <strong className="text-navy-900 text-sm">{activeObservation.sensor} ({activeObservation.resolution})</strong>
            </div>
          </div>

          {/* Overlay Status Callout */}
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#EFF6FF',
              borderLeft: '4px solid #1D4ED8',
              borderRadius: '0 4px 4px 0',
              fontSize: '0.85rem',
              color: '#1E3A8A',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            <span>
              ✓ <strong>Claim boundary overlaid on historical observation.</strong> (Same submitted polygon from Phase 2)
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
              Scene ID: {activeObservation.sceneId}
            </span>
          </div>

          {/* Interactive Historical Map Component */}
          {activeClaimMeta.boundaryFeature ? (
            <HistoricalObservationMap
              claimId={activeClaimMeta.id}
              claimFeature={activeClaimMeta.boundaryFeature}
              areaHectares={activeClaimMeta.areaHectares}
              observation={activeObservation}
            />
          ) : (
            <Alert type="warning" title="Demarcated Polygon Required">
              No closed GeoJSON boundary polygon found for Claim ID <strong>{activeClaimMeta.id}</strong>.
            </Alert>
          )}

          {/* Physical Observation Characteristics */}
          <div className="mt-4" style={{ backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#0F2744', fontWeight: 700 }}>
              Physical Land-Cover Characteristics ({activeObservation.year} Pass):
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
              <li><strong>Apparent Land-Cover:</strong> {activeObservation.apparentLandCover}</li>
              <li><strong>Canopy Density:</strong> {activeObservation.canopyDensityEstimate}</li>
              <li><strong>Cultivation Indicators:</strong> {activeObservation.cultivationIndicators}</li>
              <li><strong>Drainage / Water Context:</strong> {activeObservation.waterFeatureContext}</li>
            </ul>
          </div>
        </Card>

        {/* Step 8: Authority Observation Notes */}
        <Card
          title="Historical Observation Notes"
          subtitle="Record objective observational remarks regarding apparent vegetation, customary cultivation, water features, and land-use characteristics for this observation year"
          variant="bordered"
          className="mb-6"
        >
          <div className="mb-4">
            <label htmlFor="observation-notes-area" className="block text-sm font-bold text-navy-900 mb-2">
              Observational Remarks for Year {selectedYear}:
            </label>
            <textarea
              id="observation-notes-area"
              rows={4}
              value={observationNotes}
              onChange={(e) => setObservationNotes(e.target.value)}
              placeholder="e.g. Apparent customary cultivation bunding visible across central parcel segment; peripheral tree canopy consistent with agro-forestry usage; seasonal stream drainage buffered along eastern perimeter..."
              className="gov-textarea-field"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid #CBD5E1',
                borderRadius: '4px',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                fontFamily: 'inherit',
                color: '#1E293B',
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleSaveNotes}
            >
              Save Observation Notes for {selectedYear}
            </Button>

            {saveSuccessMsg && (
              <span style={{ color: '#15803D', fontWeight: 600, fontSize: '0.85rem' }}>
                ✓ {saveSuccessMsg}
              </span>
            )}
          </div>

          {/* Recorded History Summary List */}
          {recordedObservations.length > 0 && (
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid #E2E8F0' }}>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-3">
                Saved Historical Notes on Record ({recordedObservations.length}):
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recordedObservations.map((rec) => (
                  <div
                    key={rec.year}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: rec.year === selectedYear ? '#EFF6FF' : '#F8FAFC',
                      borderLeft: `3px solid ${rec.year === selectedYear ? '#1D4ED8' : '#94A3B8'}`,
                      borderRadius: '0 4px 4px 0',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <strong style={{ color: '#0F2744' }}>{rec.year} Observation</strong>
                      <span style={{ color: '#64748b', fontSize: '0.74rem' }}>
                        Recorded: {new Date(rec.viewedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#334155' }}>
                      {rec.notes || <em style={{ color: '#94a3b8' }}>No specific remarks recorded.</em>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statutory Evidentiary Scope Notice */}
          <div className="mt-4">
            <Alert type="notice" title="Statutory Evidentiary Scope (FRA 2006)">
              Historical satellite observations constitute objective physical evidence to assist statutory committees (SDLC & DLC) in evaluating historical occupation and customary land-use continuity. <strong>Observational notes do not automatically approve, reject, or determine statutory entitlement.</strong>
            </Alert>
          </div>
        </Card>

        {/* Step 10: Navigation Actions */}
        <div className="flex flex-wrap justify-between items-center gap-4 py-4">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(`/analysis?claimId=${activeClaimMeta.id}`)}
          >
            ← Return to Spatial Analysis
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(`/analysis/summary?claimId=${activeClaimMeta.id}`)}
          >
            Continue to Evidence Summary →
          </Button>
        </div>
      </div>
    </div>
  );
};
