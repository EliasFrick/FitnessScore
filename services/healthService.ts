import { NativeModules, Platform } from "react-native";
import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
  HealthValue,
} from "react-native-health";

// Workaround for react-native-health missing functions
// This fixes the interface issues with the abandoned package
if (Platform.OS === "ios" && NativeModules.AppleHealthKit) {
  for (let key of [
    "initHealthKit",
    "getRestingHeartRateSamples",
    "getHeartRateVariabilitySamples",
    "getVo2MaxSamples",
    "getSleepSamples",
    "getStepCount",
    "getSamples",
  ]) {
    if (!(AppleHealthKit as any)[key] && NativeModules.AppleHealthKit[key]) {
      (AppleHealthKit as any)[key] = NativeModules.AppleHealthKit[key];
    }
  }
}

export interface HealthMetrics {
  restingHeartRate: number;
  heartRateVariability: number;
  vo2Max: number;
  deepSleepPercentage: number;
  remSleepPercentage: number;
  sleepConsistency: number;
  weeklyTrainingTime: number;
  trainingIntensity: number;
  dailySteps: number;
}

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.HeartRateVariability,
      AppleHealthKit.Constants.Permissions.RestingHeartRate,
      AppleHealthKit.Constants.Permissions.Vo2Max,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.Workout,
    ],
    write: [],
  },
};

