// Éditeur de programme : jours + exercices modifiables (nom, séries, reps),
// ajout/suppression d'exercices et de jours, effacement complet.
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, font, radius, space } from "@/theme/tokens";

export type Exercise = { name: string; sets: number; reps: string };
export type Program = Exercise[][]; // tableau de jours, chaque jour = liste d'exercices

export function ProgramEditor({
  value,
  onChange,
}: {
  value: Program;
  onChange: (p: Program) => void;
}) {
  const { t } = useTranslation();
  const days = value ?? [];

  const update = (fn: (draft: Program) => Program) => onChange(fn(days.map((d) => d.map((e) => ({ ...e })))));

  const addDay = () => update((d) => [...d, [{ name: "", sets: 4, reps: "8-12" }]]);
  const removeDay = (di: number) => update((d) => d.filter((_, i) => i !== di));
  const addEx = (di: number) => update((d) => { d[di].push({ name: "", sets: 4, reps: "8-12" }); return d; });
  const removeEx = (di: number, ei: number) => update((d) => { d[di] = d[di].filter((_, i) => i !== ei); return d; });
  const setEx = (di: number, ei: number, patch: Partial<Exercise>) =>
    update((d) => { d[di][ei] = { ...d[di][ei], ...patch }; return d; });

  return (
    <View>
      {days.length === 0 ? (
        <Text style={styles.empty}>{t("prog_empty")}</Text>
      ) : (
        days.map((day, di) => (
          <View key={di} style={styles.dayCard}>
            <View style={styles.dayHead}>
              <Text style={styles.dayTitle}>{t("day_label")} {di + 1}</Text>
              <Pressable onPress={() => removeDay(di)} hitSlop={8}>
                <Text style={styles.trash}>🗑️</Text>
              </Pressable>
            </View>

            {day.map((ex, ei) => (
              <View key={ei} style={styles.exRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={ex.name}
                  onChangeText={(v) => setEx(di, ei, { name: v })}
                  placeholder={t("ex_name")}
                  placeholderTextColor={colors.textFaint}
                />
                <TextInput
                  style={[styles.input, styles.small]}
                  value={String(ex.sets ?? "")}
                  onChangeText={(v) => setEx(di, ei, { sets: parseInt(v, 10) || 0 })}
                  keyboardType="number-pad"
                  placeholder={t("ex_sets")}
                  placeholderTextColor={colors.textFaint}
                />
                <TextInput
                  style={[styles.input, styles.small]}
                  value={String(ex.reps ?? "")}
                  onChangeText={(v) => setEx(di, ei, { reps: v })}
                  placeholder={t("ex_reps")}
                  placeholderTextColor={colors.textFaint}
                />
                <Pressable onPress={() => removeEx(di, ei)} hitSlop={8} style={styles.exDel}>
                  <Text style={styles.exDelText}>✕</Text>
                </Pressable>
              </View>
            ))}

            <Pressable onPress={() => addEx(di)} style={styles.addEx}>
              <Text style={styles.addExText}>{t("add_exercise")}</Text>
            </Pressable>
          </View>
        ))
      )}

      <Pressable onPress={addDay} style={styles.addDay}>
        <Text style={styles.addDayText}>{t("add_day")}</Text>
      </Pressable>

      {days.length > 0 ? (
        <Pressable onPress={() => onChange([])} style={styles.clear}>
          <Text style={styles.clearText}>{t("clear_program")}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { color: colors.textFaint, fontFamily: font.regular, textAlign: "center", paddingVertical: space.lg },
  dayCard: {
    backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: space.md, marginBottom: space.md,
  },
  dayHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.sm },
  dayTitle: { color: colors.accent, fontFamily: font.bold, fontSize: 15 },
  trash: { fontSize: 15 },
  exRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  input: {
    backgroundColor: colors.surface2, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border,
    color: colors.text, paddingHorizontal: 10, paddingVertical: 8, fontFamily: font.regular, fontSize: 14,
  },
  small: { width: 58, textAlign: "center" },
  exDel: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  exDelText: { color: colors.danger, fontSize: 16, fontFamily: font.bold },
  addEx: { paddingVertical: 8, alignItems: "center" },
  addExText: { color: colors.accent, fontFamily: font.medium, fontSize: 13 },
  addDay: {
    paddingVertical: 12, alignItems: "center", borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.accent, backgroundColor: colors.accentSoft, marginTop: space.xs,
  },
  addDayText: { color: colors.accent, fontFamily: font.bold, fontSize: 14 },
  clear: { paddingVertical: 12, alignItems: "center", marginTop: space.sm },
  clearText: { color: colors.danger, fontFamily: font.medium, fontSize: 14 },
});
