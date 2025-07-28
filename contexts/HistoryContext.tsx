import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { generateSampleHistoryData, convertHistoricalDataToHistoryItems } from '@/utils/fitnessCalculator';
import HealthService from '@/services/healthService';

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
  isLoading: boolean;
  refreshHistoricalData: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const HISTORY_STORAGE_KEY = 'vitality_score_history';

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from storage on mount
  useEffect(() => {
    loadHistoryFromStorage();
  }, []);

  const loadHistoryFromStorage = async () => {
    try {
      setIsLoading(true);
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      
      if (storedHistory) {
        const parsedHistory: HistoryItem[] = JSON.parse(storedHistory);
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsedHistory.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        
        // Filter to show only items from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentHistory = historyWithDates.filter(
          item => item.timestamp >= thirtyDaysAgo
        );
        
        setHistoryItems(recentHistory);
      } else {
        // Try to fetch real historical data from HealthKit first
        await refreshHistoricalData();
      }
    } catch (error) {
      console.error('Error loading history from storage:', error);
      // Fallback to sample data on error
      try {
        await refreshHistoricalData();
      } catch (fallbackError) {
        console.error('Error generating fallback data:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveHistoryToStorage = async (history: HistoryItem[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history to storage:', error);
    }
  };

  const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    
    setHistoryItems(prev => {
      const updatedHistory = [newItem, ...prev];
      // Save to storage
      saveHistoryToStorage(updatedHistory);
      return updatedHistory;
    });
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
      setHistoryItems([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const refreshHistoricalData = async () => {
    try {
      console.log('Starting to refresh historical data...');
      
      if (Platform.OS === 'ios') {
        console.log('iOS platform detected, fetching HealthKit data...');
        // Try to fetch real historical data from HealthKit
        const historicalData = await HealthService.getHistoricalHealthData(30);
        console.log(`Fetched ${historicalData.length} days of historical data from HealthKit`);
        
        if (historicalData.length > 0) {
          const realHistoryData = convertHistoricalDataToHistoryItems(historicalData);
          console.log(`Converted to ${realHistoryData.length} history items`);
          
          const realHistory: HistoryItem[] = realHistoryData.map(item => ({
            ...item,
            id: `${item.timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
          }));
          
          await saveHistoryToStorage(realHistory);
          setHistoryItems(realHistory);
          console.log('Successfully saved real historical data');
          return;
        } else {
          console.log('No historical data available from HealthKit, using sample data');
        }
      }
    } catch (error) {
      console.error('Error fetching real historical data:', error);
    }

    // Fallback to sample data if real data isn't available
    console.log('Falling back to sample data');
    const sampleData = generateSampleHistoryData();
    const sampleHistory: HistoryItem[] = sampleData.map(item => ({
      ...item,
      id: `${item.timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
    }));
    
    await saveHistoryToStorage(sampleHistory);
    setHistoryItems(sampleHistory);
    console.log(`Generated ${sampleHistory.length} sample history items`);
  };

  return (
    <HistoryContext.Provider value={{
      historyItems,
      addHistoryItem,
      clearHistory,
      isLoading,
      refreshHistoricalData,
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