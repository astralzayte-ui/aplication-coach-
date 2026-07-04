// Coach — Profil : nom + WhatsApp éditables (répercutés chez le manageur),
// stats, langue, réglages/déconnexion.
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button, Card, Field } from "@/ui/kit";
import { Header, IconButton } from "@/ui/components";
import { AsyncBoundary } from "@/ui/AsyncBoundary";
import { useAsync } from "@/ui/useAsync";
import { useToast } from "@/ui/feedback";
import { colors, font, space } from "@/theme/tokens";
import { getMyCoach, listMyStudents, updateMyCoach } from "@/lib/data";
import { daysLeftLabel } from "@/lib/util";
import { useAuth } from "@/state/auth";
import SettingsSheet from "@/screens/common/SettingsSheet";

export default function CoachProfileScreen() {
  const { t } = useTranslation();
  const toast = useToast();
  const { refresh } = useAuth();
  const [settings, setSettings] = useState(false);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [busy, setBusy] = useState(false);

  const state = useAsync(async () => {
    const coach = await getMyCoach();
    const students = await listMyStudents();
    setName(coach.name ?? "");
    setWhatsapp(coach.whatsapp ?? "");
    return { coach, count: students.length };
  }, []);

  const save = async () => {
    setBusy(true);
    try {
      await updateMyCoach({ name: name.trim(), whatsapp: whatsapp.trim() });
      toast(t("profile_saved"));
      await refresh();
    } catch { toast(t("err_generic")); }
    finally { setBusy(false); }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.top}>
        <Header title={t("profile_title")} right={<IconButton label="⚙️" onPress={() => setSettings(true)} />} />
      </View>
      <AsyncBoundary loading={state.loading} error={state.error} onRetry={state.reload} hasData={!!state.data}>
        <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
          <Field label={t("field_name")} value={name} onChangeText={setName} />
          <Field label={t("field_whatsapp")} value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" />
          <Button label={t("save")} onPress={save} loading={busy} />

          <Text style={styles.section}>{t("profile_stats")}</Text>
          <View style={{ flexDirection: "row", gap: space.md }}>
            <Card style={{ flex: 1, alignItems: "center" }}>
              <Text style={styles.statNum}>{state.data?.count ?? 0}</Text>
              <Text style={styles.statLabel}>{t("stat_students")}</Text>
            </Card>
            <Card style={{ flex: 1, alignItems: "center" }}>
              <Text style={styles.statNum}>{state.data ? daysLeftLabel(state.data.coach.subscription_end, t) : "—"}</Text>
              <Text style={styles.statLabel}>{t("subscription")}</Text>
            </Card>
          </View>

          <View style={{ height: space.xxl }} />
          <Button label={t("settings")} variant="ghost" onPress={() => setSettings(true)} />
        </ScrollView>
      </AsyncBoundary>
      <SettingsSheet visible={settings} onClose={() => setSettings(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: space.xl, paddingTop: space.lg },
  section: { color: colors.textFaint, fontFamily: font.medium, fontSize: 13, marginTop: space.xxl, marginBottom: space.md, textTransform: "uppercase" },
  statNum: { color: colors.text, fontFamily: font.bold, fontSize: 22 },
  statLabel: { color: colors.textFaint, fontFamily: font.regular, fontSize: 12, marginTop: 4 },
});
