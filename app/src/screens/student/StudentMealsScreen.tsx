// Élève — Repas : la bibliothèque de repas de son coach, filtrable.
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "@/ui/kit";
import { Header, Segmented } from "@/ui/components";
import { AsyncBoundary, RefreshableList } from "@/ui/AsyncBoundary";
import { useAsync } from "@/ui/useAsync";
import { colors, font, space } from "@/theme/tokens";
import { listMyMeals } from "@/lib/data";

export default function StudentMealsScreen() {
  const { t } = useTranslation();
  const state = useAsync(listMyMeals, []);
  const [filter, setFilter] = useState<"all" | "caloric" | "light">("all");
  const meals = (state.data ?? []).filter((m) => filter === "all" || m.category === filter);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.top}>
        <Header title={t("meals_title")} />
        <Segmented
          options={[
            { key: "all", label: t("meals_all") },
            { key: "caloric", label: t("meals_caloric") },
            { key: "light", label: t("meals_light") },
          ]}
          value={filter}
          onChange={(v) => setFilter(v as any)}
        />
      </View>
      <AsyncBoundary loading={state.loading} error={state.error} onRetry={state.reload} hasData={!!state.data}>
        <RefreshableList loading={state.loading} onRefresh={state.reload}>
          {meals.length === 0 ? (
            <Text style={styles.empty}>{t("meals_empty")}</Text>
          ) : (
            meals.map((m) => (
              <Card key={m.id} style={{ marginBottom: space.sm }}>
                <Text style={styles.name}>{m.name}</Text>
                <Text style={styles.macros}>{t("kcal_unit", { n: m.kcal ?? 0 })} · {t("prot_unit", { n: m.protein ?? 0 })}</Text>
                {m.ingredients ? <Text style={styles.ing}>{m.ingredients}</Text> : null}
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
  name: { color: colors.text, fontFamily: font.medium, fontSize: 16 },
  macros: { color: colors.accent, fontFamily: font.medium, fontSize: 13, marginTop: 4 },
  ing: { color: colors.textFaint, fontFamily: font.regular, fontSize: 13, marginTop: 4 },
  empty: { color: colors.textFaint, textAlign: "center", paddingVertical: space.xxl, fontFamily: font.regular },
});
