import { HealthMetrics } from "@/types/health";
import StorageService from "./storageService";
import { calculateFitnessScore } from "@/utils/fitnessCalculator";

export interface HealthSummary {
  currentMetrics: HealthMetrics;
  vitalityScore: number;
  fitnessLevel: string;
  weeklyTrends: {
    heartHealthTrend: "improving" | "stable" | "declining";
    sleepTrend: "improving" | "stable" | "declining";
    activityTrend: "improving" | "stable" | "declining";
  };
  insights: string[];
  recommendations: string[];
}

export interface HealthContext {
  personalProfile: {
    age?: number;
    gender?: string;
    activityLevel:
      | "sedentary"
      | "light"
      | "moderate"
      | "active"
      | "very_active";
  };
  currentMetrics: HealthMetrics;
  recentTrends: {
    heartHealthTrend: "improving" | "stable" | "declining";
    sleepTrend: "improving" | "stable" | "declining";
    activityTrend: "improving" | "stable" | "declining";
  };
  vitalityScore: number;
  fitnessLevel: string;
  topConcerns: string[];
  strengths: string[];
}

export class HealthAggregationService {
  private static instance: HealthAggregationService;
  private storageService = StorageService;

  private constructor() {}

  static getInstance(): HealthAggregationService {
    if (!HealthAggregationService.instance) {
      HealthAggregationService.instance = new HealthAggregationService();
    }
    return HealthAggregationService.instance;
  }

  async createHealthSummary(
    currentMetrics: HealthMetrics,
  ): Promise<HealthSummary> {
    const fitnessResult = calculateFitnessScore(currentMetrics);
    const vitalityScore = fitnessResult.totalScore;
    const fitnessLevel = fitnessResult.fitnessLevel;

    // Get aggregated data for trends
    const aggregatedData = await this.storageService.getAggregatedHealthData();
    const weeklyTrends = aggregatedData?.aggregatedMonthly?.trends || {
      heartHealthTrend: "stable" as const,
      sleepTrend: "stable" as const,
      activityTrend: "stable" as const,
    };

    const insights = this.generateInsights(
      currentMetrics,
      vitalityScore,
      weeklyTrends,
    );
    const recommendations = this.generateRecommendations(
      currentMetrics,
      weeklyTrends,
    );

    return {
      currentMetrics,
      vitalityScore,
      fitnessLevel,
      weeklyTrends,
      insights,
      recommendations,
    };
  }

  async createHealthContext(
    currentMetrics: HealthMetrics,
  ): Promise<HealthContext> {
    const fitnessResult = calculateFitnessScore(currentMetrics);
    const vitalityScore = fitnessResult.totalScore;
    const fitnessLevel = fitnessResult.fitnessLevel;

    // Get aggregated data for trends
    const aggregatedData = await this.storageService.getAggregatedHealthData();
    const recentTrends = aggregatedData?.aggregatedMonthly?.trends || {
      heartHealthTrend: "stable" as const,
      sleepTrend: "stable" as const,
      activityTrend: "stable" as const,
    };

    const topConcerns = this.identifyTopConcerns(currentMetrics, recentTrends);
    const strengths = this.identifyStrengths(currentMetrics, recentTrends);
    const activityLevel = this.determineActivityLevel(currentMetrics);

    return {
      personalProfile: {
        activityLevel,
      },
      currentMetrics,
      recentTrends,
      vitalityScore,
      fitnessLevel,
      topConcerns,
      strengths,
    };
  }

