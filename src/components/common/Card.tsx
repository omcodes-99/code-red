import React from 'react';

export type CardVariant = 'default' | 'subtle' | 'bordered' | 'accent-navy' | 'accent-saffron' | 'accent-green';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: CardVariant;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  title,
  subtitle,
  badge,
  headerAction,
  footer,
  hoverable = false,
  children,
  className = '',
  ...rest
}) => {
  const variantClass = `gov-card-${variant}`;
  const hoverClass = hoverable ? 'gov-card-hoverable' : '';
  const combinedClass = `gov-card ${variantClass} ${hoverClass} ${className}`.trim();

  const hasHeader = title || subtitle || badge || headerAction;

  return (
    <div className={combinedClass} {...rest}>
      {hasHeader && (
        <div className="gov-card-header">
          <div className="gov-card-header-titles">
            {title && (
              <div className="gov-card-title-row">
                <h3 className="gov-card-title">{title}</h3>
                {badge && <div className="gov-card-badge">{badge}</div>}
              </div>
            )}
            {subtitle && <p className="gov-card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div className="gov-card-header-action">{headerAction}</div>}
        </div>
      )}
      <div className="gov-card-body">{children}</div>
      {footer && <div className="gov-card-footer">{footer}</div>}
    </div>
  );
};
