import React from 'react';

export interface SectionHeaderProps {
  tag?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  centered?: boolean;
  className?: string;
  id?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  tag,
  title,
  subtitle,
  action,
  centered = false,
  className = '',
  id,
}) => {
  return (
    <div className={`gov-section-header ${centered ? 'text-center' : ''} ${className}`.trim()}>
      <div className="gov-section-header-content">
        {tag && <span className="gov-section-tag">{tag}</span>}
        <h2 id={id} className="gov-section-title">
          {title}
        </h2>
        {subtitle && <p className="gov-section-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="gov-section-header-action">{action}</div>}
    </div>
  );
};
