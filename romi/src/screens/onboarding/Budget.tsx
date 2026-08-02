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

      <div className="spacer" />
      <div className="cta-wrap">
        <Button onClick={() => nav('/ob/people')}>{t('continue')}</Button>
      </div>
    </div>
  )
}
