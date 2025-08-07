import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";
import { Stack } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useHealthData } from "@/hooks/useHealthData";
import { useThemeColor } from "@/hooks/useThemeColor";
import { calculateMonthlyAverage } from "@/utils/fitnessCalculator";

export default function RecoveryScreen() {
  const { healthMetrics } = useHealthData();
  const monthlyAverage = calculateMonthlyAverage(healthMetrics);
  const backgroundColor = useThemeColor({}, "background");

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <Stack.Screen
        options={{
          title: "Recovery",
          headerShown: true,
        }}
      />
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
                Your recovery metrics are essential for optimal performance and
                health.
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
                  {Math.round((monthlyAverage.recoveryPoints / 35) * 12)}/12
                </Text>
              </View>
              <ProgressBar
                progress={(monthlyAverage.recoveryPoints / 35) * (12 / 35)}
                style={styles.progressBar}
              />
              <Text variant="bodySmall" style={styles.metricDescription}>
                Deep sleep is crucial for physical recovery and immune function.
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.metricCard}>
            <Card.Content style={styles.metricContent}>
              <View style={styles.metricHeader}>
                <Text variant="titleMedium" style={styles.metricName}>
                  🌙 REM Sleep Percentage
                </Text>
                <Text variant="titleLarge" style={styles.metricScore}>
                  {Math.round((monthlyAverage.recoveryPoints / 35) * 12)}/12
                </Text>
              </View>
              <ProgressBar
                progress={(monthlyAverage.recoveryPoints / 35) * (12 / 35)}
                style={styles.progressBar}
              />
              <Text variant="bodySmall" style={styles.metricDescription}>
                REM sleep supports cognitive function and emotional regulation.
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.metricCard}>
            <Card.Content style={styles.metricContent}>
              <View style={styles.metricHeader}>
                <Text variant="titleMedium" style={styles.metricName}>
                  ⏰ Sleep Consistency
                </Text>
                <Text variant="titleLarge" style={styles.metricScore}>
                  {Math.round((monthlyAverage.recoveryPoints / 35) * 11)}/11
                </Text>
              </View>
              <ProgressBar
                progress={(monthlyAverage.recoveryPoints / 35) * (11 / 35)}
                style={styles.progressBar}
              />
              <Text variant="bodySmall" style={styles.metricDescription}>
                Consistent sleep patterns optimize your circadian rhythm.
              </Text>
            </Card.Content>
          </Card>

          {/* Tips Section */}
          <Card style={styles.tipsCard}>
            <Card.Content style={styles.cardContent}>
              <ThemedText type="subtitle" style={styles.tipsTitle}>
                💡 Improvement Tips
              </ThemedText>
              <View style={styles.tipsList}>
                <Text variant="bodyMedium" style={styles.tipText}>
                  • Maintain a consistent sleep schedule, even on weekends
                </Text>
                <Text variant="bodyMedium" style={styles.tipText}>
                  • Create a relaxing bedtime routine 1-2 hours before sleep
                </Text>
                <Text variant="bodyMedium" style={styles.tipText}>
                  • Keep your bedroom cool, dark, and quiet
                </Text>
                <Text variant="bodyMedium" style={styles.tipText}>
                  • Limit screen time and caffeine before bedtime
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
  metricDescription: {
    opacity: 0.7,
    lineHeight: 16,
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
