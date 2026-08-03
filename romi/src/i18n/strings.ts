import type { Equipment, Lang, Loc, MealType, Tag } from '../data/types'

export const STRINGS: Record<string, Loc> = {
  app_name: { fr: 'Romi', ar: 'رومي' },
  continue: { fr: 'continuer', ar: 'متابعة' },
  back: { fr: 'retour', ar: 'رجوع' },

  // Auth
  auth_welcome: { fr: 'crée ton compte', ar: 'أنشئ حسابك' },
  auth_sub: { fr: 'on prépare tes dîners de la semaine', ar: 'نحضّر لك عشاء الأسبوع' },
  auth_login_welcome: { fr: 'content de te revoir', ar: 'مرحبا بعودتك' },
  phone_label: { fr: 'numéro de téléphone', ar: 'رقم الهاتف' },
  phone_ph: { fr: '+212 6 12 34 56 78', ar: '+212 6 12 34 56 78' },
  password_label: { fr: 'mot de passe', ar: 'كلمة المرور' },
  password_ph: { fr: '•••', ar: '•••' },
  auth_cta: { fr: 'commencer', ar: 'ابدأ' },
  auth_login_cta: { fr: 'se connecter', ar: 'تسجيل الدخول' },
  auth_have_account: { fr: "j'ai déjà un compte", ar: 'لدي حساب بالفعل' },
  auth_no_account: { fr: 'créer un compte', ar: 'إنشاء حساب' },
  auth_phone_err: { fr: 'entre un numéro valide', ar: 'أدخل رقما صحيحا' },
  auth_pass_err: { fr: 'au moins 4 caractères', ar: '4 أحرف على الأقل' },

  // Store
  store_title: { fr: 'choisis ton magasin', ar: 'اختر متجرك' },
  store_sub: { fr: "on s'occupe des dîners de ta semaine", ar: 'نتكفّل بعشاء أسبوعك' },

  // Duration
  duration_title: { fr: 'pour combien de temps ?', ar: 'لأي مدة ؟' },
  duration_sub: { fr: 'on prépare tes repas et tes courses pour cette durée', ar: 'نحضّر وجباتك ومشترياتك لهذه المدة' },
  duration_1: { fr: '1 semaine', ar: 'أسبوع' },
  duration_n: { fr: 'semaines', ar: 'أسابيع' },
  duration_free_note: { fr: 'essai gratuit — 1 semaine offerte', ar: 'تجربة مجانية — أسبوع مجاني' },

  // Budget
  budget_title: { fr: 'donne-nous ton budget', ar: 'حدّد ميزانيتك' },
  budget_sub: { fr: 'on gardera tes dîners en dessous', ar: 'سنبقي وجباتك تحت هذا الحد' },
  budget_week: { fr: 'cette semaine', ar: 'هذا الأسبوع' },
  budget_for_1: { fr: 'budget pour 1 semaine', ar: 'ميزانية أسبوع واحد' },
  budget_for_n: { fr: 'budget pour', ar: 'ميزانية' },
  budget_trial_note: { fr: 'essai gratuit', ar: 'تجربة مجانية' },

  // People
  people_title: { fr: 'vous êtes combien ?', ar: 'كم عددكم ؟' },
  people_sub: { fr: 'on adapte les quantités & le coût', ar: 'نلائم الكميات والتكلفة' },
  people_unit: { fr: 'personnes', ar: 'أشخاص' },
  people_unit_one: { fr: 'personne', ar: 'شخص' },

  // Ambiance
  ambiance_title: { fr: 'quelle ambiance ?', ar: 'أي أجواء ؟' },
  ambiance_sub: { fr: "choisis jusqu'à 3 options pour tes repas de la semaine", ar: 'اختر حتى 3 خيارات لوجبات أسبوعك' },

  // Dietary
  diet_title: { fr: 'des besoins alimentaires ?', ar: 'احتياجات غذائية ؟' },
  diet_sub: { fr: "coche tout ce qui s'applique", ar: 'اختر كل ما ينطبق' },
  allergy_title: { fr: 'des allergies ?', ar: 'أي حساسية ؟' },
  allergy_sub: { fr: 'on évitera ces ingrédients', ar: 'سنتجنّب هذه المكونات' },
  allergy_ph: { fr: 'ex : arachide, fruits de mer…', ar: 'مثال : فول سوداني، مأكولات بحرية…' },
  allergy_add: { fr: 'ajouter', ar: 'إضافة' },

  // Equipment
  equip_title: { fr: 'qu\'as-tu dans ta cuisine ?', ar: 'ماذا لديك في مطبخك ؟' },
  equip_sub: { fr: 'sélectionne ce que tu as ou veux utiliser', ar: 'اختر ما لديك أو ترغب في استعماله' },
  equip_cta: { fr: 'générer le plan', ar: 'أنشئ الخطة' },

  // Meals per day
  meals_title: { fr: 'combien de repas par jour ?', ar: 'كم وجبة في اليوم ؟' },
  meals_sub: { fr: 'choisis ce que Romi doit préparer', ar: 'اختر ما يجب على رومي تحضيره' },

  // Loading
  loading_title: { fr: 'On prépare\nta semaine…', ar: 'نحضّر\nأسبوعك…' },
  loading_sub: { fr: 'Romi sélectionne les meilleurs repas et optimise ta liste de courses.', ar: 'يختار رومي أفضل الوجبات ويحسّن لائحة مشترياتك.' },
  loading_step1: { fr: 'Analyse du budget et de tes préférences', ar: 'تحليل الميزانية وتفضيلاتك' },
  loading_step2: { fr: 'Création de ton plan de repas', ar: 'إنشاء خطة وجباتك' },
  loading_step3: { fr: 'Génération de la liste de courses', ar: 'إنشاء لائحة المشتريات' },
  status_done: { fr: 'Terminé', ar: 'تم' },
  status_progress: { fr: 'En cours…', ar: 'جارٍ…' },
  status_wait: { fr: 'En attente', ar: 'قيد الانتظار' },

  // Plan
  plan_title: { fr: 'bon appétit !', ar: 'شهية طيبة !' },
  plan_planned_for: { fr: 'prévu pour', ar: 'مُعدّ لـ' },
  plan_cost: { fr: 'coût estimé', ar: 'التكلفة المقدّرة' },
  plan_articles: { fr: 'articles', ar: 'منتج' },
  plan_shopping: { fr: 'Liste de courses', ar: 'لائحة المشتريات' },
  nav_plan: { fr: 'plan', ar: 'الخطة' },
  nav_prefs: { fr: 'préférences', ar: 'التفضيلات' },
  nav_settings: { fr: 'réglages', ar: 'الإعدادات' },
  weeks_title: { fr: 'les semaines suivantes', ar: 'الأسابيع القادمة' },
  week_current: { fr: 'Semaine en cours', ar: 'الأسبوع الحالي' },
  week_n: { fr: 'Semaine', ar: 'الأسبوع' },
  month_current: { fr: 'Reste du mois', ar: 'بقية الشهر' },
  locked_hint: { fr: 'Débloque avec l\'abonnement', ar: 'افتحه بالاشتراك' },

  // Meal detail
  change: { fr: 'Changer', ar: 'تغيير' },
  protein: { fr: 'PROTÉINES', ar: 'بروتينات' },
  carbs: { fr: 'GLUCIDES', ar: 'كربوهيدرات' },
  fat: { fr: 'LIPIDES', ar: 'دهون' },
  kcal: { fr: 'KCAL', ar: 'سعرة' },
  price_per: { fr: '/ pers', ar: '/ شخص' },
  time: { fr: 'TEMPS', ar: 'المدة' },
  nutri_note: { fr: 'Valeurs nutritionnelles estimées', ar: 'قيم غذائية تقديرية' },
  ingredients: { fr: 'Ingrédients', ar: 'المكونات' },
  preparation: { fr: 'Préparation', ar: 'طريقة التحضير' },
  steps_soon: { fr: 'Étapes bientôt disponibles pour ce plat.', ar: 'الخطوات ستتوفر قريبا لهذا الطبق.' },
  choose_other: { fr: 'Choisir un autre plat', ar: 'اختر طبقا آخر' },

  // Shopping list
  shopping_title: { fr: 'Liste de courses', ar: 'لائحة المشتريات' },
  for_store: { fr: 'Pour', ar: 'لـ' },
  faits: { fr: 'faits', ar: 'مُنجز' },
  copy: { fr: 'Copier', ar: 'نسخ' },
  copied: { fr: 'Copié !', ar: 'تم النسخ !' },
  share_short: { fr: 'Partager', ar: 'مشاركة' },
  share_list: { fr: 'Partager la liste', ar: 'مشاركة اللائحة' },

  // Fridge
  fridge_title: { fr: 'dans ton frigo', ar: 'في ثلاجتك' },
  fridge_sub: { fr: 'ajoute ce que tu as, on te propose des plats faciles', ar: 'أضف ما لديك ونقترح عليك أطباقا سهلة' },
  fridge_add: { fr: 'ajouter', ar: 'إضافة' },
  fridge_suggestions: { fr: 'idées de plats', ar: 'أفكار أطباق' },
  fridge_empty: { fr: 'ajoute des ingrédients pour voir des idées', ar: 'أضف مكونات لرؤية الأفكار' },
  fridge_match: { fr: 'ingrédients en commun', ar: 'مكونات مشتركة' },

  // Trial
  trial_left: { fr: "j d'essai", ar: 'يوم تجربة' },
  trial_ended_title: { fr: 'ton essai est terminé', ar: 'انتهت تجربتك' },
  trial_ended_sub: { fr: 'pour continuer à recevoir tes plats et ta liste de courses, active ton abonnement.', ar: 'لمواصلة استلام وجباتك ولائحة مشترياتك، فعّل اشتراكك.' },
  trial_whatsapp: { fr: 'Payer via WhatsApp', ar: 'ادفع عبر واتساب' },
  trial_whatsapp_note: { fr: 'envoie-nous un message, on te transmet le RIB', ar: 'راسلنا وسنرسل لك معلومات الحساب البنكي' },
  premium_locked: { fr: 'réservé aux abonnés', ar: 'خاص بالمشتركين' },

  // Prefs / settings
  settings_title: { fr: 'réglages', ar: 'الإعدادات' },
  prefs_title: { fr: 'préférences', ar: 'التفضيلات' },
  lang_label: { fr: 'Langue', ar: 'اللغة' },
  your_store: { fr: 'Magasin', ar: 'المتجر' },
  your_budget: { fr: 'Budget hebdo', ar: 'الميزانية الأسبوعية' },
  your_people: { fr: 'Personnes', ar: 'الأشخاص' },
  your_meals: { fr: 'Repas / jour', ar: 'وجبات / يوم' },
  regenerate: { fr: 'Régénérer (mêmes réglages)', ar: 'إعادة التوليد (نفس الإعدادات)' },
  new_cycle: { fr: 'Nouveau cycle', ar: 'دورة جديدة' },
  new_cycle_sub: { fr: 'choisir la durée & refaire le budget', ar: 'اختيار المدة وإعادة الميزانية' },
  reset_all: { fr: 'Tout recommencer', ar: 'إعادة كل شيء' },
  reset_all_sub: { fr: 'magasin, budget, préférences…', ar: 'المتجر، الميزانية، التفضيلات…' },
  reset_confirm_title: { fr: 'Tout recommencer ?', ar: 'إعادة كل شيء ؟' },
  reset_confirm_body: { fr: 'On efface ton plan actuel et tes réglages, puis on refait le questionnaire depuis le début. Ton compte est conservé.', ar: 'سنمسح خطتك وإعداداتك الحالية ونعيد الاستبيان من البداية. سيتم الاحتفاظ بحسابك.' },
  cancel: { fr: 'Annuler', ar: 'إلغاء' },
  confirm: { fr: 'Oui, recommencer', ar: 'نعم، إعادة' },
  cycle_ended_title: { fr: 'ton cycle est terminé', ar: 'انتهت دورتك' },
  cycle_new_cta: { fr: 'Commencer un nouveau cycle', ar: 'ابدأ دورة جديدة' },
  logout: { fr: 'Se déconnecter', ar: 'تسجيل الخروج' },
  save: { fr: 'Enregistrer', ar: 'حفظ' },
  max3: { fr: 'jusqu\'à 3', ar: 'حتى 3' },
}

