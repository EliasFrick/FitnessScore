# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VitalityScore is an Expo React Native app that uses file-based routing with expo-router. The app supports iOS, Android, and web platforms with automatic theme switching (light/dark mode).

## Development Commands

- `npm run start` or `npx expo start` - Start the Expo development server
- `npm run android` - Start for Android emulator
- `npm run ios` - Start for iOS simulator  
- `npm run web` - Start for web browser
- `npm run lint` - Run ESLint checks
- `npm run reset-project` - Reset to clean starter (moves current app to app-example)

## Architecture

### Routing Structure
- Uses Expo Router v7 with file-based routing and typed routes enabled
- Main app entry: `app/_layout.tsx` (root stack navigator with theme provider)
- Tab navigation: `app/(tabs)/_layout.tsx` with Home and Explore tabs
- Screens: `app/(tabs)/index.tsx` (Home), `app/(tabs)/explore.tsx`
- 404 handling: `app/+not-found.tsx`

### Component System
- **Themed components**: `ThemedText` and `ThemedView` adapt to light/dark themes
- **UI components**: Custom IconSymbol, TabBarBackground, HapticTab for native feel
- **Reusable components**: Collapsible, ParallaxScrollView, ExternalLink, HelloWave
- **Platform-specific files**: `.ios.tsx` variants for iOS-specific implementations

### Theme and Styling
- Colors defined in `constants/Colors.ts` with light/dark variants
- Theme detection via `hooks/useColorScheme` with web fallback
- `useThemeColor` hook for component-level theme access
- Automatic StatusBar and theme switching

### Dependencies
- Expo SDK 53, React 19, React Native 0.79
- Navigation: React Navigation v7 with bottom tabs
- UI: Expo Symbols for icons, Expo Blur for effects
- Fonts: SpaceMono loaded via expo-font
- Package manager: Uses Bun (bun.lock present)

### Platform Support
- iOS: Supports tablets, edge-to-edge, blur effects
- Android: Adaptive icons, edge-to-edge enabled  
- Web: Metro bundler, static output, custom favicon
- New Architecture enabled for performance

## VitalityScore Metric Calculation Scheme

### Scoring Methodology
- Comprehensive fitness scoring system with detailed point allocation
- Covers four main areas: Cardiovascular Health, Recovery & Regeneration, Activity & Training, and Bonus Metrics
- Total possible score: 100 points
- Calculates fitness level based on overall performance

### Scoring Breakdown
- A. Cardiovascular Health (Max 30 Points)
  - Resting Heart Rate (RHR)
  - Heart Rate Variability (HRV)
  - VO2 Max estimation

- B. Recovery & Regeneration (Max 35 Points)
  - Deep Sleep Percentage
  - REM Sleep Percentage
  - Sleep Consistency

- C. Activity & Training (Max 30 Points)
  - Weekly Training Time
  - Training Intensity/Consistency
  - Daily Activity (Steps)

- D. Bonus Metric (Max 5 Points)
  - Overall Consistency Across Categories

### Fitness Level Classification
- 90-100: "Top Form!"
- 70-89: "Strong & Active"
- 50-69: "Solid Progress"
- 30-49: "On The Way"
- 0-29: "Time For Change"

### Detailed Scoring Algorithm
- Uses granular point allocation based on specific health metrics
- Dynamically calculates points for each category
- Rewards consistent performance across different health domains
- Provides actionable insights into overall fitness level