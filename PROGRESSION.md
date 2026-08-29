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
**Statut : ✅ Validé (en attente de confirmation)**

- [x] Version Claude Code vérifiée
- [x] Serveurs MCP existants inventoriés
- [x] Contenu du dossier de travail relevé
- [x] Ce fichier PROGRESSION.md créé

---

## Étape 1 — Le socle (structure du projet)
**Statut : 🔲 À faire**

- [ ] Créer le dossier `jarvis/` avec toute l'arborescence
- [ ] Écrire `CLAUDE.md` avec le contexte permanent
- [ ] Créer `faq.md` (vide, à remplir)
- [ ] Créer `activites.md` (vide, à remplir)
- [ ] Créer le dossier `produits/`
- [ ] Créer `.claude/agents/` et `.claude/commands/`
- [ ] Vérification : afficher l'arborescence complète

---

## Étape 2 — Hostinger (connexion MCP)
**Statut : 🔲 À faire**

- [ ] Connecter le MCP Hostinger officiel
- [ ] Authentification OAuth validée
- [ ] Test : liste des sites hébergés affichée
- [ ] Test : liste des abonnements affichée

---

## Étape 3 — Sources de données
**Statut : 🔲 À faire**

- [ ] Boutique (Shopify ou équivalent) — ventes
- [ ] Meta Ads — dépenses et ROAS
- [ ] Gmail — emails clients (si applicable)
- [ ] Higgsfield — génération de vidéos
- [ ] Trendtrack — veille concurrents
- [ ] Pour chacun : une vraie donnée affichée comme preuve

---

## Étape 4 — Accès aux fichiers produits
**Statut : 🔲 À faire**

- [ ] Convention de nommage définie et documentée
- [ ] Test : déposer un fichier test et le retrouver
- [ ] Description du fichier test affichée

---

## Étape 5 — Sous-agents
**Statut : 🔲 À faire**

- [ ] Agent `veille` créé (outils : trendtrack, web)
- [ ] Agent `creation` créé (outils : fichiers, Higgsfield)
- [ ] Agent `business` créé (outils : boutique, Meta Ads, calendrier)
- [ ] Test de chaque agent sur une micro-tâche

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
