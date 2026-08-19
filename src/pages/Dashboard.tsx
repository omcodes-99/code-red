import React, { useState } from 'react';
import { useNavigation } from '../router';
import { StatCard } from '../components/StatCard';
import { ClaimTable } from '../components/ClaimTable';
import { MapPreview } from '../components/MapPreview';
import { EvidenceCard } from '../components/EvidenceCard';
import { Disclaimer } from '../components/Disclaimer';
import { mockClaims, mockDashboardStats, mockEvidenceItems } from '../data/mockData';
import type { FRAClaim } from '../types';
import { Button } from '../components/common/Button';

export const Dashboard: React.FC = () => {
  const { navigate } = useNavigation();
  const [selectedClaim, setSelectedClaim] = useState<FRAClaim>(mockClaims[0]);

  const handleSelectClaim = (claim: FRAClaim) => {
    setSelectedClaim(claim);
  };

  const handleOpenMapExplorer = () => {
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="page-dashboard">
      {/* Dashboard Top Header Bar */}
      <div className="dashboard-top-bar">
        <div className="gov-container dashboard-header-content">
          <div>
            <div className="dashboard-badges-row">
              <span className="gov-dept-pill">
                MINISTRY OF TRIBAL AFFAIRS • GOVT. OF INDIA
              </span>
              <div className="dashboard-badge">
                <span className="live-pulse" />
                <span>Plot Verification: Sambalpur & Mayurbhanj (Odisha)</span>
              </div>
            </div>
            <h1 className="dashboard-title">Claims & Evidence Dashboard</h1>
            <p className="dashboard-subtitle">
              Integrated spatial overview, evidentiary confidence metrics, and claim register for SDLC/DLC decision support.
            </p>
          </div>


          <div className="dashboard-actions">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/claim')}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              }
            >
              New Claim
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/analysis')}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                </svg>
              }
            >
              Spatial Workbench
            </Button>
          </div>
        </div>
      </div>

      <div className="dashboard-body">
        {/* 1. Statistics Overview Cards */}
        <StatCard stats={mockDashboardStats} />

        {/* 2. Recent Claims Register Table */}
        <ClaimTable
          claims={mockClaims}
          selectedClaimId={selectedClaim?.id}
          onSelectClaim={handleSelectClaim}
        />

        {/* 3. Spatial Evidence Map / Map Explorer Workspace */}
        <MapPreview
          claims={mockClaims}
          selectedClaim={selectedClaim}
          onSelectClaim={handleSelectClaim}
          onOpenExplorer={handleOpenMapExplorer}
        />

        {/* 4. Evidence Summary & Verification Indicators */}
        <EvidenceCard evidenceItems={mockEvidenceItems} />

        {/* 5. Decision Support Policy & Statutory Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
};
