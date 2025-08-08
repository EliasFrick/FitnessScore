import React, { useMemo } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HeaderBackText } from "@/components/ui/HeaderBackText";
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
  const findCategoryIndex = (dataArray: any, metricToFind: string): number => {
    return dataArray.findIndex((item: any) => item.metric === metricToFind);
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
      },
      heartRateVariability: {
        percentage:
          currentResult.historyItems[heartRateVariabilityIndex].points /
          currentResult.historyItems[heartRateVariabilityIndex].maxPoints,
        points: currentResult.historyItems[heartRateVariabilityIndex].points,
      },
      vo2Max: {
        percentage:
          currentResult.historyItems[vo2MaxIndex].points /
          currentResult.historyItems[vo2MaxIndex].maxPoints,
        points: currentResult.historyItems[vo2MaxIndex].points,
      },
    };
  }, [currentResult.historyItems]);

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
              <Text variant="bodySmall" style={styles.metricDescription}>
                Lower = better fitness
              </Text>
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
              <Text variant="bodySmall" style={styles.metricDescription}>
                Higher = better recovery
              </Text>
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
              <Text variant="bodySmall" style={styles.metricDescription}>
                Maximum oxygen uptake
              </Text>
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
  metricDescription: {
    opacity: 0.7,
    lineHeight: 16,
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
