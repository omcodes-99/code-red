import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  fluid?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  fluid = false,
  className = '',
  ...rest
}) => {
  const containerClass = fluid ? 'gov-container-fluid' : 'gov-container';
  return (
    <div className={`${containerClass} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
};
