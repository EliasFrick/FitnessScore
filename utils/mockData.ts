/**
 * Mock data generators for testing and demonstration
 */

import { HealthMetrics, DailyHealthMetrics } from '@/types/health';

// Example/mock data for demonstration
export function getMockHealthMetrics(): HealthMetrics {
  return {
    restingHeartRate: 65, // 6/10 points (60%)
    heartRateVariability: 30, // 6/10 points (60%)
    vo2Max: 40, // 8/10 points (80%)
    deepSleepPercentage: 18, // 10/15 points (67%)
    remSleepPercentage: 22, // 10/12 points (83%)
    sleepConsistency: 75, // 6/8 points (75%)
    monthlyTrainingTime: 800, // 8/12 points (67%) - ~200 min/week * 4 weeks
    trainingIntensity: 60, // 7/12 points (58%)
    dailySteps: 8500, // 4/6 points (67%)
  };
  // Expected: Cardiovascular ~67%, Recovery ~74%, Activity ~63%
  // Should get 0 bonus points (no categories ≥75%)
}

// Zero health metrics for no-data state
export function getZeroHealthMetrics(): HealthMetrics {
  return {
    restingHeartRate: 0,
    heartRateVariability: 0,
    vo2Max: 0,
    deepSleepPercentage: 0,
    remSleepPercentage: 0,
    sleepConsistency: 0,
    monthlyTrainingTime: 0,
    trainingIntensity: 0,
    dailySteps: 0,
  };
}