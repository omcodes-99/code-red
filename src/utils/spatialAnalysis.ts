import { area } from '@turf/area';
import { intersect } from '@turf/intersect';
import { featureCollection } from '@turf/helpers';
import type { ClaimBoundaryFeature } from '../types/claimDraft';
import { SAMBALPUR_SYNTHETIC_LAYERS, type SyntheticGisLayer } from '../data/sambalpur-demo';

export interface LayerOverlapResult {
  layerId: string;
  layerName: string;
  shortName: string;
  category: string;
  color: string;
  overlapAreaHectares: number;
  overlapPercentage: number;
  status: 'Potential overlap detected' | 'No overlap detected';
  requiresVerification: boolean;
  statusNote: string;
  disclaimer: string;
  intersectionFeature: GeoJSON.Feature | null;
}

export interface SpatialAnalysisSummary {
  claimId: string;
  totalClaimAreaHectares: number;
  calculatedAreaHectares: number;
  forestOverlap: LayerOverlapResult;
  protectedAreaOverlap: LayerOverlapResult;
  agricultureOverlap: LayerOverlapResult;
  waterOverlap: LayerOverlapResult;
  allLayers: LayerOverlapResult[];
  datasetNotice: string;
}

/**
 * Calculates geometric intersection between the user's submitted claim polygon
 * and synthetic GIS layers in the Sambalpur demonstration area using Turf.js.
 */
export function calculateLayerOverlap(
  claimFeature: ClaimBoundaryFeature,
  layer: SyntheticGisLayer
): LayerOverlapResult {
  const claimAreaSqM = area(claimFeature);
  const claimAreaHectares = claimAreaSqM > 0 ? claimAreaSqM / 10000 : 0;

  let totalIntersectionAreaSqM = 0;
  const intersectionFeatures: GeoJSON.Feature[] = [];

  for (const layerFeature of layer.geojson.features) {
    if (!layerFeature.geometry) continue;

    try {
      // Turf v7 intersect accepts a FeatureCollection with 2 polygon features
      const fc = featureCollection([
        claimFeature as GeoJSON.Feature<GeoJSON.Polygon>,
        layerFeature as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
      ]);
      const result = intersect(fc);

      if (result && result.geometry) {
        const featArea = area(result);
        if (featArea > 0) {
          totalIntersectionAreaSqM += featArea;
          intersectionFeatures.push(result);
        }
      }
    } catch {
      // If topology issues occur during intersection, continue gracefully
    }
  }

  const overlapAreaHectares = totalIntersectionAreaSqM / 10000;
  const rawPercentage = claimAreaHectares > 0 ? (overlapAreaHectares / claimAreaHectares) * 100 : 0;
  const overlapPercentage = Math.min(100, Math.max(0, rawPercentage));

  const hasOverlap = overlapAreaHectares >= 0.005; // Threshold ~50 sq metres

  const primaryIntersection: GeoJSON.Feature | null =
    intersectionFeatures.length > 0 ? intersectionFeatures[0] : null;

  return {
    layerId: layer.id,
    layerName: layer.name,
    shortName: layer.shortName,
    category: layer.category,
    color: layer.color,
    overlapAreaHectares,
    overlapPercentage,
    status: hasOverlap ? 'Potential overlap detected' : 'No overlap detected',
    requiresVerification: hasOverlap,
    statusNote: hasOverlap
      ? 'Requires authority verification.'
      : 'Clear of surveyed layer boundary.',
    disclaimer: layer.disclaimer,
    intersectionFeature: primaryIntersection,
  };
}

/**
 * Executes full multi-layer spatial analysis on a submitted claim polygon.
 */
export function analyzeClaimBoundary(
  claimFeature: ClaimBoundaryFeature,
  claimId: string
): SpatialAnalysisSummary {
  const claimAreaSqM = area(claimFeature);
  const totalClaimAreaHectares = claimAreaSqM / 10000;

  const forestOverlap = calculateLayerOverlap(claimFeature, SAMBALPUR_SYNTHETIC_LAYERS.forest);
  const protectedAreaOverlap = calculateLayerOverlap(claimFeature, SAMBALPUR_SYNTHETIC_LAYERS.protected_area);
  const agricultureOverlap = calculateLayerOverlap(claimFeature, SAMBALPUR_SYNTHETIC_LAYERS.agriculture);
  const waterOverlap = calculateLayerOverlap(claimFeature, SAMBALPUR_SYNTHETIC_LAYERS.water);

  return {
    claimId,
    totalClaimAreaHectares,
    calculatedAreaHectares: totalClaimAreaHectares,
    forestOverlap,
    protectedAreaOverlap,
    agricultureOverlap,
    waterOverlap,
    allLayers: [forestOverlap, protectedAreaOverlap, agricultureOverlap, waterOverlap],
    datasetNotice:
      'Prototype / Synthetic GIS Data: These spatial assessments are automated evidentiary aids generated from demonstration village layers and do not constitute final statutory title determinations.',
  };
}
