import React from 'react';
import { useNavigation } from '../router';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="page-not-found">
      <div className="gov-container not-found-content">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Page Not Found / पृष्ठ नहीं मिला</h1>
        <p className="not-found-desc">
          The page or document you are looking for might have been removed, had its name changed, or is temporarily unavailable under the BhoomiDrishti portal.
        </p>
        <div className="not-found-actions">
          <Button variant="primary" onClick={() => navigate('/')}>
            Return to Home Page
          </Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Open Claims Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
