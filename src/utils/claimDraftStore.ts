import type { ClaimBoundaryRecord, ClaimDraft } from '../types/claimDraft';

const ACTIVE_DRAFT_KEY = 'bhoomidrishti.activeClaimDraft';
const SEQUENCE_KEY = 'bhoomidrishti.claimIdSequence';

/** Mock register already uses FRA-2025-001 … FRA-2025-006. */
const SEQUENCE_START = 6;

function readSequence(): number {
  if (typeof window === 'undefined') return SEQUENCE_START;
  const raw = window.localStorage.getItem(SEQUENCE_KEY);
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed >= SEQUENCE_START ? parsed : SEQUENCE_START;
}

export function generateClaimId(): string {
  const year = new Date().getFullYear();
  const next = readSequence() + 1;
  window.localStorage.setItem(SEQUENCE_KEY, String(next));
  return `FRA-${year}-${String(next).padStart(3, '0')}`;
}

export function saveClaimDraft(draft: ClaimDraft): void {
  window.localStorage.setItem(ACTIVE_DRAFT_KEY, JSON.stringify(draft));
}

export function getClaimDraft(): ClaimDraft | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(ACTIVE_DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ClaimDraft;
  } catch {
    return null;
  }
}

/** Merge boundary onto the existing Phase 1 draft. Does not create a new Claim ID. */
export function saveClaimBoundary(
  claimId: string,
  boundary: ClaimBoundaryRecord
): ClaimDraft | null {
  const current = getClaimDraft();
  if (!current || current.id !== claimId) return null;

  const next: ClaimDraft = {
    ...current,
    status: boundary.boundaryStatus === 'submitted' ? 'boundary-submitted' : current.status,
    boundary,
  };
  saveClaimDraft(next);
  return next;
}

export function clearClaimBoundary(claimId: string): ClaimDraft | null {
  const current = getClaimDraft();
  if (!current || current.id !== claimId) return null;

  const next: ClaimDraft = {
    ...current,
    status: 'boundary-pending',
    boundary: undefined,
  };
  saveClaimDraft(next);
  return next;
}

export function buildClaimDraftFromForm(form: HTMLFormElement): ClaimDraft {
  const controls = Array.from(form.elements).filter(
    (el): el is HTMLInputElement | HTMLSelectElement =>
      el instanceof HTMLInputElement || el instanceof HTMLSelectElement
  );

  const valueAt = (index: number) => controls[index]?.value.trim() ?? '';

  return {
    id: generateClaimId(),
    createdAt: new Date().toISOString(),
    status: 'boundary-pending',
    claimantName: valueAt(0),
    claimCategory: valueAt(1),
    tribeOrCommunity: valueAt(2),
    officialId: valueAt(3),
    state: valueAt(4),
    district: valueAt(5),
    block: valueAt(6),
    gramPanchayat: valueAt(7),
    village: valueAt(8),
    claimedAreaHectares: valueAt(9),
    latitude: valueAt(10),
    longitude: valueAt(11),
    documents: [],
  };
}
