/* =========================================================
   commande.js — Formulaire de commande et paiement simulé
   ---------------------------------------------------------
   1. Si le panier est vide, on renvoie vers la collection.
   2. On affiche le récapitulatif.
   3. À l'envoi du formulaire, on vérifie chaque champ
      (validation côté client) et on affiche nos messages.
   4. Si tout est bon, on simule l'appel à une banque
      (attente de 1,5 s), puis on affiche la confirmation.

   ⚠️ Dans un vrai site, le paiement passerait par un
   prestataire (CMI au Maroc, Stripe…) et le numéro de carte
   ne toucherait jamais notre code.
   ========================================================= */

const zone = document.getElementById('zone-commande');
const formulaire = document.getElementById('formulaire');

/* ---------- 1. Panier vide ---------- */
if (detailPanier().lignes.length === 0) {
  zone.innerHTML =
    '<div class="etat-vide" style="margin:60px 0 80px">' +
      '<h1 style="font-size:2rem">Aucun article à commander</h1>' +
      '<p class="texte-doux">Votre panier est vide.</p>' +
      '<a class="btn btn-or" href="catalogue.html">Voir la collection</a>' +
    '</div>';
} else {
  afficherRecap();
  brancherFormulaire();
}

/* ---------- 2. Récapitulatif ---------- */
function afficherRecap() {
  const d = detailPanier();
  const articles = d.lignes.map(function (l) {
    return '<li><span>' + echapperHTML(l.produit.nom) + ' × ' + l.quantite + '</span><span>' + formaterPrix(l.total) + '</span></li>';
  }).join('');
  document.getElementById('recap').innerHTML =
    '<h2>Votre commande</h2>' +
    '<ul class="recap-articles">' + articles + '</ul>' +
    '<div class="recap-ligne"><span>Sous-total</span><span>' + formaterPrix(d.sousTotal) + '</span></div>' +
    '<div class="recap-ligne"><span>Livraison</span><span>' + (d.livraison ? formaterPrix(d.livraison) : 'Offerte') + '</span></div>' +
    '<div class="recap-ligne total"><span>Total</span><span>' + formaterPrix(d.total) + '</span></div>' +
    '<a class="btn-lien" href="panier.html" style="display:block;text-align:center">Modifier le panier</a>';
}

/* ---------- 3. Règles de validation ---------- */

// Algorithme de Luhn : la vraie vérification mathématique utilisée par
// toutes les cartes bancaires pour détecter une faute de frappe.
// On double un chiffre sur deux en partant de la droite ; si le résultat
// dépasse 9 on retire 9 ; la somme totale doit être un multiple de 10.
function numeroCarteValide(numero) {
  const chiffres = numero.replace(/\D/g, '');
  if (chiffres.length < 13 || chiffres.length > 19) return false;
  let somme = 0;
  for (let i = 0; i < chiffres.length; i++) {
    let n = parseInt(chiffres[chiffres.length - 1 - i], 10);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    somme += n;
  }
  return somme % 10 === 0;
}

// "08/28" → valide si le mois existe et que la date n'est pas passée.
function expirationValide(valeur) {
  const m = valeur.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const mois = parseInt(m[1], 10);
  const annee = 2000 + parseInt(m[2], 10);
  if (mois < 1 || mois > 12) return false;
  const finDuMois = new Date(annee, mois, 0, 23, 59);  // jour 0 du mois suivant = dernier jour du mois
  return finDuMois >= new Date();
}

// Chaque règle renvoie true si le champ est correct.
// Les expressions régulières (/…/) décrivent le format attendu.
const REGLES = {
  nom: function (v) { return v.trim().length >= 3 && v.trim().indexOf(' ') > 0; },
  telephone: function (v) { return /^(\+212|0)[5-7]\d{8}$/.test(v.replace(/[\s.-]/g, '')); },
  email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
  adresse: function (v) { return v.trim().length >= 6; },
  ville: function (v) { return v !== ''; },
  carte: numeroCarteValide,
  expiration: expirationValide,
  cvc: function (v) { return /^\d{3,4}$/.test(v); }
};

function paiementParCarte() {
  return formulaire.elements.paiement.value === 'carte';
}

// Vérifie un champ, affiche ou cache son message d'erreur, renvoie true/false.
function verifierChamp(nom) {
  const champ = formulaire.elements[nom];
  const groupe = champ.closest('.groupe-champ');
  const valide = REGLES[nom](champ.value);
  groupe.classList.toggle('erreur', !valide);
  champ.setAttribute('aria-invalid', !valide);   // pour les lecteurs d'écran
  return valide;
}

