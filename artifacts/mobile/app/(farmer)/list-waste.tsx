import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ADMIN_STATS } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const WASTE_TYPES = ["Rice Stubble", "Wheat Husk", "Sugarcane Bagasse", "Corn Stalks", "Cotton Stalks", "Mango Seed", "Coconut Shell", "Vegetable Waste", "Other Biomass"];
const USE_CASES = ["Biofuel", "Compost", "Animal Fodder", "Packaging", "Paper Production", "Building Material", "Cosmetics", "Medicine", "Food Processing", "Cattle Feed"];
const UNITS = ["kg", "ton", "quintal", "truckload"];

export default function ListWasteScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [wasteType, setWasteType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [unit, setUnit] = useState("kg");
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleUseCase = (tag: string) => {
    setSelectedUseCases((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!wasteType || !quantity || !price || !location) {
      Alert.alert("Missing Fields", "Please fill all required fields");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (submitted) {
    return (
      <View style={[styles.successContainer, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={[styles.successCard, { backgroundColor: colors.card, borderColor: "#f57c0040" }]}>
          <View style={[styles.successIcon, { backgroundColor: "#f57c0018" }]}>
            <Feather name="check-circle" size={40} color="#f57c00" />
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>Waste Listed!</Text>
          <Text style={[styles.successDesc, { color: colors.mutedForeground }]}>
            Your {wasteType} waste listing helps prevent burning and reduces air pollution.
          </Text>
          <View style={[styles.impactBox, { backgroundColor: "#f57c0010", borderColor: "#f57c0030" }]}>
            <Text style={[styles.impactTitle, { color: "#e65100" }]}>Environmental Impact</Text>
            <Text style={[styles.impactStat, { color: "#f57c00" }]}>~{(parseInt(quantity || "1") * 0.85).toFixed(0)} kg CO₂ prevented</Text>
          </View>
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: "#f57c00" }]}
            onPress={() => setSubmitted(false)}
          >
            <Text style={styles.doneBtnText}>List Another Waste</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      bottomOffset={20}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>List Agricultural Waste</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          Turn your crop waste into income instead of burning it
        </Text>
      </View>

      <View style={[styles.impactBanner, { backgroundColor: "#f57c0010", borderColor: "#f57c0030" }]}>
        <Feather name="wind" size={18} color="#f57c00" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.impactBannerTitle, { color: "#e65100" }]}>Prevent Air Pollution</Text>
          <Text style={[styles.impactBannerDesc, { color: "#f57c00" }]}>
            {ADMIN_STATS.wasteReused.toLocaleString()} kg waste reused so far · {ADMIN_STATS.co2Saved} tons CO₂ saved
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Waste Type *</Text>
        <View style={styles.wasteGrid}>
          {WASTE_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.wasteChip,
                { borderColor: colors.border, backgroundColor: colors.card },
                wasteType === type && { borderColor: "#f57c00", backgroundColor: "#f57c0012" },
              ]}
              onPress={() => setWasteType(type)}
              activeOpacity={0.8}
            >
              <Text style={[styles.wasteChipText, { color: wasteType === type ? "#f57c00" : colors.foreground }]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.rowFlex}>
            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Quantity *</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
              placeholder="e.g. 5000"
              placeholderTextColor={colors.mutedForeground}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 0.8 }}>
            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Unit</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {UNITS.map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[styles.unitChip, { borderColor: colors.border, backgroundColor: colors.card }, unit === u && { borderColor: "#f57c00", backgroundColor: "#f57c0012" }]}
                  onPress={() => setUnit(u)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.unitText, { color: unit === u ? "#f57c00" : colors.foreground }]}>{u}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Price per Unit (₹) *</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground, marginBottom: 14 }]}
          placeholder="0.50"
          placeholderTextColor={colors.mutedForeground}
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Location *</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground, marginBottom: 14 }]}
          placeholder="Village, District, State"
          placeholderTextColor={colors.mutedForeground}
          value={location}
          onChangeText={setLocation}
        />

        <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Possible Use Cases</Text>
        <View style={styles.useCaseGrid}>
          {USE_CASES.map((uc) => (
            <TouchableOpacity
              key={uc}
              style={[
                styles.useCaseChip,
                { borderColor: colors.border, backgroundColor: colors.card },
                selectedUseCases.includes(uc) && { borderColor: "#2e7d32", backgroundColor: "#2e7d3212" },
              ]}
              onPress={() => toggleUseCase(uc)}
              activeOpacity={0.8}
            >
              <Text style={[styles.useCaseText, { color: selectedUseCases.includes(uc) ? "#2e7d32" : colors.foreground }]}>
                {uc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Description</Text>
        <TextInput
          style={[styles.textarea, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
          placeholder="Describe condition, moisture, collection method..."
          placeholderTextColor={colors.mutedForeground}
          value={desc}
          onChangeText={setDesc}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: submitting ? colors.muted : "#f57c00" }]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.85}
        >
          <Feather name="upload" size={18} color="#fff" />
          <Text style={styles.submitBtnText}>{submitting ? "Listing..." : "List Waste"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  successContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  successCard: { borderRadius: 24, padding: 28, borderWidth: 1.5, alignItems: "center", width: "100%" },
  successIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  successTitle: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "center", marginBottom: 10 },
  successDesc: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 21, marginBottom: 20 },
  impactBox: { borderRadius: 12, padding: 14, width: "100%", marginBottom: 20, borderWidth: 1, alignItems: "center" },
  impactTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  impactStat: { fontSize: 18, fontFamily: "Inter_700Bold" },
  doneBtn: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14 },
  doneBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 4, lineHeight: 20 },
  impactBanner: { flexDirection: "row", alignItems: "center", gap: 12, margin: 16, padding: 14, borderRadius: 14, borderWidth: 1 },
  impactBannerTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  impactBannerDesc: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  section: { paddingHorizontal: 16 },
  fieldLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  wasteGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  wasteChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  wasteChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  row: { flexDirection: "row", gap: 12, marginBottom: 4 },
  rowFlex: { flex: 1 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: "Inter_400Regular" },
  unitChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  unitText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  useCaseGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  useCaseChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5 },
  useCaseText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  textarea: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, fontFamily: "Inter_400Regular", minHeight: 100, marginBottom: 18 },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 14, marginBottom: 20 },
  submitBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
