import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HeaderBackText } from "@/components/ui/HeaderBackText";
import { useHealthData } from "@/hooks/useHealthData";
import { useThemeColor } from "@/hooks/useThemeColor";
import { calculateMonthlyAverage } from "@/utils/fitnessCalculator";

export default function BonusScreen() {
  const { healthMetrics } = useHealthData();
  const monthlyAverage = calculateMonthlyAverage(healthMetrics);
  const backgroundColor = useThemeColor({}, "background");

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <HeaderBackText title="Bonus" backTitle="Home" />
      <ScrollView
        style={[styles.container, { backgroundColor }]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>
          {/* Overview Card */}
          <Card style={styles.overviewCard}>
            <Card.Content style={styles.cardContent}>
              <ThemedText type="subtitle" style={styles.categoryTitle}>
                Bonus Metrics
              </ThemedText>
              <Text variant="headlineLarge" style={styles.totalScore}>
                {monthlyAverage.bonusPoints}/5
              </Text>
              <ProgressBar
                progress={monthlyAverage.bonusPoints / 5}
                style={styles.totalProgressBar}
              />
              <Text variant="bodyMedium" style={styles.description}>
                Extra points for consistency and balanced performance across all
                categories.
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
                  ⭐ Overall Consistency
                </Text>
                <Text variant="titleLarge" style={styles.metricScore}>
                  {monthlyAverage.bonusPoints}/5
                </Text>
              </View>
              <ProgressBar
                progress={monthlyAverage.bonusPoints / 5}
                style={styles.progressBar}
              />
              <Text variant="bodySmall" style={styles.metricDescription}>
                Bonus points awarded for consistent performance across all
                health categories.
              </Text>
            </Card.Content>
          </Card>

          {/* How Bonus Points Work */}
          <Card style={styles.infoCard}>
            <Card.Content style={styles.cardContent}>
              <ThemedText type="subtitle" style={styles.infoTitle}>
                🎯 How Bonus Points Work
              </ThemedText>
              <View style={styles.infoList}>
                <Text variant="bodyMedium" style={styles.infoText}>
                  • <Text style={styles.boldText}>Consistency Reward:</Text>{" "}
                  Points are awarded when you maintain balanced performance
                  across cardiovascular health, recovery, and activity metrics.
                </Text>
                <Text variant="bodyMedium" style={styles.infoText}>
                  • <Text style={styles.boldText}>Balanced Approach:</Text>{" "}
                  Rather than excelling in just one area, maintaining good
                  scores in all categories earns bonus points.
                </Text>
                <Text variant="bodyMedium" style={styles.infoText}>
                  • <Text style={styles.boldText}>Long-term Success:</Text>{" "}
                  Consistent performance over time demonstrates sustainable
                  healthy habits.
                </Text>
                <Text variant="bodyMedium" style={styles.infoText}>
                  • <Text style={styles.boldText}>Maximum Impact:</Text> These
                  bonus points can be the difference between fitness levels,
                  rewarding holistic health.
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Tips Section */}
          <Card style={styles.tipsCard}>
            <Card.Content style={styles.cardContent}>
              <ThemedText type="subtitle" style={styles.tipsTitle}>
                💡 Maximizing Bonus Points
              </ThemedText>
              <View style={styles.tipsList}>
                <Text variant="bodyMedium" style={styles.tipText}>
                  • Focus on improving your weakest health category first
                </Text>
                <Text variant="bodyMedium" style={styles.tipText}>
                  • Maintain consistent daily habits rather than sporadic
                  intense efforts
                </Text>
                <Text variant="bodyMedium" style={styles.tipText}>
                  • Balance cardiovascular exercise with strength training and
                  recovery
                </Text>
                <Text variant="bodyMedium" style={styles.tipText}>
                  • Track your metrics regularly to identify patterns and
                  improvements
                </Text>
                <Text variant="bodyMedium" style={styles.tipText}>
                  • Remember that small, consistent improvements compound over
                  time
                </Text>
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
  infoCard: {
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
    color: "#9C27B0",
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
  infoTitle: {
    marginBottom: 16,
    fontWeight: "600",
  },
  infoList: {
    gap: 12,
  },
  infoText: {
    lineHeight: 20,
    opacity: 0.8,
  },
  boldText: {
    fontWeight: "bold",
  },
  tipsTitle: {
    marginBottom: 16,
    fontWeight: "600",
  },
  tipsList: {
    gap: 8,
  },
  tipText: {
    lineHeight: 20,
    opacity: 0.8,
  },
});
