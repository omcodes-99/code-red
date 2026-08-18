import React, { useState } from 'react';
import { useNavigation } from '../router';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { mockClaims } from '../data/mockData';

export const Track: React.FC = () => {
  const { navigate } = useNavigation();
  const [searchId, setSearchId] = useState('FRA-2025-001');
  const [searchedClaim, setSearchedClaim] = useState(mockClaims[0]);
  const [searched, setSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = mockClaims.find(
      (c) => c.id.toLowerCase() === searchId.trim().toLowerCase()
    );
    setSearchedClaim(found || mockClaims[0]);
    setSearched(true);
  };

  return (
    <div className="page-track">
      {/* Banner */}
      <div className="gov-page-banner">
        <div className="gov-container">
          <div className="banner-breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Track Claim</span>
          </div>
          <h1 className="banner-page-title">Track Claim Status</h1>
          <p className="banner-page-subtitle">
            Real-time status lookup across Gram Sabha, SDLC, and DLC statutory review stages
          </p>
        </div>
      </div>

      <div className="gov-container page-content-container">
        {/* Search Box */}
        <div className="track-search-card">
          <form onSubmit={handleSearch} className="track-search-form">
            <Input
              label="Enter Claim ID or Reference Number"
              placeholder="e.g. FRA-2025-001 or FRA-2025-002"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              helperText="Demo IDs: FRA-2025-001 through FRA-2025-006"
              required
            />
            <Button type="submit" variant="primary" size="md">
              Search Status
            </Button>
          </form>
        </div>

        {searched && searchedClaim && (
          <div className="track-results-area mt-6">
            <Card
              title={`Application Status: ${searchedClaim.id}`}
              subtitle={`Claimant: ${searchedClaim.claimantName} • ${searchedClaim.tribeOrCommunity}`}
              variant="accent-navy"
              badge={
                <Badge
                  variant={
                    searchedClaim.reviewStatus === 'Approved (Gram Sabha)'
                      ? 'success'
                      : searchedClaim.reviewStatus === 'Evidence Ready'
                      ? 'info'
                      : 'warning'
                  }
                >
                  {searchedClaim.reviewStatus}
                </Badge>
              }
            >
              {/* Claim Overview Metadata */}
              <div className="track-meta-grid">
                <div className="track-meta-item">
                  <span className="meta-lbl">District & Block:</span>
                  <span className="meta-val">{searchedClaim.district}, {searchedClaim.block}</span>
                </div>
                <div className="track-meta-item">
                  <span className="meta-lbl">Gram Panchayat:</span>
                  <span className="meta-val">{searchedClaim.gramPanchayat}</span>
                </div>
                <div className="track-meta-item">
                  <span className="meta-lbl">Claim Type:</span>
                  <span className="meta-val">{searchedClaim.claimType}</span>
                </div>
                <div className="track-meta-item">
                  <span className="meta-lbl">Claimed Area:</span>
                  <span className="meta-val">{searchedClaim.areaHectares} Hectares</span>
                </div>
                <div className="track-meta-item">
                  <span className="meta-lbl">Evidence Status:</span>
                  <span className="meta-val font-bold text-green-700">{searchedClaim.evidenceStatus}</span>
                </div>
                <div className="track-meta-item">
                  <span className="meta-lbl">Last Action Date:</span>
                  <span className="meta-val">{searchedClaim.lastUpdated}</span>
                </div>
              </div>

              {/* Progress Milestones Tracker */}
              <div className="track-timeline-box mt-6">
                <h4 className="timeline-heading">Statutory Processing Milestones</h4>
                <div className="timeline-stages">
                  <div className="stage-step completed">
                    <div className="stage-node">✓</div>
                    <span className="stage-title">Gram Sabha Filing</span>
                    <span className="stage-date">Passed Quorum</span>
                  </div>

                  <div className="stage-step completed">
                    <div className="stage-node">✓</div>
                    <span className="stage-title">FRC Joint Field Survey</span>
                    <span className="stage-date">GPS Verified</span>
                  </div>

                  <div className="stage-step active">
                    <div className="stage-node">3</div>
                    <span className="stage-title">SDLC Geospatial Audit</span>
                    <span className="stage-date">Under Scrutiny</span>
                  </div>

                  <div className="stage-step pending">
                    <div className="stage-node">4</div>
                    <span className="stage-title">DLC Final Title Sanction</span>
                    <span className="stage-date">Awaiting SDLC</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" size="sm" onClick={() => navigate('/analysis')}>
                  Inspect Evidence in Workbench
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
                  View All Claims
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
