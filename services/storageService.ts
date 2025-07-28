import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthMetrics } from '@/types/health';

interface StoredHealthData {
  id: string;
  data: HealthMetrics;
  timestamp: number;
  aggregatedWeekly?: {
    avgRestingHeartRate: number;
    avgHeartRateVariability: number;
    avgVO2Max: number;
    avgDeepSleepPercentage: number;
    avgRemSleepPercentage: number;
    avgSleepConsistency: number;
    totalTrainingTime: number;
    avgTrainingIntensity: number;
    avgDailySteps: number;
  };
  aggregatedMonthly?: {
    avgRestingHeartRate: number;
    avgHeartRateVariability: number;
    avgVO2Max: number;
    avgDeepSleepPercentage: number;
    avgRemSleepPercentage: number;
    avgSleepConsistency: number;
    totalTrainingTime: number;
    avgTrainingIntensity: number;
    avgDailySteps: number;
    trends: {
      heartHealthTrend: 'improving' | 'stable' | 'declining';
      sleepTrend: 'improving' | 'stable' | 'declining';
      activityTrend: 'improving' | 'stable' | 'declining';
    };
  };
}

interface AIResponse {
  id: string;
  userMessage: string;
  aiResponse: string;
  timestamp: number;
  context: string; // Health metrics summary at time of request
}