export class HealthService {
  private static instance: HealthService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): HealthService {
    if (!HealthService.instance) {
      HealthService.instance = new HealthService();
    }
    return HealthService.instance;
  }

  async initialize(): Promise<boolean> {
    if (Platform.OS !== "ios") {
      console.warn("Apple Health is only available on iOS");
      return false;
    }

    return new Promise((resolve) => {
      AppleHealthKit.initHealthKit(permissions, (error: string) => {
        if (error) {
          console.error("Cannot grant permissions!", error);
          this.isInitialized = false;
          resolve(false);
        } else {
          this.isInitialized = true;
          resolve(true);
        }
      });
    });
  }

  async getRestingHeartRate(): Promise<number> {
    if (!this.isInitialized) return 0;

    return new Promise((resolve) => {
      const options: HealthInputOptions = {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
        endDate: new Date().toISOString(),
        ascending: false,
        limit: 7,
      };

      AppleHealthKit.getRestingHeartRateSamples(
        options,
        (callbackError: string, results: HealthValue[]) => {
          if (callbackError) {
            console.error("Error getting resting heart rate:", callbackError);
            resolve(0);
          } else {
            const avgRhr =
              results.length > 0
                ? results.reduce((sum, sample) => sum + sample.value, 0) /
                  results.length
                : 0;
            resolve(Math.round(avgRhr));
          }
        }
      );
    });
  }

  async getHeartRateVariability(): Promise<number> {
    if (!this.isInitialized) return 0;

    return new Promise((resolve) => {
      const options: HealthInputOptions = {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
        endDate: new Date().toISOString(),
        ascending: false,
        limit: 7,
      };

      AppleHealthKit.getHeartRateVariabilitySamples(
        options,
        (callbackError: string, results: HealthValue[]) => {
          if (callbackError) {
            console.error("Error getting HRV:", callbackError);
            resolve(0);
          } else {
            const avgHrv =
              results.length > 0
                ? results.reduce((sum, sample) => sum + sample.value, 0) /
                  results.length
                : 0;
            resolve(Math.round(avgHrv));
          }
        }
      );
    });
  }

  async getVO2Max(): Promise<number> {
    if (!this.isInitialized) return 0;

    return new Promise((resolve) => {
      const options: HealthInputOptions = {
        startDate: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // Last 30 days
        endDate: new Date().toISOString(),
        ascending: false,
        limit: 5,
      };

      AppleHealthKit.getVo2MaxSamples(
        options,
        (callbackError: string, results: HealthValue[]) => {
          if (callbackError) {
            console.error("Error getting VO2Max:", callbackError);
            resolve(0);
          } else {
            const avgVO2Max =
              results.length > 0
                ? results.reduce((sum, sample) => sum + sample.value, 0) /
                  results.length
                : 0;
            resolve(Math.round(avgVO2Max * 10) / 10); // Round to 1 decimal
          }
        }
      );
    });
  }

  async getSleepData(): Promise<{
    deepSleepPercentage: number;
    remSleepPercentage: number;
    sleepConsistency: number;
  }> {
    if (!this.isInitialized)
      return {
        deepSleepPercentage: 0,
        remSleepPercentage: 0,
        sleepConsistency: 0,
      };

    return new Promise((resolve) => {
      const options: HealthInputOptions = {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
        endDate: new Date().toISOString(),
      };

      AppleHealthKit.getSleepSamples(
        options,
        (callbackError: string, results: any[]) => {
          if (callbackError) {
            console.error("Error getting sleep data:", callbackError);
            resolve({
              deepSleepPercentage: 0,
              remSleepPercentage: 0,
              sleepConsistency: 0,
            });
          } else {
            // Calculate sleep metrics from raw data
            let totalDeepSleep = 0;
            let totalRemSleep = 0;
            let totalSleep = 0;
            const sleepDurations: number[] = [];

            results.forEach((sample) => {
              const duration =
                new Date(sample.endDate).getTime() -
                new Date(sample.startDate).getTime();
              const hours = duration / (1000 * 60 * 60);

              totalSleep += hours;

              // Note: Sleep analysis values would need to be checked against actual API
              // This is simplified for demonstration
              if (sample.value === "DEEP") {
                totalDeepSleep += hours;
              } else if (sample.value === "REM") {
                totalRemSleep += hours;
              }

              sleepDurations.push(hours);
            });

            const deepSleepPercentage =
              totalSleep > 0 ? (totalDeepSleep / totalSleep) * 100 : 0;
            const remSleepPercentage =
              totalSleep > 0 ? (totalRemSleep / totalSleep) * 100 : 0;

            // Calculate sleep consistency (lower standard deviation = better consistency)
            const avgSleep =
              sleepDurations.length > 0
                ? sleepDurations.reduce((a, b) => a + b, 0) /
                  sleepDurations.length
                : 0;
            const variance =
              sleepDurations.length > 0
                ? sleepDurations.reduce(
                    (sum, duration) => sum + Math.pow(duration - avgSleep, 2),
                    0
                  ) / sleepDurations.length
                : 0;
            const stdDev = Math.sqrt(variance);
            const sleepConsistency = Math.max(0, 100 - stdDev * 20); // Convert to 0-100 scale

            resolve({
              deepSleepPercentage: Math.round(deepSleepPercentage * 10) / 10,
              remSleepPercentage: Math.round(remSleepPercentage * 10) / 10,
              sleepConsistency: Math.round(sleepConsistency),
            });
          }
        }
      );
    });
  }

  async getStepsData(): Promise<number> {
    if (!this.isInitialized) return 0;

    return new Promise((resolve) => {
      const options: HealthInputOptions = {
        date: new Date().toISOString(),
      };

      AppleHealthKit.getStepCount(
        options,
        (callbackError: string, results: HealthValue) => {
          if (callbackError) {
            console.error("Error getting steps:", callbackError);
            resolve(0);
          } else {
            resolve(results.value || 0);
          }
        }
      );
    });
  }

  async getHistoricalStepsData(days: number = 30): Promise<HealthValue[]> {
    if (!this.isInitialized) return [];

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
                console.error(`Error getting steps for ${date.toDateString()}:`, callbackError);
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
            endDate: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          });
        }
      } catch (error) {
        console.error(`Error fetching steps for ${date.toDateString()}:`, error);
      }
    }

    console.log(`Historical steps data fetched: ${stepsData.length} days`);
    return stepsData;
  }

  async getHistoricalHeartRateData(days: number = 30): Promise<HealthValue[]> {
    if (!this.isInitialized) return [];

    return new Promise((resolve) => {
      const options: HealthInputOptions = {
        startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
        ascending: false,
        limit: days * 3, // More samples for better coverage
      };

      AppleHealthKit.getRestingHeartRateSamples(
        options,
        (callbackError: string, results: HealthValue[]) => {
          if (callbackError) {
            console.error("Error getting historical heart rate:", callbackError);
            resolve([]);
          } else {
            console.log(`Historical heart rate data fetched: ${results?.length || 0} samples`);
            resolve(results || []);
          }
        }
      );
    });
  }

  async getHistoricalHRVData(days: number = 30): Promise<HealthValue[]> {
    if (!this.isInitialized) return [];

    return new Promise((resolve) => {
      const options: HealthInputOptions = {
        startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
        ascending: false,
        limit: days * 2, // More samples for better averaging
      };

      AppleHealthKit.getHeartRateVariabilitySamples(
        options,
        (callbackError: string, results: HealthValue[]) => {
          if (callbackError) {
            console.error("Error getting historical HRV:", callbackError);
            resolve([]);
          } else {
            resolve(results || []);
          }
        }
      );
    });
  }

  async getHistoricalSleepData(days: number = 30): Promise<any[]> {
    if (!this.isInitialized) return [];

    return new Promise((resolve) => {
      const options: HealthInputOptions = {
        startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
      };

      AppleHealthKit.getSleepSamples(
        options,
        (callbackError: string, results: any[]) => {
          if (callbackError) {
            console.error("Error getting historical sleep:", callbackError);
            resolve([]);
          } else {
            resolve(results || []);
          }
        }
      );
    });
  }

  async getWorkoutData(): Promise<{
    weeklyTrainingTime: number;
    trainingIntensity: number;
  }> {
    if (!this.isInitialized)
      return { weeklyTrainingTime: 0, trainingIntensity: 0 };

    return new Promise((resolve) => {
      const options: HealthInputOptions = {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
        endDate: new Date().toISOString(),
      };

      AppleHealthKit.getSamples(
        options,
        (callbackError: string, results: any[]) => {
          if (callbackError) {
            console.error("Error getting workout data:", callbackError);
            resolve({ weeklyTrainingTime: 0, trainingIntensity: 0 });
          } else {
            let totalDuration = 0;
            let totalCalories = 0;
            let workoutCount = 0;

            results.forEach((workout) => {
              const duration =
                (new Date(workout.endDate).getTime() -
                  new Date(workout.startDate).getTime()) /
                (1000 * 60); // minutes
              totalDuration += duration;
              totalCalories += workout.calories || 0;
              workoutCount++;
            });

            const weeklyTrainingTime = Math.round(totalDuration);
            const trainingIntensity =
              workoutCount > 0
                ? Math.round(totalCalories / workoutCount / 10)
                : 0; // Simplified intensity metric

            resolve({
              weeklyTrainingTime,
              trainingIntensity: Math.min(100, trainingIntensity), // Cap at 100
            });
          }
        }
      );
    });
  }

  async getAllHealthMetrics(): Promise<HealthMetrics> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error("Failed to initialize HealthKit");
      }
    }

    try {
      const [
        restingHeartRate,
        heartRateVariability,
        vo2Max,
        sleepData,
        dailySteps,
        workoutData,
      ] = await Promise.all([
        this.getRestingHeartRate(),
        this.getHeartRateVariability(),
        this.getVO2Max(),
        this.getSleepData(),
        this.getStepsData(),
        this.getWorkoutData(),
      ]);

      return {
        restingHeartRate,
        heartRateVariability,
        vo2Max,
        deepSleepPercentage: sleepData.deepSleepPercentage,
        remSleepPercentage: sleepData.remSleepPercentage,
        sleepConsistency: sleepData.sleepConsistency,
        weeklyTrainingTime: workoutData.weeklyTrainingTime,
        trainingIntensity: workoutData.trainingIntensity,
        dailySteps,
      };
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      throw error;
    }
  }

  async getHistoricalHealthData(days: number = 30): Promise<Array<{
    date: Date;
    stepsData: HealthValue[];
    heartRateData: HealthValue[];
    hrvData: HealthValue[];
    sleepData: any[];
  }>> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error("Failed to initialize HealthKit");
      }
    }

    try {
      const [
        stepsData,
        heartRateData,
        hrvData,
        sleepData,
      ] = await Promise.all([
        this.getHistoricalStepsData(days),
        this.getHistoricalHeartRateData(days),
        this.getHistoricalHRVData(days),
        this.getHistoricalSleepData(days),
      ]);

      // Group data by date
      const dateGroups: { [dateString: string]: {
        date: Date;
        stepsData: HealthValue[];
        heartRateData: HealthValue[];
        hrvData: HealthValue[];
        sleepData: any[];
      } } = {};

      // Group steps by date
      stepsData.forEach(sample => {
        const dateStr = new Date(sample.startDate).toDateString();
        if (!dateGroups[dateStr]) {
          dateGroups[dateStr] = {
            date: new Date(sample.startDate),
            stepsData: [],
            heartRateData: [],
            hrvData: [],
            sleepData: []
          };
        }
        dateGroups[dateStr].stepsData.push(sample);
      });

      // Group heart rate by date
      heartRateData.forEach(sample => {
        const dateStr = new Date(sample.startDate).toDateString();
        if (!dateGroups[dateStr]) {
          dateGroups[dateStr] = {
            date: new Date(sample.startDate),
            stepsData: [],
            heartRateData: [],
            hrvData: [],
            sleepData: []
          };
        }
        dateGroups[dateStr].heartRateData.push(sample);
      });

      // Group HRV by date
      hrvData.forEach(sample => {
        const dateStr = new Date(sample.startDate).toDateString();
        if (!dateGroups[dateStr]) {
          dateGroups[dateStr] = {
            date: new Date(sample.startDate),
            stepsData: [],
            heartRateData: [],
            hrvData: [],
            sleepData: []
          };
        }
        dateGroups[dateStr].hrvData.push(sample);
      });

      // Group sleep by date
      sleepData.forEach(sample => {
        const dateStr = new Date(sample.startDate).toDateString();
        if (!dateGroups[dateStr]) {
          dateGroups[dateStr] = {
            date: new Date(sample.startDate),
            stepsData: [],
            heartRateData: [],
            hrvData: [],
            sleepData: []
          };
        }
        dateGroups[dateStr].sleepData.push(sample);
      });

      return Object.values(dateGroups).sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
      console.error("Error fetching historical health data:", error);
      throw error;
    }
  }
}

export default HealthService.getInstance();
