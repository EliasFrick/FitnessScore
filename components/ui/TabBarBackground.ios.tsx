import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function BlurTabBarBackground() {
  const colorScheme = useColorScheme();
  
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint={colorScheme === 'dark' ? 'systemMaterialDark' : 'systemChromeMaterial'}
      intensity={colorScheme === 'dark' ? 90 : 100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
