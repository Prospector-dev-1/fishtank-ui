import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  isNavVisible: boolean;
  hideNavigation: () => void;
  showNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavVisible, setIsNavVisible] = useState(true);

  const hideNavigation = () => setIsNavVisible(false);
  const showNavigation = () => setIsNavVisible(true);

  return (
    <NavigationContext.Provider value={{ isNavVisible, hideNavigation, showNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}