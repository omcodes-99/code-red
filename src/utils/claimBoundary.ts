import { area } from '@turf/area';
import type { ClaimBoundaryFeature } from '../types/claimDraft';

/** Prototype demonstration village (Sambalpur district, Odisha). */
export const SAMBALPUR_CENTER: [number, number] = [21.4678, 83.9784];
export const SAMBALPUR_DEFAULT_ZOOM = 15;

export function closeLngLatRing(ring: number[][]): number[][] {
  if (ring.length === 0) return ring;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] === last[0] && first[1] === last[1]) {
    return ring;
  }
  return [...ring, [first[0], first[1]]];
}

export function buildClaimBoundaryFeature(
  claimId: string,
  lngLatRing: number[][]
): ClaimBoundaryFeature {
  const coordinates = [closeLngLatRing(lngLatRing)];
  return {
    type: 'Feature',
    properties: { claimId },
    geometry: {
      type: 'Polygon',
      coordinates,
    },
  };
}

export function isValidClosedPolygon(feature: ClaimBoundaryFeature | null | undefined): boolean {
  if (!feature || feature.geometry.type !== 'Polygon') return false;
  const ring = feature.geometry.coordinates[0];
  if (!ring || ring.length < 4) return false;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) return false;
  const unique = new Set(ring.slice(0, -1).map((p) => `${p[0]},${p[1]}`));
  return unique.size >= 3;
}

export function calculateAreaHectares(feature: ClaimBoundaryFeature): number {
  const squareMetres = area(feature);
  return squareMetres / 10000;
}

export function formatHectares(hectares: number): string {
  return hectares.toFixed(2);
}

export function parseMapCenter(latRaw: string, lngRaw: string): [number, number] {
  const lat = Number.parseFloat(latRaw);
  const lng = Number.parseFloat(lngRaw);
  if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
    return [lat, lng];
  }
  return SAMBALPUR_CENTER;
}
