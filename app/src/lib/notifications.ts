// Notifications : rappel quotidien de l'élève + notification de test +
// enregistrement du jeton push de l'appareil (pour de futurs envois serveur).
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { registerPushToken } from "./data";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensurePermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.status === "granted";
}

// Notification immédiate de test.
export async function sendTestNotification(title: string, body: string): Promise<boolean> {
  const ok = await ensurePermission();
  if (!ok) return false;
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds: 1 } as any,
  });
  return true;
}

// Programme un rappel quotidien à une heure donnée (par défaut 18h).
export async function scheduleDailyReminder(title: string, body: string, hour = 18, minute = 0): Promise<boolean> {
  const ok = await ensurePermission();
  if (!ok) return false;
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { hour, minute, repeats: true } as any,
  });
  return true;
}

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Enregistre le jeton push de l'appareil côté serveur (best effort).
export async function registerForPush(): Promise<void> {
  try {
    const ok = await ensurePermission();
    if (!ok) return;
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? (Constants as any).easConfig?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined)).data;
    await registerPushToken(token, Platform.OS);
  } catch {
    // Pas bloquant : l'app fonctionne sans notifications.
  }
}