/** "1 semaine" / "3 semaines" localized. */
export function durationLabel(weeks: number, lang: Lang): string {
  if (weeks <= 1) return STRINGS.duration_1[lang]
  return `${weeks} ${STRINGS.duration_n[lang]}`
}

export const TAG_LABELS: Record<Tag, Loc> = {
  rapide: { fr: 'rapide', ar: 'سريع' },
  proteine: { fr: 'protéiné', ar: 'بروتيني' },
  healthy: { fr: 'healthy', ar: 'صحي' },
  du_monde: { fr: 'international', ar: 'عالمي' },
  gourmand: { fr: 'gourmand', ar: 'شهي' },
  famille: { fr: 'en famille', ar: 'عائلي' },
  vegetarien: { fr: 'végé', ar: 'نباتي' },
}

export const AMBIANCE: { id: Tag; label: Loc; emoji: string; bg: string }[] = [
  { id: 'rapide', label: { fr: 'Rapide & facile', ar: 'سريع وسهل' }, emoji: '⚡️', bg: '#fbe7a1' },
  { id: 'proteine', label: { fr: 'Riche en protéines', ar: 'غني بالبروتين' }, emoji: '💪', bg: '#f9c9d6' },
  { id: 'famille', label: { fr: 'En famille', ar: 'مع العائلة' }, emoji: '👨‍👩‍👧', bg: '#c8dcf2' },
  { id: 'healthy', label: { fr: 'Healthy', ar: 'صحي' }, emoji: '🥗', bg: '#c8e6b6' },
  { id: 'gourmand', label: { fr: 'Gourmand', ar: 'شهي' }, emoji: '😋', bg: '#f7cadb' },
  { id: 'du_monde', label: { fr: 'International', ar: 'مأكولات عالمية' }, emoji: '🌍', bg: '#d9cff0' },
]

