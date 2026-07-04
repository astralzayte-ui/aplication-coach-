// Initialisation du multilingue + gestion du sens d'écriture (RTL pour l'arabe).
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { I18nManager } from "react-native";
import { LANGS, LangCode, resources } from "./translations";

const LANG_KEY = "forma_lang";

function deviceLang(): LangCode {
  const tag = getLocales()[0]?.languageCode ?? "fr";
  return (LANGS.find((l) => l.code === tag)?.code ?? "fr") as LangCode;
}

export async function initI18n(): Promise<void> {
  const saved = (await SecureStore.getItemAsync(LANG_KEY)) as LangCode | null;
  const lang = saved ?? deviceLang();
  await i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: "fr",
    interpolation: { escapeValue: false },
    compatibilityJSON: "v3",
  });
  applyDirection(lang);
}

export function isRTL(lang: LangCode): boolean {
  return LANGS.find((l) => l.code === lang)?.rtl ?? false;
}

// Applique le sens d'écriture. Un vrai changement RTL/LTR demande un redémarrage
// de l'app (I18nManager) ; on gère aussi l'alignement au niveau des composants.
function applyDirection(lang: LangCode): void {
  const rtl = isRTL(lang);
  if (I18nManager.isRTL !== rtl) {
    I18nManager.allowRTL(rtl);
    I18nManager.forceRTL(rtl);
  }
}

export async function changeLanguage(lang: LangCode): Promise<void> {
  await SecureStore.setItemAsync(LANG_KEY, lang);
  await i18n.changeLanguage(lang);
  applyDirection(lang);
}

export { i18n };
