import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Host, MonthlyTarget, SaleRecord } from '../types';

interface AppState {
  hosts: Host[];
  sales: SaleRecord[];
  monthlyTargets: MonthlyTarget[];
  app_password: string;
}

const initialState: AppState = {
    hosts: [],
    sales: [],
    monthlyTargets: [],
    app_password: '',
};

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>(initialState);

    const value = { state, setState };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
