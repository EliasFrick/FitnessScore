import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import {
  generateSampleHistoryData,
  convertHistoricalDataToHistoryItems,
} from "@/utils/fitnessCalculator";
import HealthService from "@/services/healthService";

export interface HistoryItem {
  id: string;
  category:
    | "Cardiovascular Health"
    | "Recovery & Regeneration"
    | "Activity & Training"
    | "Bonus Metric";
  metric: string;
  points: number;
  maxPoints: number;
  reason: string;
  timestamp: Date;
}

interface HistoryContextType {
  historyItems: HistoryItem[];
  addHistoryItem: (item: Omit<HistoryItem, "id" | "timestamp">) => void;
  clearHistory: () => void;
  isLoading: boolean;
  refreshHistoricalData: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const HISTORY_STORAGE_KEY = "vitality_score_history";

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
        const historyWithDates = parsedHistory.map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));

        // Filter to show only items from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentHistory = historyWithDates.filter(
          (item) => item.timestamp >= thirtyDaysAgo,
        );

        setHistoryItems(recentHistory);
      } else {
        // Try to fetch real historical data from HealthKit first
        await refreshHistoricalData();
      }
    } catch (error) {
      // Fallback to sample data on error
      try {
        await refreshHistoricalData();
      } catch (fallbackError) {
        // Silently handle fallback error
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveHistoryToStorage = async (history: HistoryItem[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      // Silently handle storage error
    }
  };

  const addHistoryItem = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    setHistoryItems((prev) => {
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
      // Silently handle clear error
    }
  };

  const refreshHistoricalData = async () => {
    try {
      if (Platform.OS === "ios") {
        // Try to fetch real historical data from HealthKit
        const historicalData = await HealthService.getHistoricalHealthData(30);

        if (historicalData.length > 0) {
          const realHistoryData =
            convertHistoricalDataToHistoryItems(historicalData);

          const realHistory: HistoryItem[] = realHistoryData.map((item) => ({
            ...item,
            id: `${item.timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
          }));

          await saveHistoryToStorage(realHistory);
          setHistoryItems(realHistory);
          return;
        } else {
        }
      }
    } catch (error) {
      // Silently handle historical data fetch error
    }

    // Fallback to sample data if real data isn't available
    const sampleData = generateSampleHistoryData();
    const sampleHistory: HistoryItem[] = sampleData.map((item) => ({
      ...item,
      id: `${item.timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
    }));

    await saveHistoryToStorage(sampleHistory);
    setHistoryItems(sampleHistory);
  };

  return (
    <HistoryContext.Provider
      value={{
        historyItems,
        addHistoryItem,
        clearHistory,
        isLoading,
        refreshHistoricalData,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
}
