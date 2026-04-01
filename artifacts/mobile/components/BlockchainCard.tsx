import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Transaction } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

interface BlockchainCardProps {
  tx: Transaction;
  index: number;
}

export function BlockchainCard({ tx, index }: BlockchainCardProps) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const isConfirmed = tx.status === "confirmed";

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: isConfirmed ? "#1976d240" : colors.border }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.9}
    >
      <View style={styles.blockHeader}>
        <View style={[styles.blockNum, { backgroundColor: isConfirmed ? "#1976d2" : "#ff9800" }]}>
          <Text style={styles.blockNumText}>#{tx.blockNumber}</Text>
        </View>
        <View style={styles.blockMeta}>
          <Text style={[styles.txHash, { color: "#1976d2" }]} numberOfLines={1}>
            {tx.txHash.substring(0, 20)}...
          </Text>
          <Text style={[styles.timestamp, { color: colors.mutedForeground }]}>
            {new Date(tx.timestamp).toLocaleString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: isConfirmed ? "#00c85322" : "#ff980022" }]}>
          <Text style={[styles.statusText, { color: isConfirmed ? "#00c853" : "#ff9800" }]}>
            {isConfirmed ? "Confirmed" : "Pending"}
          </Text>
        </View>
      </View>

      <View style={styles.txInfo}>
        <View style={styles.txParty}>
          <Feather name="user" size={13} color={colors.mutedForeground} />
          <Text style={[styles.partyText, { color: colors.foreground }]}>{tx.sellerName}</Text>
          <Text style={[styles.partyRole, { color: colors.mutedForeground }]}>(Seller)</Text>
        </View>
        <Feather name="arrow-right" size={16} color={colors.primary} />
        <View style={styles.txParty}>
          <Feather name="user" size={13} color={colors.mutedForeground} />
          <Text style={[styles.partyText, { color: colors.foreground }]}>{tx.buyerName}</Text>
          <Text style={[styles.partyRole, { color: colors.mutedForeground }]}>(Buyer)</Text>
        </View>
      </View>

      <View style={styles.itemRow}>
        <View style={[styles.itemTypeBadge, { backgroundColor: tx.itemType === "crop" ? colors.primary + "18" : colors.accent + "18" }]}>
          <Text style={[styles.itemTypeText, { color: tx.itemType === "crop" ? colors.primary : colors.accent }]}>
            {tx.itemType === "crop" ? "Crop" : "Waste"}
          </Text>
        </View>
        <Text style={[styles.itemName, { color: colors.foreground }]}>{tx.itemName}</Text>
        <Text style={[styles.itemQty, { color: colors.mutedForeground }]}>{tx.quantity} {tx.unit}</Text>
        <Text style={[styles.amount, { color: colors.primary }]}>₹{tx.totalAmount.toLocaleString()}</Text>
      </View>

      {expanded && (
        <View style={[styles.expandedSection, { borderTopColor: colors.border }]}>
          <Text style={[styles.expandedTitle, { color: colors.mutedForeground }]}>Block Details</Text>
          <View style={styles.hashRow}>
            <Text style={[styles.hashLabel, { color: colors.mutedForeground }]}>Tx Hash:</Text>
            <Text style={[styles.hashValue, { color: "#1976d2" }]} numberOfLines={1}>{tx.txHash}</Text>
          </View>
          <View style={styles.hashRow}>
            <Text style={[styles.hashLabel, { color: colors.mutedForeground }]}>Prev Hash:</Text>
            <Text style={[styles.hashValue, { color: colors.mutedForeground }]} numberOfLines={1}>{tx.previousHash.substring(0, 24)}...</Text>
          </View>
          <View style={styles.hashRow}>
            <Text style={[styles.hashLabel, { color: colors.mutedForeground }]}>Seller ID:</Text>
            <Text style={[styles.hashValue, { color: colors.foreground }]}>{tx.sellerId}</Text>
          </View>
          <View style={styles.hashRow}>
            <Text style={[styles.hashLabel, { color: colors.mutedForeground }]}>Buyer ID:</Text>
            <Text style={[styles.hashValue, { color: colors.foreground }]}>{tx.buyerId}</Text>
          </View>
        </View>
      )}

      <View style={styles.chainConnector}>
        <View style={[styles.chainDot, { backgroundColor: isConfirmed ? "#1976d2" : "#ff9800" }]} />
        {index !== 0 && <View style={[styles.chainLine, { backgroundColor: "#1976d240" }]} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    shadowColor: "#1976d2",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    position: "relative",
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  blockNum: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  blockNumText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  blockMeta: {
    flex: 1,
  },
  txHash: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  timestamp: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  txInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  txParty: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  partyText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  partyRole: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e0e0e0",
  },
  itemTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  itemTypeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  itemQty: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  amount: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  expandedSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 6,
  },
  expandedTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  hashRow: {
    flexDirection: "row",
    gap: 8,
  },
  hashLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    width: 70,
  },
  hashValue: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  chainConnector: {
    position: "absolute",
    left: -8,
    top: "50%",
    alignItems: "center",
  },
  chainDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  chainLine: {
    width: 2,
    height: 30,
    marginTop: -1,
  },
});
