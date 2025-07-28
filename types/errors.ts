/**
 * Custom Error Types for Better Error Handling
 */

export class HealthKitError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'HealthKitError';
  }
}

export class HealthKitInitializationError extends HealthKitError {
  constructor(message: string) {
    super(message, 'HEALTHKIT_INIT_FAILED');
  }
}

export class HealthKitPermissionError extends HealthKitError {
  constructor(message: string) {
    super(message, 'HEALTHKIT_PERMISSION_DENIED');
  }
}

export class HealthKitDataError extends HealthKitError {
  constructor(message: string, public readonly metricType: string) {
    super(message, 'HEALTHKIT_DATA_UNAVAILABLE');
  }
}

export class StorageError extends Error {
  constructor(message: string, public readonly operation: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export class AIServiceError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class AIConfigurationError extends AIServiceError {
  constructor(message: string) {
    super(message, 'AI_CONFIG_ERROR');
  }
}