// Affiche un spinner pendant le chargement, un message clair + bouton
// « Réessayer » en cas de coupure réseau, sinon le contenu.
import React from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, font, space } from "@/theme/tokens";
import { Button } from "./kit";

export function AsyncBoundary({
  loading,
  error,
  onRetry,
  children,
  hasData,
  emptyLabel,
}: {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  children: React.ReactNode;
  hasData?: boolean;
  emptyLabel?: string;
}) {
  const { t } = useTranslation();

  if (loading && !hasData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={styles.msg}>{t("loading")}</Text>
      </View>
    );
  }

  if (error && !hasData) {
    return (
      <View style={styles.center}>
        <Text style={styles.icon}>{error === "network" ? "📡" : "⚠️"}</Text>
        <Text style={styles.msg}>{t(error === "network" ? "err_network" : "err_generic")}</Text>
        <View style={{ height: space.lg }} />
        <Button label={t("retry")} onPress={onRetry} variant="ghost" />
      </View>
    );
  }

  if (hasData === false && emptyLabel) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>{emptyLabel}</Text>
      </View>
    );
  }

  return <>{children}</>;
}

// Un ScrollView avec « tirer pour rafraîchir » intégré.
export function RefreshableList({
  loading,
  onRefresh,
  children,
  contentStyle,
}: {
  loading: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
  contentStyle?: any;
}) {
  return (
    <ScrollView
      contentContainerStyle={[{ padding: space.xl, paddingBottom: 120 }, contentStyle]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.accent} />
      }
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: space.xxl },
  icon: { fontSize: 44, marginBottom: space.md },
  msg: { color: colors.textMuted, marginTop: space.md, fontFamily: font.regular, textAlign: "center" },
  empty: { color: colors.textFaint, fontFamily: font.regular, textAlign: "center", lineHeight: 22 },
});
