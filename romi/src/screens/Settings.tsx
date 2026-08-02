import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getStore } from '../data/stores'
import { MEAL_LABELS } from '../i18n/strings'
import { Button, Icon } from '../components/ui'
import LangToggle from '../components/LangToggle'
import BottomNav from '../components/BottomNav'
import { fmtMAD0 } from '../lib/pricing'

export default function Settings() {
  const { t, lang, state, regenerate, logout, simulateTrialEnd, trial } = useApp()
  const nav = useNavigate()
  const o = state.onboarding
  const store = getStore(o.storeId)

  const Row = ({ label, value, to }: { label: string; value: string; to: string }) => (
    <button onClick={() => nav(to)} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%', textAlign: 'start', marginBottom: 10 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</div>
        <div style={{ fontWeight: 700 }}>{value}</div>
      </div>
      <Icon name="back" size={16} />
    </button>
  )

  return (
    <div className="screen scroll">
      <h1 className="title" style={{ paddingTop: 12, fontSize: 26 }}>{t('settings_title')}</h1>

      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, marginBottom: 18 }}>
        <span style={{ fontWeight: 700 }}>{t('lang_label')}</span>
        <LangToggle />
      </div>

      <div className="section-label">{t('prefs_title')}</div>
      <Row label={t('your_store')} value={store.name} to="/ob/store" />
      <Row label={t('your_budget')} value={fmtMAD0(o.budget)} to="/ob/budget" />
      <Row label={t('your_people')} value={String(o.people)} to="/ob/people" />
      <Row label={t('your_meals')} value={o.mealsPerDay.map((m) => MEAL_LABELS[m][lang]).join(', ')} to="/ob/meals" />

      <div style={{ marginTop: 14 }}>
        <Button variant="ghost" onClick={() => { regenerate(); nav('/plan') }}>
          <Icon name="refresh" size={18} /> {t('regenerate')}
        </Button>
      </div>

      {trial && (
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginTop: 18 }}>
          {trial.expired ? '🔒' : '🎁'} {trial.daysLeft} {t('trial_left')}
        </div>
      )}

      {/* Test helper: preview the end-of-trial paywall + notification */}
      <button
        onClick={() => { simulateTrialEnd(); nav('/trial') }}
        style={{ width: '100%', marginTop: 10, color: 'var(--muted)', fontSize: 13, textDecoration: 'underline' }}
      >
        ⓘ simuler la fin de l'essai (test)
      </button>

      <div className="spacer" />
      <button onClick={() => { logout(); nav('/auth') }} style={{ width: '100%', margin: '20px 0 8px', color: '#c0392b', fontWeight: 700, fontSize: 15 }}>
        {t('logout')}
      </button>

      <BottomNav active="settings" />
    </div>
  )
}
