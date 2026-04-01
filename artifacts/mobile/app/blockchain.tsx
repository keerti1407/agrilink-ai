import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlockchainCard } from "@/components/BlockchainCard";
import { MOCK_TRANSACTIONS } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const FILTERS = ["All", "Crops", "Waste", "Confirmed", "Pending"];

export default function BlockchainScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [filter, setFilter] = useState("All");

  const filtered = MOCK_TRANSACTIONS.filter((tx) => {
    if (filter === "Crops") return tx.itemType === "crop";
    if (filter === "Waste") return tx.itemType === "waste";
    if (filter === "Confirmed") return tx.status === "confirmed";
    if (filter === "Pending") return tx.status === "pending";
    return true;
  });

  const confirmedCount = MOCK_TRANSACTIONS.filter((t) => t.status === "confirmed").length;
  const totalValue = MOCK_TRANSACTIONS.reduce((s, t) => s + t.totalAmount, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#1a237e", "#283593", "#3949ab"]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={[styles.chainIcon, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Feather name="link" size={22} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>Blockchain Ledger</Text>
            <Text style={styles.headerSubtitle}>Immutable · Transparent · Verified</Text>
          </View>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{MOCK_TRANSACTIONS.length}</Text>
            <Text style={styles.statLabel}>Total Blocks</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.25)" }]} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{confirmedCount}</Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.25)" }]} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>₹{(totalValue / 1000).toFixed(1)}K</Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
        </View>

        <View style={[styles.chainVisual, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
          <Feather name="shield" size={14} color="#a5b4fc" />
          <Text style={styles.chainVisualText}>Secured by Distributed Ledger Technology</Text>
          <View style={[styles.liveIndicator, { backgroundColor: "#00c853" }]} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </LinearGradient>

      <View style={[styles.filterBar, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <FlatList
          horizontal
          data={FILTERS}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                { borderColor: colors.border, backgroundColor: colors.card },
                filter === item && { borderColor: "#3949ab", backgroundColor: "#3949ab18" },
              ]}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.filterText, { color: filter === item ? "#3949ab" : colors.foreground }]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: bottomPad + 20, paddingLeft: 4 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Feather name="link" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No transactions found</Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <BlockchainCard tx={item} index={index} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  backBtn: { padding: 4, marginTop: 4 },
  headerCenter: { alignItems: "center", flex: 1 },
  chainIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)", marginTop: 2 },
  statDivider: { width: 1, height: 36 },
  chainVisual: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chainVisualText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
  },
  liveIndicator: { width: 7, height: 7, borderRadius: 4 },
  liveText: { color: "#00c853", fontSize: 11, fontFamily: "Inter_600SemiBold" },
  filterBar: { borderBottomWidth: 1, paddingVertical: 12 },
  filterRow: { gap: 8, paddingHorizontal: 16 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  filterText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, fontFamily: "Inter_400Regular" },
});
