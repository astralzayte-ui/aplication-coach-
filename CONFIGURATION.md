# Configuration de FORMA (à faire ensemble plus tard)

Rien à installer pour l'instant. Quand tu me diras d'avancer vers la
publication, on fera ces étapes **ensemble, une par une**. Voici le principe.

## 1. Créer le serveur (Supabase)
1. Créer un compte gratuit sur **supabase.com** et un nouveau projet.
2. Récupérer 2 valeurs dans les réglages du projet :
   - l'**URL du projet** (ex. `https://xxxx.supabase.co`),
   - la **clé anon** (clé publique, sans danger).
3. Appliquer la base de données (les fichiers du dossier `supabase/`).

## 2. Relier l'application au serveur
Dans le dossier `app/`, copier `.env.example` en `.env` et coller les 2 valeurs :
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```
👉 Ce sont les **seules** valeurs dans l'app, et elles sont **publiques**.
Les clés sensibles (clé de service, code manager) restent **sur le serveur**.

## 3. Lancer l'app en test
```
cd app
npm install
npx expo start
```
Puis ouvrir avec l'application **Expo Go** sur ton téléphone (QR code).

## 4. Publier sur les stores (le moment venu)
On utilisera **EAS Build** puis **EAS Submit**. Je te guiderai clic par clic
quand tu écriras « c'est opey ».
