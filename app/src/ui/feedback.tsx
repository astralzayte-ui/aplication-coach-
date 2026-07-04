// Toasts (messages en bas) + modale de confirmation générique (Annuler / Action,
// variante « soft » verte pour la déconnexion, rouge pour les suppressions).
import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, font, radius, space } from "@/theme/tokens";

// ---------- Toast ----------
const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

// ---------- Confirm ----------
type ConfirmOpts = {
  message: string;
  icon?: string;
  yesLabel: string;
  cancelLabel: string;
  variant?: "danger" | "soft";
  onYes: () => void;
};
const ConfirmCtx = createContext<(o: ConfirmOpts) => void>(() => {});
export const useConfirm = () => useContext(ConfirmCtx);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmOpts | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (msg: string) => {
      setToast(msg);
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() =>
          setToast(null),
        );
      }, 2200);
    },
    [opacity],
  );

  const showConfirm = useCallback((o: ConfirmOpts) => setConfirm(o), []);

  return (
    <ToastCtx.Provider value={showToast}>
      <ConfirmCtx.Provider value={showConfirm}>
        {children}

        {toast ? (
          <Animated.View pointerEvents="none" style={[styles.toast, { opacity }]}>
            <Text style={styles.toastText}>{toast}</Text>
          </Animated.View>
        ) : null}

        <Modal visible={!!confirm} transparent animationType="fade" onRequestClose={() => setConfirm(null)}>
          <Pressable style={styles.backdrop} onPress={() => setConfirm(null)}>
            <Pressable style={styles.sheet} onPress={() => {}}>
              {confirm?.icon ? <Text style={styles.confirmIcon}>{confirm.icon}</Text> : null}
              <Text style={styles.confirmMsg}>{confirm?.message}</Text>
              <View style={styles.confirmRow}>
                <Pressable style={[styles.cbtn, styles.cbtnGhost]} onPress={() => setConfirm(null)}>
                  <Text style={styles.cbtnGhostText}>{confirm?.cancelLabel}</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.cbtn,
                    { backgroundColor: confirm?.variant === "soft" ? colors.good : colors.danger },
                  ]}
                  onPress={() => {
                    const cb = confirm?.onYes;
                    setConfirm(null);
                    cb?.();
                  }}
                >
                  <Text style={styles.cbtnText}>{confirm?.yesLabel}</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </ConfirmCtx.Provider>
    </ToastCtx.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    backgroundColor: colors.surface2,
    borderRadius: radius.pill,
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: "86%",
  },
  toastText: { color: colors.text, fontFamily: font.medium, fontSize: 14, textAlign: "center" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", padding: space.xxl },
  sheet: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.xxl,
    alignItems: "center",
  },
  confirmIcon: { fontSize: 40, marginBottom: space.md },
  confirmMsg: { color: colors.text, fontSize: 16, textAlign: "center", fontFamily: font.medium, marginBottom: space.xl, lineHeight: 22 },
  confirmRow: { flexDirection: "row", gap: space.md, width: "100%" },
  cbtn: { flex: 1, height: 48, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  cbtnGhost: { borderWidth: 1, borderColor: colors.border },
  cbtnGhostText: { color: colors.text, fontFamily: font.medium },
  cbtnText: { color: colors.onAccent, fontFamily: font.bold, fontWeight: "700" },
});
