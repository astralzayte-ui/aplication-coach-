import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icon } from './ui'

export default function BottomNav({ active }: { active: 'plan' | 'prefs' | 'settings' }) {
  const { t } = useApp()
  const nav = useNavigate()
  const items = [
    { id: 'plan', icon: 'list', label: t('nav_plan'), to: '/plan' },
    { id: 'prefs', icon: 'sliders', label: t('nav_prefs'), to: '/settings' },
    { id: 'settings', icon: 'settings', label: t('nav_settings'), to: '/settings' },
  ] as const

  return (
    <div style={{
      position: 'sticky', bottom: 0, marginTop: 8,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      background: 'var(--card)', borderRadius: 20, padding: '12px 10px calc(12px + env(safe-area-inset-bottom))',
      border: '1px solid var(--line)', boxShadow: '0 -6px 24px rgba(0,0,0,.35)',
    }}>
      {items.map((it) => {
        const on = active === it.id
        return (
          <button key={it.id} onClick={() => nav(it.to)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: on ? 'var(--accent)' : 'var(--muted-2)', fontWeight: 600, fontSize: 12 }}>
            <Icon name={it.icon} size={22} />
            {it.label}
          </button>
        )
      })}
    </div>
  )
}
