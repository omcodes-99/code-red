import React from 'react';
import { useNavigation } from '../../router';
import { HeroVisual } from './HeroVisual';
import { Button } from '../common/Button';
import { useTranslation } from 'react-i18next';
import { TreePine } from 'lucide-react';

export const Hero: React.FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  return (
    <section className="gov-hero-section" aria-labelledby="hero-main-title">
      <div className="gov-container hero-grid-wrapper">
        {/* Left Column: Text & CTAs */}
        <div className="hero-text-column">
          {/* Official Sector Badge */}
          <div className="hero-dept-badge">
            <span className="dept-emblem"><TreePine size={17} strokeWidth={2} aria-hidden="true" /></span>
            <span>{t('hero.initiative')}</span>
          </div>

          {/* Heading */}
          <h1 id="hero-main-title" className="hero-heading-primary">
            {t('hero.heading')}
          </h1>

          {/* Subheading */}
          <h2 className="hero-subheading">
            {t('hero.subheading')}
          </h2>

          {/* Supporting Text */}
          <p className="hero-description">
            {t('hero.description')}
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
              {t('hero.startAnalysis')}
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
              {t('hero.learnHowItWorks')}
            </Button>
          </div>

          {/* Key Facts / Highlights */}
          <div className="hero-meta-points">
            <div className="meta-point">
              <span className="point-icon">✓</span>
              <span>{t('hero.evidenceAudit')}</span>
            </div>
            <div className="meta-point">
              <span className="point-icon">✓</span>
              <span>{t('hero.humanSupport')}</span>
            </div>
            <div className="meta-point">
              <span className="point-icon">✓</span>
              <span>{t('hero.transparentAdministration')}</span>
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
