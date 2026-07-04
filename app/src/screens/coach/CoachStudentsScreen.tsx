// Coach — Mes élèves : liste avec badge d'état, mini-courbe, tendance.
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button, Card } from "@/ui/kit";
import { Badge, Header, IconButton, Sparkline } from "@/ui/components";
import { AsyncBoundary, RefreshableList } from "@/ui/AsyncBoundary";
import { useAsync } from "@/ui/useAsync";
import { colors, font, progressColor, space } from "@/theme/tokens";
import { Student, getWeightsForStudents, listMyStudents } from "@/lib/data";
import { analyzeWeights, trendLabel } from "@/lib/util";
import SettingsSheet from "@/screens/common/SettingsSheet";
import CoachStudentDetail from "./CoachStudentDetail";
import NewStudentWizard from "./NewStudentWizard";

export default function CoachStudentsScreen() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [wizard, setWizard] = useState(false);

  const state = useAsync(async () => {
    const students = await listMyStudents();
    const weights = await getWeightsForStudents(students.map((s) => s.id));
    return { students, weights };
  }, []);

  const students = state.data?.students ?? [];
  const weights = state.data?.weights ?? {};

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.top}>
        <Header
          title={t("students_title")}
          right={<IconButton label="⚙️" onPress={() => setSettings(true)} />}
        />
      </View>

      <AsyncBoundary loading={state.loading} error={state.error} onRetry={state.reload} hasData={!!state.data}>
        <RefreshableList loading={state.loading} onRefresh={state.reload}>
          {students.length === 0 ? (
            <Card style={{ marginTop: space.md }}>
              <Text style={styles.emptyTitle}>{t("students_empty")}</Text>
              <Text style={styles.emptyBody}>{t("students_tuto")}</Text>
            </Card>
          ) : (
            students.map((s) => (
              <StudentRow key={s.id} student={s} weights={weights[s.id] ?? []} onPress={() => setDetailId(s.id)} />
            ))
          )}
          <View style={{ height: space.lg }} />
          <Button label={"＋ " + t("new_student")} onPress={() => setWizard(true)} />
        </RefreshableList>
      </AsyncBoundary>

      <SettingsSheet visible={settings} onClose={() => setSettings(false)} />
      {detailId ? (
        <CoachStudentDetail
          studentId={detailId}
          visible={!!detailId}
          onClose={() => setDetailId(null)}
          onChanged={state.reload}
        />
      ) : null}
      <NewStudentWizard visible={wizard} onClose={() => setWizard(false)} onDone={state.reload} />
    </View>
  );
}

function StudentRow({ student, weights, onPress }: { student: Student; weights: number[]; onPress: () => void }) {
  const { t } = useTranslation();
  const { trend, kind } = analyzeWeights(weights.length ? weights : [student.weight ?? 0], student.objective);
  const badge = kind === "good" ? t("badge_ok") : kind === "warn" ? t("badge_watch") : t("badge_alert");
  const color = progressColor(kind);
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{student.prenom || "—"}</Text>
        <Text style={styles.meta}>
          {(student.weight ? student.weight + " kg" : "—") + "  ·  " + trendLabel(trend) + " kg"}
        </Text>
      </View>
      <Sparkline values={weights.length ? weights : [0, 0]} color={color} width={90} height={36} />
      <Badge label={badge} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: space.xl, paddingTop: space.lg },
  row: {
    flexDirection: "row", alignItems: "center", gap: space.md,
    backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border,
    padding: space.lg, marginBottom: space.sm,
  },
  name: { color: colors.text, fontFamily: font.medium, fontSize: 16 },
  meta: { color: colors.textFaint, fontFamily: font.regular, fontSize: 12, marginTop: 2 },
  emptyTitle: { color: colors.text, fontFamily: font.bold, fontSize: 16, marginBottom: space.sm },
  emptyBody: { color: colors.textMuted, fontFamily: font.regular, fontSize: 14, lineHeight: 21 },
});
