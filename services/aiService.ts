import OpenAI from "openai";
import { HealthContext } from "./healthAggregationService";
import StorageService from "./storageService";

export interface AIConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: string;
}

export interface AIResponse {
  message: string;
  confidence: number;
  sources?: string[];
}

export class AIService {
  private static instance: AIService;
  private openai: OpenAI | null = null;
  private storageService = StorageService;
  private isConfigured = false;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  configure(config: AIConfig): void {
    if (!config.apiKey) {
      throw new Error("OpenAI API key is required");
    }

    this.openai = new OpenAI({
      apiKey: config.apiKey,
    });

    this.isConfigured = true;
  }

  private getSystemPrompt(): string {
    return `You are Jasmine, a knowledgeable and supportive AI health assistant for the VitalityScore app. Your role is to help users understand their health data, provide evidence-based insights, and offer practical recommendations.

Key Guidelines:
- Always base responses on the provided health data and context
- Provide specific, actionable advice when possible
- Be encouraging and supportive while being honest about areas for improvement
- Reference specific metrics when explaining insights
- Suggest concrete steps for improvement
- Never provide medical diagnosis or replace professional medical advice
- If asked about serious health concerns, always recommend consulting a healthcare provider
- Keep responses conversational, warm, and easy to understand
- Focus on lifestyle improvements and general wellness
- Use the German fitness level names when referencing vitality scores

VitalityScore Levels (0-100 scale):
- 90-100: "Topform!" (Top form)
- 70-89: "Stark & Aktiv" (Strong & Active)
- 50-69: "Solide Fortschritte" (Solid Progress)
- 30-49: "Auf dem Weg" (On the Way)
- 0-29: "Zeit für Veränderung" (Time for Change)

Health Metrics Understanding:
- Resting Heart Rate: Lower is generally better (50-70 bpm is excellent for adults)
- Heart Rate Variability: Higher is better (>40ms is good)
- VO2 Max: Higher is better (fitness level indicator)
- Deep Sleep: 15-20% of total sleep is ideal
- REM Sleep: 20-25% of total sleep is ideal
- Sleep Consistency: Higher percentage indicates better sleep schedule
- Weekly Training: 150+ minutes recommended
- Daily Steps: 8,000-10,000+ is ideal

Always end responses with encouragement and offer to help with specific questions.`;
  }

  private generateHealthPrompt(
    healthContext: HealthContext,
    userMessage: string,
  ): string {
    return `Based on the user's current health data and their question, provide a helpful, personalized response.

Health Context:
${this.formatHealthContext(healthContext)}

User Question: "${userMessage}"

Please provide a response that:
1. Acknowledges their current health status and trends
2. Addresses their specific question with relevant insights from their data
3. Offers specific, actionable recommendations if appropriate
4. Encourages continued progress
5. Is warm, supportive, and conversational

Remember to reference specific metrics when relevant and explain what they mean in practical terms.`;
  }

  private formatHealthContext(context: HealthContext): string {
    return `
Current Vitality Score: ${context.vitalityScore}/100 (${context.fitnessLevel})
Activity Level: ${context.personalProfile.activityLevel}

Latest Health Metrics:
- Resting Heart Rate: ${context.currentMetrics.restingHeartRate} bpm
- Heart Rate Variability: ${context.currentMetrics.heartRateVariability} ms  
- VO2 Max: ${context.currentMetrics.vo2Max} ml/kg/min
- Deep Sleep: ${context.currentMetrics.deepSleepPercentage}%
- REM Sleep: ${context.currentMetrics.remSleepPercentage}%
- Sleep Consistency: ${context.currentMetrics.sleepConsistency}%
- Monthly Training Time: ${context.currentMetrics.monthlyTrainingTime} minutes
- Daily Steps: ${context.currentMetrics.averageSteps}

Recent Trends (past month):
- Heart Health: ${context.recentTrends.heartHealthTrend}
- Sleep Quality: ${context.recentTrends.sleepTrend}  
- Activity Level: ${context.recentTrends.activityTrend}

Areas for Focus: ${context.topConcerns.join(", ") || "Maintaining current progress"}
Key Strengths: ${context.strengths.join(", ") || "Building healthy foundations"}
`.trim();
  }

