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
  historyItems: Array<{
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
  }>,
  currentMetrics: HealthMetrics,
  calculateFitnessScore: (metrics: HealthMetrics) => FitnessScoreResult,
): MonthlyAverageResult {
  // Filter history items from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentHistory = historyItems.filter(
    (item) => item.timestamp >= thirtyDaysAgo,
  );

  // If no historical data, use current metrics
  if (recentHistory.length === 0) {
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

  // Group history items by category
  const categoryTotals = {
    "Cardiovascular Health": { points: 0, maxPoints: 0, count: 0 },
    "Recovery & Regeneration": { points: 0, maxPoints: 0, count: 0 },
    "Activity & Training": { points: 0, maxPoints: 0, count: 0 },
    "Bonus Metric": { points: 0, maxPoints: 0, count: 0 },
  };

  // Sum up points for each category
  recentHistory.forEach((item) => {
    if (categoryTotals[item.category]) {
      categoryTotals[item.category].points += item.points;
      categoryTotals[item.category].maxPoints += item.maxPoints;
      categoryTotals[item.category].count += 1;
    }
  });

  // Calculate averages for each category based on actual average points achieved
  // Only calculate if we have data, otherwise use current metrics as fallback
  const cardiovascularPoints =
    categoryTotals["Cardiovascular Health"].count > 0
      ? Math.round(
          categoryTotals["Cardiovascular Health"].points /
            categoryTotals["Cardiovascular Health"].count,
        )
      : Math.round(calculateFitnessScore(currentMetrics).cardiovascularPoints);

  const recoveryPoints =
    categoryTotals["Recovery & Regeneration"].count > 0
      ? Math.round(
          categoryTotals["Recovery & Regeneration"].points /
            categoryTotals["Recovery & Regeneration"].count,
        )
      : Math.round(calculateFitnessScore(currentMetrics).recoveryPoints);

  const activityPoints =
    categoryTotals["Activity & Training"].count > 0
      ? Math.round(
          categoryTotals["Activity & Training"].points /
            categoryTotals["Activity & Training"].count,
        )
      : Math.round(calculateFitnessScore(currentMetrics).activityPoints);

  const bonusPoints =
    categoryTotals["Bonus Metric"].count > 0
      ? Math.round(
          categoryTotals["Bonus Metric"].points /
            categoryTotals["Bonus Metric"].count,
        )
      : Math.round(calculateFitnessScore(currentMetrics).bonusPoints);

  const totalScore =
    cardiovascularPoints + recoveryPoints + activityPoints + bonusPoints;

  // Determine fitness level based on total score
  let fitnessLevel: string;
  if (totalScore >= 90) {
    fitnessLevel = "Topform!";
  } else if (totalScore >= 70) {
    fitnessLevel = "Stark & Aktiv";
  } else if (totalScore >= 50) {
    fitnessLevel = "Solide Fortschritte";
  } else if (totalScore >= 30) {
    fitnessLevel = "Auf dem Weg";
  } else {
    fitnessLevel = "Zeit für Veränderung";
  }

  return {
    totalScore,
    cardiovascularPoints,
    recoveryPoints,
    activityPoints,
    bonusPoints,
    fitnessLevel,
    dataPointsCount: recentHistory.length,
    isEstimated: false,
  };
}
