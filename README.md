# ONYX — Boutique de Montres & Bijoux pour Homme

Boutique en ligne de dropshipping haut de gamme (noir & or), trilingue **Français / Anglais / Arabe** (avec affichage de droite à gauche pour l'arabe). Le client paie sur la boutique, tu passes la commande sur AliExpress qui livre le client.

Site construit avec **Next.js** — gratuit à héberger sur **Vercel**, paiement prévu via **YouCan Pay**.

---

## 🚀 Lancer le site sur ton ordinateur (facultatif)

```bash
npm install
node scripts/gen-placeholders.mjs   # images d'exemple (à faire une seule fois)
npm run dev
```

Puis ouvre http://localhost:3000

---

## 🛍️ Ajouter un produit (le plus important)

**Tout se passe dans un seul fichier : `data/products.js`**

### Étape 1 — Mettre les photos
Crée un dossier dans `public/products/` au nom de ton produit, et mets **une photo par couleur** :

```
public/products/ma-chaine/or.jpg
public/products/ma-chaine/argent.jpg
public/products/ma-chaine/noir.jpg
```

> Astuce : des photos **carrées** (ex. 1000×1000 px) sur fond sombre rendent le mieux.

### Étape 2 — Décrire le produit
Ouvre `data/products.js` et copie un bloc existant. Exemple :

```js
{
  slug: "ma-chaine",                 // identifiant dans l'URL (sans espace ni accent)
  category: "bijoux",                // "montres" ou "bijoux"
  name: { fr: "Chaîne ONYX", en: "ONYX Chain", ar: "سلسلة ONYX" },
  description: { fr: "…", en: "…", ar: "…" },
  price: 59,
  currency: "EUR",                   // ou "MAD", "USD"…
  featured: false,                   // true = mise en avant sur l'accueil
  colors: [
    { id: "or",     label: { fr: "Or",     en: "Gold",   ar: "ذهبي" }, swatch: "#C6A15B", image: "/products/ma-chaine/or.jpg" },
    { id: "argent", label: { fr: "Argent", en: "Silver", ar: "فضي"  }, swatch: "#B9BEC6", image: "/products/ma-chaine/argent.jpg" },
  ],
  sizes: ["45cm", "55cm"],           // laisse [] s'il n'y a pas de taille
},
```

C'est tout ! Le produit apparaît dans sa catégorie, avec le **changement de photo au clic sur la couleur** et le choix de la taille.

---

## 🌍 Mettre le site en ligne (gratuit, ~5 min)

1. Crée un compte sur **https://vercel.com** (connecte-le à GitHub).
2. Clique **Add New → Project**, choisis ce dépôt GitHub.
3. Vercel détecte Next.js tout seul → clique **Deploy**.
4. Ton site est en ligne avec une adresse `…vercel.app` et le HTTPS (cadenas) inclus.

À chaque fois que tu modifies un produit et que tu pousses sur GitHub, le site se met à jour **automatiquement**.

### Nom de domaine (facultatif)
Dans Vercel : **Settings → Domains → Add**, puis suis les instructions pour relier ton `onyx….com`.

---

## 💳 Activer le paiement YouCan Pay (quand ta société est prête)

1. Crée ton compte marchand sur **https://youcanpay.com** et récupère tes clés dans **Paramètres → Clés API**.
2. Dans Vercel : **Settings → Environment Variables**, ajoute :
   - `YOUCAN_PRIVATE_KEY` → ta clé privée (secrète)
   - `NEXT_PUBLIC_YOUCAN_PUBLIC_KEY` → ta clé publique
   - `YOUCAN_MODE` → `sandbox` (tests) puis `production`
3. Dans `app/api/checkout/route.js`, décommente le bloc **PAIEMENT YOUCAN PAY**.
4. Redéploie. Le paiement par carte est actif.

> Tant que le paiement n'est pas configuré, une commande est simplement **enregistrée** (visible dans les logs Vercel) et le client voit un message de confirmation. Idéal pour tester la boutique avant l'ouverture.

---

## 📁 Structure du projet

```
data/products.js          ← ton catalogue (à modifier pour ajouter des produits)
public/products/          ← les photos des produits
lib/i18n.js               ← les traductions FR / EN / AR
app/                      ← les pages du site
  page.js                 · accueil
  montres/ · bijoux/      · pages catégories
  produit/[slug]/         · fiche produit (changement de couleur + taille)
  panier/ · commande/     · panier & paiement
  api/checkout/route.js   · réception des commandes (+ YouCan Pay)
components/               ← en-tête, pied de page, cartes produit…
archive/                  ← ancienne application FORMA (sans rapport, conservée)
```
