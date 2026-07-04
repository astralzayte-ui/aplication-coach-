// Composants d'affichage réutilisables : en-tête, badge, puce, segments,
// mini-courbe de poids, barre d'onglets basse.
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import Svg, { Path, Polyline } from "react-native-svg";
import { colors, font, radius, space } from "@/theme/tokens";

export function Header({
  title,
  right,
  subtitle,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + "22", borderColor: color + "55" }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.chipOn : null]}
    >
      <Text style={[styles.chipText, active ? { color: colors.text } : null]}>{label}</Text>
    </Pressable>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.segment}>
      {options.map((o) => (
        <Pressable
          key={o.key}
          onPress={() => onChange(o.key)}
          style={[styles.segItem, value === o.key && styles.segItemOn]}
        >
          <Text style={[styles.segText, value === o.key && { color: colors.text }]}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

// Mini-courbe de poids. La couleur reflète l'analyse : vert / ambre / rouge.
export function Sparkline({
  values,
  color = colors.accent,
  width = 300,
  height = 56,
}: {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (!values || values.length < 2) {
    return (
      <View style={{ height, justifyContent: "center" }}>
        <Text style={styles.noCurve}>—</Text>
      </View>
    );
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);
  const pts = values
    .map((v, i) => `${(i * step).toFixed(1)},${(height - ((v - min) / span) * (height - 8) - 4).toFixed(1)}`)
    .join(" ");
  return (
    <Svg width={width} height={height}>
      <Polyline points={pts} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}

export function IconButton({ label, onPress, style }: { label: string; onPress: () => void; style?: ViewStyle }) {
  return (
    <Pressable onPress={onPress} style={[styles.iconBtn, style]}>
      <Text style={styles.iconBtnText}>{label}</Text>
    </Pressable>
  );
}

export type Tab = { key: string; label: string; icon: string };

export function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: Tab[];
  active: string;
  onChange: (k: string) => void;
}) {
  return (
    <View style={styles.tabbar}>
      {tabs.map((tb) => {
        const on = tb.key === active;
        return (
          <Pressable key={tb.key} style={styles.tab} onPress={() => onChange(tb.key)}>
            <Text style={[styles.tabIcon, { opacity: on ? 1 : 0.5 }]}>{tb.icon}</Text>
            <Text style={[styles.tabLabel, { color: on ? colors.accent : colors.textFaint }]}>{tb.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", marginBottom: space.xl },
  headerTitle: { fontFamily: font.bold, fontSize: 24, color: colors.text },
  headerSub: { color: colors.textFaint, fontFamily: font.regular, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, borderWidth: 1, alignSelf: "flex-start" },
  badgeText: { fontSize: 12, fontFamily: font.medium },
  chip: {
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  chipText: { color: colors.textMuted, fontFamily: font.medium, fontSize: 13 },
  segment: { flexDirection: "row", backgroundColor: colors.surface, borderRadius: radius.md, padding: 4, borderWidth: 1, borderColor: colors.border },
  segItem: { flex: 1, paddingVertical: 10, borderRadius: radius.sm, alignItems: "center" },
  segItemOn: { backgroundColor: colors.accentSoft },
  segText: { color: colors.textMuted, fontFamily: font.medium, fontSize: 14 },
  noCurve: { color: colors.textFaint, fontFamily: font.regular },
  iconBtn: { width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  iconBtnText: { fontSize: 16 },
  tabbar: {
    flexDirection: "row",
    backgroundColor: colors.bgDesk,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: space.sm,
    paddingBottom: space.xs,
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: space.sm },
  tabIcon: { fontSize: 20, marginBottom: 2 },
  tabLabel: { fontSize: 10, fontFamily: font.medium },
});
