# Handoff : FORMA — Application de coaching fitness

## Overview
FORMA est une application mobile de coaching fitness à **3 rôles** :
- **Manageur** (admin) : génère des codes d'accès pour les coachs et les élèves, choisit leur durée, et voit les abonnements (coachs / élèves).
- **Coach** : se connecte avec un code du manageur, gère ses élèves, crée des programmes (assistant « IA » en 5 étapes), une bibliothèque de repas, des templates de programme, une messagerie.
- **Élève** : se connecte avec un code fourni par son coach ou le manageur, suit son programme, ses repas, saisit son poids/photos, discute avec son coach.

Le tout est multilingue (FR / EN / ES / AR avec RTL).

## About the Design Files
Les fichiers de ce bundle sont des **références de design réalisées en HTML** — un prototype qui montre l'apparence et le comportement voulus, **pas du code de production à copier tel quel**. La tâche est de **recréer ces écrans dans l'environnement cible** (React Native / Flutter / web React…) en suivant ses conventions, avec un **vrai backend**. Un dossier `FORMA_MVP_Flutter` existe déjà dans le projet : Flutter est donc un choix cohérent, mais l'important est la logique et les écrans décrits ici.

Le prototype est un **Design Component** (`.dc.html`) : un moteur maison rend un `<x-dc>` (template) + une classe `Component` (logique). **Ne pas** essayer de réutiliser ce moteur ; lire le template et la classe comme une **spécification**.

## Fidelity
**Haute fidélité (hifi)** : couleurs, typographie, espacements et interactions sont définitifs. Recréer l'UI au pixel près avec les composants de la codebase cible. Les données sont fictives (mock) — à remplacer par de vraies données via API.

## Rôles & authentification (cœur du produit)
- **Code manageur maître** : `2006117` (en dur dans le proto — à remplacer par une vraie auth admin).
- **Génération de codes** (écran Manageur) : on choisit le type (COACH ou ÉLÈVE) + une durée (7 / 30 / 90 / 180 / 365 jours), puis « Générer ». Format : `FORMA-COACH-XXXX` ou `FORMA-ELV-XXXX` (4 caractères A-Z/2-9). Les codes générés par le **coach** via l'assistant « Nouvel élève » ont le format `FORMA-EL-XXXX-{durée}J`.
- **Règles d'accès à implémenter côté serveur** :
  - Un **coach** ne peut se connecter **qu'avec un code COACH généré par le manageur**.
  - Un **élève** ne peut se connecter **qu'avec un code ÉLÈVE généré par le coach OU le manageur**.
  - À la 1re utilisation, un code crée le compte correspondant et devient « utilisé ».
- **1re connexion coach** : formulaire nom + numéro WhatsApp (visibles par le manageur).
- **1re connexion élève (onboarding)** : prénom, poids, taille (cm), WhatsApp — visibles par le coach dans la fiche élève.
- **« Se souvenir de moi »** : persistance de session (proto : `localStorage['forma_auth']`).
- **Déconnexion** disponible dans chaque rôle → retour à l'écran de connexion (choix du profil).

## Screens / Views
> Chaque écran du proto porte un attribut `data-screen-label` pour l'identifier.

**Connexion** — choix du profil (Coach / Élève / Manageur), champ code, « Se souvenir de moi », sélecteur de langue.

**Manageur — Génération de codes** — en-tête + bouton Quitter ; sélecteur Type (COACH/ÉLÈVE) ; puces de durée ; bouton Générer ; carte du dernier code (Copier / WhatsApp / fermer ✕) ; liste des codes générés (copier / supprimer / Tout effacer) ; onglet coulissant **Abonnements [ Coachs | Élèves ]** montrant nom + jours restants (+ WhatsApp pour les coachs).

**Coach — Mes élèves** — liste des élèves avec badge d'état (Alerte 48h / À surveiller / À jour), mini-courbe de poids colorée, tendance. État vide + tutoriel.

**Coach — Fiche élève** — infos élève (taille, WhatsApp), courbe de poids (couleur selon progression), analyse « IA », bilan hebdo (2 lignes : entraînement / repas), abonnement (+30 j), relance WhatsApp, notes privées, suppression.

