import { ScrollView, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, View, Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useHealthData } from '@/hooks/useHealthData';
import AIService from '@/services/aiService';
import HealthAggregationService from '@/services/healthAggregationService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Jasmine, your AI health assistant. I can help you analyze your vitality data, answer questions about your fitness metrics, and provide personalized insights. What would you like to know?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAIConfigured, setIsAIConfigured] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const { healthMetrics, isLoading: isHealthLoading, refreshData } = useHealthData();
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');
  const bubbleBackground = useThemeColor({ light: '#FFFFFF', dark: '#2C2C2E' }, 'background');
  const inputBackground = useThemeColor({ light: '#F2F2F7', dark: '#38383A' }, 'background');
  const borderColor = useThemeColor({ light: '#E5E5EA', dark: '#38383A' }, 'icon');
  const subtleTextColor = useThemeColor({ light: '#8E8E93', dark: '#98989D' }, 'tabIconDefault');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    checkAIConfiguration();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const checkAIConfiguration = () => {
    const config = AIService.getConfigurationStatus();
    setIsAIConfigured(config.isConfigured);
    
    if (!config.isConfigured) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'To enable AI features, please configure your OpenAI API key in the AI Settings tab. Until then, I can provide basic responses about your health data.',
        sender: 'ai',
        timestamp: new Date(),
      }]);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Create health context for AI
      const healthContext = await HealthAggregationService.createHealthContext(healthMetrics);
      
      // Get AI response
      const aiResponse = await AIService.generateResponse(
        userMessage.text,
        healthContext,
        true // Use cache
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.message,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Store health data for future analysis
      await HealthAggregationService.storeAndAggregate(healthMetrics);

    } catch (error) {
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an error processing your request. Please check your AI settings and try again. In the meantime, I can still help with basic questions about your health data.',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: insets.top + 20, backgroundColor: cardBackground, borderBottomColor: borderColor }]}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="sparkles" size={24} color="white" />
          </View>
          <View style={styles.headerText}>
            <ThemedText type="title" style={[styles.headerTitle, { color: textColor }]}>Jasmine</ThemedText>
            <ThemedText style={[styles.headerSubtitle, { color: subtleTextColor }]}>
              AI Health Assistant {!isAIConfigured && '(Basic Mode)'}
            </ThemedText>
          </View>
          
          <TouchableOpacity
            style={[styles.refreshButton, { backgroundColor: inputBackground }]}
            onPress={refreshData}
            disabled={isHealthLoading}
          >
            <IconSymbol 
              name={isHealthLoading ? "arrow.clockwise" : "arrow.clockwise"} 
              size={16} 
              color={tintColor} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={[styles.messagesContainer, { backgroundColor }]}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.sender === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.sender === 'user' 
                  ? [styles.userBubble, { backgroundColor: tintColor }] 
                  : [styles.aiBubble, { backgroundColor: bubbleBackground, borderColor }],
              ]}
            >
              <ThemedText style={[
                styles.messageText,
                message.sender === 'user' 
                  ? styles.userText 
                  : [styles.aiText, { color: textColor }]
              ]}>
                {message.text}
              </ThemedText>
            </View>
            <ThemedText style={[
              styles.timestamp,
              message.sender === 'user' ? styles.userTimestamp : styles.aiTimestamp,
              { color: subtleTextColor }
            ]}>
              {formatTime(message.timestamp)}
            </ThemedText>
          </View>
        ))}
        
        {isTyping && (
          <View style={[styles.messageWrapper, styles.aiMessageWrapper]}>
            <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble, { backgroundColor: bubbleBackground, borderColor }]}>
              <ThemedText style={[styles.typingIndicator, { color: subtleTextColor }]}>●●●</ThemedText>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom + 80, 20), backgroundColor: cardBackground, borderTopColor: borderColor }]}>
        <View style={[styles.inputWrapper, { backgroundColor: inputBackground, borderColor }]}>
          <TextInput
            style={[styles.textInput, { color: textColor }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message Jasmine..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          {inputText.trim() && (
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: tintColor }]}
              onPress={sendMessage}
            >
              <IconSymbol name="arrow.up" size={16} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    flex: 1,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    gap: 12,
  },
  messageWrapper: {
    marginVertical: 4,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  aiMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userBubble: {
    borderBottomRightRadius: 6,
  },
  aiBubble: {
    borderBottomLeftRadius: 6,
    borderWidth: 0.5,
  },
  typingBubble: {
    paddingVertical: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    
  },
  timestamp: {
    fontSize: 12,
    marginTop: 6,
    marginHorizontal: 16,
    fontWeight: '400',
  },
  userTimestamp: {
    textAlign: 'right',
  },
  aiTimestamp: {
    textAlign: 'left',
  },
  typingIndicator: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 0.5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    maxHeight: 100,
    paddingVertical: 6,
    fontWeight: '400',
  },
  sendButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
});