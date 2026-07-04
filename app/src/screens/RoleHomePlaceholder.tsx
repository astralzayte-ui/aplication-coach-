// Accueil temporaire par rôle (Manager / Coach / Élève). Les écrans complets
// (génération de codes, mes élèves, programme…) sont construits à l'étape suivante.
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "@/ui/kit";
import { colors, font, space } from "@/theme/tokens";
import { useAuth } from "@/state/auth";

export default function RoleHomePlaceholder({ role }: { role: "manager" | "coach" | "student" }) {
  const { t } = useTranslation();
  const { logout, me } = useAuth();
  const label = role === "manager" ? t("role_manager") : role === "coach" ? t("role_coach") : t("role_student");
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>{t("app_name")}</Text>
      <Text style={styles.role}>{label}</Text>
      {me?.name || me?.prenom ? (
        <Text style={styles.hello}>{me.name ?? me.prenom}</Text>
      ) : null}
      <Text style={styles.note}>✅ Connexion réussie — écran en construction</Text>
      <View style={{ height: space.xxl }} />
      <Button label={t("logout")} onPress={logout} variant="ghost" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: space.xxl },
  logo: { fontFamily: font.bold, fontSize: 34, color: colors.text, letterSpacing: 2 },
  role: { color: colors.accent, fontFamily: font.medium, marginTop: space.sm, fontSize: 16 },
  hello: { color: colors.text, fontFamily: font.medium, marginTop: space.lg, fontSize: 20 },
  note: { color: colors.textFaint, marginTop: space.xl, fontFamily: font.regular },
});
