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
import { useColors } from "@/hooks/useColors";

const CATEGORIES = ["Grains", "Fruits", "Vegetables", "Pulses", "Cash Crops", "Spices", "Oilseeds"];
const GRADES = ["A+", "A", "B", "C"];
const UNITS = ["kg", "quintal", "ton", "piece", "dozen"];

export default function ListCropScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Grains");
  const [grade, setGrade] = useState("A");
  const [unit, setUnit] = useState("kg");
  const [desc, setDesc] = useState("");
  const [imageAdded, setImageAdded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!cropName || !quantity || !price || !location) {
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
        <View style={[styles.successCard, { backgroundColor: colors.card, borderColor: "#00c85340" }]}>
          <View style={[styles.successIcon, { backgroundColor: "#00c85318" }]}>
            <Feather name="check-circle" size={40} color="#00c853" />
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>Crop Listed Successfully!</Text>
          <Text style={[styles.successDesc, { color: colors.mutedForeground }]}>
            Your {cropName} listing is being verified on the blockchain. Buyers will be notified shortly.
          </Text>
          <View style={[styles.txHashBox, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.txHashLabel, { color: colors.mutedForeground }]}>Transaction Hash</Text>
            <Text style={[styles.txHash, { color: colors.primary }]}>0x{Math.random().toString(16).substring(2, 18)}...</Text>
          </View>
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: colors.primary }]}
            onPress={() => setSubmitted(false)}
          >
            <Text style={styles.doneBtnText}>List Another Crop</Text>
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>List Your Crop</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          Add your crop listing to reach thousands of buyers
        </Text>
      </View>

      <View style={styles.section}>
        <InputField label="Crop Name *" placeholder="e.g. Basmati Rice, Wheat" value={cropName} onChangeText={setCropName} colors={colors} />

        <ChipSelector label="Category" options={CATEGORIES} selected={category} onSelect={setCategory} colors={colors} activeColor={colors.primary} />

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <InputField label="Quantity *" placeholder="500" value={quantity} onChangeText={setQuantity} colors={colors} keyboardType="numeric" />
          </View>
          <ChipSelectorSmall label="Unit" options={UNITS} selected={unit} onSelect={setUnit} colors={colors} activeColor={colors.primary} />
        </View>

        <InputField label="Price per Unit (₹) *" placeholder="85" value={price} onChangeText={setPrice} colors={colors} keyboardType="numeric" />
        <InputField label="Location *" placeholder="Village, District, State" value={location} onChangeText={setLocation} colors={colors} />

        <ChipSelector label="Quality Grade" options={GRADES} selected={grade} onSelect={setGrade} colors={colors} activeColor={colors.primary} />

        <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Description</Text>
        <TextInput
          style={[styles.textarea, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
          placeholder="Describe crop quality, storage, harvest date..."
          placeholderTextColor={colors.mutedForeground}
          value={desc}
          onChangeText={setDesc}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.uploadBtn, { borderColor: imageAdded ? colors.primary : colors.border, backgroundColor: colors.card }]}
          onPress={() => setImageAdded(true)}
          activeOpacity={0.8}
        >
          <Feather name={imageAdded ? "check-circle" : "camera"} size={22} color={imageAdded ? colors.primary : colors.mutedForeground} />
          <Text style={[styles.uploadBtnText, { color: imageAdded ? colors.primary : colors.mutedForeground }]}>
            {imageAdded ? "Photo Added" : "Add Crop Photo (Optional)"}
          </Text>
        </TouchableOpacity>

        <View style={[styles.blockchainNote, { backgroundColor: "#1976d210", borderColor: "#1976d230" }]}>
          <Feather name="shield" size={16} color="#1976d2" />
          <Text style={[styles.blockchainNoteText, { color: "#1565c0" }]}>
            Your listing will be verified and recorded on the blockchain for transparency
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: submitting ? colors.muted : colors.primary }]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.85}
        >
          <Feather name="upload" size={18} color="#fff" />
          <Text style={styles.submitBtnText}>{submitting ? "Listing on Blockchain..." : "List Crop"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

function InputField({ label, placeholder, value, onChangeText, colors, keyboardType }: any) {
  return (
    <View style={inputStyles.wrapper}>
      <Text style={[inputStyles.label, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        style={[inputStyles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? "default"}
      />
    </View>
  );
}

function ChipSelector({ label, options, selected, onSelect, colors, activeColor }: any) {
  return (
    <View style={chipStyles.wrapper}>
      <Text style={[chipStyles.label, { color: colors.foreground }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={chipStyles.scroll}>
        {options.map((opt: string) => (
          <TouchableOpacity
            key={opt}
            style={[chipStyles.chip, { borderColor: colors.border, backgroundColor: colors.card }, selected === opt && { borderColor: activeColor, backgroundColor: activeColor + "12" }]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.8}
          >
            <Text style={[chipStyles.chipText, { color: selected === opt ? activeColor : colors.foreground }]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function ChipSelectorSmall({ label, options, selected, onSelect, colors, activeColor }: any) {
  return (
    <View style={[chipStyles.wrapper, { flex: 1 }]}>
      <Text style={[chipStyles.label, { color: colors.foreground }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={chipStyles.scroll}>
        {options.map((opt: string) => (
          <TouchableOpacity
            key={opt}
            style={[chipStyles.chip, { borderColor: colors.border, backgroundColor: colors.card, paddingHorizontal: 10 }, selected === opt && { borderColor: activeColor, backgroundColor: activeColor + "12" }]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.8}
          >
            <Text style={[chipStyles.chipText, { color: selected === opt ? activeColor : colors.foreground, fontSize: 12 }]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: "Inter_400Regular" },
});

const chipStyles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  scroll: { gap: 8, paddingRight: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  successContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  successCard: { borderRadius: 24, padding: 28, borderWidth: 1.5, alignItems: "center", width: "100%" },
  successIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  successTitle: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "center", marginBottom: 10 },
  successDesc: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 21, marginBottom: 20 },
  txHashBox: { borderRadius: 12, padding: 14, width: "100%", marginBottom: 20 },
  txHashLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 4 },
  txHash: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  doneBtn: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14 },
  doneBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 4, lineHeight: 20 },
  section: { paddingHorizontal: 16 },
  row: { flexDirection: "row", gap: 12 },
  rowItem: { flex: 1 },
  fieldLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  textarea: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, fontFamily: "Inter_400Regular", minHeight: 100, marginBottom: 14 },
  uploadBtn: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1.5, borderStyle: "dashed", borderRadius: 14, padding: 16, marginBottom: 14 },
  uploadBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  blockchainNote: { flexDirection: "row", alignItems: "flex-start", gap: 10, borderRadius: 12, padding: 12, marginBottom: 18, borderWidth: 1 },
  blockchainNoteText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 14 },
  submitBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
