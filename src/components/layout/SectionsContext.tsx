'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// TypeScript interfaces
export interface Section {
  id: string;
  name: string;
}

interface SectionsContextType {
  sections: Section[];
  setSections: (sections: Section[]) => void;
  clearSections: () => void;
  isLoading: boolean;
}

// Create the context with undefined as default (will be checked in hook)
const SectionsContext = createContext<SectionsContextType | undefined>(undefined);

// Custom hook for consuming the context
export const useSections = (): SectionsContextType => {
  const context = useContext(SectionsContext);
  
  if (context === undefined) {
    throw new Error('useSections must be used within a SectionsProvider');
  }
  
  return context;
};

// Provider component props
interface SectionsProviderProps {
  children: ReactNode;
}

// Provider component
export const SectionsProvider: React.FC<SectionsProviderProps> = ({ children }) => {
  const [sections, setSectionsState] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Memoized setter function to prevent unnecessary re-renders
  const setSections = useCallback((newSections: Section[]) => {
    setIsLoading(true);
    
    // Small delay to allow for smooth transitions (will be useful for animations later)
    setTimeout(() => {
      setSectionsState(newSections);
      setIsLoading(false);
    }, 0);
  }, []);

  // Clear sections function
  const clearSections = useCallback(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      setSectionsState([]);
      setIsLoading(false);
    }, 0);
  }, []);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    sections,
    setSections,
    clearSections,
    isLoading,
  }), [sections, setSections, clearSections, isLoading]);

  return (
    <SectionsContext.Provider value={contextValue}>
      {children}
    </SectionsContext.Provider>
  );
};

export default SectionsProvider; 