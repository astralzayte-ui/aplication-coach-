import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Button, Icon, TopBar } from '../../components/ui'
import { DIETS } from '../../i18n/strings'
import { expandAllergy } from '../../lib/allergies'

export default function Diet() {
  const { t, lang, state, updateOnboarding } = useApp()
  const nav = useNavigate()
  const diets = state.onboarding.diets
  const allergies = state.onboarding.allergies
  const [input, setInput] = useState('')

  const toggleDiet = (id: string) => {
    if (id === 'aucun') return updateOnboarding({ diets: ['aucun'] })
    const without = diets.filter((d) => d !== 'aucun')
    const next = without.includes(id) ? without.filter((d) => d !== id) : [...without, id]
    updateOnboarding({ diets: next.length ? next : ['aucun'] })
  }

  const addAllergy = () => {
    const label = input.trim()
    if (!label) return
    const { ingredientIds } = expandAllergy(label)
    updateOnboarding({ allergies: [...allergies, { label, ingredientIds }] })
    setInput('')
  }

  const removeAllergy = (i: number) =>
    updateOnboarding({ allergies: allergies.filter((_, idx) => idx !== i) })

  return (
    <div className="screen scroll">
      <TopBar progress={0.7} />
      <h1 className="title">{t('diet_title')}</h1>
      <p className="subtitle">{t('diet_sub')}</p>

      <div className="grid2">
        {DIETS.map((d) => (
          <button
            key={d.id}
            className={`option tall ${diets.includes(d.id) ? 'selected' : ''}`}
            onClick={() => toggleDiet(d.id)}
          >
            {d.emoji && <span className="emoji">{d.emoji}</span>}
            <span>{d.label[lang]}</span>
          </button>
        ))}
      </div>

      <div className="section-label">{t('allergy_title')}</div>
      <p className="subtitle" style={{ marginTop: -6, marginBottom: 14 }}>{t('allergy_sub')}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          className="input" value={input} placeholder={t('allergy_ph')} style={{ flex: 1 }}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addAllergy()}
        />
        <button
          onClick={addAllergy}
          style={{ minWidth: 58, borderRadius: 16, background: 'var(--green-800)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="plus" />
        </button>
      </div>

      {allergies.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {allergies.map((a, i) => (
            <span key={i} className="pill pill-amber" style={{ paddingRight: 8 }}>
              ⚠️ {a.label}
              <button onClick={() => removeAllergy(i)} style={{ color: 'var(--muted)', fontWeight: 700, marginInlineStart: 4 }}>✕</button>
            </span>
          ))}
        </div>
      )}

      <div style={{ height: 20 }} />
      <div className="spacer" />
      <div className="cta-wrap">
        <Button onClick={() => nav('/ob/meals')}>{t('continue')}</Button>
      </div>
    </div>
  )
}
