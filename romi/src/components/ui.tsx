import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Recipe, Tag } from '../data/types'
import { locStr } from '../data/types'
import { TAG_LABELS } from '../i18n/strings'
import type { Lang } from '../data/types'
import { INLINE_PHOTOS } from '../data/photos'

// ---------- Icons ----------
export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const s = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'back': return <svg {...s}><path d="M15 18l-6-6 6-6" /></svg>
    case 'arrow-up': return <svg {...s}><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    case 'chevron-down': return <svg {...s}><path d="M6 9l6 6 6-6" /></svg>
    case 'chevron-up': return <svg {...s}><path d="M6 15l6-6 6 6" /></svg>
    case 'check': return <svg {...s}><path d="M20 6L9 17l-5-5" /></svg>
    case 'plus': return <svg {...s}><path d="M12 5v14M5 12h14" /></svg>
    case 'minus': return <svg {...s}><path d="M5 12h14" /></svg>
    case 'lock': return <svg {...s}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
    case 'share': return <svg {...s}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>
    case 'copy': return <svg {...s}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 012-2h10" /></svg>
    case 'cart': return <svg {...s}><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.4 12.4A2 2 0 009.4 17h8a2 2 0 002-1.6L21 7H6" /></svg>
    case 'clock': return <svg {...s}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
    case 'person': return <svg {...s}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
    case 'flame': return <svg {...s}><path d="M12 3c2 4 5 5 5 9a5 5 0 01-10 0c0-2 1-3 2-4 .5 1 1.5 1.5 2 1 0-2-1-4 1-6z" /></svg>
    case 'refresh': return <svg {...s}><path d="M21 12a9 9 0 11-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>
    case 'settings': return <svg {...s}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 00-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 00-1.7-1l-.3-2.5H9.4l-.3 2.5a7 7 0 00-1.7 1l-2.3-1-2 3.4L5 11a7 7 0 000 2l-2 1.5 2 3.4 2.3-1a7 7 0 001.7 1l.3 2.5h4.2l.3-2.5a7 7 0 001.7-1l2.3 1 2-3.4L19 13a7 7 0 000-1z" /></svg>
    case 'sliders': return <svg {...s}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></svg>
    case 'list': return <svg {...s}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
    case 'whatsapp': return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.7-.83-1.96-.93-.26-.1-.45-.15-.64.15-.19.29-.74.92-.9 1.11-.17.19-.33.21-.62.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.6-2-.17-.29-.02-.44.13-.59.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.76 1.17 2.95c.15.19 2 3.05 4.85 4.28.68.29 1.2.47 1.61.6.68.22 1.29.19 1.78.11.54-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12 2a10 10 0 00-8.6 15.06L2 22l5.06-1.33A10 10 0 1012 2z" /></svg>
    case 'oven': return <svg {...s}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M4 9h16M8 6h.01M12 6h.01" /><rect x="7" y="12" width="10" height="6" rx="1" /></svg>
    case 'stove': return <svg {...s}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="2" /><circle cx="15.5" cy="8.5" r="2" /><circle cx="8.5" cy="15.5" r="2" /><circle cx="15.5" cy="15.5" r="2" /></svg>
    case 'airfryer': return <svg {...s}><rect x="5" y="3" width="14" height="18" rx="4" /><path d="M9 3v3M15 3v3M8 17h8" /></svg>
    case 'grill': return <svg {...s}><circle cx="12" cy="10" r="7" /><path d="M8 8h8M8 11h8M9 21l1.5-4M15 21l-1.5-4" /></svg>
    case 'pot': return <svg {...s}><path d="M4 9h16v7a3 3 0 01-3 3H7a3 3 0 01-3-3z" /><path d="M2 9h20M8 6l1-2M15 4l1 2" /></svg>
    default: return null
  }
}

export function equipmentIcon(id: string) {
  return { four: 'oven', plaque: 'stove', air_fryer: 'airfryer', grill: 'grill', mijoteuse: 'pot' }[id] ?? 'stove'
}

// ---------- Top bar ----------
export function TopBar({ progress, onBack }: { progress?: number; onBack?: () => void }) {
  const nav = useNavigate()
  return (
    <div className="topbar">
      <button className="back-btn" onClick={() => (onBack ? onBack() : nav(-1))} aria-label="back">
        <Icon name="back" size={20} />
      </button>
      {progress !== undefined && (
        <div className="progress"><span style={{ width: `${Math.round(progress * 100)}%` }} /></div>
      )}
    </div>
  )
}

// ---------- Button ----------
export function Button({ children, onClick, disabled, variant = 'primary' }: {
  children: ReactNode; onClick?: () => void; disabled?: boolean; variant?: 'primary' | 'ghost'
}) {
  return (
    <button
      className={`btn ${disabled ? 'btn-disabled' : variant === 'ghost' ? 'btn-ghost' : 'btn-primary'}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// ---------- Recipe "photo" ----------
const GRADIENTS = [
  ['#f6d9b0', '#e9a978'], ['#d7ecc4', '#9fd39a'], ['#f6c9c9', '#e78f8f'],
  ['#cfe0f5', '#9bb8e6'], ['#f3d1e2', '#d99cc0'], ['#e6dcc4', '#c9b98f'],
  ['#d6e9df', '#9dcbb4'], ['#f8e3b8', '#eec072'],
]
function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) }

export function RecipePhoto({ recipe, height, radius = 16 }: { recipe: Recipe; height: number | string; radius?: number }) {
  const [a, b] = GRADIENTS[hash(recipe.id) % GRADIENTS.length]
  const [imgOk, setImgOk] = useState(true)
  const [imgLoaded, setImgLoaded] = useState(false)
  // Priority: an inlined data-URI photo (works everywhere, incl. the offline
  // artifact preview) → a file at public/plats/<id>.jpg (dropped in for the
  // web build) → the emoji tile as a graceful fallback.
  const key = recipe.image ?? recipe.id
  const src = INLINE_PHOTOS[key] ?? `./plats/${key}.jpg`
  // Show emoji only when no photo has loaded yet (fallback mode)
  const showEmoji = !imgOk || !imgLoaded
  return (
    <div style={{
      height, width: '100%', borderRadius: radius, position: 'relative', overflow: 'hidden',
      background: `radial-gradient(120% 120% at 30% 20%, ${a}, ${b})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {imgOk && (
        <img
          src={src} alt="" loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgOk(false); setImgLoaded(false) }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {showEmoji && (
        <span style={{ fontSize: typeof height === 'number' ? Math.min(height * 0.5, 90) : 46, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.15))' }}>
          {recipe.emoji}
        </span>
      )}
    </div>
  )
}

// ---------- Tags ----------
export function TagChip({ tag, lang }: { tag: Tag; lang: Lang }) {
  return <span className={`tag tag-${tag}`}>{locStr(TAG_LABELS[tag], lang)}</span>
}
