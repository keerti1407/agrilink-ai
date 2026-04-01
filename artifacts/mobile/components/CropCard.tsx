import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CropListing } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

interface CropCardProps {
  crop: CropListing;
  onPress?: () => void;
  onContact?: () => void;
}

const QUALITY_COLORS: Record<string, string> = {
  "A+": "#00c853",
  "A": "#4caf50",
  "B": "#ff9800",
  "C": "#f44336",
};

export function CropCard({ crop, onPress, onContact }: CropCardProps) {
  const colors = useColors();
  const qualityColor = QUALITY_COLORS[crop.quality] ?? colors.primary;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.cropName, { color: colors.foreground }]}>{crop.cropName}</Text>
          <Text style={[styles.farmer, { color: colors.mutedForeground }]}>{crop.farmerName}</Text>
        </View>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: qualityColor + "22" }]}>
            <Text style={[styles.badgeText, { color: qualityColor }]}>Grade {crop.quality}</Text>
          </View>
          {crop.blockchainVerified && (
            <View style={[styles.badge, { backgroundColor: "#1976d222", marginTop: 4 }]}>
              <Feather name="shield" size={10} color="#1976d2" />
              <Text style={[styles.badgeText, { color: "#1976d2", marginLeft: 3 }]}>Verified</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detail}>
          <Feather name="package" size={14} color={colors.mutedForeground} />
          <Text style={[styles.detailText, { color: colors.mutedForeground }]}>{crop.quantity} {crop.unit}</Text>
        </View>
        <View style={styles.detail}>
          <Feather name="map-pin" size={14} color={colors.mutedForeground} />
          <Text style={[styles.detailText, { color: colors.mutedForeground }]} numberOfLines={1}>{crop.location}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={[styles.price, { color: colors.primary }]}>₹{crop.pricePerUnit}/{crop.unit}</Text>
          <Text style={[styles.total, { color: colors.mutedForeground }]}>Total: ₹{(crop.pricePerUnit * crop.quantity).toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={[styles.contactBtn, { backgroundColor: colors.primary }]}
          onPress={onContact}
          activeOpacity={0.8}
        >
          <Feather name="message-circle" size={14} color="#fff" />
          <Text style={styles.contactText}>Contact</Text>
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cropName: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  farmer: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  badges: {
    alignItems: "flex-end",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  details: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 14,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  detailText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
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
  total: {
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
