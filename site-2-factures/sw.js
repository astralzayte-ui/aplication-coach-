/* =========================================================
   sw.js — Service worker : l'application marche hors connexion
   ---------------------------------------------------------
   À la première visite, on met en cache tous les fichiers de
   l'application. Ensuite, chaque fichier est servi depuis le
   cache (instantané, même sans internet) pendant qu'on va
   chercher une version plus récente en arrière-plan
   (stratégie "stale-while-revalidate").
   Changer VERSION force la mise à jour du cache.
   ========================================================= */

const VERSION = 'qalam-v1';
const FICHIERS = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest',
  'js/calculs.js', 'js/donnees.js', 'js/composants.js', 'js/vues.js', 'js/app.js',
  'icones/icone.svg', 'icones/icone-192.png', 'icones/icone-512.png'
];

// Installation : on télécharge et range tous les fichiers.
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (cache) { return cache.addAll(FICHIERS); }).then(function () { return self.skipWaiting(); }));
});

// Activation : on supprime les anciens caches.
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (cles) {
    return Promise.all(cles.filter(function (c) { return c !== VERSION; }).map(function (c) { return caches.delete(c); }));
  }).then(function () { return self.clients.claim(); }));
});

// Chaque requête : réponse du cache tout de suite, mise à jour en arrière-plan.
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(VERSION).then(function (cache) {
    return cache.match(e.request).then(function (enCache) {
      const reseau = fetch(e.request).then(function (reponse) {
        if (reponse.ok && new URL(e.request.url).origin === location.origin) cache.put(e.request, reponse.clone());
        return reponse;
      }).catch(function () { return enCache; });
      return enCache || reseau;
    });
  }));
});
