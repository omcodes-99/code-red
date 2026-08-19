export interface ClaimDraftDocumentRef {
  name: string;
  type: string;
  size: number;
}

export type ClaimDraftStatus = 'boundary-pending' | 'boundary-submitted';

export type BoundaryStatus = 'draft' | 'submitted';

export interface ClaimBoundaryFeature {
  type: 'Feature';
  properties: {
    claimId: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface ClaimBoundaryRecord {
  claimId: string;
  geometry: ClaimBoundaryFeature['geometry'];
  geojson: ClaimBoundaryFeature;
  areaHectares: number;
  boundaryStatus: BoundaryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimDraft {
  id: string;
  createdAt: string;
  status: ClaimDraftStatus;
  claimantName: string;
  claimCategory: string;
  tribeOrCommunity: string;
  officialId: string;
  state: string;
  district: string;
  block: string;
  gramPanchayat: string;
  village: string;
  claimedAreaHectares: string;
  latitude: string;
  longitude: string;
  documents: ClaimDraftDocumentRef[];
  boundary?: ClaimBoundaryRecord;
}
