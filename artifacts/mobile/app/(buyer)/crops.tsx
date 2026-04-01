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
import { CropCard } from "@/components/CropCard";
import { MOCK_CROPS } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const CATEGORIES = ["All", "Grains", "Fruits", "Vegetables", "Pulses", "Cash Crops"];
const SORT_OPTIONS = ["Latest", "Price: Low-High", "Price: High-Low", "Verified Only"];

export default function CropsMarketScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Latest");

  const filtered = useMemo(() => {
    let crops = [...MOCK_CROPS];
    if (search) {
      const q = search.toLowerCase();
      crops = crops.filter((c) => c.cropName.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || c.farmerName.toLowerCase().includes(q));
    }
    if (category !== "All") {
      crops = crops.filter((c) => c.category === category);
    }
    if (sort === "Price: Low-High") crops.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    else if (sort === "Price: High-Low") crops.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    else if (sort === "Verified Only") crops = crops.filter((c) => c.blockchainVerified);
    return crops;
  }, [search, category, sort]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Crop Marketplace</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>{MOCK_CROPS.length} listings available</Text>

        <View style={[styles.searchBar, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search crops, farmers, location..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ) : null}
        </View>

        <FlatList
          horizontal
          data={CATEGORIES}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, { borderColor: colors.border, backgroundColor: colors.card }, category === item && { borderColor: "#1565c0", backgroundColor: "#1565c018" }]}
              onPress={() => setCategory(item)}
            >
              <Text style={[styles.filterChipText, { color: category === item ? "#1565c0" : colors.foreground }]}>{item}</Text>
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
            <Feather name="package" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No crops found</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <CropCard
            crop={item}
            onContact={() => {}}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2, marginBottom: 14 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  filterRow: { gap: 8, paddingRight: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  filterChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, fontFamily: "Inter_400Regular" },
});
