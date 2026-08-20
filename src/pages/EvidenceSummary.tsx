import React, { useMemo, useState } from 'react';
import { useNavigation } from '../router';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Alert } from '../components/common/Alert';
import { getClaimDraft } from '../utils/claimDraftStore';
import { formatHectares } from '../utils/claimBoundary';
import { analyzeClaimBoundary, type SpatialAnalysisSummary } from '../utils/spatialAnalysis';
import {
  HISTORICAL_OBSERVATIONS,
  type HistoricalObservationConfig,
} from '../data/historicalObservations';
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

export const EvidenceSummary: React.FC = () => {
  const { currentPath, navigate } = useNavigation();
  const urlClaimId = parseClaimIdFromUrl(currentPath);

  const activeDraft: ClaimDraft | null = useMemo(() => getClaimDraft(), []);

  // Determine active claim ID from URL or active draft or default mock claim
  const [selectedClaimId, setSelectedClaimId] = useState<string>(() => {
    if (urlClaimId) return urlClaimId;
    if (activeDraft?.id) return activeDraft.id;
    return 'FRA-2025-001';
  });

  const isActiveDraftSelected = Boolean(activeDraft && selectedClaimId === activeDraft.id);

  // Resolve active claim metadata from Phase 1, Phase 2, Phase 3A & Phase 3B
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
        officialId: activeDraft.officialId || 'Not specified',
        claimType: activeDraft.claimCategory || 'Individual (IFR)',
        declaredArea: activeDraft.claimedAreaHectares || '—',
        latitude: activeDraft.latitude || '21.4678',
        longitude: activeDraft.longitude || '83.9784',
        createdAt: activeDraft.createdAt || new Date().toISOString(),
        documents: activeDraft.documents || [],
        boundaryFeature: activeDraft.boundary?.geojson || null,
        boundaryStatus: activeDraft.boundary?.boundaryStatus || 'draft',
        boundaryAreaHectares: activeDraft.boundary?.areaHectares || null,
        historicalObservations: activeDraft.historicalEvidence?.observations || [],
        isLiveDraft: true,
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
      officialId: 'GOI-FRA-DOC-' + found.id.replace('FRA-', ''),
      claimType: found.claimType,
      declaredArea: String(found.areaHectares),
      latitude: String(found.coordinates.lat),
      longitude: String(found.coordinates.lng),
      createdAt: found.lastUpdated || '18 Aug 2025',
      documents: [
        { name: 'Form_A_Claim_Application.pdf', type: 'application/pdf', size: 1420000 },
        { name: 'Gram_Sabha_Resolution_Bhatra.pdf', type: 'application/pdf', size: 2150000 },
        { name: 'Voter_ID_Aadhaar_Verification.pdf', type: 'application/pdf', size: 890000 },
        { name: 'Traditional_Elder_Affidavit.pdf', type: 'application/pdf', size: 1100000 },
      ],
      boundaryFeature: mockFeature,
      boundaryStatus: 'submitted' as const,
      boundaryAreaHectares: found.areaHectares,
      historicalObservations: (found.temporalHistory || []).map((th) => ({
        year: th.year,
        observationLabel: `${th.year} — ${th.season} Observation (${th.satellite})`,
        notes: th.summary,
        viewedAt: '2025-08-18T10:00:00Z',
        sensor: th.satellite,
      })),
      isLiveDraft: false,
    };
  }, [isActiveDraftSelected, activeDraft, selectedClaimId]);

  // Execute Turf.js spatial analysis dynamically on the actual boundary
  const spatialSummary: SpatialAnalysisSummary | null = useMemo(() => {
    if (!activeClaimMeta.boundaryFeature) return null;
    return analyzeClaimBoundary(activeClaimMeta.boundaryFeature, activeClaimMeta.id);
  }, [activeClaimMeta.boundaryFeature, activeClaimMeta.id]);

  // Merge historical configuration with recorded officer remarks
  const combinedHistoricalEvidence = useMemo(() => {
    return HISTORICAL_OBSERVATIONS.map((config: HistoricalObservationConfig) => {
      const savedNote = activeClaimMeta.historicalObservations.find(
        (obs) => obs.year === config.year
      );
      return {
        config,
        savedNote,
      };
    });
  }, [activeClaimMeta.historicalObservations]);

  // Derive findings & warnings from real data
  const evaluation = useMemo(() => {
    const declaredAreaNum = parseFloat(activeClaimMeta.declaredArea) || 0;
    const surveyedAreaNum =
      spatialSummary?.calculatedAreaHectares ?? activeClaimMeta.boundaryAreaHectares ?? 0;

    const areaDifference = Math.abs(surveyedAreaNum - declaredAreaNum);
    const areaVariancePct =
      declaredAreaNum > 0 ? (areaDifference / declaredAreaNum) * 100 : 0;

    const hasProtectedOverlap = Boolean(
      spatialSummary && spatialSummary.protectedAreaOverlap.overlapAreaHectares >= 0.005
    );
    const hasForestOverlap = Boolean(
      spatialSummary && spatialSummary.forestOverlap.overlapAreaHectares >= 0.005
    );
    const hasAgricultureOverlap = Boolean(
      spatialSummary && spatialSummary.agricultureOverlap.overlapAreaHectares >= 0.005
    );

    const savedNotesCount = activeClaimMeta.historicalObservations.filter((o) =>
      Boolean(o.notes?.trim())
    ).length;

    const warnings: string[] = [];
    const keyFindings: string[] = [];

    // Boundary findings
    if (!activeClaimMeta.boundaryFeature) {
      warnings.push('No spatial boundary polygon submitted for this claim.');
    } else {
      keyFindings.push(
        `Boundary surveyed at ${formatHectares(surveyedAreaNum)} with valid georeferenced polygon geometry.`
      );
      if (declaredAreaNum > 0 && areaVariancePct > 15) {
        warnings.push(
          `Area variance of ${areaVariancePct.toFixed(1)}% between declared area (${declaredAreaNum} ha) and surveyed GPS perimeter (${formatHectares(surveyedAreaNum)}).`
        );
      }
    }

    // Spatial overlap findings
    if (spatialSummary) {
      if (hasProtectedOverlap) {
        warnings.push(
          `Potential intersection of ${formatHectares(spatialSummary.protectedAreaOverlap.overlapAreaHectares)} detected with Protected Wildlife Sanctuary / Reserve.`
        );
      } else {
        keyFindings.push('Zero overlap detected with Protected Area / Critical Tiger Habitat boundaries.');
      }

      if (hasForestOverlap) {
        keyFindings.push(
          `Forest land intersection confirmed: ${formatHectares(spatialSummary.forestOverlap.overlapAreaHectares)} (${spatialSummary.forestOverlap.overlapPercentage.toFixed(1)}% of claim).`
        );
      }

      if (hasAgricultureOverlap) {
        keyFindings.push(
          `Customary agriculture/settled parcel congruence: ${formatHectares(spatialSummary.agricultureOverlap.overlapAreaHectares)} (${spatialSummary.agricultureOverlap.overlapPercentage.toFixed(1)}% of claim).`
        );
      }
    }

    // Historical findings
    if (savedNotesCount > 0) {
      keyFindings.push(
        `Officer observational records compiled across ${savedNotesCount} multi-temporal satellite epoch(s).`
      );
    } else {
      warnings.push('No officer historical satellite observation remarks recorded for this claim.');
    }

    // Documents
    if (activeClaimMeta.documents.length === 0) {
      warnings.push('No statutory supporting documents currently uploaded to the claim file.');
    } else {
      keyFindings.push(`${activeClaimMeta.documents.length} supporting verification document(s) on record.`);
    }

    // Overall Corroboration Status
    let overallStatus: 'Strong' | 'Moderate' | 'Needs Review' = 'Moderate';
    let statusSummary = '';

    if (!activeClaimMeta.boundaryFeature || hasProtectedOverlap) {
      overallStatus = 'Needs Review';
      statusSummary =
        'Requires clarification: Unresolved spatial conflict or missing georeferenced boundary requires ground investigation by Sub-Divisional Level Committee (SDLC).';
    } else if (hasForestOverlap && savedNotesCount >= 1 && areaVariancePct <= 20) {
      overallStatus = 'Strong';
      statusSummary =
        'High evidentiary congruence: Consistent forest parcel overlap, multi-temporal physical continuity, and valid georeferenced boundary ready for Gram Sabha / SDLC review.';
    } else {
      overallStatus = 'Moderate';
      statusSummary =
        'Moderate corroboration: Physical evidence available; supplementary field inquiry or additional documentation recommended prior to final DLC determination.';
    }

    return {
      declaredAreaNum,
      surveyedAreaNum,
      areaDifference,
      areaVariancePct,
      hasProtectedOverlap,
      hasForestOverlap,
      hasAgricultureOverlap,
      savedNotesCount,
      warnings,
      keyFindings,
      overallStatus,
      statusSummary,
    };
  }, [activeClaimMeta, spatialSummary]);

  const handleExportJson = () => {
    const dossierData = {
      dossierVersion: '1.0-FRA-2006',
      generatedAt: new Date().toISOString(),
      claimOverview: {
        claimId: activeClaimMeta.id,
        claimantName: activeClaimMeta.claimantName,
        tribeOrCommunity: activeClaimMeta.tribeOrCommunity,
        claimType: activeClaimMeta.claimType,
        officialId: activeClaimMeta.officialId,
        jurisdiction: {
          state: activeClaimMeta.state,
          district: activeClaimMeta.district,
          block: activeClaimMeta.block,
          gramPanchayat: activeClaimMeta.gramPanchayat,
          village: activeClaimMeta.village,
        },
        coordinates: {
          latitude: activeClaimMeta.latitude,
          longitude: activeClaimMeta.longitude,
        },
        declaredAreaHectares: activeClaimMeta.declaredArea,
        createdAt: activeClaimMeta.createdAt,
      },
      boundaryDemarcation: {
        boundaryStatus: activeClaimMeta.boundaryStatus,
        surveyedAreaHectares: evaluation.surveyedAreaNum,
        geometry: activeClaimMeta.boundaryFeature?.geometry || null,
      },
      spatialAnalysis: spatialSummary
        ? {
            forestOverlapHectares: spatialSummary.forestOverlap.overlapAreaHectares,
            protectedAreaOverlapHectares: spatialSummary.protectedAreaOverlap.overlapAreaHectares,
            agricultureOverlapHectares: spatialSummary.agricultureOverlap.overlapAreaHectares,
            waterOverlapHectares: spatialSummary.waterOverlap.overlapAreaHectares,
          }
        : null,
      historicalSatelliteEvidence: combinedHistoricalEvidence.map((item) => ({
        year: item.config.year,
        sensor: item.config.sensor,
        resolution: item.config.resolution,
        apparentLandCover: item.config.apparentLandCover,
        officerNotes: item.savedNote?.notes || null,
        recordedAt: item.savedNote?.viewedAt || null,
      })),
      supportingDocuments: activeClaimMeta.documents,
      synthesis: {
        keyFindings: evaluation.keyFindings,
        warnings: evaluation.warnings,
        overallEvidentiaryCorroboration: evaluation.overallStatus,
        statutorySummary: evaluation.statusSummary,
      },
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FRA_Evidence_Dossier_${activeClaimMeta.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-analysis evidence-summary-page">
      {/* Government Banner */}
      <div className="gov-page-banner">
        <div className="gov-container">
          <div className="banner-breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">
              Home
            </span>
            <span className="breadcrumb-sep">/</span>
            <span onClick={() => navigate('/claim')} className="breadcrumb-link">
              Claim (Phase 1)
            </span>
            <span className="breadcrumb-sep">/</span>
            <span onClick={() => navigate('/claim/boundary')} className="breadcrumb-link">
              Boundary (Phase 2)
            </span>
            <span className="breadcrumb-sep">/</span>
            <span
              onClick={() => navigate(`/analysis?claimId=${activeClaimMeta.id}`)}
              className="breadcrumb-link"
            >
              Spatial (Phase 3A)
            </span>
            <span className="breadcrumb-sep">/</span>
            <span
              onClick={() => navigate(`/analysis/historical?claimId=${activeClaimMeta.id}`)}
              className="breadcrumb-link"
            >
              Historical (Phase 3B)
            </span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Evidence Summary (Phase 4)</span>
          </div>
          <h1 className="banner-page-title">FRA Evidence Summary & Verification Dossier</h1>
          <p className="banner-page-subtitle">
            Comprehensive synthesis of claimant records, georeferenced spatial boundaries, Turf.js GIS overlap calculations, and multi-temporal satellite observations under FRA 2006
          </p>
        </div>
      </div>

      <div className="gov-container page-content-container">
        {/* Claim Selector & Quick Action Bar */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem 1.25rem',
            backgroundColor: '#ffffff',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <label htmlFor="claim-select" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F2744' }}>
              Select Claim Record:
            </label>
            <select
              id="claim-select"
              value={selectedClaimId}
              onChange={(e) => {
                const nextId = e.target.value;
                setSelectedClaimId(nextId);
                navigate(`/analysis/summary?claimId=${nextId}`);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#0F2744',
                backgroundColor: '#F8FAFC',
              }}
            >
              {activeDraft && (
                <option value={activeDraft.id}>
                  {activeDraft.id} — {activeDraft.claimantName || 'Active Registration Draft'} (Live Draft)
                </option>
              )}
              {mockClaims.map((claim) => (
                <option key={claim.id} value={claim.id}>
                  {claim.id} — {claim.claimantName} ({claim.district}, {claim.gramPanchayat})
                </option>
              ))}
            </select>

            {isActiveDraftSelected ? (
              <Badge variant="success" dot>
                Live Phase 1–3B Workflow Draft
              </Badge>
            ) : (
              <Badge variant="navy">Demonstration FRA Claim</Badge>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button variant="outline" size="sm" onClick={handleExportJson}>
              📥 Export Dossier JSON
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint}>
              🖨️ Print / Save PDF Dossier
            </Button>
          </div>
        </div>

        {/* =========================================================================
            EXECUTIVE STATUTORY DOSSIER BANNER
           ========================================================================= */}
        <div
          style={{
            backgroundColor: '#0F2744',
            color: '#ffffff',
            borderRadius: '6px 6px 0 0',
            padding: '1.5rem',
            borderBottom: '3px solid #F97316',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    backgroundColor: '#F97316',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    letterSpacing: '0.05em',
                  }}
                >
                  FRA 2006 Evidentiary Dossier
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                  Ref: DOSSIER-{activeClaimMeta.id}
                </span>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                {activeClaimMeta.claimantName}
              </h2>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#CBD5E1' }}>
                {activeClaimMeta.tribeOrCommunity} &bull; {activeClaimMeta.claimType} &bull; {activeClaimMeta.village}, {activeClaimMeta.gramPanchayat}, {activeClaimMeta.block}, {activeClaimMeta.district}, {activeClaimMeta.state}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                Synthesized Corroboration
              </div>
              <div style={{ marginTop: '4px' }}>
                {evaluation.overallStatus === 'Strong' && (
                  <Badge variant="success" size="md">
                    ✓ Strong Corroboration
                  </Badge>
                )}
                {evaluation.overallStatus === 'Moderate' && (
                  <Badge variant="warning" size="md">
                    ℹ Moderate Corroboration
                  </Badge>
                )}
                {evaluation.overallStatus === 'Needs Review' && (
                  <Badge variant="danger" size="md">
                    ⚠ Action Required
                  </Badge>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Executive Key Findings & Warnings Strip */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderTop: 'none',
            borderRadius: '0 0 6px 6px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6, marginBottom: '1rem' }}>
            <strong>Statutory Synthesis Note:</strong> {evaluation.statusSummary}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {/* Key Findings */}
            <div
              style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '4px',
                padding: '0.85rem 1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span>✓</span> Key Corroborating Findings ({evaluation.keyFindings.length})
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#14532D', lineHeight: 1.5 }}>
                {evaluation.keyFindings.map((finding, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>
                    {finding}
                  </li>
                ))}
              </ul>
            </div>

            {/* Warnings / Flags */}
            <div
              style={{
                backgroundColor: evaluation.warnings.length > 0 ? '#FFFBEB' : '#F8FAFC',
                border: `1px solid ${evaluation.warnings.length > 0 ? '#FDE68A' : '#E2E8F0'}`,
                borderRadius: '4px',
                padding: '0.85rem 1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: evaluation.warnings.length > 0 ? '#92400E' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  marginBottom: '0.5rem',
                }}
              >
                <span>{evaluation.warnings.length > 0 ? '⚠' : 'ℹ'}</span> Discrepancies & Cautionary Flags ({evaluation.warnings.length})
              </div>
              {evaluation.warnings.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#78350F', lineHeight: 1.5 }}>
                  {evaluation.warnings.map((w, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>
                      {w}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>
                  No adverse spatial conflicts or critical data omissions detected.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: CLAIMANT & STATUTORY DEMOGRAPHICS (PHASE 1)
           ========================================================================= */}
        <Card
          title="1. Claimant & Demographic Record (Phase 1)"
          subtitle="Form A claim registration and administrative jurisdiction details"
          variant="default"
          className="mb-6"
          headerAction={
            <Button
              variant="outline"
              size="sm"
              className="no-print"
              onClick={() => navigate('/claim')}
            >
              Edit Form (Phase 1)
            </Button>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Claimant Full Name
              </span>
              <strong style={{ fontSize: '0.95rem', color: '#0F2744' }}>{activeClaimMeta.claimantName}</strong>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Claim Category
              </span>
              <strong style={{ fontSize: '0.95rem', color: '#0F2744' }}>{activeClaimMeta.claimType}</strong>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Tribe / Social Group
              </span>
              <strong style={{ fontSize: '0.95rem', color: '#0F2744' }}>{activeClaimMeta.tribeOrCommunity}</strong>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Official ID / Document Ref
              </span>
              <strong style={{ fontSize: '0.95rem', color: '#0F2744', fontFamily: 'monospace' }}>
                {activeClaimMeta.officialId}
              </strong>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Administrative Hierarchy
              </span>
              <span style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: 600 }}>
                {activeClaimMeta.village} &bull; GP: {activeClaimMeta.gramPanchayat} &bull; Block: {activeClaimMeta.block}
              </span>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                District: {activeClaimMeta.district}, State: {activeClaimMeta.state}
              </div>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Declared Area (Self-Reported)
              </span>
              <strong style={{ fontSize: '0.95rem', color: '#0F2744' }}>
                {activeClaimMeta.declaredArea} Hectares
              </strong>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Registration Date: {new Date(activeClaimMeta.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </Card>

        {/* =========================================================================
            SECTION 2: BOUNDARY DEMARCATION & GEOREFERENCING (PHASE 2)
           ========================================================================= */}
        <Card
          title="2. Submitted Boundary Demarcation (Phase 2)"
          subtitle="GPS surveyed perimeter, vertex topology, and computed polygon area"
          variant="default"
          className="mb-6"
          headerAction={
            <Button
              variant="outline"
              size="sm"
              className="no-print"
              onClick={() => navigate('/claim/boundary')}
            >
              View / Edit Boundary (Phase 2)
            </Button>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Boundary Submission Status
              </span>
              <div style={{ marginTop: '3px' }}>
                {activeClaimMeta.boundaryStatus === 'submitted' ? (
                  <Badge variant="success">✓ Boundary Submitted</Badge>
                ) : (
                  <Badge variant="warning">⚠ Boundary in Draft</Badge>
                )}
              </div>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Surveyed GPS Polygon Area
              </span>
              <strong style={{ fontSize: '1.1rem', color: '#0F2744' }}>
                {formatHectares(evaluation.surveyedAreaNum)}
              </strong>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Declared vs Surveyed Variance
              </span>
              <strong
                style={{
                  fontSize: '1rem',
                  color: evaluation.areaVariancePct > 15 ? '#DC2626' : '#15803D',
                }}
              >
                {evaluation.areaVariancePct.toFixed(1)}% (±{formatHectares(evaluation.areaDifference)})
              </strong>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Reference Coordinates
              </span>
              <span style={{ fontSize: '0.85rem', color: '#1E293B', fontFamily: 'monospace' }}>
                {parseFloat(activeClaimMeta.latitude).toFixed(4)}° N, {parseFloat(activeClaimMeta.longitude).toFixed(4)}° E
              </span>
            </div>
          </div>

          {activeClaimMeta.boundaryFeature && (
            <div
              style={{
                backgroundColor: '#F1F5F9',
                padding: '0.75rem 1rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                color: '#475569',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <span>
                <strong>Geometry Topology:</strong> Polygon GeoJSON (
                {activeClaimMeta.boundaryFeature.geometry.coordinates[0]?.length || 0} vertices closed ring)
              </span>
              <span>
                <strong>Pilot Grid Datum:</strong> WGS-84 / EPSG:4326 (Sambalpur Demonstration Zone)
              </span>
            </div>
          )}
        </Card>

        {/* =========================================================================
            SECTION 3: GEOSPATIAL OVERLAP & GIS FINDINGS (PHASE 3A)
           ========================================================================= */}
        <Card
          title="3. Geospatial Overlap & Land Classification (Phase 3A)"
          subtitle="Turf.js geometric polygon intersection against synthetic GIS layers"
          variant="default"
          className="mb-6"
          headerAction={
            <Button
              variant="outline"
              size="sm"
              className="no-print"
              onClick={() => navigate(`/analysis?claimId=${activeClaimMeta.id}`)}
            >
              View Spatial Analysis (Phase 3A)
            </Button>
          }
        >
          {spatialSummary ? (
            <div>
              <div className="gov-table-container" style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                <table className="gov-table" style={{ width: '100%', fontSize: '0.88rem' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Surveyed GIS Layer</th>
                      <th style={{ textAlign: 'left' }}>Category</th>
                      <th style={{ textAlign: 'right' }}>Overlap Area</th>
                      <th style={{ textAlign: 'right' }}>Overlap Share</th>
                      <th style={{ textAlign: 'center' }}>Evidentiary Assessment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Forest Layer */}
                    <tr>
                      <td>
                        <strong style={{ color: '#0F2744' }}>{spatialSummary.forestOverlap.layerName}</strong>
                      </td>
                      <td>Forest Land (Recorded)</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {formatHectares(spatialSummary.forestOverlap.overlapAreaHectares)}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {spatialSummary.forestOverlap.overlapPercentage.toFixed(1)}%
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {spatialSummary.forestOverlap.overlapAreaHectares > 0.005 ? (
                          <Badge variant="success">✓ Forest Land Overlap</Badge>
                        ) : (
                          <Badge variant="neutral">No Intersect</Badge>
                        )}
                      </td>
                    </tr>

                    {/* Protected Area */}
                    <tr style={{ backgroundColor: spatialSummary.protectedAreaOverlap.overlapAreaHectares > 0.005 ? '#FEF2F2' : undefined }}>
                      <td>
                        <strong style={{ color: '#0F2744' }}>{spatialSummary.protectedAreaOverlap.layerName}</strong>
                      </td>
                      <td>Statutory Sanctuary / Core Reserve</td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: spatialSummary.protectedAreaOverlap.overlapAreaHectares > 0.005 ? '#DC2626' : '#15803D' }}>
                        {formatHectares(spatialSummary.protectedAreaOverlap.overlapAreaHectares)}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: spatialSummary.protectedAreaOverlap.overlapAreaHectares > 0.005 ? '#DC2626' : '#15803D' }}>
                        {spatialSummary.protectedAreaOverlap.overlapPercentage.toFixed(1)}%
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {spatialSummary.protectedAreaOverlap.overlapAreaHectares > 0.005 ? (
                          <Badge variant="danger">⚠ Sanctuary Conflict</Badge>
                        ) : (
                          <Badge variant="success">✓ Clear of Protected Area</Badge>
                        )}
                      </td>
                    </tr>

                    {/* Agriculture */}
                    <tr>
                      <td>
                        <strong style={{ color: '#0F2744' }}>{spatialSummary.agricultureOverlap.layerName}</strong>
                      </td>
                      <td>Customary Cultivation Parcel</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {formatHectares(spatialSummary.agricultureOverlap.overlapAreaHectares)}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {spatialSummary.agricultureOverlap.overlapPercentage.toFixed(1)}%
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {spatialSummary.agricultureOverlap.overlapAreaHectares > 0.005 ? (
                          <Badge variant="success">✓ Cultivation Signature</Badge>
                        ) : (
                          <Badge variant="neutral">No Intersect</Badge>
                        )}
                      </td>
                    </tr>

                    {/* Water */}
                    <tr>
                      <td>
                        <strong style={{ color: '#0F2744' }}>{spatialSummary.waterOverlap.layerName}</strong>
                      </td>
                      <td>Drainage & Riparian Buffer</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {formatHectares(spatialSummary.waterOverlap.overlapAreaHectares)}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {spatialSummary.waterOverlap.overlapPercentage.toFixed(1)}%
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {spatialSummary.waterOverlap.overlapAreaHectares > 0.005 ? (
                          <Badge variant="info">ℹ Drainage Proximity</Badge>
                        ) : (
                          <Badge variant="neutral">Clear Buffer</Badge>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748B', fontStyle: 'italic' }}>
                Note: {spatialSummary.datasetNotice}
              </div>
            </div>
          ) : (
            <Alert type="warning" title="Spatial Analysis Incomplete">
              No boundary geometry available to compute GIS layer intersections. Please complete Phase 2 Boundary Demarcation.
            </Alert>
          )}
        </Card>

        {/* =========================================================================
            SECTION 4: MULTI-TEMPORAL HISTORICAL EVIDENCE (PHASE 3B)
           ========================================================================= */}
        <Card
          title="4. Multi-Temporal Satellite Evidence & Officer Observation Log (Phase 3B)"
          subtitle="Multi-epoch Earth observation imagery analysis and authority remarks on record"
          variant="default"
          className="mb-6"
          headerAction={
            <Button
              variant="outline"
              size="sm"
              className="no-print"
              onClick={() => navigate(`/analysis/historical?claimId=${activeClaimMeta.id}`)}
            >
              View Historical Evidence (Phase 3B)
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {combinedHistoricalEvidence.map(({ config, savedNote }) => (
              <div
                key={config.year}
                style={{
                  border: `1.5px solid ${savedNote?.notes ? '#93C5FD' : '#E2E8F0'}`,
                  borderRadius: '6px',
                  backgroundColor: savedNote?.notes ? '#F0F7FF' : '#FAFAFA',
                  padding: '1rem 1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div>
                    <strong style={{ fontSize: '1rem', color: '#0F2744' }}>
                      {config.label}
                    </strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      Sensor: {config.sensor} &bull; Resolution: {config.resolution} &bull; Acquisition: {config.acquisitionDate}
                    </div>
                  </div>

                  <div>
                    {savedNote?.notes ? (
                      <Badge variant="success">✓ Officer Remarks Recorded</Badge>
                    ) : (
                      <Badge variant="neutral">Demonstration Baseline</Badge>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.83rem', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Apparent Land Cover:</span>
                    <span style={{ color: '#1E293B' }}>{config.apparentLandCover}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Canopy Density:</span>
                    <span style={{ color: '#1E293B' }}>{config.canopyDensityEstimate}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Cultivation Indicators:</span>
                    <span style={{ color: '#1E293B' }}>{config.cultivationIndicators}</span>
                  </div>
                </div>

                {/* Saved Officer Note */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #CBD5E1',
                    borderRadius: '4px',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.83rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, color: '#1E40AF', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Authority Observational Remarks (Phase 3B):
                    </span>
                    {savedNote?.viewedAt && (
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                        Recorded: {new Date(savedNote.viewedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, color: savedNote?.notes ? '#1E293B' : '#94A3B8', fontStyle: savedNote?.notes ? 'normal' : 'italic' }}>
                    {savedNote?.notes || 'No specific officer remarks recorded for this observation year.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* =========================================================================
            SECTION 5: STATUTORY SUPPORTING DOCUMENTS (PHASE 1 ATTACHMENTS)
           ========================================================================= */}
        <Card
          title="5. Statutory Supporting Documentation (Phase 1)"
          subtitle="Verification documents and evidentiary annexures attached to claim file"
          variant="default"
          className="mb-6"
        >
          {activeClaimMeta.documents.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {activeClaimMeta.documents.map((doc, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '4px',
                  }}
                >
                  <div style={{ fontSize: '1.4rem' }}>📄</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ fontSize: '0.85rem', color: '#0F2744', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.name}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {(doc.size / 1024).toFixed(0)} KB &bull; Verified Attachment
                    </span>
                  </div>
                  <Badge variant="success" size="sm">
                    Attached
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#64748B', fontSize: '0.88rem' }}>
                No custom documents uploaded during Phase 1. Standard FRA statutory verification checklist applies.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', backgroundColor: '#E2E8F0', borderRadius: '3px' }}>
                  Form A Claim Receipt
                </span>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', backgroundColor: '#E2E8F0', borderRadius: '3px' }}>
                  Gram Sabha Resolution
                </span>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', backgroundColor: '#E2E8F0', borderRadius: '3px' }}>
                  Boundary Verification Map
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* =========================================================================
            SECTION 6: STATUTORY DECISION SUPPORT PROTOCOL
           ========================================================================= */}
        <Card
          title="6. Statutory Review Protocol & Safe Harbor Notice"
          subtitle="Legal scope under The Scheduled Tribes and Other Traditional Forest Dwellers Act, 2006"
          variant="accent-navy"
          className="mb-6"
        >
          <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 0.75rem 0' }}>
              <strong>Procedural Mandate:</strong> This Evidence Summary Dossier compiles objective geospatial data (Turf.js overlay intersections, Landsat/Sentinel/Resourcesat multi-temporal reflectance signatures, and GPS boundary survey topologies) to assist statutory review bodies:
            </p>
            <ol style={{ margin: '0 0 1rem 0', paddingLeft: '1.25rem' }}>
              <li style={{ marginBottom: '4px' }}>
                <strong>Gram Sabha / Forest Rights Committee (FRC):</strong> Primary verification of customary occupation and physical boundary demarcations.
              </li>
              <li style={{ marginBottom: '4px' }}>
                <strong>Sub-Divisional Level Committee (SDLC):</strong> Examination of resolution, spatial overlap consistency, and boundary accuracy.
              </li>
              <li style={{ marginBottom: '4px' }}>
                <strong>District Level Committee (DLC):</strong> Final consideration, title deed record preparation, and statutory rights conferral.
              </li>
            </ol>
            <Alert type="notice" title="Statutory Safeguard">
              Geospatial assessments and algorithmic consistency indices do not constitute automatic title conferral, approval, or rejection. Final legal determination rests exclusively with the competent statutory authorities as prescribed under the Forest Rights Act, 2006.
            </Alert>
          </div>
        </Card>

        {/* =========================================================================
            WORKFLOW NAVIGATION ACTIONS
           ========================================================================= */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1rem 0',
          }}
        >
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(`/analysis/historical?claimId=${activeClaimMeta.id}`)}
          >
            ← Return to Historical Evidence (Phase 3B)
          </Button>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/dashboard')}
            >
              Claims Dashboard
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handlePrint}
            >
              🖨️ Print Final Dossier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
