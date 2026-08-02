import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icon } from '../components/ui'

const STEP_KEYS = ['loading_step1', 'loading_step2', 'loading_step3'] as const

export default function Loading() {
  const { t, generate } = useApp()
  const nav = useNavigate()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 900),
      setTimeout(() => setStep(2), 1900),
      setTimeout(() => setStep(3), 2800),
      setTimeout(() => { generate(); nav('/plan', { replace: true }) }, 3400),
    ]
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="screen" style={{ background: 'linear-gradient(180deg,#e7f1e6,#f4eee6 45%)', justifyContent: 'center' }}>
      <h1 className="title" style={{ textAlign: 'center', color: 'var(--green-900)', fontSize: 32, whiteSpace: 'pre-line', marginTop: 10 }}>
        {t('loading_title')}
      </h1>
      <p className="subtitle" style={{ textAlign: 'center', maxWidth: 300, margin: '4px auto 30px' }}>{t('loading_sub')}</p>

      {/* basket illustration */}
      <div style={{ position: 'relative', width: 200, height: 180, margin: '0 auto 34px' }}>
        {['🥬', '🍅', '🧀', '🍋', '🫒'].map((e, i) => (
          <span key={i} style={{
            position: 'absolute', fontSize: 26,
            top: [10, 40, 120, 120, 60][i], left: [20, 150, 0, 168, 90][i],
            animation: `fade .4s ${i * 0.1}s both`,
          }}>{e}</span>
        ))}
        <div style={{
          position: 'absolute', inset: '40px 40px 10px', borderRadius: 26,
          background: 'linear-gradient(180deg,#1c6b45,#0f4a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 16px 30px rgba(15,74,46,.35)',
        }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 46 }}>R</span>
        </div>
      </div>

      <div className="card" style={{ padding: 6 }}>
        {STEP_KEYS.map((key, i) => {
          const status = i < step ? 'done' : i === step ? 'progress' : 'wait'
          return (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '18px 16px',
              borderBottom: i < 2 ? '1px solid var(--line)' : 'none',
              opacity: status === 'wait' ? 0.5 : 1,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 999, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: status === 'done' ? 'var(--green-500)' : '#fff',
                border: status === 'done' ? 'none' : '3px solid ' + (status === 'progress' ? 'var(--green-500)' : '#e0d8cb'),
                color: '#fff',
              }}>
                {status === 'done' && <Icon name="check" size={16} />}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{t(key)}</div>
                <div style={{ fontSize: 13, color: status === 'done' ? 'var(--green-600)' : 'var(--muted)', fontWeight: 600 }}>
                  {status === 'done' ? t('status_done') : status === 'progress' ? t('status_progress') : t('status_wait')}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
