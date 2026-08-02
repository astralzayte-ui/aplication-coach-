import { useApp } from '../context/AppContext'

export default function LangToggle() {
  const { lang, setLang } = useApp()
  return (
    <div style={{ display: 'inline-flex', background: '#fff', borderRadius: 999, padding: 3, boxShadow: 'var(--shadow-sm)' }}>
      {(['fr', 'ar'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700,
            color: lang === l ? '#fff' : 'var(--muted)',
            background: lang === l ? 'var(--green-800)' : 'transparent',
          }}
        >
          {l === 'fr' ? 'FR' : 'ع'}
        </button>
      ))}
    </div>
  )
}
