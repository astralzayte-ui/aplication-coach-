/**
 * Met à jour le formulaire existant « Sahir Digital — Démarrage » (le lien client ne change pas).
 * script.google.com → Nouveau projet → coller → Ctrl+S → Exécuter → autoriser.
 */
function majFormulaireSahir() {
  var form = FormApp.openById('1ldDv-l5HZtRyAnomwYz6TWRs56snThL90FLpsl73_jQ');

  // Numéro WhatsApp : portable marocain ou français uniquement (06 / 07 / +212 / +33)
  var validation = FormApp.createTextValidation()
    .setHelpText('Entrez le numéro sur lequel vous avez WhatsApp (ex. 06 12 34 56 78 ou +212 6 12 34 56 78).')
    .requireTextMatchesPattern('^ *(\\+212|\\+33|00212|0033|0) *[67]([ .-]?[0-9]){8} *$')
    .build();
  form.getItems(FormApp.ItemType.TEXT).forEach(function (item) {
    if (item.getTitle().indexOf('WhatsApp') !== -1) {
      item.asTextItem()
        .setTitle('Votre numéro WhatsApp')
        .setHelpText('Le numéro sur lequel vous avez WhatsApp : c\'est là qu\'on vous contactera.')
        .setValidation(validation)
        .setRequired(true);
    }
  });

  form.setConfirmationMessage(
    'Merci ! Nous vous contacterons d\'ici peu sur WhatsApp. Si vous avez des questions, écrivez-nous directement sur WhatsApp. — Sahir Digital');

  Logger.log('✅ Formulaire mis à jour : ' + form.getPublishedUrl());
}
