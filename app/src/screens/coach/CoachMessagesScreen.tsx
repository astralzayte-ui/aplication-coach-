// Coach — Liste de messagerie : un fil par élève.
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Header } from "@/ui/components";
import { AsyncBoundary, RefreshableList } from "@/ui/AsyncBoundary";
import { useAsync } from "@/ui/useAsync";
import { colors, font, radius, space } from "@/theme/tokens";
import { Student, listMyStudents } from "@/lib/data";
import ChatScreen from "@/screens/common/ChatScreen";

export default function CoachMessagesScreen() {
  const { t } = useTranslation();
  const state = useAsync(listMyStudents, []);
  const [chat, setChat] = useState<Student | null>(null);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.top}><Header title={t("msg_title")} /></View>
      <AsyncBoundary loading={state.loading} error={state.error} onRetry={state.reload} hasData={!!state.data}>
        <RefreshableList loading={state.loading} onRefresh={state.reload}>
          {(state.data ?? []).length === 0 ? (
            <Text style={styles.empty}>{t("msg_no_threads")}</Text>
          ) : (
            (state.data ?? []).map((s) => (
              <Pressable key={s.id} style={styles.row} onPress={() => setChat(s)}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{(s.prenom || "?")[0].toUpperCase()}</Text></View>
                <Text style={styles.name}>{s.prenom || "—"}</Text>
              </Pressable>
            ))
          )}
        </RefreshableList>
      </AsyncBoundary>

      <Modal visible={!!chat} animationType="slide" onRequestClose={() => setChat(null)} presentationStyle="pageSheet">
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
          <View style={styles.header}>
            <Text style={styles.title}>{chat?.prenom || t("msg_title")}</Text>
            <Pressable onPress={() => setChat(null)}><Text style={styles.close}>✕</Text></Pressable>
          </View>
          {/* Ce sont MES élèves : chat.coach_id est donc mon propre identifiant. */}
          {chat ? <ChatScreen coachId={chat.coach_id ?? ""} studentId={chat.id} myRole="coach" /> : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: space.xl, paddingTop: space.lg },
  row: { flexDirection: "row", alignItems: "center", gap: space.md, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: space.lg, marginBottom: space.sm },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.accent, fontFamily: font.bold },
  name: { color: colors.text, fontFamily: font.medium, fontSize: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: space.xl, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { color: colors.text, fontFamily: font.bold, fontSize: 20 },
  close: { color: colors.accent, fontSize: 18 },
  empty: { color: colors.textFaint, textAlign: "center", paddingVertical: space.xxl, fontFamily: font.regular },
});
