import type { Store } from './types'

// Moroccan supermarkets. Prices are computed from a reference basket and scaled
// by each store's multiplier (Bim = hard discount, Carrefour = premium).
export const STORES: Store[] = [
  { id: 'marjane', name: 'Marjane', bg: '#e8751a', fg: '#ffffff', multiplier: 0.98 },
  { id: 'carrefour', name: 'Carrefour', bg: '#004e9e', fg: '#ffffff', multiplier: 1.06 },
  { id: 'carrefour_market', name: 'Carrefour Market', bg: '#0e8f6e', fg: '#ffffff', multiplier: 1.0 },
  { id: 'bim', name: 'BIM', bg: '#e30613', fg: '#ffffff', multiplier: 0.82 },
]

export const getStore = (id: string | null): Store =>
  STORES.find((s) => s.id === id) ?? STORES[0]
