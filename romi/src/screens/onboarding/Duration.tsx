import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Button, Icon, TopBar } from '../../components/ui'
import { durationLabel } from '../../i18n/strings'

export default function Duration() {
  const { t, lang, state, updateOnboarding } = useApp()
  const nav = useNavigate()
  const weeks = state.onboarding.durationWeeks

  return (
    <div className="screen">
      <TopBar progress={0.12} />
      <h1 className="title">{t('duration_title')}</h1>
      <p className="subtitle">{t('duration_sub')}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1, 2, 3, 4].map((w) => {
          const on = weeks === w
          return (
            <button
              key={w}
              onClick={() => updateOnboarding({ durationWeeks: w })}
              className="card"
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: 18, textAlign: 'start',
                border: on ? '3px solid var(--green-500)' : '3px solid transparent',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: on ? 'var(--green-soft)' : 'var(--bg-soft)', color: on ? 'var(--green-700)' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
                {w}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{durationLabel(w, lang)}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{w * 7} {lang === 'ar' ? 'يوم' : 'jours'}</div>
              </div>
              {on && <Icon name="check" size={20} />}
            </button>
          )
        })}
      </div>

      <div className="spacer" />
      <div className="cta-wrap">
        <Button onClick={() => nav('/ob/budget')}>{t('continue')}</Button>
      </div>
    </div>
  )
}
