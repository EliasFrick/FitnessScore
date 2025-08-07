import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HeaderBackText } from "@/components/ui/HeaderBackText";
import { useHealthData } from "@/hooks/useHealthData";
import { useThemeColor } from "@/hooks/useThemeColor";
import { calculateMonthlyAverage } from "@/utils/fitnessCalculator";

export default function CardiovascularScreen() {
  const { healthMetrics } = useHealthData();
  const monthlyAverage = calculateMonthlyAverage(healthMetrics);
  const backgroundColor = useThemeColor({}, "background");

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
                Your heart health metrics indicate cardiovascular fitness and
                efficiency.
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
                  {Math.round((monthlyAverage.cardiovascularPoints / 30) * 10)}
                  /10
                </Text>
              </View>
              <ProgressBar
                progress={
                  (monthlyAverage.cardiovascularPoints / 30) * (10 / 30)
                }
                style={styles.progressBar}
              />
              <Text variant="bodySmall" style={styles.metricDescription}>
                Lower resting heart rate typically indicates better
                cardiovascular fitness.
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
                  {Math.round((monthlyAverage.cardiovascularPoints / 30) * 10)}
                  /10
                </Text>
              </View>
              <ProgressBar
                progress={
                  (monthlyAverage.cardiovascularPoints / 30) * (10 / 30)
                }
                style={styles.progressBar}
              />
              <Text variant="bodySmall" style={styles.metricDescription}>
                Higher HRV suggests better recovery and stress adaptation.
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
                  {Math.round((monthlyAverage.cardiovascularPoints / 30) * 10)}
                  /10
                </Text>
              </View>
              <ProgressBar
                progress={
                  (monthlyAverage.cardiovascularPoints / 30) * (10 / 30)
                }
                style={styles.progressBar}
              />
              <Text variant="bodySmall" style={styles.metricDescription}>
                VO2 Max measures your body's maximum oxygen uptake during
                exercise.
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
                  • Engage in regular aerobic exercise (150+ minutes per week)
                </Text>
                <Text variant="bodyMedium" style={styles.tipText}>
                  • Include interval training to improve cardiovascular
                  efficiency
                </Text>
                <Text variant="bodyMedium" style={styles.tipText}>
                  • Monitor stress levels and practice relaxation techniques
                </Text>
                <Text variant="bodyMedium" style={styles.tipText}>
                  • Maintain a heart-healthy diet rich in omega-3 fatty acids
                </Text>
                <Text variant="bodyMedium" style={styles.tipText}>
                  • Stay hydrated and avoid excessive alcohol and smoking
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
  tipsList: {
    gap: 8,
  },
  tipText: {
    lineHeight: 20,
    opacity: 0.8,
  },
});
