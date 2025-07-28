/**
 * Historical Data Providers
 * Methods for fetching historical health data for trend analysis
 */

import { Platform } from "react-native";
import AppleHealthKit, {
  HealthInputOptions,
  HealthValue,
} from "react-native-health";

/**
 * Get historical step data for specified number of days
 */
export async function getHistoricalStepsData(days: number = 30): Promise<HealthValue[]> {
  if (Platform.OS !== "ios") return [];

  const stepsData: HealthValue[] = [];

  // Get daily step counts for each day
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    try {
      const dailySteps = await new Promise<number>((resolve) => {
        const options: HealthInputOptions = {
          date: date.toISOString(),
        };

        AppleHealthKit.getStepCount(
          options,
          (callbackError: string, results: HealthValue) => {
            if (callbackError) {
              resolve(0);
            } else {
              resolve(results?.value || 0);
            }
          }
        );
      });

      if (dailySteps > 0) {
        stepsData.push({
          value: dailySteps,
          startDate: date.toISOString(),
          endDate: new Date(
            date.getTime() + 24 * 60 * 60 * 1000
          ).toISOString(),
        });
      }
    } catch (error) {
      // Silently continue on error
    }
  }

  return stepsData;
}

/**
 * Get historical heart rate data for specified number of days
 */
export async function getHistoricalHeartRateData(days: number = 30): Promise<HealthValue[]> {
  if (Platform.OS !== "ios") return [];

  return new Promise((resolve) => {
    const options: HealthInputOptions = {
      startDate: new Date(
        Date.now() - days * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDate: new Date().toISOString(),
      ascending: false,
      limit: days * 3, // More samples for better coverage
    };

    AppleHealthKit.getRestingHeartRateSamples(
      options,
      (callbackError: string, results: HealthValue[]) => {
        if (callbackError) {
          resolve([]);
        } else {
          resolve(results || []);
        }
      }
    );
  });
}

/**
 * Get historical HRV data for specified number of days
 */
export async function getHistoricalHRVData(days: number = 30): Promise<HealthValue[]> {
  if (Platform.OS !== "ios") return [];

  return new Promise((resolve) => {
    const options: HealthInputOptions = {
      startDate: new Date(
        Date.now() - days * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDate: new Date().toISOString(),
      ascending: false,
      limit: days * 2, // More samples for better averaging
    };

    AppleHealthKit.getHeartRateVariabilitySamples(
      options,
      (callbackError: string, results: HealthValue[]) => {
        if (callbackError) {
          resolve([]);
        } else {
          resolve(results || []);
        }
      }
    );
  });
}

/**
 * Get historical sleep data for specified number of days
 */
export async function getHistoricalSleepData(days: number = 30): Promise<any[]> {
  if (Platform.OS !== "ios") return [];

  return new Promise((resolve) => {
    const options: HealthInputOptions = {
      startDate: new Date(
        Date.now() - days * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDate: new Date().toISOString(),
    };

    AppleHealthKit.getSleepSamples(
      options,
      (callbackError: string, results: any[]) => {
        if (callbackError) {
          resolve([]);
        } else {
          resolve(results || []);
        }
      }
    );
  });
}

/**
 * Get historical workout data grouped by day
 */
export async function getHistoricalWorkoutData(days: number = 30): Promise<Array<{
  date: Date;
  duration: number; // in minutes
  intensity: number; // 0-100
}>> {
  if (Platform.OS !== "ios") return [];

  return new Promise((resolve) => {
    const options = {
      startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString(),
    };

    (AppleHealthKit as any).getAnchoredWorkouts(
      options,
      (callbackError: string, results: any) => {
        if (callbackError) {
          resolve([]);
        } else {
          const workouts = results.data || results || [];
          const dailyWorkouts: { [dateString: string]: { duration: number; intensity: number; count: number } } = {};

          workouts.forEach((workout: any) => {
            if (!workout || !workout.end || !workout.start) {
              return;
            }

            const workoutDate = new Date(workout.start);
            const dateString = workoutDate.toDateString();
            const duration = workout.duration / 60; // Convert seconds to minutes

            if (duration > 0 && !isNaN(duration)) {
              if (!dailyWorkouts[dateString]) {
                dailyWorkouts[dateString] = { duration: 0, intensity: 0, count: 0 };
              }

              dailyWorkouts[dateString].duration += duration;
              dailyWorkouts[dateString].count += 1;

              // Calculate intensity based on calories per minute and activity type
              const caloriesPerMinute = (workout.calories || 0) / Math.max(duration, 1);
              const activityName = workout.activityName || "";

              let workoutIntensity = caloriesPerMinute * 5; // Base intensity from calories

              // Bonus for high-intensity activities
              if ([
                "Running",
                "Cycling",
                "Swimming",
                "HIIT",
                "CrossTraining",
                "TraditionalStrengthTraining",
              ].includes(activityName)) {
                workoutIntensity += 30;
              }

              dailyWorkouts[dateString].intensity = Math.max(
                dailyWorkouts[dateString].intensity,
                Math.min(100, Math.max(0, Math.round(workoutIntensity)))
              );
            }
          });

          // Convert to array format
          const result = Object.entries(dailyWorkouts).map(([dateString, data]) => ({
            date: new Date(dateString),
            duration: Math.round(data.duration),
            intensity: data.intensity,
          }));

          resolve(result.sort((a, b) => b.date.getTime() - a.date.getTime()));
        }
      }
    );
  });
}