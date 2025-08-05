/**
 * Health-related type definitions
 */

export interface HealthMetrics {
  // Cardiovascular Health
  restingHeartRate: number; // RHR in bpm
  heartRateVariability: number; // HRV in ms
  vo2Max: number;

  // Recovery & Regeneration
  deepSleepPercentage: number; // 0-100 (percentage)
  remSleepPercentage: number; // 0-100 (percentage)
  sleepConsistency: number; // 0-100 (consistency score)

  // Activity & Training
  monthlyTrainingTime: number; // in minutes
  trainingIntensity: number; // 0-100 (intensity score)
  dailySteps: number; // today's steps
}

export interface FitnessScoreResult {
  totalScore: number;
  cardiovascularPoints: number;
  recoveryPoints: number;
  activityPoints: number;
  bonusPoints: number;
  fitnessLevel: string;
  bonusBreakdown?: {
    cardiovascularPercent: number;
    recoveryPercent: number;
    activityPercent: number;
    excellentCategories: string[];
    requirementsExplanation: string;
  };
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
  }>;
}

export interface MonthlyAverageResult {
  totalScore: number;
  cardiovascularPoints: number;
  recoveryPoints: number;
  activityPoints: number;
  bonusPoints: number;
  fitnessLevel: string;
  dataPointsCount: number;
  isEstimated: boolean;
}
