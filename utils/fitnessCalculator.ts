/**
 * Main Fitness Score Calculator
 * Clean, focused implementation using modular calculators
 */

import {
  FitnessScoreResult,
  HealthMetrics,
  MonthlyAverageResult,
} from "@/types/health";
import {
  calculateActivityPoints,
  calculateCardiovascularPoints,
  calculateRecoveryPoints,
} from "./categoryCalculators";
import { calculateBonusPoints, determineFitnessLevel } from "./scoringUtils";

/**
 * Calculate comprehensive fitness score based on health metrics
 *
 * Scoring System (Total: 100 points):
 * - Cardiovascular Health: 30 points (RHR 10pts, HRV 10pts, VO2 Max 10pts)
 * - Recovery & Regeneration: 35 points (Deep Sleep 15pts, REM Sleep 12pts, Sleep Consistency 8pts)
 * - Activity & Training: 30 points (Monthly Training Time 12pts, Training Intensity 12pts, Average Steps 6pts)
 * - Bonus Consistency: 5 points (1pt for 1 category ≥75%, 3pts for 2 categories ≥75%, 5pts for all 3 categories ≥75%)
 *
 * @param metrics - Health metrics data
 * @returns Detailed fitness score with breakdown and explanations
 */
export function calculateFitnessScore(
  metrics: HealthMetrics
): FitnessScoreResult {
  // Calculate each category using focused calculators
  const cardiovascularResult = calculateCardiovascularPoints(
    metrics.restingHeartRate,
    metrics.heartRateVariability,
    metrics.vo2Max
  );

  const recoveryResult = calculateRecoveryPoints(
    metrics.deepSleepPercentage,
    metrics.remSleepPercentage,
    metrics.sleepConsistency
  );

  const activityResult = calculateActivityPoints(
    metrics.monthlyTrainingTime / 30, // Convert monthly to daily average
    metrics.trainingIntensity,
    metrics.averageSteps
  );

  // Calculate bonus points
  const bonusResult = calculateBonusPoints(
    cardiovascularResult.total,
    recoveryResult.total,
    activityResult.total
  );

  // Combine all results
  const totalScore =
    cardiovascularResult.total +
    recoveryResult.total +
    activityResult.total +
    bonusResult.points;
  const fitnessLevel = determineFitnessLevel(totalScore);

  const historyItems = [
    ...cardiovascularResult.items,
    ...recoveryResult.items,
    ...activityResult.items,
  ];

  return {
    totalScore,
    cardiovascularPoints: cardiovascularResult.total,
    recoveryPoints: recoveryResult.total,
    activityPoints: activityResult.total,
    bonusPoints: bonusResult.points,
    fitnessLevel,
    bonusBreakdown: {
      cardiovascularPercent: Math.round(
        (cardiovascularResult.total / 30) * 100
      ),
      recoveryPercent: Math.round((recoveryResult.total / 35) * 100),
      activityPercent: Math.round((activityResult.total / 30) * 100),
      excellentCategories: bonusResult.detailedExplanation.includes("all three")
        ? ["Cardiovascular", "Recovery", "Activity"]
        : [],
      requirementsExplanation: bonusResult.detailedExplanation,
    },
    historyItems,
  };
}

export { getZeroHealthMetrics } from "./mockData";

export function calculateMonthlyAverage(
  currentMetrics: HealthMetrics
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
