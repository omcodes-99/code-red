import React, { useState } from 'react';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import emblemOfIndia from '../../assets/emblem-of-india.svg';

interface GovernmentBarProps {
  currentLang?: 'EN' | 'HI';
  onLangChange?: (lang: 'EN' | 'HI') => void;
}

export const GovernmentBar: React.FC<GovernmentBarProps> = ({
  onLangChange,
}) => {
  const { t } = useTranslation();
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);

  const handleLangSelect = (lang: 'EN' | 'HI') => {
    const language = lang === 'HI' ? 'hi' : 'en';
    void i18n.changeLanguage(language);
    localStorage.setItem('bhoomidrishti-language', language);
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
    <div className="gov-utility-bar" role="region" aria-label={t('government.officialHeader')}>
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a href="#main-content" className="gov-skip-link">
        {t('government.skipToMain')}
      </a>

      <div className="gov-container utility-content">
        {/* Government Identity */}
        <div className="gov-identity-strip">
          <img className="emblem-placeholder" src={emblemOfIndia} alt="State Emblem of India" />
          <div className="gov-titles">
            <span className="gov-title-hindi">{t('government.title')}</span>
            <span className="gov-ministry">{t('government.ministry')}</span>
          </div>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="gov-utility-controls">
          {/* Digital India Flagship Tag */}
          <div className="gov-digital-india-tag" title="Digital India Initiative">
            <span className="di-dot" aria-hidden="true" />
            <span>{t('government.digitalIndia')}</span>
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
          <div className="lang-switcher" role="radiogroup" aria-label={t('government.languageSelector')}>
            <button
              type="button"
              className={`lang-btn ${i18n.language === 'hi' ? 'active' : ''}`}
              onClick={() => handleLangSelect('HI')}
              role="radio"
              aria-checked={i18n.language === 'hi'}
              aria-label="हिन्दी में देखें"
            >
              हिन्दी
            </button>
            <span className="lang-sep" aria-hidden="true">|</span>
            <button
              type="button"
              className={`lang-btn ${i18n.language !== 'hi' ? 'active' : ''}`}
              onClick={() => handleLangSelect('EN')}
              role="radio"
              aria-checked={i18n.language !== 'hi'}
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
