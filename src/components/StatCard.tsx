import React from 'react';
import type { DashboardStats } from '../types';

interface StatCardProps {
  stats: DashboardStats;
}

export const StatCard: React.FC<StatCardProps> = ({ stats }) => {
  const cards = [
    {
      id: 'total',
      title: 'Total Claims Registered',
      value: stats.totalClaims,
      subtext: 'Individual (IFR) & Community (CFR)',
      badgeText: 'Total Inflow',
      colorTheme: 'blue',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          <path d="M9 14l2 2 4-4"></path>
        </svg>
      ),
    },
    {
      id: 'review',
      title: 'Under Review',
      value: stats.underReview,
      subtext: 'Pending SDLC/DLC decision',
      badgeText: 'In Progress',
      colorTheme: 'amber',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
    },
    {
      id: 'evidence',
      title: 'Evidence Available',
      value: stats.evidenceAvailable,
      subtext: 'Satellite & LULC records linked',
      badgeText: 'Verified Spatial Data',
      colorTheme: 'green',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
    },
    {
      id: 'attention',
      title: 'Needs Attention',
      value: stats.needsAttention,
      subtext: 'Boundary dispute or low confidence',
      badgeText: 'Action Required',
      colorTheme: 'red',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      ),
    },
  ];

  return (
    <section className="stats-section" id="dashboard-overview" aria-label="Dashboard Key Metrics">
      <div className="gov-container">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Claim Processing Overview</h2>
            <p className="section-subtext">Aggregated caseload and evidentiary status metrics across pilot blocks</p>
          </div>
          <div className="demo-notice-tag" title="Prototype Demonstration Data Only">
            <span className="demo-dot"></span>
            Demo Data
          </div>
        </div>

        <div className="stats-grid">
          {cards.map((card) => (
            <div key={card.id} className={`stat-card stat-card--${card.colorTheme}`}>
              <div className="stat-card-top">
                <span className="stat-card-icon" aria-hidden="true">
                  {card.icon}
                </span>
                <span className={`stat-badge stat-badge--${card.colorTheme}`}>
                  {card.badgeText}
                </span>
              </div>
              <div className="stat-value-container">
                <span className="stat-number">{card.value}</span>
                <span className="stat-unit">claims</span>
              </div>
              <h3 className="stat-card-title">{card.title}</h3>
              <p className="stat-card-subtext">{card.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
