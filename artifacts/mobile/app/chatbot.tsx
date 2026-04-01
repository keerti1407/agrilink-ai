import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "How do I prevent crop diseases?",
  "What's the best time to sell wheat?",
  "How can I sell rice stubble?",
  "Explain blockchain verification",
  "Tips for organic farming",
];

const AI_RESPONSES: Record<string, string> = {
  disease: "Crop diseases can be prevented through: 1) Using disease-resistant varieties, 2) Proper crop rotation, 3) Balanced fertilization, 4) Regular field monitoring, 5) Timely application of approved fungicides when symptoms appear. Use our Disease AI feature to upload a photo for instant diagnosis!",
  wheat: "Best time to sell wheat in India: April to June is peak harvest season when prices are highest at mandis. Government procurement through MSP (₹2,275/quintal for 2025-26) provides a price floor. Monitor APMC daily prices and consider holding stock for 2-3 weeks post-harvest if storage is available.",
  rice: "Rice stubble (parali) can be sold instead of burning! Options include: 1) Biofuel plants - ₹0.40-0.60/kg, 2) Composting companies, 3) Paper mills, 4) Cattle feed producers. List on AgriLink AI's Waste Marketplace to reach verified buyers instantly.",
  blockchain: "Blockchain in AgriLink AI creates an immutable record of every transaction. Each crop/waste sale generates a unique transaction hash recorded in a distributed ledger. This ensures: transparency (both parties can verify), no fraud, no price manipulation, and a permanent audit trail. Buyers get confidence that sellers are genuine farmers.",
  organic: "Organic farming tips: 1) Use vermicompost and FYM as base fertilizers, 2) Practice integrated pest management (IPM), 3) Crop rotation with legumes for nitrogen fixation, 4) Neem-based pesticides, 5) Adequate irrigation management. Organic produce commands 20-40% premium prices in the marketplace!",
  default: "I'm AgriLink AI's agricultural assistant. I can help with crop diseases, selling strategies, waste management, price predictions, and farming best practices. What would you like to know about farming or the marketplace today?",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("disease") || lower.includes("pest") || lower.includes("fungus")) return AI_RESPONSES.disease;
  if (lower.includes("wheat") || lower.includes("sell")) return AI_RESPONSES.wheat;
  if (lower.includes("rice") || lower.includes("stubble") || lower.includes("waste")) return AI_RESPONSES.rice;
  if (lower.includes("blockchain") || lower.includes("verify") || lower.includes("transaction")) return AI_RESPONSES.blockchain;
  if (lower.includes("organic") || lower.includes("natural") || lower.includes("compost")) return AI_RESPONSES.organic;
  return AI_RESPONSES.default;
}

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "assistant",
  content: "Hello! I'm AgriLink AI Assistant. I can help you with crop diseases, price predictions, waste selling, blockchain verification, and farming advice. How can I assist you today?",
  timestamp: new Date(),
};

export default function ChatbotScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  const sendMessage = async (text: string) => {
    const msg = text.trim();
    if (!msg) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: msg,
      timestamp: new Date(),
    };
    setMessages((prev) => [userMsg, ...prev]);
    setInput("");
    setIsTyping(true);

    const typingDelay = 1000 + Math.random() * 1000;
    await new Promise((r) => setTimeout(r, typingDelay));

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getAIResponse(msg),
      timestamp: new Date(),
    };
    setMessages((prev) => [aiMsg, ...prev]);
    setIsTyping(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: colors.primary + "20" }]}>
            <Text style={styles.avatarEmoji}>🤖</Text>
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.userBubble, { backgroundColor: colors.primary }]
              : [styles.aiBubble, { backgroundColor: colors.card, borderColor: colors.border }],
          ]}
        >
          <Text style={[styles.bubbleText, { color: isUser ? "#fff" : colors.foreground }]}>
            {item.content}
          </Text>
          <Text style={[styles.timestamp, { color: isUser ? "rgba(255,255,255,0.6)" : colors.mutedForeground }]}>
            {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={[styles.botAvatar, { backgroundColor: colors.primary + "18" }]}>
          <Text style={styles.botAvatarEmoji}>🤖</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>AgriLink AI</Text>
          <View style={styles.onlineRow}>
            <View style={[styles.onlineDot, { backgroundColor: "#00c853" }]} />
            <Text style={[styles.onlineText, { color: colors.mutedForeground }]}>Always online</Text>
          </View>
        </View>
      </View>

      {messages.length === 1 && (
        <View style={styles.suggestions}>
          {SUGGESTIONS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.suggestionChip, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => sendMessage(s)}
              activeOpacity={0.8}
            >
              <Text style={[styles.suggestionText, { color: colors.foreground }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={[styles.messagesList, { paddingBottom: bottomPad + 80 }]}
        inverted
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          isTyping ? (
            <View style={styles.messageRow}>
              <View style={[styles.avatar, { backgroundColor: colors.primary + "20" }]}>
                <Text style={styles.avatarEmoji}>🤖</Text>
              </View>
              <View style={[styles.bubble, styles.aiBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.bubbleText, { color: colors.mutedForeground }]}>Thinking...</Text>
              </View>
            </View>
          ) : null
        }
      />

      <View style={[styles.inputRow, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 8 }]}>
        <TextInput
          style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }]}
          placeholder="Ask about crops, diseases, prices..."
          placeholderTextColor={colors.mutedForeground}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          onSubmitEditing={() => sendMessage(input)}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: input.trim() ? colors.primary : colors.muted }]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          activeOpacity={0.85}
        >
          <Feather name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  botAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  botAvatarEmoji: { fontSize: 20 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  onlineRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4 },
  onlineText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  suggestions: {
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  suggestionText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  messagesList: { padding: 16, gap: 12 },
  messageRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
    marginBottom: 8,
  },
  messageRowUser: { flexDirection: "row-reverse" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEmoji: { fontSize: 16 },
  bubble: {
    maxWidth: "78%",
    borderRadius: 18,
    padding: 12,
    gap: 4,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
  },
  timestamp: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    alignSelf: "flex-end",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
