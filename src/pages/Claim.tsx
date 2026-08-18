import React, { useState } from 'react';
import { useNavigation } from '../router';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';
import { Alert } from '../components/common/Alert';
import { Badge } from '../components/common/Badge';

export const Claim: React.FC = () => {
  const { navigate } = useNavigation();
  const [claimType, setClaimType] = useState('IFR');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page-claim">
      {/* Banner */}
      <div className="gov-page-banner">
        <div className="gov-container">
          <div className="banner-breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Submit Land Claim</span>
          </div>
          <h1 className="banner-page-title">Submit Forest Rights Claim</h1>
          <p className="banner-page-subtitle">
            Registration module for Individual Forest Rights (IFR), Community Forest Rights (CFR), or Habitat Claims
          </p>
        </div>
      </div>

      <div className="gov-container page-content-container">
        {/* Developer Integration Note */}
        <div className="dev-handover-notice">
          <Badge variant="navy">Developer Notice</Badge>
          <p>
            <strong>Frontend Developer 2 Module:</strong> This form demonstrates the standard design system components (<code>Input</code>, <code>Select</code>, <code>Card</code>, <code>Button</code>, <code>Alert</code>). Person 2 can extend this component with state management, multi-step wizards, and backend submission endpoints.
          </p>
        </div>

        {submitted ? (
          <div className="submission-success-box">
            <Alert type="success" title="Claim Profile Draft Registered (Demo)">
              Your demonstration claim reference is <strong>FRA-2025-007</strong>. You can now attach supporting geospatial coordinates, elder witness affidavits, or cadastral maps.
            </Alert>
            <div className="mt-4 flex gap-3">
              <Button variant="primary" onClick={() => setSubmitted(false)}>
                Submit Another Claim
              </Button>
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                View in Claims Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="claim-form-layout">
            <Card
              title="1. Claimant & Community Information"
              subtitle="Statutory identity under FRA 2006"
              variant="bordered"
              className="mb-6"
            >
              <div className="form-grid-2">
                <Input
                  label="Full Name of Claimant / Gram Sabha"
                  placeholder="e.g. Rameshwar Majhi / Gram Sabha Podaguda"
                  required
                />
                <Select
                  label="Claim Category"
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value)}
                  options={[
                    { value: 'IFR', label: 'Individual Forest Rights (IFR - Form A)' },
                    { value: 'CFR', label: 'Community Forest Rights (CFR - Form B)' },
                    { value: 'CR', label: 'Community Rights (Form C)' },
                    { value: 'HABITAT', label: 'Habitat Rights (PVTG)' },
                  ]}
                  required
                />
                <Input
                  label="Tribe or Traditional Community"
                  placeholder="e.g. Santhal (Scheduled Tribe) / OTFD"
                  required
                />
                <Input
                  label="Aadhaar / Ration Card / Official ID"
                  placeholder="xxxx-xxxx-xxxx"
                />
              </div>
            </Card>

            <Card
              title="2. Land & Location Particulars"
              subtitle="Geographical location and estimated area"
              variant="bordered"
              className="mb-6"
            >
              <div className="form-grid-3">
                <Select
                  label="State"
                  options={[{ value: 'OD', label: 'Odisha' }, { value: 'JH', label: 'Jharkhand' }, { value: 'CG', label: 'Chhattisgarh' }]}
                />
                <Select
                  label="District"
                  options={[{ value: 'SBP', label: 'Sambalpur' }, { value: 'MBJ', label: 'Mayurbhanj' }, { value: 'SNG', label: 'Sundargarh' }]}
                />
                <Input label="Block / Tahsil" placeholder="e.g. Jujomura" required />
                <Input label="Gram Panchayat" placeholder="e.g. Bhatra" required />
                <Input label="Village Name" placeholder="e.g. Majhipada" required />
                <Input label="Claimed Area (in Hectares)" placeholder="e.g. 2.45" type="number" step="0.01" required />
              </div>

              <div className="form-grid-2 mt-4">
                <Input
                  label="GPS Coordinates (Latitude)"
                  placeholder="e.g. 21.4678"
                  helperText="Decimal degrees (WGS 84)"
                />
                <Input
                  label="GPS Coordinates (Longitude)"
                  placeholder="e.g. 83.9784"
                  helperText="Decimal degrees (WGS 84)"
                />
              </div>
            </Card>

            <Card
              title="3. Supporting Evidence & Documents"
              subtitle="Upload digitized files or link spatial surveys"
              variant="bordered"
              id="upload"
              className="mb-6"
            >
              <div className="upload-dropzone">
                <div className="upload-icon-box">📁</div>
                <h4>Upload Supporting Evidence Files</h4>
                <p className="upload-text">
                  Drag and drop Gram Sabha resolutions, elder statements, caste certificates, or KML/GeoJSON survey boundary files.
                </p>
                <div className="upload-badge-types">
                  <span>PDF</span>
                  <span>JPG/PNG</span>
                  <span>GeoJSON</span>
                  <span>KML</span>
                </div>
                <Button variant="secondary" size="sm" className="mt-3">
                  Browse Files (Demo)
                </Button>
              </div>
            </Card>

            <div className="form-submit-actions">
              <Button type="submit" variant="primary" size="lg">
                Submit Claim for Verification
              </Button>
              <Button variant="ghost" size="lg" onClick={() => navigate('/dashboard')}>
                Cancel & Return
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
