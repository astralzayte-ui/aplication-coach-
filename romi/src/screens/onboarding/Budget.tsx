import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Button, TopBar } from '../../components/ui'
import { BUDGET_MAX, BUDGET_MIN } from '../../config'

export default function Budget() {
  const { t, state, updateOnboarding } = useApp()
  const nav = useNavigate()
  const budget = state.onboarding.budget
  const pct = ((budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100

  return (
    <div className="screen">
      <TopBar progress={0.28} />
      <h1 className="title">{t('budget_title')}</h1>
      <p className="subtitle">{t('budget_sub')}</p>

      <div className="slider-wrap">
        <div className="slider-value">{budget}<span className="cur"> DH</span></div>
        <div className="slider-caption">{t('budget_week')}</div>
        <input
          type="range" min={BUDGET_MIN} max={BUDGET_MAX} step={5} value={budget}
          style={{ ['--pct' as any]: `${pct}%` }}
          onChange={(e) => updateOnboarding({ budget: Number(e.target.value) })}
        />
        <div className="slider-ends">
          <span>{BUDGET_MIN} DH</span>
          <span>{BUDGET_MAX} DH</span>
        </div>
      </div>

      <div className="spacer" />
      <div className="cta-wrap">
        <Button onClick={() => nav('/ob/people')}>{t('continue')}</Button>
      </div>
    </div>
  )
}
