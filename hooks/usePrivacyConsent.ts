import { useState, useEffect } from 'react';
import StorageService from '@/services/storageService';

export function usePrivacyConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    checkConsent();
  }, []);

  const checkConsent = async () => {
    try {
      const consent = await StorageService.getUserConsent();
      setHasConsent(consent);
      
      // Show consent modal if consent hasn't been given yet
      if (consent === false) {
        // Check if user has explicitly declined or just hasn't decided yet
        const hasDeclinedBefore = await StorageService.getUserConsent();
        if (!hasDeclinedBefore) {
          setShowConsentModal(true);
        }
      }
    } catch (error) {
      console.error('Error checking consent:', error);
      setHasConsent(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsentResponse = async (consent: boolean) => {
    try {
      await StorageService.setUserConsent(consent);
      setHasConsent(consent);
      setShowConsentModal(false);
    } catch (error) {
      console.error('Error setting consent:', error);
      throw error;
    }
  };

  const requestConsent = () => {
    setShowConsentModal(true);
  };

  const revokeConsent = async () => {
    try {
      await StorageService.setUserConsent(false);
      setHasConsent(false);
    } catch (error) {
      console.error('Error revoking consent:', error);
      throw error;
    }
  };

  return {
    hasConsent,
    isLoading,
    showConsentModal,
    setShowConsentModal,
    handleConsentResponse,
    requestConsent,
    revokeConsent,
    checkConsent,
  };
}