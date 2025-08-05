/**
 * Legacy calculation functions for backward compatibility
 */

import {
  FitnessScoreResult,
  HealthMetrics,
  MonthlyAverageResult,
} from "@/types/health";

/**
 * Legacy function for backward compatibility
 * This maintains the old behavior for existing code
 */
export function calculateMonthlyAverage(
  currentMetrics: HealthMetrics,
  calculateFitnessScore: (metrics: HealthMetrics) => FitnessScoreResult
): MonthlyAverageResult {
  const currentResult = calculateFitnessScore(currentMetrics);
  console.log(currentResult.recoveryPoints);
  return {
    totalScore: currentResult.totalScore,
    cardiovascularPoints: currentResult.cardiovascularPoints,
    recoveryPoints: currentResult.recoveryPoints,
    activityPoints: currentResult.activityPoints,
    bonusPoints: currentResult.bonusPoints,
    fitnessLevel: currentResult.fitnessLevel,
    dataPointsCount: 0,
    isEstimated: true,
  };
}
