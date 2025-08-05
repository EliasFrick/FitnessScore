/**
 * Mock data generators for testing and demonstration
 */

import { HealthMetrics } from "@/types/health";

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
    averageSteps: 0,
  };
}
