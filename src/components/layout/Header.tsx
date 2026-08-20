import React, { useState, useEffect } from 'react';
import { Link, useNavigation } from '../../router';
import type { NavItem } from '../../types';
import { useTranslation } from 'react-i18next';

export const Header: React.FC = () => {
  const { currentPath, navigate } = useNavigation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'home', label: t('nav.home'), href: '/' },
    { id: 'about', label: t('nav.about'), href: '/about' },
    { id: 'how-it-works', label: t('nav.howItWorks'), href: '/how-it-works' },
    { id: 'dashboard', label: t('nav.dashboard'), href: '/dashboard' },
    { id: 'help', label: t('nav.help'), href: '/help' },
  ];

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="gov-header" role="banner">
      {/* Main Branding & Navigation Row */}
      <div className="gov-main-nav-wrapper">
        <div className="gov-container main-nav-content">
          {/* Official BhoomiDrishti Brand Treatment */}
          <Link to="/" className="brand-block" aria-label={t('brand.homeAria')}>
            <div className="brand-logo-icon" aria-hidden="true">
              <svg width="42" height="42" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="22" cy="22" r="21" fill="#0C2340" stroke="#D97706" strokeWidth="2.2" />
                <path d="M9 28C13.5 20.5 18 18 22 23C26 28 30.5 20.5 35 28" stroke="#15803D" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M14 30.5C17.5 25.5 21 24.5 22 27C23.5 29.5 27 24.5 30 30.5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="22" cy="13.5" r="4.2" fill="#D97706" />
                <path d="M22 7.5V9.5M22 17.5V19.5M16 13.5H18M26 13.5H28" stroke="#F8FAFC" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="brand-text">
              <div className="brand-name-row">
                <span className="brand-name">BhoomiDrishti</span>
                <span className="prototype-pill">{t('brand.prototype')}</span>
              </div>
              <span className="brand-tagline">{t('brand.tagline')}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="primary-navigation desktop-nav" aria-label={t('nav.primaryAria')}>
            <ul className="nav-list">
              {navItems.map((item) => {
                const isItemActive =
                  item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href);

                return (
                  <li key={item.id} className="nav-item">
                    <Link
                      to={item.href}
                      className={`nav-link ${isItemActive ? 'active' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Desktop Auth / Quick Access Action */}
          <div className="header-actions-desktop">
            <button
              type="button"
              className="btn btn-primary btn-size-sm header-login-btn"
              onClick={() => navigate('/login')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>{t('nav.login')}</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="mobile-menu-toggle-wrapper">
            <button
              type="button"
              className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
            </button>
          </div>
        </div>
      </div>

      {/* Tricolor Subtle Accent Bar */}
      <div className="tricolor-bar" aria-hidden="true">
        <span className="saffron" />
        <span className="white" />
        <span className="green" />
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.mobileAria')}
        >
          <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
          <div className="mobile-nav-panel">
            <div className="mobile-nav-header">
              <div className="mobile-brand-title">BhoomiDrishti</div>
              <button
                type="button"
                className="mobile-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label={t('nav.closeMenu')}
              >
                ✕
              </button>
            </div>

            <ul className="mobile-nav-list">
              {navItems.map((item) => {
                const isItemActive =
                  item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href);

                return (
                  <li key={item.id} className="mobile-nav-item">
                    <Link
                      to={item.href}
                      className={`mobile-nav-link ${isItemActive ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mobile-nav-label">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mobile-nav-footer">
              <button
                type="button"
                className="btn btn-primary btn-full-width"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
              >
                {t('nav.officerLogin')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
