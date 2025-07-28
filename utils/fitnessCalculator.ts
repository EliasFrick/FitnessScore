import { HistoryItem } from '@/contexts/HistoryContext';
import { HealthValue } from 'react-native-health';

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
  
  // 9. Daily Activity (Today's steps) - More realistic and stricter scoring
  let stepsPoints = 0;
  let stepsReason = '';
  if (metrics.dailySteps >= 12000) {
    stepsPoints = 10;
    stepsReason = `Outstanding daily activity (${metrics.dailySteps.toLocaleString()} steps) - exceptionally active lifestyle`;
  } else if (metrics.dailySteps >= 10000) {
    stepsPoints = 9;
    stepsReason = `Excellent daily activity (${metrics.dailySteps.toLocaleString()} steps) - very active lifestyle`;
  } else if (metrics.dailySteps >= 8000) {
    stepsPoints = 7;
    stepsReason = `Good daily activity (${metrics.dailySteps.toLocaleString()} steps) - active lifestyle`;
  } else if (metrics.dailySteps >= 6000) {
    stepsPoints = 5;
    stepsReason = `Moderate daily activity (${metrics.dailySteps.toLocaleString()} steps) - try to walk more throughout the day`;
  } else if (metrics.dailySteps >= 4000) {
    stepsPoints = 3;
    stepsReason = `Below average activity (${metrics.dailySteps.toLocaleString()} steps) - aim for more daily movement`;
  } else if (metrics.dailySteps >= 2000) {
    stepsPoints = 2;
    stepsReason = `Low daily activity (${metrics.dailySteps.toLocaleString()} steps) - significantly increase daily walking`;
  } else if (metrics.dailySteps >= 500) {
    stepsPoints = 1;
    stepsReason = `Very low daily activity (${metrics.dailySteps.toLocaleString()} steps) - start with small walks and build up`;
  } else {
    stepsPoints = 0;
    stepsReason = `Minimal daily activity (${metrics.dailySteps.toLocaleString()} steps) - urgent need to increase movement`;
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

// Generate sample historical data for demonstration
export function generateSampleHistoryData(): Array<{
  category: 'Cardiovascular Health' | 'Recovery & Regeneration' | 'Activity & Training' | 'Bonus Metric';
  metric: string;
  points: number;
  maxPoints: number;
  reason: string;
  timestamp: Date;
}> {
  const history: Array<{
    category: 'Cardiovascular Health' | 'Recovery & Regeneration' | 'Activity & Training' | 'Bonus Metric';
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
    const dailyVariation = Math.random() * 0.4 - 0.2; // -20% to +20% variation
    
    const mockMetrics: HealthMetrics = {
      restingHeartRate: 55 + Math.floor(Math.random() * 10 - 5), // 50-60
      heartRateVariability: 45 + Math.floor(Math.random() * 20 - 10), // 35-55
      vo2Max: 40 + Math.floor(Math.random() * 10 - 5), // 35-45
      deepSleepPercentage: 18 + Math.floor(Math.random() * 8 - 4), // 14-22
      remSleepPercentage: 22 + Math.floor(Math.random() * 8 - 4), // 18-26
      sleepConsistency: 75 + Math.floor(Math.random() * 20 - 10), // 65-85
      weeklyTrainingTime: 200 + Math.floor(Math.random() * 100 - 50), // 150-250
      trainingIntensity: 60 + Math.floor(Math.random() * 20 - 10), // 50-70
      dailySteps: 8500 + Math.floor(Math.random() * 3000 - 1500), // 7000-10000
    };

    const dayResult = calculateFitnessScore(mockMetrics);
    
    // Add each metric with the historical timestamp
    dayResult.historyItems.forEach(item => {
      history.push({
        ...item,
        timestamp: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000), // Random time during the day
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
    heartRateData: HealthValue[];
    hrvData: HealthValue[];
    sleepData: any[];
  }>
): Array<{
  category: 'Cardiovascular Health' | 'Recovery & Regeneration' | 'Activity & Training' | 'Bonus Metric';
  metric: string;
  points: number;
  maxPoints: number;
  reason: string;
  timestamp: Date;
}> {
  const historyItems: Array<{
    category: 'Cardiovascular Health' | 'Recovery & Regeneration' | 'Activity & Training' | 'Bonus Metric';
    metric: string;
    points: number;
    maxPoints: number;
    reason: string;
    timestamp: Date;
  }> = [];

  console.log(`Converting ${historicalData.length} days of historical data to history items`);

  let daysWithData = 0;
  let daysWithoutData = 0;

  historicalData.forEach((dayData, index) => {
    // Calculate daily steps average
    const dailySteps = dayData.stepsData.reduce((sum, sample) => sum + (sample.value || 0), 0);
    
    // Calculate daily heart rate average
    const avgHeartRate = dayData.heartRateData.length > 0 
      ? dayData.heartRateData.reduce((sum, sample) => sum + sample.value, 0) / dayData.heartRateData.length 
      : 0;
    
    // Calculate daily HRV average
    const avgHRV = dayData.hrvData.length > 0 
      ? dayData.hrvData.reduce((sum, sample) => sum + sample.value, 0) / dayData.hrvData.length 
      : 0;

    console.log(`Day ${index} (${dayData.date.toDateString()}): Steps=${dailySteps}, HR=${avgHeartRate}, HRV=${avgHRV}, Sleep samples=${dayData.sleepData.length}`);

    // Calculate sleep data (simplified)
    let totalSleep = 0;
    let totalDeepSleep = 0;
    let totalRemSleep = 0;

    dayData.sleepData.forEach(sample => {
      const duration = (new Date(sample.endDate).getTime() - new Date(sample.startDate).getTime()) / (1000 * 60 * 60);
      totalSleep += duration;
      
      if (sample.value === "DEEP") {
        totalDeepSleep += duration;
      } else if (sample.value === "REM") {
        totalRemSleep += duration;
      }
    });

    const deepSleepPercentage = totalSleep > 0 ? (totalDeepSleep / totalSleep) * 100 : 0;
    const remSleepPercentage = totalSleep > 0 ? (totalRemSleep / totalSleep) * 100 : 0;

    // Create metrics for this day
    const dayMetrics: HealthMetrics = {
      restingHeartRate: Math.round(avgHeartRate),
      heartRateVariability: Math.round(avgHRV),
      vo2Max: 0, // VO2Max is usually calculated less frequently
      deepSleepPercentage: Math.round(deepSleepPercentage * 10) / 10,
      remSleepPercentage: Math.round(remSleepPercentage * 10) / 10,
      sleepConsistency: 75, // Default value, would need more complex calculation
      weeklyTrainingTime: 0, // Would need workout data
      trainingIntensity: 0, // Would need workout data
      dailySteps: dailySteps,
    };

    // Only create history items for metrics that have actual data (not zeros)
    const dayResult = calculateFitnessScore(dayMetrics);
    
    dayResult.historyItems.forEach(item => {
      // Only add history items if the metric has meaningful data
      let shouldInclude = false;
      
      if (item.category === 'Activity & Training' && item.metric === 'Daily Steps' && dailySteps > 0) {
        shouldInclude = true;
      } else if (item.category === 'Cardiovascular Health') {
        if ((item.metric === 'Resting Heart Rate' && avgHeartRate > 0) ||
            (item.metric === 'Heart Rate Variability' && avgHRV > 0) ||
            (item.metric === 'VO2 Max' && dayMetrics.vo2Max > 0)) {
          shouldInclude = true;
        }
      } else if (item.category === 'Recovery & Regeneration' && totalSleep > 0) {
        shouldInclude = true;
      } else if (item.category === 'Activity & Training' && 
                 (item.metric === 'Weekly Training Time' || item.metric === 'Training Intensity') &&
                 (dayMetrics.weeklyTrainingTime > 0 || dayMetrics.trainingIntensity > 0)) {
        shouldInclude = true;
      } else if (item.category === 'Bonus Metric' && 
                 (dailySteps > 0 || avgHeartRate > 0 || avgHRV > 0 || totalSleep > 0)) {
        shouldInclude = true;
      }
      
      if (shouldInclude) {
        historyItems.push({
          ...item,
          timestamp: dayData.date,
        });
      }
    });

    const hasAnyData = dailySteps > 0 || avgHeartRate > 0 || avgHRV > 0 || totalSleep > 0;
    if (hasAnyData) {
      daysWithData++;
    } else {
      daysWithoutData++;
    }

    const itemsAdded = dayResult.historyItems.filter(item => {
      if (item.category === 'Activity & Training' && item.metric === 'Daily Steps') return dailySteps > 0;
      if (item.category === 'Cardiovascular Health' && item.metric === 'Resting Heart Rate') return avgHeartRate > 0;
      if (item.category === 'Cardiovascular Health' && item.metric === 'Heart Rate Variability') return avgHRV > 0;
      if (item.category === 'Recovery & Regeneration') return totalSleep > 0;
      return false;
    }).length;

    if (hasAnyData) {
      console.log(`Day ${index}: Added ${itemsAdded} out of ${dayResult.historyItems.length} possible history items`);
    }
  });

  console.log(`Summary: ${daysWithData} days with data, ${daysWithoutData} days without data. Generated ${historyItems.length} history items total.`);

  return historyItems;
}

export function calculateMonthlyAverage(
  historyItems: HistoryItem[], 
  currentMetrics: HealthMetrics
): MonthlyAverageResult {
  // Filter history items from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentHistory = historyItems.filter(
    item => item.timestamp >= thirtyDaysAgo
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
    'Cardiovascular Health': { points: 0, maxPoints: 0, count: 0 },
    'Recovery & Regeneration': { points: 0, maxPoints: 0, count: 0 },
    'Activity & Training': { points: 0, maxPoints: 0, count: 0 },
    'Bonus Metric': { points: 0, maxPoints: 0, count: 0 },
  };

  // Sum up points for each category
  recentHistory.forEach(item => {
    if (categoryTotals[item.category]) {
      categoryTotals[item.category].points += item.points;
      categoryTotals[item.category].maxPoints += item.maxPoints;
      categoryTotals[item.category].count += 1;
    }
  });

  // Calculate averages for each category based on actual average points achieved
  // Only calculate if we have data, otherwise use current metrics as fallback
  const cardiovascularPoints = categoryTotals['Cardiovascular Health'].count > 0 
    ? Math.round(categoryTotals['Cardiovascular Health'].points / categoryTotals['Cardiovascular Health'].count)
    : Math.round(calculateFitnessScore(currentMetrics).cardiovascularPoints);
  
  const recoveryPoints = categoryTotals['Recovery & Regeneration'].count > 0
    ? Math.round(categoryTotals['Recovery & Regeneration'].points / categoryTotals['Recovery & Regeneration'].count)
    : Math.round(calculateFitnessScore(currentMetrics).recoveryPoints);
  
  const activityPoints = categoryTotals['Activity & Training'].count > 0
    ? Math.round(categoryTotals['Activity & Training'].points / categoryTotals['Activity & Training'].count)
    : Math.round(calculateFitnessScore(currentMetrics).activityPoints);
  
  const bonusPoints = categoryTotals['Bonus Metric'].count > 0
    ? Math.round(categoryTotals['Bonus Metric'].points / categoryTotals['Bonus Metric'].count)
    : Math.round(calculateFitnessScore(currentMetrics).bonusPoints);

  const totalScore = cardiovascularPoints + recoveryPoints + activityPoints + bonusPoints;

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