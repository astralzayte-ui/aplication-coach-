// Conteneur de l'espace Coach : contenu + barre d'onglets basse + overlays.
import React, { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { TabBar } from "@/ui/components";
import CoachStudentsScreen from "./CoachStudentsScreen";
import CoachMealsScreen from "./CoachMealsScreen";
import CoachTemplatesScreen from "./CoachTemplatesScreen";
import CoachMessagesScreen from "./CoachMessagesScreen";
import CoachProfileScreen from "./CoachProfileScreen";

export default function CoachApp() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("students");

  const tabs = [
    { key: "students", label: t("tab_students"), icon: "👥" },
    { key: "meals", label: t("tab_meals"), icon: "🍽️" },
    { key: "templates", label: t("tab_templates"), icon: "📋" },
    { key: "messages", label: t("tab_messages"), icon: "💬" },
    { key: "profile", label: t("tab_profile"), icon: "👤" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {tab === "students" && <CoachStudentsScreen />}
        {tab === "meals" && <CoachMealsScreen />}
        {tab === "templates" && <CoachTemplatesScreen />}
        {tab === "messages" && <CoachMessagesScreen />}
        {tab === "profile" && <CoachProfileScreen />}
      </View>
      <TabBar tabs={tabs} active={tab} onChange={setTab} />
    </View>
  );
}
