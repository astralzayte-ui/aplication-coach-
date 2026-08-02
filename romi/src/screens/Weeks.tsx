import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icon } from '../components/ui'

export default function Weeks() {
  const { t, state } = useApp()
  const nav = useNavigate()

  const rows = [
    { key: 'current', title: t('week_current'), locked: false },
    { key: 'w2', title: `${t('week_n')} 2`, locked: true },
    { key: 'w3', title: `${t('week_n')} 3`, locked: true },
    { key: 'w4', title: `${t('week_n')} 4`, locked: true },
    { key: 'month', title: t('month_current'), locked: true },
  ]

  return (
    <div className="screen scroll">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10, marginBottom: 18 }}>
        <button onClick={() => nav('/plan')} className="back-btn"><Icon name="back" size={20} /></button>
        <h1 className="title" style={{ margin: 0, fontSize: 26 }}>{t('weeks_title')}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map((r) => (
          <button
            key={r.key}
            onClick={() => (r.locked ? nav('/trial') : nav('/plan'))}
            className="card"
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 18, textAlign: 'start', opacity: r.locked ? 0.9 : 1 }}
          >
            <div style={{ width: 46, height: 46, borderRadius: 12, background: r.locked ? 'var(--bg-soft)' : 'var(--green-soft)', color: r.locked ? 'var(--muted)' : 'var(--green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={r.locked ? 'lock' : 'check'} size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{r.title}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{r.locked ? t('locked_hint') : t('week_current')}</div>
            </div>
            {r.locked && <span className="tag" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>🔒</span>}
          </button>
        ))}
      </div>

      {state.trialStartISO && (
        <button onClick={() => nav('/trial')} className="card" style={{ marginTop: 20, padding: 18, textAlign: 'center', fontWeight: 700, color: 'var(--green-700)', background: 'var(--green-soft)' }}>
          🔓 {t('premium_locked')}
        </button>
      )}
    </div>
  )
}
