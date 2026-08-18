export type EvidenceStatus = 'Strong' | 'Moderate' | 'Needs Review';
export type ReviewStatus = 'Under Review' | 'Evidence Ready' | 'Attention Required' | 'Approved (Gram Sabha)';

export interface PolygonPoint {
  x: number;
  y: number;
}

export interface TemporalObservation {
  year: number;
  season: string;
  satellite: string;
  resolution: string;
  landUseDetected: string;
  canopyDensity: string;
  confidenceScore: number;
  ndviValue: number;
  summary: string;
}

export interface SpatialAssessment {
  boundaryConfidence: 'High' | 'Moderate' | 'Low';
  confidenceMargin: string; // e.g. "±3.2m"
  landUseConsistency: 'Continuous' | 'Seasonal' | 'Discontinuous';
  satelliteEvidence: 'Available' | 'Partial' | 'Unavailable';
  satelliteObservationCount: string; // e.g. "9 Seasons / 38 Passes"
  cadastralMatch: 'Strong' | 'Moderate' | 'Weak';
  protectedAreaOverlapHectares: number;
  forestOverlapHectares: number;
  potentialConflictHectares: number;
  cadastralKhasraNo: string;
  forestCompartmentNo: string;
}

export interface FRAClaim {
  id: string;
  claimantName: string;
  tribeOrCommunity: string;
  district: string;
  block: string;
  gramPanchayat: string;
  areaHectares: number;
  claimType: 'Individual (IFR)' | 'Community (CFR)' | 'Habitat Rights';
  evidenceStatus: EvidenceStatus;
  reviewStatus: ReviewStatus;
  lastUpdated: string;
  historicalPeriod: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  // Geospatial details
  khasraNumber?: string;
  polygonPoints?: PolygonPoint[];
  spatialAssessment?: SpatialAssessment;
  temporalHistory?: TemporalObservation[];
}

export interface DashboardStats {
  totalClaims: number;
  underReview: number;
  evidenceAvailable: number;
  needsAttention: number;
}

export interface EvidenceSummaryItem {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  status: 'optimal' | 'moderate' | 'action-required';
  statusLabel: string;
  description: string;
  metrics: { label: string; val: string }[];
}

export interface MapLayerState {
  forestLulc: boolean;
  claimBoundary: boolean;
  cadastralParcels: boolean;
  forestCompartment: boolean;
  protectedAreas: boolean;
  satelliteEvidence: boolean;
  potentialConflict: boolean;
}

