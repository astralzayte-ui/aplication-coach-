import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getStore } from '../data/stores'
import { MEAL_LABELS, durationLabel } from '../i18n/strings'
import { Button, Icon } from '../components/ui'
import LangToggle from '../components/LangToggle'
import BottomNav from '../components/BottomNav'
import { fmtMAD0 } from '../lib/pricing'

export default function Settings() {
  const { t, lang, state, regenerate, resetAll, logout, simulateTrialEnd, trial } = useApp()
  const nav = useNavigate()
  const o = state.onboarding
  const store = getStore(o.storeId)
  const [confirmReset, setConfirmReset] = useState(false)

  const Row = ({ label, value, to }: { label: string; value: string; to: string }) => (
    <button onClick={() => nav(to)} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%', textAlign: 'start', marginBottom: 10 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</div>
        <div style={{ fontWeight: 700 }}>{value}</div>
      </div>
      <Icon name="back" size={16} />
    </button>
  )

  const ActionRow = ({ icon, title, sub, onClick, danger }: { icon: string; title: string; sub: string; onClick: () => void; danger?: boolean }) => (
    <button onClick={onClick} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, width: '100%', textAlign: 'start', marginBottom: 10 }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: danger ? '#fdecea' : 'var(--green-soft)', color: danger ? '#c0392b' : 'var(--green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: danger ? '#c0392b' : 'var(--ink)' }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>{sub}</div>
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
      <Row label={t('your_budget')} value={`${fmtMAD0(o.budget)} · ${durationLabel(o.durationWeeks, lang)}`} to="/ob/budget" />
      <Row label={t('your_people')} value={String(o.people)} to="/ob/people" />
      <Row label={t('your_meals')} value={o.mealsPerDay.map((m) => MEAL_LABELS[m][lang]).join(', ')} to="/ob/meals" />

      <div className="section-label">{t('new_cycle')}</div>
      <ActionRow icon="refresh" title={t('regenerate')} sub={t('your_meals')} onClick={() => { regenerate(); nav('/plan') }} />
      <ActionRow icon="clock" title={t('new_cycle')} sub={t('new_cycle_sub')} onClick={() => nav('/ob/duration')} />
      <ActionRow icon="settings" title={t('reset_all')} sub={t('reset_all_sub')} danger onClick={() => setConfirmReset(true)} />

      {trial && (
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginTop: 12 }}>
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

      {/* confirmation modal */}
      {confirmReset && (
        <div onClick={() => setConfirmReset(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} className="card" style={{ maxWidth: 360, width: '100%', padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 40 }}>♻️</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '10px 0 8px' }}>{t('reset_confirm_title')}</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 20px' }}>{t('reset_confirm_body')}</p>
            <Button onClick={() => { setConfirmReset(false); resetAll(); nav('/ob/store') }}>{t('confirm')}</Button>
            <button onClick={() => setConfirmReset(false)} style={{ width: '100%', marginTop: 12, color: 'var(--muted)', fontWeight: 600 }}>{t('cancel')}</button>
          </div>
        </div>
      )}

      <BottomNav active="settings" />
    </div>
  )
}
