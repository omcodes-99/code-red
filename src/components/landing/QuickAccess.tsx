import React from 'react';
import { useNavigation } from '../../router';
import { SectionHeader } from '../common/SectionHeader';

interface QuickAccessCard {
  id: string;
  title: string;
  description: string;
  route: string;
  tag: string;
  icon: React.ReactNode;
  isComingSoon?: boolean;
}

export const QuickAccess: React.FC = () => {
  const { navigate } = useNavigation();

  const quickAccessItems: QuickAccessCard[] = [
    {
      id: 'submit-claim',
      title: 'Submit Land Claim',
      description: 'Record Individual (IFR), Community (CFR), or Habitat Rights claim details and coordinates.',
      route: '/claim',
      tag: 'Step 1 Entry',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      ),
    },
    {
      id: 'upload-evidence',
      title: 'Upload Evidence',
      description: 'Submit supporting documents, historical records, geo-tagged survey files, or village resolutions.',
      route: '/claim',
      tag: 'Supporting Data',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
    },
    {
      id: 'view-analysis',
      title: 'View Analysis',
      description: 'Examine spatial evidence overlays, NDVI vegetation continuity, and automated report syntheses.',
      route: '/analysis',
      tag: 'Spatial Intelligence',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
      ),
    },
    {
      id: 'track-claim',
      title: 'Track Claim',
      description: 'Check real-time application status at Gram Sabha, SDLC, or District Level Committee (DLC) stages.',
      route: '/track',
      tag: 'Real-Time Status',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      id: 'help-guidelines',
      title: 'Help & Guidelines',
      description: 'Access FRA 2006 statutory rules, standard operating procedures, and user manual documentation.',
      route: '/help',
      tag: 'User Support',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
  ];

  return (
    <section className="gov-section quick-access-section" aria-labelledby="quick-access-title">
      <div className="gov-container">
        <SectionHeader
          id="quick-access-title"
          tag="Public Services & Modules"
          title="Quick Access"
          subtitle="Directly access key functional portals for claim registration, evidence upload, geospatial verification, and status monitoring."
        />

        <div className="quick-access-grid">
          {quickAccessItems.map((item) => (
            <div
              key={item.id}
              className="quick-access-card"
              onClick={() => navigate(item.route)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(item.route);
                }
              }}
              aria-label={`${item.title}: ${item.description}`}
            >
              <div className="quick-access-top-row">
                <div className="quick-access-icon-box" aria-hidden="true">
                  {item.icon}
                </div>
                <span className="quick-access-tag">{item.tag}</span>
              </div>

              <h3 className="quick-access-title">{item.title}</h3>
              <p className="quick-access-desc">{item.description}</p>

              <div className="quick-access-link-arrow">
                <span>Access Module</span>
                <span className="arrow-symbol" aria-hidden="true">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
