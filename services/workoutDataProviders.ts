/**
 * Workout Data Providers
 * Methods for fetching and processing workout data
 */

import { NativeModules, Platform } from "react-native";
import AppleHealthKit, {
  HealthInputOptions,
} from "react-native-health";

/**
 * Get monthly workout data (last 30 days)
 */
export async function getMonthlyWorkoutData(): Promise<{
  monthlyTrainingTime: number;
  trainingIntensity: number;
}> {
  if (Platform.OS !== "ios") {
    return { monthlyTrainingTime: 0, trainingIntensity: 0 };
  }

  return new Promise((resolve) => {
    const options = {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString(),
    };

    (AppleHealthKit as any).getAnchoredWorkouts(
      options,
      (callbackError: string, results: any) => {
        if (callbackError) {
          resolve({ monthlyTrainingTime: 0, trainingIntensity: 0 });
        } else {
          let totalDuration = 0;
          let totalCalories = 0;
          let workoutCount = 0;
          let highIntensityWorkouts = 0;

          const workouts = results.data || results || [];
          
          if (!Array.isArray(workouts) || workouts.length === 0) {
            resolve({ monthlyTrainingTime: 0, trainingIntensity: 0 });
            return;
          }

          workouts.forEach((workout: any) => {
            if (!workout || !workout.end || !workout.start) {
              return;
            }

            const duration = workout.duration / 60; // Convert seconds to minutes
            
            if (duration > 0 && !isNaN(duration)) {
              totalDuration += duration;
              totalCalories += workout.calories || 0;
              workoutCount++;

              // Consider high intensity based on workout type and calories per minute
              const caloriesPerMinute = (workout.calories || 0) / Math.max(duration, 1);
              const activityName = workout.activityName || "";

              if (
                caloriesPerMinute > 8 ||
                [
                  "Running",
                  "Cycling",
                  "Swimming",
                  "HIIT",
                  "CrossTraining",
                  "TraditionalStrengthTraining",
                ].includes(activityName)
              ) {
                highIntensityWorkouts++;
              }
            }
          });

          const monthlyTrainingTime =
            totalDuration > 0 && !isNaN(totalDuration)
              ? Math.round(totalDuration)
              : 0;

          // Calculate intensity score
          const averageCaloriesPerMinute =
            workoutCount > 0 && totalDuration > 0
              ? totalCalories / totalDuration
              : 0;
          const highIntensityRatio =
            workoutCount > 0 ? highIntensityWorkouts / workoutCount : 0;
          const frequencyBonus = Math.min(workoutCount * 5, 20);

          const safeAvgCaloriesPerMinute = isNaN(averageCaloriesPerMinute) ? 0 : averageCaloriesPerMinute;
          const safeHighIntensityRatio = isNaN(highIntensityRatio) ? 0 : highIntensityRatio;
          const safeFrequencyBonus = isNaN(frequencyBonus) ? 0 : frequencyBonus;

          const baseIntensity = safeAvgCaloriesPerMinute * 5;
          const intensityBonus = safeHighIntensityRatio * 30;
          const rawIntensityScore = baseIntensity + intensityBonus + safeFrequencyBonus;

          const trainingIntensity = isNaN(rawIntensityScore)
            ? 0
            : Math.min(100, Math.max(0, Math.round(rawIntensityScore)));

          resolve({
            monthlyTrainingTime,
            trainingIntensity,
          });
        }
      }
    );
  });
}

/**
 * Get today's specific training data
 */
export async function getTodaysWorkoutData(): Promise<{
  dailyTrainingTime: number;
  trainingIntensity: number;
}> {
  if (Platform.OS !== "ios") {
    return { dailyTrainingTime: 0, trainingIntensity: 0 };
  }

  return new Promise((resolve) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const options = {
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
    };

    (AppleHealthKit as any).getAnchoredWorkouts(
      options,
      (callbackError: string, results: any) => {
        if (callbackError) {
          resolve({ dailyTrainingTime: 0, trainingIntensity: 0 });
        } else {
          const workouts = results.data || results || [];
          
          if (!Array.isArray(workouts) || workouts.length === 0) {
            resolve({ dailyTrainingTime: 0, trainingIntensity: 0 });
            return;
          }

          let totalDuration = 0;
          let totalCalories = 0;
          let workoutCount = 0;
          let highIntensityWorkouts = 0;

          workouts.forEach((workout: any) => {
            if (!workout || !workout.end || !workout.start) {
              return;
            }

            const duration = workout.duration / 60; // Convert seconds to minutes
            
            if (duration > 0 && !isNaN(duration)) {
              totalDuration += duration;
              totalCalories += workout.calories || 0;
              workoutCount++;

              const caloriesPerMinute = (workout.calories || 0) / Math.max(duration, 1);
              const activityName = workout.activityName || "";

              if (
                caloriesPerMinute > 8 ||
                [
                  "Running",
                  "Cycling", 
                  "Swimming",
                  "HIIT",
                  "CrossTraining",
                  "TraditionalStrengthTraining",
                ].includes(activityName)
              ) {
                highIntensityWorkouts++;
              }
            }
          });

          const dailyTrainingTime = Math.round(totalDuration);

          // Calculate intensity for today's workouts
          const averageCaloriesPerMinute = workoutCount > 0 && totalDuration > 0
            ? totalCalories / totalDuration
            : 0;
          const highIntensityRatio = workoutCount > 0 ? highIntensityWorkouts / workoutCount : 0;
          const frequencyBonus = Math.min(workoutCount * 10, 20); // Bonus for having workouts today

          const baseIntensity = averageCaloriesPerMinute * 5;
          const intensityBonus = highIntensityRatio * 30;
          const rawIntensityScore = baseIntensity + intensityBonus + frequencyBonus;

          const trainingIntensity = isNaN(rawIntensityScore)
            ? 0
            : Math.min(100, Math.max(0, Math.round(rawIntensityScore)));

          resolve({
            dailyTrainingTime,
            trainingIntensity,
          });
        }
      }
    );
  });
}