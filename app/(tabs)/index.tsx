import React from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Chip, ProgressBar, Text } from "react-native-paper";

import { FitnessRings } from "@/components/FitnessRings";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { useHealthData } from "@/hooks/useHealthData";
import { useThemeColor } from "@/hooks/useThemeColor";
import { calculateMonthlyAverage } from "@/utils/fitnessCalculator";

export default function OverviewScreen() {
  const { healthMetrics, isLoading, error, isHealthKitAvailable, refreshData } =
    useHealthData();
  const { colorScheme, setThemeMode } = useTheme();
  const monthlyAverage = calculateMonthlyAverage(healthMetrics);
  const backgroundColor = useThemeColor({}, "background");
  console.log(healthMetrics);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ScrollView
        style={[styles.container, { backgroundColor }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
        }
      >
        <ThemedView style={styles.content}>
          <ThemedView style={styles.titleContainer}>
            <View style={styles.switchContainer}>
              <TouchableOpacity
                style={[
                  styles.customSwitch,
                  colorScheme === "dark"
                    ? styles.switchDark
                    : styles.switchLight,
                ]}
                onPress={() =>
                  setThemeMode(colorScheme === "dark" ? "light" : "dark")
                }
                activeOpacity={0.8}
              >
                <View style={styles.switchTrack}>
                  <View style={styles.switchIconContainer}>
                    <IconSymbol name="sun.max" size={16} color="#FFA500" />
                  </View>
                  <View style={styles.switchIconContainer}>
                    <IconSymbol name="moon" size={16} color="#87CEEB" />
                  </View>
                </View>
                <View
                  style={[
                    styles.switchThumb,
                    colorScheme === "dark"
                      ? styles.thumbDark
                      : styles.thumbLight,
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.titleRow}>
              <ThemedText type="title">VitalityScore Overview</ThemedText>
            </View>
            {!isHealthKitAvailable && (
              <Text variant="bodySmall" style={styles.statusText}>
                📱 Apple Health not available on this platform
              </Text>
            )}
            {isHealthKitAvailable && !error && (
              <Text variant="bodySmall" style={styles.statusText}>
                📊 Connected to Apple Health
              </Text>
            )}
            {error && (
              <Text
                variant="bodySmall"
                style={[styles.statusText, styles.errorText]}
              >
                ⚠️ {error}
              </Text>
            )}
          </ThemedView>

          <ThemedView style={styles.fitnessContainer}>
            <Card style={styles.fitnessCard}>
              <Card.Content style={styles.cardContent}>
                <FitnessRings
                  fitnessScore={monthlyAverage.totalScore}
                  regenerationScore={monthlyAverage.recoveryPoints}
                  overallLevel={monthlyAverage.totalScore}
                  size={140}
                />
                <View style={styles.fitnessInfo}>
                  <Text variant="headlineSmall" style={styles.fitnessLevel}>
                    {monthlyAverage.fitnessLevel}
                  </Text>
                  {monthlyAverage.isEstimated && (
                    <Text
                      variant="bodySmall"
                      style={[styles.detailText, { fontStyle: "italic" }]}
                    >
                      * Basiert auf aktuellen Daten
                    </Text>
                  )}
                </View>
              </Card.Content>
            </Card>
          </ThemedView>

          {/* Metrics Overview Cards */}
          <ThemedView style={styles.metricsContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Monats-Übersicht
            </ThemedText>

            <View style={styles.metricsGrid}>
              <TouchableOpacity style={styles.metricTouchable}>
                <Card style={styles.metricCard}>
                  <Card.Content style={styles.metricContent}>
                    <Text variant="labelMedium" style={styles.metricLabel}>
                      Herz-Kreislauf
                    </Text>
                    <Text variant="headlineSmall" style={styles.metricValue}>
                      {monthlyAverage.cardiovascularPoints}/30
                    </Text>
                    <ProgressBar
                      progress={monthlyAverage.cardiovascularPoints / 30}
                      style={styles.progressBar}
                    />
                  </Card.Content>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity style={styles.metricTouchable}>
                <Card style={styles.metricCard}>
                  <Card.Content style={styles.metricContent}>
                    <Text variant="labelMedium" style={styles.metricLabel}>
                      Regeneration
                    </Text>
                    <Text variant="headlineSmall" style={styles.metricValue}>
                      {monthlyAverage.recoveryPoints}/35
                    </Text>
                    <ProgressBar
                      progress={monthlyAverage.recoveryPoints / 35}
                      style={styles.progressBar}
                    />
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            </View>

            <View style={styles.metricsGrid}>
              <TouchableOpacity style={styles.metricTouchable}>
                <Card style={styles.metricCard}>
                  <Card.Content style={styles.metricContent}>
                    <Text variant="labelMedium" style={styles.metricLabel}>
                      Aktivität
                    </Text>
                    <Text variant="headlineSmall" style={styles.metricValue}>
                      {monthlyAverage.activityPoints}/30
                    </Text>
                    <ProgressBar
                      progress={monthlyAverage.activityPoints / 30}
                      style={styles.progressBar}
                    />
                  </Card.Content>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity style={styles.metricTouchable}>
                <Card style={styles.metricCard}>
                  <Card.Content style={styles.metricContent}>
                    <Text variant="labelMedium" style={styles.metricLabel}>
                      Bonus
                    </Text>
                    <Text variant="headlineSmall" style={styles.metricValue}>
                      {monthlyAverage.bonusPoints}/5
                    </Text>
                    <ProgressBar
                      progress={monthlyAverage.bonusPoints / 5}
                      style={styles.progressBar}
                    />
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            </View>
          </ThemedView>

          {/* Insights Section */}
          <ThemedView style={styles.insightsContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Deine Fitness-Insights
            </ThemedText>

            <Card style={styles.insightCard}>
              <Card.Content>
                <View style={styles.chipContainer}>
                  <Chip icon="heart" mode="outlined" style={styles.chip}>
                    {monthlyAverage.fitnessLevel}
                  </Chip>
                  <Chip icon="trending-up" mode="outlined" style={styles.chip}>
                    {monthlyAverage.totalScore} Punkte (Ø Monat)
                  </Chip>
                  {monthlyAverage.dataPointsCount > 0 && (
                    <Chip icon="database" mode="outlined" style={styles.chip}>
                      {monthlyAverage.dataPointsCount} Datenpunkte
                    </Chip>
                  )}
                </View>

                <ThemedText style={styles.insightText}>
                  Dein VitalityScore basiert auf dem Durchschnitt der letzten 30
                  Tage.
                  {monthlyAverage.isEstimated
                    ? " Bei wenigen Daten werden aktuelle Werte verwendet."
                    : ` Basiert auf ${monthlyAverage.dataPointsCount} Datenpunkten.`}{" "}
                  Arbeite kontinuierlich an allen Bereichen für optimale
                  Ergebnisse.
                </ThemedText>
              </Card.Content>
            </Card>
          </ThemedView>
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
    padding: 20,
    gap: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 8,
  },
  switchContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  customSwitch: {
    width: 60,
    height: 30,
    borderRadius: 15,
    position: "relative",
    justifyContent: "center",
  },
  switchLight: {
    backgroundColor: "#E5E5EA",
  },
  switchDark: {
    backgroundColor: "#2C2C2E",
  },
  switchTrack: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
    height: "100%",
  },
  switchIconContainer: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  switchThumb: {
    position: "absolute",
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumbLight: {
    left: 2,
  },
  thumbDark: {
    right: 2,
  },
  statusText: {
    marginTop: 8,
    textAlign: "center",
    opacity: 0.7,
  },
  errorText: {
    color: "#FF6B6B",
  },
  fitnessContainer: {
    marginBottom: 24,
  },
  fitnessCard: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingVertical: 20,
  },
  fitnessInfo: {
    flex: 1,
    gap: 4,
  },
  fitnessLevel: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  scoreText: {
    fontWeight: "600",
    marginBottom: 4,
  },
  detailText: {
    opacity: 0.7,
  },
  // New styles for enhanced layout
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "600",
  },
  metricsContainer: {
    gap: 16,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  metricTouchable: {
    flex: 1,
  },
  metricCard: {
    height: 120,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  metricContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
  },
  metricLabel: {
    opacity: 0.7,
    marginBottom: 4,
    textAlign: "center",
  },
  metricValue: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  progressBar: {
    width: "100%",
    height: 6,
    borderRadius: 3,
  },
  insightsContainer: {
    gap: 16,
  },
  insightCard: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  chipContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  chip: {
    alignSelf: "flex-start",
  },
  insightText: {
    lineHeight: 20,
    opacity: 0.8,
  },
});
