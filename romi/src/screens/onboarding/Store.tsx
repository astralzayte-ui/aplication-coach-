import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { STORES } from '../../data/stores'
import { Button, TopBar } from '../../components/ui'
import StoreLogo from '../../components/StoreLogo'

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
              borderRadius: 18, minHeight: 118, background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12,
              border: selected === s.id ? '3px solid var(--green-500)' : '3px solid transparent',
              boxShadow: selected === s.id ? '0 8px 18px rgba(20,83,45,.15)' : 'var(--shadow)',
              transition: 'transform .08s, border-color .15s',
            }}
          >
            <StoreLogo id={s.id} />
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
