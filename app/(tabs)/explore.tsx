import { ScrollView, StyleSheet, Switch } from 'react-native';
import { Card, List, Divider } from 'react-native-paper';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Settings</ThemedText>
        </ThemedView>
        
        <Card style={styles.settingsCard}>
          <Card.Content>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Health Data</ThemedText>
            
            <List.Item
              title="Sync Health Data"
              description="Automatically sync with HealthKit/Google Fit"
              left={() => <IconSymbol name="heart.fill" size={24} color="#FF6B6B" />}
              right={() => <Switch value={true} onValueChange={() => {}} />}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Data Sources"
              description="Manage connected devices and apps"
              left={() => <IconSymbol name="link" size={24} color="#4ECDC4" />}
              right={() => <IconSymbol name="chevron.right" size={16} />}
              onPress={() => {}}
            />
          </Card.Content>
        </Card>

        <Card style={styles.settingsCard}>
          <Card.Content>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Notifications</ThemedText>
            
            <List.Item
              title="Daily Reminders"
              description="Get reminded to check your vitality score"
              left={() => <IconSymbol name="bell.fill" size={24} color="#FFD93D" />}
              right={() => <Switch value={false} onValueChange={() => {}} />}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Goal Achievements"
              description="Celebrate when you reach fitness milestones"
              left={() => <IconSymbol name="trophy.fill" size={24} color="#FF9500" />}
              right={() => <Switch value={true} onValueChange={() => {}} />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.settingsCard}>
          <Card.Content>
            <ThemedText type="subtitle" style={styles.sectionTitle}>App Preferences</ThemedText>
            
            <List.Item
              title="Theme"
              description={`Currently using ${colorScheme === 'dark' ? 'Dark' : 'Light'} mode`}
              left={() => <IconSymbol name="paintbrush.fill" size={24} color="#8E44AD" />}
              right={() => <IconSymbol name="chevron.right" size={16} />}
              onPress={() => {}}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Units"
              description="Metric (kg, cm, km)"
              left={() => <IconSymbol name="ruler" size={24} color="#3498DB" />}
              right={() => <IconSymbol name="chevron.right" size={16} />}
              onPress={() => {}}
            />
          </Card.Content>
        </Card>

        <Card style={styles.settingsCard}>
          <Card.Content>
            <ThemedText type="subtitle" style={styles.sectionTitle}>About</ThemedText>
            
            <List.Item
              title="Privacy Policy"
              left={() => <IconSymbol name="lock.fill" size={24} color="#95A5A6" />}
              right={() => <IconSymbol name="chevron.right" size={16} />}
              onPress={() => {}}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Version"
              description="1.0.0"
              left={() => <IconSymbol name="info.circle.fill" size={24} color="#95A5A6" />}
            />
          </Card.Content>
        </Card>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  settingsCard: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 8,
  },
});
