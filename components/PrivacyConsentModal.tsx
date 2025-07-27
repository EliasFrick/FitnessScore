import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import StorageService from '@/services/storageService';

interface PrivacyConsentModalProps {
  visible: boolean;
  onClose: () => void;
  onConsentGiven: (consent: boolean) => void;
}

export function PrivacyConsentModal({ visible, onClose, onConsentGiven }: PrivacyConsentModalProps) {
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');
  const borderColor = useThemeColor({ light: '#E5E5EA', dark: '#38383A' }, 'icon');
  const subtleTextColor = useThemeColor({ light: '#8E8E93', dark: '#98989D' }, 'tabIconDefault');
  const insets = useSafeAreaInsets();

  const handleConsent = async (consent: boolean) => {
    setIsProcessing(true);
    try {
      await StorageService.setUserConsent(consent);
      onConsentGiven(consent);
      onClose();
    } catch (error) {
      console.error('Error setting consent:', error);
      Alert.alert('Error', 'Failed to save privacy preferences. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
        <View style={[styles.header, { backgroundColor: cardBackground, borderBottomColor: borderColor }]}>
          <View style={styles.headerContent}>
            <IconSymbol name="shield.checkered" size={24} color={tintColor} />
            <ThemedText type="title" style={[styles.headerTitle, { color: textColor }]}>Privacy & Data</ThemedText>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={20} color={subtleTextColor} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isScrolledToEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
            if (isScrolledToEnd && !hasReadTerms) {
              setHasReadTerms(true);
            }
          }}
          scrollEventThrottle={16}
        >
          <View style={[styles.section, { backgroundColor: cardBackground, borderColor }]}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
              How We Handle Your Health Data
            </ThemedText>
            <ThemedText style={[styles.text, { color: textColor }]}>
              VitalityScore takes your privacy seriously. Here&apos;s how we handle your health data:
            </ThemedText>
          </View>

          <View style={[styles.section, { backgroundColor: cardBackground, borderColor }]}>
            <View style={styles.bulletPoint}>
              <IconSymbol name="checkmark.shield" size={16} color="#34C759" />
              <ThemedText style={[styles.bulletText, { color: textColor }]}>
                <ThemedText style={[styles.bold, { color: textColor }]}>Local Storage:</ThemedText> All raw health data is stored encrypted on your device only
              </ThemedText>
            </View>

            <View style={styles.bulletPoint}>
              <IconSymbol name="lock" size={16} color="#34C759" />
              <ThemedText style={[styles.bulletText, { color: textColor }]}>
                <ThemedText style={[styles.bold, { color: textColor }]}>Privacy by Design:</ThemedText> No personal identifiers are ever transmitted
              </ThemedText>
            </View>

            <View style={styles.bulletPoint}>
              <IconSymbol name="chart.bar" size={16} color="#34C759" />
              <ThemedText style={[styles.bulletText, { color: textColor }]}>
                <ThemedText style={[styles.bold, { color: textColor }]}>Aggregated Only:</ThemedText> Only statistical summaries are shared with AI services
              </ThemedText>
            </View>

            <View style={styles.bulletPoint}>
              <IconSymbol name="trash" size={16} color="#34C759" />
              <ThemedText style={[styles.bulletText, { color: textColor }]}>
                <ThemedText style={[styles.bold, { color: textColor }]}>Full Control:</ThemedText> You can delete all data at any time
              </ThemedText>
            </View>
          </View>

          <View style={[styles.section, { backgroundColor: cardBackground, borderColor }]}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
              What Data Is Processed
            </ThemedText>
            <ThemedText style={[styles.text, { color: textColor }]}>
              When you ask questions, we create anonymized summaries including:
            </ThemedText>
            <ThemedText style={[styles.dataList, { color: subtleTextColor }]}>
              • Average heart rate and HRV values{'\n'}
              • Sleep quality percentages{'\n'}
              • Activity levels and trends{'\n'}
              • Fitness score ranges{'\n'}
              • General health categories
            </ThemedText>
          </View>

          <View style={[styles.section, { backgroundColor: cardBackground, borderColor }]}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
              Third-Party Services
            </ThemedText>
            <ThemedText style={[styles.text, { color: textColor }]}>
              We use OpenAI&apos;s API to provide intelligent health insights. Only anonymized, aggregated data is sent to their servers. OpenAI does not store or train on your data when using their API.
            </ThemedText>
          </View>

          <View style={[styles.section, { backgroundColor: cardBackground, borderColor }]}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
              Your Rights
            </ThemedText>
            <ThemedText style={[styles.text, { color: textColor }]}>
              • Revoke consent at any time in Settings{'\n'}
              • Delete all stored data instantly{'\n'}
              • Use the app without AI features{'\n'}
              • Export or review your data
            </ThemedText>
          </View>

          {hasReadTerms && (
            <View style={[styles.consentCard, { backgroundColor: tintColor + '10', borderColor: tintColor }]}>
              <IconSymbol name="checkmark.circle" size={20} color={tintColor} />
              <ThemedText style={[styles.consentText, { color: textColor }]}>
                Thank you for reading our privacy information
              </ThemedText>
            </View>
          )}
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: cardBackground, borderTopColor: borderColor }]}>
          <TouchableOpacity
            style={[styles.button, styles.declineButton, { borderColor }]}
            onPress={() => handleConsent(false)}
            disabled={isProcessing}
          >
            <ThemedText style={[styles.declineButtonText, { color: subtleTextColor }]}>
              {isProcessing ? 'Processing...' : 'Decline'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button, 
              styles.acceptButton, 
              { backgroundColor: hasReadTerms ? tintColor : borderColor }
            ]}
            onPress={() => handleConsent(true)}
            disabled={!hasReadTerms || isProcessing}
          >
            <ThemedText style={styles.acceptButtonText}>
              {isProcessing ? 'Processing...' : 'Accept & Continue'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
  },
  dataList: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    fontFamily: 'monospace',
  },
  consentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  consentText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 0.5,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    borderWidth: 1,
  },
  acceptButton: {
    backgroundColor: '#007AFF',
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});