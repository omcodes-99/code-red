import React from 'react';
import { SectionHeader } from '../common/SectionHeader';

interface WorkflowStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  highlights: string[];
}

export const HowItWorks: React.FC = () => {
  const steps: WorkflowStep[] = [
    {
      number: '01',
      title: 'Submit Claim',
      subtitle: 'Land-Claim Registration',
      description: 'Enter the relevant land-claim information including claimant particulars, community/tribe details, and boundary specifications.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
      highlights: ['Individual (IFR) & Community (CFR)', 'GPS Village Coordinates', 'Gram Sabha Reference ID'],
    },
    {
      number: '02',
      title: 'Provide Evidence',
      subtitle: 'Evidentiary Documentation',
      description: 'Upload supporting documents, images, cadastral boundary maps, or available historical evidence that corroborate the customary land claim.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
      highlights: ['Village Elder Testimonies', 'Physical Land Photos', 'Revenue & Cadastral Records'],
    },
    {
      number: '03',
      title: 'Analyze Evidence',
      subtitle: 'Geospatial & Historical Synthesis',
      description: 'BhoomiDrishti organizes and evaluates the available information using multi-temporal Earth observation records and boundary overlays.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
      highlights: ['Pre-2005 Baseline Audit', 'Canopy & NDVI Trends', 'Cadastral Parcel Intersections'],
    },
    {
      number: '04',
      title: 'Evidence-Based Decision',
      subtitle: 'Structured Decision Support',
      description: 'View structured insights, confidence scores, and evidentiary summaries to support informed decision-making by statutory authorities.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
      highlights: ['SDLC & DLC Action Reports', 'Audit Trail Documentation', 'Human-in-the-Loop Verdicts'],
    },
  ];

  return (
    <section className="gov-section how-it-works-section" id="how-it-works" aria-labelledby="how-it-works-title">
      <div className="gov-container">
        <SectionHeader
          id="how-it-works-title"
          tag="Standard Operating Procedure"
          title="How It Works"
          subtitle="A structured 4-step workflow connecting land claims, supporting documentary records, and geospatial evidence for transparent public evaluation."
        />

        <div className="steps-flow-grid">
          {steps.map((step, idx) => (
            <div key={step.number} className="step-process-card">
              {/* Top Step Number Header */}
              <div className="step-card-top">
                <span className="step-number-pill">{step.number}</span>
                <div className="step-icon-bubble" aria-hidden="true">
                  {step.icon}
                </div>
              </div>

              {/* Step Title & Subtitle */}
              <h3 className="step-title">{step.title}</h3>
              <span className="step-subtitle">{step.subtitle}</span>

              {/* Step Description */}
              <p className="step-description">{step.description}</p>

              {/* Step Highlights */}
              <div className="step-highlights">
                {step.highlights.map((h, i) => (
                  <div key={i} className="step-highlight-item">
                    <span className="bullet-dot" aria-hidden="true" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {idx < steps.length - 1 && (
                <div className="step-connector-arrow" aria-hidden="true">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
