// Petits composants réutilisables, au style FORMA (fond sombre, accent bleu acier).
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { colors, font, radius, space } from "@/theme/tokens";

export function Button({
  label,
  onPress,
  loading,
  disabled,
  variant = "primary",
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger" | "soft";
}) {
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";
  const bg =
    variant === "ghost"
      ? "transparent"
      : isDanger
        ? colors.danger
        : variant === "soft"
          ? colors.accentSoft
          : colors.accent;
  const fg = variant === "ghost" || variant === "soft" ? colors.text : colors.onAccent;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        variant === "ghost" && { borderWidth: 1, borderColor: colors.border },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[styles.btnLabel, { color: fg }]}>{label}</Text>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  ...props
}: TextInputProps & { label?: string }) {
  return (
    <View style={{ marginBottom: space.lg }}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textFaint}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function ErrorNote({ code }: { code: string | null }) {
  if (!code) return null;
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>{code}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.xl,
  },
  btnLabel: { fontFamily: font.bold, fontSize: 15, fontWeight: "700" },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: space.sm,
    fontFamily: font.medium,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
    fontFamily: font.regular,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.xl,
  },
  errorBox: {
    backgroundColor: "rgba(255,89,56,0.12)",
    borderRadius: radius.md,
    padding: space.md,
    marginBottom: space.lg,
  },
  errorText: { color: colors.danger, fontSize: 14, fontFamily: font.medium },
});
