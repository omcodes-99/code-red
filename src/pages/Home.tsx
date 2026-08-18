import React from 'react';
import { Hero } from '../components/landing/Hero';
import { QuickAccess } from '../components/landing/QuickAccess';
import { HowItWorks } from '../components/landing/HowItWorks';
import { TrustSection } from '../components/landing/TrustSection';
import { Disclaimer } from '../components/Disclaimer';

export const Home: React.FC = () => {
  return (
    <div className="page-home">
      {/* 1. Official Hero Section with Visual Diagram */}
      <Hero />

      {/* 2. Quick Access Cards */}
      <QuickAccess />

      {/* 3. 4-Step How It Works Process Flow */}
      <HowItWorks />

      {/* 4. Evidence, Transparency & Accessibility Trust Pillars */}
      <TrustSection />

      {/* 5. Statutory Decision Support Disclaimer */}
      <Disclaimer />
    </div>
  );
};
