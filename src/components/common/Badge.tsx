import React from 'react';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'saffron' | 'navy';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className = '',
  ...rest
}) => {
  const variantClass = `gov-badge-${variant}`;
  const sizeClass = `gov-badge-${size}`;
  const combinedClass = `gov-badge ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <span className={combinedClass} {...rest}>
      {dot && <span className="gov-badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
};
