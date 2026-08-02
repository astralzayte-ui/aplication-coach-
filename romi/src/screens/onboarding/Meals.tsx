import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Button, TopBar } from '../../components/ui'
import { MEALS_PER_DAY } from '../../i18n/strings'
import type { MealType } from '../../data/types'

export default function Meals() {
  const { t, lang, state, updateOnboarding } = useApp()
  const nav = useNavigate()
  const sel = state.onboarding.mealsPerDay

  const toggle = (id: MealType) => {
    const next = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]
    updateOnboarding({ mealsPerDay: next })
  }

  return (
    <div className="screen scroll">
      <TopBar progress={0.84} />
      <h1 className="title">{t('meals_title')}</h1>
      <p className="subtitle">{t('meals_sub')}</p>

      <div className="grid2">
        {MEALS_PER_DAY.map((m) => (
          <button
            key={m.id}
            className={`option tall ${sel.includes(m.id) ? 'selected' : ''}`}
            onClick={() => toggle(m.id)}
          >
            <span className="emoji">{m.emoji}</span>
            <span>{m.label[lang]}</span>
          </button>
        ))}
      </div>

      <div className="spacer" />
      <div className="cta-wrap">
        <Button disabled={sel.length === 0} onClick={() => nav('/ob/equipment')}>{t('continue')}</Button>
      </div>
    </div>
  )
}
