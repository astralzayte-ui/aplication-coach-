/**
 * Crée le Google Form « Sahir Digital — Démarrage » et sa Google Sheet de réponses.
 * Mode d'emploi : script.google.com → Nouveau projet → coller ce code → Exécuter → autoriser.
 * Les liens s'affichent dans le « Journal d'exécution » en bas.
 */
function creerFormulaireSahir() {
  var form = FormApp.create('Sahir Digital — Démarrage');
  form.setDescription(
    'Sahir Digital — entreprise déclarée, facture fournie pour chaque paiement.\n' +
    'Cochez les services qui vous intéressent et donnez-nous quelques infos sur votre commerce. 2 minutes suffisent.');
  form.setProgressBar(true);

  // Section 1 — Services
  form.addTextItem().setTitle('Nom du commerce').setRequired(true);
  form.addTextItem().setTitle('Votre numéro WhatsApp').setRequired(true);
  form.addMultipleChoiceItem().setTitle('⭐ Packs (prix réduits)').setChoiceValues([
    'Aucun pack (je choisis à la carte)',
    'Pack Essentiel : 7 vidéos + 7 stories + IA WhatsApp — 450 DH / semaine',
    'Pack Premium : 15 vidéos + 21 stories + IA WhatsApp — 800 DH / semaine',
    'Pack Ultra : 15 vidéos + 21 stories + IA WhatsApp + IA Instagram + IA TikTok — 950 DH / semaine',
    'Pack Lancement : étude de marché + création des réseaux avec logo + site — 1 800 DH une fois',
    'Pack Lancement Pro : étude de marché + création des réseaux avec logo + site + 1 mois de gestion pub — 2 600 DH une fois'
  ]);
  form.addCheckboxItem().setTitle('Services à la carte (à ajouter ou sans pack)').setChoiceValues([
    'Étude de marché : voir si vous êtes bien placé face à vos concurrents ou s\'il y a des modifications à faire — 300 DH',
    'Création de vos réseaux (Instagram, Facebook, TikTok) avec logo — 300 DH',
    'Site internet + nom de domaine — 1 500 DH',
    'IA qui répond sur WhatsApp 24h/24 (écrit et vocal, français et arabe) — 100 DH / semaine',
    'IA qui répond sur Instagram (messages privés) 24h/24 — 100 DH / semaine',
    'IA qui répond sur TikTok (messages privés) 24h/24 — 100 DH / semaine',
    'Gestion de vos publicités payantes (Facebook, Instagram, TikTok) — 250 DH / semaine (budget pub payé par vous à Meta / TikTok)'
  ]);
  form.addMultipleChoiceItem().setTitle('Gestion de vos réseaux : vidéos publiées par semaine (si pas de pack)').setChoiceValues([
    'Aucune', '3 vidéos — 150 DH / semaine', '5 vidéos — 225 DH / semaine', '7 vidéos — 300 DH / semaine',
    '10 vidéos — 400 DH / semaine', '15 vidéos — 550 DH / semaine'
  ]);
  form.addMultipleChoiceItem().setTitle('Stories par semaine (si pas de pack)').setChoiceValues([
    'Aucune', '3 stories — 50 DH / semaine', '7 stories — 100 DH / semaine',
    '14 stories — 180 DH / semaine', '21 stories — 250 DH / semaine'
  ]);

  // Section 2 — Le commerce
  form.addPageBreakItem().setTitle('Votre commerce');
  form.addTextItem().setTitle('Secteur (spa, restaurant, salon…)').setRequired(true);
  form.addTextItem().setTitle('Adresse').setRequired(true);
  form.addTextItem().setTitle('Horaires d\'ouverture').setRequired(true);
  form.addParagraphTextItem().setTitle('Vos services et leurs prix')
    .setHelpText('Ou écrivez « j\'envoie une photo de la carte sur WhatsApp »');
  form.addParagraphTextItem().setTitle('Les 5 questions que vos clients posent le plus, avec vos réponses');
  form.addParagraphTextItem().setTitle('Vos réseaux actuels (liens) et nombre d\'abonnés');
  form.addCheckboxItem().setTitle('Style voulu').setChoiceValues(['Chic', 'Chaleureux', 'Fun', 'Moderne', 'Traditionnel']);
  form.addParagraphTextItem().setTitle('Vos 3 principaux concurrents');
  form.addTextItem().setTitle('Nom de site souhaité (ex. spaserenite.com)');

  form.setConfirmationMessage(
    'Merci ! Envoyez-nous maintenant sur WhatsApp votre logo (si vous en avez un), 5 à 10 photos du lieu et l\'acompte de 400 DH. — Sahir Digital');

  var ss = SpreadsheetApp.create('Sahir Digital — Réponses clients');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  try { form.setPublished(true); } catch (e) {}
  form.setAcceptingResponses(true);

  Logger.log('✅ LIEN À ENVOYER AUX CLIENTS : ' + form.getPublishedUrl());
  Logger.log('Modifier le formulaire : ' + form.getEditUrl());
  Logger.log('Feuille des réponses : ' + ss.getUrl());
}
