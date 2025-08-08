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

export default function BonusScreen() {
  const { healthMetrics } = useHealthData();
  const monthlyAverage = calculateMonthlyAverage(healthMetrics);
  const backgroundColor = useThemeColor({}, "background");
  const currentResult = calculateFitnessScore(healthMetrics);

  const bonusMetrics = useMemo(() => {
    return {
      overallConsistency: {
        percentage: currentResult.bonusPoints / 5,
        points: currentResult.bonusPoints,
      },
    };
  }, [currentResult.bonusPoints]);

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
                Consistency & balanced performance bonus
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
                  {bonusMetrics.overallConsistency.points}/5
                </Text>
              </View>
              <ProgressBar
                progress={bonusMetrics.overallConsistency.percentage}
                style={styles.progressBar}
              />
              <Text variant="bodySmall" style={styles.metricDescription}>
                Balanced health category performance
              </Text>
            </Card.Content>
          </Card>

          {/* How It Works */}
          <Card style={styles.infoCard}>
            <Card.Content style={styles.infoContent}>
              <ThemedText type="subtitle" style={styles.infoTitle}>
                🎯 How It Works
              </ThemedText>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoEmoji}>⚖️</Text>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Balanced across all areas
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoEmoji}>📈</Text>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Consistent over time
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoEmoji}>🏆</Text>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Holistic health reward
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoEmoji}>⬆️</Text>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Boosts fitness level
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Quick Tips */}
          <Card style={styles.tipsCard}>
            <Card.Content style={styles.quickTipsContent}>
              <ThemedText type="subtitle" style={styles.tipsTitle}>
                💡 Maximize Points
              </ThemedText>
              <View style={styles.tipsGrid}>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🔄</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    Improve weakest area
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>📊</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    Daily consistency
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>⚖️</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    Balance all areas
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>📝</Text>
                  <Text variant="bodySmall" style={styles.tipLabel}>
                    Track regularly
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
  infoContent: {
    paddingVertical: 16,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  infoItem: {
    alignItems: "center",
    width: "45%",
    minWidth: 140,
    marginBottom: 8,
  },
  infoEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  infoLabel: {
    textAlign: "center",
    fontSize: 11,
    opacity: 0.8,
    lineHeight: 14,
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
