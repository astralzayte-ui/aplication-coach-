import type { Equipment, Lang, Loc, MealType, Tag } from '../data/types'

export const STRINGS: Record<string, Loc> = {
  app_name: { fr: 'Romi', ar: 'رومي', en: 'Romi' },
  continue: { fr: 'continuer', ar: 'متابعة', en: 'continue' },
  back: { fr: 'retour', ar: 'رجوع', en: 'back' },

  // Auth
  auth_welcome: { fr: 'crée ton compte', ar: 'أنشئ حسابك', en: 'create your account' },
  auth_sub: { fr: 'on prépare tes dîners de la semaine', ar: 'نحضّر لك عشاء الأسبوع', en: "we plan your week's meals" },
  auth_login_welcome: { fr: 'content de te revoir', ar: 'مرحبا بعودتك', en: 'welcome back' },
  phone_label: { fr: 'numéro de téléphone', ar: 'رقم الهاتف', en: 'phone number' },
  phone_ph: { fr: '+212 6 12 34 56 78', ar: '+212 6 12 34 56 78', en: '+212 6 12 34 56 78' },
  password_label: { fr: 'mot de passe', ar: 'كلمة المرور', en: 'password' },
  password_ph: { fr: '•••', ar: '•••', en: '•••' },
  auth_cta: { fr: 'commencer', ar: 'ابدأ', en: 'get started' },
  auth_login_cta: { fr: 'se connecter', ar: 'تسجيل الدخول', en: 'log in' },
  auth_have_account: { fr: "j'ai déjà un compte", ar: 'لدي حساب بالفعل', en: 'I already have an account' },
  auth_no_account: { fr: 'créer un compte', ar: 'إنشاء حساب', en: 'create an account' },
  auth_phone_err: { fr: 'entre un numéro valide', ar: 'أدخل رقما صحيحا', en: 'enter a valid number' },
  auth_pass_err: { fr: 'au moins 4 caractères', ar: '4 أحرف على الأقل', en: 'at least 4 characters' },

  // Store
  store_title: { fr: 'choisis ton magasin', ar: 'اختر متجرك', en: 'choose your store' },
  store_sub: { fr: "on s'occupe des dîners de ta semaine", ar: 'نتكفّل بعشاء أسبوعك', en: "we handle your week's dinners" },

  // Duration
  duration_title: { fr: 'pour combien de temps ?', ar: 'لأي مدة ؟', en: 'for how long?' },
  duration_sub: { fr: 'on prépare tes repas et tes courses pour cette durée', ar: 'نحضّر وجباتك ومشترياتك لهذه المدة', en: "we'll plan your meals and shopping for this period" },
  duration_1: { fr: '1 semaine', ar: 'أسبوع', en: '1 week' },
  duration_n: { fr: 'semaines', ar: 'أسابيع', en: 'weeks' },
  duration_free_note: { fr: 'essai gratuit — 1 semaine offerte', ar: 'تجربة مجانية — أسبوع مجاني', en: 'free trial — 1 week free' },

  // Budget
  budget_title: { fr: 'donne-nous ton budget', ar: 'حدّد ميزانيتك', en: 'what is your budget?' },
  budget_sub: { fr: 'on gardera tes dîners en dessous', ar: 'سنبقي وجباتك تحت هذا الحد', en: "we'll keep your meals under this" },
  budget_week: { fr: 'cette semaine', ar: 'هذا الأسبوع', en: 'this week' },
  budget_for_1: { fr: 'budget pour 1 semaine', ar: 'ميزانية أسبوع واحد', en: 'budget for 1 week' },
  budget_for_n: { fr: 'budget pour', ar: 'ميزانية', en: 'budget for' },
  budget_trial_note: { fr: 'essai gratuit', ar: 'تجربة مجانية', en: 'free trial' },
  leftovers_title: { fr: 'Réutiliser les restes', ar: 'إعادة استعمال البقايا', en: 'Reuse leftovers' },
  leftovers_desc: { fr: "Ex : tu achètes un paquet de 500 g de pâtes, tu n'en utilises que 200 g → les 300 g restants sont gardés et déduits de ta prochaine liste de courses. Tu peux l'activer ou le désactiver.", ar: 'مثال: تشتري كيس معكرونة 500 غ وتستعمل 200 غ فقط → تُحتفظ الـ300 غ المتبقية وتُخصم من لائحة مشترياتك القادمة. يمكنك تفعيله أو تعطيله.', en: 'E.g. you buy a 500 g bag of pasta but only use 200 g → the remaining 300 g are carried over and deducted from your next shopping list.' },

  // People
  people_title: { fr: 'vous êtes combien ?', ar: 'كم عددكم ؟', en: 'how many people?' },
  people_sub: { fr: 'on adapte les quantités & le coût', ar: 'نلائم الكميات والتكلفة', en: 'we adjust quantities & cost' },
  people_unit: { fr: 'personnes', ar: 'أشخاص', en: 'people' },
  people_unit_one: { fr: 'personne', ar: 'شخص', en: 'person' },

  // Ambiance
  ambiance_title: { fr: 'quelle ambiance ?', ar: 'أي أجواء ؟', en: 'what vibe?' },
  ambiance_sub: { fr: "choisis jusqu'à 3 options pour tes repas de la semaine", ar: 'اختر حتى 3 خيارات لوجبات أسبوعك', en: 'pick up to 3 options for your weekly meals' },

  // Dietary
  diet_title: { fr: 'des besoins alimentaires ?', ar: 'احتياجات غذائية ؟', en: 'any dietary needs?' },
  diet_sub: { fr: "coche tout ce qui s'applique", ar: 'اختر كل ما ينطبق', en: 'check everything that applies' },
  allergy_title: { fr: 'des allergies ?', ar: 'أي حساسية ؟', en: 'any allergies?' },
  allergy_sub: { fr: 'on évitera ces ingrédients', ar: 'سنتجنّب هذه المكونات', en: "we'll avoid these ingredients" },
  allergy_ph: { fr: 'ex : arachide, fruits de mer…', ar: 'مثال : فول سوداني، مأكولات بحرية…', en: 'e.g. peanuts, seafood…' },
  allergy_add: { fr: 'ajouter', ar: 'إضافة', en: 'add' },

  // Equipment
  equip_title: { fr: "qu'as-tu dans ta cuisine ?", ar: 'ماذا لديك في مطبخك ؟', en: "what's in your kitchen?" },
  equip_sub: { fr: 'sélectionne ce que tu as ou veux utiliser', ar: 'اختر ما لديك أو ترغب في استعماله', en: 'select what you have or want to use' },
  equip_cta: { fr: 'générer le plan', ar: 'أنشئ الخطة', en: 'generate plan' },

  // Meals per day
  meals_title: { fr: 'combien de repas par jour ?', ar: 'كم وجبة في اليوم ؟', en: 'how many meals a day?' },
  meals_sub: { fr: 'choisis ce que Romi doit préparer', ar: 'اختر ما يجب على رومي تحضيره', en: 'choose what Romi should plan' },

  // Loading
  loading_title: { fr: 'On prépare\nta semaine…', ar: 'نحضّر\nأسبوعك…', en: 'Planning\nyour week…' },
  loading_sub: { fr: 'Romi sélectionne les meilleurs repas et optimise ta liste de courses.', ar: 'يختار رومي أفضل الوجبات ويحسّن لائحة مشترياتك.', en: 'Romi selects the best meals and optimises your shopping list.' },
  loading_step1: { fr: 'Analyse du budget et de tes préférences', ar: 'تحليل الميزانية وتفضيلاتك', en: 'Analysing budget and preferences' },
  loading_step2: { fr: 'Création de ton plan de repas', ar: 'إنشاء خطة وجباتك', en: 'Building your meal plan' },
  loading_step3: { fr: 'Génération de la liste de courses', ar: 'إنشاء لائحة المشتريات', en: 'Generating shopping list' },
  status_done: { fr: 'Terminé', ar: 'تم', en: 'Done' },
  status_progress: { fr: 'En cours…', ar: 'جارٍ…', en: 'In progress…' },
  status_wait: { fr: 'En attente', ar: 'قيد الانتظار', en: 'Waiting' },

  // Plan
  plan_title: { fr: 'bon appétit !', ar: 'شهية طيبة !', en: 'enjoy your meals!' },
  plan_planned_for: { fr: 'prévu pour', ar: 'مُعدّ لـ', en: 'planned for' },
  plan_cost: { fr: 'coût estimé', ar: 'التكلفة المقدّرة', en: 'estimated cost' },
  plan_articles: { fr: 'articles', ar: 'منتج', en: 'items' },
  plan_shopping: { fr: 'Liste de courses', ar: 'لائحة المشتريات', en: 'Shopping list' },
  nav_plan: { fr: 'plan', ar: 'الخطة', en: 'plan' },
  nav_prefs: { fr: 'préférences', ar: 'التفضيلات', en: 'preferences' },
  nav_settings: { fr: 'réglages', ar: 'الإعدادات', en: 'settings' },
  weeks_title: { fr: 'les semaines suivantes', ar: 'الأسابيع القادمة', en: 'upcoming weeks' },
  week_current: { fr: 'Semaine en cours', ar: 'الأسبوع الحالي', en: 'Current week' },
  week_n: { fr: 'Semaine', ar: 'الأسبوع', en: 'Week' },
  month_current: { fr: 'Reste du mois', ar: 'بقية الشهر', en: 'Rest of month' },
  locked_hint: { fr: "Débloque avec l'abonnement", ar: 'افتحه بالاشتراك', en: 'Unlock with subscription' },

  // Meal detail
  change: { fr: 'Changer', ar: 'تغيير', en: 'Change' },
  protein: { fr: 'PROTÉINES', ar: 'بروتينات', en: 'PROTEIN' },
  carbs: { fr: 'GLUCIDES', ar: 'كربوهيدرات', en: 'CARBS' },
  fat: { fr: 'LIPIDES', ar: 'دهون', en: 'FAT' },
  kcal: { fr: 'KCAL', ar: 'سعرة', en: 'KCAL' },
  price_per: { fr: '/ pers', ar: '/ شخص', en: '/ person' },
  time: { fr: 'TEMPS', ar: 'المدة', en: 'TIME' },
  nutri_note: { fr: 'Valeurs nutritionnelles estimées', ar: 'قيم غذائية تقديرية', en: 'Estimated nutritional values' },
  ingredients: { fr: 'Ingrédients', ar: 'المكونات', en: 'Ingredients' },
  preparation: { fr: 'Préparation', ar: 'طريقة التحضير', en: 'Preparation' },
  steps_soon: { fr: 'Étapes bientôt disponibles pour ce plat.', ar: 'الخطوات ستتوفر قريبا لهذا الطبق.', en: 'Steps coming soon for this dish.' },
  video_tuto: { fr: '▶ Vidéo tutoriel', ar: '▶ فيديو الطريقة', en: '▶ Video tutorial' },
  watch_yt: { fr: 'Voir sur YouTube', ar: 'مشاهدة على يوتيوب', en: 'Watch on YouTube' },
  choose_other: { fr: 'Choisir un autre plat', ar: 'اختر طبقا آخر', en: 'Choose another dish' },

  // Shopping list
  shopping_title: { fr: 'Liste de courses', ar: 'لائحة المشتريات', en: 'Shopping list' },
  for_store: { fr: 'Pour', ar: 'لـ', en: 'At' },
  faits: { fr: 'faits', ar: 'مُنجز', en: 'done' },
  copy: { fr: 'Copier', ar: 'نسخ', en: 'Copy' },
  copied: { fr: 'Copié !', ar: 'تم النسخ !', en: 'Copied!' },
  share_short: { fr: 'Partager', ar: 'مشاركة', en: 'Share' },
  share_list: { fr: 'Partager la liste', ar: 'مشاركة اللائحة', en: 'Share list' },

  // Fridge
  fridge_title: { fr: 'dans ton frigo', ar: 'في ثلاجتك', en: "in your fridge" },
  fridge_sub: { fr: 'ajoute ce que tu as, on te propose des plats faciles', ar: 'أضف ما لديك ونقترح عليك أطباقا سهلة', en: "add what you have, we'll suggest easy dishes" },
  fridge_add: { fr: 'ajouter', ar: 'إضافة', en: 'add' },
  fridge_suggestions: { fr: 'idées de plats', ar: 'أفكار أطباق', en: 'dish ideas' },
  fridge_empty: { fr: 'ajoute des ingrédients pour voir des idées', ar: 'أضف مكونات لرؤية الأفكار', en: 'add ingredients to see ideas' },
  fridge_match: { fr: 'ingrédients en commun', ar: 'مكونات مشتركة', en: 'matching ingredients' },

  // Trial
  trial_left: { fr: "j d'essai", ar: 'يوم تجربة', en: 'trial day' },
  trial_left_days: { fr: 'jour', ar: 'يوم', en: 'day' },
  trial_left_days_pl: { fr: 'jours', ar: 'أيام', en: 'days' },
  trial_left_hours: { fr: 'heure', ar: 'ساعة', en: 'hour' },
  trial_left_hours_pl: { fr: 'heures', ar: 'ساعات', en: 'hours' },
  trial_left_prefix: { fr: 'il reste', ar: 'تبقّى', en: '' },
  trial_left_suffix: { fr: "avant la fin de l'essai gratuit", ar: 'قبل انتهاء التجربة المجانية', en: 'left in your free trial' },
  trial_ended_title: { fr: 'ton essai est terminé', ar: 'انتهت تجربتك', en: 'your trial has ended' },
  trial_ended_sub: { fr: 'pour continuer à recevoir tes plats et ta liste de courses, active ton abonnement.', ar: 'لمواصلة استلام وجباتك ولائحة مشترياتك، فعّل اشتراكك.', en: 'to keep receiving your meals and shopping list, activate your subscription.' },
  trial_whatsapp: { fr: 'Payer via WhatsApp', ar: 'ادفع عبر واتساب', en: 'Pay via WhatsApp' },
  trial_whatsapp_note: { fr: 'envoie-nous un message, on te transmet le RIB', ar: 'راسلنا وسنرسل لك معلومات الحساب البنكي', en: 'send us a message and we will share payment details' },
  premium_locked: { fr: 'réservé aux abonnés', ar: 'خاص بالمشتركين', en: 'subscribers only' },

  // Prefs / settings
  settings_title: { fr: 'réglages', ar: 'الإعدادات', en: 'settings' },
  prefs_title: { fr: 'préférences', ar: 'التفضيلات', en: 'preferences' },
  lang_label: { fr: 'Langue', ar: 'اللغة', en: 'Language' },
  your_store: { fr: 'Magasin', ar: 'المتجر', en: 'Store' },
  your_budget: { fr: 'Budget hebdo', ar: 'الميزانية الأسبوعية', en: 'Weekly budget' },
  your_people: { fr: 'Personnes', ar: 'الأشخاص', en: 'People' },
  your_meals: { fr: 'Repas / jour', ar: 'وجبات / يوم', en: 'Meals / day' },
  regenerate: { fr: 'Régénérer (mêmes réglages)', ar: 'إعادة التوليد (نفس الإعدادات)', en: 'Regenerate (same settings)' },
  new_cycle: { fr: 'Nouveau cycle', ar: 'دورة جديدة', en: 'New cycle' },
  new_cycle_sub: { fr: 'choisir la durée & refaire le budget', ar: 'اختيار المدة وإعادة الميزانية', en: 'choose duration & redo budget' },
  reset_all: { fr: 'Tout recommencer', ar: 'إعادة كل شيء', en: 'Start over' },
  reset_all_sub: { fr: 'magasin, budget, préférences…', ar: 'المتجر، الميزانية، التفضيلات…', en: 'store, budget, preferences…' },
  reset_confirm_title: { fr: 'Tout recommencer ?', ar: 'إعادة كل شيء ؟', en: 'Start over?' },
  reset_confirm_body: { fr: 'On efface ton plan actuel et tes réglages, puis on refait le questionnaire depuis le début. Ton compte est conservé.', ar: 'سنمسح خطتك وإعداداتك الحالية ونعيد الاستبيان من البداية. سيتم الاحتفاظ بحسابك.', en: "We'll erase your current plan and settings, then redo the questionnaire from the start. Your account is kept." },
  cancel: { fr: 'Annuler', ar: 'إلغاء', en: 'Cancel' },
  confirm: { fr: 'Oui, recommencer', ar: 'نعم، إعادة', en: 'Yes, start over' },
  cycle_ended_title: { fr: 'ton cycle est terminé', ar: 'انتهت دورتك', en: 'your cycle has ended' },
  cycle_new_cta: { fr: 'Commencer un nouveau cycle', ar: 'ابدأ دورة جديدة', en: 'Start a new cycle' },
  logout: { fr: 'Se déconnecter', ar: 'تسجيل الخروج', en: 'Log out' },
  save: { fr: 'Enregistrer', ar: 'حفظ', en: 'Save' },
  max3: { fr: "jusqu'à 3", ar: 'حتى 3', en: 'up to 3' },
}

