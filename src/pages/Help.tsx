import React from 'react';
import { useNavigation } from '../router';
import { SectionHeader } from '../components/common/SectionHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const Help: React.FC = () => {
  const { navigate } = useNavigation();

  const faqs = [
    {
      q: 'What is the Scheduled Tribes and Other Traditional Forest Dwellers Act (FRA 2006)?',
      a: 'The FRA 2006 recognizes the rights of forest-dwelling Scheduled Tribes (FDST) and Other Traditional Forest Dwellers (OTFD) over forest land and resources that they have been occupying and using for generations.',
    },
    {
      q: 'What is the historical cutoff date for FRA claims?',
      a: 'As per the statutory provisions of the Act, claimants must demonstrate occupation or customary use of the land prior to 13 December 2005.',
    },
    {
      q: 'How does BhoomiDrishti verify historical continuity?',
      a: 'BhoomiDrishti queries multi-temporal Earth observation satellite records (Landsat, Sentinel, and ISRO Bhuvan archives) to analyze vegetation patterns (NDVI) and land clearance trends pre-dating 2005.',
    },
    {
      q: 'Does BhoomiDrishti replace the Gram Sabha or SDLC decisions?',
      a: 'No. BhoomiDrishti is strictly a Decision Support System. Under the law, the Gram Sabha is the initiating authority, and the Sub-Divisional and District Level Committees hold statutory power to approve claims.',
    },
  ];

  return (
    <div className="page-help">
      {/* Banner */}
      <div className="gov-page-banner">
        <div className="gov-container">
          <div className="banner-breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Help & Guidelines</span>
          </div>
          <h1 className="banner-page-title">Help, Guidelines & Statutory Documentation</h1>
          <p className="banner-page-subtitle">
            User manuals, Standard Operating Procedures (SOP), and frequently asked questions for BhoomiDrishti
          </p>
        </div>
      </div>

      <div className="gov-container page-content-container">
        {/* Guidelines Grid */}
        <div className="help-cards-grid mb-8">
          <Card
            title="Claimant Submission Guidelines"
            subtitle="Preparation for Gram Sabha Filing"
            variant="bordered"
          >
            <ul className="gov-bullet-list">
              <li>Keep Form A (IFR) or Form B (CFR) duly filled with identity numbers.</li>
              <li>Provide two elder witness affidavits confirming customary possession prior to 13 Dec 2005.</li>
              <li>Mark parcel boundary landmarks with GPS coordinates or village sketch references.</li>
            </ul>
          </Card>

          <Card
            title="Committee Scrutiny SOP"
            subtitle="For SDLC and DLC Members"
            variant="bordered"
          >
            <ul className="gov-bullet-list">
              <li>Cross-examine claimant boundaries against Reserved Forest Compartment layers.</li>
              <li>Review the automated pre-2005 NDVI vegetation continuity score.</li>
              <li>Ensure quorum signatures from the respective Gram Sabha before final DLC recording.</li>
            </ul>
          </Card>
        </div>

        {/* FAQs */}
        <SectionHeader
          tag="Frequently Asked Questions"
          title="Clarifications on Evidence & Legal Determination"
          subtitle="Answers to key questions regarding data sources, confidentiality, and statutory procedure."
        />

        <div className="faq-list mb-8">
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item">
              <h3 className="faq-question">Q{idx + 1}: {faq.q}</h3>
              <p className="faq-answer">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="page-cta-box">
          <h3>Need Further Assistance?</h3>
          <p>Contact the NIC Technical Cell or your District Forest Rights Officer.</p>
          <div className="cta-btn-row">
            <Button variant="primary" onClick={() => navigate('/track')}>
              Track Your Claim
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
