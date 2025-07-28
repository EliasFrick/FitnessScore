/**
 * Scoring Utilities
 * Shared utilities for fitness score calculations to eliminate code duplication
 */

import {
  HEART_RATE_THRESHOLDS,
  HRV_THRESHOLDS,
  VO2_MAX_THRESHOLDS,
  DEEP_SLEEP_THRESHOLDS,
  REM_SLEEP_THRESHOLDS,
  SLEEP_CONSISTENCY_THRESHOLDS,
  DAILY_TRAINING_THRESHOLDS,
  TRAINING_INTENSITY_THRESHOLDS,
  DAILY_STEPS_THRESHOLDS,
  SCORING_WEIGHTS,
  FITNESS_LEVEL_THRESHOLDS,
  FITNESS_LEVELS,
  BONUS_REQUIREMENTS,
} from '@/constants/healthThresholds';

export interface ScoringResult {
  points: number;
  reason: string;
}

export interface CategoryScoringResult {
  total: number;
  items: HistoryItem[];
}

export interface HistoryItem {
  category: "Cardiovascular Health" | "Recovery & Regeneration" | "Activity & Training" | "Bonus Metric";
  metric: string;
  points: number;
  maxPoints: number;
  reason: string;
}

/**
 * Create a standardized history item
 */
export function createHistoryItem(
  category: HistoryItem["category"],
  metric: string,
  points: number,
  maxPoints: number,
  reason: string
): HistoryItem {
  return { category, metric, points, maxPoints, reason };
}

/**
 * Create a scoring result with points and reason
 */
export function createScoringResult(points: number, reason: string): ScoringResult {
  return { points, reason };
}

/**
 * Calculate percentage score from points and max points
 */
export function calculatePercentageScore(points: number, maxPoints: number): number {
  return Math.round((points / maxPoints) * 100);
}

/**
 * Determine fitness level based on total score
 */
export function determineFitnessLevel(totalScore: number): string {
  if (totalScore >= FITNESS_LEVEL_THRESHOLDS.TOP_FORM) {
    return FITNESS_LEVELS.TOP_FORM;
  } else if (totalScore >= FITNESS_LEVEL_THRESHOLDS.STRONG_ACTIVE) {
    return FITNESS_LEVELS.STRONG_ACTIVE;
  } else if (totalScore >= FITNESS_LEVEL_THRESHOLDS.SOLID_PROGRESS) {
    return FITNESS_LEVELS.SOLID_PROGRESS;
  } else if (totalScore >= FITNESS_LEVEL_THRESHOLDS.ON_THE_WAY) {
    return FITNESS_LEVELS.ON_THE_WAY;
  } else {
    return FITNESS_LEVELS.TIME_FOR_CHANGE;
  }
}

/**
 * Calculate resting heart rate points
 */
export function calculateRestingHeartRatePoints(restingHeartRate: number): ScoringResult {
  if (restingHeartRate <= 0) {
    return createScoringResult(0, "No resting heart rate data available");
  }

  if (restingHeartRate <= HEART_RATE_THRESHOLDS.EXCELLENT) {
    return createScoringResult(10, `Excellent RHR (${restingHeartRate} bpm) - athlete-level cardiovascular fitness`);
  } else if (restingHeartRate <= HEART_RATE_THRESHOLDS.VERY_GOOD) {
    return createScoringResult(8, `Very good RHR (${restingHeartRate} bpm) - excellent cardiovascular health`);
  } else if (restingHeartRate <= HEART_RATE_THRESHOLDS.GOOD) {
    return createScoringResult(6, `Good RHR (${restingHeartRate} bpm) - healthy cardiovascular range`);
  } else if (restingHeartRate <= HEART_RATE_THRESHOLDS.AVERAGE) {
    return createScoringResult(4, `Average RHR (${restingHeartRate} bpm) - room for improvement with cardio training`);
  } else if (restingHeartRate <= HEART_RATE_THRESHOLDS.ELEVATED) {
    return createScoringResult(2, `Elevated RHR (${restingHeartRate} bpm) - focus on cardiovascular conditioning`);
  } else {
    return createScoringResult(1, `High RHR (${restingHeartRate} bpm) - consult healthcare provider`);
  }
}

/**
 * Calculate heart rate variability points
 */
