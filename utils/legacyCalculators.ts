/**
 * Legacy calculation functions for backward compatibility
 */

import { HistoryItem } from "@/contexts/HistoryContext";
import { HealthValue } from "react-native-health";
import { HealthMetrics, MonthlyAverageResult, FitnessScoreResult } from '@/types/health';

// Generate sample historical data for demonstration
export function generateSampleHistoryData(
  calculateFitnessScore: (metrics: HealthMetrics) => FitnessScoreResult
): Array<{
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
}> {
  const history: Array<{
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
  }> = [];

  // Generate data for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Generate varying health metrics for each day
    const mockMetrics: HealthMetrics = {
      restingHeartRate: 65 + Math.floor(Math.random() * 20 - 10), // 55-75
      heartRateVariability: 30 + Math.floor(Math.random() * 20 - 10), // 20-40
      vo2Max: 40 + Math.floor(Math.random() * 10 - 5), // 35-45
      deepSleepPercentage: 18 + Math.floor(Math.random() * 8 - 4), // 14-22
      remSleepPercentage: 22 + Math.floor(Math.random() * 8 - 4), // 18-26
      sleepConsistency: 75 + Math.floor(Math.random() * 20 - 10), // 65-85
      monthlyTrainingTime: 800 + Math.floor(Math.random() * 400 - 200), // 600-1000
      trainingIntensity: 60 + Math.floor(Math.random() * 20 - 10), // 50-70
      dailySteps: 8500 + Math.floor(Math.random() * 3000 - 1500), // 7000-10000
    };

    const dayResult = calculateFitnessScore(mockMetrics);

    // Add each metric with the historical timestamp
    dayResult.historyItems.forEach((item) => {
      history.push({
        ...item,
        timestamp: new Date(
          date.getTime() + Math.random() * 24 * 60 * 60 * 1000
        ), // Random time during the day
      });
    });
  }

  return history;
}

// Convert historical health data to history items
export function convertHistoricalDataToHistoryItems(
  historicalData: Array<{
    date: Date;
    stepsData: HealthValue[];
    sleepData: any[];
  }>,
  calculateFitnessScore: (metrics: HealthMetrics) => FitnessScoreResult
): Array<{
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
}> {
  const historyItems: Array<{
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
  }> = [];

  let daysWithData = 0;
  let daysWithoutData = 0;

  historicalData.forEach((dayData) => {
    // Calculate daily steps average
    const dailySteps = dayData.stepsData.reduce(
      (sum, sample) => sum + (sample.value || 0),
      0
    );

    // Calculate sleep data (simplified)
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

    // Create metrics for this day
    const dayMetrics: HealthMetrics = {
      restingHeartRate: 0, // RHR is usually calculated less frequently
      heartRateVariability: 0, // HRV is usually calculated less frequently
      vo2Max: 0, // VO2Max is usually calculated less frequently
      deepSleepPercentage: Math.round(deepSleepPercentage * 10) / 10,
      remSleepPercentage: Math.round(remSleepPercentage * 10) / 10,
      sleepConsistency: 75, // Default value, would need more complex calculation
      monthlyTrainingTime: 0, // Would need workout data
      trainingIntensity: 0, // Would need workout data
      dailySteps: dailySteps,
    };

    // Only create history items for metrics that have actual data (not zeros)
    const dayResult = calculateFitnessScore(dayMetrics);

    dayResult.historyItems.forEach((item) => {
      // Only add history items if the metric has meaningful data
      let shouldInclude = false;

      if (
        item.category === "Activity & Training" &&
        item.metric === "Daily Steps" &&
        dailySteps > 0
      ) {
        shouldInclude = true;
      } else if (item.category === "Cardiovascular Health") {
        if (
          (item.metric === "Resting Heart Rate" &&
            dayMetrics.restingHeartRate > 0) ||
          (item.metric === "Heart Rate Variability" &&
            dayMetrics.heartRateVariability > 0) ||
          (item.metric === "VO2 Max" && dayMetrics.vo2Max > 0)
        ) {
          shouldInclude = true;
        }
      } else if (
        item.category === "Recovery & Regeneration" &&
        totalSleep > 0
      ) {
        shouldInclude = true;
      } else if (
        item.category === "Activity & Training" &&
        (item.metric === "Monthly Training Time" ||
          item.metric === "Training Intensity") &&
        (dayMetrics.monthlyTrainingTime > 0 || dayMetrics.trainingIntensity > 0)
      ) {
        shouldInclude = true;
      } else if (item.category === "Bonus Metric") {
        // Always include bonus metric for transparency
        shouldInclude = true;
      }

      if (shouldInclude) {
        historyItems.push({
          ...item,
          timestamp: dayData.date,
        });
      }
    });

    const hasAnyData = dailySteps > 0 || totalSleep > 0;
    if (hasAnyData) {
      daysWithData++;
    } else {
      daysWithoutData++;
    }

    // Track items that would be added for statistics
    dayResult.historyItems.filter((item) => {
      if (
        item.category === "Activity & Training" &&
        item.metric === "Daily Steps"
      )
        return dailySteps > 0;
      if (item.category === "Cardiovascular Health") {
        return (
          (item.metric === "Resting Heart Rate" &&
            dayMetrics.restingHeartRate > 0) ||
          (item.metric === "Heart Rate Variability" &&
            dayMetrics.heartRateVariability > 0) ||
          (item.metric === "VO2 Max" && dayMetrics.vo2Max > 0)
        );
      }
      if (item.category === "Recovery & Regeneration") return totalSleep > 0;
      return false;
    }).length;
  });

  return historyItems;
}

/**
 * Legacy function for backward compatibility
 * This maintains the old behavior for existing code
 */
export function calculateMonthlyAverage(
  historyItems: HistoryItem[],
  currentMetrics: HealthMetrics,
  calculateFitnessScore: (metrics: HealthMetrics) => FitnessScoreResult
): MonthlyAverageResult {
  // Filter history items from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentHistory = historyItems.filter(
    (item) => item.timestamp >= thirtyDaysAgo
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
            categoryTotals["Cardiovascular Health"].count
        )
      : Math.round(calculateFitnessScore(currentMetrics).cardiovascularPoints);

  const recoveryPoints =
    categoryTotals["Recovery & Regeneration"].count > 0
      ? Math.round(
          categoryTotals["Recovery & Regeneration"].points /
            categoryTotals["Recovery & Regeneration"].count
        )
      : Math.round(calculateFitnessScore(currentMetrics).recoveryPoints);

  const activityPoints =
    categoryTotals["Activity & Training"].count > 0
      ? Math.round(
          categoryTotals["Activity & Training"].points /
            categoryTotals["Activity & Training"].count
        )
      : Math.round(calculateFitnessScore(currentMetrics).activityPoints);

  const bonusPoints =
    categoryTotals["Bonus Metric"].count > 0
      ? Math.round(
          categoryTotals["Bonus Metric"].points /
            categoryTotals["Bonus Metric"].count
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