import { Stack } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderBackTextProps {
  title: string;
  backTitle?: string;
  headerShown?: boolean;
}

export function HeaderBackText({
  title,
  backTitle = "Overview",
  headerShown = true,
}: HeaderBackTextProps) {
  const { colorScheme } = useTheme();

  return (
    <Stack.Screen
      options={{
        title,
        headerShown,
        headerBackTitle: backTitle,
        headerBackTitleVisible: true,
        headerTintColor: colorScheme === "dark" ? "#FFFFFF" : "#000000",
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#151718" : "#FFFFFF",
        },
        headerTitleStyle: {
          color: colorScheme === "dark" ? "#FFFFFF" : "#000000",
          fontWeight: "600",
        },
      }}
    />
  );
}
