import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import AIService from "@/services/aiService";
import StorageService from "@/services/storageService";

export default function AISettingsScreen() {
  const [apiKey, setApiKey] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const cardBackground = useThemeColor(
    { light: "#FFFFFF", dark: "#1C1C1E" },
    "background",
  );
  const inputBackground = useThemeColor(
    { light: "#F2F2F7", dark: "#38383A" },
    "background",
  );
  const borderColor = useThemeColor(
    { light: "#E5E5EA", dark: "#38383A" },
    "icon",
  );
  const subtleTextColor = useThemeColor(
    { light: "#8E8E93", dark: "#98989D" },
    "tabIconDefault",
  );
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedApiKey = await AsyncStorage.getItem("openai_api_key");
      const consent = await StorageService.getUserConsent();

      if (storedApiKey) {
        setApiKey(storedApiKey);
        AIService.configure({ apiKey: storedApiKey });
        setIsConfigured(true);
      }

      setHasConsent(consent);
    } catch (_error) {}
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert("Error", "Please enter a valid OpenAI API key");
      return;
    }

    if (!apiKey.startsWith("sk-")) {
      Alert.alert(
        "Error",
        "Please enter a valid OpenAI API key (starts with sk-)",
      );
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem("openai_api_key", apiKey.trim());
      AIService.configure({ apiKey: apiKey.trim() });
      setIsConfigured(true);
      Alert.alert(
        "Success",
        "API key saved successfully! You can now use AI features.",
      );
    } catch (_error) {
      Alert.alert("Error", "Failed to save API key. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeApiKey = async () => {
    Alert.alert(
      "Remove API Key",
      "Are you sure you want to remove the API key? This will disable AI features.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("openai_api_key");
              setApiKey("");
              setIsConfigured(false);
              Alert.alert("Success", "API key removed successfully.");
            } catch (_error) {
              Alert.alert("Error", "Failed to remove API key.");
            }
          },
        },
      ],
    );
  };

  const toggleConsent = async () => {
    try {
      const newConsent = !hasConsent;
      await StorageService.setUserConsent(newConsent);
      setHasConsent(newConsent);

      if (newConsent) {
        Alert.alert(
          "Privacy Consent",
          "Thank you for enabling data processing. Your health data will be processed locally and only aggregated insights will be shared with AI services.",
        );
      } else {
        Alert.alert(
          "Privacy Consent",
          "Data processing disabled. AI features will use only basic health summaries.",
        );
      }
    } catch (_error) {
      Alert.alert("Error", "Failed to update privacy settings.");
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all stored health data and AI responses. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await StorageService.clearAllData();
              setHasConsent(false);
              Alert.alert("Success", "All data cleared successfully.");
            } catch (_error) {
              Alert.alert("Error", "Failed to clear data.");
            }
          },
        },
      ],
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 20,
            backgroundColor: cardBackground,
            borderBottomColor: borderColor,
          },
        ]}
      >
        <ThemedText
          type="title"
          style={[styles.headerTitle, { color: textColor }]}
        >
          AI Settings
        </ThemedText>
        <ThemedText style={[styles.headerSubtitle, { color: subtleTextColor }]}>
          Configure AI features and privacy
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* API Key Section */}
        <View
          style={[
            styles.section,
            { backgroundColor: cardBackground, borderColor },
          ]}
        >
          <View style={styles.sectionHeader}>
            <IconSymbol name="key" size={20} color={tintColor} />
            <ThemedText
              type="subtitle"
              style={[styles.sectionTitle, { color: textColor }]}
            >
              OpenAI API Key
            </ThemedText>
          </View>

          <ThemedText style={[styles.description, { color: subtleTextColor }]}>
            Enter your OpenAI API key to enable AI-powered health insights. Your
            key is stored securely on your device.
          </ThemedText>

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: inputBackground, borderColor },
            ]}
          >
            <TextInput
              style={[styles.textInput, { color: textColor }]}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="sk-..."
              placeholderTextColor={subtleTextColor}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                { backgroundColor: tintColor },
              ]}
              onPress={saveApiKey}
              disabled={isLoading}
            >
              <ThemedText style={styles.buttonText}>
                {isLoading
                  ? "Saving..."
                  : isConfigured
                    ? "Update Key"
                    : "Save Key"}
              </ThemedText>
            </TouchableOpacity>

            {isConfigured && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, { borderColor }]}
                onPress={removeApiKey}
              >
                <ThemedText
                  style={[
                    styles.secondaryButtonText,
                    { color: subtleTextColor },
                  ]}
                >
                  Remove
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {isConfigured && (
            <View
              style={[styles.statusCard, { backgroundColor: inputBackground }]}
            >
              <IconSymbol name="checkmark.circle" size={16} color="#34C759" />
              <ThemedText style={[styles.statusText, { color: textColor }]}>
                AI features enabled
              </ThemedText>
            </View>
          )}
        </View>

        {/* Privacy Settings */}
        <View
          style={[
            styles.section,
            { backgroundColor: cardBackground, borderColor },
          ]}
        >
          <View style={styles.sectionHeader}>
            <IconSymbol name="shield" size={20} color={tintColor} />
            <ThemedText
              type="subtitle"
              style={[styles.sectionTitle, { color: textColor }]}
            >
              Privacy Settings
            </ThemedText>
          </View>

          <TouchableOpacity style={styles.settingRow} onPress={toggleConsent}>
            <View style={styles.settingInfo}>
              <ThemedText style={[styles.settingTitle, { color: textColor }]}>
                Data Processing Consent
              </ThemedText>
              <ThemedText
                style={[styles.settingDescription, { color: subtleTextColor }]}
              >
                Allow processing of health data for AI insights
              </ThemedText>
            </View>
            <View
              style={[
                styles.toggle,
                { backgroundColor: hasConsent ? tintColor : borderColor },
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  { transform: [{ translateX: hasConsent ? 20 : 2 }] },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Privacy Information */}
        <View
          style={[
            styles.section,
            { backgroundColor: cardBackground, borderColor },
          ]}
        >
          <View style={styles.sectionHeader}>
            <IconSymbol name="info.circle" size={20} color={tintColor} />
            <ThemedText
              type="subtitle"
              style={[styles.sectionTitle, { color: textColor }]}
            >
              Privacy Information
            </ThemedText>
          </View>

          <ThemedText style={[styles.privacyText, { color: subtleTextColor }]}>
            • Raw health data is stored encrypted on your device{"\n"}• Only
            aggregated summaries are sent to AI services{"\n"}• No personal
            identifiers are transmitted{"\n"}• You can delete all data at any
            time{"\n"}• API responses are cached locally for better performance
          </ThemedText>
        </View>

        {/* Data Management */}
        <View
          style={[
            styles.section,
            { backgroundColor: cardBackground, borderColor },
          ]}
        >
          <View style={styles.sectionHeader}>
            <IconSymbol name="trash" size={20} color="#FF3B30" />
            <ThemedText
              type="subtitle"
              style={[styles.sectionTitle, { color: textColor }]}
            >
              Data Management
            </ThemedText>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={clearAllData}
          >
            <ThemedText style={styles.dangerButtonText}>
              Clear All Data
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  inputContainer: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  textInput: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    borderWidth: 1,
  },
  dangerButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  dangerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    padding: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
  },
  privacyText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
