import { Link, Stack } from "expo-router";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function NotFoundScreen() {
  const { colorScheme } = useTheme();
  const backgroundColor = useThemeColor({}, "background");

  return (
    <>
      <Stack.Screen
        options={{
          title: "Page Not Found",
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#151718" : "#FFFFFF",
          },
          headerTintColor: colorScheme === "dark" ? "#FFFFFF" : "#000000",
          headerTitleStyle: {
            color: colorScheme === "dark" ? "#FFFFFF" : "#000000",
            fontWeight: "600",
          },
        }}
      />
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <IconSymbol
                name="exclamationmark.triangle"
                size={64}
                color="#FF9800"
                style={styles.warningIcon}
              />
            </View>

            <ThemedText type="title" style={styles.title}>
              404
            </ThemedText>

            <ThemedText type="subtitle" style={styles.subtitle}>
              Page Not Found
            </ThemedText>

            <Text variant="bodyMedium" style={styles.description}>
              Oops! The page you're looking for doesn't exist. It might have
              been moved, deleted, or you entered the wrong URL.
            </Text>

            <View style={styles.actionsContainer}>
              <Link href="/" asChild>
                <TouchableOpacity
                  style={styles.primaryButton}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    <IconSymbol
                      name="house"
                      size={20}
                      color="#FFFFFF"
                      style={styles.buttonIcon}
                    />
                    <Text
                      variant="titleMedium"
                      style={styles.primaryButtonText}
                    >
                      Go to Home
                    </Text>
                  </View>
                </TouchableOpacity>
              </Link>

              <Link href="/explore" asChild>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    <IconSymbol
                      name="magnifyingglass"
                      size={20}
                      color={colorScheme === "dark" ? "#FFFFFF" : "#2196F3"}
                      style={styles.buttonIcon}
                    />
                    <Text
                      variant="titleMedium"
                      style={[
                        styles.secondaryButtonText,
                        {
                          color: colorScheme === "dark" ? "#FFFFFF" : "#2196F3",
                        },
                      ]}
                    >
                      Explore App
                    </Text>
                  </View>
                </TouchableOpacity>
              </Link>
            </View>

            <View style={styles.helpContainer}>
              <IconSymbol
                name="info.circle"
                size={16}
                color={colorScheme === "dark" ? "#FFFFFF" : "#666666"}
                style={styles.helpIcon}
              />
              <Text variant="bodySmall" style={styles.helpText}>
                Need help? Check your HealthScore overview or explore the app
                features.
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderRadius: 16,
  },
  cardContent: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 50,
    backgroundColor: "rgba(255, 152, 0, 0.1)",
  },
  warningIcon: {
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#FF9800",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  actionsContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    backgroundColor: "transparent",
    marginRight: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryButtonText: {
    fontWeight: "600",
  },
  helpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    borderRadius: 8,
    gap: 8,
  },
  helpIcon: {
    backgroundColor: "transparent",
  },
  helpText: {
    opacity: 0.7,
    textAlign: "center",
    flex: 1,
    fontSize: 12,
  },
});
