import React from 'react';
import { useNavigation } from '../router';
import { SectionHeader } from '../components/common/SectionHeader';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

export const HowItWorksPage: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="page-how-it-works">
      {/* Banner */}
      <div className="gov-page-banner">
        <div className="gov-container">
          <div className="banner-breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">How It Works</span>
          </div>
          <h1 className="banner-page-title">How BhoomiDrishti Works</h1>
          <p className="banner-page-subtitle">
            An End-to-End Guide to Evidence-Backed Forest Rights Assessment
          </p>
        </div>
      </div>

      <div className="gov-container page-content-container">
        {/* Core 4-step Section */}
        <HowItWorks />

        {/* Detailed Breakdown */}
        <div className="workflow-detail-section mb-8">
          <SectionHeader
            tag="Technical Architecture"
            title="Evidentiary Data Sources & Verification Layers"
            subtitle="How satellite, cadastral, and documentary records are transformed into actionable decision portfolios."
          />

          <div className="workflow-cards-grid mb-8">
            <Card
              title="1. Multi-Temporal Satellite Archives"
              subtitle="Earth Observation (ISRO / Landsat / Sentinel)"
              variant="bordered"
            >
              <p className="mb-2">
                The platform queries high-resolution satellite imagery across historical timelines (pre-2005 baseline through current year) to detect continuous land cultivation and habitation patterns.
              </p>
              <div className="tech-badge-row">
                <span className="tech-tag">NDVI Vegetation Indices</span>
                <span className="tech-tag">Land Use / Land Cover (LULC)</span>
                <span className="tech-tag">Canopy Density</span>
              </div>
            </Card>

            <Card
              title="2. Cadastral & Forest Boundary Integration"
              subtitle="Spatial Geometry Cross-Matching"
              variant="bordered"
            >
              <p className="mb-2">
                Claim coordinates and survey polygons are overlaid against state revenue cadastral maps, Gram Panchayat boundaries, and Reserved/Protected Forest compartment perimeters.
              </p>
              <div className="tech-badge-row">
                <span className="tech-tag">Cadastral Parcels</span>
                <span className="tech-tag">Forest Compartments</span>
                <span className="tech-tag">Boundary Overlap Check</span>
              </div>
            </Card>

            <Card
              title="3. Documentary & Testimonial Corroboration"
              subtitle="Digitized Physical Submissions"
              variant="bordered"
            >
              <p className="mb-2">
                Ground evidence such as Gram Sabha quorum resolutions, elder witness statements, receipt slips, and geo-tagged field photographs are linked directly to the claim ID.
              </p>
              <div className="tech-badge-row">
                <span className="tech-tag">Gram Sabha Resolutions</span>
                <span className="tech-tag">Geo-Tagged Field Photos</span>
                <span className="tech-tag">Elder Testimonies</span>
              </div>
            </Card>

            <Card
              title="4. Human-in-the-Loop Committee Decision Matrix"
              subtitle="Objective Evidence Synthesis"
              variant="accent-green"
            >
              <p className="mb-2">
                Rather than generating opaque automated approvals, BhoomiDrishti outputs a structured, transparent summary report highlighting evidence consistency, boundary status, and areas needing committee scrutiny.
              </p>
              <div className="tech-badge-row">
                <span className="tech-tag">Confidence Metrics</span>
                <span className="tech-tag">SDLC/DLC Summary</span>
                <span className="tech-tag">Audit Trail Log</span>
              </div>
            </Card>
          </div>

          <Alert type="notice" title="Statutory Primacy" className="mb-6">
            BhoomiDrishti is a Decision Support System (DSS). Final statutory authority to grant or reject land titles rests solely with the competent authorities under the FRA 2006 Act.
          </Alert>

          <div className="page-cta-box">
            <h3>Ready to Explore Claims?</h3>
            <p>Access the claims register or submit a new claim profile.</p>
            <div className="cta-btn-row">
              <Button variant="primary" onClick={() => navigate('/claim')}>
                Submit Land Claim
              </Button>
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                View Claims Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
