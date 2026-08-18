import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="gov-footer" id="footer-section" role="contentinfo">
      {/* Top Footer Strip */}
      <div className="footer-top-strip">
        <div className="gov-container footer-top-content">
          <div className="footer-brand-block">
            <div className="footer-brand-title">BhoomiDrishti</div>
            <div className="footer-brand-tagline">From Land Claims to Evidence-Based Decisions</div>
            <p className="footer-brand-desc">
              Geospatial decision-support prototype for evaluating Forest Rights Act (FRA) claims using Earth observation records, cadastral overlays, and automated temporal analysis.
            </p>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Portal Links</h4>
            <ul className="footer-link-list">
              <li><a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
              <li><a href="#accessibility" onClick={(e) => e.preventDefault()}>Accessibility Statement</a></li>
              <li><a href="#help" onClick={(e) => e.preventDefault()}>Help & User Guide</a></li>
              <li><a href="#contact" onClick={(e) => e.preventDefault()}>Contact & Feedback</a></li>
              <li><a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Statutory Reference</h4>
            <ul className="footer-link-list">
              <li><a href="https://tribal.nic.in" target="_blank" rel="noopener noreferrer">Ministry of Tribal Affairs</a></li>
              <li><a href="https://moef.gov.in" target="_blank" rel="noopener noreferrer">MoEFCC Portal</a></li>
              <li><a href="#fra-act" onClick={(e) => e.preventDefault()}>FRA 2006 Guidelines</a></li>
              <li><a href="#bhuvan" onClick={(e) => e.preventDefault()}>Bhuvan Geoportal / ISRO</a></li>
            </ul>
          </div>

          <div className="footer-contact-block">
            <h4 className="footer-heading">Prototype Technical Desk</h4>
            <p className="contact-line">🏢 NIC / Geospatial Technology Cell</p>
            <p className="contact-line">📧 support.bhoomidrishti@gov.in.demo</p>
            <p className="contact-line">📞 +91 (011) 2338-DEMO</p>
            <div className="gov-tag-pill">Government of India — Prototype</div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Disclaimer Strip */}
      <div className="footer-bottom-strip">
        <div className="gov-container footer-bottom-content">
          <div className="demo-warning-text">
            ⚠️ <strong>Prototype Note:</strong> Data shown is for demonstration and evaluation purposes only. No official statutory rights or claims are created or processed through this interface.
          </div>
          <div className="footer-copy">
            © 2025–2026 BhoomiDrishti • Government of India Decision Support Prototype
          </div>
        </div>
      </div>
    </footer>
  );
};
