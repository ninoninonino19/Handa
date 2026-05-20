import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Modal, TextInput, TouchableOpacity,
  FlatList, ActivityIndicator, KeyboardAvoidingView, Platform,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { generateResponse } from '../services/aiService';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

const AIChatModal: React.FC<Props> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! I am Handa AI, your disaster assistant. Ask me anything about safety, evacuation, or preparedness.', isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const aiResponse = await generateResponse(userMessage.text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageRow, item.isUser ? styles.userRow : styles.assistantRow]}>
      <View style={[styles.bubble, item.isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={item.isUser ? styles.userText : styles.assistantText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Handa AI Assistant</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.chatContainer}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ff5722" />
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything about disaster preparedness..."
              placeholderTextColor="#adb5bd"   // visible gray placeholder
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: moderateScale(20), fontWeight: 'bold', color: '#333' },
  closeButton: { padding: scale(4) },
  chatContainer: { padding: scale(16), paddingBottom: scale(20) },
  messageRow: { marginVertical: verticalScale(6) },
  userRow: { alignItems: 'flex-end' },
  assistantRow: { alignItems: 'flex-start' },
  bubble: { maxWidth: '80%', padding: scale(12), borderRadius: scale(18) },
  userBubble: { backgroundColor: '#ff5722' },
  assistantBubble: { backgroundColor: '#f0f0f0' },
  userText: { color: '#fff', fontSize: moderateScale(15) },
  assistantText: { color: '#333', fontSize: moderateScale(15) },
  loadingContainer: { alignItems: 'center', marginVertical: verticalScale(8) },
  inputContainer: {
    flexDirection: 'row',
    padding: scale(12),
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f3f5',   // light background
    color: '#212529',              // black/dark text – visible!
    borderRadius: scale(20),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    maxHeight: scale(100),
    fontSize: moderateScale(16),
  },
  sendButton: {
    backgroundColor: '#ff5722',
    marginLeft: scale(8),
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AIChatModal;