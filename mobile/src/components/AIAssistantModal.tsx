import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/src/lib/api";
import { Color } from "@/src/models/Color";
import * as Sentry from '@sentry/react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Black,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: Color.DarkGray,
  },
  headerTitle: { color: Color.White, fontWeight: "bold", fontSize: 18 },
  bubble: { padding: 12, borderRadius: 12, marginBottom: 10, maxWidth: "80%" },
  userBubble: { alignSelf: "flex-end", backgroundColor: Color.Green },
  aiBubble: { alignSelf: "flex-start", backgroundColor: Color.DarkGray },
  text: { color: Color.White },
  inputRow: { flexDirection: "row", padding: 20, backgroundColor: Color.DarkGray },
  input: { flex: 1, color: Color.White, paddingRight: 10, bottom: 5 },
  sendBtn: {
    backgroundColor: Color.Green,
    borderRadius: 20,
    bottom: 5,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

const AIAssistantModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const api = useApi();
  const queryClient = useQueryClient();

  // Load initial 10 messages when modal opens
  const fetchInitialHistory = async () => {
    try {
      setFetchingHistory(true);
      const response = await api.get("/ai/history?limit=10");
      setMessages(response.data.messages);
      setHasMore(response.data.hasMore);
    } catch (err) {
      console.error("Error loading chat history:", err);
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchInitialHistory();
    }
  }, [visible, fetchInitialHistory]);

  // Load next 10 older messages on scroll top (onEndReached for inverted list)
  const handleLoadMore = useCallback(async () => {
    if (fetchingHistory || !hasMore || messages.length === 0) return;

    const oldestMessage = messages[messages.length - 1];
    if (!oldestMessage?.createdAt) return;

    try {
      setFetchingHistory(true);
      const response = await api.get(
        `/ai/history?limit=10&before=${encodeURIComponent(oldestMessage.createdAt)}`
      );

      setMessages((prev) => [...prev, ...response.data.messages]);
      setHasMore(response.data.hasMore);
    } catch (err) {
      console.error("Error loading more history:", err);
    } finally {
      setFetchingHistory(false);
    }
  }, [fetchingHistory, hasMore, messages, api]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/ai/chat", {
        messages: [userMessage],
      });
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data.reply,
      };
      setMessages((prev) => [assistantMessage, ...prev]);
      // Trigger TanStack Query refresh if cart was modified by agent
      if (response.data.cartUpdated) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    } catch (err: any) {
      // 1. Log the full error for debugging / monitoring
      console.error("AI Chat Error:", err);
      Sentry?.captureException?.(err);

      // 2. Extract a user-friendly error message based on the HTTP status or message
      let errorMessage = "Sorry, I had trouble processing that request. Please try again.";

      if (err.response) {
        // The server responded with an error status code (e.g., 400, 429, 500)
        if (err.response.status === 429) {
          errorMessage = "You're sending messages too fast! Please wait a moment.";
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        }
      } else if (err.request) {
        // Request was made but no response was received (e.g., network offline)
        errorMessage = "Network error. Please check your internet connection.";
      }

      // 3. Append the error message from the assistant
      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: errorMessage,
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Assistant</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={Color.White} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          inverted={true}
          contentContainerStyle={{ padding: 15 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            fetchingHistory ? (
              <ActivityIndicator
                size="small"
                color={Color.Green}
                style={{ marginVertical: 10 }}
              />
            ) : null
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={styles.text}>{item.content}</Text>
            </View>
          )}
        />

        {loading && <ActivityIndicator size="small" color={Color.Green} style={{ marginBottom: 10 }} />}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="e.g., Add running shoes under $100 to my cart"
            placeholderTextColor={Color.Grey}
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="arrow-up" size={20} color={Color.Black} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(AIAssistantModal);

