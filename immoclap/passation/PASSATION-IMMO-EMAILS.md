# Passation — les e-mails automatiques, pour le projet immobilier

> À coller dans la session Claude Code du **projet immobilier**.
> Écrit le 08/10/2026 depuis le projet vêtements (SILENCE).

---

## Ce qui est déjà prêt

```
L'OUTIL          Brevo, plan GRATUIT — 300 e-mails par jour,
                 PARTAGÉS avec le projet vêtements
L'EXPÉDITEUR     « Immoclap » · contac.immoclapfrance@gmail.com · ✅ vérifié
LA CLÉ           dans les Secrets réseau de l'environnement « Default »
                 (hôte api.brevo.com, en-tête api-key)
                 → Claude appelle https://api.brevo.com/v3/… sans jamais
                   voir la clé. Test : GET /v3/account doit répondre 200.
```

🔴 **Si la session immobilier tourne dans un AUTRE environnement**, la clé
n'y est pas : il faut y ajouter le même secret réseau.

🟠 **Le quota est partagé** : 300 e-mails par jour pour les DEUX projets.
Au-delà, Brevo bloque jusqu'au lendemain.

---

## Ce qu'il faut construire

### 1. L'inscription — l'accord AVANT tout envoi

```
☐  une CASE À COCHER, vide au départ, obligatoire pour s'inscrire
     « J'accepte de recevoir les e-mails d'Immoclap (nouveautés et
       offres). Désinscription en un clic. »  + lien Confidentialité
☐  sans la case cochée, rien n'est envoyé
☐  on garde la PREUVE : l'e-mail + la DATE de l'accord
☐  on ne demande que l'e-mail (rien d'autre n'est nécessaire)
☐  la page Confidentialité dit : quoi, pourquoi, combien de temps,
     Brevo comme prestataire, droit de se désinscrire
```

*Modèle qui marche déjà : le popup du site SILENCE (case obligatoire +
accord daté envoyé avec l'e-mail).*

### 2. Les e-mails, et ce que la loi permet

| L'e-mail | Quand | Accord nécessaire ? |
|---|---|---|
| **Bienvenue** | juste après l'inscription | oui (la case) |
| **Confirmation** de la commande / du rendez-vous | tout de suite | **non** : c'est un e-mail de service |
| **Suivi** (« tout s'est bien passé ? ») | quelques jours après | **non** si c'est du service pur, **oui** dès qu'il y a une offre dedans |
| **Relance / offre** | plus tard | oui — sauf pour un CLIENT déjà existant, et seulement pour un service du même type, avec la désinscription possible à chaque envoi |

```
🔴  chaque e-mail commercial a un lien « se désinscrire » qui marche
🔴  jamais d'e-mail commercial à quelqu'un qui n'a pas coché
🔴  l'expéditeur est clairement Immoclap, l'objet ne trompe pas
```

### 3. Le branchement

```
le formulaire du site  →  l'inscrit est ajouté dans Brevo
                          (POST /v3/contacts, avec la date de l'accord)
après un achat         →  e-mail de confirmation, puis le suivi
                          (POST /v3/smtp/email, expéditeur Immoclap)
```

---

## Avant de mettre en ligne

**Passer le skill `site-legal`** (bloc 5 « les données » et bloc 6 « les
e-mails ») et rendre le verdict 🟢 / 🟠 / 🔴.
