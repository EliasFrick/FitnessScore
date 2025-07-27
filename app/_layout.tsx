import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import 'react-native-reanimated';

import { ThemeProvider as CustomThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

function AppContent() {
  const { colorScheme } = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  // Create custom Paper themes that match our color scheme
  const paperTheme = colorScheme === 'dark' 
    ? {
        ...MD3DarkTheme,
        colors: {
          ...MD3DarkTheme.colors,
          background: Colors.dark.background,
          surface: Colors.dark.background,
          surfaceVariant: '#1F2125',
          onSurface: Colors.dark.text,
          onSurfaceVariant: Colors.dark.text,
          primary: Colors.dark.tint,
          onPrimary: Colors.dark.background,
        }
      }
    : {
        ...MD3LightTheme,
        colors: {
          ...MD3LightTheme.colors,
          background: Colors.light.background,
          surface: Colors.light.background,
          surfaceVariant: '#F5F5F5',
          onSurface: Colors.light.text,
          onSurfaceVariant: Colors.light.text,
          primary: Colors.light.tint,
          onPrimary: Colors.light.background,
        }
      };

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}
