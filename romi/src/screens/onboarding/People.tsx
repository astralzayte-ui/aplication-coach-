import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Button, Icon, TopBar } from '../../components/ui'

export default function People() {
  const { t, state, updateOnboarding } = useApp()
  const nav = useNavigate()
  const people = state.onboarding.people
  const set = (n: number) => updateOnboarding({ people: Math.min(12, Math.max(1, n)) })

  return (
    <div className="screen">
      <TopBar progress={0.42} />
      <h1 className="title">{t('people_title')}</h1>
      <p className="subtitle">{t('people_sub')}</p>

      <div className="bignum">
        <div className="value">{people}</div>
        <div className="unit">{people === 1 ? t('people_unit_one') : t('people_unit')}</div>
        <div className="stepper">
          <button className="round-btn minus" onClick={() => set(people - 1)}><Icon name="minus" size={26} /></button>
          <button className="round-btn plus" onClick={() => set(people + 1)}><Icon name="plus" size={26} /></button>
        </div>
      </div>

      <div className="spacer" />
      <div className="cta-wrap">
        <Button onClick={() => nav('/ob/ambiance')}>{t('continue')}</Button>
      </div>
    </div>
  )
}
