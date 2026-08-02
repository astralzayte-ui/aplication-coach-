import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Button, TopBar } from '../../components/ui'
import { AMBIANCE } from '../../i18n/strings'
import type { Tag } from '../../data/types'

export default function Ambiance() {
  const { t, lang, state, updateOnboarding } = useApp()
  const nav = useNavigate()
  const sel = state.onboarding.ambiance

  const toggle = (id: Tag) => {
    if (sel.includes(id)) updateOnboarding({ ambiance: sel.filter((x) => x !== id) })
    else if (sel.length < 3) updateOnboarding({ ambiance: [...sel, id] })
  }

  return (
    <div className="screen">
      <TopBar progress={0.56} />
      <h1 className="title">{t('ambiance_title')}</h1>
      <p className="subtitle">{t('ambiance_sub')}</p>

      <div className="grid2">
        {AMBIANCE.map((a) => (
          <button
            key={a.id}
            className={`tile ${sel.includes(a.id) ? 'selected' : ''}`}
            style={{ background: a.bg }}
            onClick={() => toggle(a.id)}
          >
            <span className="emoji">{a.emoji}</span>
            <span>{a.label[lang]}</span>
          </button>
        ))}
      </div>

      <div className="spacer" />
      <div className="cta-wrap">
        <Button disabled={sel.length === 0} onClick={() => nav('/ob/diet')}>{t('continue')}</Button>
      </div>
    </div>
  )
}
