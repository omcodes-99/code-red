import React from 'react';
import { useNavigation } from '../router';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { Badge } from '../components/common/Badge';

export const EvidenceSummaryPlaceholder: React.FC = () => {
  const { currentPath, navigate } = useNavigation();
  const search = currentPath.includes('?') ? currentPath.split('?')[1] : window.location.search;
  const params = new URLSearchParams(search);
  const claimId = params.get('claimId') || 'FRA-2025-001';

  return (
    <div className="page-analysis">
      <div className="gov-page-banner">
        <div className="gov-container">
          <div className="banner-breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-sep">/</span>
            <span onClick={() => navigate('/claim')} className="breadcrumb-link">Claim Registration</span>
            <span className="breadcrumb-sep">/</span>
            <span onClick={() => navigate(`/analysis?claimId=${claimId}`)} className="breadcrumb-link">
              Geospatial Evidence Analysis
            </span>
            <span className="breadcrumb-sep">/</span>
            <span onClick={() => navigate(`/analysis/historical?claimId=${claimId}`)} className="breadcrumb-link">
              Historical Satellite Evidence
            </span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Evidence Summary</span>
          </div>
          <h1 className="banner-page-title">Evidence Summary Dossier</h1>
          <p className="banner-page-subtitle">
            Comprehensive synthesis of spatial overlap analysis, multi-temporal satellite evidence, and statutory documentation
          </p>
        </div>
      </div>

      <div className="gov-container page-content-container">
        <Card
          title={`Evidence Summary: ${claimId}`}
          subtitle="Statutory evidence compilation under FRA 2006"
          variant="accent-navy"
          badge={<Badge variant="info">Upcoming Phase</Badge>}
          className="mb-6"
        >
          <Alert type="notice" title="Module Scheduled for Future Phase">
            The comprehensive Evidence Summary & Dossier compilation module is scheduled for development in the upcoming phase. Phase 3B (Historical Satellite Evidence) has been successfully recorded for Claim ID <strong>{claimId}</strong>.
          </Alert>

          <div className="mt-6 flex gap-3">
            <Button
              variant="primary"
              onClick={() => navigate(`/analysis/historical?claimId=${claimId}`)}
            >
              ← Return to Historical Satellite Evidence
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/analysis?claimId=${claimId}`)}
            >
              Return to Geospatial Analysis
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Claims Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
