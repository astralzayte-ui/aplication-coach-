// Écran de connexion : choix du profil, code, « se souvenir de moi », langue.
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Button, ErrorNote, Field } from "@/ui/kit";
import { colors, font, radius, space } from "@/theme/tokens";
import { useAuth } from "@/state/auth";
import { ApiError, Role } from "@/lib/api";
import { openSubscription } from "@/lib/util";
import { changeLanguage } from "@/i18n";
import { LANGS, LangCode } from "@/i18n/translations";

const ROLES: { key: Role; icon: string }[] = [
  { key: "coach", icon: "🏋️" },
  { key: "student", icon: "💪" },
  { key: "manager", icon: "🛡️" },
];

function messageForError(code: string): string {
  switch (code) {
    case "invalid_code":
    case "wrong_role_for_code":
      return "err_invalid_code";
    case "code_expired":
      return "err_code_expired";
    case "revoked":
      return "err_revoked";
    case "too_many_attempts":
      return "err_too_many_attempts";
    case "network":
      return "err_network";
    default:
      return "err_generic";
  }
}

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const { login, remember, setRemember } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [loading, setLoading] = useState(false);

  const subscribe = () => openSubscription(t("wa_subscribe_msg"));

  const onSubmit = async () => {
    setError(null);
    setShowSubscribe(false);
    if (!role) {
      setError("login_pick");
      return;
    }
    if (!code.trim()) {
      setError("err_invalid_code");
      return;
    }
    setLoading(true);
    try {
      await login(code.trim(), role);
    } catch (e) {
      const c = e instanceof ApiError ? e.code : "server_error";
      const badCode = c === "invalid_code" || c === "wrong_role_for_code" || c === "code_expired" || c === "revoked";
      if (role === "manager") {
        // Le manager n'a pas d'abonnement à prendre : message simple.
        setError(c === "network" || c === "too_many_attempts" ? messageForError(c) : "login_bad_mgr");
      } else if (badCode) {
        // Coach/élève avec un code qui ne marche pas → proposer un abonnement.
        setError("code_bad_subscribe");
        setShowSubscribe(true);
      } else {
        setError(messageForError(c));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Sélecteur de langue */}
        <View style={styles.langRow}>
          {LANGS.map((l) => (
            <Pressable
              key={l.code}
              onPress={() => changeLanguage(l.code as LangCode)}
              style={[
                styles.langChip,
                i18n.language === l.code && styles.langChipActive,
              ]}
            >
              <Text style={styles.langText}>{l.flag}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.logo}>{t("app_name")}</Text>
        <Text style={styles.tagline}>{t("tagline")}</Text>

        <Text style={styles.section}>{t("login_pick")}</Text>
        <View style={styles.roleRow}>
          {ROLES.map((r) => (
            <Pressable
              key={r.key}
              onPress={() => {
                setRole(r.key);
                setError(null);
              }}
              style={[styles.roleCard, role === r.key && styles.roleCardActive]}
            >
              <Text style={styles.roleIcon}>{r.icon}</Text>
              <Text
                style={[styles.roleLabel, role === r.key && { color: colors.text }]}
              >
                {t(r.key === "coach" ? "role_coach" : r.key === "student" ? "role_student" : "role_manager")}
              </Text>
            </Pressable>
          ))}
        </View>

        <Field
          label={t("login_code")}
          placeholder={role === "manager" ? "•••••••" : t("login_code_ph")}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          autoCorrect={false}
          secureTextEntry={role === "manager"}
        />

        <Pressable
          style={styles.remember}
          onPress={() => setRemember(!remember)}
        >
          <View style={[styles.checkbox, remember && styles.checkboxOn]}>
            {remember ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.rememberText}>{t("remember_me")}</Text>
        </Pressable>

        {error ? <ErrorNote code={t(error)} /> : null}

        {/* Bouton d'abonnement affiché quand le code ne marche pas */}
        {showSubscribe ? (
          <View style={{ marginBottom: space.lg }}>
            <Button label={t("subscribe")} onPress={subscribe} />
          </View>
        ) : null}

        <Button label={t("login_btn")} onPress={onSubmit} loading={loading} />

        {/* Bouton d'abonnement toujours visible */}
        <View style={styles.subscribeAlways}>
          <Pressable onPress={subscribe} style={styles.subscribeBtn}>
            <Text style={styles.subscribeText}>💬  {t("subscribe")}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: space.xxl,
    paddingVertical: 40,
  },
  langRow: { flexDirection: "row", justifyContent: "center", gap: space.sm, marginBottom: space.xxl },
  langChip: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langChipActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  langText: { fontSize: 18 },
  logo: {
    fontFamily: font.bold,
    fontSize: 42,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    letterSpacing: 2,
  },
  tagline: {
    color: colors.textFaint,
    textAlign: "center",
    marginBottom: 36,
    fontFamily: font.regular,
  },
  section: { color: colors.textMuted, marginBottom: space.md, fontFamily: font.medium },
  roleRow: { flexDirection: "row", gap: space.sm, marginBottom: space.xl },
  roleCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: space.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleCardActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  roleIcon: { fontSize: 26, marginBottom: 6 },
  roleLabel: { color: colors.textMuted, fontSize: 13, fontFamily: font.medium },
  remember: { flexDirection: "row", alignItems: "center", marginBottom: space.xl, gap: space.md },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { borderColor: colors.good, backgroundColor: colors.good },
  checkmark: { color: colors.onAccent, fontWeight: "700", fontSize: 14 },
  rememberText: { color: colors.text, fontSize: 15, fontFamily: font.regular },
  subscribeAlways: { marginTop: space.xl, alignItems: "center" },
  subscribeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: space.xl,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
    width: "100%",
  },
  subscribeText: { color: colors.accent, fontFamily: font.bold, fontSize: 15, fontWeight: "700" },
});
