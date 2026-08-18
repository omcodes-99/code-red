import React from 'react';

export const Disclaimer: React.FC = () => {
  return (
    <section className="disclaimer-section" id="disclaimer-section" aria-label="Official Disclaimer & Decision Support Policy">
      <div className="gov-container">
        <div className="gov-disclaimer-box" role="note">
          <div className="disclaimer-accent-bar" aria-hidden="true"></div>
          <div className="disclaimer-inner">
            <div className="disclaimer-icon-col" aria-hidden="true">
              <div className="disclaimer-seal">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            </div>

            <div className="disclaimer-content-col">
              <div className="disclaimer-header-row">
                <h3 className="disclaimer-title">Decision Support Only</h3>
                <span className="disclaimer-rule-tag">Human-in-the-Loop Mandate</span>
              </div>
              <p className="disclaimer-text">
                <strong>BhoomiDrishti</strong> provides geospatial and historical information as supporting evidence for human review. It does not automatically approve or reject Forest Rights Act claims.
              </p>
              <p className="disclaimer-subtext">
                All statutory determinations remain strictly under the purview of Gram Sabhas, Sub-Divisional Level Committees (SDLC), and District Level Committees (DLC) pursuant to the Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006 and FRA Rules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
