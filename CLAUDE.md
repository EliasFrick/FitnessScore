# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VitalityScore is an Expo React Native fitness app that calculates health scores from Apple HealthKit data. iOS-only for health features.

## Development Commands

```bash
bun install              # Install deps (uses Bun)
npx expo start           # Dev server
npx expo start --dev-client  # With dev client
npm run ios              # iOS simulator (expo run:ios)
npm run android          # Android emulator
npm run lint             # ESLint
```

## Architecture

### Data Flow
```
HealthKit → services/healthService.ts → hooks/useHealthData.ts → UI
                     ↓
         services/*DataProviders.ts (fetch specific metrics)
                     ↓
         utils/fitnessCalculator.ts → categoryCalculators.ts → scoringUtils.ts
```

### Key Files
- `services/healthService.ts` - Singleton HealthService, HealthKit init + data fetching
- `services/healthDataProviders.ts` - Individual metric fetchers (RHR, HRV, VO2Max, sleep, steps)
- `services/workoutDataProviders.ts` - Workout/training data
- `utils/fitnessCalculator.ts` - Main `calculateFitnessScore()` function
- `utils/categoryCalculators.ts` - Point calculations per category
- `hooks/useHealthData.ts` - React hook wrapping HealthService
- `types/health.ts` - HealthMetrics, FitnessScoreResult interfaces
- `constants/healthThresholds.ts` - Scoring thresholds

### Routing (Expo Router)
- `app/_layout.tsx` - Root layout w/ ThemeProvider + PaperProvider
- `app/(tabs)/index.tsx` - Main overview screen
- `app/cardiovascular.tsx`, `app/recovery.tsx`, `app/activity.tsx`, `app/bonus.tsx` - Detail screens

### Theme System
- `contexts/ThemeContext.tsx` - Custom theme provider with manual toggle
- `hooks/useThemeColor.ts` - Get themed colors
- `constants/Colors.ts` - Light/dark color definitions
- Uses react-native-paper for UI components

## Scoring System (100 pts total)

| Category | Max Points | Metrics |
|----------|------------|---------|
| Cardiovascular | 30 | RHR (10), HRV (10), VO2Max (10) |
| Recovery | 35 | Deep Sleep % (15), REM % (12), Consistency (8) |
| Activity | 30 | Training Time (12), Intensity (10), Steps (8) |
| Bonus | 5 | Consistency across categories |

Fitness levels: 90-100 "Top Form!", 70-89 "Strong & Active", 50-69 "Solid Progress", 30-49 "On The Way", 0-29 "Time For Change"

## Notes
- HealthKit requires iOS physical device or simulator with Health app
- `react-native-health` has missing function workaround in healthService.ts
- Uses expo-sqlite for potential local storage