export class StorageService {
  private static instance: StorageService;
  private db: SQLite.SQLiteDatabase | null = null;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('vitality_data.db');
      
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS health_data (
          id TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          aggregated_weekly TEXT,
          aggregated_monthly TEXT
        );
      `);

      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS ai_responses (
          id TEXT PRIMARY KEY,
          user_message TEXT NOT NULL,
          ai_response TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          context TEXT NOT NULL
        );
      `);

      await this.db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_health_timestamp ON health_data(timestamp);
      `);

      await this.db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_ai_timestamp ON ai_responses(timestamp);
      `);

    } catch (error) {
      throw error;
    }
  }

  async storeHealthData(data: HealthMetrics): Promise<void> {
    if (!this.db) {
      await this.initialize();
    }

    const id = `health_${Date.now()}`;
    const timestamp = Date.now();

    try {
      // Store the raw health data
      await this.db!.runAsync(
        'INSERT INTO health_data (id, data, timestamp) VALUES (?, ?, ?)',
        [id, JSON.stringify(data), timestamp]
      );

      // Calculate and store aggregated data
      await this.updateAggregatedData();

      // Keep only last 30 days of raw data for privacy
      const thirtyDaysAgo = timestamp - (30 * 24 * 60 * 60 * 1000);
      await this.db!.runAsync(
        'DELETE FROM health_data WHERE timestamp < ? AND aggregated_weekly IS NULL',
        [thirtyDaysAgo]
      );

    } catch (error) {
      throw error;
    }
  }

  private async updateAggregatedData(): Promise<void> {
    if (!this.db) return;

    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

    try {
      // Get last 7 days of data for weekly aggregation
      const weeklyData = await this.db.getAllAsync(
        'SELECT data FROM health_data WHERE timestamp >= ? ORDER BY timestamp DESC',
        [oneWeekAgo]
      ) as { data: string }[];

      if (weeklyData.length > 0) {
        const parsedData = weeklyData.map(row => JSON.parse(row.data) as HealthMetrics);
        const weeklyAgg = this.calculateAggregates(parsedData);

        // Store weekly aggregate
        const weeklyId = `weekly_${Math.floor(now / (7 * 24 * 60 * 60 * 1000))}`;
        await this.db.runAsync(
          'INSERT OR REPLACE INTO health_data (id, data, timestamp, aggregated_weekly) VALUES (?, ?, ?, ?)',
          [weeklyId, '{}', now, JSON.stringify(weeklyAgg)]
        );
      }

      // Get last 30 days for monthly aggregation
      const monthlyData = await this.db.getAllAsync(
        'SELECT data FROM health_data WHERE timestamp >= ? ORDER BY timestamp DESC',
        [oneMonthAgo]
      ) as { data: string }[];

      if (monthlyData.length > 0) {
        const parsedData = monthlyData.map(row => JSON.parse(row.data) as HealthMetrics);
        const monthlyAgg = this.calculateAggregates(parsedData);
        const trends = this.calculateTrends(parsedData);

        // Store monthly aggregate with trends
        const monthlyId = `monthly_${Math.floor(now / (30 * 24 * 60 * 60 * 1000))}`;
        await this.db.runAsync(
          'INSERT OR REPLACE INTO health_data (id, data, timestamp, aggregated_monthly) VALUES (?, ?, ?, ?)',
          [monthlyId, '{}', now, JSON.stringify({ ...monthlyAgg, trends })]
        );
      }
    } catch (error) {
      // Silently handle aggregation errors
    }
  }

  private calculateAggregates(data: HealthMetrics[]) {
    const sum = data.reduce(
      (acc, curr) => ({
        restingHeartRate: acc.restingHeartRate + curr.restingHeartRate,
        heartRateVariability: acc.heartRateVariability + curr.heartRateVariability,
        vo2Max: acc.vo2Max + curr.vo2Max,
        deepSleepPercentage: acc.deepSleepPercentage + curr.deepSleepPercentage,
        remSleepPercentage: acc.remSleepPercentage + curr.remSleepPercentage,
        sleepConsistency: acc.sleepConsistency + curr.sleepConsistency,
        monthlyTrainingTime: acc.monthlyTrainingTime + curr.monthlyTrainingTime,
        trainingIntensity: acc.trainingIntensity + curr.trainingIntensity,
        dailySteps: acc.dailySteps + curr.dailySteps,
      }),
      {
        restingHeartRate: 0,
        heartRateVariability: 0,
        vo2Max: 0,
        deepSleepPercentage: 0,
        remSleepPercentage: 0,
        sleepConsistency: 0,
        monthlyTrainingTime: 0,
        trainingIntensity: 0,
        dailySteps: 0,
      }
    );

    const count = data.length;
    return {
      avgRestingHeartRate: Math.round(sum.restingHeartRate / count),
      avgHeartRateVariability: Math.round(sum.heartRateVariability / count),
      avgVO2Max: Math.round((sum.vo2Max / count) * 10) / 10,
      avgDeepSleepPercentage: Math.round((sum.deepSleepPercentage / count) * 10) / 10,
      avgRemSleepPercentage: Math.round((sum.remSleepPercentage / count) * 10) / 10,
      avgSleepConsistency: Math.round(sum.sleepConsistency / count),
      totalTrainingTime: Math.round(sum.monthlyTrainingTime / count),
      avgTrainingIntensity: Math.round(sum.trainingIntensity / count),
      avgDailySteps: Math.round(sum.dailySteps / count),
    };
  }

  private calculateTrends(data: HealthMetrics[]) {
    if (data.length < 14) {
      return {
        heartHealthTrend: 'stable' as const,
        sleepTrend: 'stable' as const,
        activityTrend: 'stable' as const,
      };
    }

    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));

    const firstHalfAvg = this.calculateAggregates(firstHalf);
    const secondHalfAvg = this.calculateAggregates(secondHalf);

    const getTrend = (oldVal: number, newVal: number, threshold = 5) => {
      const change = ((newVal - oldVal) / oldVal) * 100;
      if (change > threshold) return 'improving';
      if (change < -threshold) return 'declining';
      return 'stable';
    };

    // Heart health trend (lower RHR and higher HRV is better)
    const heartTrend = (() => {
      const rhrTrend = getTrend(firstHalfAvg.avgRestingHeartRate, secondHalfAvg.avgRestingHeartRate);
      const hrvTrend = getTrend(firstHalfAvg.avgHeartRateVariability, secondHalfAvg.avgHeartRateVariability);
      
      if ((rhrTrend === 'declining' && hrvTrend === 'improving') || 
          (rhrTrend === 'stable' && hrvTrend === 'improving') ||
          (rhrTrend === 'declining' && hrvTrend === 'stable')) {
        return 'improving';
      }
      if ((rhrTrend === 'improving' && hrvTrend === 'declining') || 
          (rhrTrend === 'stable' && hrvTrend === 'declining') ||
          (rhrTrend === 'improving' && hrvTrend === 'stable')) {
        return 'declining';
      }
      return 'stable';
    })();

    return {
      heartHealthTrend: heartTrend,
      sleepTrend: getTrend(
        (firstHalfAvg.avgDeepSleepPercentage + firstHalfAvg.avgRemSleepPercentage + firstHalfAvg.avgSleepConsistency) / 3,
        (secondHalfAvg.avgDeepSleepPercentage + secondHalfAvg.avgRemSleepPercentage + secondHalfAvg.avgSleepConsistency) / 3
      ),
      activityTrend: getTrend(
        (firstHalfAvg.totalTrainingTime + firstHalfAvg.avgDailySteps / 100) / 2,
        (secondHalfAvg.totalTrainingTime + secondHalfAvg.avgDailySteps / 100) / 2
      ),
    };
  }

  async getAggregatedHealthData(): Promise<StoredHealthData | null> {
    if (!this.db) {
      await this.initialize();
    }

    try {
      const result = await this.db!.getFirstAsync(
        'SELECT * FROM health_data WHERE aggregated_monthly IS NOT NULL ORDER BY timestamp DESC LIMIT 1'
      ) as any;

      if (result) {
        return {
          id: result.id,
          data: JSON.parse(result.data || '{}'),
          timestamp: result.timestamp,
          aggregatedWeekly: result.aggregated_weekly ? JSON.parse(result.aggregated_weekly) : undefined,
          aggregatedMonthly: result.aggregated_monthly ? JSON.parse(result.aggregated_monthly) : undefined,
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async storeAIResponse(userMessage: string, aiResponse: string, healthContext: string): Promise<void> {
    if (!this.db) {
      await this.initialize();
    }

    const id = `ai_${Date.now()}`;
    const timestamp = Date.now();

    try {
      await this.db!.runAsync(
        'INSERT INTO ai_responses (id, user_message, ai_response, timestamp, context) VALUES (?, ?, ?, ?, ?)',
        [id, userMessage, aiResponse, timestamp, healthContext]
      );

      // Keep only last 100 AI responses for privacy
      const responses = await this.db!.getAllAsync(
        'SELECT id FROM ai_responses ORDER BY timestamp DESC LIMIT -1 OFFSET 100'
      ) as { id: string }[];

      if (responses.length > 0) {
        const idsToDelete = responses.map(r => `'${r.id}'`).join(',');
        await this.db!.runAsync(`DELETE FROM ai_responses WHERE id IN (${idsToDelete})`);
      }

    } catch (error) {
      throw error;
    }
  }

  async getCachedAIResponse(userMessage: string, maxAgeHours = 24): Promise<string | null> {
    if (!this.db) {
      await this.initialize();
    }

    const maxAge = Date.now() - (maxAgeHours * 60 * 60 * 1000);

    try {
      const result = await this.db!.getFirstAsync(
        'SELECT ai_response FROM ai_responses WHERE user_message = ? AND timestamp > ? ORDER BY timestamp DESC LIMIT 1',
        [userMessage, maxAge]
      ) as { ai_response: string } | null;

      return result?.ai_response || null;
    } catch (error) {
      return null;
    }
  }

  async getUserConsent(): Promise<boolean> {
    try {
      const consent = await AsyncStorage.getItem('health_data_consent');
      return consent === 'true';
    } catch (error) {
      return false;
    }
  }

  async setUserConsent(consent: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem('health_data_consent', consent.toString());
    } catch (error) {
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    if (!this.db) {
      await this.initialize();
    }

    try {
      await this.db!.runAsync('DELETE FROM health_data');
      await this.db!.runAsync('DELETE FROM ai_responses');
      await AsyncStorage.removeItem('health_data_consent');
    } catch (error) {
      throw error;
    }
  }
}

export default StorageService.getInstance();