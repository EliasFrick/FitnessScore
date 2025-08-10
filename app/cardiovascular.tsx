import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";

import { MedicalCitationsModal } from "@/components/MedicalCitationsModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HeaderBackText } from "@/components/ui/HeaderBackText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import {
  HEART_RATE_THRESHOLDS,
  HRV_THRESHOLDS,
  VO2_MAX_THRESHOLDS,
} from "@/constants/healthThresholds";
import { getSourcesForMetric } from "@/constants/medicalCitations";
import { useHealthData } from "@/hooks/useHealthData";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  calculateFitnessScore,
  calculateMonthlyAverage,
} from "@/utils/fitnessCalculator";

export default function CardiovascularScreen() {
  const { healthMetrics } = useHealthData();
  const monthlyAverage = calculateMonthlyAverage(healthMetrics);
  const backgroundColor = useThemeColor({}, "background");
  const currentResult = calculateFitnessScore(healthMetrics);
  const [showCitationsModal, setShowCitationsModal] = useState(false);
  const findCategoryIndex = (dataArray: any, metricToFind: string): number => {
    return dataArray.findIndex((item: any) => item.metric === metricToFind);
  };

  const getNextTarget = (
    currentValue: number,
    currentPoints: number,
    maxPoints: number,
    type: "rhr" | "hrv" | "vo2max",
  ) => {
    if (currentPoints >= maxPoints) return null;

    if (type === "rhr") {
      if (currentValue > HEART_RATE_THRESHOLDS.ELEVATED)
        return `Get below ${HEART_RATE_THRESHOLDS.ELEVATED} bpm for +1 point`;
      if (currentValue > HEART_RATE_THRESHOLDS.AVERAGE)
        return `Get below ${HEART_RATE_THRESHOLDS.AVERAGE} bpm for +2 more points`;
      if (currentValue > HEART_RATE_THRESHOLDS.GOOD)
        return `Get below ${HEART_RATE_THRESHOLDS.GOOD} bpm for +2 more points`;
      if (currentValue > HEART_RATE_THRESHOLDS.VERY_GOOD)
        return `Get below ${HEART_RATE_THRESHOLDS.VERY_GOOD} bpm for +2 more points`;
      if (currentValue > HEART_RATE_THRESHOLDS.EXCELLENT)
        return `Get below ${HEART_RATE_THRESHOLDS.EXCELLENT} bpm for +2 more points`;
    } else if (type === "hrv") {
      if (currentValue < HRV_THRESHOLDS.BELOW_AVERAGE)
        return `Get above ${HRV_THRESHOLDS.BELOW_AVERAGE} ms for +2 more points`;
      if (currentValue < HRV_THRESHOLDS.GOOD)
        return `Get above ${HRV_THRESHOLDS.GOOD} ms for +2 more points`;
      if (currentValue < HRV_THRESHOLDS.VERY_GOOD)
        return `Get above ${HRV_THRESHOLDS.VERY_GOOD} ms for +2 more points`;
      if (currentValue < HRV_THRESHOLDS.OUTSTANDING)
        return `Get above ${HRV_THRESHOLDS.OUTSTANDING} ms for +2 more points`;
    } else if (type === "vo2max") {
      if (currentValue < VO2_MAX_THRESHOLDS.AVERAGE)
        return `Get above ${VO2_MAX_THRESHOLDS.AVERAGE} ml/kg/min for +2 more points`;
      if (currentValue < VO2_MAX_THRESHOLDS.GOOD)
        return `Get above ${VO2_MAX_THRESHOLDS.GOOD} ml/kg/min for +2 more points`;
      if (currentValue < VO2_MAX_THRESHOLDS.EXCELLENT)
        return `Get above ${VO2_MAX_THRESHOLDS.EXCELLENT} ml/kg/min for +2 more points`;
      if (currentValue < VO2_MAX_THRESHOLDS.OUTSTANDING)
        return `Get above ${VO2_MAX_THRESHOLDS.OUTSTANDING} ml/kg/min for +2 more points`;
    }
    return null;
  };

  const cardiovascularMetrics = useMemo(() => {
    const restingHeartRateIndex = findCategoryIndex(
      currentResult.historyItems,
      "Resting Heart Rate",
    );
    const heartRateVariabilityIndex = findCategoryIndex(
      currentResult.historyItems,
      "Heart Rate Variability",
    );
    const vo2MaxIndex = findCategoryIndex(
      currentResult.historyItems,
      "VO2 Max",
    );

    return {
      restingHeartRate: {
        percentage:
          currentResult.historyItems[restingHeartRateIndex].points /
          currentResult.historyItems[restingHeartRateIndex].maxPoints,
        points: currentResult.historyItems[restingHeartRateIndex].points,
        currentValue: healthMetrics.restingHeartRate,
        unit: "bpm",
        nextTarget: getNextTarget(
          healthMetrics.restingHeartRate,
          currentResult.historyItems[restingHeartRateIndex].points,
          10,
          "rhr",
        ),
      },
      heartRateVariability: {
        percentage:
          currentResult.historyItems[heartRateVariabilityIndex].points /
          currentResult.historyItems[heartRateVariabilityIndex].maxPoints,
        points: currentResult.historyItems[heartRateVariabilityIndex].points,
        currentValue: healthMetrics.heartRateVariability,
        unit: "ms",
        nextTarget: getNextTarget(
          healthMetrics.heartRateVariability,
          currentResult.historyItems[heartRateVariabilityIndex].points,
          10,
          "hrv",
        ),
      },
      vo2Max: {
        percentage:
          currentResult.historyItems[vo2MaxIndex].points /
          currentResult.historyItems[vo2MaxIndex].maxPoints,
        points: currentResult.historyItems[vo2MaxIndex].points,
        currentValue: healthMetrics.vo2Max,
        unit: "ml/kg/min",
        nextTarget: getNextTarget(
          healthMetrics.vo2Max,
          currentResult.historyItems[vo2MaxIndex].points,
          10,
          "vo2max",
        ),
      },
    };
  }, [currentResult.historyItems, healthMetrics]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <HeaderBackText title="Cardiovascular" backTitle="Home" />
      <ScrollView
        style={[styles.container, { backgroundColor }]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>
          {/* Overview Card */}
          <Card style={styles.overviewCard}>
            <Card.Content style={styles.cardContent}>
              <ThemedText type="subtitle" style={styles.categoryTitle}>
                Cardiovascular Health
              </ThemedText>
              <Text variant="headlineLarge" style={styles.totalScore}>
                {monthlyAverage.cardiovascularPoints}/30
              </Text>
              <ProgressBar
                progress={monthlyAverage.cardiovascularPoints / 30}
                style={styles.totalProgressBar}
              />
              <Text variant="bodyMedium" style={styles.description}>
                Heart health & fitness metrics
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
                  💓 Resting Heart Rate
                </Text>
                <Text variant="titleLarge" style={styles.metricScore}>
                  {cardiovascularMetrics.restingHeartRate.points}/10
                </Text>
              </View>
              <ProgressBar
                progress={cardiovascularMetrics.restingHeartRate.percentage}
                style={styles.progressBar}
              />
              <View style={styles.metricInfo}>
                <Text variant="bodySmall" style={styles.currentValue}>
                  Current: {cardiovascularMetrics.restingHeartRate.currentValue}{" "}
                  {cardiovascularMetrics.restingHeartRate.unit}
                </Text>
              </View>
              {cardiovascularMetrics.restingHeartRate.nextTarget && (
                <Text variant="bodySmall" style={styles.nextTarget}>
                  🎯 {cardiovascularMetrics.restingHeartRate.nextTarget}
                </Text>
              )}
            </Card.Content>
          </Card>

          <Card style={styles.metricCard}>
            <Card.Content style={styles.metricContent}>
              <View style={styles.metricHeader}>
                <Text variant="titleMedium" style={styles.metricName}>
                  📊 Heart Rate Variability
                </Text>
                <Text variant="titleLarge" style={styles.metricScore}>
                  {cardiovascularMetrics.heartRateVariability.points}/10
                </Text>
              </View>
              <ProgressBar
                progress={cardiovascularMetrics.heartRateVariability.percentage}
                style={styles.progressBar}
              />
              <View style={styles.metricInfo}>
                <Text variant="bodySmall" style={styles.currentValue}>
                  Current:{" "}
                  {cardiovascularMetrics.heartRateVariability.currentValue}{" "}
                  {cardiovascularMetrics.heartRateVariability.unit}
                </Text>
              </View>
              {cardiovascularMetrics.heartRateVariability.nextTarget && (
                <Text variant="bodySmall" style={styles.nextTarget}>
                  🎯 {cardiovascularMetrics.heartRateVariability.nextTarget}
                </Text>
              )}
            </Card.Content>
          </Card>

          <Card style={styles.metricCard}>
            <Card.Content style={styles.metricContent}>
              <View style={styles.metricHeader}>
                <Text variant="titleMedium" style={styles.metricName}>
                  🫁 VO2 Max Estimation
                </Text>
                <Text variant="titleLarge" style={styles.metricScore}>
                  {cardiovascularMetrics.vo2Max.points}/10
                </Text>
              </View>
              <ProgressBar
                progress={cardiovascularMetrics.vo2Max.percentage}
                style={styles.progressBar}
              />
              <View style={styles.metricInfo}>
                <Text variant="bodySmall" style={styles.currentValue}>
                  Current: {cardiovascularMetrics.vo2Max.currentValue}{" "}
                  {cardiovascularMetrics.vo2Max.unit}
                </Text>
              </View>
              {cardiovascularMetrics.vo2Max.nextTarget && (
                <Text variant="bodySmall" style={styles.nextTarget}>
                  🎯 {cardiovascularMetrics.vo2Max.nextTarget}
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
                  <Text style={styles.tipEmoji}>🏃</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    Cardio 150min/week
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>⚡</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    Interval training
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🧘</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    Manage stress
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🐟</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    Omega-3 rich diet
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  citationsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
  },
  sourcesHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
  },
  sourcesHintText: {
    fontSize: 12,
    opacity: 0.6,
    flex: 1,
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
    color: "#2196F3",
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
