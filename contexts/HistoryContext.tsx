import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface HistoryItem {
  id: string;
  category: 'Cardiovascular Health' | 'Recovery & Regeneration' | 'Activity & Training' | 'Bonus Metric';
  metric: string;
  points: number;
  maxPoints: number;
  reason: string;
  timestamp: Date;
}

interface HistoryContextType {
  historyItems: HistoryItem[];
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setHistoryItems(prev => [newItem, ...prev]);
  };

  const clearHistory = () => {
    setHistoryItems([]);
  };

  return (
    <HistoryContext.Provider value={{
      historyItems,
      addHistoryItem,
      clearHistory,
    }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}