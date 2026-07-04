// Manageur — génération de codes + abonnements (coachs / élèves).
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button, Card } from "@/ui/kit";
import { Badge, Chip, Header, IconButton, Segmented } from "@/ui/components";
import { AsyncBoundary } from "@/ui/AsyncBoundary";
import { useAsync } from "@/ui/useAsync";
import { useToast, useConfirm } from "@/ui/feedback";
import { colors, font, radius, space } from "@/theme/tokens";
import { CodeRole, GeneratedCode, deleteCode, generateCode, listMyCodes } from "@/lib/api";
import { Coach, Student, daysLeft, deleteCoachAccount, deleteStudentAccount, listAllStudents, listCoaches } from "@/lib/data";
import { copyText, DURATIONS, openWhatsApp } from "@/lib/util";
import SettingsSheet from "@/screens/common/SettingsSheet";

export default function ManagerScreen() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"codes" | "subs">("codes");
  const [settings, setSettings] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.top}>
        <Header
          title={t("mgr_title")}
          right={
            <View style={{ flexDirection: "row", gap: space.sm }}>
              <IconButton label="⚙️" onPress={() => setSettings(true)} />
            </View>
          }
        />
        <Segmented
          options={[
            { key: "codes", label: t("mgr_tab_codes") },
            { key: "subs", label: t("mgr_tab_subs") },
          ]}
          value={tab}
          onChange={(v) => setTab(v as any)}
        />
      </View>

      {tab === "codes" ? <CodesTab /> : <SubsTab />}

      <SettingsSheet visible={settings} onClose={() => setSettings(false)} />
    </View>
  );
}

// ---------------- Onglet Codes ----------------
function CodesTab() {
  const { t } = useTranslation();
  const toast = useToast();
  const confirm = useConfirm();
  const codes = useAsync(listMyCodes, []);
  const [role, setRole] = useState<CodeRole>("coach");
  const [days, setDays] = useState(90);
  const [last, setLast] = useState<GeneratedCode | null>(null);
  const [busy, setBusy] = useState(false);

  const onGenerate = async () => {
    setBusy(true);
    try {
      const c = await generateCode(role, days);
      setLast(c);
      toast(t("code_generated"));
      codes.reload();
    } catch {
      toast(t("err_generic"));
    } finally {
      setBusy(false);
    }
  };

  const onDelete = (id: string) =>
    confirm({
      message: t("mgr_delete_code_q"),
      icon: "🗑️",
      yesLabel: t("delete"),
      cancelLabel: t("cancel"),
      variant: "danger",
      onYes: async () => {
        try {
          await deleteCode(id);
          codes.reload();
        } catch {
          toast(t("err_generic"));
        }
      },
    });

  return (
    <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
      {/* Type */}
      <Text style={styles.label}>{t("mgr_type")}</Text>
      <Segmented
        options={[
          { key: "coach", label: t("mgr_type_coach") },
          { key: "student", label: t("mgr_type_student") },
        ]}
        value={role}
        onChange={(v) => setRole(v as CodeRole)}
      />

      {/* Durée */}
      <Text style={[styles.label, { marginTop: space.xl }]}>{t("mgr_duration")}</Text>
      <View style={styles.chipRow}>
        {DURATIONS.map((d) => (
          <Chip key={d} label={`${d} j`} active={days === d} onPress={() => setDays(d)} />
        ))}
      </View>

      <View style={{ height: space.xl }} />
      <Button
        label={`${t("mgr_generate")} · ${role === "coach" ? t("mgr_coach_code") : t("mgr_student_code")}`}
        onPress={onGenerate}
        loading={busy}
      />

      {/* Dernier code */}
      {last ? (
        <Card style={{ marginTop: space.xl, borderColor: colors.accent }}>
          <View style={styles.lastHead}>
            <Text style={styles.lastLabel}>{t("mgr_last_code")}</Text>
            <Pressable onPress={() => setLast(null)}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>
          <Text selectable style={styles.codeBig}>
            {last.code}
          </Text>
          <View style={{ flexDirection: "row", gap: space.md, marginTop: space.md }}>
            <Button
              label={t("copy")}
              variant="soft"
              onPress={async () => {
                await copyText(last.code);
                toast(t("copied"));
              }}
            />
            <Button
              label="WhatsApp"
              variant="soft"
              onPress={() => openWhatsApp(t("wa_code_msg", { c: last.code }))}
            />
          </View>
        </Card>
      ) : null}

      {/* Liste des codes */}
      <View style={styles.listHead}>
        <Text style={styles.section}>{t("mgr_codes_list")}</Text>
      </View>
      <AsyncBoundary
        loading={codes.loading}
        error={codes.error}
        onRetry={codes.reload}
        hasData={!!codes.data}
        emptyLabel={t("mgr_no_codes")}
      >
        {(codes.data ?? []).length === 0 ? (
          <Text style={styles.empty}>{t("mgr_no_codes")}</Text>
        ) : (
          (codes.data ?? []).map((c) => (
            <View key={c.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowCode}>{c.code_masked}</Text>
                <Text style={styles.rowMeta}>
                  {(c.role === "coach" ? t("mgr_type_coach") : t("mgr_type_student")) + " · " + t("days_short", { n: c.duration_days })}
                </Text>
              </View>
              <Badge label={c.used ? t("used") : t("unused")} color={c.used ? colors.textFaint : colors.good} />
              <Pressable onPress={() => onDelete(c.id)} style={{ padding: space.sm }}>
                <Text style={styles.close}>🗑️</Text>
              </Pressable>
            </View>
          ))
        )}
      </AsyncBoundary>
    </ScrollView>
  );
}