export function calculateHeartRateVariabilityPoints(heartRateVariability: number): ScoringResult {
  if (heartRateVariability <= 0) {
    return createScoringResult(0, "No heart rate variability data available");
  }

  if (heartRateVariability >= HRV_THRESHOLDS.OUTSTANDING) {
    return createScoringResult(10, `Outstanding HRV (${heartRateVariability} ms) - excellent autonomic nervous system recovery`);
  } else if (heartRateVariability >= HRV_THRESHOLDS.VERY_GOOD) {
    return createScoringResult(8, `Very good HRV (${heartRateVariability} ms) - strong recovery capacity`);
  } else if (heartRateVariability >= HRV_THRESHOLDS.GOOD) {
    return createScoringResult(6, `Good HRV (${heartRateVariability} ms) - adequate recovery signals`);
  } else if (heartRateVariability >= HRV_THRESHOLDS.BELOW_AVERAGE) {
    return createScoringResult(4, `Below average HRV (${heartRateVariability} ms) - focus on stress management and recovery`);
  } else {
    return createScoringResult(2, `Low HRV (${heartRateVariability} ms) - prioritize sleep, stress reduction, and recovery`);
  }
}

/**
 * Calculate VO2 Max points
 */
export function calculateVO2MaxPoints(vo2Max: number): ScoringResult {
  if (vo2Max <= 0) {
    return createScoringResult(0, "No VO2 Max data available - consider fitness assessment");
  }

  if (vo2Max >= VO2_MAX_THRESHOLDS.OUTSTANDING) {
    return createScoringResult(10, `Outstanding VO2 Max (${vo2Max} ml/kg/min) - superior aerobic fitness`);
  } else if (vo2Max >= VO2_MAX_THRESHOLDS.EXCELLENT) {
    return createScoringResult(8, `Excellent VO2 Max (${vo2Max} ml/kg/min) - very high aerobic capacity`);
  } else if (vo2Max >= VO2_MAX_THRESHOLDS.GOOD) {
    return createScoringResult(6, `Good VO2 Max (${vo2Max} ml/kg/min) - solid aerobic fitness`);
  } else if (vo2Max >= VO2_MAX_THRESHOLDS.AVERAGE) {
    return createScoringResult(4, `Average VO2 Max (${vo2Max} ml/kg/min) - increase cardio training intensity`);
  } else {
    return createScoringResult(2, `Low VO2 Max (${vo2Max} ml/kg/min) - focus on building aerobic endurance`);
  }
}

/**
 * Calculate deep sleep points
 */
export function calculateDeepSleepPoints(deepSleepPercentage: number): ScoringResult {
  if (deepSleepPercentage >= DEEP_SLEEP_THRESHOLDS.EXCELLENT) {
    return createScoringResult(15, `Excellent deep sleep (${deepSleepPercentage}%) - optimal physical recovery`);
  } else if (deepSleepPercentage >= DEEP_SLEEP_THRESHOLDS.VERY_GOOD) {
    return createScoringResult(12, `Very good deep sleep (${deepSleepPercentage}%) - great physical recovery`);
  } else if (deepSleepPercentage >= DEEP_SLEEP_THRESHOLDS.GOOD) {
    return createScoringResult(10, `Good deep sleep (${deepSleepPercentage}%) - adequate physical recovery`);
  } else if (deepSleepPercentage >= DEEP_SLEEP_THRESHOLDS.AVERAGE) {
    return createScoringResult(7, `Average deep sleep (${deepSleepPercentage}%) - improve sleep environment and routine`);
  } else if (deepSleepPercentage >= DEEP_SLEEP_THRESHOLDS.BELOW_AVERAGE) {
    return createScoringResult(4, `Below average deep sleep (${deepSleepPercentage}%) - focus on sleep quality improvement`);
  } else if (deepSleepPercentage > 0) {
    return createScoringResult(2, `Low deep sleep (${deepSleepPercentage}%) - significant sleep quality concerns`);
  } else {
    return createScoringResult(0, "No deep sleep data available");
  }
}

/**
 * Calculate REM sleep points
 */
export function calculateREMSleepPoints(remSleepPercentage: number): ScoringResult {
  if (remSleepPercentage >= REM_SLEEP_THRESHOLDS.EXCELLENT) {
    return createScoringResult(12, `Excellent REM sleep (${remSleepPercentage}%) - optimal mental recovery and memory consolidation`);
  } else if (remSleepPercentage >= REM_SLEEP_THRESHOLDS.VERY_GOOD) {
    return createScoringResult(10, `Very good REM sleep (${remSleepPercentage}%) - great mental recovery`);
  } else if (remSleepPercentage >= REM_SLEEP_THRESHOLDS.GOOD) {
    return createScoringResult(8, `Good REM sleep (${remSleepPercentage}%) - adequate mental recovery`);
  } else if (remSleepPercentage >= REM_SLEEP_THRESHOLDS.AVERAGE) {
    return createScoringResult(5, `Average REM sleep (${remSleepPercentage}%) - reduce stress and screen time before bed`);
  } else if (remSleepPercentage > 0) {
    return createScoringResult(3, `Low REM sleep (${remSleepPercentage}%) - address sleep disturbances and stress levels`);
  } else {
    return createScoringResult(0, "No REM sleep data available");
  }
}

