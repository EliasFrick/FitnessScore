import {
  FitnessScoreResult,
  HealthMetrics,
  MonthlyAverageResult,
} from "@/types/health";

export function calculateMonthlyAverage(
  currentMetrics: HealthMetrics,
  calculateFitnessScore: (metrics: HealthMetrics) => FitnessScoreResult,
): MonthlyAverageResult {
  const currentResult = calculateFitnessScore(currentMetrics);
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
