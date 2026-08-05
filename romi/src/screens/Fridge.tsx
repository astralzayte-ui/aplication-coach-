import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { INGREDIENTS, ingredientMap } from '../data/ingredients'
import { getStore } from '../data/stores'
import { fridgeSuggestions } from '../lib/planGenerator'
import { recipePricePerPerson, fmtMAD } from '../lib/pricing'
import { Icon, RecipePhoto, TagChip } from '../components/ui'

const QUICK = ['oeuf', 'poulet', 'riz', 'pates', 'tomate', 'oignon', 'pomme_terre', 'thon']

export default function Fridge() {
  const { t, lang, loc, state, setFridge } = useApp()
  const nav = useNavigate()
  const store = getStore(state.onboarding.storeId)
  const [query, setQuery] = useState('')
  const have = state.fridge

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return INGREDIENTS.filter((i) => !have.includes(i.id) && (
      i.name.fr.toLowerCase().includes(q) ||
      i.name.ar.includes(query.trim()) ||
      (i.name.en?.toLowerCase().includes(q) ?? false)
    )).slice(0, 6)
  }, [query, have])

  const suggestions = useMemo(() => fridgeSuggestions(have, state.onboarding), [have, state.onboarding])

  const add = (id: string) => { if (!have.includes(id)) setFridge([...have, id]); setQuery('') }
  const remove = (id: string) => setFridge(have.filter((x) => x !== id))

  return (
    <div className="screen scroll" style={{ paddingBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10, marginBottom: 8 }}>
        <button onClick={() => nav('/plan')} className="back-btn"><Icon name="back" size={20} /></button>
        <h1 className="title" style={{ margin: 0, fontSize: 26 }}>{t('fridge_title')} 🧊</h1>
      </div>
      <p className="subtitle" style={{ marginBottom: 16 }}>{t('fridge_sub')}</p>

      <input className="input" value={query} placeholder={t('fridge_add') + '…'} onChange={(e) => setQuery(e.target.value)} />
      {matches.length > 0 && (
        <div className="card" style={{ marginTop: 8, padding: 6 }}>
          {matches.map((i) => (
            <button key={i.id} onClick={() => add(i.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', width: '100%', textAlign: 'start' }}>
              <span style={{ fontSize: 18 }}>{i.emoji}</span><span style={{ fontWeight: 600 }}>{loc(i.name)}</span>
              <span style={{ marginInlineStart: 'auto', color: 'var(--green-600)' }}><Icon name="plus" size={18} /></span>
            </button>
          ))}
        </div>
      )}

      {/* quick add */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
        {QUICK.filter((id) => !have.includes(id)).map((id) => (
          <button key={id} onClick={() => add(id)} className="pill pill-amber">{ingredientMap[id].emoji} {loc(ingredientMap[id].name)}</button>
        ))}
      </div>

      {/* have chips */}
      {have.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {have.map((id) => (
            <span key={id} className="pill pill-green">
              {ingredientMap[id]?.emoji} {ingredientMap[id] ? loc(ingredientMap[id].name) : id}
              <button onClick={() => remove(id)} style={{ marginInlineStart: 4, fontWeight: 700 }}>✕</button>
            </span>
          ))}
        </div>
      )}

      <div className="section-label">{t('fridge_suggestions')}</div>
      {suggestions.length === 0 ? (
        <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>{t('fridge_empty')}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {suggestions.map((r) => {
            const matched = r.ingredients.filter((ri) => have.includes(ri.id)).length
            return (
              <div key={r.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10 }}>
                <div style={{ width: 60 }}><RecipePhoto recipe={r} height={60} radius={12} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{loc(r.name)}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 12, margin: '3px 0 6px' }}>
                    ⏱ {r.timeMin}m · ✅ {matched} {t('fridge_match')}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>{r.tags.slice(0, 2).map((tg) => <TagChip key={tg} tag={tg} lang={lang} />)}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap' }}>{fmtMAD(recipePricePerPerson(r, store), 1)}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
