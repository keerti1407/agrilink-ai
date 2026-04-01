import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
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
import { ADMIN_STATS, MOCK_CROPS, MOCK_TRANSACTIONS, MOCK_WASTE } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const FLAGGED = [
  { id: "f1", type: "Crop", name: "Adulterated Rice", farmer: "Unknown Farmer", reason: "Quality mismatch", severity: "high" },
  { id: "f2", type: "Waste", name: "Chemical Waste", farmer: "Ramesh G.", reason: "Non-agricultural waste", severity: "high" },
  { id: "f3", type: "Crop", name: "Underpriced Wheat", farmer: "Dinesh K.", reason: "Suspicious pricing", severity: "medium" },
];

export default function AdminScreen() {
  const { logout } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "flagged">("overview");

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "listings", label: "Listings" },
    { key: "flagged", label: "Flagged" },
  ] as const;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#37474f", "#455a64", "#546e7a"]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <Text style={styles.headerSubtitle}>AgriLink AI Management</Text>
          </View>
          <TouchableOpacity
            style={[styles.logoutBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}
            onPress={logout}
          >
            <Feather name="log-out" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && { backgroundColor: "rgba(255,255,255,0.2)" },
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && { fontFamily: "Inter_700Bold" }]}>
                {tab.label}
                {tab.key === "flagged" && ` (${FLAGGED.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "overview" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Platform Statistics</Text>
            <View style={styles.statsGrid}>
              {[
                { label: "Total Users", value: ADMIN_STATS.totalUsers.toLocaleString(), icon: "users", color: "#1565c0" },
                { label: "Total Farmers", value: ADMIN_STATS.totalFarmers.toLocaleString(), icon: "user", color: "#2e7d32" },
                { label: "Total Buyers", value: ADMIN_STATS.totalBuyers.toLocaleString(), icon: "shopping-bag", color: "#f57c00" },
                { label: "Transactions", value: ADMIN_STATS.totalTransactions.toLocaleString(), icon: "activity", color: "#6a1b9a" },
                { label: "Crop Listings", value: ADMIN_STATS.totalCropListings.toLocaleString(), icon: "package", color: "#00838f" },
                { label: "Waste Listings", value: ADMIN_STATS.totalWasteListings.toLocaleString(), icon: "trash-2", color: "#d84315" },
              ].map((stat) => (
                <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color + "18" }]}>
                    <Feather name={stat.icon as any} size={20} color={stat.color} />
                  </View>
                  <Text style={[styles.statValue, { color: colors.foreground }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 16 }]}>Revenue & Impact</Text>
            <View style={[styles.revenueCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.revenueRow}>
                <Feather name="dollar-sign" size={18} color="#2e7d32" />
                <Text style={[styles.revenueLabel, { color: colors.mutedForeground }]}>Total Trade Volume</Text>
                <Text style={[styles.revenueValue, { color: "#2e7d32" }]}>₹{(ADMIN_STATS.totalRevenue / 10000000).toFixed(1)}Cr</Text>
              </View>
              <View style={styles.revenueRow}>
                <Feather name="wind" size={18} color="#f57c00" />
                <Text style={[styles.revenueLabel, { color: colors.mutedForeground }]}>Waste Reused</Text>
                <Text style={[styles.revenueValue, { color: "#f57c00" }]}>{(ADMIN_STATS.wasteReused / 1000).toFixed(0)} tons</Text>
              </View>
              <View style={styles.revenueRow}>
                <Feather name="cloud" size={18} color="#1565c0" />
                <Text style={[styles.revenueLabel, { color: colors.mutedForeground }]}>CO₂ Prevented</Text>
                <Text style={[styles.revenueValue, { color: "#1565c0" }]}>{ADMIN_STATS.co2Saved} tons</Text>
              </View>
              <View style={styles.revenueRow}>
                <Feather name="alert-triangle" size={18} color="#e53935" />
                <Text style={[styles.revenueLabel, { color: colors.mutedForeground }]}>Flagged Listings</Text>
                <Text style={[styles.revenueValue, { color: "#e53935" }]}>{ADMIN_STATS.flaggedListings}</Text>
              </View>
            </View>

            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#1565c018", borderColor: "#1565c030" }]}
                onPress={() => router.push("/blockchain")}
              >
                <Feather name="link" size={18} color="#1565c0" />
                <Text style={[styles.actionBtnText, { color: "#1565c0" }]}>View Blockchain</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#6a1b9a18", borderColor: "#6a1b9a30" }]}
                onPress={() => setActiveTab("flagged")}
              >
                <Feather name="flag" size={18} color="#6a1b9a" />
                <Text style={[styles.actionBtnText, { color: "#6a1b9a" }]}>Review Flagged</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === "listings" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Crop Listings ({MOCK_CROPS.length})</Text>
            {MOCK_CROPS.map((crop) => (
              <View key={crop.id} style={[styles.listingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.listingHeader}>
                  <Text style={[styles.listingName, { color: colors.foreground }]}>{crop.cropName}</Text>
                  <View style={[styles.verifiedBadge, { backgroundColor: crop.blockchainVerified ? "#1976d218" : "#ff980018" }]}>
                    <Feather name={crop.blockchainVerified ? "shield" : "alert-circle"} size={11} color={crop.blockchainVerified ? "#1976d2" : "#ff9800"} />
                    <Text style={[styles.verifiedText, { color: crop.blockchainVerified ? "#1976d2" : "#ff9800" }]}>
                      {crop.blockchainVerified ? "Verified" : "Unverified"}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.listingDetail, { color: colors.mutedForeground }]}>
                  {crop.farmerName} · {crop.location} · {crop.quantity} {crop.unit} · ₹{crop.pricePerUnit}/{crop.unit}
                </Text>
                <View style={styles.moderationRow}>
                  <TouchableOpacity style={[styles.modBtn, { backgroundColor: "#00c85318" }]}>
                    <Text style={{ color: "#00c853", fontFamily: "Inter_600SemiBold", fontSize: 12 }}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modBtn, { backgroundColor: "#e5393518" }]}>
                    <Text style={{ color: "#e53935", fontFamily: "Inter_600SemiBold", fontSize: 12 }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 16 }]}>Waste Listings ({MOCK_WASTE.length})</Text>
            {MOCK_WASTE.map((waste) => (
              <View key={waste.id} style={[styles.listingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.listingHeader}>
                  <Text style={[styles.listingName, { color: colors.foreground }]}>{waste.wasteType}</Text>
                  <View style={[styles.verifiedBadge, { backgroundColor: "#f57c0018" }]}>
                    <Text style={[styles.verifiedText, { color: "#f57c00" }]}>Waste</Text>
                  </View>
                </View>
                <Text style={[styles.listingDetail, { color: colors.mutedForeground }]}>
                  {waste.farmerName} · {waste.location} · {waste.quantity} {waste.unit}
                </Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "flagged" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Flagged Listings ({FLAGGED.length})</Text>
            {FLAGGED.map((item) => (
              <View key={item.id} style={[styles.flaggedCard, { backgroundColor: colors.card, borderColor: item.severity === "high" ? "#e5393540" : "#ff980040" }]}>
                <View style={styles.flaggedHeader}>
                  <View style={[styles.severityBadge, { backgroundColor: item.severity === "high" ? "#e5393518" : "#ff980018" }]}>
                    <Text style={[styles.severityText, { color: item.severity === "high" ? "#e53935" : "#ff9800" }]}>
                      {item.severity.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.flaggedType, { color: colors.mutedForeground }]}>{item.type} Listing</Text>
                </View>
                <Text style={[styles.flaggedName, { color: colors.foreground }]}>{item.name}</Text>
                <Text style={[styles.flaggedFarmer, { color: colors.mutedForeground }]}>By: {item.farmer}</Text>
                <View style={[styles.reasonBox, { backgroundColor: "#ff980010" }]}>
                  <Feather name="flag" size={12} color="#ff9800" />
                  <Text style={[styles.reasonText, { color: "#e65100" }]}>Reason: {item.reason}</Text>
                </View>
                <View style={styles.moderationRow}>
                  <TouchableOpacity style={[styles.modBtn, { backgroundColor: "#00c85318", flex: 1 }]}>
                    <Text style={{ color: "#00c853", fontFamily: "Inter_600SemiBold", fontSize: 12, textAlign: "center" }}>Clear Flag</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modBtn, { backgroundColor: "#e5393518", flex: 1 }]}>
                    <Text style={{ color: "#e53935", fontFamily: "Inter_600SemiBold", fontSize: 12, textAlign: "center" }}>Remove Listing</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 0 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)", marginTop: 3 },
  logoutBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  tabRow: { flexDirection: "row", gap: 4, paddingBottom: 0 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 8 },
  tabText: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "Inter_500Medium" },
  section: { padding: 16 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 14, letterSpacing: -0.3 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: { width: "30%", flex: 1, minWidth: "28%", borderRadius: 16, padding: 14, borderWidth: 1, alignItems: "center", gap: 6 },
  statIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  revenueCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 12 },
  revenueRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  revenueLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  revenueValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  quickActions: { flexDirection: "row", gap: 10, marginTop: 16 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, justifyContent: "center" },
  actionBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  listingCard: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  listingHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  listingName: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1 },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  verifiedText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  listingDetail: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  moderationRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  modBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, flex: 1, alignItems: "center" },
  flaggedCard: { borderRadius: 16, padding: 16, borderWidth: 1.5, marginBottom: 10 },
  flaggedHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  severityText: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  flaggedType: { fontSize: 12, fontFamily: "Inter_400Regular" },
  flaggedName: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 3 },
  flaggedFarmer: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 8 },
  reasonBox: { flexDirection: "row", alignItems: "center", gap: 6, padding: 8, borderRadius: 8, marginBottom: 10 },
  reasonText: { fontSize: 13, fontFamily: "Inter_500Medium" },
});
