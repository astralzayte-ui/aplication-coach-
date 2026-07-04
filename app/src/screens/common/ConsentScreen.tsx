// Écran de consentement RGPD, affiché une fois après la première connexion.
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "@/ui/kit";
import { colors, font, space } from "@/theme/tokens";
import { setConsent } from "@/lib/api";
import { useAuth } from "@/state/auth";
import { useToast } from "@/ui/feedback";

export default function ConsentScreen() {
  const { t } = useTranslation();
  const { refresh } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const accept = async () => {
    setBusy(true);
    try {
      await setConsent();
      await refresh();
    } catch {
      toast(t("err_generic"));
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.icon}>🔒</Text>
        <Text style={styles.title}>{t("consent_title")}</Text>
        <Text style={styles.body}>{t("consent_body")}</Text>
      </ScrollView>
      <View style={styles.footer}>
        <Button label={t("consent_accept")} onPress={accept} loading={busy} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: space.xxl },
  icon: { fontSize: 52, textAlign: "center", marginBottom: space.lg },
  title: { color: colors.text, fontFamily: font.bold, fontSize: 24, textAlign: "center", marginBottom: space.lg },
  body: { color: colors.textMuted, fontFamily: font.regular, fontSize: 15, lineHeight: 24, textAlign: "center" },
  footer: { padding: space.xl },
});
