// Élève — Accueil : salutation, rappel du jour, série, coches du jour.
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "@/ui/kit";
import { Header, IconButton } from "@/ui/components";
import { AsyncBoundary, RefreshableList } from "@/ui/AsyncBoundary";
import { useAsync } from "@/ui/useAsync";
import { useToast } from "@/ui/feedback";
import { colors, font, radius, space } from "@/theme/tokens";
import { getMyStudent, getTodayChecks, setTodayCheck } from "@/lib/data";
import SettingsSheet from "@/screens/common/SettingsSheet";

export default function StudentHomeScreen() {
  const { t } = useTranslation();
  const toast = useToast();
  const [settings, setSettings] = useState(false);

  const state = useAsync(async () => {
    const student = await getMyStudent();
    const checks = await getTodayChecks();
    return { student, checks };
  }, []);

  const toggle = async (field: "training" | "meal", value: boolean) => {
    try {
      await setTodayCheck(field, value);
      state.reload();
    } catch { toast(t("err_generic")); }
  };

  const student = state.data?.student;
  const checks = state.data?.checks ?? { training: false, meal: false };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.top}>
        <Header
          title={t("home_hello", { name: student?.prenom ?? "" })}
          right={<IconButton label="⚙️" onPress={() => setSettings(true)} />}
        />
      </View>
      <AsyncBoundary loading={state.loading} error={state.error} onRetry={state.reload} hasData={!!state.data}>
        <RefreshableList loading={state.loading} onRefresh={state.reload}>
          {/* Rappel du jour */}
          <Card style={{ borderColor: colors.accent }}>
            <Text style={styles.cardLabel}>{t("daily_reminder")}</Text>
            <Text style={styles.reminder}>{t("today_program")} 💪</Text>
          </Card>

          {/* Série */}
          <Card style={{ marginTop: space.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={styles.cardLabel}>{t("streak")}</Text>
            <Text style={styles.streak}>{t("streak_days", { n: student?.streak ?? 0 })}</Text>
          </Card>

          {/* Coches du jour */}
          <Text style={styles.section}>{t("today_checks")}</Text>
          <CheckRow label={t("check_training")} value={checks.training} onSet={(v) => toggle("training", v)} />
          <CheckRow label={t("check_meal")} value={checks.meal} onSet={(v) => toggle("meal", v)} />
        </RefreshableList>
      </AsyncBoundary>
      <SettingsSheet visible={settings} onClose={() => setSettings(false)} />
    </View>
  );
}

function CheckRow({ label, value, onSet }: { label: string; value: boolean; onSet: (v: boolean) => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.checkRow}>
      <Text style={styles.checkLabel}>{label}</Text>
      <View style={{ flexDirection: "row", gap: space.sm }}>
        <Pressable onPress={() => onSet(true)} style={[styles.yn, value && styles.ynYes]}>
          <Text style={[styles.ynText, value && { color: colors.onAccent }]}>{t("yes")}</Text>
        </Pressable>
        <Pressable onPress={() => onSet(false)} style={[styles.yn, !value && styles.ynNo]}>
          <Text style={[styles.ynText, !value && { color: colors.onAccent }]}>{t("no")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: space.xl, paddingTop: space.lg },
  cardLabel: { color: colors.textFaint, fontFamily: font.medium, fontSize: 12, textTransform: "uppercase" },
  reminder: { color: colors.text, fontFamily: font.medium, fontSize: 16, marginTop: space.sm },
  streak: { color: colors.good, fontFamily: font.bold, fontSize: 18 },
  section: { color: colors.textFaint, fontFamily: font.medium, fontSize: 13, marginTop: space.xxl, marginBottom: space.md, textTransform: "uppercase" },
  checkRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: space.lg, marginBottom: space.sm,
  },
  checkLabel: { color: colors.text, fontFamily: font.regular, fontSize: 15, flex: 1 },
  yn: { paddingHorizontal: space.lg, paddingVertical: space.sm, borderRadius: radius.sm, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  ynYes: { backgroundColor: colors.good, borderColor: colors.good },
  ynNo: { backgroundColor: colors.danger, borderColor: colors.danger },
  ynText: { color: colors.textMuted, fontFamily: font.medium },
});