**Coach — Nouvel élève (assistant 5 étapes)** — durée d'abo → jours d'entraînement → objectif (prise de muscle / masse / perte / poids) → programme (séances, séries, reps) → génération du code élève à partager.

**Coach — Bibliothèque de repas** — repas caloriques / légers (100 repas d'exemple) avec kcal + protéines, ajout de repas, recette générée (ingrédients, épices, étapes).

**Coach — Templates** — programmes réutilisables : appliquer, **modifier** (ré-enregistre le template, **ne génère pas** de code), supprimer, + nouveau (bouton toujours présent, même liste vide).

**Coach — Profil** — nom + WhatsApp **éditables à tout moment** (se répercutent chez le manageur), stats, langue, déconnexion.

**Coach / Élève — Messagerie** — fils de discussion par élève.

**Élève — Onboarding** — prénom, poids, taille, WhatsApp, photo « avant ».

**Élève — Accueil** — salutation (prénom), rappel quotidien, série (streak), coches du jour (entraînement / repas : Oui-Non), programme du jour.

**Élève — Objectif / Repas / Progrès** — programme du coach ; repas filtrables ; saisie de poids/mensurations, historique, courbe, photos avant/après, chrono de repos, rappels + notification test.

## Interactions & Behavior
- Navigation par barre d'onglets basse (5 onglets coach, 5 onglets élève).
- Modale de confirmation générique (icône, message, Annuler / bouton d'action ; variante « soft » verte pour la déconnexion, rouge pour les suppressions).
- Toasts en bas.
- Ouverture de `wa.me/<numéro>?text=...` pour WhatsApp.
- `window.Notification` pour la notification de test.
- Onboarding et setup coach s'affichent en plein écran tant qu'ils ne sont pas complétés (pas d'accès au reste avant).

## State Management
État clé (proto en mémoire, à porter côté backend + store) : `auth` (null/coach/student/manager), `mgrCodes[]` (code, role, days, used), `coachCodes[]`, `coaches[]`, `students[]` (avec `weights[]`, `checks[][]`, `subEnd`, `height`, `whatsapp`, `prenom`…), `templates[]`, `meals[]`, `threads{}`, `weightHistory[]`, `lang`, `rememberMe`, `currentCoachId`, `currentStudentId`, `studentProfile`.
Transitions notables : login → crée/associe un compte via le code ; onboarding/finishCoachSetup → écrit le profil ; générer un programme → crée un code élève.

## À brancher (ce qui manque pour la prod)
- Backend + base de données (comptes, codes, élèves, abos partagés entre appareils).
- Auth réelle + sécurité des codes (expiration, usage unique, révocation).
- Paiement des abonnements, notifications push, intégration WhatsApp Business.
- Upload réel des photos avant/après.

## Design Tokens
- **Fond** : `#07080B` (desk), `#0D0F13` (app), surfaces `#15181E`, `#1A1E24`.
- **Texte** : `#F2F4EE` ; atténué `rgba(242,244,238,0.45–0.7)`.
- **Accent (principal)** : `#4F7DD1` (bleu acier) ; ombre/gradient `#3A5EA3` ; teintes `rgba(79,125,209,α)`. Texte sur accent : `#0D0F13`.
- **Sémantique (NE PAS confondre avec l'accent)** : rouge `#FF5938` (suppression/alerte), ambre `#FFB43C` (à surveiller), vert `#7BD957` (bonne progression). Les **courbes de poids** utilisent rouge/ambre/vert selon l'analyse.
- **Bordures** : `rgba(255,255,255,0.06–0.1)`. **Radius** : 8–22px. **Police** : `Space Grotesk` (Google Fonts).

## Assets
Aucune image externe : icônes en SVG inline, quelques emojis. Police `Space Grotesk` via Google Fonts. Prévoir de vrais visuels (photos élèves, avatars) côté prod.

## Files
- `FORMA - Appli Coach (interactive).dc.html` — le prototype complet (template + logique). **Fichier de référence principal.**
- `support.js` — moteur du Design Component (contexte uniquement, à NE PAS porter).
