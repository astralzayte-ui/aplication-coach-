/**
 * Fiche de prospects Sahir Digital (Google Sheet) + point d'entrée pour que Claude ajoute les prospects.
 * 1) Coller ce code dans script.google.com → Ctrl+S → choisir « installerProspects » → Exécuter → autoriser.
 * 2) Déployer → Nouveau déploiement → ⚙ Application Web → Exécuter en tant que : Moi → Accès : Tout le monde → Déployer.
 * 3) Copier l'URL de l'application Web et l'envoyer à Claude.
 */
var TOKEN = 'VOIR_DOC_DRIVE'; // le vrai jeton est dans le Google Doc « Sahir Digital — Script fiche prospects V3 » (dépôt public)
var COLONNES = ['Appelé', 'A répondu', 'WhatsApp envoyé', 'Intéressé',
  'Score', 'Nom', 'Téléphone', 'WhatsApp 1 clic', 'Accroche (à lire au téléphone)', 'Point faible',
  'Note Google', 'Nb avis', 'Site', 'Instagram', 'Secteur', 'Date ajout', 'Notes'];

function installerProspects() {
  var ss = SpreadsheetApp.create('Sahir Digital — Prospects');
  var sh = ss.getActiveSheet();
  sh.setName('Prospects');
  sh.getRange(1, 1, 1, COLONNES.length).setValues([COLONNES])
    .setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  sh.setColumnWidths(1, 4, 95);
  var plage = sh.getRange('A2:Q2000');
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
  sh.getRange(1, 1, 1, COLONNES.length).setValues([COLONNES])
    .setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff');
  if (data.action === 'reset' && sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, sh.getMaxColumns()).clearContent().removeCheckboxes();
  }
  var rows = data.rows || [];
  if (!rows.length) return ContentService.createTextOutput('0');
  var debut = sh.getLastRow() + 1;
  var valeurs = rows.map(function (r) {
    return [false, false, false, false, r.score, r.nom, r.telephone,
      r.whatsapp ? '=HYPERLINK("' + r.whatsapp + '","Envoyer WhatsApp")' : 'Fixe : appeler',
      r.accroche || '', r.point_faible, r.note, r.avis, r.site, r.instagram, r.secteur, r.date, ''];
  });
  sh.getRange(debut, 1, valeurs.length, COLONNES.length).setValues(valeurs);
  sh.getRange(debut, 1, valeurs.length, 4).insertCheckboxes();
  sh.setColumnWidth(6, 220); sh.setColumnWidth(8, 150); sh.setColumnWidth(9, 420);
  sh.getRange(debut, 9, valeurs.length, 1).setWrap(true);
  return ContentService.createTextOutput(String(valeurs.length));
}
