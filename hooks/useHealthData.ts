import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import HealthService from '@/services/healthService';
import { HealthMetrics, getZeroHealthMetrics } from '@/utils/fitnessCalculator';

export function useHealthData() {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>(getZeroHealthMetrics());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHealthKitAvailable, setIsHealthKitAvailable] = useState(Platform.OS === 'ios');

  const fetchHealthData = async () => {
    if (Platform.OS !== 'ios') {
      setIsHealthKitAvailable(false);
      setError('No data available - please allow Apple Health access');
      setHealthMetrics(getZeroHealthMetrics());
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const data = await HealthService.getAllHealthMetrics();
      setHealthMetrics(data);
    } catch (err) {
      console.error('Error fetching health data:', err);
      setError('No data available - please allow Apple Health access');
      // Use zero metrics when no data is available
      setHealthMetrics(getZeroHealthMetrics());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  return {
    healthMetrics,
    isLoading,
    error,
    isHealthKitAvailable,
    refreshData: fetchHealthData,
  };
}