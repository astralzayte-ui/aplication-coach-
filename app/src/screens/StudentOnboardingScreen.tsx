// Élève — onboarding : prénom, poids, taille, WhatsApp (visibles par le coach).
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { Button, ErrorNote, Field } from "@/ui/kit";
import { colors, font, space } from "@/theme/tokens";
import { saveStudentOnboarding } from "@/lib/api";
import { useAuth } from "@/state/auth";

export default function StudentOnboardingScreen() {
  const { t } = useTranslation();
  const { refresh } = useAuth();
  const [prenom, setPrenom] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    const w = parseFloat(weight.replace(",", "."));
    const h = parseInt(height, 10);
    if (!prenom.trim() || !whatsapp.trim() || !w || !h) {
      setError("field_required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await saveStudentOnboarding({ prenom: prenom.trim(), weight: w, height: h, whatsapp: whatsapp.trim() });
      await refresh();
    } catch {
      setError("err_generic");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{t("ob_title")}</Text>
        <Text style={styles.sub}>{t("ob_sub")}</Text>
        <Field label={t("field_prenom")} value={prenom} onChangeText={setPrenom} />
        <Field label={t("field_weight")} value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
        <Field label={t("field_height")} value={height} onChangeText={setHeight} keyboardType="number-pad" />
        <Field
          label={t("field_whatsapp")}
          value={whatsapp}
          onChangeText={setWhatsapp}
          keyboardType="phone-pad"
          placeholder="+212 6 12 34 56 78"
        />
        <ErrorNote code={error ? t(error) : null} />
        <Button label={t("continue")} onPress={onSave} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: space.xxl },
  title: { fontFamily: font.bold, fontSize: 26, color: colors.text, marginBottom: space.sm },
  sub: { color: colors.textFaint, marginBottom: space.xxl, fontFamily: font.regular },
});
