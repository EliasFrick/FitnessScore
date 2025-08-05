/**
 * Historical Data Processing and Daily Score Calculations
 */

import { HealthValue } from "react-native-health";
import { HistoryItem } from "@/contexts/HistoryContext";
import {
  DailyHealthMetrics,
  DailyFitnessScore,
  MonthlyAverageResult,
} from "@/types/health";
import { calculateDailyFitnessScore } from "./dailyFitnessCalculator";
import { determineFitnessLevel } from "./scoringUtils";

/**
 * Convert historical health data from HealthService to daily metrics and calculate daily scores
 */
export function calculateDailyScoresFromHistoricalData(
  historicalData: Array<{
    date: Date;
    stepsData: HealthValue[];
    heartRateData: HealthValue[];
    hrvData: HealthValue[];
    sleepData: any[];
  }>,
  workoutData?: Array<{
    date: Date;
    duration: number; // in minutes
    intensity: number; // 0-100
  }>,
): DailyFitnessScore[] {
  const dailyScores: DailyFitnessScore[] = [];

  // Calculate sleep consistency across all days first
  const sleepDurations: number[] = [];
  historicalData.forEach((dayData) => {
    let totalSleep = 0;
    dayData.sleepData.forEach((sample) => {
      const duration =
        (new Date(sample.endDate).getTime() -
          new Date(sample.startDate).getTime()) /
        (1000 * 60 * 60);
      totalSleep += duration;
    });
    if (totalSleep > 0) {
      sleepDurations.push(totalSleep);
    }
  });

  const avgSleep =
    sleepDurations.length > 0
      ? sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length
      : 0;
  const variance =
    sleepDurations.length > 0
      ? sleepDurations.reduce(
          (sum, duration) => sum + Math.pow(duration - avgSleep, 2),
          0,
        ) / sleepDurations.length
      : 0;
  const stdDev = Math.sqrt(variance);
  const overallSleepConsistency = Math.max(0, 100 - stdDev * 20);

  historicalData.forEach((dayData) => {
    // Calculate daily steps
    const dailySteps = dayData.stepsData.reduce(
      (sum, sample) => sum + (sample.value || 0),
      0,
    );

    // Calculate daily heart rate average
    const restingHeartRate =
      dayData.heartRateData.length > 0
        ? dayData.heartRateData.reduce(
            (sum, sample) => sum + (sample.value || 0),
            0,
          ) / dayData.heartRateData.length
        : 0;

    // Calculate daily HRV average
    const heartRateVariability =
      dayData.hrvData.length > 0
        ? dayData.hrvData.reduce(
            (sum, sample) => sum + (sample.value || 0),
            0,
          ) / dayData.hrvData.length
        : 0;

    // Calculate sleep metrics for this day
    let totalSleep = 0;
    let totalDeepSleep = 0;
    let totalRemSleep = 0;

    dayData.sleepData.forEach((sample) => {
      const duration =
        (new Date(sample.endDate).getTime() -
          new Date(sample.startDate).getTime()) /
        (1000 * 60 * 60);
      totalSleep += duration;

      if (sample.value === "DEEP") {
        totalDeepSleep += duration;
      } else if (sample.value === "REM") {
        totalRemSleep += duration;
      }
    });

    const deepSleepPercentage =
      totalSleep > 0 ? (totalDeepSleep / totalSleep) * 100 : 0;
    const remSleepPercentage =
      totalSleep > 0 ? (totalRemSleep / totalSleep) * 100 : 0;

    // Find workout data for this day
    const dayWorkout = workoutData?.find(
      (workout) => workout.date.toDateString() === dayData.date.toDateString(),
    );

    // Create daily metrics
    const dailyMetrics: DailyHealthMetrics = {
      date: dayData.date,
      restingHeartRate: Math.round(restingHeartRate),
      heartRateVariability: Math.round(heartRateVariability),
      vo2Max: 0, // VO2Max is typically calculated less frequently
      deepSleepPercentage: Math.round(deepSleepPercentage * 10) / 10,
      remSleepPercentage: Math.round(remSleepPercentage * 10) / 10,
      sleepConsistency: Math.round(overallSleepConsistency),
      dailyTrainingTime: dayWorkout?.duration || 0,
      trainingIntensity: dayWorkout?.intensity || 0,
      dailySteps: dailySteps,
    };

    // Only calculate score if we have some meaningful data
    const hasData =
      dailySteps > 0 ||
      totalSleep > 0 ||
      restingHeartRate > 0 ||
      heartRateVariability > 0;
    if (hasData) {
      const dailyScore = calculateDailyFitnessScore(dailyMetrics);
      dailyScores.push(dailyScore);
    }
  });

  return dailyScores.sort((a, b) => b.date.getTime() - a.date.getTime());
}

