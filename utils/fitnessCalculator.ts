export interface HealthMetrics {
  // Cardiovascular Health
  restingHeartRate: number;
  heartRateVariability: number; // SDNN
  vo2Max: number;
  
  // Recovery & Regeneration
  deepSleepPercentage: number; // 0-100 (percentage)
  remSleepPercentage: number; // 0-100 (percentage)
  sleepConsistency: number; // 0-100 (consistency score)
  
  // Activity & Training
  weeklyTrainingTime: number; // in minutes
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
}

export function calculateFitnessScore(metrics: HealthMetrics): FitnessScoreResult {
  let totalScore = 0;
  
  // A. Cardiovascular Health (Max 30 Points)
  let cardiovascularPoints = 0;
  
  // 1. Resting Heart Rate (RHR)
  if (metrics.restingHeartRate < 50) {
    cardiovascularPoints += 10;
  } else if (metrics.restingHeartRate >= 50 && metrics.restingHeartRate <= 59) {
    cardiovascularPoints += 8;
  } else if (metrics.restingHeartRate >= 60 && metrics.restingHeartRate <= 69) {
    cardiovascularPoints += 6;
  } else if (metrics.restingHeartRate >= 70 && metrics.restingHeartRate <= 79) {
    cardiovascularPoints += 4;
  } else {
    cardiovascularPoints += 2;
  }
  
  // 2. Heart Rate Variability (HRV - SDNN)
  if (metrics.heartRateVariability > 60) {
    cardiovascularPoints += 10;
  } else if (metrics.heartRateVariability >= 40 && metrics.heartRateVariability <= 59) {
    cardiovascularPoints += 8;
  } else if (metrics.heartRateVariability >= 20 && metrics.heartRateVariability <= 39) {
    cardiovascularPoints += 6;
  } else {
    cardiovascularPoints += 4;
  }
  
  // 3. VO2 Max (estimated)
  if (metrics.vo2Max > 45) {
    cardiovascularPoints += 10;
  } else if (metrics.vo2Max >= 35 && metrics.vo2Max <= 44) {
    cardiovascularPoints += 8;
  } else if (metrics.vo2Max >= 25 && metrics.vo2Max <= 34) {
    cardiovascularPoints += 6;
  } else {
    cardiovascularPoints += 4;
  }
  
  totalScore += cardiovascularPoints;
  
  // B. Recovery & Regeneration (Max 35 Points)
  let recoveryPoints = 0;
  
  // 4. Deep Sleep Percentage
  if (metrics.deepSleepPercentage > 20) {
    recoveryPoints += 15; // > 20%
  } else if (metrics.deepSleepPercentage >= 15 && metrics.deepSleepPercentage <= 20) {
    recoveryPoints += 12; // 15-20%
  } else if (metrics.deepSleepPercentage >= 10 && metrics.deepSleepPercentage <= 14) {
    recoveryPoints += 9; // 10-14%
  } else {
    recoveryPoints += 6; // < 10%
  }
  
  // 5. REM Sleep Percentage
  if (metrics.remSleepPercentage > 20) {
    recoveryPoints += 10; // > 20%
  } else if (metrics.remSleepPercentage >= 15 && metrics.remSleepPercentage <= 20) {
    recoveryPoints += 8; // 15-20%
  } else if (metrics.remSleepPercentage >= 10 && metrics.remSleepPercentage <= 14) {
    recoveryPoints += 6; // 10-14%
  } else {
    recoveryPoints += 4; // < 10%
  }
  
  // 6. Sleep Consistency (0-100 score)
  if (metrics.sleepConsistency > 80) {
    recoveryPoints += 10;
  } else if (metrics.sleepConsistency >= 60 && metrics.sleepConsistency <= 80) {
    recoveryPoints += 8;
  } else {
    recoveryPoints += 5;
  }
  
  totalScore += recoveryPoints;
  
  // C. Activity & Training (Max 30 Points)
  let activityPoints = 0;
  
  // 7. Weekly Training Time (in minutes)
  if (metrics.weeklyTrainingTime > 240) {
    activityPoints += 10;
  } else if (metrics.weeklyTrainingTime >= 180 && metrics.weeklyTrainingTime <= 240) {
    activityPoints += 8;
  } else if (metrics.weeklyTrainingTime >= 120 && metrics.weeklyTrainingTime <= 179) {
    activityPoints += 6;
  } else if (metrics.weeklyTrainingTime >= 60 && metrics.weeklyTrainingTime <= 119) {
    activityPoints += 4;
  } else {
    activityPoints += 2;
  }
  
  // 8. Training Intensity (0-100 score)
  if (metrics.trainingIntensity >= 80) {
    activityPoints += 10;
  } else if (metrics.trainingIntensity >= 60 && metrics.trainingIntensity <= 79) {
    activityPoints += 8;
  } else if (metrics.trainingIntensity >= 40 && metrics.trainingIntensity <= 59) {
    activityPoints += 6;
  } else {
    activityPoints += 4;
  }
  
  // 9. Daily Activity (Today's steps)
  if (metrics.dailySteps > 10000) {
    activityPoints += 10;
  } else if (metrics.dailySteps >= 7500 && metrics.dailySteps <= 10000) {
    activityPoints += 8;
  } else if (metrics.dailySteps >= 5000 && metrics.dailySteps <= 7499) {
    activityPoints += 6;
  } else {
    activityPoints += 4;
  }
  
  totalScore += activityPoints;
  
  // D. Bonus Metric (Max 5 Points)
  let bonusPoints = 0;
  
  // 10. Overall Consistency
  const cardiovascularPercent = (cardiovascularPoints / 30) * 100;
  const recoveryPercent = (recoveryPoints / 35) * 100;
  const activityPercent = (activityPoints / 30) * 100;
  
  if (cardiovascularPercent >= 75 && recoveryPercent >= 75 && activityPercent >= 75) {
    bonusPoints = 5;
  } else if (
    (cardiovascularPercent >= 75 && recoveryPercent >= 75) ||
    (cardiovascularPercent >= 75 && activityPercent >= 75) ||
    (recoveryPercent >= 75 && activityPercent >= 75)
  ) {
    bonusPoints = 3;
  }
  
  totalScore += bonusPoints;
  
  // Determine Fitness Level
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
  };
}

// Example/mock data for demonstration
export function getMockHealthMetrics(): HealthMetrics {
  return {
    restingHeartRate: 55,
    heartRateVariability: 45,
    vo2Max: 40,
    deepSleepPercentage: 18,
    remSleepPercentage: 22,
    sleepConsistency: 75,
    weeklyTrainingTime: 200,
    trainingIntensity: 60,
    dailySteps: 8500,
  };
}

// Zero health metrics for no-data state
export function getZeroHealthMetrics(): HealthMetrics {
  return {
    restingHeartRate: 0,
    heartRateVariability: 0,
    vo2Max: 0,
    deepSleepPercentage: 0,
    remSleepPercentage: 0,
    sleepConsistency: 0,
    weeklyTrainingTime: 0,
    trainingIntensity: 0,
    dailySteps: 0,
  };
}