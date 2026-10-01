/* Fabrique le site publiable à partir des sources.
   node site/construire.cjs  →  site/build/ */
const fs = require('fs'), path = require('path');
const ICI = __dirname, SRC = path.join(ICI, 'project'), OUT = path.join(ICI, 'build');
const LEGAL = path.join(ICI, '..', 'partage', 'legal');

const ECRANS = { 'Bureau.dc.html': 'index.html', 'Main.dc.html': 'telephone.html', 'Fiche.dc.html': 'fiche.html' };
const PAGES_LEGALES = [
  ['mentions-legales', 'Mentions légales', 'mentions-legales.html'],
  ['cgv', 'Conditions générales de vente', 'cgv.html'],
  ['formulaire-retractation', 'Formulaire de rétractation', 'retractation.html'],
  ['confidentialite', 'Confidentialité', 'confidentialite.html'],
];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* ---- les 3 écrans ---- */
for (const [de, vers] of Object.entries(ECRANS)) {
  let t = fs.readFileSync(path.join(SRC, de), 'utf8');
  for (const [x, y] of Object.entries(ECRANS)) t = t.split('href="' + x + '"').join('href="' + y + '"');
  fs.writeFileSync(path.join(OUT, vers), t);
}
for (const f of ['support.js', 'panier.js']) fs.copyFileSync(path.join(SRC, f), path.join(OUT, f));
fs.cpSync(path.join(SRC, 'img'), path.join(OUT, 'img'), { recursive: true });

/* ---- les 4 pages légales, depuis le markdown ---- */
const CSS = `
*{box-sizing:border-box}
body{margin:0;overflow-x:hidden;background:#0B0B0C;color:#F4F2ED;font-family:Archivo,system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.7}
.enveloppe{min-width:0;max-width:720px;margin:0 auto;padding:40px 20px 90px}
a{color:#A5D8F3}
h1{font-size:30px;line-height:1.15;font-weight:700;margin:0 0 26px}
h2{font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#A5D8F3;font-weight:600;margin:46px 0 14px}
h3{font-size:18px;font-weight:600;margin:30px 0 10px}
h4{font-size:14px;font-weight:600;margin:24px 0 8px;color:#B8BEC8}
p{margin:0 0 14px}
strong{color:#fff;font-weight:600}
hr{border:none;border-top:1px dashed #26323C;margin:34px 0}
ul,ol{margin:0 0 16px;padding-left:22px}
li{margin-bottom:6px}
blockquote{margin:0 0 18px;padding:10px 0 10px 16px;border-left:2px solid #A5D8F3;color:#B8BEC8}
/* un tableau ne rétrécit pas : on le laisse défiler tout seul */
table{display:block;max-width:100%;overflow-x:auto;border-collapse:collapse;margin:0 0 20px;font-size:14.5px}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid #1E1E26;vertical-align:top}
th{color:#A5D8F3;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:600}
pre{max-width:100%;background:#131318;border:1px solid #1E1E26;padding:16px;overflow-x:auto;font-size:13.5px;line-height:1.7;margin:0 0 18px}
code{font-family:ui-monospace,Menlo,Consolas,monospace}
.haut{display:flex;align-items:center;gap:10px;padding:18px 20px;border-bottom:1px solid #1E1E26}
.haut img{width:26px;height:29px;object-fit:contain;mix-blend-mode:screen;display:block}
.haut span{font-size:12px;letter-spacing:.3em;text-transform:uppercase;font-weight:500}
.avert{background:#2A1C0B;border:1px solid #E0A458;color:#F0D0A0;padding:14px 16px;margin:0 0 30px;font-size:14px}
.pied{border-top:1px dashed #26323C;margin-top:50px;padding-top:24px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;line-height:2.4}
`;

const echap = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function enligne(s) {
  s = echap(s);
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/`(.+?)`/g, '<code>$1</code>');
  s = s.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  return s;
}
function convertir(md) {
  const L = md.split('\n'), out = []; let i = 0;
  while (i < L.length) {
    const l = L[i];
    if (l.startsWith('```')) { i++; const bloc = []; while (i < L.length && !L[i].startsWith('```')) bloc.push(echap(L[i++])); out.push('<pre><code>' + bloc.join('\n') + '</code></pre>'); i++; continue; }
    if (l.startsWith('|') && L[i + 1] && /^\|[\s:\-|]+\|$/.test(L[i + 1].trim())) {
      const tete = l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()); i += 2;
      const corps = []; while (i < L.length && L[i].startsWith('|')) corps.push(L[i++].trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
      out.push('<table><thead><tr>' + tete.map(c => '<th>' + enligne(c) + '</th>').join('') + '</tr></thead><tbody>' +
        corps.map(r => '<tr>' + r.map(c => '<td>' + enligne(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>'); continue;
    }
    let m = l.match(/^(#{1,4})\s+(.*)/);
    if (m) { out.push(`<h${m[1].length}>${enligne(m[2])}</h${m[1].length}>`); i++; continue; }
    if (/^(---+|\*\*\*+)\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (l.startsWith('> ')) { const bloc = []; while (i < L.length && L[i].startsWith('>')) bloc.push(L[i++].replace(/^>\s?/, '')); out.push('<blockquote>' + enligne(bloc.join(' ')) + '</blockquote>'); continue; }
    if (/^[-*]\s+/.test(l)) { const bloc = []; while (i < L.length && /^[-*]\s+/.test(L[i])) bloc.push(enligne(L[i++].replace(/^[-*]\s+/, ''))); out.push('<ul>' + bloc.map(x => '<li>' + x + '</li>').join('') + '</ul>'); continue; }
    if (/^\d+\.\s+/.test(l)) { const bloc = []; while (i < L.length && /^\d+\.\s+/.test(L[i])) bloc.push(enligne(L[i++].replace(/^\d+\.\s+/, ''))); out.push('<ol>' + bloc.map(x => '<li>' + x + '</li>').join('') + '</ol>'); continue; }
    if (!l.trim()) { i++; continue; }
    const para = []; while (i < L.length && L[i].trim() && !/^(#{1,4}\s|[-*]\s|\d+\.\s|>|\||```|---)/.test(L[i])) para.push(L[i++].trim());
    if (para.length) out.push('<p>' + enligne(para.join(' ')) + '</p>');
  }
  return out.join('\n');
}

const PIED = `<div class="pied">
<a href="mentions-legales.html">Mentions légales</a> ·
<a href="cgv.html">CGV</a> ·
<a href="retractation.html">Rétractation</a> ·
<a href="confidentialite.html">Confidentialité</a> ·
<a href="index.html">La boutique</a>
</div>`;

for (const [nom, titre, fichier] of PAGES_LEGALES) {
  const md = fs.readFileSync(path.join(LEGAL, nom + '.md'), 'utf8');
  const reste = (md.match(/\[[^\]]{2,40}\]/g) || []).length;
  const avert = reste ? `<div class="avert">⚠️ Page en brouillon — ${reste} mention(s) restent à remplir. Le site n'est pas encore public.</div>` : '';
  fs.writeFileSync(path.join(OUT, fichier),
`<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>SILENCE — ${titre}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap">
<style>${CSS}</style></head><body>
<div class="haut"><img src="img/s.png" alt=""><span>Silence</span></div>
<div class="enveloppe">
${avert}
${convertir(md)}
${PIED}
</div></body></html>`);
}

console.log('construit →', fs.readdirSync(OUT).filter(f => f.endsWith('.html')).length, 'pages dans site/build/');
