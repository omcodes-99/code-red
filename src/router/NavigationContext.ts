import { createContext, useContext } from 'react';

export interface NavigationContextType {
  currentPath: string;
  navigate: (path: string, options?: { replace?: boolean; state?: unknown }) => void;
  isActive: (path: string) => boolean;
}

export const NavigationContext = createContext<NavigationContextType>({
  currentPath: '/',
  navigate: () => {},
  isActive: () => false,
});

export const useNavigation = () => useContext(NavigationContext);