  async generateResponse(
    userMessage: string,
    healthContext: HealthContext,
    useCache: boolean = true,
  ): Promise<AIResponse> {
    if (!this.isConfigured || !this.openai) {
      throw new Error(
        "AI Service not configured. Please set up OpenAI API key.",
      );
    }

    // Check cache first if enabled
    if (useCache) {
      const cachedResponse = await this.storageService.getCachedAIResponse(
        userMessage,
        24,
      );
      if (cachedResponse) {
        return {
          message: cachedResponse,
          confidence: 0.95,
          sources: ["cached"],
        };
      }
    }

    try {
      const prompt = this.generateHealthPrompt(healthContext, userMessage);

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", // Cost-effective model that's good for health coaching
        messages: [
          { role: "system", content: this.getSystemPrompt() },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiMessage =
        completion.choices[0]?.message?.content ||
        "I'm sorry, I couldn't generate a response right now. Please try asking your question differently.";

      // Store response in cache
      const healthContextString = this.formatHealthContext(healthContext);
      await this.storageService.storeAIResponse(
        userMessage,
        aiMessage,
        healthContextString,
      );

      return {
        message: aiMessage,
        confidence: 0.9,
        sources: ["openai-gpt4o-mini"],
      };
    } catch (error: any) {
      // Fallback to rule-based response
      return this.generateFallbackResponse(userMessage, healthContext);
    }
  }

  private generateFallbackResponse(
    userMessage: string,
    healthContext: HealthContext,
  ): AIResponse {
    const input = userMessage.toLowerCase();

    // Sleep-related questions
    if (
      input.includes("sleep") ||
      input.includes("rem") ||
      input.includes("deep")
    ) {
      const sleepQuality =
        (healthContext.currentMetrics.deepSleepPercentage +
          healthContext.currentMetrics.remSleepPercentage +
          healthContext.currentMetrics.sleepConsistency) /
        3;

      if (sleepQuality > 70) {
        return {
          message: `Your sleep metrics look great! With ${healthContext.currentMetrics.deepSleepPercentage}% deep sleep and ${healthContext.currentMetrics.remSleepPercentage}% REM sleep, plus ${healthContext.currentMetrics.sleepConsistency}% consistency, you're doing well. Your sleep trend is ${healthContext.recentTrends.sleepTrend}. Keep maintaining your good sleep hygiene!`,
          confidence: 0.8,
          sources: ["fallback"],
        };
      } else {
        return {
          message: `I see some opportunities to improve your sleep quality. Your current deep sleep is at ${healthContext.currentMetrics.deepSleepPercentage}% and REM sleep at ${healthContext.currentMetrics.remSleepPercentage}%. Try maintaining a consistent bedtime, creating a cool, dark environment, and avoiding screens before bed. Your sleep consistency score of ${healthContext.currentMetrics.sleepConsistency}% suggests working on a regular schedule could help.`,
          confidence: 0.8,
          sources: ["fallback"],
        };
      }
    }

    // Heart health questions
    if (
      input.includes("heart") ||
      input.includes("hrv") ||
      input.includes("cardiovascular")
    ) {
      const rhr = healthContext.currentMetrics.restingHeartRate;
      const hrv = healthContext.currentMetrics.heartRateVariability;

      return {
        message: `Your cardiovascular health shows a resting heart rate of ${rhr} bpm and HRV of ${hrv} ms. ${rhr < 70 ? "Your resting heart rate is in a good range!" : "There's room to improve your resting heart rate through cardio exercise."} ${hrv > 35 ? "Your heart rate variability indicates good recovery capacity." : "Consider stress management and recovery techniques to improve HRV."} Your heart health trend is ${healthContext.recentTrends.heartHealthTrend}.`,
        confidence: 0.8,
        sources: ["fallback"],
      };
    }

    // Vitality score questions
    if (
      input.includes("score") ||
      input.includes("vitality") ||
      input.includes("fitness")
    ) {
      return {
        message: `Your current vitality score is ${healthContext.vitalityScore}/100, putting you in the "${healthContext.fitnessLevel}" category. This score combines your cardiovascular health (30%), recovery & sleep (35%), activity & training (30%), and consistency (5%). ${healthContext.topConcerns.length > 0 ? `Focus areas include: ${healthContext.topConcerns.join(", ")}.` : ""} ${healthContext.strengths.length > 0 ? `Your strengths are: ${healthContext.strengths.join(", ")}.` : ""} What specific area would you like to work on?`,
        confidence: 0.8,
        sources: ["fallback"],
      };
    }

    // Activity and training questions
    if (
      input.includes("training") ||
      input.includes("exercise") ||
      input.includes("activity") ||
      input.includes("steps")
    ) {
      const steps = healthContext.currentMetrics.averageSteps;
      const training = healthContext.currentMetrics.monthlyTrainingTime / 4; // Convert monthly to weekly

      return {
        message: `Your activity levels show ${steps} daily steps and ${training} minutes of weekly training. ${steps >= 8000 ? "Great job on your daily activity!" : "Try to increase your daily steps toward 8,000-10,000."} ${training >= 150 ? "You're meeting the recommended exercise guidelines!" : "Aim for 150+ minutes of exercise weekly for optimal health."} Your activity trend is ${healthContext.recentTrends.activityTrend}. Consistency is key for long-term health benefits.`,
        confidence: 0.8,
        sources: ["fallback"],
      };
    }

    // General response
    return {
      message: `Based on your vitality score of ${healthContext.vitalityScore}/100 (${healthContext.fitnessLevel}), I can help you understand your health data better. Your key areas for focus are: ${healthContext.topConcerns.join(", ") || "maintaining current progress"}. What specific aspect of your health would you like to explore? I can discuss your sleep patterns, cardiovascular metrics, training data, or overall vitality score.`,
      confidence: 0.7,
      sources: ["fallback"],
    };
  }

  async generateHealthInsights(
    healthContext: HealthContext,
  ): Promise<AIResponse> {
    const insightPrompt = `Please provide 3-4 key insights about this user's health data, focusing on their most important trends and opportunities for improvement.`;

    return await this.generateResponse(insightPrompt, healthContext, false);
  }

  async generateRecommendations(
    healthContext: HealthContext,
  ): Promise<AIResponse> {
    const recommendationPrompt = `Based on this user's health data and trends, please provide 3-4 specific, actionable recommendations for improving their vitality score.`;

    return await this.generateResponse(
      recommendationPrompt,
      healthContext,
      false,
    );
  }

  getConfigurationStatus(): { isConfigured: boolean; hasApiKey: boolean } {
    return {
      isConfigured: this.isConfigured,
      hasApiKey: this.openai !== null,
    };
  }
}

export default AIService.getInstance();
