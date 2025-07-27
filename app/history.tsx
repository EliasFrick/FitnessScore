import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Chip, Divider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useHistory } from '@/contexts/HistoryContext';

export default function HistoryScreen() {
  const { historyItems } = useHistory();
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Cardiovascular Health':
        return '#FF6B6B';
      case 'Recovery & Regeneration':
        return '#4ECDC4';
      case 'Activity & Training':
        return '#45B7D1';
      case 'Bonus Metric':
        return '#FFD93D';
      default:
        return '#666';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <ThemedView style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol 
              name="arrow.left" 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
          <ThemedText type="title">Scoring History</ThemedText>
          <View style={styles.placeholder} />
        </ThemedView>

        {historyItems.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <IconSymbol name="clock" size={48} color="#CCC" />
              <ThemedText type="subtitle" style={styles.emptyTitle}>No History Yet</ThemedText>
              <ThemedText style={styles.emptyDescription}>
                Your scoring history will appear here once you start tracking your health metrics.
              </ThemedText>
            </Card.Content>
          </Card>
        ) : (
          <ThemedView style={styles.historyList}>
            {historyItems.map((item) => (
              <Card key={item.id} style={styles.historyCard}>
                <Card.Content>
                  <ThemedView style={styles.cardHeader}>
                    <Chip 
                      icon={() => <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(item.category) }]} />}
                      style={styles.categoryChip}
                      textStyle={styles.chipText}
                    >
                      {item.category}
                    </Chip>
                    <ThemedText style={styles.timestamp}>
                      {formatDate(item.timestamp)}
                    </ThemedText>
                  </ThemedView>
                  
                  <ThemedView style={styles.metricInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.metricName}>
                      {item.metric}
                    </ThemedText>
                    <ThemedView style={styles.pointsContainer}>
                      <ThemedText type="title" style={styles.points}>
                        {item.points}
                      </ThemedText>
                      <ThemedText style={styles.maxPoints}>
                        / {item.maxPoints} pts
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  
                  <Divider style={styles.divider} />
                  
                  <ThemedText style={styles.reason}>
                    {item.reason}
                  </ThemedText>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  placeholder: {
    width: 40,
  },
  emptyCard: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    marginTop: 60,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricName: {
    flex: 1,
    fontSize: 16,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  points: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34C759',
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