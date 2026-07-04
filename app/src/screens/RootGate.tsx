// Aiguilleur principal : décide quel écran montrer selon l'état de connexion.
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, font, space } from "@/theme/tokens";
import { IS_CONFIGURED } from "@/lib/config";
import { useAuth } from "@/state/auth";
import LoginScreen from "./LoginScreen";
import CoachSetupScreen from "./CoachSetupScreen";
import StudentOnboardingScreen from "./StudentOnboardingScreen";
import ExpiredScreen from "./ExpiredScreen";
import ConsentScreen from "./common/ConsentScreen";
import ManagerScreen from "./manager/ManagerScreen";
import CoachApp from "./coach/CoachApp";
import StudentApp from "./student/StudentApp";

export default function RootGate() {
  const { t } = useTranslation();
  const { phase, me } = useAuth();

  // Garde-fou : si l'app n'est pas encore reliée au serveur, on prévient
  // clairement au lieu d'un écran vide.
  if (!IS_CONFIGURED) {
    return (
      <View style={styles.center}>
        <Text style={styles.warn}>⚙️</Text>
        <Text style={styles.warnText}>
          Serveur non configuré. Ajoute l'URL et la clé Supabase (voir CONFIGURATION.md).
        </Text>
      </View>
    );
  }

  if (phase === "booting") {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={styles.loading}>{t("loading")}</Text>
      </View>
    );
  }

  if (phase === "signedOut" || !me) {
    return <LoginScreen />;
  }

  // Connecté : gérer abonnement expiré, consentement, onboarding, puis le rôle.
  if (!me.active) return <ExpiredScreen />;
  if (me.role === "coach" && !me.setupDone) return <CoachSetupScreen />;
  if (me.role === "student" && !me.onboardingDone) return <StudentOnboardingScreen />;
  if (!me.consentGiven) return <ConsentScreen />;

  if (me.role === "manager") return <ManagerScreen />;
  if (me.role === "coach") return <CoachApp />;
  return <StudentApp />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: space.xxl },
  loading: { color: colors.textFaint, marginTop: space.lg, fontFamily: font.regular },
  warn: { fontSize: 44, marginBottom: space.lg },
  warnText: { color: colors.textMuted, textAlign: "center", lineHeight: 22, fontFamily: font.regular },
});
