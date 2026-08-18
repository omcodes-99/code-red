import React from 'react';
import { Link } from '../../router';

export const Footer: React.FC = () => {
  return (
    <footer className="gov-footer" id="footer-section" role="contentinfo">
      {/* Top Footer Section */}
      <div className="footer-top-strip">
        <div className="gov-container footer-top-content">
          {/* Brand & Purpose Column */}
          <div className="footer-brand-block">
            <div className="footer-brand-title">BhoomiDrishti</div>
            <div className="footer-brand-tagline">From Land Claims to Evidence-Based Decisions</div>
            <p className="footer-brand-desc">
              An evidence-based decision-support platform designed to help examine land claims using Earth observation data, cadastral boundary overlays, and historical temporal evidence for transparent, informed public administration.
            </p>
            <div className="gov-portal-seal">
              <span className="seal-icon">🏛️</span>
              <span className="seal-text">Digital Public Infrastructure • Government of India Prototype</span>
            </div>
          </div>

          {/* Important Portal Links */}
          <div className="footer-links-group">
            <h4 className="footer-heading">Important Links</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/about">About BhoomiDrishti</Link>
              </li>
              <li>
                <Link to="/how-it-works">How It Works</Link>
              </li>
              <li>
                <Link to="/help">Help & Guidelines</Link>
              </li>
              <li>
                <Link to="/track">Track Claim Status</Link>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: BhoomiDrishti adheres to the Digital Personal Data Protection standards.'); }}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Use: This system is intended for authorized verification and evidence evaluation.'); }}>
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>

          {/* Government Portals & Statutory Resources */}
          <div className="footer-links-group">
            <h4 className="footer-heading">Government Portals</h4>
            <ul className="footer-link-list">
              <li>
                <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer">
                  National Portal of India ↗
                </a>
              </li>
              <li>
                <a href="https://digitalindia.gov.in" target="_blank" rel="noopener noreferrer">
                  Digital India ↗
                </a>
              </li>
              <li>
                <a href="https://tribal.nic.in" target="_blank" rel="noopener noreferrer">
                  Ministry of Tribal Affairs ↗
                </a>
              </li>
              <li>
                <a href="https://moef.gov.in" target="_blank" rel="noopener noreferrer">
                  Ministry of Environment & Forests ↗
                </a>
              </li>
              <li>
                <a href="https://bhuvan.nrsc.gov.in" target="_blank" rel="noopener noreferrer">
                  Bhuvan Geoportal (ISRO) ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Technical & Administrative Help Desk */}
          <div className="footer-contact-block">
            <h4 className="footer-heading">Technical Desk</h4>
            <p className="contact-line">
              <strong>Institutional Cell:</strong> National Informatics Centre (NIC) / Spatial Data Unit
            </p>
            <p className="contact-line">
              <strong>Support Email:</strong> support.bhoomidrishti@nic.in.demo
            </p>
            <p className="contact-line">
              <strong>Toll-Free Helpline:</strong> 1800-11-BHU (Demo Desk)
            </p>
            <div className="gov-tag-pill">
              Public Sector Decision Support Prototype
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Legal Disclaimer Banner */}
      <div className="footer-disclaimer-strip">
        <div className="gov-container">
          <div className="statutory-disclaimer-box">
            <div className="disclaimer-title-inline">
              <span className="alert-icon-inline">⚖️</span>
              <strong>Statutory Decision Support Disclaimer:</strong>
            </div>
            <p className="disclaimer-body-text">
              "Information presented through BhoomiDrishti is intended to support evidence-based assessment and does not by itself constitute a legal determination of land rights." All statutory determinations remain under the exclusive authority of the designated Gram Sabhas, Sub-Divisional Level Committees (SDLC), and District Level Committees (DLC) pursuant to the Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="footer-bottom-strip">
        <div className="gov-container footer-bottom-content">
          <div className="footer-copy">
            © 2026 BhoomiDrishti • Government of India Digital Portal Initiative • All Rights Reserved
          </div>
          <div className="footer-standards">
            <span>Compliant with GIGW (Guidelines for Indian Government Websites)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
