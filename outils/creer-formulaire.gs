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
  form.addCheckboxItem().setTitle('Services à la carte').setChoiceValues([
    'Étude de marché : voir si vous êtes bien placé face à vos concurrents ou s\'il y a des modifications à faire — 300 DH',
    'Création de vos réseaux (Instagram, Facebook, TikTok) — 300 DH',
    'Site internet + nom de domaine — 1 500 DH',
    'Réponses automatiques WhatsApp 24h/24 (écrit et vocal, français et arabe) — 100 DH / semaine'
  ]);
  form.addMultipleChoiceItem().setTitle('Vidéos publicitaires par semaine (créées et publiées pour vous)').setChoiceValues([
    'Aucune', '3 vidéos — 150 DH / semaine', '5 vidéos — 225 DH / semaine', '7 vidéos — 300 DH / semaine',
    '10 vidéos — 400 DH / semaine', '15 vidéos — 550 DH / semaine'
  ]);
  form.addMultipleChoiceItem().setTitle('Stories par semaine').setChoiceValues([
    'Aucune', '3 stories — 50 DH / semaine', '7 stories — 100 DH / semaine',
    '14 stories — 180 DH / semaine', '21 stories — 250 DH / semaine'
  ]);
  form.addCheckboxItem().setTitle('⭐ Packs (prix réduits)').setChoiceValues([
    'Pack Essentiel : 7 vidéos + 7 stories + WhatsApp automatique — 450 DH / semaine (au lieu de 500)',
    'Pack Premium 🔥 : 15 vidéos + 21 stories + WhatsApp automatique — 800 DH / semaine (au lieu de 900)',
    'Pack Lancement : étude de marché + création des réseaux + site — 1 800 DH une fois (au lieu de 2 100)'
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
    'Merci ! Envoyez-nous maintenant sur WhatsApp votre logo, 5 à 10 photos du lieu et l\'acompte de 400 DH. — Sahir Digital');

  var ss = SpreadsheetApp.create('Sahir Digital — Réponses clients');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  try { form.setPublished(true); } catch (e) {}
  form.setAcceptingResponses(true);

  Logger.log('✅ LIEN À ENVOYER AUX CLIENTS : ' + form.getPublishedUrl());
  Logger.log('Modifier le formulaire : ' + form.getEditUrl());
  Logger.log('Feuille des réponses : ' + ss.getUrl());
}