  private generateInsights(
    metrics: HealthMetrics,
    vitalityScore: number,
    trends: {
      heartHealthTrend: string;
      sleepTrend: string;
      activityTrend: string;
    },
  ): string[] {
    const insights: string[] = [];

    // Vitality Score Insights
    if (vitalityScore >= 90) {
      insights.push(
        "Excellent work! You're in top form across all health metrics.",
      );
    } else if (vitalityScore >= 70) {
      insights.push(
        "Strong overall health with room for targeted improvements.",
      );
    } else if (vitalityScore >= 50) {
      insights.push(
        "Solid foundation with opportunities to optimize key areas.",
      );
    } else {
      insights.push(
        "Great opportunity to make meaningful improvements to your health.",
      );
    }

    // Heart Health Insights
    if (metrics.restingHeartRate < 60 && metrics.heartRateVariability > 40) {
      insights.push(
        "Your cardiovascular fitness is excellent - keep up the great work!",
      );
    } else if (metrics.restingHeartRate > 80) {
      insights.push(
        "Your resting heart rate suggests room for cardiovascular improvement.",
      );
    }

    // Sleep Insights
    const totalSleep = metrics.deepSleepPercentage + metrics.remSleepPercentage;
    if (totalSleep > 35 && metrics.sleepConsistency > 80) {
      insights.push(
        "Your sleep quality is excellent with good deep and REM sleep.",
      );
    } else if (metrics.deepSleepPercentage < 15) {
      insights.push(
        "Consider optimizing your sleep environment for better deep sleep.",
      );
    }

    // Activity Insights
    if (metrics.averageSteps > 10000 && metrics.monthlyTrainingTime > 600) {
      insights.push(
        "Outstanding activity levels - you're exceeding recommended guidelines!",
      );
    } else if (metrics.averageSteps < 5000) {
      insights.push(
        "Increasing daily movement could significantly boost your vitality score.",
      );
    }

    // Trend Insights
    if (trends.heartHealthTrend === "improving") {
      insights.push(
        "Great news! Your cardiovascular health is trending upward.",
      );
    }
    if (trends.sleepTrend === "improving") {
      insights.push("Your sleep quality improvements are paying off!");
    }
    if (trends.activityTrend === "improving") {
      insights.push(
        "Your increased activity levels are making a positive impact.",
      );
    }

    return insights;
  }

  private generateRecommendations(
    metrics: HealthMetrics,
    trends: {
      heartHealthTrend: string;
      sleepTrend: string;
      activityTrend: string;
    },
  ): string[] {
    const recommendations: string[] = [];

    // Heart Health Recommendations
    if (metrics.restingHeartRate > 75) {
      recommendations.push(
        "Try adding 20-30 minutes of moderate cardio 3-4 times per week.",
      );
    }
    if (metrics.heartRateVariability < 30) {
      recommendations.push(
        "Consider stress-reduction techniques like meditation or yoga.",
      );
    }

    // Sleep Recommendations
    if (metrics.deepSleepPercentage < 15) {
      recommendations.push(
        "Optimize your sleep environment: cool, dark, and quiet.",
      );
      recommendations.push("Avoid screens 1-2 hours before bedtime.");
    }
    if (metrics.sleepConsistency < 70) {
      recommendations.push(
        "Try maintaining a consistent sleep schedule, even on weekends.",
      );
    }

    // Activity Recommendations
    if (metrics.averageSteps < 8000) {
      recommendations.push(
        "Aim for 8,000-10,000 steps daily by adding short walks throughout the day.",
      );
    }
    if (metrics.monthlyTrainingTime < 600) {
      recommendations.push(
        "Target 600 minutes of moderate exercise or 300 minutes of vigorous exercise monthly.",
      );
    }

    // Declining Trend Recommendations
    if (trends.heartHealthTrend === "declining") {
      recommendations.push(
        "Focus on cardiovascular exercise to reverse the declining heart health trend.",
      );
    }
    if (trends.sleepTrend === "declining") {
      recommendations.push(
        "Review your sleep hygiene and consider what might be affecting your sleep quality.",
      );
    }
    if (trends.activityTrend === "declining") {
      recommendations.push(
        "Set achievable activity goals to get back on track with your fitness routine.",
      );
    }

    return recommendations;
  }

