# PROGRESSION — Projet Jarvis

> Dernière mise à jour : 2026-08-29
> Règle : une étape validée avant de passer à la suivante.

---

## Légende
- 🔲 À faire
- 🔄 En cours
- ✅ Validé
- 🚫 Bloqué

---

## Étape 0 — État des lieux (inventaire)
**Statut : ✅ Validé**

- [x] Version Claude Code vérifiée
- [x] Serveurs MCP existants inventoriés
- [x] Contenu du dossier de travail relevé
- [x] Ce fichier PROGRESSION.md créé

---

## Étape 1 — Le socle (structure du projet)
**Statut : ✅ Validé**

- [x] Créer le dossier `jarvis/` avec toute l'arborescence
- [x] Écrire `CLAUDE.md` avec le contexte permanent
- [x] Créer `faq.md` (vide, à remplir)
- [x] Créer `activites.md` (vide, à remplir)
- [x] Créer le dossier `produits/`
- [x] Créer `.claude/agents/` et `.claude/commands/`

---

## Étape 2 — Hostinger (connexion MCP)
**Statut : ✅ Validé**

- [x] MCP Hostinger connecté (déjà dans la session)
- [x] Test : 0 site (normal, pas encore de site créé)
- [x] Test : 0 abonnement (normal, pas encore de site créé)

---

## Étape 3 — Sources de données
**Statut : ✅ Validé**

- [x] Meta Ads — connecté (compte "Wael Wael" actif)
- [x] Higgsfield — connecté (historique générations accessible)
- [x] Boutique — pas de plateforme tierce (sites créés via Claude Code + Hostinger)
- [x] Veille concurrents — via Web Search (Apify à connecter à la demande orale)
- [x] Gmail — skip (communication WhatsApp)

---

## Étape 4 — Accès aux fichiers produits
**Statut : ✅ Validé**

- [x] Convention de nommage définie : `[niche]-[produit]-[type].[ext]`
- [x] Dossier "jarvis produits" créé sur Google Drive
- [x] Accès fichiers : glisser-déposer direct dans le chat (Google Drive à reconnecter en nouvelle session)

---

## Étape 5 — Sous-agents
**Statut : ✅ Validé**

- [x] Agent `veille` créé — Web Search testé ✅
- [x] Agent `creation` créé — Higgsfield testé ✅
- [x] Agent `business` créé — Meta Ads testé ✅

---

## Étape 6 — Service client
**Statut : 🔲 À faire**

- [ ] Système de réponse basé sur `faq.md` préparé
- [ ] Éligibilité WhatsApp Maroc vérifiée
- [ ] Mode : rédaction Jarvis → validation humaine → envoi manuel

---

## Étape 7 — Routine quotidienne
**Statut : 🔲 À faire**

- [ ] Routine configurée (déclenchement automatique)
- [ ] Structure du briefing : ventes / pub / messages / agenda / activités / validations en attente
- [ ] Test manuel de la routine effectué

---

## Étape 8 — Commande `/nouveau-site`
**Statut : 🔲 À faire**

- [ ] Commande créée dans `.claude/commands/`
- [ ] Génération d'un site test complète
- [ ] URL de test en ligne fournie
- [ ] Mise en production uniquement après validation explicite

---

## Garde-fous permanents (rappel)

| Règle | Statut |
|-------|--------|
| Pas de publication automatique sans accord écrit | 🔒 Actif |
| Plafond pub : aucune campagne lancée/modifiée sans seuil fixé | 🔒 Actif |
| Déploiement web : test d'abord, production après validation | 🔒 Actif |
| Messages clients : validation humaine pendant les 2 premières semaines | 🔒 Actif |
| Données douteuses : je transfère, je ne devine pas | 🔒 Actif |
