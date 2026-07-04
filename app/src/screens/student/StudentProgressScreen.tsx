// Élève — Progrès : saisie de poids/mensurations, historique, courbe, photos
// avant/après, chrono de repos, rappels quotidiens + notification de test.
import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { Button, Card, Field } from "@/ui/kit";
import { Header, Sparkline } from "@/ui/components";
import { AsyncBoundary, RefreshableList } from "@/ui/AsyncBoundary";
import { useAsync } from "@/ui/useAsync";
import { useToast } from "@/ui/feedback";
import { colors, font, radius, space } from "@/theme/tokens";
import { Photo, addMyWeight, getMyStudent, getMyWeights, listMyPhotos, uploadProgressPhoto } from "@/lib/data";
import { analyzeWeights } from "@/lib/util";
import { progressColor } from "@/theme/tokens";
import { cancelDailyReminder, scheduleDailyReminder, sendTestNotification } from "@/lib/notifications";

export default function StudentProgressScreen() {
  const { t } = useTranslation();
  const toast = useToast();
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [busy, setBusy] = useState(false);
  const [reminderOn, setReminderOn] = useState(false);

  const state = useAsync(async () => {
    const student = await getMyStudent();
    const weights = await getMyWeights();
    const photos = await listMyPhotos();
    return { student, weights, photos };
  }, []);

  const weights = state.data?.weights ?? [];
  const vals = weights.map((w) => w.weight);
  const objective = state.data?.student?.objective ?? "muscle";
  const analysis = analyzeWeights(vals.length ? vals : [0, 0], objective);

  const addMeasure = async () => {
    const w = parseFloat(weight.replace(",", "."));
    if (!w) { toast(t("measure_invalid")); return; }
    setBusy(true);
    try {
      await addMyWeight(w, parseInt(waist, 10) || undefined);
      setWeight(""); setWaist("");
      toast(t("measure_saved"));
      state.reload();
    } catch { toast(t("err_generic")); }
    finally { setBusy(false); }
  };

  const pickPhoto = async (kind: "before" | "after") => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { toast(t("notif_denied")); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
    if (res.canceled || !res.assets?.[0]) return;
    try {
      await uploadProgressPhoto(res.assets[0].uri, kind);
      toast(t("saved"));
      state.reload();
    } catch { toast(t("err_generic")); }
  };

  const toggleReminder = async () => {
    if (reminderOn) {
      await cancelDailyReminder();
      setReminderOn(false);
      toast(t("reminder_off"));
    } else {
      const ok = await scheduleDailyReminder(t("app_name"), t("daily_reminder"), 18, 0);
      if (ok) { setReminderOn(true); toast(t("reminder_on")); }
      else toast(t("notif_denied"));
    }
  };

  const testNotif = async () => {
    const ok = await sendTestNotification(t("app_name"), t("daily_reminder"));
    toast(ok ? t("notif_sent") : t("notif_denied"));
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.top}><Header title={t("progress_title")} /></View>
      <AsyncBoundary loading={state.loading} error={state.error} onRetry={state.reload} hasData={!!state.data}>
        <RefreshableList loading={state.loading} onRefresh={state.reload}>
          {/* Saisie */}
          <Field label={t("weight_kg")} value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
          <Field label={t("waist_cm")} value={waist} onChangeText={setWaist} keyboardType="number-pad" />
          <Button label={t("add_measure")} onPress={addMeasure} loading={busy} />

          {/* Courbe */}
          {vals.length >= 2 ? (
            <>
              <Text style={styles.section}>{t("weight_curve")}</Text>
              <Card><Sparkline values={vals} color={progressColor(analysis.kind)} width={280} height={64} /></Card>
            </>
          ) : null}

          {/* Historique */}
          <Text style={styles.section}>{t("history")}</Text>
          {weights.length === 0 ? (
            <Text style={styles.empty}>—</Text>
          ) : (
            [...weights].reverse().map((w) => (
              <View key={w.id} style={styles.histRow}>
                <Text style={styles.histDate}>{w.measured_on}</Text>
                <Text style={styles.histVal}>{w.weight} kg{w.waist ? ` · ${w.waist} cm` : ""}</Text>
              </View>
            ))
          )}

          {/* Photos */}
          <Text style={styles.section}>{t("photos")}</Text>
          <View style={{ flexDirection: "row", gap: space.md }}>
            <View style={{ flex: 1 }}><Button label={t("photo_before")} variant="ghost" onPress={() => pickPhoto("before")} /></View>
            <View style={{ flex: 1 }}><Button label={t("photo_after")} variant="ghost" onPress={() => pickPhoto("after")} /></View>
          </View>
          <View style={styles.photoGrid}>
            {(state.data?.photos ?? []).map((p: Photo) => (
              p.url ? <Image key={p.id} source={{ uri: p.url }} style={styles.photo} /> : null
            ))}
          </View>

          {/* Chrono de repos */}
          <Text style={styles.section}>{t("rest_timer")}</Text>
          <RestTimer />

          {/* Rappels */}
          <Text style={styles.section}>{t("reminders")}</Text>
          <Button label={reminderOn ? t("reminder_off") : t("reminder_on")} variant="ghost" onPress={toggleReminder} />
          <View style={{ height: space.md }} />
          <Button label={t("test_notif")} variant="soft" onPress={testNotif} />
        </RefreshableList>
      </AsyncBoundary>
    </View>
  );
}

function RestTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  useEffect(() => { if (seconds === 0 && running) setRunning(false); }, [seconds, running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <Card style={{ alignItems: "center" }}>
      <Text style={styles.timer}>{mm}:{ss}</Text>
      <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md, flexWrap: "wrap", justifyContent: "center" }}>
        {[30, 60, 90, 120].map((s) => (
          <Pressable key={s} style={styles.timerChip} onPress={() => { setSeconds(s); setRunning(true); }}>
            <Text style={styles.timerChipText}>{s}s</Text>
          </Pressable>
        ))}
        <Pressable style={styles.timerChip} onPress={() => { setRunning(false); setSeconds(0); }}>
          <Text style={styles.timerChipText}>■</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: space.xl, paddingTop: space.lg },
  section: { color: colors.textFaint, fontFamily: font.medium, fontSize: 13, marginTop: space.xxl, marginBottom: space.md, textTransform: "uppercase" },
  empty: { color: colors.textFaint, fontFamily: font.regular },
  histRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: space.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  histDate: { color: colors.textFaint, fontFamily: font.regular },
  histVal: { color: colors.text, fontFamily: font.medium },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: space.sm, marginTop: space.md },
  photo: { width: 96, height: 128, borderRadius: radius.md, backgroundColor: colors.surface },
  timer: { color: colors.text, fontFamily: font.bold, fontSize: 44, letterSpacing: 2 },
  timerChip: { paddingHorizontal: space.lg, paddingVertical: space.sm, borderRadius: radius.pill, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  timerChipText: { color: colors.text, fontFamily: font.medium },
});
