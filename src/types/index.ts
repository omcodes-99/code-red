export type EvidenceStatus = 'Strong' | 'Moderate' | 'Needs Review';
export type ReviewStatus = 'Under Review' | 'Evidence Ready' | 'Attention Required' | 'Approved (Gram Sabha)';

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
