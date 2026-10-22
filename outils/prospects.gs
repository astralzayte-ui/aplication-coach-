/**
 * Fiche de prospects Sahir Digital (Google Sheet) + point d'entrée pour que Claude ajoute les prospects.
 * 1) Coller ce code dans script.google.com → Ctrl+S → choisir « installerProspects » → Exécuter → autoriser.
 * 2) Déployer → Nouveau déploiement → ⚙ Application Web → Exécuter en tant que : Moi → Accès : Tout le monde → Déployer.
 * 3) Copier l'URL de l'application Web et l'envoyer à Claude.
 */
var TOKEN = 'VOIR_DOC_DRIVE'; // le vrai jeton est dans le Google Doc « Sahir Digital — Script fiche prospects V3 » (dépôt public)
var COLONNES = ['Appelé', 'A répondu', 'WhatsApp envoyé', 'Intéressé',
  'Score', 'Nom', 'Téléphone', 'Présentation FR', 'Formulaire FR', 'Présentation AR', 'Formulaire AR', 'Point faible',
  'Note Google', 'Nb avis', 'Site', 'Instagram', 'Secteur', 'Date ajout', 'Notes'];

function lien(url, texte) {
  return url ? '=HYPERLINK("' + url + '","' + texte + '")' : 'Fixe : appeler';
}

function installerProspects() {
  var ss = SpreadsheetApp.create('Sahir Digital — Prospects');
  var sh = ss.getActiveSheet();
  sh.setName('Prospects');
  sh.getRange(1, 1, 1, COLONNES.length).setValues([COLONNES])
    .setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  sh.setColumnWidths(1, 4, 95);
  var plage = sh.getRange('A2:S2000');
  sh.setConditionalFormatRules([
    // Intéressé → ligne verte
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$D2=TRUE')
      .setBackground('#d1fae5').setRanges([plage]).build(),
    // A répondu OU WhatsApp envoyé → ligne barrée et grisée (c'est traité)
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=OR($B2=TRUE,$C2=TRUE)')
      .setStrikethrough(true).setFontColor('#9ca3af').setRanges([plage]).build()
  ]);
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());
  Logger.log('OK - Fiche prospects : ' + ss.getUrl());
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  if (data.token !== TOKEN) return ContentService.createTextOutput('refusé');
  var sh = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'))
    .getSheetByName('Prospects');
  // V5 : 4 boutons (présentation / formulaire, en français / en arabe) à la place des anciennes colonnes WhatsApp
  if (sh.getRange(1, 8).getValue() !== 'Présentation FR') {
    if (sh.getRange(1, 9).getValue() !== 'WhatsApp arabe') sh.insertColumnAfter(8);
    sh.insertColumnAfter(9);
  }
  sh.getRange(1, 1, 1, COLONNES.length).setValues([COLONNES])
    .setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff');
  if (data.action === 'reset' && sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, sh.getMaxColumns()).clearContent().removeCheckboxes();
  }
  // Ajoute le lien WhatsApp arabe aux prospects déjà présents (repérés par leur numéro)
  if (data.action === 'ar') {
    var n = 0, tels = sh.getRange(2, 7, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
    var parTel = {};
    (data.rows || []).forEach(function (r) { parTel[String(r.telephone)] = r.whatsapp_ar; });
    tels.forEach(function (t, i) {
      var tel = String(t[0]);
      if (!(tel in parTel)) return;
      if (parTel[tel]) sh.getRange(i + 2, 10).setFormula(lien(parTel[tel], 'Présentation (AR)'));
      else sh.getRange(i + 2, 10).setValue('Fixe : appeler');
      n++;
    });
    return ContentService.createTextOutput(String(n));
  }
  var rows = data.rows || [];
  if (!rows.length) return ContentService.createTextOutput('0');
  var debut = sh.getLastRow() + 1;
  var valeurs = rows.map(function (r) {
    return [false, false, false, false, r.score, r.nom, r.telephone,
      lien(r.whatsapp, 'Présentation'), lien(r.whatsapp_form, 'Formulaire'),
      lien(r.whatsapp_ar, 'Présentation (AR)'), lien(r.whatsapp_form_ar, 'Formulaire (AR)'), r.point_faible, r.note, r.avis, r.site, r.instagram, r.secteur, r.date, ''];
  });
  sh.getRange(debut, 1, valeurs.length, COLONNES.length).setValues(valeurs);
  sh.getRange(debut, 1, valeurs.length, 4).insertCheckboxes();
  sh.setColumnWidth(6, 220); sh.setColumnWidths(8, 4, 140); sh.setColumnWidth(12, 260);
  return ContentService.createTextOutput(String(valeurs.length));
}
