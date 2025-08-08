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

export default function ActivityScreen() {
  const { healthMetrics } = useHealthData();
  const monthlyAverage = calculateMonthlyAverage(healthMetrics);
  const backgroundColor = useThemeColor({}, "background");
  const currentResult = calculateFitnessScore(healthMetrics);
  const findCategoryIndex = (dataArray: any, metricToFind: string): number => {
    return dataArray.findIndex((item: any) => item.metric === metricToFind);
  };

  const activityMetrics = useMemo(() => {
    const dailyStepsIndex = findCategoryIndex(
      currentResult.historyItems,
      "Daily Steps",
    );
    const trainingIntensityIndex = findCategoryIndex(
      currentResult.historyItems,
      "Training Intensity",
    );
    const trainingTimeIndex = findCategoryIndex(
      currentResult.historyItems,
      "Daily Training Time",
    );

    return {
      dailySteps: {
        percentage:
          currentResult.historyItems[dailyStepsIndex].points /
          currentResult.historyItems[dailyStepsIndex].maxPoints,
        points: currentResult.historyItems[dailyStepsIndex].points,
      },
      trainingIntensity: {
        percentage:
          currentResult.historyItems[trainingIntensityIndex].points /
          currentResult.historyItems[trainingIntensityIndex].maxPoints,
        points: currentResult.historyItems[trainingIntensityIndex].points,
      },
      trainingTime: {
        percentage:
          currentResult.historyItems[trainingTimeIndex].points /
          currentResult.historyItems[trainingTimeIndex].maxPoints,
        points: currentResult.historyItems[trainingTimeIndex].points,
      },
    };
  }, [currentResult.historyItems]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <HeaderBackText title="Activity" backTitle="Home" />
      <ScrollView
        style={[styles.container, { backgroundColor }]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>
          {/* Overview Card */}
          <Card style={styles.overviewCard}>
            <Card.Content style={styles.cardContent}>
              <ThemedText type="subtitle" style={styles.categoryTitle}>
                Activity & Training
              </ThemedText>
              <Text variant="headlineLarge" style={styles.totalScore}>
                {monthlyAverage.activityPoints}/30
              </Text>
              <ProgressBar
                progress={monthlyAverage.activityPoints / 30}
                style={styles.totalProgressBar}
              />
              <Text variant="bodyMedium" style={styles.description}>
                Physical activity & training metrics
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
                  🏋️ Training Time
                </Text>
                <Text variant="titleLarge" style={styles.metricScore}>
                  {activityMetrics.trainingTime.points}/12
                </Text>
              </View>
              <ProgressBar
                progress={activityMetrics.trainingTime.percentage}
                style={styles.progressBar}
              />
              <Text variant="bodySmall" style={styles.metricDescription}>
                Builds strength & endurance
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.metricCard}>
            <Card.Content style={styles.metricContent}>
              <View style={styles.metricHeader}>
                <Text variant="titleMedium" style={styles.metricName}>
                  🎯 Training Intensity & Consistency
                </Text>
                <Text variant="titleLarge" style={styles.metricScore}>
                  {activityMetrics.trainingIntensity.points}/10
                </Text>
              </View>
              <ProgressBar
                progress={activityMetrics.trainingIntensity.percentage}
                style={styles.progressBar}
              />
              <Text variant="bodySmall" style={styles.metricDescription}>
                Consistency yields optimal results
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.metricCard}>
            <Card.Content style={styles.metricContent}>
              <View style={styles.metricHeader}>
                <Text variant="titleMedium" style={styles.metricName}>
                  👟 Daily Activity (Steps)
                </Text>
                <Text variant="titleLarge" style={styles.metricScore}>
                  {activityMetrics.dailySteps.points}/8
                </Text>
              </View>
              <ProgressBar
                progress={activityMetrics.dailySteps.percentage}
                style={styles.progressBar}
              />
              <Text variant="bodySmall" style={styles.metricDescription}>
                Daily movement for health
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
                  <Text style={styles.tipEmoji}>🗓️</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    150min/week
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🏋️</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    Mix cardio & strength
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🚂</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    Take stairs daily
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>📊</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    8-10k steps goal
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
    color: "#FF9800",
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
