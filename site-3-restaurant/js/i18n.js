/* =========================================================
   i18n.js — Traduction français / anglais
   ---------------------------------------------------------
   "i18n" = internationalisation (i + 18 lettres + n).
   Dans le HTML, un texte traduisible porte un attribut
   data-i18n="cle". Au chargement (et quand on change de
   langue), on remplace son contenu par TEXTES[langue][cle].
   La langue choisie est mémorisée dans le navigateur.
   ========================================================= */

const TEXTES = {
  fr: {
    'nav.accueil': 'Accueil', 'nav.menu': 'La carte', 'nav.galerie': 'Galerie', 'nav.reservation': 'Réserver', 'nav.contact': 'Contact',
    'etat.ouvert': 'Ouvert · jusqu\'à {heure}', 'etat.ferme-aujourdhui': 'Fermé · ouvre à {heure}', 'etat.ferme-demain': 'Fermé · ouvre demain à {heure}',
    'etat.ferme-jour': 'Fermé · ouvre {jour} à {heure}',
    'hero.surtitre': 'Cuisine marocaine · Médina de Marrakech',
    'hero.titre': 'Le goût du safran, <em>au cœur de la médina.</em>',
    'hero.texte': 'Un riad du XVIIIe siècle, une cuisine de marché et des recettes transmises de mère en fille. À trois minutes de la place Jemaa el-Fna.',
    'hero.reserver': 'Réserver une table', 'hero.carte': 'Découvrir la carte',
    'maison.surtitre': 'Notre maison', 'maison.titre': 'Une cuisine de famille, dans un riad de famille',
    'maison.texte1': 'Chez Dar Zaafran, tout commence au marché : légumes du matin, épices moulues sur place, pain cuit au four du quartier.',
    'maison.texte2': 'Nos tajines mijotent plusieurs heures sur le charbon, notre couscous est roulé à la main chaque vendredi, et le thé est servi comme on le sert à la maison : à la théière, bien mousseux.',
    'maison.chiffre1': 'ans de recettes familiales', 'maison.chiffre2': 'de la place Jemaa el-Fna', 'maison.chiffre3': 'couverts, pas un de plus',
    'signatures.surtitre': 'Les signatures', 'signatures.titre': 'Trois plats pour une première visite', 'signatures.lien': 'Voir toute la carte',
    'citation': '« On ne sert pas un repas, on reçoit des invités. »', 'citation.auteur': 'Lalla Khadija, en cuisine depuis 1987',
    'expe.surtitre': 'L\'expérience', 'expe.titre': 'Trois façons de vivre Dar Zaafran',
    'expe.patio.titre': 'Le patio', 'expe.patio.texte': 'Autour de la fontaine, sous les orangers, pour les déjeuners au calme.',
    'expe.terrasse.titre': 'La terrasse', 'expe.terrasse.texte': 'Face à l\'Atlas enneigé l\'hiver, pour le thé du coucher de soleil.',
    'expe.salon.titre': 'Le salon rouge', 'expe.salon.texte': 'Pour les dîners privés et les grandes occasions, jusqu\'à 12 personnes.',
    'avis.surtitre': 'Ils sont venus', 'avis.titre': 'Ce qu\'en disent nos invités',
    'avis.1': 'La meilleure souris d\'agneau de notre voyage. Le service est d\'une gentillesse rare.',
    'avis.2': 'Un riad magnifique, loin du bruit de la place. On a réservé en deux minutes sur WhatsApp.',
    'avis.3': 'Le couscous du vendredi vaut le détour. Pensez à réserver la terrasse pour le coucher du soleil.',
    'cta.titre': 'Une table vous attend ce soir', 'cta.texte': 'Réservation en ligne en moins d\'une minute, confirmation sur WhatsApp.',
    'menu.surtitre': 'La carte', 'menu.titre': 'Cuisine du marché, recettes de famille', 'menu.texte': 'Carte de saison. Prix en dirhams, service compris.',
    'menu.filtre.vegetarien': 'Végétarien', 'menu.filtre.signature': 'Nos signatures', 'menu.aucun': 'Aucun plat ne correspond à ces filtres.',
    'etiquette.vegetarien': 'Végétarien', 'etiquette.signature': 'Signature', 'etiquette.epice': 'Épicé',
    'menu.allergies': 'Une allergie ? Dites-le-nous en réservant : nous adaptons la plupart des plats.',
    'galerie.surtitre': 'Galerie', 'galerie.titre': 'Le riad, les plats, la lumière', 'galerie.tout': 'Tout', 'galerie.plats': 'Les plats', 'galerie.lieu': 'Le lieu',
    'galerie.fermer': 'Fermer', 'galerie.precedente': 'Photo précédente', 'galerie.suivante': 'Photo suivante',
    'resa.mois-precedent': 'Mois précédent', 'resa.mois-suivant': 'Mois suivant', 'resa.aucun-creneau': 'Plus de créneau ce jour-là : choisissez une autre date.',
    'resa.occasion.label': 'Occasion', 'resa.envoi': 'Réponse sous une heure, entre 11h et 23h.', 'resa.a-choisir': 'À choisir',
    'resa.ok.recap': 'Récapitulatif', 'resa.whatsapp.intro': 'Bonjour Dar Zaafran, je souhaite réserver une table :',
    'resa.memoriser': 'Nom et téléphone gardés sur cet appareil pour la prochaine fois.',
    'credits.titre': 'Mentions légales et crédits', 'credits.demo': 'Ce site est un <strong>projet de démonstration</strong> réalisé pour un portfolio de développeur web. Dar Zaafran est un restaurant <strong>fictif</strong> : l\'adresse, les prix et les avis sont inventés, et aucune réservation n\'est réellement enregistrée.',
    'credits.photos': 'Photos', 'credits.photos.texte': 'Les photos sont utilisées à titre d\'illustration, sous licence Creative Commons. Merci à leurs auteurs.',
    'credits.photo': 'Photo', 'credits.auteur': 'Auteur', 'credits.licence': 'Licence', 'credits.donnees': 'Données personnelles',
    'credits.donnees.texte': 'Aucune donnée n\'est envoyée à un serveur. La langue choisie et, si vous réservez, votre nom et votre téléphone sont gardés uniquement dans votre navigateur.',
    'erreur.titre': 'Cette page n\'existe pas', 'erreur.texte': 'Le lien est peut-être ancien. La carte et les réservations sont toujours là.', 'erreur.retour': 'Retour à l\'accueil',
    'resa.surtitre': 'Réservation', 'resa.titre': 'Réserver une table', 'resa.texte': 'Choisissez votre date et votre heure : nous confirmons sur WhatsApp dans l\'heure.',
    'resa.date': 'Date', 'resa.heure': 'Heure', 'resa.couverts': 'Nombre de personnes', 'resa.nom': 'Votre nom', 'resa.telephone': 'Téléphone (WhatsApp)',
    'resa.occasion': 'Une occasion particulière ?', 'resa.message': 'Allergies, demande particulière (facultatif)',
    'resa.dejeuner': 'Déjeuner', 'resa.diner': 'Dîner', 'resa.choisir-date': 'Choisissez d\'abord une date.', 'resa.ferme-lundi': 'Fermé le lundi.',
    'resa.envoyer': 'Continuer', 'resa.groupe': 'Plus de 12 personnes ? Écrivez-nous sur WhatsApp pour une privatisation.',
    'resa.occ.aucune': 'Aucune', 'resa.occ.anniversaire': 'Anniversaire', 'resa.occ.demande': 'Demande en mariage', 'resa.occ.affaires': 'Repas d\'affaires',
    'resa.err.date': 'Choisissez une date disponible.', 'resa.err.heure': 'Choisissez une heure disponible.', 'resa.err.couverts': 'Entre 1 et 12 personnes.',
    'resa.err.nom': 'Indiquez votre nom.', 'resa.err.telephone': 'Numéro marocain attendu, ex. 06 12 34 56 78.',
    'resa.recap': 'Votre demande', 'resa.personnes': 'personnes', 'resa.personne': 'personne',
    'resa.ok.titre': 'Dernière étape : envoyez-nous votre demande', 'resa.ok.texte': 'Votre demande est prête. Envoyez-la sur WhatsApp : nous vous confirmons la table dans l\'heure.',
    'resa.ok.whatsapp': 'Envoyer sur WhatsApp', 'resa.ok.modifier': 'Modifier ma demande',
    'contact.surtitre': 'Contact', 'contact.titre': 'Nous trouver', 'contact.adresse': 'Adresse', 'contact.horaires': 'Horaires',
    'contact.telephone': 'Téléphone et WhatsApp', 'contact.itineraire': 'Itinéraire', 'contact.carte': 'Afficher la carte',
    'contact.carte.info': 'La carte est chargée depuis Google Maps seulement si vous le demandez.',
    'contact.acces': 'Depuis la place Jemaa el-Fna, prenez la rue Riad Zitoun el-Kedim, puis la deuxième ruelle à gauche : c\'est la porte verte.',
    'jour.0': 'Dimanche', 'jour.1': 'Lundi', 'jour.2': 'Mardi', 'jour.3': 'Mercredi', 'jour.4': 'Jeudi', 'jour.5': 'Vendredi', 'jour.6': 'Samedi',
    'contact.ferme': 'Fermé', 'contact.aujourdhui': 'Aujourd\'hui',
    'pied.texte': 'Cuisine marocaine de famille dans un riad de la médina.', 'pied.credits': 'Mentions légales et crédits photos',
    'pied.demo': 'Projet de démonstration pour un portfolio : restaurant fictif.', 'whatsapp.bonjour': 'Bonjour Dar Zaafran, j\'ai une question.',
    'lien.passer': 'Aller au contenu', 'menu.ouvrir': 'Ouvrir le menu', 'menu.fermer': 'Fermer le menu', 'langue': 'Langue'
  },
  en: {
    'nav.accueil': 'Home', 'nav.menu': 'Menu', 'nav.galerie': 'Gallery', 'nav.reservation': 'Book', 'nav.contact': 'Contact',
    'etat.ouvert': 'Open · until {heure}', 'etat.ferme-aujourdhui': 'Closed · opens at {heure}', 'etat.ferme-demain': 'Closed · opens tomorrow at {heure}',
    'etat.ferme-jour': 'Closed · opens {jour} at {heure}',
    'hero.surtitre': 'Moroccan cuisine · Marrakech medina',
    'hero.titre': 'The taste of saffron, <em>in the heart of the medina.</em>',
    'hero.texte': 'An 18th-century riad, market cooking and recipes handed down from mother to daughter. Three minutes from Jemaa el-Fna square.',
    'hero.reserver': 'Book a table', 'hero.carte': 'Discover the menu',
    'maison.surtitre': 'Our house', 'maison.titre': 'Family cooking, in a family riad',
    'maison.texte1': 'At Dar Zaafran, everything starts at the market: morning vegetables, freshly ground spices, bread baked in the neighbourhood oven.',
    'maison.texte2': 'Our tagines simmer for hours over charcoal, our couscous is hand-rolled every Friday, and tea is served the way it is at home: by the pot, nicely frothy.',
    'maison.chiffre1': 'years of family recipes', 'maison.chiffre2': 'from Jemaa el-Fna square', 'maison.chiffre3': 'seats, not one more',
    'signatures.surtitre': 'Signatures', 'signatures.titre': 'Three dishes for a first visit', 'signatures.lien': 'See the full menu',
    'citation': '"We don\'t serve a meal, we welcome guests."', 'citation.auteur': 'Lalla Khadija, in the kitchen since 1987',
    'expe.surtitre': 'The experience', 'expe.titre': 'Three ways to enjoy Dar Zaafran',
    'expe.patio.titre': 'The patio', 'expe.patio.texte': 'Around the fountain, under the orange trees, for quiet lunches.',
    'expe.terrasse.titre': 'The terrace', 'expe.terrasse.texte': 'Facing the snowy Atlas in winter, for sunset tea.',
    'expe.salon.titre': 'The red lounge', 'expe.salon.texte': 'For private dinners and special occasions, up to 12 guests.',
    'avis.surtitre': 'They came', 'avis.titre': 'What our guests say',
    'avis.1': 'The best lamb shank of our trip. The service is exceptionally kind.',
    'avis.2': 'A beautiful riad, far from the noise of the square. We booked in two minutes on WhatsApp.',
    'avis.3': 'The Friday couscous is worth the trip. Book the terrace for sunset.',
    'cta.titre': 'A table is waiting for you tonight', 'cta.texte': 'Book online in under a minute, confirmed on WhatsApp.',
    'menu.surtitre': 'Menu', 'menu.titre': 'Market cooking, family recipes', 'menu.texte': 'Seasonal menu. Prices in dirhams, service included.',
    'menu.filtre.vegetarien': 'Vegetarian', 'menu.filtre.signature': 'Our signatures', 'menu.aucun': 'No dish matches these filters.',
    'etiquette.vegetarien': 'Vegetarian', 'etiquette.signature': 'Signature', 'etiquette.epice': 'Spicy',
    'menu.allergies': 'An allergy? Tell us when booking: we adapt most dishes.',
    'galerie.surtitre': 'Gallery', 'galerie.titre': 'The riad, the food, the light', 'galerie.tout': 'All', 'galerie.plats': 'Food', 'galerie.lieu': 'The place',
    'galerie.fermer': 'Close', 'galerie.precedente': 'Previous photo', 'galerie.suivante': 'Next photo',
    'resa.surtitre': 'Booking', 'resa.titre': 'Book a table', 'resa.texte': 'Choose your date and time: we confirm on WhatsApp within the hour.',
    'resa.date': 'Date', 'resa.heure': 'Time', 'resa.couverts': 'Number of guests', 'resa.nom': 'Your name', 'resa.telephone': 'Phone (WhatsApp)',
    'resa.occasion': 'A special occasion?', 'resa.message': 'Allergies, special request (optional)',
    'resa.dejeuner': 'Lunch', 'resa.diner': 'Dinner', 'resa.choisir-date': 'Choose a date first.', 'resa.ferme-lundi': 'Closed on Mondays.',
    'resa.mois-precedent': 'Previous month', 'resa.mois-suivant': 'Next month', 'resa.aucun-creneau': 'No time left that day: choose another date.',
    'resa.occasion.label': 'Occasion', 'resa.envoi': 'Reply within the hour, between 11 am and 11 pm.', 'resa.a-choisir': 'To choose',
    'resa.ok.recap': 'Summary', 'resa.whatsapp.intro': 'Hello Dar Zaafran, I would like to book a table:',
    'resa.memoriser': 'Name and phone kept on this device for next time.',
    'credits.titre': 'Legal notice and credits', 'credits.demo': 'This website is a <strong>demo project</strong> built for a web developer portfolio. Dar Zaafran is a <strong>fictional</strong> restaurant: the address, prices and reviews are made up, and no booking is actually recorded.',
    'credits.photos': 'Photos', 'credits.photos.texte': 'Photos are used for illustration only, under Creative Commons licences. Thanks to their authors.',
    'credits.photo': 'Photo', 'credits.auteur': 'Author', 'credits.licence': 'Licence', 'credits.donnees': 'Personal data',
    'credits.donnees.texte': 'No data is sent to a server. The chosen language and, if you book, your name and phone number are only kept in your browser.',
    'erreur.titre': 'This page does not exist', 'erreur.texte': 'The link may be old. The menu and bookings are still here.', 'erreur.retour': 'Back to home',
    'resa.envoyer': 'Continue', 'resa.groupe': 'More than 12 guests? Message us on WhatsApp for a private booking.',
    'resa.occ.aucune': 'None', 'resa.occ.anniversaire': 'Birthday', 'resa.occ.demande': 'Marriage proposal', 'resa.occ.affaires': 'Business meal',
    'resa.err.date': 'Choose an available date.', 'resa.err.heure': 'Choose an available time.', 'resa.err.couverts': 'Between 1 and 12 guests.',
    'resa.err.nom': 'Enter your name.', 'resa.err.telephone': 'Moroccan number expected, e.g. 06 12 34 56 78.',
    'resa.recap': 'Your request', 'resa.personnes': 'guests', 'resa.personne': 'guest',
    'resa.ok.titre': 'Last step: send us your request', 'resa.ok.texte': 'Your request is ready. Send it on WhatsApp: we will confirm your table within the hour.',
    'resa.ok.whatsapp': 'Send on WhatsApp', 'resa.ok.modifier': 'Edit my request',
    'contact.surtitre': 'Contact', 'contact.titre': 'Find us', 'contact.adresse': 'Address', 'contact.horaires': 'Opening hours',
    'contact.telephone': 'Phone and WhatsApp', 'contact.itineraire': 'Directions', 'contact.carte': 'Show the map',
    'contact.carte.info': 'The map is loaded from Google Maps only if you ask for it.',
    'contact.acces': 'From Jemaa el-Fna square, take Riad Zitoun el-Kedim street, then the second alley on the left: it is the green door.',
    'jour.0': 'Sunday', 'jour.1': 'Monday', 'jour.2': 'Tuesday', 'jour.3': 'Wednesday', 'jour.4': 'Thursday', 'jour.5': 'Friday', 'jour.6': 'Saturday',
    'contact.ferme': 'Closed', 'contact.aujourdhui': 'Today',
    'pied.texte': 'Moroccan family cooking in a medina riad.', 'pied.credits': 'Legal notice and photo credits',
    'pied.demo': 'Portfolio demo project: fictional restaurant.', 'whatsapp.bonjour': 'Hello Dar Zaafran, I have a question.',
    'lien.passer': 'Skip to content', 'menu.ouvrir': 'Open the menu', 'menu.fermer': 'Close the menu', 'langue': 'Language'
  }
};

