const {chromium} = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const V = path.join(__dirname, 'vendor');
const local = {
  'react@18.3.1': path.join(V, 'react.js'),
  'react-dom@18.3.1': path.join(V, 'react-dom.js'),
  '@babel/standalone': path.join(V, 'babel.js'),
};

const CSS_ARCHIVO = `
@font-face{font-family:'Archivo';font-weight:600;src:url('file://${V}/archivo-600.ttf') format('truetype');}
@font-face{font-family:'Archivo';font-weight:700;src:url('file://${V}/archivo-700.ttf') format('truetype');}
@font-face{font-family:'Archivo';font-weight:400;src:url('file://${V}/archivo-600.ttf') format('truetype');}
@font-face{font-family:'Archivo';font-weight:500;src:url('file://${V}/archivo-600.ttf') format('truetype');}
`;

(async () => {
  const b = await chromium.launch();
  const jobs = [
    ['Main.dc.html',   390,  'accueil-telephone.jpg'],
    ['Fiche.dc.html',  390,  'fiche-produit.jpg'],
    ['Bureau.dc.html', 1280, 'accueil-ordinateur.jpg'],
  ];

  for (const [file, w, out] of jobs) {
    const p = await b.newPage({viewport:{width:w, height:900}, deviceScaleFactor:1});

    // on sert les bibliotheques depuis le disque : le navigateur du rendu ne sort pas
    await p.route('**/*', async (route) => {
      const u = route.request().url();
      if (u.startsWith('file://')) return route.continue();
      for (const [key, f] of Object.entries(local)) {
        if (u.includes(key)) {
          return route.fulfill({status:200, contentType:'application/javascript',
                                body: fs.readFileSync(f, 'utf8')});
        }
      }
      if (u.includes('fonts.googleapis.com')) {
        return route.fulfill({status:200, contentType:'text/css', body: CSS_ARCHIVO});
      }
      return route.abort();
    });

    p.on('pageerror', e => console.log(file, 'ERREUR:', e.message));
    await p.goto('file://' + path.join(__dirname, 'project', file));
    await p.waitForTimeout(3500);
    const h = await p.evaluate(() => document.body.scrollHeight);
    console.log(file, '→', h, 'px de haut');
    if (!h) { await p.close(); continue; }
    await p.screenshot({path: out, type:'jpeg', quality: 78, fullPage: true});
    await p.close();
  }
  await b.close();
})();
