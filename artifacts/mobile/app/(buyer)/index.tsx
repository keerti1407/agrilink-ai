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

export default function BuyerDashboard() {
  const { user, logout } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const recentTx = MOCK_TRANSACTIONS.filter((t) => t.buyerId === "u2").slice(0, 3);
  const featuredCrops = MOCK_CROPS.slice(0, 3);
  const featuredWaste = MOCK_WASTE.slice(0, 2);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#0d47a1", "#1565c0", "#1976d2"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Welcome,</Text>
            <Text style={styles.userName}>{user?.name ?? "Buyer"}</Text>
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
            <Text style={styles.statNum}>{MOCK_CROPS.length}</Text>
            <Text style={styles.statLabel}>Crops Available</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.25)" }]} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{MOCK_WASTE.length}</Text>
            <Text style={styles.statLabel}>Waste Listings</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.25)" }]} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{recentTx.length}</Text>
            <Text style={styles.statLabel}>My Orders</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.quickNav}>
        {[
          { label: "Browse Crops", icon: "package", route: "/(buyer)/crops", color: "#1565c0" },
          { label: "Waste Market", icon: "trash-2", route: "/(buyer)/waste", color: "#f57c00" },
          { label: "AI Chatbot", icon: "message-circle", route: "/chatbot", color: "#00838f" },
          { label: "Blockchain", icon: "link", route: "/blockchain", color: "#37474f" },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.navCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.navIconBg, { backgroundColor: item.color + "18" }]}>
              <Feather name={item.icon as any} size={20} color={item.color} />
            </View>
            <Text style={[styles.navLabel, { color: colors.foreground }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Fresh Crop Listings</Text>
          <TouchableOpacity onPress={() => router.push("/(buyer)/crops")}>
            <Text style={[styles.seeAll, { color: "#1565c0" }]}>See All</Text>
          </TouchableOpacity>
        </View>
        {featuredCrops.map((crop) => (
          <View key={crop.id} style={[styles.cropRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.cropIconBg, { backgroundColor: "#1565c018" }]}>
              <Feather name="package" size={20} color="#1565c0" />
            </View>
            <View style={styles.cropInfo}>
              <Text style={[styles.cropName, { color: colors.foreground }]}>{crop.cropName}</Text>
              <Text style={[styles.cropFarmer, { color: colors.mutedForeground }]}>{crop.farmerName} · {crop.location}</Text>
              <Text style={[styles.cropQty, { color: colors.mutedForeground }]}>{crop.quantity} {crop.unit} · Grade {crop.quality}</Text>
            </View>
            <View style={styles.cropRight}>
              <Text style={[styles.cropPrice, { color: "#1565c0" }]}>₹{crop.pricePerUnit}/{crop.unit}</Text>
              {crop.blockchainVerified && <Feather name="shield" size={14} color="#1976d2" />}
              <TouchableOpacity style={[styles.buyBtn, { backgroundColor: "#1565c0" }]}>
                <Text style={styles.buyBtnText}>Buy</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Waste Marketplace</Text>
          <TouchableOpacity onPress={() => router.push("/(buyer)/waste")}>
            <Text style={[styles.seeAll, { color: "#f57c00" }]}>See All</Text>
          </TouchableOpacity>
        </View>
        {featuredWaste.map((waste) => (
          <View key={waste.id} style={[styles.cropRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.cropIconBg, { backgroundColor: "#f57c0018" }]}>
              <Feather name="trash-2" size={20} color="#f57c00" />
            </View>
            <View style={styles.cropInfo}>
              <Text style={[styles.cropName, { color: colors.foreground }]}>{waste.wasteType}</Text>
              <Text style={[styles.cropFarmer, { color: colors.mutedForeground }]}>{waste.farmerName} · {waste.location}</Text>
              <Text style={[styles.cropQty, { color: colors.mutedForeground }]}>{waste.quantity} {waste.unit}</Text>
            </View>
            <View style={styles.cropRight}>
              <Text style={[styles.cropPrice, { color: "#f57c00" }]}>₹{waste.pricePerUnit}/{waste.unit}</Text>
              <TouchableOpacity style={[styles.buyBtn, { backgroundColor: "#f57c00" }]}>
                <Text style={styles.buyBtnText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My Recent Orders</Text>
        {recentTx.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="shopping-bag" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No orders yet</Text>
          </View>
        ) : recentTx.map((tx) => (
          <View key={tx.id} style={[styles.cropRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.cropIconBg, { backgroundColor: tx.status === "confirmed" ? "#00c85318" : "#ff980018" }]}>
              <Feather name="shopping-bag" size={18} color={tx.status === "confirmed" ? "#00c853" : "#ff9800"} />
            </View>
            <View style={styles.cropInfo}>
              <Text style={[styles.cropName, { color: colors.foreground }]}>{tx.itemName}</Text>
              <Text style={[styles.cropFarmer, { color: colors.mutedForeground }]}>From: {tx.sellerName}</Text>
            </View>
            <View style={styles.cropRight}>
              <Text style={[styles.cropPrice, { color: "#1565c0" }]}>₹{tx.totalAmount.toLocaleString()}</Text>
              <Text style={[styles.txStatus, { color: tx.status === "confirmed" ? "#00c853" : "#ff9800" }]}>{tx.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  greeting: { fontSize: 14, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular" },
  userName: { fontSize: 22, color: "#fff", fontFamily: "Inter_700Bold", marginBottom: 6 },
  locationBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: "flex-start" },
  locationText: { color: "#fff", fontSize: 12, fontFamily: "Inter_400Regular" },
  headerActions: { flexDirection: "row", gap: 10 },
  headerBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  statsRow: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 16, padding: 16 },
  statBox: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)", marginTop: 2 },
  statDivider: { width: 1, height: 40 },
  quickNav: { flexDirection: "row", flexWrap: "wrap", gap: 10, padding: 16 },
  navCard: { flex: 1, minWidth: "44%", borderRadius: 16, padding: 14, alignItems: "center", gap: 8, borderWidth: 1 },
  navIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  navLabel: { fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "center" },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  seeAll: { fontSize: 14, fontFamily: "Inter_500Medium" },
  cropRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  cropIconBg: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  cropInfo: { flex: 1 },
  cropName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  cropFarmer: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  cropQty: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  cropRight: { alignItems: "flex-end", gap: 4 },
  cropPrice: { fontSize: 14, fontFamily: "Inter_700Bold" },
  buyBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  buyBtnText: { color: "#fff", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  txStatus: { fontSize: 11, fontFamily: "Inter_500Medium", textTransform: "capitalize" },
  emptyBox: { borderRadius: 16, padding: 32, borderWidth: 1, alignItems: "center", gap: 10 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
