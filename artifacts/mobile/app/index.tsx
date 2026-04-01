import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

const FEATURES = [
  { icon: "🌾", title: "Fair Pricing", desc: "AI-powered crop price predictions" },
  { icon: "🔬", title: "Disease AI", desc: "Detect crop diseases instantly" },
  { icon: "♻️", title: "Waste Market", desc: "Sell agricultural waste profitably" },
  { icon: "⛓️", title: "Blockchain", desc: "Transparent verified transactions" },
  { icon: "🤖", title: "AI Chatbot", desc: "24/7 agriculture guidance" },
  { icon: "🗺️", title: "Marketplace", desc: "Connect farmers and buyers" },
];

export default function LandingScreen() {
  const { user, isLoading } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "farmer") router.replace("/(farmer)");
      else if (user.role === "buyer") router.replace("/(buyer)");
      else if (user.role === "admin") router.replace("/admin");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: "#1b5e20" }]}>
        <Text style={styles.loadingText}>AgriLink AI</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#1b5e20", "#2e7d32", "#43a047"]}
        style={[styles.hero, { paddingTop: topPad + 20 }]}
      >
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
          <Text style={styles.logoText}>AgriLink AI</Text>
        </View>

        <Text style={styles.heroTitle}>{"Smarter Farming,\nFairer Prices"}</Text>
        <Text style={styles.heroSubtitle}>
          AI + Blockchain powered marketplace connecting farmers to buyers transparently
        </Text>

        <View style={styles.impactRow}>
          <View style={styles.impactItem}>
            <Text style={styles.impactNum}>12K+</Text>
            <Text style={styles.impactLabel}>Farmers</Text>
          </View>
          <View style={[styles.impactDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
          <View style={styles.impactItem}>
            <Text style={styles.impactNum}>85T</Text>
            <Text style={styles.impactLabel}>Waste Reused</Text>
          </View>
          <View style={[styles.impactDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
          <View style={styles.impactItem}>
            <Text style={styles.impactNum}>₹4.5Cr</Text>
            <Text style={styles.impactLabel}>Traded</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={[styles.ctaSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.ctaTitle, { color: colors.foreground }]}>Join the Revolution</Text>
        <Text style={[styles.ctaDesc, { color: colors.mutedForeground }]}>
          Get started as a farmer, buyer, or admin
        </Text>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(auth)/signup")}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Get Started Free</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryBtn, { borderColor: colors.primary }]}
          onPress={() => router.push("/(auth)/login")}
          activeOpacity={0.85}
        >
          <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Key Features</Text>
        <View style={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <View
              key={f.title}
              style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={[styles.featureTitle, { color: colors.foreground }]}>{f.title}</Text>
              <Text style={[styles.featureDesc, { color: colors.mutedForeground }]}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.impactSection, { backgroundColor: "#1b5e20" }]}>
        <Text style={styles.impactSectionTitle}>Environmental Impact</Text>
        <Text style={styles.impactSectionDesc}>
          By connecting farmers with waste buyers, AgriLink AI prevents stubble burning and reduces air pollution
        </Text>
        <View style={styles.impactStats}>
          <View style={styles.impactStatItem}>
            <Text style={styles.impactStatNum}>75,000 kg</Text>
            <Text style={styles.impactStatLabel}>CO₂ Prevented</Text>
          </View>
          <View style={styles.impactStatItem}>
            <Text style={styles.impactStatNum}>125 tons</Text>
            <Text style={styles.impactStatLabel}>Waste Reused</Text>
          </View>
        </View>
      </View>

      <View style={styles.howSection}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>How It Works</Text>
        {["Register as Farmer or Buyer", "List crops or browse marketplace", "AI validates pricing & quality", "Blockchain records every transaction", "Get paid fairly, track everything"].map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={[styles.stepNum, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumText}>{i + 1}</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.foreground }]}>{step}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoEmoji: {
    fontSize: 22,
  },
  logoText: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  heroTitle: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
    letterSpacing: -1,
    lineHeight: 42,
    marginBottom: 14,
  },
  heroSubtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 22,
    marginBottom: 28,
  },
  impactRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
  },
  impactItem: {
    flex: 1,
    alignItems: "center",
  },
  impactNum: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  impactLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  impactDivider: {
    width: 1,
    height: 36,
  },
  ctaSection: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  ctaTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  ctaDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  primaryBtn: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  secondaryBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  featuresSection: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  featureCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  impactSection: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  impactSectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    marginBottom: 10,
  },
  impactSectionDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },
  impactStats: {
    flexDirection: "row",
    gap: 30,
  },
  impactStatItem: {
    alignItems: "center",
  },
  impactStatNum: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#a5d6a7",
  },
  impactStatLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    marginTop: 3,
  },
  howSection: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  stepText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
});
