import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigation } from '../router';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { Badge } from '../components/common/Badge';
import { BoundaryMap, type BoundaryMapHandle } from '../components/claim-workflow/BoundaryMap';
import type { ClaimBoundaryFeature, ClaimBoundaryRecord, ClaimDraft } from '../types/claimDraft';
import {
  calculateAreaHectares,
  formatHectares,
  isValidClosedPolygon,
  parseMapCenter,
} from '../utils/claimBoundary';
import { clearClaimBoundary, getClaimDraft, saveClaimBoundary } from '../utils/claimDraftStore';

function locationLabel(draft: ClaimDraft): string {
  const parts = [draft.village, draft.district].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Sambalpur demonstration area';
}

function toBoundaryRecord(
  draft: ClaimDraft,
  feature: ClaimBoundaryFeature,
  status: ClaimBoundaryRecord['boundaryStatus']
): ClaimBoundaryRecord {
  const now = new Date().toISOString();
  return {
    claimId: draft.id,
    geometry: feature.geometry,
    geojson: feature,
    areaHectares: calculateAreaHectares(feature),
    boundaryStatus: status,
    createdAt: draft.boundary?.createdAt ?? now,
    updatedAt: now,
  };
}

export const ClaimBoundary: React.FC = () => {
  const { navigate } = useNavigation();
  const mapRef = useRef<BoundaryMapHandle>(null);
  const [draft, setDraft] = useState<ClaimDraft | null>(() => getClaimDraft());
  const [liveFeature, setLiveFeature] = useState<ClaimBoundaryFeature | null>(
    () => getClaimDraft()?.boundary?.geojson ?? null
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const isSubmitted = draft?.status === 'boundary-submitted' || draft?.boundary?.boundaryStatus === 'submitted';
  const mapCenter = useMemo(
    () => parseMapCenter(draft?.latitude ?? '', draft?.longitude ?? ''),
    [draft?.latitude, draft?.longitude]
  );

  const liveArea = liveFeature && isValidClosedPolygon(liveFeature) ? calculateAreaHectares(liveFeature) : null;
  const canSubmit = Boolean(draft && liveFeature && isValidClosedPolygon(liveFeature) && !isSubmitted);

  const handleFeatureChange = useCallback(
    (feature: ClaimBoundaryFeature | null) => {
      setLiveFeature(feature);
      setSubmitError(null);
      if (!draft || draft.status === 'boundary-submitted') return;
      if (!feature || !isValidClosedPolygon(feature)) {
        const next = clearClaimBoundary(draft.id);
        if (next) setDraft(next);
        return;
      }
      const next = saveClaimBoundary(draft.id, toBoundaryRecord(draft, feature, 'draft'));
      if (next) setDraft(next);
    },
    [draft]
  );

  const handleDelete = () => {
    if (!draft || isSubmitted) return;
    mapRef.current?.deletePolygon();
    setLiveFeature(null);
    setSubmitError(null);
    setIsEditing(false);
    const next = clearClaimBoundary(draft.id);
    if (next) setDraft(next);
  };

  const handleEdit = () => {
    if (!draft || isSubmitted || !liveFeature) return;
    if (isEditing) {
      mapRef.current?.finishEdit();
      setIsEditing(false);
      return;
    }
    mapRef.current?.startEdit();
    setIsEditing(true);
  };

  const handleSubmit = () => {
    if (!draft) {
      setSubmitError('No registered claim draft was found. Submit the claim form first.');
      return;
    }
    if (!liveFeature || !isValidClosedPolygon(liveFeature)) {
      setSubmitError('Draw a closed polygon on the map before submitting the boundary.');
      return;
    }

    mapRef.current?.finishEdit();
    const record = toBoundaryRecord(draft, liveFeature, 'submitted');
    const next = saveClaimBoundary(draft.id, record);
    if (!next) {
      setSubmitError('Could not save the boundary against this Claim ID. Re-submit the claim form and try again.');
      return;
    }
    setDraft(next);
    setLiveFeature(record.geojson);
    setSubmitError(null);
    setIsEditing(false);
  };

  return (
    <div className="page-claim">
      <div className="gov-page-banner">
        <div className="gov-container">
          <div className="banner-breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-sep">/</span>
            <span onClick={() => navigate('/claim')} className="breadcrumb-link">Submit Land Claim</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Define Claim Boundary</span>
          </div>
          <h1 className="banner-page-title">Define Claim Boundary</h1>
          <p className="banner-page-subtitle">
            Demarcate the claimed parcel on the Sambalpur demonstration village map
          </p>
        </div>
      </div>

      <div className="gov-container page-content-container">
        {!draft ? (
          <Alert type="warning" title="No claim draft found">
            Submit claimant particulars first using Submit Claim for Verification. The boundary step continues from that draft.
          </Alert>
        ) : isSubmitted && draft.boundary ? (
          <Alert type="success" title="Boundary Submitted Successfully">
            Claim ID: <strong>{draft.id}</strong>
            {' '}
            · Claimed Area: <strong>{formatHectares(draft.boundary.areaHectares)} ha</strong>
            {' '}
            · Boundary Status: <strong>Submitted</strong>
          </Alert>
        ) : (
          <Alert type="success" title="Claim draft registered for verification">
            Claim ID: <strong>{draft.id}</strong>
            {draft.claimantName ? <> · Claimant: <strong>{draft.claimantName}</strong></> : null}
            {draft.village ? <> · Location: <strong>{locationLabel(draft)}</strong></> : null}
            . Draw a closed polygon to define the claim boundary.
          </Alert>
        )}

        {submitError ? (
          <div className="mt-4">
            <Alert type="danger" title="Boundary not submitted">
              {submitError}
            </Alert>
          </div>
        ) : null}

        <div className="mt-6">
          <Card
            title="Sambalpur demonstration village map"
            subtitle="Esri World Imagery basemap · click the polygon tool or Draw Boundary, then click vertices and close the shape"
            variant="bordered"
            badge={<Badge variant="navy">Step 2 of verification</Badge>}
          >
            <p className="upload-text mb-6">
              Use the map polygon tool (or Draw Boundary) to add vertices. Click the first point to close the polygon.
              You can then edit vertices or delete and redraw. Area is calculated from the geographic coordinates, not from screen pixels.
            </p>
            <BoundaryMap
              ref={mapRef}
              claimId={draft?.id ?? 'UNASSIGNED'}
              center={mapCenter}
              initialFeature={draft?.boundary?.geojson ?? null}
              readOnly={isSubmitted || !draft}
              onFeatureChange={handleFeatureChange}
            />
          </Card>
        </div>

        <div className="mt-6">
          <Card
            title="Claim Boundary"
            subtitle="Linked to the Claim ID generated at registration"
            variant="bordered"
          >
            <div className="track-meta-grid mb-6">
              <div className="track-meta-item">
                <span className="meta-lbl">Claim ID</span>
                <span className="meta-val">{draft?.id ?? '—'}</span>
              </div>
              <div className="track-meta-item">
                <span className="meta-lbl">Claimant</span>
                <span className="meta-val">{draft?.claimantName || '—'}</span>
              </div>
              <div className="track-meta-item">
                <span className="meta-lbl">Location</span>
                <span className="meta-val">{draft ? locationLabel(draft) : '—'}</span>
              </div>
              <div className="track-meta-item">
                <span className="meta-lbl">Estimated Area</span>
                <span className="meta-val">
                  {liveArea !== null ? `${formatHectares(liveArea)} ha` : '—'}
                </span>
              </div>
              <div className="track-meta-item">
                <span className="meta-lbl">Boundary Status</span>
                <span className="meta-val">
                  {isSubmitted ? 'Submitted' : liveFeature ? 'Draft' : 'Not drawn'}
                </span>
              </div>
            </div>

            <div className="form-submit-actions mb-6">
              <Button
                variant="secondary"
                size="md"
                onClick={() => mapRef.current?.startDraw()}
                disabled={!draft || isSubmitted || Boolean(liveFeature)}
              >
                Draw Boundary
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handleEdit}
                disabled={!draft || isSubmitted || !liveFeature}
              >
                {isEditing ? 'Finish Editing' : 'Edit Boundary'}
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={handleDelete}
                disabled={!draft || isSubmitted || !liveFeature}
              >
                Delete Boundary
              </Button>
            </div>

            <div className="form-submit-actions">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                Submit Boundary
              </Button>
              <Button variant="ghost" size="lg" onClick={() => navigate('/claim')}>
                Return to Claim Form
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
