import React from 'react';
import { GovernmentBar } from './GovernmentBar';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bhoomidrishti-app-shell">
      {/* 1. Official Government Top Utility Bar */}
      <GovernmentBar />

      {/* 2. Main Government Header & Navigation */}
      <Header />

      {/* 3. Main Accessible Content Area */}
      <main id="main-content" className="bhoomidrishti-main" tabIndex={-1}>
        {children}
      </main>

      {/* 4. Official Government Footer */}
      <Footer />
    </div>
  );
};
