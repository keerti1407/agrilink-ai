import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WasteListing } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

interface WasteCardProps {
  waste: WasteListing;
  onPress?: () => void;
  onContact?: () => void;
}

const TAG_COLORS = ["#1565c0", "#2e7d32", "#6a1b9a", "#e65100", "#00695c"];

export function WasteCard({ waste, onPress, onContact }: WasteCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={[styles.iconBg, { backgroundColor: colors.accent + "22" }]}>
          <Feather name="trash-2" size={20} color={colors.accent} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.wasteType, { color: colors.foreground }]}>{waste.wasteType}</Text>
          <Text style={[styles.farmer, { color: colors.mutedForeground }]}>{waste.farmerName} · {waste.location}</Text>
        </View>
        {waste.blockchainVerified && (
          <View style={[styles.verifiedBadge, { backgroundColor: "#1976d222" }]}>
            <Feather name="shield" size={12} color="#1976d2" />
          </View>
        )}
      </View>

      <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
        {waste.description}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsRow} contentContainerStyle={styles.tagsContent}>
        {waste.useCaseTags.map((tag, i) => (
          <View key={tag} style={[styles.tag, { backgroundColor: TAG_COLORS[i % TAG_COLORS.length] + "18" }]}>
            <Text style={[styles.tagText, { color: TAG_COLORS[i % TAG_COLORS.length] }]}>{tag}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={[styles.price, { color: colors.primary }]}>₹{waste.pricePerUnit}/{waste.unit}</Text>
          <Text style={[styles.qty, { color: colors.mutedForeground }]}>{waste.quantity} {waste.unit} available</Text>
        </View>
        <TouchableOpacity
          style={[styles.contactBtn, { backgroundColor: colors.accent }]}
          onPress={onContact}
          activeOpacity={0.8}
        >
          <Feather name="message-circle" size={14} color="#fff" />
          <Text style={styles.contactText}>Connect</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  wasteType: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  farmer: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  verifiedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
    marginBottom: 10,
  },
  tagsRow: {
    marginBottom: 12,
  },
  tagsContent: {
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e0e0e0",
  },
  price: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  qty: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 24,
  },
  contactText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
});
