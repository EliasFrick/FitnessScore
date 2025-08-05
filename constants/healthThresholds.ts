/**
 * Health Metrics Thresholds and Constants
 * Centralized constants to eliminate magic numbers throughout the codebase
 */

export const HEART_RATE_THRESHOLDS = {
  EXCELLENT: 50,
  VERY_GOOD: 60,
  GOOD: 70,
  AVERAGE: 80,
  ELEVATED: 90,
} as const;

export const HRV_THRESHOLDS = {
  OUTSTANDING: 70,
  VERY_GOOD: 40,
  GOOD: 20,
  BELOW_AVERAGE: 15,
} as const;

export const VO2_MAX_THRESHOLDS = {
  OUTSTANDING: 50,
  EXCELLENT: 40,
  GOOD: 30,
  AVERAGE: 20,
} as const;

export const DEEP_SLEEP_THRESHOLDS = {
  EXCELLENT: 23,
  VERY_GOOD: 18,
  GOOD: 13,
  AVERAGE: 10,
  BELOW_AVERAGE: 6,
} as const;

export const REM_SLEEP_THRESHOLDS = {
  EXCELLENT: 25,
  VERY_GOOD: 20,
  GOOD: 15,
  AVERAGE: 10,
} as const;

export const SLEEP_CONSISTENCY_THRESHOLDS = {
  EXCELLENT: 85,
  GOOD: 70,
  MODERATE: 50,
} as const;

export const DAILY_TRAINING_THRESHOLDS = {
  OUTSTANDING: 40, // ~280 min/week / 7 days
  EXCELLENT: 35, // ~245 min/week / 7 days
  GOOD: 25, // ~175 min/week / 7 days
  MODERATE: 20, // ~140 min/week / 7 days
  BELOW_AVERAGE: 12, // ~84 min/week / 7 days
  LOW: 4, // ~28 min/week / 7 days
} as const;

export const TRAINING_INTENSITY_THRESHOLDS = {
  EXCEPTIONAL: 85,
  HIGH: 70,
  GOOD: 55,
  MODERATE: 40,
} as const;

export const DAILY_STEPS_THRESHOLDS = {
  OUTSTANDING: 12000,
  EXCELLENT: 10000,
  VERY_GOOD: 8000,
  GOOD: 6000,
  MODERATE: 4000,
  LOW: 2000,
} as const;

export const SCORING_WEIGHTS = {
  CARDIOVASCULAR_MAX: 30,
  RECOVERY_MAX: 35,
  ACTIVITY_MAX: 30,
  BONUS_MAX: 5,

  // Individual metric weights
  RESTING_HEART_RATE_MAX: 10,
  HRV_MAX: 10,
  VO2_MAX_MAX: 10,
  DEEP_SLEEP_MAX: 15,
  REM_SLEEP_MAX: 12,
  SLEEP_CONSISTENCY_MAX: 8,
  DAILY_TRAINING_MAX: 12,
  TRAINING_INTENSITY_MAX: 12,
  DAILY_STEPS_MAX: 6,
} as const;

export const FITNESS_LEVEL_THRESHOLDS = {
  TOP_FORM: 90,
  STRONG_ACTIVE: 70,
  SOLID_PROGRESS: 50,
  ON_THE_WAY: 30,
} as const;

export const FITNESS_LEVELS = {
  TOP_FORM: "Top Form!",
  STRONG_ACTIVE: "Strong & Active",
  SOLID_PROGRESS: "Solid Progress",
  ON_THE_WAY: "On The Way",
  TIME_FOR_CHANGE: "Time For Change",
} as const;

export const BONUS_REQUIREMENTS = {
  EXCELLENT_THRESHOLD: 75, // Percentage threshold for excellent category performance
  ALL_CATEGORIES_BONUS: 5,
  TWO_CATEGORIES_BONUS: 3,
  ONE_CATEGORY_BONUS: 1,
} as const;

export const TIME_PERIODS = {
  DAYS_IN_WEEK: 7,
  HOURS_IN_DAY: 24,
  MINUTES_IN_HOUR: 60,
  SECONDS_IN_MINUTE: 60,
  MILLISECONDS_IN_SECOND: 1000,
  DAYS_IN_MONTH: 30,
} as const;