  private identifyTopConcerns(
    metrics: HealthMetrics,
    trends: {
      heartHealthTrend: string;
      sleepTrend: string;
      activityTrend: string;
    },
  ): string[] {
    const concerns: string[] = [];

    if (metrics.restingHeartRate > 80) concerns.push("High resting heart rate");
    if (metrics.heartRateVariability < 25)
      concerns.push("Low heart rate variability");
    if (metrics.vo2Max < 35) concerns.push("Low cardiovascular fitness");
    if (metrics.deepSleepPercentage < 10)
      concerns.push("Insufficient deep sleep");
    if (metrics.sleepConsistency < 60)
      concerns.push("Inconsistent sleep schedule");
    if (metrics.averageSteps < 5000) concerns.push("Low daily activity");
    if (metrics.monthlyTrainingTime < 240)
      concerns.push("Insufficient exercise");

    if (trends.heartHealthTrend === "declining")
      concerns.push("Declining cardiovascular health");
    if (trends.sleepTrend === "declining")
      concerns.push("Worsening sleep quality");
    if (trends.activityTrend === "declining")
      concerns.push("Decreasing activity levels");

    return concerns.slice(0, 3); // Top 3 concerns
  }

  private identifyStrengths(
    metrics: HealthMetrics,
    trends: {
      heartHealthTrend: string;
      sleepTrend: string;
      activityTrend: string;
    },
  ): string[] {
    const strengths: string[] = [];

    if (metrics.restingHeartRate < 65)
      strengths.push("Excellent resting heart rate");
    if (metrics.heartRateVariability > 40)
      strengths.push("Good heart rate variability");
    if (metrics.vo2Max > 45) strengths.push("High cardiovascular fitness");
    if (metrics.deepSleepPercentage > 20)
      strengths.push("Good deep sleep quality");
    if (metrics.remSleepPercentage > 20) strengths.push("Adequate REM sleep");
    if (metrics.sleepConsistency > 85)
      strengths.push("Consistent sleep schedule");
    if (metrics.averageSteps > 10000) strengths.push("High daily activity");
    if (metrics.monthlyTrainingTime > 800)
      strengths.push("Excellent exercise routine");

    if (trends.heartHealthTrend === "improving")
      strengths.push("Improving cardiovascular health");
    if (trends.sleepTrend === "improving")
      strengths.push("Better sleep quality");
    if (trends.activityTrend === "improving")
      strengths.push("Increasing activity levels");

    return strengths.slice(0, 3); // Top 3 strengths
  }

  private determineActivityLevel(
    metrics: HealthMetrics,
  ): "sedentary" | "light" | "moderate" | "active" | "very_active" {
    const weeklyMinutes = metrics.monthlyTrainingTime / 4;
    const dailySteps = metrics.averageSteps;

    if (weeklyMinutes >= 300 && dailySteps >= 12000) return "very_active";
    if (weeklyMinutes >= 150 && dailySteps >= 8000) return "active";
    if (weeklyMinutes >= 75 && dailySteps >= 6000) return "moderate";
    if (weeklyMinutes >= 30 || dailySteps >= 4000) return "light";
    return "sedentary";
  }

  async storeAndAggregate(metrics: HealthMetrics): Promise<void> {
    await this.storageService.storeHealthData(metrics);
  }

  formatHealthContextForAI(context: HealthContext): string {
    return `
Health Profile Summary:
- Vitality Score: ${context.vitalityScore}/100 (${context.fitnessLevel})
- Activity Level: ${context.personalProfile.activityLevel}

Current Metrics:
- Resting Heart Rate: ${context.currentMetrics.restingHeartRate} bpm
- Heart Rate Variability: ${context.currentMetrics.heartRateVariability} ms
- VO2 Max: ${context.currentMetrics.vo2Max} ml/kg/min
- Deep Sleep: ${context.currentMetrics.deepSleepPercentage}%
- REM Sleep: ${context.currentMetrics.remSleepPercentage}%
- Sleep Consistency: ${context.currentMetrics.sleepConsistency}%
- Monthly Training: ${context.currentMetrics.monthlyTrainingTime} minutes
- Daily Steps: ${context.currentMetrics.averageSteps}

Recent Trends:
- Heart Health: ${context.recentTrends.heartHealthTrend}
- Sleep Quality: ${context.recentTrends.sleepTrend}
- Activity Level: ${context.recentTrends.activityTrend}

Top Concerns: ${context.topConcerns.join(", ") || "None identified"}
Key Strengths: ${context.strengths.join(", ") || "Establishing baseline"}
`.trim();
  }
}

export default HealthAggregationService.getInstance();
