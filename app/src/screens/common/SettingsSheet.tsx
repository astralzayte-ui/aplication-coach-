// Réglages communs à tous les rôles : langue, confidentialité, export RGPD,
// suppression de compte (exigence Apple/RGPD), déconnexion.
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, font, radius, space } from "@/theme/tokens";
import { Button } from "@/ui/kit";
import { useConfirm, useToast } from "@/ui/feedback";
import { changeLanguage } from "@/i18n";
import { LANGS, LangCode } from "@/i18n/translations";
import { useAuth } from "@/state/auth";
import { deleteMyAccount, exportMyData } from "@/lib/api";
import PrivacyPolicy from "./PrivacyPolicy";

export default function SettingsSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const confirm = useConfirm();
  const toast = useToast();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [busy, setBusy] = useState(false);

  const onLogout = () =>
    confirm({
      message: t("confirm_logout"), icon: "👋", yesLabel: t("confirm_logout_yes"), cancelLabel: t("cancel"), variant: "soft",
      onYes: () => { onClose(); logout(); },
    });

  const onDelete = () =>
    confirm({
      message: t("delete_account_q") + "\n\n" + t("delete_account_warning"),
      icon: "⚠️", yesLabel: t("delete_account_yes"), cancelLabel: t("cancel"), variant: "danger",
      onYes: async () => {
        setBusy(true);
        try {
          await deleteMyAccount();
          onClose();
          toast(t("account_deleted"));
          logout();
        } catch {
          toast(t("err_generic"));
        } finally {
          setBusy(false);
        }
      },
    });

  const onExport = async () => {
    try {
      await exportMyData();
      toast(t("export_done"));
    } catch {
      toast(t("err_generic"));
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{showPrivacy ? t("privacy_policy") : t("settings")}</Text>
          <Pressable onPress={() => (showPrivacy ? setShowPrivacy(false) : onClose())}>
            <Text style={styles.close}>{showPrivacy ? "‹ " + t("back") : "✕"}</Text>
          </Pressable>
        </View>

        {showPrivacy ? (
          <PrivacyPolicy />
        ) : (
          <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: 60 }}>
            {/* Langue */}
            <Text style={styles.section}>{t("language")}</Text>
            <View style={styles.langRow}>
              {LANGS.map((l) => (
                <Pressable
                  key={l.code}
                  onPress={() => changeLanguage(l.code as LangCode)}
                  style={[styles.langChip, i18n.language === l.code && styles.langChipOn]}
                >
                  <Text style={styles.langText}>{l.flag} {l.label}</Text>
                </Pressable>
              ))}
            </View>

            {/* Confidentialité & données */}
            <Text style={[styles.section, { marginTop: space.xxl }]}>{t("gdpr")}</Text>
            <Row label={t("privacy_policy")} onPress={() => setShowPrivacy(true)} />
            <Row label={t("export_data")} onPress={onExport} />

            {/* Compte */}
            <Text style={[styles.section, { marginTop: space.xxl }]}>{t("account")}</Text>
            <View style={{ height: space.sm }} />
            <Button label={t("logout")} onPress={onLogout} variant="ghost" />
            <View style={{ height: space.md }} />
            <Button label={t("delete_account")} onPress={onDelete} variant="danger" loading={busy} />
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

function Row({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={styles.rowText}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: space.xl, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title: { color: colors.text, fontFamily: font.bold, fontSize: 18 },
  close: { color: colors.accent, fontFamily: font.medium, fontSize: 16 },
  section: { color: colors.textFaint, fontFamily: font.medium, fontSize: 13, marginBottom: space.md, textTransform: "uppercase" },
  langRow: { gap: space.sm },
  langChip: { padding: space.lg, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  langChipOn: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  langText: { color: colors.text, fontFamily: font.medium, fontSize: 15 },
  row: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: space.lg, marginBottom: space.sm,
  },
  rowText: { color: colors.text, fontFamily: font.regular, fontSize: 15 },
  chevron: { color: colors.textFaint, fontSize: 20 },
});
