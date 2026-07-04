# Choix techniques — FORMA

> Ce document explique, **en mots simples**, les technologies choisies pour construire
> l'application FORMA et la publier sur l'App Store (iPhone) et le Google Play Store (Android).
> Tu n'as **rien à décider ici** : tout est déjà tranché. C'est juste pour que tu saches ce qui a été fait.

## En une phrase
On construit **une seule application** qui marche sur iPhone **et** Android, reliée à un
**service en ligne sécurisé** qui garde les comptes, les codes et les données.

---

## 1. L'application (ce que les gens installent sur leur téléphone)

**Choix : React Native + Expo (avec TypeScript).**

Pourquoi :
- **Un seul code pour les 2 stores** : on écrit l'app une fois, elle tourne sur iPhone et Android. Pas besoin de tout faire deux fois.
- **Expo** simplifie énormément la publication : il fabrique les fichiers `.ipa` (Apple) et `.aab` (Google) **dans le cloud**, donc **pas besoin d'un Mac** pour compiler l'app iPhone.
- **Notifications push**, **stockage sécurisé** (pour « se souvenir de moi »), **photos**, **multilingue + arabe à l'envers (RTL)** sont tous supportés d'origine.
- C'est l'une des deux options que tu as citées, et la plus simple à publier.

Outils précis :
- **Expo Router** pour naviguer entre les écrans.
- **i18next** pour les 4 langues (FR / EN / ES / AR) avec l'arabe en RTL.
- **expo-secure-store** pour garder la session en sécurité (« se souvenir de moi »).
- **expo-notifications** pour le rappel quotidien de l'élève.

## 2. Le service en ligne (le « cerveau » sécurisé, invisible pour l'utilisateur)

**Choix : Supabase.**

Pourquoi :
- C'est un service **géré** : la base de données, les comptes et la sécurité sont hébergés et sauvegardés pour nous. Pas de serveur à administrer soi-même.
- Il repose sur **PostgreSQL**, une base de données très fiable et éprouvée.
- **Sécurité par ligne (Row Level Security)** : la base elle-même garantit que **chaque utilisateur ne voit que SES données** — un élève ne peut pas voir un autre élève, un coach ne voit que ses élèves. Cette règle est appliquée par le serveur, **impossible à contourner depuis le téléphone**.
- **Fonctions serveur (Edge Functions)** pour les opérations sensibles (créer un compte à partir d'un code, vérifier un code, supprimer un compte). La vérification des codes se fait **là, côté serveur**, jamais sur le téléphone.
- **Stockage de fichiers** pour les photos « avant / après ».
- **Réinitialisation de mot de passe** et **limite d'essais (anti-piratage)** intégrées.
- Niveau gratuit suffisant pour démarrer et tester.

## 3. Comment on garde tout ça en sécurité

- Les **codes d'accès sont hachés** (transformés en empreinte illisible) dans la base : même en cas de fuite, on ne peut pas les relire.
- **Aucune clé secrète n'est écrite dans l'application.** L'app ne connaît que la clé « publique » (sans danger). Les clés sensibles restent sur le serveur.
- Toute règle importante (code valide ? bon rôle ? pas expiré ? déjà utilisé ? droit de voir cette donnée ?) est vérifiée **côté serveur**.
- **Limite d'essais** sur la connexion pour empêcher quelqu'un d'essayer des milliers de codes.

## 4. Comment on publie sur les stores (plus tard, quand tu diras « c'est opey »)

- **EAS Build** (l'outil d'Expo) fabrique les fichiers pour Apple et Google dans le cloud.
- **EAS Submit** les envoie automatiquement vers **App Store Connect** (Apple) et la **Google Play Console**.
- Je te guiderai **une action à la fois**, avec des mots simples et en attendant ta confirmation à chaque étape.

---

## Résumé ultra-court

| Besoin | Choix |
|---|---|
| L'app (iPhone + Android) | **React Native + Expo** |
| Base de données + comptes + sécurité | **Supabase (PostgreSQL)** |
| Chaque utilisateur ne voit que ses données | **Row Level Security** (règle appliquée par le serveur) |
| Vérification des codes | **Côté serveur** (Edge Functions + fonctions SQL) |
| Rester connecté | **expo-secure-store** (« se souvenir de moi ») |
| Notifications | **expo-notifications** |
| 4 langues + arabe RTL | **i18next** |
| Publication sur les stores | **EAS Build + EAS Submit** |
