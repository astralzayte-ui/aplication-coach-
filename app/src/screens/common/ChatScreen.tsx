// Messagerie (fil coach <-> élève). Utilisée par le coach et par l'élève.
import React, { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AsyncBoundary } from "@/ui/AsyncBoundary";
import { useAsync } from "@/ui/useAsync";
import { colors, font, radius, space } from "@/theme/tokens";
import { Message, listMessages, sendMessage } from "@/lib/data";

export default function ChatScreen({
  coachId, studentId, myRole,
}: {
  coachId: string; studentId: string; myRole: "coach" | "student";
}) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const state = useAsync(() => listMessages(coachId, studentId), [coachId, studentId]);

  const onSend = async () => {
    const body = text.trim();
    if (!body) return;
    setText("");
    setSending(true);
    try {
      await sendMessage(coachId, studentId, myRole, body);
      state.reload();
    } catch {
      setText(body); // on rend le texte si l'envoi échoue
    } finally {
      setSending(false);
    }
  };

  const messages = state.data ?? [];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={80}>
      <AsyncBoundary loading={state.loading} error={state.error} onRetry={state.reload} hasData={!!state.data}>
        {messages.length === 0 ? (
          <View style={styles.empty}><Text style={styles.emptyText}>{t("msg_empty")}</Text></View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: space.lg }}
            renderItem={({ item }: { item: Message }) => {
              const mine = item.sender_role === myRole;
              return (
                <View style={[styles.bubbleRow, { justifyContent: mine ? "flex-end" : "flex-start" }]}>
                  <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                    <Text style={[styles.msgText, mine && { color: colors.onAccent }]}>{item.body}</Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </AsyncBoundary>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={t("msg_ph")}
          placeholderTextColor={colors.textFaint}
          multiline
        />
        <Pressable style={styles.sendBtn} onPress={onSend} disabled={sending}>
          <Text style={styles.sendText}>➤</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: colors.textFaint, fontFamily: font.regular },
  bubbleRow: { flexDirection: "row", marginBottom: space.sm },
  bubble: { maxWidth: "80%", paddingHorizontal: space.lg, paddingVertical: space.md, borderRadius: radius.lg },
  mine: { backgroundColor: colors.accent, borderBottomRightRadius: 4 },
  theirs: { backgroundColor: colors.surface2, borderBottomLeftRadius: 4 },
  msgText: { color: colors.text, fontFamily: font.regular, fontSize: 15 },
  inputRow: { flexDirection: "row", alignItems: "flex-end", padding: space.md, borderTopWidth: 1, borderTopColor: colors.border, gap: space.sm },
  input: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    color: colors.text, paddingHorizontal: space.lg, paddingVertical: space.md, maxHeight: 120, fontFamily: font.regular,
  },
  sendBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  sendText: { color: colors.onAccent, fontSize: 18 },
});
