import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, notifyTrialEnded } from '../context/AppContext'
import { getStore } from '../data/stores'
import { recipeMap } from '../data/recipes'
import { MEAL_EMOJI, MEAL_LABELS } from '../i18n/strings'
import { recipePricePerPerson, fmtMAD, fmtMAD0 } from '../lib/pricing'
import { buildShoppingList, shoppingCount, shoppingTotal } from '../lib/shoppingList'
import { RecipePhoto, Icon, TagChip } from '../components/ui'
import BottomNav from '../components/BottomNav'
import { SUPPORT_WHATSAPP } from '../config'
import { whatsappUrl, dayLabelsFrom } from '../lib/trial'
import type { PlannedMeal } from '../data/types'

export default function Plan() {
  const { t, lang, state, trial } = useApp()
  const nav = useNavigate()
  const store = getStore(state.onboarding.storeId)
  const meals = state.plan ?? []

  const byDay = useMemo(() => {
    const m = new Map<number, PlannedMeal[]>()
    for (const meal of meals) {
      if (!m.has(meal.dayIndex)) m.set(meal.dayIndex, [])
      m.get(meal.dayIndex)!.push(meal)
    }
    return [...m.entries()].sort((a, b) => a[0] - b[0])
  }, [meals])

  const groups = useMemo(() => buildShoppingList(meals, state.onboarding), [meals, state.onboarding])
  const total = useMemo(() => shoppingTotal(groups), [groups])
  const articles = shoppingCount(groups)
  const budget = state.onboarding.budget
  const budgetPct = Math.min(100, (total / budget) * 100)
  const days = dayLabelsFrom(state.trialStartISO, state.planDays)

  // Fire the end-of-trial notification once when the trial has expired.
  useEffect(() => {
    if (trial?.expired && !sessionStorage.getItem('romi_notified')) {
      sessionStorage.setItem('romi_notified', '1')
      notifyTrialEnded()
    }
  }, [trial?.expired])

  return (
    <div className="screen scroll" style={{ paddingBottom: 8 }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10 }}>
        <div style={{ background: '#fff', borderRadius: 999, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: 'var(--shadow-sm)', fontWeight: 700 }}>
          <Icon name="person" size={16} /> {state.onboarding.people}
        </div>
        <h1 className="title" style={{ margin: 0, fontSize: 23, flex: 1 }}>{t('plan_title')} 🎉</h1>
        <a
          href={whatsappUrl(SUPPORT_WHATSAPP, lang === 'ar' ? 'مرحبا رومي !' : 'Bonjour Romi !')}
          target="_blank" rel="noreferrer" aria-label="WhatsApp"
          style={{ width: 42, height: 42, minWidth: 42, borderRadius: 999, background: 'var(--green-800)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}
        >
          <Icon name="whatsapp" size={22} />
        </a>
      </div>

      {/* trial badge / expired banner */}
      {trial && !trial.expired && (
        <div style={{ marginTop: 12 }}>
          <span className="trial-badge">🎁 {trial.daysLeft} {t('trial_left')}</span>
        </div>
      )}
      {trial?.expired && (
        <button onClick={() => nav('/trial')} className="card" style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 12, padding: 14, marginTop: 12, background: '#fdeceb', textAlign: 'start' }}>
          <span style={{ fontSize: 22 }}>🔒</span>
          <span style={{ flex: 1, fontWeight: 700, color: '#b23325' }}>{t('trial_ended_title')}</span>
          <Icon name="back" size={18} />
        </button>
      )}

      <div style={{ marginTop: 14 }}>
        <span className="pill pill-green">📦 {t('plan_planned_for')} {store.name}</span>
      </div>

      {/* cost + shopping cards */}
      <div className="grid2" style={{ marginTop: 14 }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="section-label" style={{ margin: 0 }}>{t('plan_cost')}</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6, whiteSpace: 'nowrap' }}>{fmtMAD0(total)}</div>
          <div style={{ fontSize: 13, color: budgetPct > 100 ? '#d0492f' : 'var(--muted)', fontWeight: 600 }}>/ {fmtMAD0(budget)}</div>
          <div style={{ height: 8, background: '#eee6da', borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
            <div style={{ width: `${budgetPct}%`, height: '100%', background: budgetPct > 100 ? '#d0492f' : 'linear-gradient(90deg,#86c93f,#37a94a)' }} />
          </div>
        </div>
        <button onClick={() => nav('/shopping')} style={{ borderRadius: 16, background: '#f4c33f', padding: 16, textAlign: 'start', color: '#5a4410', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Icon name="list" size={22} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{articles} {t('plan_articles')}</div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>{t('plan_shopping')}</div>
          </div>
        </button>
      </div>

      {/* day list */}
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {byDay.map(([dayIndex, dayMeals]) =>
          dayMeals.map((meal, mi) => {
            const recipe = recipeMap[meal.recipeId]
            if (!recipe) return null
            const price = recipePricePerPerson(recipe, store) * meal.people
            const firstOfDay = mi === 0
            return (
              <button
                key={`${dayIndex}-${meal.mealType}`}
                onClick={() => nav(`/meal/${dayIndex}/${meal.mealType}`)}
                className="card"
                style={{ display: 'flex', alignItems: 'stretch', padding: 0, overflow: 'hidden', textAlign: 'start' }}
              >
                <div style={{
                  width: 62, flexShrink: 0, background: 'linear-gradient(180deg,#5bb85b,#3a9d4a)', color: '#fff',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, fontWeight: 800,
                }}>
                  {firstOfDay
                    ? <span style={{ fontSize: 15 }}>{days[dayIndex]?.[lang] ?? `J${dayIndex + 1}`}</span>
                    : <span style={{ fontSize: 20 }}>{MEAL_EMOJI[meal.mealType]}</span>}
                </div>
                <div style={{ width: 66, flexShrink: 0, padding: 8 }}>
                  <RecipePhoto recipe={recipe} height={50} radius={12} />
                </div>
                <div style={{ flex: 1, padding: '10px 6px 10px 0', minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.15, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                    {recipe.name[lang]}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted)', fontSize: 12, margin: '5px 0 7px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="clock" size={13} />{recipe.timeMin}m</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="person" size={13} />{meal.people}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {recipe.tags.slice(0, 2).map((tg) => <TagChip key={tg} tag={tg} lang={lang} />)}
                  </div>
                </div>
                <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', fontWeight: 800, fontSize: 15, whiteSpace: 'nowrap' }}>
                  {fmtMAD(price)}
                </div>
              </button>
            )
          }),
        )}
      </div>

      {/* fridge entry */}
      <button onClick={() => nav('/fridge')} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, marginTop: 14, width: '100%', textAlign: 'start' }}>
        <span style={{ fontSize: 24 }}>🧊</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>{t('fridge_title')}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>{t('fridge_sub')}</div>
        </div>
        <Icon name="back" size={18} />
      </button>

      {/* next weeks (locked) */}
      <div className="section-label">{t('weeks_title')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1, 2, 3].map((w) => (
          <button key={w} onClick={() => nav('/weeks')} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%', textAlign: 'start', opacity: 0.85 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="lock" size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{t('week_n')} {w + 1}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{t('locked_hint')}</div>
            </div>
            <span className="tag" style={{ background: '#fff2d6', color: '#9a6b15' }}>🔒 {t('premium_locked')}</span>
          </button>
        ))}
      </div>

      <BottomNav active="plan" />
    </div>
  )
}
