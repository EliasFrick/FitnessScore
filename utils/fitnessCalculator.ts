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
  historyItems: Array<{
    category: 'Cardiovascular Health' | 'Recovery & Regeneration' | 'Activity & Training' | 'Bonus Metric';
    metric: string;
    points: number;
    maxPoints: number;
    reason: string;
  }>;
}

export function calculateFitnessScore(metrics: HealthMetrics): FitnessScoreResult {
  let totalScore = 0;
  const historyItems: Array<{
    category: 'Cardiovascular Health' | 'Recovery & Regeneration' | 'Activity & Training' | 'Bonus Metric';
    metric: string;
    points: number;
    maxPoints: number;
    reason: string;
  }> = [];
  
  // A. Cardiovascular Health (Max 30 Points)
  let cardiovascularPoints = 0;
  
  // 1. Resting Heart Rate (RHR)
  let rhrPoints = 0;
  let rhrReason = '';
  if (metrics.restingHeartRate < 50) {
    rhrPoints = 10;
    rhrReason = `Excellent resting heart rate (${metrics.restingHeartRate} bpm) - indicates superior cardiovascular fitness`;
  } else if (metrics.restingHeartRate >= 50 && metrics.restingHeartRate <= 59) {
    rhrPoints = 8;
    rhrReason = `Good resting heart rate (${metrics.restingHeartRate} bpm) - shows good cardiovascular health`;
  } else if (metrics.restingHeartRate >= 60 && metrics.restingHeartRate <= 69) {
    rhrPoints = 6;
    rhrReason = `Average resting heart rate (${metrics.restingHeartRate} bpm) - room for improvement`;
  } else if (metrics.restingHeartRate >= 70 && metrics.restingHeartRate <= 79) {
    rhrPoints = 4;
    rhrReason = `Elevated resting heart rate (${metrics.restingHeartRate} bpm) - consider more cardio training`;
  } else {
    rhrPoints = 2;
    rhrReason = `High resting heart rate (${metrics.restingHeartRate} bpm) - focus on cardiovascular improvement`;
  }
  cardiovascularPoints += rhrPoints;
  historyItems.push({
    category: 'Cardiovascular Health',
    metric: 'Resting Heart Rate',
    points: rhrPoints,
    maxPoints: 10,
    reason: rhrReason,
  });
  
  // 2. Heart Rate Variability (HRV - SDNN)
  let hrvPoints = 0;
  let hrvReason = '';
  if (metrics.heartRateVariability > 60) {
    hrvPoints = 10;
    hrvReason = `Excellent HRV (${metrics.heartRateVariability}ms) - excellent stress recovery and autonomic balance`;
  } else if (metrics.heartRateVariability >= 40 && metrics.heartRateVariability <= 59) {
    hrvPoints = 8;
    hrvReason = `Good HRV (${metrics.heartRateVariability}ms) - good stress recovery ability`;
  } else if (metrics.heartRateVariability >= 20 && metrics.heartRateVariability <= 39) {
    hrvPoints = 6;
    hrvReason = `Average HRV (${metrics.heartRateVariability}ms) - focus on stress management and recovery`;
  } else {
    hrvPoints = 4;
    hrvReason = `Low HRV (${metrics.heartRateVariability}ms) - prioritize recovery and stress reduction`;
  }
  cardiovascularPoints += hrvPoints;
  historyItems.push({
    category: 'Cardiovascular Health',
    metric: 'Heart Rate Variability',
    points: hrvPoints,
    maxPoints: 10,
    reason: hrvReason,
  });
  
  // 3. VO2 Max (estimated)
  let vo2Points = 0;
  let vo2Reason = '';
  if (metrics.vo2Max > 45) {
    vo2Points = 10;
    vo2Reason = `Excellent VO2 Max (${metrics.vo2Max} ml/kg/min) - superior aerobic fitness`;
  } else if (metrics.vo2Max >= 35 && metrics.vo2Max <= 44) {
    vo2Points = 8;
    vo2Reason = `Good VO2 Max (${metrics.vo2Max} ml/kg/min) - good aerobic capacity`;
  } else if (metrics.vo2Max >= 25 && metrics.vo2Max <= 34) {
    vo2Points = 6;
    vo2Reason = `Average VO2 Max (${metrics.vo2Max} ml/kg/min) - increase cardio training intensity`;
  } else {
    vo2Points = 4;
    vo2Reason = `Low VO2 Max (${metrics.vo2Max} ml/kg/min) - focus on building aerobic endurance`;
  }
  cardiovascularPoints += vo2Points;
  historyItems.push({
    category: 'Cardiovascular Health',
    metric: 'VO2 Max',
    points: vo2Points,
    maxPoints: 10,
    reason: vo2Reason,
  });
  
  totalScore += cardiovascularPoints;
  
  // B. Recovery & Regeneration (Max 35 Points)
  let recoveryPoints = 0;
  
  // 4. Deep Sleep Percentage
  let deepSleepPoints = 0;
  let deepSleepReason = '';
  if (metrics.deepSleepPercentage > 20) {
    deepSleepPoints = 15;
    deepSleepReason = `Excellent deep sleep (${metrics.deepSleepPercentage}%) - optimal physical recovery`;
  } else if (metrics.deepSleepPercentage >= 15 && metrics.deepSleepPercentage <= 20) {
    deepSleepPoints = 12;
    deepSleepReason = `Good deep sleep (${metrics.deepSleepPercentage}%) - adequate physical recovery`;
  } else if (metrics.deepSleepPercentage >= 10 && metrics.deepSleepPercentage <= 14) {
    deepSleepPoints = 9;
    deepSleepReason = `Average deep sleep (${metrics.deepSleepPercentage}%) - improve sleep environment and routine`;
  } else {
    deepSleepPoints = 6;
    deepSleepReason = `Low deep sleep (${metrics.deepSleepPercentage}%) - focus on sleep quality improvement`;
  }
  recoveryPoints += deepSleepPoints;
  historyItems.push({
    category: 'Recovery & Regeneration',
    metric: 'Deep Sleep',
    points: deepSleepPoints,
    maxPoints: 15,
    reason: deepSleepReason,
  });
  
  // 5. REM Sleep Percentage
  let remSleepPoints = 0;
  let remSleepReason = '';
  if (metrics.remSleepPercentage > 20) {
    remSleepPoints = 10;
    remSleepReason = `Excellent REM sleep (${metrics.remSleepPercentage}%) - optimal mental recovery and memory consolidation`;
  } else if (metrics.remSleepPercentage >= 15 && metrics.remSleepPercentage <= 20) {
    remSleepPoints = 8;
    remSleepReason = `Good REM sleep (${metrics.remSleepPercentage}%) - adequate mental recovery`;
  } else if (metrics.remSleepPercentage >= 10 && metrics.remSleepPercentage <= 14) {
    remSleepPoints = 6;
    remSleepReason = `Average REM sleep (${metrics.remSleepPercentage}%) - reduce stress and screen time before bed`;
  } else {
    remSleepPoints = 4;
    remSleepReason = `Low REM sleep (${metrics.remSleepPercentage}%) - address sleep disturbances and stress levels`;
  }
  recoveryPoints += remSleepPoints;
  historyItems.push({
    category: 'Recovery & Regeneration',
    metric: 'REM Sleep',
    points: remSleepPoints,
    maxPoints: 10,
    reason: remSleepReason,
  });
  
  // 6. Sleep Consistency (0-100 score)
  let sleepConsistencyPoints = 0;
  let sleepConsistencyReason = '';
  if (metrics.sleepConsistency > 80) {
    sleepConsistencyPoints = 10;
    sleepConsistencyReason = `Excellent sleep consistency (${metrics.sleepConsistency}%) - regular sleep schedule optimizes recovery`;
  } else if (metrics.sleepConsistency >= 60 && metrics.sleepConsistency <= 80) {
    sleepConsistencyPoints = 8;
    sleepConsistencyReason = `Good sleep consistency (${metrics.sleepConsistency}%) - maintain regular bedtime routine`;
  } else {
    sleepConsistencyPoints = 5;
    sleepConsistencyReason = `Poor sleep consistency (${metrics.sleepConsistency}%) - establish a regular sleep schedule`;
  }
  recoveryPoints += sleepConsistencyPoints;
  historyItems.push({
    category: 'Recovery & Regeneration',
    metric: 'Sleep Consistency',
    points: sleepConsistencyPoints,
    maxPoints: 10,
    reason: sleepConsistencyReason,
  });
  
  totalScore += recoveryPoints;
  
  // C. Activity & Training (Max 30 Points)
  let activityPoints = 0;
  
  // 7. Weekly Training Time (in minutes)
  let trainingTimePoints = 0;
  let trainingTimeReason = '';
  if (metrics.weeklyTrainingTime > 240) {
    trainingTimePoints = 10;
    trainingTimeReason = `Excellent training volume (${Math.round(metrics.weeklyTrainingTime)} min/week) - great commitment to fitness`;
  } else if (metrics.weeklyTrainingTime >= 180 && metrics.weeklyTrainingTime <= 240) {
    trainingTimePoints = 8;
    trainingTimeReason = `Good training volume (${Math.round(metrics.weeklyTrainingTime)} min/week) - solid fitness routine`;
  } else if (metrics.weeklyTrainingTime >= 120 && metrics.weeklyTrainingTime <= 179) {
    trainingTimePoints = 6;
    trainingTimeReason = `Moderate training volume (${Math.round(metrics.weeklyTrainingTime)} min/week) - consider increasing frequency`;
  } else if (metrics.weeklyTrainingTime >= 60 && metrics.weeklyTrainingTime <= 119) {
    trainingTimePoints = 4;
    trainingTimeReason = `Low training volume (${Math.round(metrics.weeklyTrainingTime)} min/week) - aim for more consistent training`;
  } else {
    trainingTimePoints = 2;
    trainingTimeReason = `Very low training volume (${Math.round(metrics.weeklyTrainingTime)} min/week) - start with short, regular sessions`;
  }
  activityPoints += trainingTimePoints;
  historyItems.push({
    category: 'Activity & Training',
    metric: 'Weekly Training Time',
    points: trainingTimePoints,
    maxPoints: 10,
    reason: trainingTimeReason,
  });
  
  // 8. Training Intensity (0-100 score)
  let intensityPoints = 0;
  let intensityReason = '';
  if (metrics.trainingIntensity >= 80) {
    intensityPoints = 10;
    intensityReason = `High training intensity (${metrics.trainingIntensity}%) - excellent workout quality and effort`;
  } else if (metrics.trainingIntensity >= 60 && metrics.trainingIntensity <= 79) {
    intensityPoints = 8;
    intensityReason = `Good training intensity (${metrics.trainingIntensity}%) - effective workout sessions`;
  } else if (metrics.trainingIntensity >= 40 && metrics.trainingIntensity <= 59) {
    intensityPoints = 6;
    intensityReason = `Moderate training intensity (${metrics.trainingIntensity}%) - push yourself harder during workouts`;
  } else {
    intensityPoints = 4;
    intensityReason = `Low training intensity (${metrics.trainingIntensity}%) - focus on challenging yourself more`;
  }
  activityPoints += intensityPoints;
  historyItems.push({
    category: 'Activity & Training',
    metric: 'Training Intensity',
    points: intensityPoints,
    maxPoints: 10,
    reason: intensityReason,
  });
  
  // 9. Daily Activity (Today's steps)
  let stepsPoints = 0;
  let stepsReason = '';
  if (metrics.dailySteps > 10000) {
    stepsPoints = 10;
    stepsReason = `Excellent daily activity (${metrics.dailySteps.toLocaleString()} steps) - very active lifestyle`;
  } else if (metrics.dailySteps >= 7500 && metrics.dailySteps <= 10000) {
    stepsPoints = 8;
    stepsReason = `Good daily activity (${metrics.dailySteps.toLocaleString()} steps) - active lifestyle`;
  } else if (metrics.dailySteps >= 5000 && metrics.dailySteps <= 7499) {
    stepsPoints = 6;
    stepsReason = `Moderate daily activity (${metrics.dailySteps.toLocaleString()} steps) - try to walk more throughout the day`;
  } else {
    stepsPoints = 4;
    stepsReason = `Low daily activity (${metrics.dailySteps.toLocaleString()} steps) - increase daily movement and walking`;
  }
  activityPoints += stepsPoints;
  historyItems.push({
    category: 'Activity & Training',
    metric: 'Daily Steps',
    points: stepsPoints,
    maxPoints: 10,
    reason: stepsReason,
  });
  
  totalScore += activityPoints;
  
  // D. Bonus Metric (Max 5 Points)
  let bonusPoints = 0;
  
  // 10. Overall Consistency
  const cardiovascularPercent = (cardiovascularPoints / 30) * 100;
  const recoveryPercent = (recoveryPoints / 35) * 100;
  const activityPercent = (activityPoints / 30) * 100;
  
  let bonusReason = '';
  if (cardiovascularPercent >= 75 && recoveryPercent >= 75 && activityPercent >= 75) {
    bonusPoints = 5;
    bonusReason = 'Outstanding overall consistency - excelling in all health categories';
  } else if (
    (cardiovascularPercent >= 75 && recoveryPercent >= 75) ||
    (cardiovascularPercent >= 75 && activityPercent >= 75) ||
    (recoveryPercent >= 75 && activityPercent >= 75)
  ) {
    bonusPoints = 3;
    bonusReason = 'Good consistency - strong performance in multiple health categories';
  } else {
    bonusPoints = 0;
    bonusReason = 'Focus on improving consistency across all health categories for bonus points';
  }
  
  if (bonusPoints > 0) {
    historyItems.push({
      category: 'Bonus Metric',
      metric: 'Overall Consistency',
      points: bonusPoints,
      maxPoints: 5,
      reason: bonusReason,
    });
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
    historyItems,
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