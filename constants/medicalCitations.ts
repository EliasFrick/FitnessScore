/**
 * Medical Citations and Sources
 * All health thresholds and recommendations are based on peer-reviewed research
 */

export interface MedicalSource {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  url: string;
  description: string;
}

export const MEDICAL_SOURCES: Record<string, MedicalSource> = {
  AHA_HEART_RATE: {
    id: "aha_heart_rate",
    title: "Target Heart Rates and Estimated Maximum Heart Rates",
    authors: "American Heart Association",
    journal: "American Heart Association Scientific Statement",
    year: 2024,
    url: "https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates",
    description: "Guidelines for resting heart rate ranges and cardiovascular health indicators"
  },
  HRV_RESEARCH: {
    id: "hrv_research",
    title: "Heart rate variability: Standards of measurement, physiological interpretation, and clinical use",
    authors: "Task Force of the European Society of Cardiology and the North American Society of Pacing and Electrophysiology",
    journal: "European Heart Journal",
    year: 1996,
    url: "https://doi.org/10.1093/oxfordjournals.eurheartj.a014868",
    description: "Comprehensive standards for HRV measurement and interpretation"
  },
  VO2_MAX_STANDARDS: {
    id: "vo2_max_standards",
    title: "ACSM's Guidelines for Exercise Testing and Prescription",
    authors: "American College of Sports Medicine",
    journal: "ACSM Guidelines 11th Edition",
    year: 2022,
    url: "https://www.acsm.org/education-resources/books/guidelines-exercise-testing-prescription",
    description: "Evidence-based standards for VO2 max assessment and fitness levels"
  },
  SLEEP_FOUNDATION: {
    id: "sleep_foundation",
    title: "Sleep Architecture and Sleep Stages",
    authors: "National Sleep Foundation",
    journal: "Sleep Health Foundation Guidelines",
    year: 2023,
    url: "https://www.sleepfoundation.org/stages-of-sleep",
    description: "Scientific guidelines for healthy sleep architecture including deep sleep and REM percentages"
  },
  WHO_PHYSICAL_ACTIVITY: {
    id: "who_physical_activity",
    title: "WHO guidelines on physical activity and sedentary behaviour",
    authors: "World Health Organization",
    journal: "WHO Press",
    year: 2020,
    url: "https://www.who.int/publications/i/item/9789240015128",
    description: "Global evidence-based recommendations for physical activity levels and health benefits"
  },
  STEPS_RESEARCH: {
    id: "steps_research",
    title: "Daily steps and all-cause mortality: a meta-analysis of 15 international cohorts",
    authors: "Paluch AE, et al.",
    journal: "The Lancet Public Health",
    year: 2022,
    url: "https://doi.org/10.1016/S2468-2667(21)00302-9",
    description: "Meta-analysis establishing optimal daily step counts for health benefits"
  }
};

export const METRIC_TO_SOURCES: Record<string, string[]> = {
  restingHeartRate: ["aha_heart_rate"],
  heartRateVariability: ["hrv_research"],
  vo2Max: ["vo2_max_standards"],
  deepSleep: ["sleep_foundation"],
  remSleep: ["sleep_foundation"],
  sleepConsistency: ["sleep_foundation"],
  trainingTime: ["who_physical_activity"],
  trainingIntensity: ["who_physical_activity"],
  dailySteps: ["steps_research", "who_physical_activity"]
};

export function getSourcesForMetric(metric: string): MedicalSource[] {
  const sourceIds = METRIC_TO_SOURCES[metric] || [];
  return sourceIds.map(id => MEDICAL_SOURCES[id]).filter(Boolean);
}

export function getAllSources(): MedicalSource[] {
  return Object.values(MEDICAL_SOURCES);
}