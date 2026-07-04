// Coach — 1re connexion : nom + numéro WhatsApp (visibles par le manageur).
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { Button, ErrorNote, Field } from "@/ui/kit";
import { colors, font, space } from "@/theme/tokens";
import { saveCoachSetup } from "@/lib/api";
import { useAuth } from "@/state/auth";

export default function CoachSetupScreen() {
  const { t } = useTranslation();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    if (!name.trim() || !whatsapp.trim()) {
      setError("field_required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await saveCoachSetup(name.trim(), whatsapp.trim());
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
        <Text style={styles.title}>{t("coach_setup_title")}</Text>
        <Text style={styles.sub}>{t("coach_setup_sub")}</Text>
        <Field label={t("field_name")} value={name} onChangeText={setName} />
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
