// Coach — Modèles de programme : appliquer, modifier (ré-enregistre, ne génère
// PAS de code), supprimer, + nouveau (bouton toujours présent).
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button, Card, Field } from "@/ui/kit";
import { Chip, Header } from "@/ui/components";
import { AsyncBoundary, RefreshableList } from "@/ui/AsyncBoundary";
import { useAsync } from "@/ui/useAsync";
import { useConfirm, useToast } from "@/ui/feedback";
import { colors, font, space } from "@/theme/tokens";
import { Template, deleteTemplate, listTemplates, saveTemplate } from "@/lib/data";
import { DURATIONS } from "@/lib/util";

export default function CoachTemplatesScreen() {
  const { t } = useTranslation();
  const toast = useToast();
  const confirm = useConfirm();
  const state = useAsync(listTemplates, []);
  const [editing, setEditing] = useState<Template | "new" | null>(null);

  const remove = (id: string) =>
    confirm({
      message: t("delete_template_q"), icon: "🗑️", yesLabel: t("delete"), cancelLabel: t("cancel"), variant: "danger",
      onYes: async () => { try { await deleteTemplate(id); state.reload(); } catch { toast(t("err_generic")); } },
    });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.top}><Header title={t("templates_title")} /></View>
      <AsyncBoundary loading={state.loading} error={state.error} onRetry={state.reload} hasData={!!state.data}>
        <RefreshableList loading={state.loading} onRefresh={state.reload}>
          {(state.data ?? []).length === 0 ? (
            <Text style={styles.empty}>{t("templates_empty")}</Text>
          ) : (
            (state.data ?? []).map((tpl) => (
              <Card key={tpl.id} style={{ marginBottom: space.sm }}>
                <Text style={styles.name}>{tpl.name}</Text>
                <Text style={styles.meta}>{tpl.duration ? `${tpl.duration} j` : ""}</Text>
                <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
                  <View style={{ flex: 1 }}><Button label={t("apply")} variant="soft" onPress={() => toast(t("saved"))} /></View>
                  <View style={{ flex: 1 }}><Button label={t("edit")} variant="ghost" onPress={() => setEditing(tpl)} /></View>
                  <Pressable onPress={() => remove(tpl.id)} style={styles.trashBtn}><Text>🗑️</Text></Pressable>
                </View>
              </Card>
            ))
          )}
          <View style={{ height: space.lg }} />
          <Button label={"＋ " + t("new_template")} onPress={() => setEditing("new")} />
        </RefreshableList>
      </AsyncBoundary>

      {editing ? (
        <TemplateEditor
          template={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); state.reload(); }}
        />
      ) : null}
    </View>
  );
}

function TemplateEditor({ template, onClose, onSaved }: { template: Template | null; onClose: () => void; onSaved: () => void }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [name, setName] = useState(template?.name ?? "");
  const [duration, setDuration] = useState(template?.duration ?? 90);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!name.trim()) { toast(t("field_required")); return; }
    setBusy(true);
    try {
      await saveTemplate({ id: template?.id, name: name.trim(), duration, data: template?.data ?? {} });
      toast(t("template_saved"));
      onSaved();
    } catch { toast(t("err_generic")); }
    finally { setBusy(false); }
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{template ? t("edit") : t("new_template")}</Text>
          <Pressable onPress={onClose}><Text style={styles.close}>✕</Text></Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: space.xl }} keyboardShouldPersistTaps="handled">
          <Field label={t("template_name")} value={name} onChangeText={setName} />
          <Text style={styles.lbl}>{t("wiz_duration")}</Text>
          <View style={styles.chipRow}>
            {DURATIONS.map((d) => <Chip key={d} label={`${d} j`} active={duration === d} onPress={() => setDuration(d)} />)}
          </View>
          <View style={{ height: space.xl }} />
          <Button label={t("save")} onPress={save} loading={busy} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: space.xl, paddingTop: space.lg },
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: space.xl, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { color: colors.text, fontFamily: font.bold, fontSize: 20 },
  close: { color: colors.accent, fontSize: 18 },
  name: { color: colors.text, fontFamily: font.medium, fontSize: 16 },
  meta: { color: colors.textFaint, fontFamily: font.regular, fontSize: 12, marginTop: 2 },
  trashBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  empty: { color: colors.textFaint, textAlign: "center", paddingVertical: space.xxl, fontFamily: font.regular },
  lbl: { color: colors.textMuted, marginBottom: space.sm, fontFamily: font.medium },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
});
