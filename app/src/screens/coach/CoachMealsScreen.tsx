// Coach — Bibliothèque de repas : filtre caloriques/légers, ajout, suppression.
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button, Card, Field } from "@/ui/kit";
import { Header, Segmented } from "@/ui/components";
import { AsyncBoundary, RefreshableList } from "@/ui/AsyncBoundary";
import { useAsync } from "@/ui/useAsync";
import { useConfirm, useToast } from "@/ui/feedback";
import { colors, font, space } from "@/theme/tokens";
import { addMeal, deleteMeal, listMeals } from "@/lib/data";

export default function CoachMealsScreen() {
  const { t } = useTranslation();
  const toast = useToast();
  const confirm = useConfirm();
  const state = useAsync(listMeals, []);
  const [filter, setFilter] = useState<"all" | "caloric" | "light">("all");
  const [adding, setAdding] = useState(false);

  const meals = (state.data ?? []).filter((m) => filter === "all" || m.category === filter);

  const remove = (id: string) =>
    confirm({
      message: t("delete_meal_q"), icon: "🗑️", yesLabel: t("delete"), cancelLabel: t("cancel"), variant: "danger",
      onYes: async () => { try { await deleteMeal(id); state.reload(); } catch { toast(t("err_generic")); } },
    });

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
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={styles.name}>{m.name}</Text>
                  <Pressable onPress={() => remove(m.id)}><Text style={styles.trash}>🗑️</Text></Pressable>
                </View>
                <Text style={styles.macros}>
                  {t("kcal_unit", { n: m.kcal ?? 0 })} · {t("prot_unit", { n: m.protein ?? 0 })}
                </Text>
                {m.ingredients ? <Text style={styles.ing}>{m.ingredients}</Text> : null}
              </Card>
            ))
          )}
          <View style={{ height: space.lg }} />
          <Button label={"＋ " + t("add_meal")} onPress={() => setAdding(true)} />
        </RefreshableList>
      </AsyncBoundary>

      <AddMealModal visible={adding} onClose={() => setAdding(false)} onSaved={() => { setAdding(false); state.reload(); }} />
    </View>
  );
}

function AddMealModal({ visible, onClose, onSaved }: { visible: boolean; onClose: () => void; onSaved: () => void }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [category, setCategory] = useState<"caloric" | "light">("caloric");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!name.trim()) { toast(t("field_required")); return; }
    setBusy(true);
    try {
      await addMeal({ name: name.trim(), kcal: parseInt(kcal, 10) || 0, protein: parseInt(protein, 10) || 0, category, ingredients: ingredients.trim() });
      setName(""); setKcal(""); setProtein(""); setIngredients("");
      onSaved();
    } catch { toast(t("err_generic")); }
    finally { setBusy(false); }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("add_meal")}</Text>
          <Pressable onPress={onClose}><Text style={styles.close}>✕</Text></Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: space.xl }} keyboardShouldPersistTaps="handled">
          <Field label={t("meal_name")} value={name} onChangeText={setName} />
          <Field label={t("meal_kcal")} value={kcal} onChangeText={setKcal} keyboardType="number-pad" />
          <Field label={t("meal_protein")} value={protein} onChangeText={setProtein} keyboardType="number-pad" />
          <Text style={styles.lbl}>{t("meal_cat")}</Text>
          <Segmented
            options={[{ key: "caloric", label: t("meals_caloric") }, { key: "light", label: t("meals_light") }]}
            value={category}
            onChange={(v) => setCategory(v as any)}
          />
          <View style={{ height: space.lg }} />
          <Field label={t("meal_ingredients")} value={ingredients} onChangeText={setIngredients} multiline />
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
  macros: { color: colors.accent, fontFamily: font.medium, fontSize: 13, marginTop: 4 },
  ing: { color: colors.textFaint, fontFamily: font.regular, fontSize: 13, marginTop: 4 },
  trash: { fontSize: 16 },
  empty: { color: colors.textFaint, textAlign: "center", paddingVertical: space.xxl, fontFamily: font.regular },
  lbl: { color: colors.textMuted, marginBottom: space.sm, fontFamily: font.medium },
});
