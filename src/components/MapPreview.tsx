import React from 'react';
import type { FRAClaim } from '../types';
import { mockClaims } from '../data/mockData';
import { MapExplorer } from './map/MapExplorer';

interface MapPreviewProps {
  selectedClaim?: FRAClaim;
  claims?: FRAClaim[];
  onSelectClaim?: (claim: FRAClaim) => void;
  onOpenExplorer?: () => void;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  selectedClaim = mockClaims[0],
  claims = mockClaims,
  onSelectClaim = () => {},
}) => {
  return (
    <MapExplorer
      claims={claims}
      selectedClaim={selectedClaim}
      onSelectClaim={onSelectClaim}
    />
  );
};
