// Élève — Messagerie : discussion avec son coach.
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Header } from "@/ui/components";
import { AsyncBoundary } from "@/ui/AsyncBoundary";
import { useAsync } from "@/ui/useAsync";
import { colors, font, space } from "@/theme/tokens";
import { getMyStudent } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import ChatScreen from "@/screens/common/ChatScreen";

export default function StudentMessagesScreen() {
  const { t } = useTranslation();
  const state = useAsync(async () => {
    const student = await getMyStudent();
    const me = (await supabase.auth.getUser()).data.user?.id ?? "";
    return { coachId: student.coach_id, myId: me };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.top}><Header title={t("msg_title")} /></View>
      <AsyncBoundary loading={state.loading} error={state.error} onRetry={state.reload} hasData={!!state.data}>
        {state.data?.coachId ? (
          <ChatScreen coachId={state.data.coachId} studentId={state.data.myId} myRole="student" />
        ) : (
          <View style={styles.center}><Text style={styles.empty}>{t("msg_no_threads")}</Text></View>
        )}
      </AsyncBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: space.xl, paddingTop: space.lg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { color: colors.textFaint, fontFamily: font.regular },
});
