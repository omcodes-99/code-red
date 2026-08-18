import React, { useState } from 'react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const [selectedLang, setSelectedLang] = useState<'EN' | 'HI'>('EN');
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);

  const handleFontSize = (delta: number) => {
    const newOffset = Math.max(-2, Math.min(2, fontSizeOffset + delta));
    setFontSizeOffset(newOffset);
    document.documentElement.style.fontSize = `${16 + newOffset * 1.5}px`;
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '#dashboard-overview' },
    { id: 'claims', label: 'Claims', href: '#claims-section' },
    { id: 'map', label: 'Map Explorer', href: '#map-section' },
    { id: 'evidence', label: 'Evidence', href: '#evidence-section' },
    { id: 'reports', label: 'Reports', href: '#disclaimer-section' },
    { id: 'help', label: 'Help', href: '#footer-section' },
  ];

  return (
    <header className="gov-header">
      {/* Top Utility Bar (Government of India Official Strip) */}
      <div className="gov-utility-bar">
        <div className="gov-container utility-content">
          <div className="gov-identity-strip">
            <div className="emblem-placeholder" aria-hidden="true">
              🏛️
            </div>
            <div className="gov-titles">
              <span className="gov-title-hindi">भारत सरकार | Government of India</span>
              <span className="gov-ministry">जनजातीय कार्य मंत्रालय | Ministry of Tribal Affairs</span>
            </div>
          </div>

          <div className="gov-utility-controls">
            {/* Accessibility Font Resizer */}
            <div className="accessibility-controls" aria-label="Accessibility Font Size Controls">
              <button 
                type="button" 
                className="a11y-btn" 
                onClick={() => handleFontSize(-1)}
                title="Decrease Font Size"
              >
                A-
              </button>
              <button 
                type="button" 
                className="a11y-btn" 
                onClick={() => handleFontSize(0 - fontSizeOffset)}
                title="Reset Font Size"
              >
                A
              </button>
              <button 
                type="button" 
                className="a11y-btn" 
                onClick={() => handleFontSize(1)}
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            <div className="utility-divider"></div>

            {/* Language Switcher */}
            <div className="lang-switcher" role="radiogroup" aria-label="Language Selector">
              <button
                type="button"
                className={`lang-btn ${selectedLang === 'HI' ? 'active' : ''}`}
                onClick={() => setSelectedLang('HI')}
              >
                हिन्दी
              </button>
              <span className="lang-sep">|</span>
              <button
                type="button"
                className={`lang-btn ${selectedLang === 'EN' ? 'active' : ''}`}
                onClick={() => setSelectedLang('EN')}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Branding and Navigation Bar */}
      <div className="gov-main-nav-wrapper">
        <div className="gov-container main-nav-content">
          <div className="brand-block">
            <div className="brand-logo-icon">
              <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="BhoomiDrishti Seal">
                <circle cx="18" cy="18" r="17" fill="#0C2340" stroke="#D97706" strokeWidth="2"/>
                <path d="M7 23C11 17 15 15 18 19C21 23 25 17 29 23" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M11 25C14 21 17 20 18 22C19 24 22 20 25 25" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="18" cy="11" r="3.5" fill="#D97706"/>
                <path d="M18 6V8M18 14V16M13 11H15M21 11H23" stroke="#F8FAFC" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="brand-text">
              <div className="brand-name-row">
                <span className="brand-name">BhoomiDrishti</span>
                <span className="prototype-pill">PROTOTYPE</span>
              </div>
              <span className="brand-tagline">From Land Claims to Evidence-Based Decisions</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="primary-navigation" aria-label="Main Navigation">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.id} className="nav-item">
                  <a
                    href={item.href}
                    className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => onTabChange(item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Tricolor Subtle Accent Bar */}
      <div className="tricolor-bar" aria-hidden="true">
        <span className="saffron"></span>
        <span className="white"></span>
        <span className="green"></span>
      </div>
    </header>
  );
};
