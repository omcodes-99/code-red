import React, { useState, useEffect, useCallback } from 'react';
import type { AppRoute } from '../types';
import { NavigationContext, useNavigation } from './NavigationContext';

interface RouterProviderProps {
  children: React.ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const getCleanPath = () => {
    if (typeof window === 'undefined') return '/';
    const path = window.location.pathname || '/';
    return path;
  };

  const [currentPath, setCurrentPath] = useState<string>(getCleanPath());

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getCleanPath());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string, options?: { replace?: boolean; state?: unknown }) => {
    if (typeof window === 'undefined') return;

    if (path.startsWith('#')) {
      const target = document.getElementById(path.substring(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (options?.replace) {
      window.history.replaceState(options.state || {}, '', path);
    } else {
      window.history.pushState(options?.state || {}, '', path);
    }

    setCurrentPath(path.split('#')[0] || '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const isActive = useCallback((path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  }, [currentPath]);

  return (
    <NavigationContext.Provider value={{ currentPath, navigate, isActive }}>
      {children}
    </NavigationContext.Provider>
  );
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: AppRoute | string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

export const Link: React.FC<LinkProps> = ({
  to,
  children,
  className = '',
  activeClassName = 'active',
  onClick,
  ...rest
}) => {
  const { currentPath, navigate } = useNavigation();
  const isCurrentActive = to === '/' ? currentPath === '/' : currentPath.startsWith(to);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      rest.target === '_blank' ||
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      e.shiftKey
    ) {
      return;
    }

    e.preventDefault();
    navigate(to);
  };

  const combinedClassName = `${className} ${isCurrentActive ? activeClassName : ''}`.trim();

  return (
    <a href={to} className={combinedClassName} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
