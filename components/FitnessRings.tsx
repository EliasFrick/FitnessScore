import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface FitnessRingsProps {
  fitnessScore: number;
  regenerationScore: number;
  overallLevel: number;
  size?: number;
}

export const FitnessRings: React.FC<FitnessRingsProps> = ({
  fitnessScore,
  regenerationScore,
  overallLevel,
  size = 120,
}) => {
  const theme = useTheme();
  
  const center = size / 2;
  const outerRadius = size / 2 - 8;
  const innerRadius = size / 2 - 24;
  const strokeWidth = 8;
  
  const outerCircumference = 2 * Math.PI * outerRadius;
  const innerCircumference = 2 * Math.PI * innerRadius;
  
  const outerProgress = (regenerationScore / 35) * 100; // Max regeneration score is 35
  const innerProgress = (fitnessScore / 100) * 100; // Overall fitness score out of 100
  
  const outerStrokeDasharray = outerCircumference;
  const outerStrokeDashoffset = outerCircumference - (outerProgress / 100) * outerCircumference;
  
  const innerStrokeDasharray = innerCircumference;
  const innerStrokeDashoffset = innerCircumference - (innerProgress / 100) * innerCircumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="regenerationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#4CAF50" stopOpacity="1" />
            <Stop offset="100%" stopColor="#8BC34A" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="fitnessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2196F3" stopOpacity="1" />
            <Stop offset="100%" stopColor="#03DAC6" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* Outer ring background */}
        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          stroke={theme.colors.outline}
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.15}
        />
        
        {/* Outer ring progress (Regeneration) */}
        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          stroke="url(#regenerationGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={outerStrokeDasharray}
          strokeDashoffset={outerStrokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
        
        {/* Inner ring background */}
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          stroke={theme.colors.outline}
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.15}
        />
        
        {/* Inner ring progress (Fitness) */}
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          stroke="url(#fitnessGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={innerStrokeDasharray}
          strokeDashoffset={innerStrokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      
      {/* Center text with overall level */}
      <View style={styles.centerContent}>
        <Text variant="headlineMedium" style={[styles.levelText, { color: theme.colors.primary }]}>
          {overallLevel}
        </Text>
        <Text variant="bodySmall" style={[styles.labelText, { color: theme.colors.onSurfaceVariant }]}>
          Level
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  labelText: {
    textAlign: 'center',
    marginTop: -4,
  },
});