/**
 * Calculate sleep consistency points
 */
export function calculateSleepConsistencyPoints(sleepConsistency: number): ScoringResult {
  if (sleepConsistency >= SLEEP_CONSISTENCY_THRESHOLDS.EXCELLENT) {
    return createScoringResult(8, `Excellent sleep consistency (${sleepConsistency}%) - regular sleep schedule optimizes recovery`);
  } else if (sleepConsistency >= SLEEP_CONSISTENCY_THRESHOLDS.GOOD) {
    return createScoringResult(6, `Good sleep consistency (${sleepConsistency}%) - maintain regular bedtime routine`);
  } else if (sleepConsistency >= SLEEP_CONSISTENCY_THRESHOLDS.MODERATE) {
    return createScoringResult(4, `Moderate sleep consistency (${sleepConsistency}%) - work on more regular schedule`);
  } else if (sleepConsistency > 0) {
    return createScoringResult(2, `Poor sleep consistency (${sleepConsistency}%) - establish a regular sleep schedule`);
  } else {
    return createScoringResult(0, "No sleep consistency data available");
  }
}

/**
 * Calculate daily training time points
 */
export function calculateDailyTrainingTimePoints(dailyTrainingTime: number): ScoringResult {
  if (dailyTrainingTime >= DAILY_TRAINING_THRESHOLDS.OUTSTANDING) {
    return createScoringResult(12, `Outstanding training volume (${Math.round(dailyTrainingTime)} min/day) - exceptional fitness commitment`);
  } else if (dailyTrainingTime >= DAILY_TRAINING_THRESHOLDS.EXCELLENT) {
    return createScoringResult(10, `Excellent training volume (${Math.round(dailyTrainingTime)} min/day) - great commitment to fitness`);
  } else if (dailyTrainingTime >= DAILY_TRAINING_THRESHOLDS.GOOD) {
    return createScoringResult(8, `Good training volume (${Math.round(dailyTrainingTime)} min/day) - solid fitness routine`);
  } else if (dailyTrainingTime >= DAILY_TRAINING_THRESHOLDS.MODERATE) {
    return createScoringResult(6, `Moderate training volume (${Math.round(dailyTrainingTime)} min/day) - meets WHO minimum`);
  } else if (dailyTrainingTime >= DAILY_TRAINING_THRESHOLDS.BELOW_AVERAGE) {
    return createScoringResult(4, `Below recommended volume (${Math.round(dailyTrainingTime)} min/day) - increase frequency`);
  } else if (dailyTrainingTime >= DAILY_TRAINING_THRESHOLDS.LOW) {
    return createScoringResult(2, `Low training volume (${Math.round(dailyTrainingTime)} min/day) - aim for more consistent training`);
  } else if (dailyTrainingTime > 0) {
    return createScoringResult(1, `Very low training volume (${Math.round(dailyTrainingTime)} min/day) - start building routine`);
  } else {
    return createScoringResult(0, "No training data available");
  }
}

/**
 * Calculate training intensity points
 */
export function calculateTrainingIntensityPoints(trainingIntensity: number): ScoringResult {
  if (trainingIntensity >= TRAINING_INTENSITY_THRESHOLDS.EXCEPTIONAL) {
    return createScoringResult(12, `Exceptional training intensity (${trainingIntensity}%) - outstanding workout quality and effort`);
  } else if (trainingIntensity >= TRAINING_INTENSITY_THRESHOLDS.HIGH) {
    return createScoringResult(10, `High training intensity (${trainingIntensity}%) - excellent workout quality and effort`);
  } else if (trainingIntensity >= TRAINING_INTENSITY_THRESHOLDS.GOOD) {
    return createScoringResult(7, `Good training intensity (${trainingIntensity}%) - effective workout sessions`);
  } else if (trainingIntensity >= TRAINING_INTENSITY_THRESHOLDS.MODERATE) {
    return createScoringResult(4, `Moderate training intensity (${trainingIntensity}%) - push yourself harder during workouts`);
  } else if (trainingIntensity > 0) {
    return createScoringResult(2, `Low training intensity (${trainingIntensity}%) - focus on challenging yourself more`);
  } else {
    return createScoringResult(0, "No training intensity data available");
  }
}

/**
 * Calculate daily steps points
 */
