import React from 'react';
import { useNavigation } from '../../router';
import { HeroVisual } from './HeroVisual';
import { Button } from '../common/Button';

export const Hero: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <section className="gov-hero-section" aria-labelledby="hero-main-title">
      <div className="gov-container hero-grid-wrapper">
        {/* Left Column: Text & CTAs */}
        <div className="hero-text-column">
          {/* Official Sector Badge */}
          <div className="hero-dept-badge">
            <span className="dept-emblem">🏛️</span>
            <span>Forest Rights Act (FRA 2006) Decision Support Initiative</span>
          </div>

          {/* Heading */}
          <h1 id="hero-main-title" className="hero-heading-primary">
            BhoomiDrishti
          </h1>

          {/* Subheading */}
          <h2 className="hero-subheading">
            From Land Claims to Evidence-Based Decisions
          </h2>

          {/* Supporting Text */}
          <p className="hero-description">
            BhoomiDrishti helps transform land-claim information and supporting evidence into structured, transparent and actionable insights. By synthesizing multi-temporal satellite records, cadastral boundary overlays, and documentary submissions, the platform assists public administration committees in making well-informed, evidence-backed assessments.
          </p>

          {/* Call to Actions */}
          <div className="hero-cta-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              }
            >
              Start Analysis
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/how-it-works')}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              }
            >
              Learn How It Works
            </Button>
          </div>

          {/* Key Facts / Highlights */}
          <div className="hero-meta-points">
            <div className="meta-point">
              <span className="point-icon">✓</span>
              <span>Evidence-Backed Spatial Audit</span>
            </div>
            <div className="meta-point">
              <span className="point-icon">✓</span>
              <span>Human-in-the-Loop SDLC/DLC Support</span>
            </div>
            <div className="meta-point">
              <span className="point-icon">✓</span>
              <span>Transparent Public Administration</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Diagram */}
        <div className="hero-visual-column">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
};
