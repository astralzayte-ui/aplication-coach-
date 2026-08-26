import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dbDir, 'store.db');

// Ensure data dir exists
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Create tables if not exist (in case DB is fresh)
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    original_price REAL,
    category TEXT NOT NULL,
    image_url TEXT,
    supplier_url TEXT,
    supplier_name TEXT,
    stock INTEGER DEFAULT 100,
    sizes TEXT DEFAULT '[]',
    colors TEXT DEFAULT '[]',
    featured INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_postal TEXT NOT NULL,
    shipping_country TEXT NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    payment_intent TEXT,
    fulfillment_status TEXT DEFAULT 'pending',
    fulfillment_log TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Default settings
const defaults = [
  ['store_name', 'DRIP STORE'],
  ['admin_password', 'admin123'],
  ['currency', 'EUR'],
  ['auto_fulfill', 'false'],
];
const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
for (const [k, v] of defaults) insertSetting.run(k, v);

// ── Product to add ──────────────────────────────
const product = {
  name: 'Gucci GG Supreme Backpack',
  description: 'Sac à dos Gucci GG Supreme en toile enduite noire. Bretelles réglables avec bande Gucci Web rouge et bleu. Fermeture zippée, poche frontale zippée. Format idéal pour le quotidien.',
  price: 89.99,
  original_price: 149.99,
  category: 'bags',
  image_url: '',  // Tu peux uploader la photo via l'admin panel
  supplier_url: 'https://item.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D7821573553&affcode=skilly88',
  supplier_name: 'KakoBuy',
  stock: 50,
  sizes: JSON.stringify([]),
  colors: JSON.stringify(['Noir']),
  featured: 1,
  active: 1,
};

const existing = db.prepare('SELECT id FROM products WHERE name = ?').get(product.name);
if (existing) {
  console.log(`⚠️  Produit déjà existant (id: ${existing.id}), mise à jour...`);
  db.prepare(`
    UPDATE products SET
      description=?, price=?, original_price=?, category=?,
      supplier_url=?, supplier_name=?, stock=?, sizes=?, colors=?,
      featured=?, active=?
    WHERE name=?
  `).run(
    product.description, product.price, product.original_price, product.category,
    product.supplier_url, product.supplier_name, product.stock, product.sizes, product.colors,
    product.featured, product.active, product.name
  );
  console.log('✅ Mis à jour !');
} else {
  const result = db.prepare(`
    INSERT INTO products (name, description, price, original_price, category, image_url, supplier_url, supplier_name, stock, sizes, colors, featured, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    product.name, product.description, product.price, product.original_price,
    product.category, product.image_url, product.supplier_url, product.supplier_name,
    product.stock, product.sizes, product.colors, product.featured, product.active
  );
  console.log(`✅ Produit ajouté ! ID: ${result.lastInsertRowid}`);
}

// Show all products
const all = db.all ? db.prepare('SELECT id, name, price, category FROM products').all() : [];
console.log('\n📦 Tous les produits en base :');
for (const p of all) {
  console.log(`  [${p.id}] ${p.name} — ${p.price}€ (${p.category})`);
}

db.close();
