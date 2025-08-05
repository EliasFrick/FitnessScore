/**
 * Daily Fitness Score Calculator
 * Calculates fitness scores for individual days
 */

import { DailyHealthMetrics, DailyFitnessScore } from "@/types/health";
import {
  calculateCardiovascularPoints,
  calculateRecoveryPoints,
  calculateActivityPoints,
  createBonusHistoryItem,
} from "./categoryCalculators";
import { determineFitnessLevel, calculateBonusPoints } from "./scoringUtils";

/**
 * Calculate daily fitness score based on daily health metrics
 * This is similar to calculateFitnessScore but handles daily training time instead of monthly
 */
export function calculateDailyFitnessScore(
  metrics: DailyHealthMetrics,
): DailyFitnessScore {
  // Calculate each category using focused calculators
  const cardiovascularResult = calculateCardiovascularPoints(
    metrics.restingHeartRate,
    metrics.heartRateVariability,
    metrics.vo2Max,
  );

  const recoveryResult = calculateRecoveryPoints(
    metrics.deepSleepPercentage,
    metrics.remSleepPercentage,
    metrics.sleepConsistency,
  );

  const activityResult = calculateActivityPoints(
    metrics.dailyTrainingTime, // Already daily, no conversion needed
    metrics.trainingIntensity,
    metrics.dailySteps,
  );

  // Calculate bonus points
  const bonusResult = calculateBonusPoints(
    cardiovascularResult.total,
    recoveryResult.total,
    activityResult.total,
  );

  const bonusHistoryItem = createBonusHistoryItem(
    cardiovascularResult.total,
    recoveryResult.total,
    activityResult.total,
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
    bonusHistoryItem,
  ];

  return {
    date: metrics.date,
    totalScore,
    cardiovascularPoints: cardiovascularResult.total,
    recoveryPoints: recoveryResult.total,
    activityPoints: activityResult.total,
    bonusPoints: bonusResult.points,
    fitnessLevel,
    historyItems,
  };
}
