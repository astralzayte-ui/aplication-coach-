/* =========================================================
   menu-deroulant.js — Liste déroulante sur mesure (noir et or)
   ---------------------------------------------------------
   La liste <select> du navigateur ne peut presque pas être
   décorée (surlignage bleu imposé, police système…).
   Ici, on la "remplace" visuellement par un bouton + une
   liste d'options qu'on dessine nous-mêmes.

   Le <select> d'origine reste caché dans la page : c'est lui
   qui garde la valeur choisie. Le reste du code (catalogue.js)
   continue donc à lire select.value et à écouter "change",
   sans rien savoir du nouveau menu. C'est une "amélioration
   progressive" : sans JavaScript, le <select> normal marche.

   Accessibilité : rôles ARIA "listbox" / "option", et
   navigation au clavier (flèches, Entrée, Échap, Tab).
   ========================================================= */

// "nos coups de cœur" → "Nos coups de cœur"
function majuscule(texte) {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

function creerMenuDeroulant(select) {
  const options = Array.from(select.options);

  // 1) Construire le nouveau menu à côté du <select>.
  const conteneur = document.createElement('div');
  conteneur.className = 'menu-deroulant';
  const idListe = select.id + '-liste';

  conteneur.innerHTML =
    '<button type="button" class="menu-bouton" aria-haspopup="listbox" aria-expanded="false" aria-controls="' + idListe + '">' +
      (select.dataset.etiquette ? '<span class="menu-etiquette">' + select.dataset.etiquette + '</span>' : '') +
      '<span class="menu-valeur"></span>' +
      '<svg class="menu-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '</button>' +
    '<ul class="menu-liste" id="' + idListe + '" role="listbox" tabindex="-1" hidden>' +
      options.map(function (o, i) {
        // On enlève le préfixe "Trier : " du texte affiché dans la liste.
        return '<li role="option" id="' + idListe + '-' + i + '" data-valeur="' + o.value + '"' + (o.value === '' ? ' class="menu-invite"' : '') + '>' +
          '<span>' + majuscule(o.textContent.replace(/^Trier\s*:\s*/, '')) + '</span>' +
          '<svg class="menu-coche" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</li>';
      }).join('') +
    '</ul>';

  select.classList.add('visuellement-cache');
  select.setAttribute('tabindex', '-1');
  select.setAttribute('aria-hidden', 'true');
  select.insertAdjacentElement('afterend', conteneur);

  const bouton = conteneur.querySelector('.menu-bouton');
  bouton.id = select.id + '-bouton';
  const liste = conteneur.querySelector('.menu-liste');
  const elements = Array.from(liste.children);
  let indexActif = 0;   // option mise en avant au clavier

  // Si un autre code demande le focus du <select> caché (ex. champ en erreur),
  // on le donne au bouton visible à la place.
  select.focus = function () { bouton.focus(); };
  // Le <label for="…"> du select désigne maintenant le bouton (clic sur le libellé = ouvrir).
  const libelle = document.querySelector('label[for="' + select.id + '"]');
  if (libelle) {
    libelle.addEventListener('click', function (e) { e.preventDefault(); bouton.focus(); });
    bouton.setAttribute('aria-label', libelle.textContent.trim());
  }

  // 2) Afficher la valeur actuelle du <select> dans le bouton et cocher la bonne option.
  function synchroniser() {
    if (select.selectedIndex < 0) select.selectedIndex = 0;   // valeur inconnue : on revient à la 1re option
    const choisie = select.selectedIndex;
    bouton.querySelector('.menu-valeur').textContent = elements[choisie].textContent;
    bouton.classList.toggle('vide', select.value === '');   // "Choisir…" affiché en gris
    elements.forEach(function (li, i) { li.setAttribute('aria-selected', i === choisie); });
  }

  // sens = +1 (vers le bas) ou -1 (vers le haut) : sert à sauter l'option "Choisir…" cachée.
  function mettreEnAvant(i, sens) {
    indexActif = (i + elements.length) % elements.length;   // boucle : après la dernière, la première
    if (elements[indexActif].classList.contains('menu-invite')) {
      indexActif = (indexActif + (sens || 1) + elements.length) % elements.length;
    }
    elements.forEach(function (li, j) { li.classList.toggle('actif', j === indexActif); });
    elements[indexActif].scrollIntoView({ block: 'nearest' });   // utile pour les longues listes
    liste.setAttribute('aria-activedescendant', elements[indexActif].id);
  }

  function ouvrir() {
    liste.hidden = false;
    conteneur.classList.add('ouvert');
    bouton.setAttribute('aria-expanded', 'true');
    mettreEnAvant(select.selectedIndex);
    liste.focus();
  }

  function fermer(rendreFocus) {
    liste.hidden = true;
    conteneur.classList.remove('ouvert');
    bouton.setAttribute('aria-expanded', 'false');
    if (rendreFocus) bouton.focus();
  }

  // 3) Choisir une option : on met à jour le <select> caché puis on déclenche
  //    son événement "change", exactement comme si l'utilisateur l'avait utilisé.
  function choisir(i) {
    select.selectedIndex = i;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    synchroniser();
    fermer(true);
  }

  bouton.addEventListener('click', function () {
    if (liste.hidden) ouvrir(); else fermer(true);
  });
  liste.addEventListener('click', function (e) {
    const li = e.target.closest('[role="option"]');
    if (li) choisir(elements.indexOf(li));
  });
  liste.addEventListener('mousemove', function (e) {
    const li = e.target.closest('[role="option"]');
    if (li) mettreEnAvant(elements.indexOf(li));
  });

  // Clavier
  bouton.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); ouvrir(); }
  });
  liste.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); mettreEnAvant(indexActif + 1, 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); mettreEnAvant(indexActif - 1, -1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choisir(indexActif); }
    else if (e.key === 'Escape') { e.preventDefault(); fermer(true); }
    else if (e.key === 'Tab') { fermer(false); }
  });

  // Un clic n'importe où ailleurs referme le menu.
  document.addEventListener('click', function (e) {
    if (!conteneur.contains(e.target) && !liste.hidden) fermer(false);
  });

  // Si un autre code change la valeur du <select> (ex. "Réinitialiser les filtres"),
  // il envoie l'événement "rafraichir" et le bouton se remet à jour.
  select.addEventListener('rafraichir', synchroniser);
  select.addEventListener('change', synchroniser);

  synchroniser();
}

// On améliore automatiquement toutes les listes <select> de la page.
document.querySelectorAll('select').forEach(creerMenuDeroulant);
