import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getStore } from '../data/stores'
import { buildShoppingList, CATEGORY_LABELS, qtyLabel, shoppingCount, shoppingListToText, shoppingTotal } from '../lib/shoppingList'
import { fmtMAD } from '../lib/pricing'
import { dayLabelsFrom } from '../lib/trial'
import { Icon, Button } from '../components/ui'

export default function Shopping() {
  const { t, lang, state, toggleChecked } = useApp()
  const nav = useNavigate()
  const store = getStore(state.onboarding.storeId)
  const meals = state.plan ?? []
  const [copied, setCopied] = useState(false)

  const groups = useMemo(() => buildShoppingList(meals, state.onboarding), [meals, state.onboarding])
  const total = shoppingCount(groups)
  const done = useMemo(() => groups.reduce((s, g) => s + g.items.filter((i) => state.checked[i.ingredientId]).length, 0), [groups, state.checked])
  const days = dayLabelsFrom(state.trialStartISO, state.planDays)
  const range = days.length
    ? `${days[0][lang]} – ${days[days.length - 1][lang]}`.toUpperCase()
    : ''

  const text = () => shoppingListToText(groups, lang, store.name)

  const copy = async () => {
    try { await navigator.clipboard.writeText(text()); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch { /* ignore */ }
  }
  const share = async () => {
    const t2 = text()
    if (navigator.share) { try { await navigator.share({ title: 'Romi', text: t2 }); return } catch { /* ignore */ } }
    window.open(`https://wa.me/?text=${encodeURIComponent(t2)}`, '_blank')
  }

  return (
    <div className="screen scroll" style={{ paddingBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10 }}>
        <button onClick={() => nav('/plan')} className="back-btn"><Icon name="back" size={20} /></button>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '.14em', color: 'var(--muted-2)', fontWeight: 700 }}>
            {range}
          </div>
          <h1 className="title" style={{ margin: 0, fontSize: 26 }}>{t('shopping_title')}</h1>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
        <span className="pill pill-green">🛒 {t('for_store')} {store.name}</span>
        <span className="pill" style={{ background: '#f4c33f', color: '#5a4410' }}>{done} / {total} {t('faits')}</span>
        <button className="pill pill-amber" onClick={copy}><Icon name="copy" size={15} /> {copied ? t('copied') : t('copy')}</button>
      </div>

      <div style={{ marginTop: 18 }}>
        {groups.map((g) => (
          <div key={g.category}>
            <div className="section-label">{CATEGORY_LABELS[g.category][lang]}</div>
            <div className="card" style={{ padding: '2px 14px' }}>
              {g.items.map((item, idx) => {
                const on = !!state.checked[item.ingredientId]
                return (
                  <div key={item.ingredientId} onClick={() => toggleChecked(item.ingredientId)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: idx < g.items.length - 1 ? '1px solid var(--line)' : 'none', cursor: 'pointer', opacity: on ? 0.55 : 1 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>{item.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, textDecoration: on ? 'line-through' : 'none' }}>{item.name[lang]}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>{qtyLabel(item, lang)} · {fmtMAD(item.price)}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 5 }}>
                        {item.usedIn.slice(0, 2).map((u, i) => (
                          <span key={i} style={{ fontSize: 11, background: 'var(--bg-soft)', color: 'var(--muted)', padding: '2px 8px', borderRadius: 999, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u[lang]}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ width: 26, height: 26, borderRadius: 999, border: on ? 'none' : '2px solid #d9d0c4', background: on ? 'var(--green-500)' : 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {on && <Icon name="check" size={15} />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', color: 'var(--muted)', fontWeight: 600, margin: '18px 0 6px' }}>
        Total ≈ {fmtMAD(shoppingTotal(groups))}
      </div>

      <div className="cta-wrap" style={{ position: 'sticky', bottom: 12 }}>
        <Button onClick={share}><Icon name="share" size={18} /> {t('share_list')}</Button>
      </div>
    </div>
  )
}
