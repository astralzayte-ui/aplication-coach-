// Élève — Programme : le programme créé par le coach.
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "@/ui/kit";
import { Header } from "@/ui/components";
import { AsyncBoundary, RefreshableList } from "@/ui/AsyncBoundary";
import { useAsync } from "@/ui/useAsync";
import { colors, font, space } from "@/theme/tokens";
import { getMyProgram } from "@/lib/data";

export default function StudentProgramScreen() {
  const { t } = useTranslation();
  const state = useAsync(getMyProgram, []);
  const program: any[] = Array.isArray(state.data) ? state.data : (state.data as any)?.days ?? [];

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.top}><Header title={t("program_title")} /></View>
      <AsyncBoundary loading={state.loading} error={state.error} onRetry={state.reload} hasData={state.data !== null && state.data !== undefined}>
        <RefreshableList loading={state.loading} onRefresh={state.reload}>
          {program.length === 0 ? (
            <Text style={styles.empty}>{t("no_program")}</Text>
          ) : (
            program.map((day: any, i: number) => (
              <Card key={i} style={{ marginBottom: space.sm }}>
                <Text style={styles.day}>{t("day_label")} {i + 1}</Text>
                {(day.exercises ?? day ?? []).map((ex: any, j: number) => (
                  <Text key={j} style={styles.ex}>
                    • {ex.name} — {t("series_reps", { s: ex.sets, r: ex.reps })}
                  </Text>
                ))}
              </Card>
            ))
          )}
        </RefreshableList>
      </AsyncBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: space.xl, paddingTop: space.lg },
  day: { color: colors.accent, fontFamily: font.medium, marginBottom: space.sm },
  ex: { color: colors.textMuted, fontFamily: font.regular, fontSize: 14, lineHeight: 22 },
  empty: { color: colors.textFaint, textAlign: "center", paddingVertical: space.xxl, fontFamily: font.regular, lineHeight: 22 },
});
