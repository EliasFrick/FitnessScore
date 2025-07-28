import { ScrollView, StyleSheet, Switch } from 'react-native';
import { Card, List, Divider, Button, Dialog, Portal, RadioButton } from 'react-native-paper';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useHistory } from '@/contexts/HistoryContext';

export default function SettingsScreen() {
  const { themeMode, setThemeMode } = useTheme();
  const { refreshHistoricalData } = useHistory();
  const [themeDialogVisible, setThemeDialogVisible] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();

  const getThemeDescription = () => {
    switch (themeMode) {
      case 'light': return 'Light mode';
      case 'dark': return 'Dark mode';
      case 'system': return 'Follow system setting';
      default: return 'Follow system setting';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
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
            
          </Card.Content>
        </Card>

        <Card style={styles.settingsCard}>
          <Card.Content>
            <ThemedText type="subtitle" style={styles.sectionTitle}>App Preferences</ThemedText>
            
            <List.Item
              title="Theme"
              description={getThemeDescription()}
              left={() => <IconSymbol name="paintbrush.fill" size={24} color="#8E44AD" />}
              right={() => <IconSymbol name="chevron.right" size={16} color="#666" />}
              onPress={() => setThemeDialogVisible(true)}
            />
            
            
          </Card.Content>
        </Card>

        <Card style={styles.settingsCard}>
          <Card.Content>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Debug</ThemedText>
            
            <List.Item
              title="Refresh Historical Data"
              description="Force refresh health history from HealthKit"
              left={() => <IconSymbol name="arrow.clockwise" size={24} color="#FF9500" />}
              onPress={async () => {
                await refreshHistoricalData();
              }}
            />
            
          </Card.Content>
        </Card>

      </ThemedView>

      <Portal>
        <Dialog visible={themeDialogVisible} onDismiss={() => setThemeDialogVisible(false)}>
          <Dialog.Title>Choose Theme</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={(value) => setThemeMode(value as any)} value={themeMode}>
              <RadioButton.Item label="Follow system setting" value="system" />
              <RadioButton.Item label="Light mode" value="light" />
              <RadioButton.Item label="Dark mode" value="dark" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setThemeDialogVisible(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
