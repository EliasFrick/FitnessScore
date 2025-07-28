import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Chip, Divider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useHistory } from "@/contexts/HistoryContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect } from "react";

type FilterCategory = 'Cardiovascular Health' | 'Recovery & Regeneration' | 'Activity & Training' | 'Bonus Metric';

export default function FilteredHistoryScreen() {
  const { filter } = useLocalSearchParams<{ filter: string }>();
  const { historyItems, isLoading } = useHistory();
  const backgroundColor = useThemeColor({}, "background");
  const insets = useSafeAreaInsets();

  // Filter history items based on the category
  const filteredItems = historyItems.filter(item => 
    item.category === filter
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Cardiovascular Health":
        return "#FF6B6B";
      case "Recovery & Regeneration":
        return "#4ECDC4";
      case "Activity & Training":
        return "#45B7D1";
      case "Bonus Metric":
        return "#FFD93D";
      default:
        return "#666";
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "Cardiovascular Health":
        return "Herz-Kreislauf";
      case "Recovery & Regeneration":
        return "Regeneration";
      case "Activity & Training":
        return "Aktivität";
      case "Bonus Metric":
        return "Bonus";
      default:
        return category;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <ThemedView
        style={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
      >
        <ThemedView style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="arrow.left" size={24} color="#666" />
          </TouchableOpacity>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">{getCategoryTitle(filter || '')}</ThemedText>
            <ThemedText style={styles.subtitle}>Verlauf (30 Tage)</ThemedText>
          </ThemedView>
          <View style={styles.placeholder} />
        </ThemedView>

        {isLoading ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <IconSymbol name="arrow.clockwise" size={48} color="#CCC" />
              <ThemedText type="subtitle" style={styles.emptyTitle}>
                Lade Verlauf...
              </ThemedText>
              <ThemedText style={styles.emptyDescription}>
                Verlauf wird geladen...
              </ThemedText>
            </Card.Content>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <IconSymbol name="clock" size={48} color="#CCC" />
              <ThemedText type="subtitle" style={styles.emptyTitle}>
                Noch keine Daten
              </ThemedText>
              <ThemedText style={styles.emptyDescription}>
                Der Verlauf für {getCategoryTitle(filter || '')} wird hier angezeigt, 
                sobald Gesundheitsdaten verfügbar sind.
              </ThemedText>
            </Card.Content>
          </Card>
        ) : (
          <ThemedView style={styles.historyList}>
            {filteredItems.map((item) => (
              <Card key={item.id} style={styles.historyCard}>
                <Card.Content>
                  <ThemedView style={styles.cardHeader}>
                    <Chip
                      icon={() => (
                        <View
                          style={[
                            styles.categoryDot,
                            {
                              backgroundColor: getCategoryColor(item.category),
                            },
                          ]}
                        />
                      )}
                      style={styles.categoryChip}
                      textStyle={styles.chipText}
                    >
                      {getCategoryTitle(item.category)}
                    </Chip>
                    <ThemedText style={styles.timestamp}>
                      {formatDate(item.timestamp)}
                    </ThemedText>
                  </ThemedView>

                  <ThemedView style={styles.metricInfo}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.metricName}
                    >
                      {item.metric}
                    </ThemedText>
                    <ThemedView style={styles.pointsContainer}>
                      <ThemedText type="title" style={styles.points}>
                        {item.points}
                      </ThemedText>
                      <ThemedText style={styles.maxPoints}>
                        / {item.maxPoints} Pkte
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>

                  <Divider style={styles.divider} />

                  <ThemedText style={styles.reason}>{item.reason}</ThemedText>
                </Card.Content>
              </Card>
            ))}
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  titleContainer: {
    alignItems: "center",
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  placeholder: {
    width: 40,
  },
  emptyCard: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    marginTop: 60,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 20,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryChip: {
    height: 32,
  },
  chipText: {
    fontSize: 12,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
  metricInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  metricName: {
    flex: 1,
    fontSize: 16,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  points: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#34C759",
  },
  maxPoints: {
    fontSize: 14,
    opacity: 0.6,
    marginLeft: 4,
  },
  divider: {
    marginVertical: 12,
  },
  reason: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});