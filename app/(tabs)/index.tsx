import { ScrollView, StyleSheet, SafeAreaView, View } from 'react-native';
import { Text, Card, Chip, ProgressBar } from 'react-native-paper';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FitnessRings } from '@/components/FitnessRings';
import { calculateFitnessScore, getMockHealthMetrics } from '@/utils/fitnessCalculator';

export default function OverviewScreen() {
  const healthMetrics = getMockHealthMetrics();
  const fitnessResult = calculateFitnessScore(healthMetrics);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">VitalityScore Overview</ThemedText>
        </ThemedView>
      
      <ThemedView style={styles.fitnessContainer}>
        <Card style={styles.fitnessCard}>
          <Card.Content style={styles.cardContent}>
            <FitnessRings
              fitnessScore={fitnessResult.totalScore}
              regenerationScore={fitnessResult.recoveryPoints}
              overallLevel={fitnessResult.totalScore}
              size={140}
            />
            <ThemedView style={styles.fitnessInfo}>
              <Text variant="headlineSmall" style={styles.fitnessLevel}>
                {fitnessResult.fitnessLevel}
              </Text>
              <Text variant="bodyMedium" style={styles.scoreText}>
                Gesamt-Score: {fitnessResult.totalScore}/100
              </Text>
              <Text variant="bodySmall" style={styles.detailText}>
                Herz-Kreislauf: {fitnessResult.cardiovascularPoints}/30
              </Text>
              <Text variant="bodySmall" style={styles.detailText}>
                Regeneration: {fitnessResult.recoveryPoints}/35
              </Text>
              <Text variant="bodySmall" style={styles.detailText}>
                Aktivität: {fitnessResult.activityPoints}/30
              </Text>
            </ThemedView>
          </Card.Content>
        </Card>
      </ThemedView>

        {/* Metrics Overview Cards */}
        <ThemedView style={styles.metricsContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Gesundheits-Übersicht</ThemedText>
          
          <View style={styles.metricsGrid}>
            <Card style={styles.metricCard}>
              <Card.Content style={styles.metricContent}>
                <Text variant="labelMedium" style={styles.metricLabel}>Herz-Kreislauf</Text>
                <Text variant="headlineSmall" style={styles.metricValue}>
                  {fitnessResult.cardiovascularPoints}/30
                </Text>
                <ProgressBar 
                  progress={fitnessResult.cardiovascularPoints / 30} 
                  style={styles.progressBar}
                />
              </Card.Content>
            </Card>
            
            <Card style={styles.metricCard}>
              <Card.Content style={styles.metricContent}>
                <Text variant="labelMedium" style={styles.metricLabel}>Regeneration</Text>
                <Text variant="headlineSmall" style={styles.metricValue}>
                  {fitnessResult.recoveryPoints}/35
                </Text>
                <ProgressBar 
                  progress={fitnessResult.recoveryPoints / 35} 
                  style={styles.progressBar}
                />
              </Card.Content>
            </Card>
          </View>

          <View style={styles.metricsGrid}>
            <Card style={styles.metricCard}>
              <Card.Content style={styles.metricContent}>
                <Text variant="labelMedium" style={styles.metricLabel}>Aktivität</Text>
                <Text variant="headlineSmall" style={styles.metricValue}>
                  {fitnessResult.activityPoints}/30
                </Text>
                <ProgressBar 
                  progress={fitnessResult.activityPoints / 30} 
                  style={styles.progressBar}
                />
              </Card.Content>
            </Card>
            
            <Card style={styles.metricCard}>
              <Card.Content style={styles.metricContent}>
                <Text variant="labelMedium" style={styles.metricLabel}>Bonus</Text>
                <Text variant="headlineSmall" style={styles.metricValue}>
                  {fitnessResult.bonusPoints}/5
                </Text>
                <ProgressBar 
                  progress={fitnessResult.bonusPoints / 5} 
                  style={styles.progressBar}
                />
              </Card.Content>
            </Card>
          </View>
        </ThemedView>

        {/* Insights Section */}
        <ThemedView style={styles.insightsContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Deine Fitness-Insights</ThemedText>
          
          <Card style={styles.insightCard}>
            <Card.Content>
              <View style={styles.chipContainer}>
                <Chip icon="heart" mode="outlined" style={styles.chip}>
                  {fitnessResult.fitnessLevel}
                </Chip>
                <Chip icon="trending-up" mode="outlined" style={styles.chip}>
                  {fitnessResult.totalScore} Punkte
                </Chip>
              </View>
              
              <ThemedText style={styles.insightText}>
                Die äußere Ring zeigt deine Regeneration, der innere Ring deine Gesamtfitness. 
                Arbeite kontinuierlich an allen Bereichen für optimale Ergebnisse.
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
    backgroundColor: 'transparent',
  },
  content: {
    padding: 20,
    gap: 20,
    paddingBottom: 100, // Extra space for tab bar
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  fitnessContainer: {
    marginBottom: 24,
  },
  fitnessCard: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 20,
  },
  fitnessInfo: {
    flex: 1,
    gap: 4,
  },
  fitnessLevel: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreText: {
    fontWeight: '600',
    marginBottom: 4,
  },
  detailText: {
    opacity: 0.7,
  },
  // New styles for enhanced layout
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  metricsContainer: {
    gap: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    elevation: 2,
    shadowColor: '#000',
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
    alignItems: 'center',
  },
  metricLabel: {
    opacity: 0.7,
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
  },
  insightsContainer: {
    gap: 16,
  },
  insightCard: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  chip: {
    alignSelf: 'flex-start',
  },
  insightText: {
    lineHeight: 20,
    opacity: 0.8,
  },
});
