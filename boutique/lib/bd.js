/* SILENCE — la base de chiffres chez Cloudflare (D1, nom « silence-compteur »).
   Les tables se créent toutes seules au premier appel. */
export const TABLES = [
  'CREATE TABLE IF NOT EXISTS signaux (jour TEXT, signal TEXT, video TEXT, n INTEGER DEFAULT 0, PRIMARY KEY (jour, signal, video))',
  'CREATE TABLE IF NOT EXISTS articles (jour TEXT, cle TEXT, n INTEGER DEFAULT 0, PRIMARY KEY (jour, cle))',
  'CREATE TABLE IF NOT EXISTS commandes (id INTEGER PRIMARY KEY AUTOINCREMENT, jour TEXT, video TEXT, total REAL, articles INTEGER)',
  'CREATE TABLE IF NOT EXISTS inscrits (email TEXT PRIMARY KEY, source TEXT, accord TEXT, video TEXT, jour TEXT)'
];

let pret = false;
export async function preparer(db) {
  if (pret) return;
  await db.batch(TABLES.map((t) => db.prepare(t)));
  pret = true;
}
