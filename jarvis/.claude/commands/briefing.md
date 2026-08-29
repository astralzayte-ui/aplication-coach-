# Commande : Briefing quotidien Jarvis

Lance le briefing complet dans cet ordre exact. Ne saute aucune section.

---

## 1. VENTES
Si la boutique est connectée, affiche les ventes depuis hier.
Si pas connectée, écris : "Boutique non connectée — à configurer."

## 2. PUB META ADS
Utilise l'outil Meta Ads pour récupérer :
- Dépenses publicitaires des dernières 24h
- ROAS (retour sur dépense pub)
- Alertes si une campagne dépense sans résultat ou si le ROAS est en baisse

Si aucune campagne active, écris : "Aucune campagne active."

## 3. MESSAGES CLIENTS
Résume les messages WhatsApp ou clients en attente.
NE réponds à aucun message. Résume uniquement.
Si pas connecté : "WhatsApp non connecté — à configurer."

## 4. EMPLOI DU TEMPS
Affiche les événements du jour depuis le calendrier si connecté.
Sinon : "Calendrier non connecté."

## 5. SUGGESTIONS D'ACTIVITÉS
Lis le fichier jarvis/activites.md.
Selon l'heure actuelle :
- 7h–12h → suggestions du matin
- 12h–18h → suggestions de l'après-midi
- 18h–22h → suggestions du soir
Propose 2 à 3 activités concrètes.

## 6. EN ATTENTE DE VALIDATION
Liste tout ce que les agents ont préparé et qui n'est pas encore validé :
- Vidéos créées par l'agent Création
- Réponses clients rédigées
- Sites en test prêts pour mise en production

Si rien en attente : "Rien en attente de validation. ✅"

---

Termine toujours par :
"Bonne journée ! Dis-moi sur quoi tu veux qu'on attaque en premier."
