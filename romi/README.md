# Romi 🥗 — appli de repas de la semaine (web-app / PWA)

Romi prépare les repas de la semaine adaptés au **budget**, au **magasin** (Maroc),
au **nombre de personnes**, aux **envies**, aux **besoins alimentaires / allergies**
et à **l'équipement de cuisine** de l'utilisateur — puis génère la **liste de courses
chiffrée** par magasin. **Essai gratuit de 7 jours**, puis paiement manuel via **WhatsApp**.

C'est une **web-app installable** (PWA) : l'utilisateur peut l'ajouter à son écran
d'accueil (logo « R »).

## Démarrer

```bash
cd romi
npm install
npm run dev        # développement (http://localhost:5173)
npm run build      # build de production -> dist/
npm run preview    # prévisualiser le build
```

> Les icônes PWA sont dans `public/`. Pour les régénérer depuis le logo :
> `node scripts/gen-icons.mjs` (nécessite Playwright).

## ⚙️ À personnaliser (`src/config.ts`)

- `SUPPORT_WHATSAPP` — **ton numéro WhatsApp** (format international, sans `+`).
  C'est lui qu'ouvre le bouton « Payer via WhatsApp » à la fin de l'essai, pour
  que le client te contacte et que tu lui envoies ton **RIB**.
- `BUDGET_MIN` / `BUDGET_MAX` / `BUDGET_DEFAULT` — fourchette du budget hebdo (DH).

## Parcours

1. **Compte** : numéro de téléphone + mot de passe
2. **Onboarding** : magasin → budget (DH) → personnes → ambiance (jusqu'à 3) →
   besoins alimentaires + allergies → repas par jour → équipement cuisine
3. **Écran de chargement** (marque Romi)
4. **Plan de la semaine** : cartes par jour (photo, nom, prix, personnes, temps, tags)
5. **Détail plat** : macros (protéines/glucides/lipides/kcal), prix, temps, allergènes,
   ingrédients, bouton **Changer** (swap)
6. **Liste de courses** : groupée par rayon, **prix exacts selon le magasin**,
   cases à cocher, **partage** (WhatsApp/natif) + **Copier**
7. **Frigo** : ajoute ce que tu as → propositions de plats faciles
8. **Semaines suivantes** verrouillées (cadenas) pendant l'essai
9. **Fin d'essai** : notification + écran paywall → **WhatsApp**

## Logique des 7 jours gratuits

- Compte créé **lundi/mardi** → plan pour **le reste de la semaine** (jusqu'à dimanche).
- Compte créé **mercredi → dimanche** → **7 jours pleins** (pour avoir de la marge).
- L'essai dure **7 jours** ; à la fin, notification + accès premium via WhatsApp.

## Langues

**Français** et **العربية** (avec mise en page **RTL** complète). Bascule dans
l'écran de connexion et dans les réglages.

## Bilingue & multi-magasins (Maroc)

Magasins : **Marjane, Carrefour, Carrefour Market, BIM**. Les prix de la liste de
courses sont recalculés selon le magasin choisi (BIM = hard discount, etc.).

## Statut

Maquette **100 % fonctionnelle** avec données locales (recettes, prix, macros).
Comptes/plan/liste sont persistés en `localStorage`. À brancher pour la prod :
backend (comptes multi-appareils), vraies photos de plats, notifications push,
suivi des abonnements/paiements.