// ---------------- Onglet Abonnements ----------------
function SubsTab() {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const toast = useToast();
  const [which, setWhich] = useState<"coaches" | "students">("coaches");
  const coaches = useAsync(listCoaches, []);
  const students = useAsync(listAllStudents, []);

  const removeCoach = (c: Coach) =>
    confirm({
      message: t("mgr_delete_coach_q"), icon: "🗑️", yesLabel: t("delete"), cancelLabel: t("cancel"), variant: "danger",
      onYes: async () => {
        try { await deleteCoachAccount(c.id); coaches.reload(); toast(t("deleted")); } catch { toast(t("err_generic")); }
      },
    });

  const removeStudent = (s: Student) =>
    confirm({
      message: t("mgr_delete_student_q"), icon: "🗑️", yesLabel: t("delete"), cancelLabel: t("cancel"), variant: "danger",
      onYes: async () => {
        try { await deleteStudentAccount(s.id); students.reload(); toast(t("deleted")); } catch { toast(t("err_generic")); }
      },
    });

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Segmented
        options={[
          { key: "coaches", label: t("mgr_subs_coaches") },
          { key: "students", label: t("mgr_subs_students") },
        ]}
        value={which}
        onChange={(v) => setWhich(v as any)}
      />
      <View style={{ height: space.lg }} />

      {which === "coaches" ? (
        <AsyncBoundary loading={coaches.loading} error={coaches.error} onRetry={coaches.reload} hasData={!!coaches.data}>
          {(coaches.data ?? []).length === 0 ? (
            <Text style={styles.empty}>{t("mgr_no_coaches")}</Text>
          ) : (
            (coaches.data ?? []).map((c) => <SubRow key={c.id} name={c.name || "—"} sub={c.subscription_end} whatsapp={c.whatsapp} onDelete={() => removeCoach(c)} />)
          )}
        </AsyncBoundary>
      ) : (
        <AsyncBoundary loading={students.loading} error={students.error} onRetry={students.reload} hasData={!!students.data}>
          {(students.data ?? []).length === 0 ? (
            <Text style={styles.empty}>{t("mgr_no_students")}</Text>
          ) : (
            (students.data ?? []).map((s) => <SubRow key={s.id} name={s.prenom || "—"} sub={s.subscription_end} onDelete={() => removeStudent(s)} />)
          )}
        </AsyncBoundary>
      )}
    </ScrollView>
  );
}

function SubRow({ name, sub, whatsapp, onDelete }: { name: string; sub: string; whatsapp?: string | null; onDelete: () => void }) {
  const { t } = useTranslation();
  const left = daysLeft(sub);
  const color = left <= 0 ? colors.danger : left <= 7 ? colors.warn : colors.good;
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowCode}>{name}</Text>
        {whatsapp ? <Text style={styles.rowMeta}>{whatsapp}</Text> : null}
      </View>
      <Badge label={left <= 0 ? t("expired_title") : t("days_left", { n: left })} color={color} />
      <Pressable onPress={onDelete} style={{ padding: space.sm }}>
        <Text style={styles.close}>🗑️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: space.xl, paddingtop: space.lg, paddingTop: space.lg } as any,
  body: { padding: space.xl, paddingBottom: 60 },
  label: { color: colors.textMuted, marginBottom: space.md, fontFamily: font.medium },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  lastHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  lastLabel: { color: colors.textFaint, fontFamily: font.medium, fontSize: 12 },
  close: { color: colors.textMuted, fontSize: 16 },
  codeBig: { color: colors.text, fontFamily: font.bold, fontSize: 22, letterSpacing: 1, marginTop: space.sm },
  listHead: { marginTop: space.xxl, marginBottom: space.md },
  section: { color: colors.text, fontFamily: font.bold, fontSize: 16 },
  empty: { color: colors.textFaint, fontFamily: font.regular, textAlign: "center", paddingVertical: space.xl },
  row: {
    flexDirection: "row", alignItems: "center", gap: space.md,
    backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: space.lg, marginBottom: space.sm,
  },
  rowCode: { color: colors.text, fontFamily: font.medium, fontSize: 15 },
  rowMeta: { color: colors.textFaint, fontFamily: font.regular, fontSize: 12, marginTop: 2 },
});
