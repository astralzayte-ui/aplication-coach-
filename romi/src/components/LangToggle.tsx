import { useApp } from '../context/AppContext'
import type { Lang } from '../data/types'

const LABELS: Record<Lang, string> = { fr: 'FR', ar: 'ع', en: 'EN' }

export default function LangToggle() {
  const { lang, setLang } = useApp()
  return (
    <div style={{ display: 'inline-flex', background: 'var(--card-2)', borderRadius: 999, padding: 3, border: '1px solid var(--line)' }}>
      {(['fr', 'en', 'ar'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            padding: '6px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700,
            color: lang === l ? 'var(--accent-ink)' : 'var(--muted)',
            background: lang === l ? 'var(--accent)' : 'transparent',
          }}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  )
}
