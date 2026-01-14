import React from "react";
import { 
  Modal, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  View,
  Linking 
} from "react-native";
import { Text } from "react-native-paper";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { IconSymbol } from "./ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getAllSources, type MedicalSource } from "@/constants/medicalCitations";

interface MedicalCitationsModalProps {
  visible: boolean;
  onClose: () => void;
  sources?: MedicalSource[];
}

export function MedicalCitationsModal({ 
  visible, 
  onClose, 
  sources 
}: MedicalCitationsModalProps) {
  const backgroundColor = useThemeColor({}, "background");
  const sourcesToShow = sources || getAllSources();

  const handleSourcePress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBackdrop} />
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHandle} />
          
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <View style={styles.modalIcon}>
                <IconSymbol
                  name="doc.text.fill"
                  size={28}
                  color="#2196F3"
                />
              </View>
              <ThemedText type="title" style={styles.modalTitle}>
                Medical Sources & Citations
              </ThemedText>
            </View>
            
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol
                name="xmark"
                size={20}
                color="#666666"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.modalScrollView}
            bounces={false}
          >
            <View style={styles.modalContent}>
              <View style={styles.introSection}>
                <ThemedText style={styles.modalIntroText}>
                  All health recommendations and scoring thresholds in this app are based on peer-reviewed research and guidelines from leading medical organizations:
                </ThemedText>
              </View>

              {sourcesToShow.map((source, index) => (
                <TouchableOpacity
                  key={source.id}
                  style={styles.sourceCard}
                  onPress={() => handleSourcePress(source.url)}
                  activeOpacity={0.7}
                >
                  <View style={styles.sourceHeader}>
                    <View style={styles.sourceNumber}>
                      <Text style={styles.sourceNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.sourceTitleContainer}>
                      <ThemedText style={styles.sourceTitle}>
                        {source.title}
                      </ThemedText>
                      <ThemedText style={styles.sourceAuthors}>
                        {source.authors}
                      </ThemedText>
                    </View>
                    <IconSymbol
                      name="arrow.up.right.square"
                      size={20}
                      color="#2196F3"
                    />
                  </View>
                  
                  <View style={styles.sourceDetails}>
                    <ThemedText style={styles.sourceJournal}>
                      {source.journal} • {source.year}
                    </ThemedText>
                    <ThemedText style={styles.sourceDescription}>
                      {source.description}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}

              <View style={styles.disclaimerSection}>
                <View style={styles.disclaimerIcon}>
                  <IconSymbol
                    name="info.circle.fill"
                    size={24}
                    color="#FF9800"
                  />
                </View>
                <View style={styles.disclaimerContent}>
                  <ThemedText style={styles.disclaimerTitle}>
                    Medical Disclaimer
                  </ThemedText>
                  <ThemedText style={styles.disclaimerText}>
                    This app provides health and fitness information for educational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers regarding your health concerns and before making changes to your health routine.
                  </ThemedText>
                </View>
              </View>
            </View>
          </ScrollView>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    minHeight: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#CCCCCC",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  modalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2196F320",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontWeight: "700",
    fontSize: 20,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  modalScrollView: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  modalContent: {
    paddingBottom: 32,
  },
  introSection: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  modalIntroText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.85,
  },
  sourceCard: {
    backgroundColor: "rgba(128, 128, 128, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.1)",
  },
  sourceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  sourceNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
  },
  sourceNumberText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  sourceTitleContainer: {
    flex: 1,
  },
  sourceTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 20,
  },
  sourceAuthors: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: "italic",
  },
  sourceDetails: {
    marginLeft: 40,
  },
  sourceJournal: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
    fontWeight: "500",
  },
  sourceDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.75,
  },
  disclaimerSection: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  disclaimerIcon: {
    marginTop: 2,
  },
  disclaimerContent: {
    flex: 1,
  },
  disclaimerTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
    color: "#FF9800",
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.85,
  },
});