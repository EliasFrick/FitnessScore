import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FitnessRings } from '@/components/FitnessRings';
import { calculateFitnessScore, getMockHealthMetrics } from '@/utils/fitnessCalculator';

export default function HomeScreen() {
  const healthMetrics = getMockHealthMetrics();
  const fitnessResult = calculateFitnessScore(healthMetrics);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">VitalityScore</ThemedText>
        <HelloWave />
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

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Deine Fitness auf einen Blick</ThemedText>
        <ThemedText>
          Die äußere Ring zeigt deine Regeneration, der innere Ring deine Gesamtfitness. 
          Die Zahl in der Mitte ist dein aktuelles Fitness-Level.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  fitnessContainer: {
    marginBottom: 24,
  },
  fitnessCard: {
    marginHorizontal: 0,
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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
