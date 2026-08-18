import React, { useState } from 'react';
import type { FRAClaim, EvidenceStatus, ReviewStatus } from '../types';

interface ClaimTableProps {
  claims: FRAClaim[];
  onSelectClaim?: (claim: FRAClaim) => void;
  selectedClaimId?: string;
}

export const ClaimTable: React.FC<ClaimTableProps> = ({
  claims,
  onSelectClaim,
  selectedClaimId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.block.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'UNDER_REVIEW') return claim.reviewStatus === 'Under Review';
    if (statusFilter === 'EVIDENCE_READY') return claim.reviewStatus === 'Evidence Ready';
    if (statusFilter === 'ATTENTION_REQUIRED') return claim.reviewStatus === 'Attention Required';
    return true;
  });

  const getEvidenceBadge = (status: EvidenceStatus) => {
    switch (status) {
      case 'Strong':
        return <span className="status-badge badge-evidence-strong">Strong (High Conf.)</span>;
      case 'Moderate':
        return <span className="status-badge badge-evidence-moderate">Moderate</span>;
      case 'Needs Review':
        return <span className="status-badge badge-evidence-low">Needs Review</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getReviewBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'Under Review':
        return <span className="status-badge badge-review-progress">Under Review</span>;
      case 'Evidence Ready':
        return <span className="status-badge badge-review-ready">Evidence Ready</span>;
      case 'Attention Required':
        return <span className="status-badge badge-review-alert">Attention Required</span>;
      case 'Approved (Gram Sabha)':
        return <span className="status-badge badge-review-approved">Approved (Gram Sabha)</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <section className="claims-section" id="claims-section" aria-labelledby="claims-table-heading">
      <div className="gov-container">
        <div className="table-header-block">
          <div>
            <h2 id="claims-table-heading" className="section-title">
              Recent FRA Land Claims Register
            </h2>
            <p className="section-subtext">
              Listing individual and community forest rights claims queued for geospatial evidence assessment
            </p>
          </div>
          <div className="table-count-badge">
            Showing {filteredClaims.length} of {claims.length} Claims
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="table-controls-bar">
          <div className="filter-tab-group" role="tablist" aria-label="Filter Claims by Status">
            <button
              type="button"
              className={`filter-tab-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              All Claims ({claims.length})
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${statusFilter === 'UNDER_REVIEW' ? 'active' : ''}`}
              onClick={() => setStatusFilter('UNDER_REVIEW')}
            >
              Under Review
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${statusFilter === 'EVIDENCE_READY' ? 'active' : ''}`}
              onClick={() => setStatusFilter('EVIDENCE_READY')}
            >
              Evidence Ready
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${statusFilter === 'ATTENTION_REQUIRED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ATTENTION_REQUIRED')}
            >
              Attention Required
            </button>
          </div>

          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by ID, Applicant, District..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search claims by ID, Applicant or District"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Clear Search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Accessible Data Table */}
        <div className="table-responsive-wrapper">
          <table className="gov-data-table">
            <caption className="sr-only">Forest Rights Act Claims Assessment Register</caption>
            <thead>
              <tr>
                <th scope="col">Claim ID</th>
                <th scope="col">Applicant & Community</th>
                <th scope="col">District / Block</th>
                <th scope="col">Area (ha)</th>
                <th scope="col">Evidence Status</th>
                <th scope="col">Review Status</th>
                <th scope="col">Last Updated</th>
                <th scope="col" className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="no-data-cell">
                    No claims match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => {
                  const isSelected = selectedClaimId === claim.id;
                  return (
                    <tr
                      key={claim.id}
                      className={isSelected ? 'selected-row' : ''}
                      onClick={() => onSelectClaim && onSelectClaim(claim)}
                    >
                      <td className="font-mono claim-id-cell">
                        <span className="id-tag">{claim.id}</span>
                      </td>
                      <td>
                        <div className="applicant-name">{claim.claimantName}</div>
                        <div className="applicant-meta">{claim.tribeOrCommunity}</div>
                      </td>
                      <td>
                        <div className="district-name">{claim.district}</div>
                        <div className="block-name">{claim.block} • {claim.gramPanchayat}</div>
                      </td>
                      <td className="area-cell font-mono">
                        {claim.areaHectares.toFixed(2)} ha
                      </td>
                      <td>{getEvidenceBadge(claim.evidenceStatus)}</td>
                      <td>{getReviewBadge(claim.reviewStatus)}</td>
                      <td className="date-cell">{claim.lastUpdated}</td>
                      <td className="text-right">
                        <button
                          type="button"
                          className="table-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectClaim) onSelectClaim(claim);
                            const mapElem = document.getElementById('map-section');
                            if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
                          }}
                          title={`View Spatial Record for ${claim.id}`}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer-note">
          <span>* Records sourced from Sub-Divisional Level Committee (SDLC) pilot database.</span>
          <span className="demo-tag">Demonstration Register</span>
        </div>
      </div>
    </section>
  );
};
