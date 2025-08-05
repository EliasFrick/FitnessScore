/**
 * Custom Error Types for Better Error Handling
 */

export class HealthKitError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "HealthKitError";
  }
}

export class HealthKitInitializationError extends HealthKitError {
  constructor(message: string) {
    super(message, "HEALTHKIT_INIT_FAILED");
  }
}

export class AIServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "AIServiceError";
  }
}
