import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl font-black text-white tracking-widest mb-3">
              DRIP<span className="text-amber-400">.</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Streetwear premium. Les meilleures pièces, livrées chez toi.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Shop</h4>
            <div className="space-y-2">
              {['Sneakers', 'Bags', 'T-Shirts', 'Hoodies', 'Pants'].map(cat => (
                <Link
                  key={cat}
                  href={`/products?cat=${cat.toLowerCase()}`}
                  className="block text-gray-500 hover:text-amber-400 text-sm transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Info</h4>
            <div className="space-y-2">
              <p className="text-gray-500 text-sm">Livraison 5-10 jours ouvrés</p>
              <p className="text-gray-500 text-sm">Retours sous 30 jours</p>
              <p className="text-gray-500 text-sm">Paiement sécurisé</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} DRIP. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
