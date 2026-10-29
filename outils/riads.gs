/**
 * Mise en forme de la fiche « Pulse Digital — Prospects riads Marrakech (40) » : même système que la fiche des salons.
 * Dans la fiche : Extensions → Apps Script → coller ce code → Enregistrer → Exécuter « miseEnForme » → autoriser.
 * - cases à cocher Appelé / À rappeler / Intéressé en premier
 * - Appelé → ligne verte, À rappeler → ligne orange, Intéressé → vert foncé en gras
 * - liens WhatsApp et Google Maps raccourcis en boutons, colonnes techniques masquées
 * On peut le relancer sans risque.
 */
function miseEnForme() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sh.setName('Riads');
  var entetes = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  if (entetes[0] !== 'Appelé') sh.moveColumns(sh.getRange(1, entetes.indexOf('Appelé') + 1, 1, 3), 1);
  entetes = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var col = function (nom) { return entetes.indexOf(nom) + 1; };
  var nbCol = sh.getLastColumn();

  // Lignes de riads : celles où la colonne # contient un nombre
  var nums = sh.getRange(2, col('#'), sh.getLastRow() - 1, 1).getValues();
  var n = 0;
  while (n < nums.length && typeof nums[n][0] === 'number') n++;

  sh.getRange(2, 1, n, 3).insertCheckboxes();

  // Liens WhatsApp : un bouton court au lieu de l'URL entière
  [['Envoyer avec la vidéo en FRANÇAIS', 'Envoyer (vidéo FR)', 'WhatsApp vidéo FR'],
   ['Envoyer avec la vidéo en ARABE', 'Envoyer (vidéo AR)', 'WhatsApp vidéo AR']].forEach(function (l) {
    var c = col(l[0]) || col(l[2]);
    var plage = sh.getRange(2, c, n, 1);
    var f = plage.getFormulas().map(function (r) {
      return [r[0].indexOf('Envoyer (') > -1 ? r[0] : r[0].replace(/\)\s*$/, ', "' + l[1] + '")')];
    });
    plage.setFormulas(f);
    sh.getRange(1, c).setValue(l[2]);
  });
  var maps = sh.getRange(2, col('Fiche Google Maps'), n, 1);
  var deja = maps.getFormulas();
  maps.setFormulas(maps.getValues().map(function (r, i) {
    return [deja[i][0] || (String(r[0]).indexOf('http') === 0 ? '=HYPERLINK("' + r[0] + '", "Voir")' : '')];
  }));

  sh.hideColumns(col('Nom dans le message'));
  sh.hideColumns(col('Numéro WhatsApp'));

  sh.getRange(1, 1, 1, nbCol).setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff').setWrap(true);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(col('Riad'));
  sh.setColumnWidths(1, 3, 90);
  sh.setColumnWidth(col('Riad'), 230);
  sh.setColumnWidth(col('Quartier'), 130);
  sh.setColumnWidth(col('Téléphone'), 120);
  sh.setColumnWidths(col('WhatsApp vidéo FR'), 2, 150);
  sh.setColumnWidth(col('Notes'), 260);

  var donnees = sh.getRange(2, 1, n, nbCol);
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$C2=TRUE')
      .setBackground('#4ade80').setBold(true).setRanges([donnees]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$B2=TRUE')
      .setBackground('#fdba74').setRanges([donnees]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$A2=TRUE')
      .setBackground('#bbf7d0').setRanges([donnees]).build()
  ]);

  // Les 2 cases où coller les liens des vidéos, en jaune
  var bas = sh.getRange(n + 2, 1, sh.getLastRow() - n - 1, nbCol).getValues();
  bas.forEach(function (ligne, i) {
    var k = ligne.indexOf('Lien vidéo FR') > -1 ? ligne.indexOf('Lien vidéo FR') : ligne.indexOf('Lien vidéo AR');
    if (k > -1) sh.getRange(n + 2 + i, k + 2).setBackground('#fef08a').setFontWeight('bold');
  });

  SpreadsheetApp.getActiveSpreadsheet().toast('Fiche prête : cochez Appelé, À rappeler ou Intéressé.');
}
