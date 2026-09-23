/* =========================================================
   contact.js — Adresse, horaires, carte
   ---------------------------------------------------------
   - tableau des horaires, avec le jour actuel mis en valeur
     et l'état "ouvert / fermé" en direct (heure de Marrakech) ;
   - la carte Google Maps n'est chargée qu'au clic (plus rapide,
     et respect de la vie privée : pas d'appel à Google avant).
   ========================================================= */

const position = RESTAURANT.latitude + ',' + RESTAURANT.longitude;

function afficherContact() {
  const maintenant = maintenantMarrakech();
  const aujourdhui = Horaires.jourSemaine(maintenant.date);
  const services = Horaires.HORAIRES.services.map(function (s) { return heureLisible(s.debut) + ' – ' + heureLisible(s.fin); }).join(' · ');

  document.getElementById('adresse').innerHTML = echapper(RESTAURANT.adresse) + '<br>' + echapper(RESTAURANT.ville);
  document.getElementById('itineraire').href = 'https://www.google.com/maps/dir/?api=1&destination=' + position;
  document.getElementById('telephone').textContent = RESTAURANT.telephoneAffiche;
  document.getElementById('contact-whatsapp').href = lienWhatsApp(I18N.t('whatsapp.bonjour'));
  document.getElementById('contact-whatsapp').innerHTML = ICONES.whatsapp + 'WhatsApp';

  // Semaine du lundi au dimanche (1, 2, … 6, 0).
  document.getElementById('horaires').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(function (j) {
    const ferme = j === Horaires.HORAIRES.jourFerme;
    return '<tr' + (j === aujourdhui ? ' class="aujourdhui" aria-current="date"' : '') + '><td>' + I18N.t('jour.' + j) +
      (j === aujourdhui ? ' · ' + I18N.t('contact.aujourdhui') : '') + '</td><td>' + (ferme ? I18N.t('contact.ferme') : services) + '</td></tr>';
  }).join('');

  const etat = texteEtat();
  document.getElementById('etat-contact').innerHTML = etat.texte
    ? '<span class="etat-ouverture ' + (etat.ouvert ? 'ouvert' : 'ferme') + '">' + ICONES.point + etat.texte + '</span>' : '';
}

document.getElementById('afficher-carte').addEventListener('click', function () {
  const cadre = document.createElement('iframe');
  cadre.src = 'https://maps.google.com/maps?q=' + position + '&z=16&output=embed';
  cadre.title = 'Google Maps — ' + RESTAURANT.nom;
  cadre.loading = 'lazy';
  cadre.referrerPolicy = 'no-referrer-when-downgrade';
  document.getElementById('carte-lieu').replaceChildren(cadre);
});

afficherContact();
window.addEventListener('langue:change', afficherContact);
setInterval(afficherContact, 60000);