export function calculateDailyStepsPoints(dailySteps: number): ScoringResult {
  if (dailySteps >= DAILY_STEPS_THRESHOLDS.OUTSTANDING) {
    return createScoringResult(6, `Outstanding daily activity (${dailySteps.toLocaleString()} steps) - exceptional health benefits`);
  } else if (dailySteps >= DAILY_STEPS_THRESHOLDS.EXCELLENT) {
    return createScoringResult(5, `Excellent daily activity (${dailySteps.toLocaleString()} steps) - optimal WHO range for health`);
  } else if (dailySteps >= DAILY_STEPS_THRESHOLDS.VERY_GOOD) {
    return createScoringResult(4, `Very good daily activity (${dailySteps.toLocaleString()} steps) - significant health benefits`);
  } else if (dailySteps >= DAILY_STEPS_THRESHOLDS.GOOD) {
    return createScoringResult(3, `Good daily activity (${dailySteps.toLocaleString()} steps) - moderate health benefits`);
  } else if (dailySteps >= DAILY_STEPS_THRESHOLDS.MODERATE) {
    return createScoringResult(2, `Moderate activity (${dailySteps.toLocaleString()} steps) - some health benefits, aim higher`);
  } else if (dailySteps >= DAILY_STEPS_THRESHOLDS.LOW) {
    return createScoringResult(1, `Low daily activity (${dailySteps.toLocaleString()} steps) - minimal benefits, increase gradually`);
  } else if (dailySteps > 0) {
    return createScoringResult(1, `Very low daily activity (${dailySteps.toLocaleString()} steps) - start building movement habits`);
  } else {
    return createScoringResult(0, "No step data available");
  }
}

/**
 * Calculate bonus points based on category performance
 */
export function calculateBonusPoints(
  cardiovascularPoints: number,
  recoveryPoints: number,
  activityPoints: number
): { points: number; reason: string; detailedExplanation: string } {
  const cardiovascularPercent = calculatePercentageScore(cardiovascularPoints, SCORING_WEIGHTS.CARDIOVASCULAR_MAX);
  const recoveryPercent = calculatePercentageScore(recoveryPoints, SCORING_WEIGHTS.RECOVERY_MAX);
  const activityPercent = calculatePercentageScore(activityPoints, SCORING_WEIGHTS.ACTIVITY_MAX);

  const excellentCategories = [];
  if (cardiovascularPercent >= BONUS_REQUIREMENTS.EXCELLENT_THRESHOLD) excellentCategories.push("Cardiovascular");
  if (recoveryPercent >= BONUS_REQUIREMENTS.EXCELLENT_THRESHOLD) excellentCategories.push("Recovery");
  if (activityPercent >= BONUS_REQUIREMENTS.EXCELLENT_THRESHOLD) excellentCategories.push("Activity");

  if (excellentCategories.length === 3) {
    return {
      points: BONUS_REQUIREMENTS.ALL_CATEGORIES_BONUS,
      reason: `Outstanding consistency across all categories! Cardiovascular: ${cardiovascularPercent}%, Recovery: ${recoveryPercent}%, Activity: ${activityPercent}%`,
      detailedExplanation: "Achieved ≥75% in all three health categories - maximum bonus achieved!",
    };
  } else if (excellentCategories.length === 2) {
    const categoryPercentages = excellentCategories.map((cat) =>
      cat === "Cardiovascular" ? `${cardiovascularPercent}%` : cat === "Recovery" ? `${recoveryPercent}%` : `${activityPercent}%`
    );
    return {
      points: BONUS_REQUIREMENTS.TWO_CATEGORIES_BONUS,
      reason: `Excellent performance in ${excellentCategories.join(" & ")} (${categoryPercentages.join(", ")}) - strong consistency!`,
      detailedExplanation: "Achieved ≥75% in two health categories - great progress toward full consistency!",
    };
  } else if (excellentCategories.length === 1) {
    const categoryPercent =
      excellentCategories[0] === "Cardiovascular" ? cardiovascularPercent : excellentCategories[0] === "Recovery" ? recoveryPercent : activityPercent;
    return {
      points: BONUS_REQUIREMENTS.ONE_CATEGORY_BONUS,
      reason: `Good performance in ${excellentCategories[0]} (${categoryPercent}%) - build consistency in other areas`,
      detailedExplanation: "Achieved ≥75% in one health category - focus on improving other areas for more bonus points!",
    };
  } else {
    return {
      points: 0,
      reason: `Work toward consistency bonus: Cardiovascular ${cardiovascularPercent}%, Recovery ${recoveryPercent}%, Activity ${activityPercent}%. Target: Get any category to ≥75% for bonus points!`,
      detailedExplanation: "Bonus Requirements: Cardiovascular ≥22.5pts (75%), Recovery ≥26.25pts (75%), Activity ≥22.5pts (75%). Achieve these thresholds in 1, 2, or 3 categories for 1, 3, or 5 bonus points respectively.",
    };
  }
}