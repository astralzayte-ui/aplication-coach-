// Conteneur de l'espace Élève : contenu + barre d'onglets basse.
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { TabBar } from "@/ui/components";
import { registerForPush } from "@/lib/notifications";
import StudentHomeScreen from "./StudentHomeScreen";
import StudentProgramScreen from "./StudentProgramScreen";
import StudentMealsScreen from "./StudentMealsScreen";
import StudentProgressScreen from "./StudentProgressScreen";
import StudentMessagesScreen from "./StudentMessagesScreen";

export default function StudentApp() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("home");

  useEffect(() => {
    registerForPush();
  }, []);

  const tabs = [
    { key: "home", label: t("tab_home"), icon: "🏠" },
    { key: "program", label: t("tab_program"), icon: "🏋️" },
    { key: "meals", label: t("tab_meals"), icon: "🍽️" },
    { key: "progress", label: t("tab_progress"), icon: "📈" },
    { key: "messages", label: t("tab_messages"), icon: "💬" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {tab === "home" && <StudentHomeScreen />}
        {tab === "program" && <StudentProgramScreen />}
        {tab === "meals" && <StudentMealsScreen />}
        {tab === "progress" && <StudentProgressScreen />}
        {tab === "messages" && <StudentMessagesScreen />}
      </View>
      <TabBar tabs={tabs} active={tab} onChange={setTab} />
    </View>
  );
}
