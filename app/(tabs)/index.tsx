import { router } from "expo-router";
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
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBackdrop} />
          <ThemedView style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <View style={styles.modalIcon}>
                  <IconSymbol
                    name="info.circle.fill"
                    size={28}
                    color="#2196F3"
                  />
                </View>
                <ThemedText type="title" style={styles.modalTitle}>
                  How HealthScore Works
                </ThemedText>
              </View>
              
              <TouchableOpacity
                onPress={() => setShowInfoModal(false)}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <IconSymbol
                  name="xmark"
                  size={20}
                  color={colorScheme === "dark" ? "#FFFFFF" : "#666666"}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.modalScrollView}
              bounces={false}
            >
              <View style={styles.modalContent}>
                <View style={styles.introSection}>
                  <ThemedText style={styles.modalIntroText}>
                    Your HealthScore is calculated based on four key areas that provide a comprehensive view of your fitness and wellness:
                  </ThemedText>
                </View>

                <View style={styles.scoreSection}>
                  <View style={styles.sectionIconHeader}>
                    <View style={[styles.sectionIconContainer, { backgroundColor: "#FF6B6B20" }]}>
                      <ThemedText style={[styles.sectionIcon, { color: "#FF6B6B" }]}>💓</ThemedText>
                    </View>
                    <View style={styles.sectionTitleContainer}>
                      <ThemedText style={styles.sectionHeader}>
                        Cardiovascular Health
                      </ThemedText>
                      <ThemedText style={styles.sectionPoints}>30 points</ThemedText>
                    </View>
                  </View>
                  <View style={styles.sectionMetrics}>
                    <View style={styles.metricItem}>
                      <View style={styles.metricDot} />
                      <ThemedText style={styles.sectionText}>Resting Heart Rate (up to 10 pts)</ThemedText>
                    </View>
                    <View style={styles.metricItem}>
                      <View style={styles.metricDot} />
                      <ThemedText style={styles.sectionText}>Heart Rate Variability (up to 10 pts)</ThemedText>
                    </View>
                    <View style={styles.metricItem}>
                      <View style={styles.metricDot} />
                      <ThemedText style={styles.sectionText}>VO2 Max estimation (up to 10 pts)</ThemedText>
                    </View>
                  </View>
                </View>

                <View style={styles.scoreSection}>
                  <View style={styles.sectionIconHeader}>
                    <View style={[styles.sectionIconContainer, { backgroundColor: "#4CAF5020" }]}>
                      <ThemedText style={[styles.sectionIcon, { color: "#4CAF50" }]}>😴</ThemedText>
                    </View>
                    <View style={styles.sectionTitleContainer}>
                      <ThemedText style={styles.sectionHeader}>
                        Recovery & Regeneration
                      </ThemedText>
                      <ThemedText style={styles.sectionPoints}>35 points</ThemedText>
                    </View>
                  </View>
                  <View style={styles.sectionMetrics}>
                    <View style={styles.metricItem}>
                      <View style={styles.metricDot} />
                      <ThemedText style={styles.sectionText}>Deep Sleep Percentage (up to 15 pts)</ThemedText>
                    </View>
                    <View style={styles.metricItem}>
                      <View style={styles.metricDot} />
                      <ThemedText style={styles.sectionText}>REM Sleep Percentage (up to 12 pts)</ThemedText>
                    </View>
                    <View style={styles.metricItem}>
                      <View style={styles.metricDot} />
                      <ThemedText style={styles.sectionText}>Sleep Consistency (up to 8 pts)</ThemedText>
                    </View>
                  </View>
                </View>

                <View style={styles.scoreSection}>
                  <View style={styles.sectionIconHeader}>
                    <View style={[styles.sectionIconContainer, { backgroundColor: "#FF980020" }]}>
                      <ThemedText style={[styles.sectionIcon, { color: "#FF9800" }]}>🏃‍♂️</ThemedText>
                    </View>
                    <View style={styles.sectionTitleContainer}>
                      <ThemedText style={styles.sectionHeader}>
                        Activity & Training
                      </ThemedText>
                      <ThemedText style={styles.sectionPoints}>30 points</ThemedText>
                    </View>
                  </View>
                  <View style={styles.sectionMetrics}>
                    <View style={styles.metricItem}>
                      <View style={styles.metricDot} />
                      <ThemedText style={styles.sectionText}>Weekly Training Time (up to 12 pts)</ThemedText>
                    </View>
                    <View style={styles.metricItem}>
                      <View style={styles.metricDot} />
                      <ThemedText style={styles.sectionText}>Training Intensity/Consistency (up to 10 pts)</ThemedText>
                    </View>
                    <View style={styles.metricItem}>
                      <View style={styles.metricDot} />
                      <ThemedText style={styles.sectionText}>Daily Activity Steps (up to 8 pts)</ThemedText>
                    </View>
                  </View>
                </View>

                <View style={styles.scoreSection}>
                  <View style={styles.sectionIconHeader}>
                    <View style={[styles.sectionIconContainer, { backgroundColor: "#9C27B020" }]}>
                      <ThemedText style={[styles.sectionIcon, { color: "#9C27B0" }]}>⭐</ThemedText>
                    </View>
                    <View style={styles.sectionTitleContainer}>
                      <ThemedText style={styles.sectionHeader}>
                        Bonus Points
                      </ThemedText>
                      <ThemedText style={styles.sectionPoints}>5 points</ThemedText>
                    </View>
                  </View>
                  <View style={styles.sectionMetrics}>
                    <View style={styles.metricItem}>
                      <View style={styles.metricDot} />
                      <ThemedText style={styles.sectionText}>Overall consistency across all categories</ThemedText>
                    </View>
                  </View>
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
    marginBottom: 30,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 0,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    minHeight: "50%",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#CCCCCC",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  modalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2196F320",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontWeight: "700",
    fontSize: 20,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  modalScrollView: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  modalContent: {
    paddingBottom: 32,
  },
  introSection: {
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  modalIntroText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.85,
    textAlign: "left",
  },
  scoreSection: {
    marginBottom: 24,
    backgroundColor: "rgba(128, 128, 128, 0.05)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.1)",
  },
  sectionIconHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 16,
  },
  sectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionIcon: {
    fontSize: 24,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionHeader: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 2,
    lineHeight: 22,
  },
  sectionPoints: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: "500",
  },
  sectionMetrics: {
    gap: 12,
    marginLeft: 12,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metricDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2196F3",
    opacity: 0.6,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 20,
    opacity: 0.85,
    flex: 1,
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
