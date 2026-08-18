import React from 'react';
import { SectionHeader } from '../common/SectionHeader';

interface TrustPillar {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  standards: string[];
}

export const TrustSection: React.FC = () => {
  const pillars: TrustPillar[] = [
    {
      id: 'evidence-based',
      title: 'Evidence-Based',
      tagline: 'Grounded in verifiable data',
      description: 'Decisions are supported by available evidence and documented information, combining multi-year satellite archives, cadastral maps, and ground ground-truth testimonies.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      standards: [
        'Multi-temporal satellite verification',
        'Cadastral and forest layer correlation',
        'Quantified confidence indicators',
      ],
    },
    {
      id: 'transparent',
      title: 'Transparent',
      tagline: 'Open audit trails for public trust',
      description: 'Information and analysis should be presented in a clear and understandable manner, ensuring Gram Sabhas and review committees can inspect the reasoning and supporting layers.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      standards: [
        'Complete chronological audit history',
        'Visible spatial boundary intersections',
        'Non-opaque evaluation metrics',
      ],
    },
    {
      id: 'accessible',
      title: 'Accessible',
      tagline: 'Inclusive for all administrative levels',
      description: 'Designed to make land-claim information easier to understand and process for Gram Panchayat representatives, SDLC officers, and district administrators alike.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="7" r="4" />
          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        </svg>
      ),
      standards: [
        'Bilingual English and हिन्दी interface',
        'W3C / GIGW accessibility compliant',
        'Intuitive spatial visualization tools',
      ],
    },
  ];

  return (
    <section className="gov-section trust-section" aria-labelledby="trust-section-title">
      <div className="gov-container">
        <SectionHeader
          id="trust-section-title"
          tag="Core Principles"
          title="Evidence. Transparency. Better Decisions."
          subtitle="Our foundational framework ensures that land-claim evaluations are rooted in objective evidence, transparent procedures, and accessible governance."
          centered
        />

        <div className="trust-pillars-grid">
          {pillars.map((pillar) => (
            <div key={pillar.id} className="trust-pillar-card">
              <div className="pillar-header-row">
                <div className="pillar-icon-box" aria-hidden="true">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <span className="pillar-tagline">{pillar.tagline}</span>
                </div>
              </div>

              <p className="pillar-description">{pillar.description}</p>

              <div className="pillar-standards-box">
                <h4 className="standards-heading">Key Assurances:</h4>
                <ul className="standards-list">
                  {pillar.standards.map((std, i) => (
                    <li key={i} className="standards-item">
                      <span className="check-mark" aria-hidden="true">✓</span>
                      <span>{std}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
