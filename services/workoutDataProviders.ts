/**
 * Workout Data Providers
 * Methods for fetching and processing workout data
 */

import { Platform } from "react-native";
import AppleHealthKit from "react-native-health";

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
          let highIntensityMinutes = 0;

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
              const caloriesPerMinute =
                (workout.calories || 0) / Math.max(duration, 1);
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
                highIntensityMinutes += duration;
              }
            }
          });

          const monthlyTrainingTime =
            totalDuration > 0 && !isNaN(totalDuration)
              ? Math.round(totalDuration)
              : 0;

          const trainingIntensity = Math.round(highIntensityMinutes) / 30;

          resolve({
            monthlyTrainingTime,
            trainingIntensity,
          });
        }
      },
    );
  });
}
