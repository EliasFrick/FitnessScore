import React, { useMemo } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HeaderBackText } from "@/components/ui/HeaderBackText";
import {
  DEEP_SLEEP_THRESHOLDS,
  REM_SLEEP_THRESHOLDS,
} from "@/constants/healthThresholds";
import { useHealthData } from "@/hooks/useHealthData";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  calculateFitnessScore,
  calculateMonthlyAverage,
} from "@/utils/fitnessCalculator";

export default function RecoveryScreen() {
  const { healthMetrics } = useHealthData();
  const monthlyAverage = calculateMonthlyAverage(healthMetrics);
  const backgroundColor = useThemeColor({}, "background");
  const currentResult = calculateFitnessScore(healthMetrics);
  const findCategoryIndex = (dataArray: any, metricToFind: string): number => {
    return dataArray.findIndex((item: any) => item.metric === metricToFind);
  };

  const getNextTarget = (
    currentValue: number,
    currentPoints: number,
    maxPoints: number,
    type: "deep" | "rem" | "consistency"
  ) => {
    if (currentPoints >= maxPoints) return null;

    if (type === "deep") {
      if (currentValue < DEEP_SLEEP_THRESHOLDS.BELOW_AVERAGE)
        return `Get above ${DEEP_SLEEP_THRESHOLDS.BELOW_AVERAGE}% for +3 more points`;
      if (currentValue < DEEP_SLEEP_THRESHOLDS.AVERAGE)
        return `Get above ${DEEP_SLEEP_THRESHOLDS.AVERAGE}% for +2 more points`;
      if (currentValue < DEEP_SLEEP_THRESHOLDS.GOOD)
        return `Get above ${DEEP_SLEEP_THRESHOLDS.GOOD}% for +3 more points`;
      if (currentValue < DEEP_SLEEP_THRESHOLDS.VERY_GOOD)
        return `Get above ${DEEP_SLEEP_THRESHOLDS.VERY_GOOD}% for +3 more points`;
      if (currentValue < DEEP_SLEEP_THRESHOLDS.EXCELLENT)
        return `Get above ${DEEP_SLEEP_THRESHOLDS.EXCELLENT}% for +3 more points`;
    } else if (type === "rem") {
      if (currentValue < REM_SLEEP_THRESHOLDS.AVERAGE)
        return `Get above ${REM_SLEEP_THRESHOLDS.AVERAGE}% for +3 more points`;
      if (currentValue < REM_SLEEP_THRESHOLDS.GOOD)
        return `Get above ${REM_SLEEP_THRESHOLDS.GOOD}% for +3 more points`;
      if (currentValue < REM_SLEEP_THRESHOLDS.VERY_GOOD)
        return `Get above ${REM_SLEEP_THRESHOLDS.VERY_GOOD}% for +3 more points`;
      if (currentValue < REM_SLEEP_THRESHOLDS.EXCELLENT)
        return `Get above ${REM_SLEEP_THRESHOLDS.EXCELLENT}% for +3 more points`;
    } else if (type === "consistency") {
      if (currentValue < 5) return `Get above 5/10 for +2 more points`;
      if (currentValue < 7) return `Get above 7/10 for +2 more points`;
      if (currentValue < 8.5) return `Get above 8.5/10 for +2 more points`;
    }
    return null;
  };

  const recoveryMetrics = useMemo(() => {
    const deepSleepIndex = findCategoryIndex(
      currentResult.historyItems,
      "Deep Sleep"
    );
    const remSleepIndex = findCategoryIndex(
      currentResult.historyItems,
      "REM Sleep"
    );
    const sleepConsistencyIndex = findCategoryIndex(
      currentResult.historyItems,
      "Sleep Consistency"
    );

    return {
      deepSleep: {
        percentage:
          currentResult.historyItems[deepSleepIndex].points /
          currentResult.historyItems[deepSleepIndex].maxPoints,
        points: currentResult.historyItems[deepSleepIndex].points,
        currentValue: healthMetrics.deepSleepPercentage,
        unit: "%",
        nextTarget: getNextTarget(
          healthMetrics.deepSleepPercentage,
          currentResult.historyItems[deepSleepIndex].points,
          15,
          "deep"
        ),
      },
      remSleep: {
        percentage:
          currentResult.historyItems[remSleepIndex].points /
          currentResult.historyItems[remSleepIndex].maxPoints,
        points: currentResult.historyItems[remSleepIndex].points,
        currentValue: healthMetrics.remSleepPercentage,
        unit: "%",
        nextTarget: getNextTarget(
          healthMetrics.remSleepPercentage,
          currentResult.historyItems[remSleepIndex].points,
          12,
          "rem"
        ),
      },
      sleepConsistency: {
        percentage:
          currentResult.historyItems[sleepConsistencyIndex].points /
          currentResult.historyItems[sleepConsistencyIndex].maxPoints,
        points: currentResult.historyItems[sleepConsistencyIndex].points,
        currentValue: healthMetrics.sleepConsistency,
        unit: "/10",
        nextTarget: getNextTarget(
          healthMetrics.sleepConsistency,
          currentResult.historyItems[sleepConsistencyIndex].points,
          8,
          "consistency"
        ),
      },
    };
  }, [currentResult.historyItems, healthMetrics]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <HeaderBackText title="Recovery" backTitle="Home" />
      <ScrollView
        style={[styles.container, { backgroundColor }]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>
          {/* Overview Card */}
          <Card style={styles.overviewCard}>
            <Card.Content style={styles.cardContent}>
              <ThemedText type="subtitle" style={styles.categoryTitle}>
                Recovery & Regeneration
              </ThemedText>
              <Text variant="headlineLarge" style={styles.totalScore}>
                {monthlyAverage.recoveryPoints}/35
              </Text>
              <ProgressBar
                progress={monthlyAverage.recoveryPoints / 35}
                style={styles.totalProgressBar}
              />
              <Text variant="bodyMedium" style={styles.description}>
                Recovery & sleep quality metrics
              </Text>
            </Card.Content>
          </Card>

          {/* Detailed Breakdown */}
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Detailed Breakdown
          </ThemedText>

          <Card style={styles.metricCard}>
            <Card.Content style={styles.metricContent}>
              <View style={styles.metricHeader}>
                <Text variant="titleMedium" style={styles.metricName}>
                  😴 Deep Sleep Percentage
                </Text>
                <Text variant="titleLarge" style={styles.metricScore}>
                  {recoveryMetrics.deepSleep.points}/15
                </Text>
              </View>
              <ProgressBar
                progress={recoveryMetrics.deepSleep.percentage}
                style={styles.progressBar}
              />
              <View style={styles.metricInfo}>
                <Text variant="bodySmall" style={styles.currentValue}>
                  Current: {recoveryMetrics.deepSleep.currentValue}
                  {recoveryMetrics.deepSleep.unit}
                </Text>
                <Text variant="bodySmall" style={styles.metricDescription}>
                  Physical recovery & immune function
                </Text>
              </View>
              {recoveryMetrics.deepSleep.nextTarget && (
                <Text variant="bodySmall" style={styles.nextTarget}>
                  🎯 {recoveryMetrics.deepSleep.nextTarget}
                </Text>
              )}
            </Card.Content>
          </Card>

          <Card style={styles.metricCard}>
            <Card.Content style={styles.metricContent}>
              <View style={styles.metricHeader}>
                <Text variant="titleMedium" style={styles.metricName}>
                  🌙 REM Sleep Percentage
                </Text>
                <Text variant="titleLarge" style={styles.metricScore}>
                  {recoveryMetrics.remSleep.points}/12
                </Text>
              </View>
              <ProgressBar
                progress={recoveryMetrics.remSleep.percentage}
                style={styles.progressBar}
              />
              <View style={styles.metricInfo}>
                <Text variant="bodySmall" style={styles.currentValue}>
                  Current: {recoveryMetrics.remSleep.currentValue}
                  {recoveryMetrics.remSleep.unit}
                </Text>
                <Text variant="bodySmall" style={styles.metricDescription}>
                  Cognitive & emotional health
                </Text>
              </View>
              {recoveryMetrics.remSleep.nextTarget && (
                <Text variant="bodySmall" style={styles.nextTarget}>
                  🎯 {recoveryMetrics.remSleep.nextTarget}
                </Text>
              )}
            </Card.Content>
          </Card>

          <Card style={styles.metricCard}>
            <Card.Content style={styles.metricContent}>
              <View style={styles.metricHeader}>
                <Text variant="titleMedium" style={styles.metricName}>
                  ⏰ Sleep Consistency
                </Text>
                <Text variant="titleLarge" style={styles.metricScore}>
                  {recoveryMetrics.sleepConsistency.points}/8
                </Text>
              </View>
              <ProgressBar
                progress={recoveryMetrics.sleepConsistency.percentage}
                style={styles.progressBar}
              />
              <View style={styles.metricInfo}>
                <Text variant="bodySmall" style={styles.metricDescription}>
                  Optimizes circadian rhythm
                </Text>
              </View>
              {recoveryMetrics.sleepConsistency.nextTarget && (
                <Text variant="bodySmall" style={styles.nextTarget}>
                  🎯 {recoveryMetrics.sleepConsistency.nextTarget}
                </Text>
              )}
            </Card.Content>
          </Card>

          {/* Quick Tips */}
          <Card style={styles.tipsCard}>
            <Card.Content style={styles.quickTipsContent}>
              <ThemedText type="subtitle" style={styles.tipsTitle}>
                💡 Quick Tips
              </ThemedText>
              <View style={styles.tipsGrid}>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>⏰</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    Consistent schedule
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🛐</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    Bedtime routine
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🌙</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    Cool, dark room
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>📵</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    Limit screens
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  categoryTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  totalScore: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 12,
  },
  totalProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  description: {
    textAlign: "center",
    opacity: 0.7,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
    fontWeight: "600",
  },
  overviewCard: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  metricCard: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  tipsCard: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    marginTop: 8,
  },
  cardContent: {
    paddingVertical: 20,
  },
  metricContent: {
    paddingVertical: 16,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  metricName: {
    flex: 1,
    fontWeight: "600",
  },
  metricScore: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  metricInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentValue: {
    fontWeight: "500",
    opacity: 0.9,
  },
  metricDescription: {
    opacity: 0.7,
    lineHeight: 16,
  },
  nextTarget: {
    marginTop: 4,
    fontSize: 11,
    color: "#FF6B35",
    fontWeight: "500",
  },
  tipsTitle: {
    marginBottom: 16,
    fontWeight: "600",
  },
  quickTipsContent: {
    paddingVertical: 16,
  },
  tipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  tipItem: {
    alignItems: "center",
    width: "22%",
    minWidth: 70,
  },
  tipEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  tipLabel: {
    textAlign: "center",
    fontSize: 10,
    opacity: 0.8,
    lineHeight: 12,
  },
});
