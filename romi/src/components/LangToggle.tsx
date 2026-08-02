import { useApp } from '../context/AppContext'

export default function LangToggle() {
  const { lang, setLang } = useApp()
  return (
    <div style={{ display: 'inline-flex', background: 'var(--card-2)', borderRadius: 999, padding: 3, border: '1px solid var(--line)' }}>
      {(['fr', 'ar'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700,
            color: lang === l ? 'var(--accent-ink)' : 'var(--muted)',
            background: lang === l ? 'var(--accent)' : 'transparent',
          }}
        >
          {l === 'fr' ? 'FR' : 'ع'}
        </button>
      ))}
    </div>
  )
}
