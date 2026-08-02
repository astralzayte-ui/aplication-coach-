import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { STORES } from '../../data/stores'
import { Button, TopBar } from '../../components/ui'

export default function Store() {
  const { t, state, updateOnboarding } = useApp()
  const nav = useNavigate()
  const selected = state.onboarding.storeId

  return (
    <div className="screen">
      <TopBar progress={0.14} onBack={() => nav('/auth')} />
      <h1 className="title">{t('store_title')}</h1>
      <p className="subtitle">{t('store_sub')}</p>

      <div className="grid2">
        {STORES.map((s) => (
          <button
            key={s.id}
            onClick={() => updateOnboarding({ storeId: s.id })}
            style={{
              borderRadius: 18, minHeight: 108, color: s.fg, background: s.bg, fontWeight: 800, fontSize: 18,
              border: selected === s.id ? '4px solid var(--ink)' : '4px solid transparent',
              transition: 'transform .08s', boxShadow: 'var(--shadow-sm)',
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="spacer" />
      <div className="cta-wrap">
        <Button disabled={!selected} onClick={() => nav('/ob/budget')}>{t('continue')}</Button>
      </div>
    </div>
  )
}
