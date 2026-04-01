import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { MOCK_CROPS, MOCK_TRANSACTIONS, MOCK_WASTE } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const QUICK_ACTIONS = [
  { icon: "plus-circle", label: "List Crop", route: "/(farmer)/list-crop", color: "#2e7d32" },
  { icon: "trash-2", label: "Sell Waste", route: "/(farmer)/list-waste", color: "#f57c00" },
  { icon: "activity", label: "Disease AI", route: "/(farmer)/disease", color: "#6a1b9a" },
  { icon: "trending-up", label: "Price AI", route: "/(farmer)/price", color: "#1565c0" },
  { icon: "message-circle", label: "AI Chat", route: "/chatbot", color: "#00838f" },
  { icon: "link", label: "Blockchain", route: "/blockchain", color: "#37474f" },
];

export default function FarmerDashboard() {
  const { user, logout } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const myListings = MOCK_CROPS.filter((c) => c.farmerId === "u1");
  const myWaste = MOCK_WASTE.filter((w) => w.farmerId === "u1");
  const recentTx = MOCK_TRANSACTIONS.filter((t) => t.sellerId === "u1").slice(0, 3);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#1b5e20", "#2e7d32", "#43a047"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.userName}>{user?.name ?? "Farmer"}</Text>
            <View style={[styles.locationBadge, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
              <Feather name="map-pin" size={11} color="#fff" />
              <Text style={styles.locationText}>{user?.location ?? "India"}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.headerBtn, { backgroundColor: "rgba(255,255,255,0.18)" }]}
              onPress={() => router.push("/chatbot")}
            >
              <Feather name="message-circle" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerBtn, { backgroundColor: "rgba(255,255,255,0.18)" }]}
              onPress={logout}
            >
              <Feather name="log-out" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{myListings.length}</Text>
            <Text style={styles.statLabel}>Crops Listed</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.25)" }]} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{myWaste.length}</Text>
            <Text style={styles.statLabel}>Waste Listed</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.25)" }]} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>₹{(recentTx.reduce((s, t) => s + t.totalAmount, 0) / 1000).toFixed(1)}K</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={[styles.alertBanner, { backgroundColor: "#ff980018", borderColor: "#ff980050" }]}>
        <Feather name="alert-triangle" size={16} color="#ff9800" />
        <Text style={styles.alertText}>
          <Text style={{ fontFamily: "Inter_600SemiBold", color: "#ff9800" }}>Disease Alert: </Text>
          <Text style={{ color: "#e65100" }}>Yellow Rust detected nearby in Punjab region. Check your wheat crop.</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.label}
              style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(a.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBg, { backgroundColor: a.color + "18" }]}>
                <Feather name={a.icon as any} size={22} color={a.color} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My Crop Listings</Text>
          <TouchableOpacity onPress={() => router.push("/(farmer)/list-crop")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>+ Add New</Text>
          </TouchableOpacity>
        </View>
        {myListings.map((crop) => (
          <View key={crop.id} style={[styles.listingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.listingIconBg, { backgroundColor: colors.secondary }]}>
              <Feather name="package" size={20} color={colors.primary} />
            </View>
            <View style={styles.listingInfo}>
              <Text style={[styles.listingName, { color: colors.foreground }]}>{crop.cropName}</Text>
              <Text style={[styles.listingDetail, { color: colors.mutedForeground }]}>
                {crop.quantity} {crop.unit} · Grade {crop.quality}
              </Text>
            </View>
            <View style={styles.listingRight}>
              <Text style={[styles.listingPrice, { color: colors.primary }]}>₹{crop.pricePerUnit}/{crop.unit}</Text>
              {crop.blockchainVerified && (
                <View style={[styles.verifiedBadge, { backgroundColor: "#1976d218" }]}>
                  <Feather name="shield" size={10} color="#1976d2" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Transactions</Text>
        {recentTx.map((tx) => (
          <View key={tx.id} style={[styles.txRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.txIconBg, { backgroundColor: tx.status === "confirmed" ? "#00c85318" : "#ff980018" }]}>
              <Feather name="check-circle" size={18} color={tx.status === "confirmed" ? "#00c853" : "#ff9800"} />
            </View>
            <View style={styles.txInfo}>
              <Text style={[styles.txName, { color: colors.foreground }]}>{tx.itemName}</Text>
              <Text style={[styles.txBuyer, { color: colors.mutedForeground }]}>Buyer: {tx.buyerName}</Text>
            </View>
            <View style={styles.txRight}>
              <Text style={[styles.txAmount, { color: colors.primary }]}>₹{tx.totalAmount.toLocaleString()}</Text>
              <Text style={[styles.txStatus, { color: tx.status === "confirmed" ? "#00c853" : "#ff9800" }]}>
                {tx.status}
              </Text>
            </View>
          </View>
        ))}
        <TouchableOpacity onPress={() => router.push("/blockchain")} style={styles.viewAllBtn}>
          <Text style={[styles.viewAllText, { color: colors.primary }]}>View All on Blockchain</Text>
          <Feather name="arrow-right" size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.aiPriceBanner, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
        <View style={styles.aiBannerContent}>
          <Feather name="trending-up" size={24} color={colors.primary} />
          <View style={styles.aiBannerText}>
            <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>Predicted Crop Price</Text>
            <Text style={[styles.aiBannerSubtitle, { color: colors.mutedForeground }]}>Basmati Rice in Punjab</Text>
          </View>
          <Text style={[styles.aiBannerPrice, { color: colors.primary }]}>₹88/kg</Text>
        </View>
        <TouchableOpacity
          style={[styles.aiBannerBtn, { borderColor: colors.primary }]}
          onPress={() => router.push("/(farmer)/price")}
        >
          <Text style={[styles.aiBannerBtnText, { color: colors.primary }]}>Get Full Prediction</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "Inter_400Regular",
  },
  userName: {
    fontSize: 22,
    color: "#fff",
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  locationText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNum: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    margin: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
  },
  actionCard: {
    width: "30%",
    flex: 1,
    minWidth: 90,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  actionIconBg: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  listingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  listingIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  listingInfo: {
    flex: 1,
  },
  listingName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  listingDetail: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  listingRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  listingPrice: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: "#1976d2",
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  txIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  txInfo: {
    flex: 1,
  },
  txName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  txBuyer: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  txRight: {
    alignItems: "flex-end",
  },
  txAmount: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  txStatus: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textTransform: "capitalize",
    marginTop: 2,
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    paddingVertical: 10,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  aiPriceBanner: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  aiBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  aiBannerText: { flex: 1 },
  aiBannerTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  aiBannerSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  aiBannerPrice: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  aiBannerBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  aiBannerBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