/**
 * Calculate monthly average from daily fitness scores
 * This takes an array of daily scores and averages the POINTS, not the raw metrics
 */
export function calculateMonthlyAverageFromDailyScores(
  dailyScores: DailyFitnessScore[],
): MonthlyAverageResult {
  if (dailyScores.length === 0) {
    return {
      totalScore: 0,
      cardiovascularPoints: 0,
      recoveryPoints: 0,
      activityPoints: 0,
      bonusPoints: 0,
      fitnessLevel: "Zeit für Veränderung",
      dataPointsCount: 0,
      isEstimated: true,
      dailyScores: [],
    };
  }

  // Average the points from daily scores
  const avgCardiovascularPoints = Math.round(
    dailyScores.reduce((sum, score) => sum + score.cardiovascularPoints, 0) /
      dailyScores.length,
  );
  const avgRecoveryPoints = Math.round(
    dailyScores.reduce((sum, score) => sum + score.recoveryPoints, 0) /
      dailyScores.length,
  );
  const avgActivityPoints = Math.round(
    dailyScores.reduce((sum, score) => sum + score.activityPoints, 0) /
      dailyScores.length,
  );
  const avgBonusPoints = Math.round(
    dailyScores.reduce((sum, score) => sum + score.bonusPoints, 0) /
      dailyScores.length,
  );

  const totalScore =
    avgCardiovascularPoints +
    avgRecoveryPoints +
    avgActivityPoints +
    avgBonusPoints;
  const fitnessLevel = determineFitnessLevel(totalScore);

  return {
    totalScore,
    cardiovascularPoints: avgCardiovascularPoints,
    recoveryPoints: avgRecoveryPoints,
    activityPoints: avgActivityPoints,
    bonusPoints: avgBonusPoints,
    fitnessLevel,
    dataPointsCount: dailyScores.length,
    isEstimated: false,
    dailyScores,
  };
}

/**
 * Main function to calculate monthly average using new daily-first approach
 * This should be used instead of the old calculateMonthlyAverage for new implementations
 */
export async function calculateDailyBasedMonthlyAverage(
  healthService: any, // HealthService instance
  days: number = 30,
): Promise<MonthlyAverageResult> {
  try {
    // Get comprehensive historical data
    const { historicalData, workoutData } =
      await healthService.getComprehensiveHistoricalData(days);

    // Calculate daily scores
    const dailyScores = calculateDailyScoresFromHistoricalData(
      historicalData,
      workoutData,
    );

    // Calculate monthly average from daily scores
    return calculateMonthlyAverageFromDailyScores(dailyScores);
  } catch (error) {
    // Fallback to current metrics if historical data fails
    console.warn(
      "Failed to get historical data, using current metrics as fallback:",
      error,
    );

    try {
      const currentMetrics = await healthService.getAllHealthMetrics();
      const currentResult = await import("./fitnessCalculator").then((m) =>
        m.calculateFitnessScore(currentMetrics),
      );
      return {
        totalScore: currentResult.totalScore,
        cardiovascularPoints: currentResult.cardiovascularPoints,
        recoveryPoints: currentResult.recoveryPoints,
        activityPoints: currentResult.activityPoints,
        bonusPoints: currentResult.bonusPoints,
        fitnessLevel: currentResult.fitnessLevel,
        dataPointsCount: 1,
        isEstimated: true,
        dailyScores: [],
      };
    } catch (fallbackError) {
      // Ultimate fallback
      return {
        totalScore: 0,
        cardiovascularPoints: 0,
        recoveryPoints: 0,
        activityPoints: 0,
        bonusPoints: 0,
        fitnessLevel: "Zeit für Veränderung",
        dataPointsCount: 0,
        isEstimated: true,
        dailyScores: [],
      };
    }
  }
}
