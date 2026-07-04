// Coach — Fiche élève : infos, courbe de poids colorée, analyse, bilan,
// abonnement (+30 j), relance WhatsApp, notes privées, suppression.
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button, Card } from "@/ui/kit";
import { Badge, Sparkline } from "@/ui/components";
import { AsyncBoundary } from "@/ui/AsyncBoundary";
import { useAsync } from "@/ui/useAsync";
import { useConfirm, useToast } from "@/ui/feedback";
import { colors, font, progressColor, radius, space } from "@/theme/tokens";
import { extendSubscription } from "@/lib/api";
import { deleteStudentAccount, getNote, getStudent, getStudentWeights, saveNote, updateStudent } from "@/lib/data";
import { Chip } from "@/ui/components";
import { analyzeWeights, daysLeftLabel, openWhatsApp, trendLabel } from "@/lib/util";

const OBJECTIVES = ["muscle", "masse", "perte", "poids"] as const;

export default function CoachStudentDetail({
  studentId, visible, onClose, onChanged,
}: {
  studentId: string; visible: boolean; onClose: () => void; onChanged: () => void;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const confirm = useConfirm();
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const state = useAsync(async () => {
    const student = await getStudent(studentId);
    const weights = await getStudentWeights(studentId);
    const noteBody = await getNote(studentId);
    setNote(noteBody);
    return { student, weights };
  }, [studentId]);

  const student = state.data?.student;
  const weightVals = (state.data?.weights ?? []).map((w) => w.weight);
  const analysis = student ? analyzeWeights(weightVals.length ? weightVals : [student.weight ?? 0], student.objective) : null;

  const onExtend = async () => {
    try {
      await extendSubscription(studentId, 30);
      toast(t("extended"));
      state.reload();
      onChanged();
    } catch { toast(t("err_generic")); }
  };

  const onSaveNote = async () => {
    setSavingNote(true);
    try { await saveNote(studentId, note); toast(t("saved")); } catch { toast(t("err_generic")); }
    finally { setSavingNote(false); }
  };

  const onDelete = () =>
    confirm({
      message: t("mgr_delete_student_q"), icon: "🗑️", yesLabel: t("delete"), cancelLabel: t("cancel"), variant: "danger",
      onYes: async () => {
        try { await deleteStudentAccount(studentId); toast(t("deleted")); onClose(); onChanged(); }
        catch { toast(t("err_generic")); }
      },
    });

  const iaText = analysis
    ? analysis.kind === "good" ? t("ia_good", { t: trendLabel(analysis.trend) })
      : analysis.kind === "danger" ? t("ia_alert") : t("ia_watch")
    : "";

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{student?.prenom || t("student_detail")}</Text>
          <Pressable onPress={onClose}><Text style={styles.close}>✕</Text></Pressable>
        </View>

        <AsyncBoundary loading={state.loading} error={state.error} onRetry={state.reload} hasData={!!state.data}>
          {student ? (
            <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
              {/* Infos */}
              <Card>
                <InfoRow label={t("height_label")} value={student.height ? student.height + " cm" : "—"} />
                <InfoRow label={t("whatsapp_label")} value={student.whatsapp || "—"} />
                <InfoRow label={t("subscription")} value={daysLeftLabel(student.subscription_end, t)} />
              </Card>

              {/* Objectif (modifiable par le coach) */}
              <Text style={styles.section}>{t("objective_label")}</Text>
              <View style={styles.chipRow}>
                {OBJECTIVES.map((o) => (
                  <Chip
                    key={o}
                    label={t("obj_" + o)}
                    active={student.objective === o}
                    onPress={async () => {
                      try { await updateStudent(studentId, { objective: o }); state.reload(); onChanged(); }
                      catch { toast(t("err_generic")); }
                    }}
                  />
                ))}
              </View>

              {/* Courbe de poids */}
              <Text style={styles.section}>{t("weight_curve")}</Text>
              <Card>
                <Sparkline values={weightVals.length ? weightVals : [0, 0]} color={progressColor(analysis?.kind ?? "warn")} width={280} height={64} />
              </Card>

              {/* Analyse */}
              <Text style={styles.section}>{t("ia_analysis")}</Text>
              <Card style={{ borderColor: progressColor(analysis?.kind ?? "warn") + "55" }}>
                <Text style={styles.ia}>{iaText}</Text>
              </Card>

              {/* Abonnement */}
              <Text style={styles.section}>{t("subscription")}</Text>
              <View style={{ flexDirection: "row", gap: space.md }}>
                <View style={{ flex: 1 }}><Button label={t("extend_30")} variant="soft" onPress={onExtend} /></View>
                <View style={{ flex: 1 }}>
                  <Button label={"WhatsApp"} variant="soft" onPress={() => openWhatsApp(t("wa_code_msg", { c: "" }), student.whatsapp || undefined)} />
                </View>
              </View>

              {/* Notes privées */}
              <Text style={styles.section}>{t("private_notes")}</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder={t("notes_ph")}
                placeholderTextColor={colors.textFaint}
                multiline
                style={styles.notes}
              />
              <Button label={t("save")} variant="ghost" onPress={onSaveNote} loading={savingNote} />

              <View style={{ height: space.xxl }} />
              <Button label={t("delete_student")} variant="danger" onPress={onDelete} />
            </ScrollView>
          ) : null}
        </AsyncBoundary>
      </View>
    </Modal>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: space.xl, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { color: colors.text, fontFamily: font.bold, fontSize: 20 },
  close: { color: colors.accent, fontSize: 18 },
  section: { color: colors.textFaint, fontFamily: font.medium, fontSize: 13, marginTop: space.xl, marginBottom: space.sm, textTransform: "uppercase" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: space.sm },
  infoLabel: { color: colors.textMuted, fontFamily: font.regular },
  infoValue: { color: colors.text, fontFamily: font.medium },
  ia: { color: colors.text, fontFamily: font.regular, fontSize: 14, lineHeight: 21 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  notes: {
    backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    color: colors.text, padding: space.lg, minHeight: 90, textAlignVertical: "top", marginBottom: space.md, fontFamily: font.regular,
  },
});
