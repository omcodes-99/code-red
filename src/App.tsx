import { useState } from 'react';
import './App.css';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StatCard } from './components/StatCard';
import { ClaimTable } from './components/ClaimTable';
import { MapPreview } from './components/MapPreview';
import { EvidenceCard } from './components/EvidenceCard';
import { Disclaimer } from './components/Disclaimer';
import { Footer } from './components/Footer';
import { mockClaims, mockDashboardStats, mockEvidenceItems } from './data/mockData';
import type { FRAClaim } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedClaim, setSelectedClaim] = useState<FRAClaim>(mockClaims[0]);

  const handleSelectClaim = (claim: FRAClaim) => {
    setSelectedClaim(claim);
  };

  const handleOpenMapExplorer = () => {
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bhoomidrishti-app">
      {/* 1. Official Government Header & Navigation */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main id="main-content">
        {/* 2. Hero Section */}
        <Hero
          onViewClaimsClick={() => setActiveTab('claims')}
          onExploreMapClick={() => setActiveTab('map')}
        />

        {/* 3. Statistics Overview Cards */}
        <StatCard stats={mockDashboardStats} />

        {/* 4. Recent Claims Register Table */}
        <ClaimTable
          claims={mockClaims}
          selectedClaimId={selectedClaim?.id}
          onSelectClaim={handleSelectClaim}
        />

        {/* 5. Spatial Evidence Map / Map Explorer Workspace */}
        <MapPreview
          claims={mockClaims}
          selectedClaim={selectedClaim}
          onSelectClaim={handleSelectClaim}
          onOpenExplorer={handleOpenMapExplorer}
        />

        {/* 6. Evidence Summary & Verification Cards */}
        <EvidenceCard evidenceItems={mockEvidenceItems} />

        {/* 7. Important Decision Support Disclaimer */}
        <Disclaimer />
      </main>

      {/* 8. Official Public Sector Footer */}
      <Footer />
    </div>
  );
}

export default App;