/** "1 semaine" / "3 semaines" localized. */
export function durationLabel(weeks: number, lang: Lang): string {
  if (weeks <= 1) return STRINGS.duration_1[lang] ?? STRINGS.duration_1.fr
  return `${weeks} ${STRINGS.duration_n[lang] ?? STRINGS.duration_n.fr}`
}

export const TAG_LABELS: Record<Tag, Loc> = {
  rapide: { fr: 'rapide', ar: 'سريع', en: 'quick' },
  proteine: { fr: 'protéiné', ar: 'بروتيني', en: 'protein' },
  healthy: { fr: 'healthy', ar: 'صحي', en: 'healthy' },
  du_monde: { fr: 'international', ar: 'عالمي', en: 'world cuisine' },
  gourmand: { fr: 'gourmand', ar: 'شهي', en: 'indulgent' },
  famille: { fr: 'en famille', ar: 'عائلي', en: 'family' },
  vegetarien: { fr: 'végé', ar: 'نباتي', en: 'veggie' },
}

export const AMBIANCE: { id: Tag; label: Loc; emoji: string; bg: string }[] = [
  { id: 'rapide', label: { fr: 'Rapide & facile', ar: 'سريع وسهل', en: 'Quick & easy' }, emoji: '⚡️', bg: '#fbe7a1' },
  { id: 'proteine', label: { fr: 'Riche en protéines', ar: 'غني بالبروتين', en: 'High protein' }, emoji: '💪', bg: '#f9c9d6' },
  { id: 'famille', label: { fr: 'En famille', ar: 'مع العائلة', en: 'Family style' }, emoji: '👨‍👩‍👧', bg: '#c8dcf2' },
  { id: 'healthy', label: { fr: 'Healthy', ar: 'صحي', en: 'Healthy' }, emoji: '🥗', bg: '#c8e6b6' },
  { id: 'gourmand', label: { fr: 'Gourmand', ar: 'شهي', en: 'Indulgent' }, emoji: '😋', bg: '#f7cadb' },
  { id: 'du_monde', label: { fr: 'International', ar: 'مأكولات عالمية', en: 'World cuisine' }, emoji: '🌍', bg: '#d9cff0' },
]