/* ---------- 4. Comportement du formulaire ---------- */
function brancherFormulaire() {
  const elCarte = document.getElementById('carte');
  const elExpiration = document.getElementById('expiration');
  const elCvc = document.getElementById('cvc');

  // Mise en forme automatique pendant la saisie : "4242424242424242" → "4242 4242 4242 4242".
  elCarte.addEventListener('input', function () {
    const chiffres = elCarte.value.replace(/\D/g, '').slice(0, 16);
    elCarte.value = chiffres.replace(/(\d{4})(?=\d)/g, '$1 ');
  });
  // "0828" → "08/28"
  elExpiration.addEventListener('input', function () {
    const chiffres = elExpiration.value.replace(/\D/g, '').slice(0, 4);
    elExpiration.value = chiffres.length > 2 ? chiffres.slice(0, 2) + '/' + chiffres.slice(2) : chiffres;
  });
  elCvc.addEventListener('input', function () {
    elCvc.value = elCvc.value.replace(/\D/g, '').slice(0, 4);
  });

  // Afficher / cacher les champs de carte selon le mode de paiement.
  formulaire.addEventListener('change', function (e) {
    if (e.target.name === 'paiement') {
      document.getElementById('bloc-carte').hidden = !paiementParCarte();
      document.getElementById('bouton-payer').textContent = paiementParCarte() ? 'Payer ' + formaterPrix(detailPanier().total) : 'Confirmer la commande';
    }
  });
  document.getElementById('bouton-payer').textContent = 'Payer ' + formaterPrix(detailPanier().total);

  // Un champ signalé en erreur est revérifié à chaque frappe : le message
  // disparaît dès que la saisie est correcte.
  // (On évite de le faire au moment où l'on quitte le champ : le message qui
  // disparaît ferait bouger le bouton "Payer" pendant le clic, et le clic raterait.)
  function reverifierSiErreur(e) {
    const nom = e.target.name;
    if (REGLES[nom] && e.target.closest('.groupe-champ.erreur')) verifierChamp(nom);
  }
  formulaire.addEventListener('input', reverifierSiErreur);
  formulaire.addEventListener('change', reverifierSiErreur);   // pour la liste des villes

  formulaire.addEventListener('submit', function (e) {
    e.preventDefault();   // empêche le rechargement de la page

    let aVerifier = ['nom', 'telephone', 'email', 'adresse', 'ville'];
    if (paiementParCarte()) aVerifier = aVerifier.concat(['carte', 'expiration', 'cvc']);

    // map() vérifie TOUS les champs (pour afficher toutes les erreurs d'un coup),
    // puis indexOf(false) cherche s'il y en a au moins une.
    const resultats = aVerifier.map(verifierChamp);
    const premierInvalide = resultats.indexOf(false);
    if (premierInvalide !== -1) {
      formulaire.elements[aVerifier[premierInvalide]].focus();
      afficherToast('Merci de corriger les champs en rouge.');
      return;
    }

    simulerPaiement();
  });
}

/* ---------- 5. Paiement simulé et confirmation ---------- */
function simulerPaiement() {
  const bouton = document.getElementById('bouton-payer');
  bouton.disabled = true;
  bouton.innerHTML = '<span class="chargement" aria-hidden="true"></span> Traitement en cours…';

  // setTimeout imite le temps de réponse d'une banque.
  setTimeout(function () {
    const d = detailPanier();
    const client = {
      nom: formulaire.elements.nom.value.trim(),
      ville: formulaire.elements.ville.value
    };
    // Numéro de commande lisible : AUR- + 6 caractères tirés de la date.
    const numero = 'AUR-' + Date.now().toString(36).toUpperCase().slice(-6);
    const parCarte = paiementParCarte();
    const messageSuivi = 'Bonjour ' + CONFIG.nomBoutique + ', je viens de passer la commande ' + numero +
      ' (' + formaterPrix(d.total) + '). Pouvez-vous me confirmer l\'expédition ?';

    viderPanier();
    window.scrollTo(0, 0);
    zone.innerHTML =
      '<section class="confirmation">' +
        '<div class="coche"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
        '<p class="surtitre">Merci ' + echapperHTML(client.nom.split(' ')[0]) + '</p>' +
        '<h1 style="font-size:2.6rem">Commande confirmée</h1>' +
        '<p class="numero-commande">N° ' + numero + '</p>' +
        '<p class="texte-doux">' +
          (parCarte ? 'Votre paiement de ' + formaterPrix(d.total) + ' a été accepté (simulation).'
                    : 'Vous réglerez ' + formaterPrix(d.total) + ' au livreur, à la réception.') +
          ' Votre montre sera livrée à ' + echapperHTML(client.ville) + ' sous 24 à 72 h.' +
        '</p>' +
        '<div class="hero-boutons" style="justify-content:center;margin-top:28px">' +
          '<a class="btn btn-whatsapp" href="' + lienWhatsApp(messageSuivi) + '" target="_blank" rel="noopener">' + ICONES.whatsapp + 'Suivre sur WhatsApp</a>' +
          '<a class="btn btn-contour" href="catalogue.html">Continuer mes achats</a>' +
        '</div>' +
      '</section>';
    document.title = 'Commande confirmée — ' + CONFIG.nomBoutique;
  }, 1500);
}
