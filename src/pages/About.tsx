import React from 'react';
import { useNavigation } from '../router';
import { SectionHeader } from '../components/common/SectionHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

export const About: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="page-about">
      {/* Page Banner Header */}
      <div className="gov-page-banner">
        <div className="gov-container">
          <div className="banner-breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">About BhoomiDrishti</span>
          </div>
          <h1 className="banner-page-title">About BhoomiDrishti</h1>
          <p className="banner-page-subtitle">
            An Evidence-Based Decision Support Platform for Transparent Land Claim Verification
          </p>
        </div>
      </div>

      <div className="gov-container page-content-container">
        {/* Important Mandate Alert */}
        <Alert
          type="info"
          title="Statutory Alignment with FRA 2006"
          className="mb-6"
        >
          BhoomiDrishti is designed strictly as a technical and evidentiary decision-support mechanism to assist Forest Rights Committees (FRC), Sub-Divisional Level Committees (SDLC), and District Level Committees (DLC) in implementing the Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006.
        </Alert>

        {/* Core Vision & Objectives Grid */}
        <div className="about-grid mb-8">
          <Card
            title="The Problem"
            subtitle="Challenges in Land Claim Verification"
            variant="bordered"
          >
            <p className="mb-3">
              Traditional forest land claim adjudication often suffers from incomplete historical records, overlapping cadastral maps, subjective boundary disputes, and protracted procedural delays.
            </p>
            <ul className="gov-bullet-list">
              <li>Difficulty verifying customary land possession pre-dating 13 December 2005.</li>
              <li>Discrepancies between village revenue boundaries and forest compartment records.</li>
              <li>High pendency of claims due to lack of objective spatial evidence.</li>
            </ul>
          </Card>

          <Card
            title="The Solution"
            subtitle="Evidence-Driven Geospatial Synthesis"
            variant="accent-navy"
          >
            <p className="mb-3">
              BhoomiDrishti bridges ground testimonies with Earth Observation (EO) satellite time-series data to create transparent, verifiable evidence portfolios for every claim.
            </p>
            <ul className="gov-bullet-list">
              <li>Automated vegetation and agricultural index (NDVI/LULC) history.</li>
              <li>Multi-layer boundary cross-matching with Cadastral & Reserve Forest maps.</li>
              <li>Standardized evidentiary confidence scoring for human committee review.</li>
            </ul>
          </Card>
        </div>

        {/* Institutional Stakeholders */}
        <SectionHeader
          tag="Institutional Hierarchy"
          title="Who Uses BhoomiDrishti?"
          subtitle="Designed to serve all tiers of statutory governance under the Forest Rights Act."
        />

        <div className="stakeholders-grid mb-8">
          <div className="stakeholder-card">
            <div className="stakeholder-icon">👥</div>
            <h3 className="stakeholder-title">Gram Sabha & FRC</h3>
            <p className="stakeholder-desc">
              Ground verification, community claim resolutions, and uploading customary land evidence.
            </p>
          </div>

          <div className="stakeholder-card">
            <div className="stakeholder-icon">⚖️</div>
            <h3 className="stakeholder-title">SDLC Officers</h3>
            <p className="stakeholder-desc">
              Sub-Divisional Level scrutiny of spatial overlays, resolution of boundary conflicts, and preparing recommendations.
            </p>
          </div>

          <div className="stakeholder-card">
            <div className="stakeholder-icon">🏛️</div>
            <h3 className="stakeholder-title">DLC & District Collector</h3>
            <p className="stakeholder-desc">
              Final evidentiary review, statutory title sanctioning, and district-wide claim tracking.
            </p>
          </div>

          <div className="stakeholder-card">
            <div className="stakeholder-icon">🛰️</div>
            <h3 className="stakeholder-title">GIS & Survey Teams</h3>
            <p className="stakeholder-desc">
              Cadastral digitization, satellite image processing, and boundary polygon validation.
            </p>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="page-cta-box">
          <h3>Explore the System</h3>
          <p>Examine the operational workflow or view the interactive demonstration dashboard.</p>
          <div className="cta-btn-row">
            <Button variant="primary" onClick={() => navigate('/how-it-works')}>
              View Workflow
            </Button>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