export const MEAL_LABELS: Record<MealType, Loc> = {
  petit_dejeuner: { fr: 'Petit-déjeuner', ar: 'فطور', en: 'Breakfast' },
  casse_croute: { fr: 'Casse-croûte', ar: 'وجبة خفيفة', en: 'Snack' },
  dejeuner: { fr: 'Déjeuner', ar: 'غداء', en: 'Lunch' },
  gouter: { fr: 'Goûter', ar: 'وجبة العصر', en: 'Snack' },
  diner: { fr: 'Dîner', ar: 'عشاء', en: 'Dinner' },
  encas: { fr: 'En-cas', ar: 'سناك', en: 'Snack' },
}

export const MEAL_EMOJI: Record<MealType, string> = {
  petit_dejeuner: '🥐', casse_croute: '🥪', dejeuner: '🍽️', gouter: '🍎', diner: '🌙', encas: '🍿',
}

export const DIETS: { id: string; label: Loc; emoji: string }[] = [
  { id: 'aucun', label: { fr: 'Aucun', ar: 'لا شيء', en: 'None' }, emoji: '' },
  { id: 'vegetarien', label: { fr: 'Végétarien', ar: 'نباتي', en: 'Vegetarian' }, emoji: '🥕' },
  { id: 'pescetarien', label: { fr: 'Pescétarien', ar: 'نباتي + سمك', en: 'Pescatarian' }, emoji: '🐟' },
  { id: 'sans_gluten', label: { fr: 'Sans gluten', ar: 'بدون غلوتين', en: 'Gluten-free' }, emoji: '🌾' },
  { id: 'sans_lactose', label: { fr: 'Sans lactose', ar: 'بدون لاكتوز', en: 'Lactose-free' }, emoji: '🥛' },
  { id: 'enceinte', label: { fr: 'Femme enceinte', ar: 'حامل', en: 'Pregnant' }, emoji: '🤰' },
]

export const EQUIPMENT: { id: Equipment; label: Loc; icon: string }[] = [
  { id: 'four', label: { fr: 'Four', ar: 'فرن', en: 'Oven' }, icon: 'oven' },
  { id: 'plaque', label: { fr: 'Plaque', ar: 'موقد', en: 'Hob' }, icon: 'stove' },
  { id: 'air_fryer', label: { fr: 'Air fryer', ar: 'قلاية هوائية', en: 'Air fryer' }, icon: 'airfryer' },
  { id: 'grill', label: { fr: 'Gril', ar: 'شواية', en: 'Grill' }, icon: 'grill' },
  { id: 'mijoteuse', label: { fr: 'Mijoteuse', ar: 'طنجرة بطيئة', en: 'Slow cooker' }, icon: 'pot' },
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
    if (!s) return key
    // English falls back to French when no specific English string is set
    if (lang === 'en') return s.en ?? s.fr
    return s[lang] ?? s.fr
  }
}
