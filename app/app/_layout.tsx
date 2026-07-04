// Point d'entrée de l'app (expo-router) : providers globaux + fond sombre + police.
import React, { useCallback } from "react";
import { View } from "react-native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { AuthProvider } from "@/state/auth";
import { FeedbackProvider } from "@/ui/feedback";
import { colors } from "@/theme/tokens";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  const onReady = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FeedbackProvider>
          <StatusBar style="light" />
          <SafeAreaView
            style={{ flex: 1, backgroundColor: colors.bg }}
            edges={["top", "bottom"]}
            onLayout={onReady}
          >
            <View style={{ flex: 1, backgroundColor: colors.bg }}>
              <Slot />
            </View>
          </SafeAreaView>
        </FeedbackProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
