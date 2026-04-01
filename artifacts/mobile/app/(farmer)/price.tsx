import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PRICE_PREDICTIONS } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const CROPS = ["Rice", "Wheat", "Tomato", "Cotton", "Maize", "Soybean"];
const REGIONS = ["Punjab", "Haryana", "Maharashtra", "Uttar Pradesh", "Andhra Pradesh", "Karnataka"];
const SEASONS = ["Kharif (Jun-Oct)", "Rabi (Nov-Apr)", "Zaid (Mar-Jun)"];
const GRADES = ["A+", "A", "B", "C"];

export default function PriceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [crop, setCrop] = useState("");
  const [region, setRegion] = useState("");
  const [season, setSeason] = useState("");
  const [grade, setGrade] = useState("A");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof PRICE_PREDICTIONS["Rice"]["Punjab"] | null>(null);

  const handlePredict = async () => {
    if (!crop || !region) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2000));
    const cropPredictions = PRICE_PREDICTIONS[crop];
    if (cropPredictions?.[region]) {
      setResult(cropPredictions[region]);
    } else {
      const basePrices: Record<string, number> = { Rice: 85, Wheat: 38, Tomato: 45, Cotton: 62, Maize: 22, Soybean: 60 };
      const base = basePrices[crop] ?? 50;
      setResult({
        predictedPrice: base,
        minPrice: Math.round(base * 0.85),
        maxPrice: Math.round(base * 1.18),
        trend: "stable",
        bestTime: "October - December",
        bestMarket: `${region} State APMC`,
        demand: "medium",
        profitRange: `₹${(base * 800).toLocaleString()} - ₹${(base * 1200).toLocaleString()} per acre`,
        reasoning: `${crop} prices in ${region} are currently stable. Seasonal demand expected to rise post-harvest. Consider holding stock for 2-3 weeks for better returns.`,
      });
    }
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const trendColor = result?.trend === "rising" ? "#00c853" : result?.trend === "falling" ? "#e53935" : "#ff9800";
  const trendIcon = result?.trend === "rising" ? "trending-up" : result?.trend === "falling" ? "trending-down" : "minus";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={[styles.aiIcon, { backgroundColor: "#1565c018" }]}>
          <Feather name="trending-up" size={28} color="#1565c0" />
        </View>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>AI Price Prediction</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          Get fair market price predictions powered by AI and real-time data
        </Text>
      </View>

      <View style={styles.section}>
        <SelectRow label="Crop Type" options={CROPS} selected={crop} onSelect={setCrop} activeColor="#1565c0" colors={colors} />
        <SelectRow label="Region" options={REGIONS} selected={region} onSelect={setRegion} activeColor="#1565c0" colors={colors} />
        <SelectRow label="Season" options={SEASONS} selected={season} onSelect={setSeason} activeColor="#1565c0" colors={colors} />
        <SelectRow label="Quality Grade" options={GRADES} selected={grade} onSelect={setGrade} activeColor="#1565c0" colors={colors} />
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[
            styles.predictBtn,
            { backgroundColor: crop && region ? "#1565c0" : colors.muted },
          ]}
          onPress={handlePredict}
          disabled={!crop || !region || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.predictBtnText}>Analyzing market data...</Text>
            </View>
          ) : (
            <Text style={styles.predictBtnText}>
              {crop && region ? "Get Price Prediction" : "Select Crop & Region"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.section}>
          <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: "#1565c040" }]}>
            <View style={styles.priceSection}>
              <View>
                <Text style={[styles.predictedLabel, { color: colors.mutedForeground }]}>Predicted Fair Price</Text>
                <Text style={[styles.predictedPrice, { color: "#1565c0" }]}>₹{result.predictedPrice}/kg</Text>
                <Text style={[styles.priceRange, { color: colors.mutedForeground }]}>
                  Range: ₹{result.minPrice} – ₹{result.maxPrice}
                </Text>
              </View>
              <View style={styles.trendBox}>
                <View style={[styles.trendBadge, { backgroundColor: trendColor + "18" }]}>
                  <Feather name={trendIcon as any} size={20} color={trendColor} />
                  <Text style={[styles.trendText, { color: trendColor }]}>
                    {result.trend === "rising" ? "Rising" : result.trend === "falling" ? "Falling" : "Stable"}
                  </Text>
                </View>
                <View style={[styles.demandBadge, { backgroundColor: result.demand === "high" ? "#00c85318" : "#ff980018" }]}>
                  <Text style={[styles.demandText, { color: result.demand === "high" ? "#00c853" : "#ff9800" }]}>
                    {result.demand.toUpperCase()} DEMAND
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <InfoRow icon="calendar" label="Best Time to Sell" value={result.bestTime} iconColor="#1565c0" colors={colors} />
            <InfoRow icon="map-pin" label="Best Market" value={result.bestMarket} iconColor="#1565c0" colors={colors} />
            <InfoRow icon="dollar-sign" label="Profit Range" value={result.profitRange} iconColor="#00c853" colors={colors} />

            <View style={[styles.reasoningCard, { backgroundColor: colors.secondary }]}>
              <View style={styles.reasoningHeader}>
                <Feather name="zap" size={14} color="#1565c0" />
                <Text style={[styles.reasoningTitle, { color: "#1565c0" }]}>AI Reasoning</Text>
              </View>
              <Text style={[styles.reasoningText, { color: colors.foreground }]}>{result.reasoning}</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function SelectRow({ label, options, selected, onSelect, activeColor, colors }: {
  label: string; options: string[]; selected: string; onSelect: (v: string) => void; activeColor: string; colors: any;
}) {
  return (
    <View style={selectStyles.wrapper}>
      <Text style={[selectStyles.label, { color: colors.foreground }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={selectStyles.scroll}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              selectStyles.chip,
              { borderColor: colors.border, backgroundColor: colors.card },
              selected === opt && { borderColor: activeColor, backgroundColor: activeColor + "12" },
            ]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.8}
          >
            <Text style={[selectStyles.chipText, { color: selected === opt ? activeColor : colors.foreground }]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value, iconColor, colors }: { icon: string; label: string; value: string; iconColor: string; colors: any }) {
  return (
    <View style={infoStyles.row}>
      <View style={[infoStyles.iconBg, { backgroundColor: iconColor + "18" }]}>
        <Feather name={icon as any} size={16} color={iconColor} />
      </View>
      <View style={infoStyles.content}>
        <Text style={[infoStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[infoStyles.value, { color: colors.foreground }]}>{value}</Text>
      </View>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  iconBg: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  content: { flex: 1 },
  label: { fontSize: 12, fontFamily: "Inter_400Regular" },
  value: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 1 },
});

const selectStyles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 10 },
  scroll: { gap: 8, paddingRight: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 24, borderWidth: 1.5 },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  aiIcon: {
    width: 64, height: 64, borderRadius: 20,
    justifyContent: "center", alignItems: "center", marginBottom: 12,
  },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "center", letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 6, lineHeight: 20 },
  section: { paddingHorizontal: 16, marginBottom: 6 },
  predictBtn: { paddingVertical: 17, borderRadius: 14, alignItems: "center", marginTop: 6 },
  predictBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  resultCard: {
    borderRadius: 18, padding: 20, borderWidth: 1.5,
    shadowColor: "#1565c0", shadowOpacity: 0.08, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  priceSection: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  predictedLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 4 },
  predictedPrice: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  priceRange: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 3 },
  trendBox: { alignItems: "flex-end", gap: 8 },
  trendBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  trendText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  demandBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  demandText: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  divider: { height: 1, marginBottom: 16 },
  reasoningCard: { borderRadius: 12, padding: 14, marginTop: 4 },
  reasoningHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  reasoningTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  reasoningText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
