import { useState, useEffect } from "react";
import StorageService from "@/services/storageService";

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
      if (consent === null) {
        setShowConsentModal(true);
      }
    } catch (error) {
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
