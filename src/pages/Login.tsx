import React, { useState } from 'react';
import { useNavigation } from '../router';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';
import { Alert } from '../components/common/Alert';
import { Badge } from '../components/common/Badge';

export const Login: React.FC = () => {
  const { navigate } = useNavigation();
  const [role, setRole] = useState('SDLC');
  const [authMethod, setAuthMethod] = useState<'OTP' | 'PASSWORD'>('OTP');
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent && authMethod === 'OTP') {
      setOtpSent(true);
    } else {
      // Simulate login and redirect to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div className="page-login">
      {/* Banner */}
      <div className="gov-page-banner">
        <div className="gov-container">
          <div className="banner-breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Official Login</span>
          </div>
          <h1 className="banner-page-title">Government Portal Authentication</h1>
          <p className="banner-page-subtitle">
            Secure single-sign-on access for Statutory Committee Members, Forest Officers, and Authorized Claimants
          </p>
        </div>
      </div>

      <div className="gov-container page-content-container">
        <div className="login-card-wrapper">
          <Card
            title="Portal Sign-In"
            subtitle="Government of India e-Governance Single Sign-On"
            variant="accent-navy"
            badge={<Badge variant="saffron">NIC SSO Demo</Badge>}
            className="login-card"
          >
            {/* Role Selector */}
            <div className="mb-4">
              <Select
                label="Sign In As / Designated Authority"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={[
                  { value: 'SDLC', label: 'Sub-Divisional Level Committee (SDLC) Officer' },
                  { value: 'DLC', label: 'District Level Committee (DLC) / District Magistrate' },
                  { value: 'FOREST', label: 'Divisional Forest Officer (DFO) / Range Officer' },
                  { value: 'GRAM_SABHA', label: 'Gram Sabha / Forest Rights Committee (FRC) Secretary' },
                  { value: 'CLAIMANT', label: 'Individual / Community Claimant' },
                ]}
              />
            </div>

            {/* Auth Mode Toggle */}
            <div className="auth-mode-selector mb-4" role="tablist">
              <button
                type="button"
                className={`auth-tab-btn ${authMethod === 'OTP' ? 'active' : ''}`}
                onClick={() => { setAuthMethod('OTP'); setOtpSent(false); }}
              >
                Aadhaar / Mobile OTP
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authMethod === 'PASSWORD' ? 'active' : ''}`}
                onClick={() => setAuthMethod('PASSWORD')}
              >
                Officer ID & Password
              </button>
            </div>

            <form onSubmit={handleLogin}>
              {authMethod === 'OTP' ? (
                <>
                  <Input
                    label="Registered Mobile Number / Aadhaar Number"
                    placeholder="e.g. 9876543210"
                    value={mobileOrEmail}
                    onChange={(e) => setMobileOrEmail(e.target.value)}
                    required
                    helperText="OTP will be dispatched to your UIDAI registered mobile number."
                  />

                  {otpSent && (
                    <div className="mt-3">
                      <Input
                        label="Enter 6-Digit OTP"
                        placeholder="• • • • • •"
                        type="password"
                        maxLength={6}
                        required
                        helperText="Demo mode: Enter any 6-digit number."
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Input
                    label="NIC Government Email ID / User ID"
                    placeholder="officer.name@nic.in"
                    type="email"
                    required
                  />
                  <Input
                    label="Account Password"
                    placeholder="••••••••••••"
                    type="password"
                    required
                  />
                </>
              )}

              <div className="mt-6">
                <Button type="submit" variant="primary" fullWidth size="lg">
                  {authMethod === 'OTP' && !otpSent ? 'Send Verification OTP' : 'Authenticate & Access Portal'}
                </Button>
              </div>
            </form>

            <div className="login-security-strip mt-6">
              <span className="security-icon">🔒</span>
              <span>256-Bit SSL Encrypted • Access restricted to authorized personnel</span>
            </div>
          </Card>

          <div className="login-help-aside">
            <Alert type="info" title="Official Login Notice">
              This is a prototype authentication gateway. Selecting any role and clicking <strong>Authenticate</strong> will direct you straight to the active <strong>Claims Dashboard</strong>.
            </Alert>

            <div className="help-box-small">
              <h4>Need Technical Assistance?</h4>
              <p>For credentials provisioning or Gram Sabha FRC user onboarding:</p>
              <p className="font-mono">Toll-free: 1800-11-BHU • support.bhoomidrishti@nic.in.demo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
