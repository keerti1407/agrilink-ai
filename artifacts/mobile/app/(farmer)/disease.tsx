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
import { DISEASE_PREDICTIONS } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const CROPS = ["Rice", "Wheat", "Tomato", "Cotton", "Maize", "Soybean"];
const SYMPTOMS = [
  "Yellow leaves",
  "Brown spots",
  "White powder",
  "Wilting",
  "Black spots",
  "Holes in leaves",
  "Stunted growth",
  "Root rot",
];

export default function DiseaseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof DISEASE_PREDICTIONS["Rice"][0] | null>(null);

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handlePredict = async () => {
    if (!selectedCrop) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setResult(null);
    await new Promise((res) => setTimeout(res, 2200));
    const predictions = DISEASE_PREDICTIONS[selectedCrop];
    if (predictions?.length) {
      setResult(predictions[0]);
    } else {
      setResult({
        disease: "No Disease Detected",
        confidence: 94,
        causes: ["Crop appears healthy based on symptoms"],
        remedy: ["Continue regular monitoring", "Maintain optimal irrigation"],
        prevention: ["Crop rotation", "Balanced fertilization", "Regular scouting"],
      });
    }
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={[styles.aiIcon, { backgroundColor: "#6a1b9a18" }]}>
          <Feather name="activity" size={28} color="#6a1b9a" />
        </View>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>AI Disease Prediction</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          Upload a crop image or describe symptoms for instant AI diagnosis
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.foreground }]}>Select Crop Type</Text>
        <View style={styles.cropGrid}>
          {CROPS.map((crop) => (
            <TouchableOpacity
              key={crop}
              style={[
                styles.cropChip,
                { borderColor: colors.border, backgroundColor: colors.card },
                selectedCrop === crop && { borderColor: "#6a1b9a", backgroundColor: "#6a1b9a12" },
              ]}
              onPress={() => { setSelectedCrop(crop); setResult(null); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.cropChipText, { color: selectedCrop === crop ? "#6a1b9a" : colors.foreground }]}>
                {crop}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.foreground }]}>Upload Crop Image</Text>
        <TouchableOpacity
          style={[styles.uploadBox, { borderColor: imageUploaded ? "#6a1b9a" : colors.border, backgroundColor: colors.card }]}
          onPress={() => setImageUploaded(true)}
          activeOpacity={0.8}
        >
          {imageUploaded ? (
            <View style={styles.uploadedState}>
              <View style={[styles.checkCircle, { backgroundColor: "#6a1b9a18" }]}>
                <Feather name="check-circle" size={32} color="#6a1b9a" />
              </View>
              <Text style={[styles.uploadedText, { color: "#6a1b9a" }]}>Image Uploaded</Text>
              <Text style={[styles.uploadedSub, { color: colors.mutedForeground }]}>crop_sample.jpg</Text>
            </View>
          ) : (
            <View style={styles.uploadPrompt}>
              <View style={[styles.uploadIcon, { backgroundColor: "#6a1b9a12" }]}>
                <Feather name="camera" size={28} color="#6a1b9a" />
              </View>
              <Text style={[styles.uploadTitle, { color: colors.foreground }]}>Tap to Upload Photo</Text>
              <Text style={[styles.uploadSubtext, { color: colors.mutedForeground }]}>JPG, PNG · Max 10MB</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.foreground }]}>Observed Symptoms</Text>
        <View style={styles.symptomsGrid}>
          {SYMPTOMS.map((sym) => (
            <TouchableOpacity
              key={sym}
              style={[
                styles.symptomChip,
                { borderColor: colors.border, backgroundColor: colors.card },
                selectedSymptoms.includes(sym) && { borderColor: "#6a1b9a", backgroundColor: "#6a1b9a12" },
              ]}
              onPress={() => toggleSymptom(sym)}
              activeOpacity={0.8}
            >
              <Text style={[styles.symptomText, { color: selectedSymptoms.includes(sym) ? "#6a1b9a" : colors.foreground }]}>
                {sym}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[
            styles.predictBtn,
            { backgroundColor: selectedCrop ? "#6a1b9a" : colors.muted },
          ]}
          onPress={handlePredict}
          disabled={!selectedCrop || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.predictBtnText}>Analyzing with AI...</Text>
            </View>
          ) : (
            <Text style={styles.predictBtnText}>
              {selectedCrop ? "Predict Disease" : "Select a Crop First"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.section}>
          <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: "#6a1b9a40" }]}>
            <View style={styles.resultHeader}>
              <View style={[styles.resultIcon, { backgroundColor: "#6a1b9a18" }]}>
                <Feather name="alert-circle" size={24} color="#6a1b9a" />
              </View>
              <View style={styles.resultMeta}>
                <Text style={[styles.diseaseName, { color: colors.foreground }]}>{result.disease}</Text>
                <View style={styles.confidenceRow}>
                  <Text style={[styles.confidenceLabel, { color: colors.mutedForeground }]}>Confidence:</Text>
                  <View style={[styles.confidenceBar, { backgroundColor: colors.muted }]}>
                    <View style={[styles.confidenceFill, { width: `${result.confidence}%` as any, backgroundColor: result.confidence > 80 ? "#e53935" : "#ff9800" }]} />
                  </View>
                  <Text style={[styles.confidenceNum, { color: result.confidence > 80 ? "#e53935" : "#ff9800" }]}>
                    {result.confidence}%
                  </Text>
                </View>
              </View>
            </View>

            <ResultSection title="Causes" icon="help-circle" color="#e53935" items={result.causes} />
            <ResultSection title="Suggested Remedy" icon="shield" color="#1565c0" items={result.remedy} />
            <ResultSection title="Prevention Tips" icon="check-circle" color="#2e7d32" items={result.prevention} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function ResultSection({ title, icon, color, items }: { title: string; icon: string; color: string; items: string[] }) {
  const colors = useColors();
  return (
    <View style={resultStyles.section}>
      <View style={resultStyles.sectionHeader}>
        <Feather name={icon as any} size={15} color={color} />
        <Text style={[resultStyles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      </View>
      {items.map((item, i) => (
        <View key={i} style={resultStyles.item}>
          <View style={[resultStyles.dot, { backgroundColor: color }]} />
          <Text style={[resultStyles.itemText, { color: colors.mutedForeground }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const resultStyles = StyleSheet.create({
  section: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e0e0e0",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  aiIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
  },
  cropGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cropChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  cropChipText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
  },
  uploadPrompt: {
    alignItems: "center",
    gap: 8,
  },
  uploadIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  uploadTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  uploadSubtext: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  uploadedState: {
    alignItems: "center",
    gap: 8,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadedText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  uploadedSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  symptomsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  symptomChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  symptomText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  predictBtn: {
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },
  predictBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  resultCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    shadowColor: "#6a1b9a",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  resultHeader: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  resultMeta: { flex: 1 },
  diseaseName: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
    lineHeight: 22,
  },
  confidenceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  confidenceLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  confidenceFill: {
    height: "100%",
    borderRadius: 3,
  },
  confidenceNum: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
});
