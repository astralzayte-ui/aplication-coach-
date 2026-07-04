// Écran affiché quand l'abonnement (coach ou élève) est expiré : message clair,
// pas d'écran vide ni de plantage. L'utilisateur peut se déconnecter.
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "@/ui/kit";
import { colors, font, space } from "@/theme/tokens";
import { useAuth } from "@/state/auth";

export default function ExpiredScreen() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⏳</Text>
      <Text style={styles.title}>{t("expired_title")}</Text>
      <Text style={styles.body}>{t("expired_body")}</Text>
      <View style={{ height: space.xxl }} />
      <Button label={t("logout")} onPress={logout} variant="ghost" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: space.xxl },
  icon: { fontSize: 56, marginBottom: space.lg },
  title: { fontFamily: font.bold, fontSize: 24, color: colors.text, marginBottom: space.md },
  body: {
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    fontFamily: font.regular,
    maxWidth: 320,
  },
});