export const MEAL_LABELS: Record<MealType, Loc> = {
  petit_dejeuner: { fr: 'Petit-déjeuner', ar: 'فطور' },
  casse_croute: { fr: 'Casse-croûte', ar: 'وجبة خفيفة' },
  dejeuner: { fr: 'Déjeuner', ar: 'غداء' },
  gouter: { fr: 'Goûter', ar: 'وجبة العصر' },
  diner: { fr: 'Dîner', ar: 'عشاء' },
  encas: { fr: 'En-cas', ar: 'سناك' },
}

export const MEAL_EMOJI: Record<MealType, string> = {
  petit_dejeuner: '🥐', casse_croute: '🥪', dejeuner: '🍽️', gouter: '🍎', diner: '🌙', encas: '🍿',
}

export const DIETS: { id: string; label: Loc; emoji: string }[] = [
  { id: 'aucun', label: { fr: 'Aucun', ar: 'لا شيء' }, emoji: '' },
  { id: 'vegetarien', label: { fr: 'Végétarien', ar: 'نباتي' }, emoji: '🥕' },
  { id: 'pescetarien', label: { fr: 'Pescétarien', ar: 'نباتي + سمك' }, emoji: '🐟' },
  { id: 'sans_gluten', label: { fr: 'Sans gluten', ar: 'بدون غلوتين' }, emoji: '🌾' },
  { id: 'sans_lactose', label: { fr: 'Sans lactose', ar: 'بدون لاكتوز' }, emoji: '🥛' },
  { id: 'enceinte', label: { fr: 'Femme enceinte', ar: 'حامل' }, emoji: '🤰' },
]

