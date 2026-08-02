import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui'
import LangToggle from '../components/LangToggle'

export default function Auth() {
  const { t, register, login, hasPlan } = useApp()
  const nav = useNavigate()
  const [mode, setMode] = useState<'signup' | 'login'>('signup')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)

  const submit = () => {
    const digits = phone.replace(/[^\d]/g, '')
    if (digits.length < 8) return setErr(t('auth_phone_err'))
    if (password.length < 4) return setErr(t('auth_pass_err'))
    setErr(null)
    if (mode === 'signup') {
      register(phone, password)
      nav('/ob/store')
    } else {
      const ok = login(phone, password)
      if (!ok) return setErr(t('auth_pass_err'))
      nav(hasPlan ? '/plan' : '/ob/store')
    }
  }

  return (
    <div className="screen">
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 6 }}>
        <LangToggle />
      </div>

      <div className="center-col" style={{ marginTop: 26, marginBottom: 8 }}>
        <div style={{
          width: 78, height: 78, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(180deg,#1c6b45,#0f4a2e)', color: '#fff', fontWeight: 800, fontSize: 40,
          boxShadow: '0 12px 26px rgba(15,74,46,.35)',
        }}>R</div>
      </div>

      <h1 className="title" style={{ textAlign: 'center', marginTop: 18 }}>
        {mode === 'signup' ? t('auth_welcome') : t('auth_login_welcome')}
      </h1>
      <p className="subtitle" style={{ textAlign: 'center' }}>{t('auth_sub')}</p>

      <div style={{ marginTop: 8 }}>
        <div className="field">
          <label>{t('phone_label')}</label>
          <input
            className="input" inputMode="tel" value={phone}
            placeholder={t('phone_ph')}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="field">
          <label>{t('password_label')}</label>
          <input
            className="input" type="password" value={password}
            placeholder={t('password_ph')}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {err && <div className="input-err">{err}</div>}
      </div>

      <div className="spacer" />

      <div className="cta-wrap">
        <Button onClick={submit}>{mode === 'signup' ? t('auth_cta') : t('auth_login_cta')}</Button>
        <button
          onClick={() => { setErr(null); setMode(mode === 'signup' ? 'login' : 'signup') }}
          style={{ width: '100%', marginTop: 16, color: 'var(--green-700)', fontWeight: 600, fontSize: 15 }}
        >
          {mode === 'signup' ? t('auth_have_account') : t('auth_no_account')}
        </button>
      </div>
    </div>
  )
}
