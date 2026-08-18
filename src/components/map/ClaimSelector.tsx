import React, { useState } from 'react';
import type { FRAClaim } from '../../types';

interface ClaimSelectorProps {
  claims: FRAClaim[];
  selectedClaim: FRAClaim;
  onSelectClaim: (claim: FRAClaim) => void;
}

export const ClaimSelector: React.FC<ClaimSelectorProps> = ({
  claims,
  selectedClaim,
  onSelectClaim,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClaims = claims.filter(
    (c) =>
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tribeOrCommunity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="claim-selector-card" aria-label="Demo Claim Selection Bar">
      <div className="claim-selector-header">
        <div className="selector-title-group">
          <span className="selector-label">Active FRA Case Record</span>
          <div className="selector-dropdown-wrapper">
            <button
              type="button"
              className="claim-dropdown-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              <span className="active-claim-id font-mono">{selectedClaim.id}</span>
              <span className="active-claimant-name">— {selectedClaim.claimantName}</span>
              <span className="dropdown-chevron">{isDropdownOpen ? '▲' : '▼'}</span>
            </button>

            {isDropdownOpen && (
              <div className="claim-dropdown-menu" role="listbox">
                <div className="dropdown-search-box">
                  <input
                    type="text"
                    placeholder="Search by ID, name or community..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    aria-label="Filter demo claims"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="clear-filter-btn"
                      onClick={() => setSearchTerm('')}
                    >
                      ×
                    </button>
                  )}
                </div>
                <ul className="claim-dropdown-list">
                  {filteredClaims.map((claim) => {
                    const isCurrent = claim.id === selectedClaim.id;
                    return (
                      <li
                        key={claim.id}
                        role="option"
                        aria-selected={isCurrent}
                        className={`claim-dropdown-item ${isCurrent ? 'selected' : ''}`}
                        onClick={() => {
                          onSelectClaim(claim);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div className="item-row-top">
                          <span className="item-id font-mono">{claim.id}</span>
                          <span className={`item-badge badge-${claim.evidenceStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                            {claim.evidenceStatus}
                          </span>
                        </div>
                        <div className="item-claimant">{claim.claimantName}</div>
                        <div className="item-meta">
                          {claim.tribeOrCommunity} • {claim.block}, {claim.district} ({claim.areaHectares.toFixed(2)} ha)
                        </div>
                      </li>
                    );
                  })}
                  {filteredClaims.length === 0 && (
                    <li className="dropdown-no-results">No matching demonstration claims.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="selector-quick-meta">
          <span className="demo-prototype-badge" title="Prototype Demonstration Data Only">
            Demo Case
          </span>
        </div>
      </div>

      {/* Structured Claim Detail Strip */}
      <div className="claim-meta-grid">
        <div className="claim-meta-cell">
          <span className="meta-cell-label">Claimant</span>
          <strong className="meta-cell-value">{selectedClaim.claimantName}</strong>
        </div>

        <div className="claim-meta-cell">
          <span className="meta-cell-label">Community</span>
          <span className="meta-cell-value">{selectedClaim.tribeOrCommunity}</span>
        </div>

        <div className="claim-meta-cell">
          <span className="meta-cell-label">District / Block</span>
          <span className="meta-cell-value">
            {selectedClaim.district} / {selectedClaim.block}
          </span>
        </div>

        <div className="claim-meta-cell">
          <span className="meta-cell-label">Gram Panchayat</span>
          <span className="meta-cell-value">{selectedClaim.gramPanchayat}</span>
        </div>

        <div className="claim-meta-cell">
          <span className="meta-cell-label">Claimed Area</span>
          <strong className="meta-cell-value text-navy font-mono">
            {selectedClaim.areaHectares.toFixed(2)} ha
          </strong>
        </div>

        <div className="claim-meta-cell">
          <span className="meta-cell-label">Cadastral Ref</span>
          <span className="meta-cell-value font-mono">
            {selectedClaim.khasraNumber || 'Khasra Plot'}
          </span>
        </div>

        <div className="claim-meta-cell">
          <span className="meta-cell-label">Statutory Stage</span>
          <span className="meta-cell-badge">
            {selectedClaim.reviewStatus}
          </span>
        </div>
      </div>
    </div>
  );
};
