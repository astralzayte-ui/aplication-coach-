import { useApp } from '../context/AppContext'
import type { Lang } from '../data/types'

const LANGS: { id: Lang; label: string; native: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
  { id: 'fr', label: 'Français', native: 'Continue en français', flag: '🇫🇷', dir: 'ltr' },
  { id: 'ar', label: 'العربية', native: 'تابع بالعربية', flag: '🇲🇦', dir: 'rtl' },
  { id: 'en', label: 'English', native: 'Continue in English', flag: '🇬🇧', dir: 'ltr' },
]

export default function LangPicker({ onDone }: { onDone: () => void }) {
  const { setLang } = useApp()

  function pick(lang: Lang) {
    setLang(lang)
    onDone()
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      background: 'var(--bg)',
    }}>
      {/* Logo */}
      <div style={{ fontSize: 52, marginBottom: 8 }}>🌿</div>
      <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', marginBottom: 8, color: 'var(--ink)' }}>
        Romi
      </div>
      <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 48, textAlign: 'center' }}>
        Meal planning · تخطيط الوجبات · Planification
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 320 }}>
        {LANGS.map((l) => (
          <button
            key={l.id}
            onClick={() => pick(l.id)}
            dir={l.dir}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '18px 22px',
              borderRadius: 18,
              border: '2px solid var(--line)',
              background: 'var(--bg-soft)',
              cursor: 'pointer',
              textAlign: l.dir === 'rtl' ? 'right' : 'left',
              transition: 'border-color .15s, background .15s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-soft)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-soft)'
            }}
          >
            <span style={{ fontSize: 28 }}>{l.flag}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink)' }}>{l.label}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{l.native}</div>
            </div>
            <span style={{ color: 'var(--accent)', fontSize: 18 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
