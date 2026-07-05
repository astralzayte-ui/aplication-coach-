// Notifications : rappel quotidien de l'élève + notification de test +
// enregistrement du jeton push de l'appareil (pour de futurs envois serveur).
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { registerPushToken } from "./data";

// Les notifications ne sont pas prises en charge de la même façon dans un
// navigateur : sur le web, ces fonctions ne font rien (l'app reste utilisable).
const IS_WEB = Platform.OS === "web";

if (!IS_WEB) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Android exige un « canal » pour afficher les notifications (Android 8+).
async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "FORMA",
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: "#4F7DD1",
    });
  }
}

export async function ensurePermission(): Promise<boolean> {
  if (IS_WEB) return false;
  await ensureAndroidChannel();
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
  if (IS_WEB) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Enregistre le jeton push de l'appareil côté serveur (best effort).
export async function registerForPush(): Promise<void> {
  if (IS_WEB) return;
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
