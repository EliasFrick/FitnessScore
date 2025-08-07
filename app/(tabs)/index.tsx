import React, { useState } from "react";
import {
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";
import { router } from "expo-router";

import { FitnessRings } from "@/components/FitnessRings";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { useHealthData } from "@/hooks/useHealthData";
import { useThemeColor } from "@/hooks/useThemeColor";
import { calculateMonthlyAverage } from "@/utils/fitnessCalculator";

export default function OverviewScreen() {
  const {
    healthMetrics,
    isLoading,
    error,
    isHealthKitAvailable,
    hasPermissions,
    refreshData,
  } = useHealthData();
  const { colorScheme, setThemeMode } = useTheme();
  const monthlyAverage = calculateMonthlyAverage(healthMetrics);
  const backgroundColor = useThemeColor({}, "background");
  const [showInfoModal, setShowInfoModal] = useState(false);

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
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => setShowInfoModal(true)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name="info.circle"
                  size={24}
                  color={colorScheme === "dark" ? "#FFFFFF" : "#000000"}
                  style={{ backgroundColor: "transparent" }}
                />
              </TouchableOpacity>

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
            </View>
            <View style={styles.titleRow}>
              <ThemedText type="title">HealthScore Overview</ThemedText>
            </View>
            {!isHealthKitAvailable && (
              <Text variant="bodySmall" style={styles.statusText}>
                📱 Apple Health not available on this platform
              </Text>
            )}
            {isHealthKitAvailable && hasPermissions && (
              <Text variant="bodySmall" style={styles.statusText}>
                📊 Apple Health is connected
              </Text>
            )}
            {isHealthKitAvailable && !hasPermissions && (
              <Text
                variant="bodySmall"
                style={[styles.statusText, styles.errorText]}
              >
                ⚠️ Please allow Apple Health permissions in Settings to use the
                app
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

                  {/* Legend */}
                  <View style={styles.legend}>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: "#4CAF50" },
                        ]}
                      />
                      <Text variant="bodySmall" style={styles.legendText}>
                        Recovery & Regeneration
                      </Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: "#2196F3" },
                        ]}
                      />
                      <Text variant="bodySmall" style={styles.legendText}>
                        Overall Fitness Score
                      </Text>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </ThemedView>

          {/* Metrics Overview Cards */}
          <ThemedView style={styles.metricsContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Monthly Overview
            </ThemedText>

            <View style={styles.metricsGrid}>
              <TouchableOpacity
                style={styles.metricTouchable}
                onPress={() => router.push("/cardiovascular")}
                activeOpacity={0.7}
              >
                <Card style={styles.metricCard}>
                  <Card.Content style={styles.metricContent}>
                    <Text variant="labelMedium" style={styles.metricLabel}>
                      Cardiovascular
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

              <TouchableOpacity
                style={styles.metricTouchable}
                onPress={() => router.push("/recovery")}
                activeOpacity={0.7}
              >
                <Card style={styles.metricCard}>
                  <Card.Content style={styles.metricContent}>
                    <Text variant="labelMedium" style={styles.metricLabel}>
                      Recovery
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
              <TouchableOpacity
                style={styles.metricTouchable}
                onPress={() => router.push("/activity")}
                activeOpacity={0.7}
              >
                <Card style={styles.metricCard}>
                  <Card.Content style={styles.metricContent}>
                    <Text variant="labelMedium" style={styles.metricLabel}>
                      Activity
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

              <TouchableOpacity
                style={styles.metricTouchable}
                onPress={() => router.push("/bonus")}
                activeOpacity={0.7}
              >
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
        </ThemedView>
      </ScrollView>

      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                How HealthScore Works
              </ThemedText>
              <TouchableOpacity
                onPress={() => setShowInfoModal(false)}
                style={styles.closeButton}
              >
                <IconSymbol
                  name="xmark.circle.fill"
                  size={24}
                  color={colorScheme === "dark" ? "#FFFFFF" : "#000000"}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.modalScrollView}
            >
              <View style={styles.modalContent}>
                <ThemedText style={styles.modalText}>
                  Your HealthScore is calculated based on four key areas:
                </ThemedText>

                <View style={styles.scoreSection}>
                  <ThemedText style={styles.sectionHeader}>
                    💓 Cardiovascular Health (30 pts)
                  </ThemedText>
                  <ThemedText style={styles.sectionText}>
                    • Resting Heart Rate (up to 10 pts){"\n"}• Heart Rate
                    Variability (up to 10 pts){"\n"}• VO2 Max estimation (up to
                    10 pts)
                  </ThemedText>
                </View>

                <View style={styles.scoreSection}>
                  <ThemedText style={styles.sectionHeader}>
                    😴 Recovery & Regeneration (35 pts)
                  </ThemedText>
                  <ThemedText style={styles.sectionText}>
                    • Deep Sleep Percentage (up to 12 pts){"\n"}• REM Sleep
                    Percentage (up to 12 pts){"\n"}• Sleep Consistency (up to 11
                    pts)
                  </ThemedText>
                </View>

                <View style={styles.scoreSection}>
                  <ThemedText style={styles.sectionHeader}>
                    🏃‍♂️ Activity & Training (30 pts)
                  </ThemedText>
                  <ThemedText style={styles.sectionText}>
                    • Weekly Training Time (up to 12 pts){"\n"}• Training
                    Intensity/Consistency (up to 10 pts){"\n"}• Daily Activity
                    Steps (up to 8 pts)
                  </ThemedText>
                </View>

                <View style={styles.scoreSection}>
                  <ThemedText style={styles.sectionHeader}>
                    ⭐ Bonus Points (5 pts)
                  </ThemedText>
                  <ThemedText style={styles.sectionText}>
                    • Overall consistency across all categories (up to 5 pts)
                  </ThemedText>
                </View>

                <View style={styles.updateNotice}>
                  <ThemedText style={styles.updateText}>
                    📊 Coming Soon: Detailed breakdown showing exactly how you
                    earned each point!
                  </ThemedText>
                </View>
              </View>
            </ScrollView>
          </ThemedView>
        </View>
      </Modal>
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
    alignItems: "flex-end",
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
  legend: {
    marginTop: 16,
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    opacity: 0.7,
    fontSize: 12,
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
  // Header Row Styles
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    borderRadius: 16,
    maxHeight: "80%",
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  modalScrollView: {
    paddingHorizontal: 20,
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalText: {
    marginBottom: 20,
    lineHeight: 20,
  },
  scoreSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 16,
  },
  sectionText: {
    lineHeight: 18,
    opacity: 0.8,
  },
  updateNotice: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  updateText: {
    fontStyle: "italic",
    opacity: 0.9,
    lineHeight: 18,
  },
});