export const EQUIPMENT: { id: Equipment; label: Loc; icon: string }[] = [
  { id: 'four', label: { fr: 'Four', ar: 'فرن' }, icon: 'oven' },
  { id: 'plaque', label: { fr: 'Plaque', ar: 'موقد' }, icon: 'stove' },
  { id: 'air_fryer', label: { fr: 'Air fryer', ar: 'قلاية هوائية' }, icon: 'airfryer' },
  { id: 'grill', label: { fr: 'Gril', ar: 'شواية' }, icon: 'grill' },
  { id: 'mijoteuse', label: { fr: 'Mijoteuse', ar: 'طنجرة بطيئة' }, icon: 'pot' },
]

export const MEALS_PER_DAY: { id: MealType; label: Loc; emoji: string }[] = [
  { id: 'petit_dejeuner', label: MEAL_LABELS.petit_dejeuner, emoji: '🥐' },
  { id: 'casse_croute', label: MEAL_LABELS.casse_croute, emoji: '🥪' },
  { id: 'dejeuner', label: MEAL_LABELS.dejeuner, emoji: '🍽️' },
  { id: 'gouter', label: MEAL_LABELS.gouter, emoji: '🍎' },
  { id: 'diner', label: MEAL_LABELS.diner, emoji: '🌙' },
  { id: 'encas', label: MEAL_LABELS.encas, emoji: '🍿' },
]

export function makeT(lang: Lang) {
  return (key: string): string => {
    const s = STRINGS[key]
    return s ? s[lang] : key
  }
}
