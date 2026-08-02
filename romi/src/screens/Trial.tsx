import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button, Icon } from '../components/ui'
import { SUPPORT_WHATSAPP } from '../config'
import { whatsappUrl } from '../lib/trial'

export default function Trial() {
  const { t, lang, state, trial } = useApp()
  const nav = useNavigate()

  const msg = lang === 'ar'
    ? `مرحبا رومي 👋 أريد تفعيل اشتراكي (${state.onboarding.phone}). أرسلوا لي معلومات الحساب البنكي من فضلكم.`
    : `Bonjour Romi 👋 je souhaite activer mon abonnement (${state.onboarding.phone}). Envoyez-moi votre RIB s'il vous plaît.`

  return (
    <div className="screen" style={{ justifyContent: 'center', textAlign: 'center' }}>
      <button onClick={() => nav('/plan')} className="back-btn" style={{ position: 'absolute', top: 18, insetInlineStart: 18 }}>
        <Icon name="back" size={20} />
      </button>

      <div style={{ margin: '0 auto 22px', width: 96, height: 96, borderRadius: 999, background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-700)' }}>
        <Icon name="lock" size={40} />
      </div>

      <h1 className="title" style={{ fontSize: 28 }}>
        {trial && !trial.expired ? `${trial.daysLeft} ${t('trial_left')}` : t('trial_ended_title')}
      </h1>
      <p className="subtitle" style={{ maxWidth: 320, margin: '4px auto 30px' }}>{t('trial_ended_sub')}</p>

      <div style={{ background: '#fff', borderRadius: 18, padding: 18, boxShadow: 'var(--shadow)', textAlign: 'start', marginBottom: 24 }}>
        {['✅ ' + (lang === 'ar' ? 'كل الأسابيع مفتوحة' : 'toutes les semaines débloquées'),
          '✅ ' + (lang === 'ar' ? 'لائحة مشتريات بالأثمنة' : 'listes de courses chiffrées'),
          '✅ ' + (lang === 'ar' ? 'تغيير الأطباق بلا حدود' : 'plats modifiables à volonté')].map((l, i) => (
          <div key={i} style={{ padding: '8px 0', fontWeight: 600, color: 'var(--ink-2)' }}>{l}</div>
        ))}
      </div>

      <div className="cta-wrap">
        <a href={whatsappUrl(SUPPORT_WHATSAPP, msg)} target="_blank" rel="noreferrer">
          <Button><Icon name="whatsapp" size={20} /> {t('trial_whatsapp')}</Button>
        </a>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 14 }}>{t('trial_whatsapp_note')}</p>
      </div>
    </div>
  )
}
