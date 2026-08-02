import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Button, Icon, TopBar, equipmentIcon } from '../../components/ui'
import { EQUIPMENT } from '../../i18n/strings'
import type { Equipment as Equip } from '../../data/types'

export default function Equipment() {
  const { t, lang, state, updateOnboarding } = useApp()
  const nav = useNavigate()
  const sel = state.onboarding.equipment

  const toggle = (id: Equip) => {
    const next = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]
    updateOnboarding({ equipment: next })
  }

  return (
    <div className="screen scroll">
      <TopBar progress={1} />
      <h1 className="title">{t('equip_title')}</h1>
      <p className="subtitle">{t('equip_sub')}</p>

      <div className="grid2">
        {EQUIPMENT.map((e) => {
          const on = sel.includes(e.id)
          return (
            <button
              key={e.id}
              className={`option tall ${on ? 'selected' : ''}`}
              onClick={() => toggle(e.id)}
              style={{ color: on ? 'var(--green-700)' : 'var(--ink)' }}
            >
              <Icon name={equipmentIcon(e.id)} size={28} />
              <span>{e.label[lang]}</span>
            </button>
          )
        })}
      </div>

      <div className="spacer" />
      <div className="cta-wrap">
        <Button disabled={sel.length === 0} onClick={() => nav('/loading')}>{t('equip_cta')}</Button>
      </div>
    </div>
  )
}
