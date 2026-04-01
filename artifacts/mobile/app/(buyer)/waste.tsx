import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WasteCard } from "@/components/WasteCard";
import { ADMIN_STATS, MOCK_WASTE } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const WASTE_TAGS = ["All", "Biofuel", "Compost", "Animal Fodder", "Packaging", "Building Material"];

export default function WasteMarketScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("All");

  const filtered = useMemo(() => {
    let waste = [...MOCK_WASTE];
    if (search) {
      const q = search.toLowerCase();
      waste = waste.filter((w) => w.wasteType.toLowerCase().includes(q) || w.location.toLowerCase().includes(q));
    }
    if (tag !== "All") {
      waste = waste.filter((w) => w.useCaseTags.includes(tag));
    }
    return waste;
  }, [search, tag]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Waste Marketplace</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          Source agricultural waste, prevent burning
        </Text>

        <View style={[styles.impactRow, { backgroundColor: "#f57c0012", borderColor: "#f57c0030" }]}>
          <View style={styles.impactItem}>
            <Text style={[styles.impactNum, { color: "#f57c00" }]}>{(ADMIN_STATS.wasteReused / 1000).toFixed(0)}T</Text>
            <Text style={[styles.impactLabel, { color: colors.mutedForeground }]}>Waste Reused</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: "#f57c0030" }]} />
          <View style={styles.impactItem}>
            <Text style={[styles.impactNum, { color: "#f57c00" }]}>{ADMIN_STATS.co2Saved}T</Text>
            <Text style={[styles.impactLabel, { color: colors.mutedForeground }]}>CO₂ Saved</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: "#f57c0030" }]} />
          <View style={styles.impactItem}>
            <Text style={[styles.impactNum, { color: "#f57c00" }]}>{(ADMIN_STATS.pollutionPrevented / 1000).toFixed(0)}T</Text>
            <Text style={[styles.impactLabel, { color: colors.mutedForeground }]}>Pollution Prevented</Text>
          </View>
        </View>

        <View style={[styles.searchBar, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search waste types, locations..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search ? <TouchableOpacity onPress={() => setSearch("")}><Feather name="x" size={16} color={colors.mutedForeground} /></TouchableOpacity> : null}
        </View>

        <FlatList
          horizontal
          data={WASTE_TAGS}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, { borderColor: colors.border, backgroundColor: colors.card }, tag === item && { borderColor: "#f57c00", backgroundColor: "#f57c0018" }]}
              onPress={() => setTag(item)}
            >
              <Text style={[styles.filterChipText, { color: tag === item ? "#f57c00" : colors.foreground }]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: bottomPad + 80 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Feather name="trash-2" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No waste listings found</Text>
          </View>
        )}
        renderItem={({ item }) => <WasteCard waste={item} onContact={() => {}} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2, marginBottom: 12 },
  impactRow: { flexDirection: "row", borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1 },
  impactItem: { flex: 1, alignItems: "center" },
  impactNum: { fontSize: 18, fontFamily: "Inter_700Bold" },
  impactLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2, textAlign: "center" },
  divider: { width: 1, height: 36, marginVertical: 2 },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  filterRow: { gap: 8, paddingRight: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  filterChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, fontFamily: "Inter_400Regular" },
});
