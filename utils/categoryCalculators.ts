/**
 * Category Calculators
 * Focused calculators for each health category to replace the monolithic calculateFitnessScore function
 */

import {
  calculateBonusPoints,
  calculateDailyStepsPoints,
  calculateDailyTrainingTimePoints,
  calculateDeepSleepPoints,
  calculateHeartRateVariabilityPoints,
  calculateREMSleepPoints,
  calculateRestingHeartRatePoints,
  calculateSleepConsistencyPoints,
  calculateTrainingIntensityPoints,
  calculateVO2MaxPoints,
  CategoryScoringResult,
  createHistoryItem,
  HistoryItem,
} from "./scoringUtils";

/**
 * Calculate cardiovascular health category points (30 points max)
 */
export function calculateCardiovascularPoints(
  restingHeartRate: number,
  heartRateVariability: number,
  vo2Max: number
): CategoryScoringResult {
  const items: HistoryItem[] = [];

  // Resting Heart Rate (10 points max)
  const rhrResult = calculateRestingHeartRatePoints(restingHeartRate);
  items.push(
    createHistoryItem(
      "Cardiovascular Health",
      "Resting Heart Rate",
      rhrResult.points,
      10,
      rhrResult.reason
    )
  );

  // Heart Rate Variability (10 points max)
  const hrvResult = calculateHeartRateVariabilityPoints(heartRateVariability);
  items.push(
    createHistoryItem(
      "Cardiovascular Health",
      "Heart Rate Variability",
      hrvResult.points,
      10,
      hrvResult.reason
    )
  );

  // VO2 Max (10 points max)
  const vo2Result = calculateVO2MaxPoints(vo2Max);
  items.push(
    createHistoryItem(
      "Cardiovascular Health",
      "VO2 Max",
      vo2Result.points,
      10,
      vo2Result.reason
    )
  );

  const total = rhrResult.points + hrvResult.points + vo2Result.points;

  return { total, items };
}

/**
 * Calculate recovery & regeneration category points (35 points max)
 */
export function calculateRecoveryPoints(
  deepSleepPercentage: number,
  remSleepPercentage: number,
  sleepConsistency: number
): CategoryScoringResult {
  const items: HistoryItem[] = [];

  // Deep Sleep (15 points max)
  const deepSleepResult = calculateDeepSleepPoints(deepSleepPercentage);
  items.push(
    createHistoryItem(
      "Recovery & Regeneration",
      "Deep Sleep",
      deepSleepResult.points,
      15,
      deepSleepResult.reason
    )
  );

  // REM Sleep (12 points max)
  const remSleepResult = calculateREMSleepPoints(remSleepPercentage);
  items.push(
    createHistoryItem(
      "Recovery & Regeneration",
      "REM Sleep",
      remSleepResult.points,
      12,
      remSleepResult.reason
    )
  );

  // Sleep Consistency (8 points max)
  const sleepConsistencyResult =
    calculateSleepConsistencyPoints(sleepConsistency);
  items.push(
    createHistoryItem(
      "Recovery & Regeneration",
      "Sleep Consistency",
      sleepConsistencyResult.points,
      8,
      sleepConsistencyResult.reason
    )
  );

  const total =
    deepSleepResult.points +
    remSleepResult.points +
    sleepConsistencyResult.points;

  return { total, items };
}

/**
 * Calculate activity & training category points (30 points max)
 */
export function calculateActivityPoints(
  dailyTrainingTime: number,
  trainingIntensity: number,
  dailySteps: number
): CategoryScoringResult {
  const items: HistoryItem[] = [];

  // Daily Training Time (12 points max)
  const trainingTimeResult =
    calculateDailyTrainingTimePoints(dailyTrainingTime);

  items.push(
    createHistoryItem(
      "Activity & Training",
      "Daily Training Time",
      trainingTimeResult.points,
      12,
      trainingTimeResult.reason
    )
  );

  // Training Intensity (12 points max)
  const intensityResult = calculateTrainingIntensityPoints(trainingIntensity);
  items.push(
    createHistoryItem(
      "Activity & Training",
      "Training Intensity",
      intensityResult.points,
      12,
      intensityResult.reason
    )
  );

  // Daily Steps (6 points max)
  const stepsResult = calculateDailyStepsPoints(dailySteps);
  items.push(
    createHistoryItem(
      "Activity & Training",
      "Daily Steps",
      stepsResult.points,
      6,
      stepsResult.reason
    )
  );

  const total =
    trainingTimeResult.points + intensityResult.points + stepsResult.points;

  return { total, items };
}

/**
 * Create bonus metric history item
 */
export function createBonusHistoryItem(
  cardiovascularPoints: number,
  recoveryPoints: number,
  activityPoints: number
): HistoryItem {
  const bonusResult = calculateBonusPoints(
    cardiovascularPoints,
    recoveryPoints,
    activityPoints
  );

  return createHistoryItem(
    "Bonus Metric",
    "Overall Consistency",
    bonusResult.points,
    5,
    bonusResult.reason + " | " + bonusResult.detailedExplanation
  );
}
