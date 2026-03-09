import { createContext, useContext, ReactNode } from 'react';
import { useGlobalSettings as useGlobalSettingsHook } from '@/hooks/useGlobalSettings';

type GlobalSettingsContextType = ReturnType<typeof useGlobalSettingsHook>;

const GlobalSettingsContext = createContext<GlobalSettingsContextType | null>(null);

export const GlobalSettingsProvider = ({ children }: { children: ReactNode }) => {
  const value = useGlobalSettingsHook();
  return (
    <GlobalSettingsContext.Provider value={value}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};

export const useGlobalSettingsContext = (): GlobalSettingsContextType => {
  const ctx = useContext(GlobalSettingsContext);
  if (!ctx) {
    throw new Error('useGlobalSettingsContext must be used within GlobalSettingsProvider');
  }
  return ctx;
};
