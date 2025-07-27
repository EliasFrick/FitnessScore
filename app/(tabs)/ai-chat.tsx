import { ScrollView, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';

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
      text: 'Hello! I\'m your AI health assistant. I can help you analyze your vitality data, answer questions about your fitness metrics, and provide personalized insights. What would you like to know?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const insets = useSafeAreaInsets();

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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(userMessage.text),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('sleep') || input.includes('rem') || input.includes('deep')) {
      return 'Based on your sleep data, I can see patterns in your REM and deep sleep percentages. Good sleep consistency is crucial for your vitality score. Would you like specific recommendations for improving your sleep quality?';
    }
    
    if (input.includes('heart') || input.includes('hrv') || input.includes('cardiovascular')) {
      return 'Your cardiovascular health metrics including resting heart rate and HRV are important indicators. I can help analyze trends and suggest ways to improve these metrics. What specific aspect would you like to focus on?';
    }
    
    if (input.includes('score') || input.includes('vitality') || input.includes('fitness')) {
      return 'Your vitality score is calculated from cardiovascular health (30%), recovery & sleep (35%), activity & training (30%), and consistency bonus (5%). I can break down each category and show you where to focus for improvement.';
    }
    
    if (input.includes('training') || input.includes('exercise') || input.includes('activity')) {
      return 'Your training and activity data shows your weekly patterns. Consistency is key for both your fitness and vitality score. Would you like personalized training recommendations based on your current metrics?';
    }
    
    return 'I can help you understand your health data better. Try asking me about your sleep patterns, cardiovascular metrics, training data, or overall vitality score. What specific aspect of your health would you like to explore?';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <IconSymbol name="sparkles" size={32} color={tintColor} />
        <ThemedText type="title">AI Health Assistant</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Ask me about your vitality data
        </ThemedText>
      </ThemedView>

      <ScrollView 
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <ThemedView
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <ThemedView style={styles.messageHeader}>
              <IconSymbol
                name={message.sender === 'user' ? 'person.fill' : 'sparkles'}
                size={16}
                color={message.sender === 'user' ? 'rgba(255,255,255,0.9)' : tintColor}
              />
              <ThemedText style={[
                styles.messageTime,
                message.sender === 'user' ? { color: 'rgba(255,255,255,0.8)' } : { color: 'rgba(0,0,0,0.6)' }
              ]}>
                {formatTime(message.timestamp)}
              </ThemedText>
            </ThemedView>
            <ThemedText style={[
              styles.messageText,
              message.sender === 'user' ? { color: 'white' } : { color: '#000000' }
            ]}>
              {message.text}
            </ThemedText>
          </ThemedView>
        ))}
        
        {isTyping && (
          <ThemedView style={[styles.messageContainer, styles.aiMessage]}>
            <ThemedView style={styles.messageHeader}>
              <IconSymbol name="sparkles" size={16} color={tintColor} />
              <ThemedText style={styles.messageTime}>typing...</ThemedText>
            </ThemedView>
            <ThemedText style={styles.typingIndicator}>●●●</ThemedText>
          </ThemedView>
        )}
      </ScrollView>

      <ThemedView style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 20) + 60 }]}>
        <TextInput
          style={[styles.textInput, { color: textColor, borderColor: tintColor }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about your health data..."
          placeholderTextColor={textColor + '80'}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: tintColor }]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <IconSymbol name="paperplane.fill" size={20} color="white" />
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  subtitle: {
    marginTop: 5,
    opacity: 0.7,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  messageContainer: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  typingIndicator: {
    fontSize: 20,
    opacity: 0.6,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});