// Langue : paramètre ?lang=en (s'il est valide), sinon choix mémorisé, sinon langue du navigateur.
const I18N = (function () {
  let langue = 'fr';
  try {
    const param = new URLSearchParams(location.search).get('lang');
    const memo = localStorage.getItem('dz_langue');
    if (param === 'fr' || param === 'en') langue = param;
    else if (memo === 'fr' || memo === 'en') langue = memo;
    else if (!/^fr/i.test(navigator.language || 'fr')) langue = 'en';
  } catch (e) { /* stockage bloqué : français par défaut */ }

  // t('etat.ouvert', { heure: '23:30' }) → "Ouvert · jusqu'à 23:30"
  function t(cle, valeurs) {
    let texte = (TEXTES[langue] && TEXTES[langue][cle]) || TEXTES.fr[cle] || cle;
    Object.keys(valeurs || {}).forEach(function (k) { texte = texte.replace('{' + k + '}', valeurs[k]); });
    return texte;
  }

  // Remplace tous les textes marqués data-i18n (et les attributs data-i18n-aria-label, etc.).
  function appliquer(racine) {
    document.documentElement.lang = langue;
    (racine || document).querySelectorAll('[data-i18n]').forEach(function (el) { el.innerHTML = t(el.dataset.i18n); });
    (racine || document).querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.dataset.i18nAttr.split(';').forEach(function (paire) {
        const p = paire.split(':');
        el.setAttribute(p[0], t(p[1]));
      });
    });
  }

  function changer(nouvelle) {
    if (nouvelle !== 'fr' && nouvelle !== 'en') return;
    langue = nouvelle;
    try { localStorage.setItem('dz_langue', langue); } catch (e) { /* rien */ }
    appliquer();
    window.dispatchEvent(new CustomEvent('langue:change'));
  }

  return { t: t, appliquer: appliquer, changer: changer, get langue() { return langue; } };
})();
