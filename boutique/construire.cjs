/* Fabrique la boutique publiable.   node boutique/construire.cjs  →  boutique/dist/ */
const fs = require('fs'), path = require('path');
const ICI = __dirname, OUT = path.join(ICI, 'dist'), LEGAL = path.join(ICI, '..', 'partage', 'legal');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* ---- les 3 pages de la boutique : _tete + corps + _queue ---- */
const T = n => fs.readFileSync(path.join(ICI, n), 'utf8');
for (const [nom, titre] of [['index', 'SILENCE — Tu parles pas. Tu portes.'], ['produit', 'SILENCE'], ['collection', 'La boutique — SILENCE']]) {
  const page = T('_tete.html').replace('__TITRE__', titre) + T('_' + nom + '.corps') + T('_queue.html');
  fs.writeFileSync(path.join(ICI, nom + '.html'), page);      // gardé à côté, pour les tests
  fs.writeFileSync(path.join(OUT, nom + '.html'), page);
}
for (const f of ['style.css', 'polices.css', 'data.js', 'app.js', 'panier.js'])
  fs.copyFileSync(path.join(ICI, f), path.join(OUT, f));
for (const d of ['img', 'polices'])
  fs.cpSync(path.join(ICI, d), path.join(OUT, d), { recursive: true });

/* ---- les pages légales ---- */
const tete = fs.readFileSync(path.join(ICI, '_tete.html'), 'utf8');
const queue = fs.readFileSync(path.join(ICI, '_queue.html'), 'utf8');
const echap = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const enligne = s => echap(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>')
  .replace(/`(.+?)`/g, '<code>$1</code>')
  .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="text-decoration:underline">$1</a>');

function convertir(md) {
  // on retire les notes de travail (les blocs « > 🟠 » et « > 🔴 ») : elles sont pour nous, pas pour le client
  md = md.replace(/(^|\n)(>[^\n]*\n?)+/g, bloc => /🟠|🔴/.test(bloc) ? '\n' : bloc);
  const L = md.split('\n'), out = []; let i = 0;
  while (i < L.length) {
    const l = L[i];
    if (l.startsWith('```')) { i++; const b = []; while (i < L.length && !L[i].startsWith('```')) b.push(echap(L[i++])); out.push('<pre>' + b.join('\n') + '</pre>'); i++; continue; }
    if (l.startsWith('|') && L[i + 1] && /^\|[\s:\-|]+\|$/.test(L[i + 1].trim())) {
      const tete = l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()); i += 2;
      const corps = []; while (i < L.length && L[i].startsWith('|')) corps.push(L[i++].trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
      out.push('<table><thead><tr>' + tete.map(c => '<th>' + enligne(c) + '</th>').join('') + '</tr></thead><tbody>' +
        corps.map(r => '<tr>' + r.map(c => '<td>' + enligne(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>'); continue;
    }
    let m = l.match(/^(#{1,4})\s+(.*)/);
    if (m) { out.push(`<h${m[1].length}>${enligne(m[2])}</h${m[1].length}>`); i++; continue; }
    if (/^(---+|\*\*\*+)\s*$/.test(l)) { i++; continue; }
    if (l.startsWith('>')) { const b = []; while (i < L.length && L[i].startsWith('>')) b.push(L[i++].replace(/^>\s?/, '')); out.push('<blockquote>' + enligne(b.join(' ')) + '</blockquote>'); continue; }
    if (/^[-*]\s+/.test(l)) { const b = []; while (i < L.length && /^[-*]\s+/.test(L[i])) b.push(enligne(L[i++].replace(/^[-*]\s+/, ''))); out.push('<ul>' + b.map(x => '<li>' + x + '</li>').join('') + '</ul>'); continue; }
    if (/^\d+\.\s+/.test(l)) { const b = []; while (i < L.length && /^\d+\.\s+/.test(L[i])) b.push(enligne(L[i++].replace(/^\d+\.\s+/, ''))); out.push('<ol>' + b.map(x => '<li>' + x + '</li>').join('') + '</ol>'); continue; }
    if (!l.trim()) { i++; continue; }
    const para = []; while (i < L.length && L[i].trim() && !/^(#{1,4}\s|[-*]\s|\d+\.\s|>|\||```|---)/.test(L[i])) para.push(L[i++].trim());
    if (para.length) out.push('<p>' + enligne(para.join(' ')) + '</p>');
  }
  return out.join('\n');
}

const PAGES = [
  ['mentions-legales', 'Mentions légales', 'mentions-legales.html'],
  ['cgv', 'Conditions générales de vente', 'cgv.html'],
  ['formulaire-retractation', 'Formulaire de rétractation', 'retractation.html'],
  ['confidentialite', 'Confidentialité', 'confidentialite.html'],
  ['remboursements', 'Retours et remboursements', 'remboursements.html'],
];
for (const [nom, titre, fichier] of PAGES) {
  const md = fs.readFileSync(path.join(LEGAL, nom + '.md'), 'utf8');
  const corpsMd = convertir(md);
  const reste = (corpsMd.match(/\[[^\]<>]{2,60}\]/g) || []).length;
  const avert = reste ? `<div class="avert">⚠️ Page en cours de finalisation — ${reste} information(s) restent à compléter avant l'ouverture.</div>` : '';
  fs.writeFileSync(path.join(OUT, fichier),
    tete.replace('__TITRE__', titre + ' — SILENCE') +
    `<body data-page="legal">\n<div id="entete"></div>\n<main class="enveloppe"><article class="legal">${avert}\n${corpsMd}\n</article></main>\n` + queue);
}

/* ---- Netlify : les formulaires et les adresses propres ---- */
fs.writeFileSync(path.join(OUT, '_headers'), '/*\n  X-Robots-Tag: noindex\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
fs.writeFileSync(path.join(OUT, '404.html'), tete.replace('__TITRE__', 'Page introuvable — SILENCE') +
  '<body><div id="entete"></div><main class="enveloppe" style="padding-block:80px;text-align:center"><h1 style="font-size:44px;margin-bottom:16px">PAGE INTROUVABLE</h1><p style="color:var(--texte-doux);margin-bottom:28px">Cette page n\'existe pas, ou plus.</p><a class="btn btn-plein" href="index.html">Retour à la boutique</a></main>' + queue);

console.log('construit →', fs.readdirSync(OUT).filter(f => f.endsWith('.html')).length, 'pages dans boutique/dist/');
