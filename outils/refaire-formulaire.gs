/**
 * Refait le formulaire client « Sahir Digital » avec les nouvelles offres (le lien client ne change pas).
 * script.google.com/create → coller → Ctrl+S → Exécuter → autoriser (compte astralzayte).
 */
function refaireFormulaireSahir() {
  var form = FormApp.openById('1ldDv-l5HZtRyAnomwYz6TWRs56snThL90FLpsl73_jQ');
  form.getItems().forEach(function (item) { form.deleteItem(item); });

  form.setTitle('Sahir Digital : votre offre');
  form.setDescription(
    'Plus de clientes pour votre salon, sans rien faire de votre côté.\n\n' +
    'Sans engagement, payé à la semaine, installation offerte, facture pour chaque paiement.\n' +
    'Offre de lancement : prix bloqués à vie pour les 10 premiers salons.\n\n' +
    '2 minutes : cochez ce qui vous intéresse, Julien vous répond sur WhatsApp.');
  form.setProgressBar(true);

  // Page 1 : contact + offres
  form.addTextItem().setTitle('Nom du salon').setRequired(true);
  form.addTextItem().setTitle('Votre numéro WhatsApp').setRequired(true)
    .setHelpText('C\'est là que Julien vous répondra.')
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Entrez le numéro sur lequel vous avez WhatsApp (ex. 06 12 34 56 78 ou +212 6 12 34 56 78).')
      .requireTextMatchesPattern('^ *(\\+212|\\+33|00212|0033|0) *[67]([ .-]?[0-9]){8} *$').build());

  form.addMultipleChoiceItem().setTitle('Votre formule chaque semaine').setRequired(true)
    .setHelpText('Sans engagement : vous arrêtez quand vous voulez.')
    .setChoiceValues([
      'DÉMARRAGE : 100 DH / semaine. Votre WhatsApp répond à vos clientes 24h/24 en 5 secondes (prix, disponibilités, réservation). Le prix d\'un brushing.',
      'ESSENTIEL (recommandé) : 450 DH / semaine au lieu de 500. WhatsApp automatisé + 7 vidéos et 7 stories publiées pour vous chaque semaine.',
      'ULTRA : 900 DH / semaine au lieu de 1 000. WhatsApp et Instagram automatisés + 15 vidéos et 21 stories chaque semaine.',
      'Je ne sais pas encore : conseillez-moi sur WhatsApp',
      'Pas de formule à la semaine'
    ]);

  form.addMultipleChoiceItem().setTitle('Pour démarrer fort (paiement unique)')
    .setChoiceValues([
      'LANCEMENT : 1 800 DH au lieu de 2 100. Étude de marché + création de vos réseaux avec logo + site internet avec prise de rendez-vous.',
      'LANCEMENT PRO : 2 600 DH au lieu de 3 100. Tout le Lancement + 1 mois de publicités gérées pour vous (budget publicitaire en plus).',
      'Non merci'
    ]);

  form.addCheckboxItem().setTitle('En plus (facultatif)')
    .setChoiceValues([
      'Instagram automatisé (réponses aux messages privés 24h/24) : 100 DH / semaine',
      'Gestion de vos publicités Facebook, Instagram, TikTok : 250 DH / semaine (budget publicitaire en plus)',
      'Site internet seul + nom de domaine : 1 500 DH',
      'Étude de marché seule : 300 DH',
      'Création de vos réseaux avec logo : 300 DH',
      'Vidéos ou stories en plus : vidéos dès 150 DH / semaine, stories dès 50 DH / semaine'
    ]);

  // Page 2 : infos pour préparer l'offre (tout est facultatif)
  form.addPageBreakItem().setTitle('Pour préparer votre offre (facultatif)')
    .setHelpText('Vous pouvez aussi nous envoyer ces infos sur WhatsApp. Cliquez sur « Envoyer » si vous voulez finir maintenant.');
  form.addTextItem().setTitle('Adresse du salon');
  form.addTextItem().setTitle('Horaires d\'ouverture');
  form.addParagraphTextItem().setTitle('Vos prestations et leurs prix')
    .setHelpText('Ou écrivez « j\'envoie une photo de la carte sur WhatsApp ».');
  form.addParagraphTextItem().setTitle('Les 5 questions que vos clientes posent le plus, avec vos réponses');
  form.addParagraphTextItem().setTitle('Votre Instagram ou TikTok actuel (liens)');
  form.addCheckboxItem().setTitle('Style voulu').setChoiceValues(['Chic', 'Chaleureux', 'Fun', 'Moderne', 'Traditionnel']);
  form.addParagraphTextItem().setTitle('Vos 3 principaux concurrents');
  form.addTextItem().setTitle('Nom de site souhaité (ex. salonlina.com)');

  form.setConfirmationMessage(
    'Merci ! Votre demande est bien reçue et votre prix de lancement est réservé. ' +
    'Julien vous écrit très vite sur WhatsApp pour tout mettre en place. Sahir Digital');
  form.setAcceptingResponses(true);

  Logger.log('Formulaire refait. Lien client (inchangé) : ' + form.getPublishedUrl());
}
