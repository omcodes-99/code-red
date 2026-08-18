import React, { useState } from 'react';

interface GovernmentBarProps {
  currentLang?: 'EN' | 'HI';
  onLangChange?: (lang: 'EN' | 'HI') => void;
}

export const GovernmentBar: React.FC<GovernmentBarProps> = ({
  currentLang = 'EN',
  onLangChange,
}) => {
  const [selectedLang, setSelectedLang] = useState<'EN' | 'HI'>(currentLang);
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);

  const handleLangSelect = (lang: 'EN' | 'HI') => {
    setSelectedLang(lang);
    if (onLangChange) {
      onLangChange(lang);
    }
  };

  const handleFontSize = (delta: number) => {
    const newOffset = Math.max(-2, Math.min(2, fontSizeOffset + delta));
    setFontSizeOffset(newOffset);
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = `${16 + newOffset * 1.5}px`;
    }
  };

  const resetFontSize = () => {
    setFontSizeOffset(0);
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = '16px';
    }
  };

  return (
    <div className="gov-utility-bar" role="region" aria-label="Official Government Header Bar">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a href="#main-content" className="gov-skip-link">
        Skip to Main Content
      </a>

      <div className="gov-container utility-content">
        {/* Government Identity */}
        <div className="gov-identity-strip">
          <div className="emblem-placeholder" aria-hidden="true">
            🏛️
          </div>
          <div className="gov-titles">
            <span className="gov-title-hindi">भारत सरकार | Government of India</span>
            <span className="gov-ministry">जनजातीय कार्य मंत्रालय | Ministry of Tribal Affairs</span>
          </div>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="gov-utility-controls">
          {/* Digital India Flagship Tag */}
          <div className="gov-digital-india-tag" title="Digital India Initiative">
            <span className="di-dot" aria-hidden="true" />
            <span>Digital India</span>
          </div>

          <div className="utility-divider" aria-hidden="true" />

          {/* Accessibility Font Resizer */}
          <div className="accessibility-controls" aria-label="Font size adjustment controls">
            <button
              type="button"
              className="a11y-btn"
              onClick={() => handleFontSize(-1)}
              title="Decrease text size"
              aria-label="Decrease text size"
            >
              A-
            </button>
            <button
              type="button"
              className="a11y-btn"
              onClick={resetFontSize}
              title="Standard text size"
              aria-label="Reset text size to standard"
            >
              A
            </button>
            <button
              type="button"
              className="a11y-btn"
              onClick={() => handleFontSize(1)}
              title="Increase text size"
              aria-label="Increase text size"
            >
              A+
            </button>
          </div>

          <div className="utility-divider" aria-hidden="true" />

          {/* Language Switcher */}
          <div className="lang-switcher" role="radiogroup" aria-label="Select portal language">
            <button
              type="button"
              className={`lang-btn ${selectedLang === 'HI' ? 'active' : ''}`}
              onClick={() => handleLangSelect('HI')}
              role="radio"
              aria-checked={selectedLang === 'HI'}
              aria-label="हिन्दी में देखें"
            >
              हिन्दी
            </button>
            <span className="lang-sep" aria-hidden="true">|</span>
            <button
              type="button"
              className={`lang-btn ${selectedLang === 'EN' ? 'active' : ''}`}
              onClick={() => handleLangSelect('EN')}
              role="radio"
              aria-checked={selectedLang === 'EN'}
              aria-label="View in English"
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
