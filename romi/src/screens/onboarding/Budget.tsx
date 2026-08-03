import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Button, TopBar } from '../../components/ui'
import { BUDGET_MAX, BUDGET_MIN, BUDGET_STEP } from '../../config'
import { durationLabel } from '../../i18n/strings'

export default function Budget() {
  const { t, lang, state, updateOnboarding } = useApp()
  const nav = useNavigate()
  const budget = state.onboarding.budget
  const pct = ((budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100

  // First plan = free trial (fixed 1 week). New cycle = the chosen duration.
  const isFirst = !state.plan
  const weeks = isFirst ? 1 : state.onboarding.durationWeeks
  const periodLabel = weeks <= 1 ? t('budget_for_1') : `${t('budget_for_n')} ${durationLabel(weeks, lang)}`

  return (
    <div className="screen">
      <TopBar progress={0.28} />
      <h1 className="title">{t('budget_title')}</h1>
      <p className="subtitle">{t('budget_sub')}</p>

      <div className="slider-wrap">
        <div className="slider-value">{budget}<span className="cur"> DH</span></div>
        <div className="slider-caption" style={{ marginBottom: 6 }}>
          {periodLabel}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <span className="pill pill-green" style={{ fontSize: 12 }}>
            🗓️ {durationLabel(weeks, lang)}{isFirst ? ` · ${t('budget_trial_note')} 🎁` : ''}
          </span>
        </div>
        <input
          type="range" min={BUDGET_MIN} max={BUDGET_MAX} step={BUDGET_STEP} value={budget}
          style={{ ['--pct' as any]: `${pct}%` }}
          onChange={(e) => updateOnboarding({ budget: Number(e.target.value) })}
        />
        <div className="slider-ends">
          <span>{BUDGET_MIN} DH</span>
          <span>{BUDGET_MAX.toLocaleString('fr-FR')} DH</span>
        </div>
      </div>

      {/* Reuse-leftovers option, clearly explained */}
      <button
        onClick={() => updateOnboarding({ reuseLeftovers: !state.onboarding.reuseLeftovers })}
        className="card"
        style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, width: '100%', textAlign: 'start', marginTop: 8 }}
      >
        <span style={{ fontSize: 22, lineHeight: 1 }}>♻️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>{t('leftovers_title')}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3, lineHeight: 1.4 }}>{t('leftovers_desc')}</div>
        </div>
        <span style={{
          flexShrink: 0, width: 46, height: 28, borderRadius: 999, position: 'relative',
          background: state.onboarding.reuseLeftovers ? 'var(--accent)' : 'var(--card-2)',
          border: '1px solid var(--line)', transition: 'background .15s',
        }}>
          <span style={{
            position: 'absolute', top: 2, insetInlineStart: state.onboarding.reuseLeftovers ? 20 : 2,
            width: 22, height: 22, borderRadius: 999, background: '#fff', transition: 'inset-inline-start .15s',
          }} />
        </span>
      </button>

      <div className="spacer" />
      <div className="cta-wrap">
        <Button onClick={() => nav('/ob/people')}>{t('continue')}</Button>
      </div>
    </div>
  )
}
