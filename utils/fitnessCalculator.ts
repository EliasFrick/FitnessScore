/**
 * Main Fitness Score Calculator
 * Clean, focused implementation using modular calculators
 */

import { HealthMetrics, FitnessScoreResult } from '@/types/health';
import {
  calculateCardiovascularPoints,
  calculateRecoveryPoints,
  calculateActivityPoints,
  createBonusHistoryItem,
} from './categoryCalculators';
import {
  determineFitnessLevel,
  calculateBonusPoints,
} from './scoringUtils';

/**
 * Calculate comprehensive fitness score based on health metrics
 *
 * Scoring System (Total: 100 points):
 * - Cardiovascular Health: 30 points (RHR 10pts, HRV 10pts, VO2 Max 10pts)
 * - Recovery & Regeneration: 35 points (Deep Sleep 15pts, REM Sleep 12pts, Sleep Consistency 8pts)
 * - Activity & Training: 30 points (Monthly Training Time 12pts, Training Intensity 12pts, Daily Steps 6pts)
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
    metrics.dailySteps
  );

  // Calculate bonus points
  const bonusResult = calculateBonusPoints(
    cardiovascularResult.total,
    recoveryResult.total,
    activityResult.total
  );

  const bonusHistoryItem = createBonusHistoryItem(
    cardiovascularResult.total,
    recoveryResult.total,
    activityResult.total
  );

  // Combine all results
  const totalScore = cardiovascularResult.total + recoveryResult.total + activityResult.total + bonusResult.points;
  const fitnessLevel = determineFitnessLevel(totalScore);

  const historyItems = [
    ...cardiovascularResult.items,
    ...recoveryResult.items,
    ...activityResult.items,
    bonusHistoryItem,
  ];

  return {
    totalScore,
    cardiovascularPoints: cardiovascularResult.total,
    recoveryPoints: recoveryResult.total,
    activityPoints: activityResult.total,
    bonusPoints: bonusResult.points,
    fitnessLevel,
    bonusBreakdown: {
      cardiovascularPercent: Math.round((cardiovascularResult.total / 30) * 100),
      recoveryPercent: Math.round((recoveryResult.total / 35) * 100),
      activityPercent: Math.round((activityResult.total / 30) * 100),
      excellentCategories: bonusResult.detailedExplanation.includes("all three") ? ["Cardiovascular", "Recovery", "Activity"] : [],
      requirementsExplanation: bonusResult.detailedExplanation,
    },
    historyItems,
  };
}

// Re-export commonly used functions for convenience
export {
  calculateDailyBasedMonthlyAverage,
  calculateDailyScoresFromHistoricalData,
  calculateMonthlyAverageFromDailyScores,
} from './historicalDataCalculators';

export {
  calculateDailyFitnessScore,
} from './dailyFitnessCalculator';

export {
  getMockHealthMetrics,
  getZeroHealthMetrics,
} from './mockData';

export {
  calculateMonthlyAverage,
  generateSampleHistoryData,
  convertHistoricalDataToHistoryItems,
} from './legacyCalculators';