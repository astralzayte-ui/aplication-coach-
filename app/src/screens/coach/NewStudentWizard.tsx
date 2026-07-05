// Coach — Assistant « Nouvel élève » (5 étapes) : durée → jours d'entraînement
// → objectif → aperçu du programme → génération du code élève à partager.
import React, { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button, Card } from "@/ui/kit";
import { Chip } from "@/ui/components";
import { ProgramEditor, Program } from "@/ui/ProgramEditor";
import { colors, font, space } from "@/theme/tokens";
import { useToast } from "@/ui/feedback";
import { generateCode, GeneratedCode } from "@/lib/api";
import { setCodeProgram } from "@/lib/data";
import { buildProgram, copyText, DURATIONS, openWhatsApp } from "@/lib/util";

const OBJECTIVES = ["muscle", "masse", "perte", "poids"] as const;
const TRAINING_DAYS = [3, 4, 5, 6];

export default function NewStudentWizard({
  visible, onClose, onDone,
}: {
  visible: boolean; onClose: () => void; onDone: () => void;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [duration, setDuration] = useState(90);
  const [trainingDays, setTrainingDays] = useState(4);
  const [objective, setObjective] = useState<string>("muscle");
  const [program, setProgram] = useState<Program>([]);
  const [code, setCode] = useState<GeneratedCode | null>(null);
  const [busy, setBusy] = useState(false);

  // Le programme est prérempli d'après les jours + l'objectif (le coach peut ensuite le modifier).
  useEffect(() => {
    setProgram(buildProgram(trainingDays, objective));
  }, [trainingDays, objective]);

  const reset = () => {
    setStep(0); setDuration(90); setTrainingDays(4); setObjective("muscle");
    setProgram(buildProgram(4, "muscle")); setCode(null);
  };
  const close = () => { reset(); onClose(); };

  const doGenerate = async () => {
    setBusy(true);
    try {
      const c = await generateCode("student", duration);
      // On attache le programme configuré au code : l'élève le recevra à sa connexion.
      try { await setCodeProgram(c.code_id, program); } catch { /* non bloquant */ }
      setCode(c);
      setStep(4);
      onDone();
    } catch { toast(t("err_generic")); }
    finally { setBusy(false); }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close} presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("wiz_title")}</Text>
          <Pressable onPress={close}><Text style={styles.close}>✕</Text></Pressable>
        </View>
        {step < 4 ? <Text style={styles.stepLabel}>{t("step_of", { a: step + 1, b: 4 })}</Text> : null}

        <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: 40 }}>
          {step === 0 && (
            <Step title={t("wiz_duration")}>
              <View style={styles.chipRow}>
                {DURATIONS.map((d) => <Chip key={d} label={`${d} j`} active={duration === d} onPress={() => setDuration(d)} />)}
              </View>
            </Step>
          )}
          {step === 1 && (
            <Step title={t("wiz_training_days")}>
              <View style={styles.chipRow}>
                {TRAINING_DAYS.map((d) => <Chip key={d} label={`${d}`} active={trainingDays === d} onPress={() => setTrainingDays(d)} />)}
              </View>
            </Step>
          )}
          {step === 2 && (
            <Step title={t("wiz_objective")}>
              <View style={styles.chipRow}>
                {OBJECTIVES.map((o) => <Chip key={o} label={t("obj_" + o)} active={objective === o} onPress={() => setObjective(o)} />)}
              </View>
            </Step>
          )}
          {step === 3 && (
            <Step title={t("wiz_program")}>
              <ProgramEditor value={program} onChange={setProgram} />
            </Step>
          )}
          {step === 4 && code && (
            <Step title={t("wiz_code_ready")}>
              <Card style={{ borderColor: colors.accent, alignItems: "center" }}>
                <Text selectable style={styles.codeBig}>{code.code}</Text>
              </Card>
              <View style={{ height: space.lg }} />
              <View style={{ flexDirection: "row", gap: space.md }}>
                <View style={{ flex: 1 }}><Button label={t("copy")} variant="soft" onPress={async () => { await copyText(code.code); toast(t("copied")); }} /></View>
                <View style={{ flex: 1 }}><Button label={t("wiz_share")} variant="soft" onPress={() => openWhatsApp(t("wa_code_msg", { c: code.code }))} /></View>
              </View>
              <View style={{ height: space.lg }} />
              <Button label={t("done")} onPress={close} />
            </Step>
          )}
        </ScrollView>

        {step < 4 ? (
          <View style={styles.footer}>
            {step > 0 ? <View style={{ flex: 1 }}><Button label={t("prev")} variant="ghost" onPress={() => setStep(step - 1)} /></View> : null}
            <View style={{ flex: 1 }}>
              {step < 3
                ? <Button label={t("next")} onPress={() => setStep(step + 1)} />
                : <Button label={t("wiz_generate")} onPress={doGenerate} loading={busy} />}
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <Text style={styles.stepTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: space.xl, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { color: colors.text, fontFamily: font.bold, fontSize: 20 },
  close: { color: colors.accent, fontSize: 18 },
  stepLabel: { color: colors.textFaint, fontFamily: font.medium, textAlign: "center", marginTop: space.md },
  stepTitle: { color: colors.text, fontFamily: font.bold, fontSize: 20, marginBottom: space.lg },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  dayTitle: { color: colors.accent, fontFamily: font.medium, marginBottom: space.sm },
  exercise: { color: colors.textMuted, fontFamily: font.regular, fontSize: 14, lineHeight: 22 },
  codeBig: { color: colors.text, fontFamily: font.bold, fontSize: 22, letterSpacing: 1 },
  footer: { flexDirection: "row", gap: space.md, padding: space.xl, borderTopWidth: 1, borderTopColor: colors.border },
});
