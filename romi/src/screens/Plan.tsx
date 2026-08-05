import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, notifyTrialEnded } from '../context/AppContext'
import { getStore } from '../data/stores'
import { recipeMap } from '../data/recipes'
import { MEAL_LABELS } from '../i18n/strings'
import { recipePricePerPerson, fmtMAD, fmtMAD0 } from '../lib/pricing'
import { buildShoppingList, shoppingCount, shoppingTotal } from '../lib/shoppingList'
import { RecipePhoto, Icon, TagChip } from '../components/ui'
import BottomNav from '../components/BottomNav'
import { SUPPORT_WHATSAPP } from '../config'
import { whatsappUrl, dayLabelsFrom, fullDayLabelsFrom } from '../lib/trial'
import type { PlannedMeal } from '../data/types'

export default function Plan() {
  const { t, lang, state, trial } = useApp()
  const nav = useNavigate()
  const store = getStore(state.onboarding.storeId)
  const meals = state.plan ?? []
  const [openDay, setOpenDay] = useState<number>(0)

  const byDay = useMemo(() => {
    const m = new Map<number, PlannedMeal[]>()
    for (const meal of meals) {
      if (!m.has(meal.dayIndex)) m.set(meal.dayIndex, [])
      m.get(meal.dayIndex)!.push(meal)
    }
    return [...m.entries()].sort((a, b) => a[0] - b[0])
  }, [meals])

  const groups = useMemo(() => buildShoppingList(meals, state.onboarding, state.onboarding.reuseLeftovers ? state.pantry : undefined), [meals, state.onboarding, state.pantry])
  const total = useMemo(() => shoppingTotal(groups), [groups])
  const articles = shoppingCount(groups)
  const budget = state.onboarding.budget
  const budgetPct = Math.min(100, (total / budget) * 100)
  const shortDays = dayLabelsFrom(state.trialStartISO, state.planDays)
  const fullDays = fullDayLabelsFrom(state.trialStartISO, state.planDays)

  useEffect(() => {
    if (trial?.expired && !sessionStorage.getItem('romi_notified')) {
      sessionStorage.setItem('romi_notified', '1')
      notifyTrialEnded()
    }
  }, [trial?.expired])

  const dayCost = (dm: PlannedMeal[]) =>
    dm.reduce((s, m) => s + recipePricePerPerson(recipeMap[m.recipeId]!, store) * m.people, 0)

  return (
    <div className="screen scroll" style={{ paddingBottom: 8 }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10 }}>
        <div className="card" style={{ borderRadius: 999, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
          <Icon name="person" size={16} /> {state.onboarding.people}
        </div>
        <h1 className="title" style={{ margin: 0, fontSize: 24, flex: 1 }}>{t('plan_title')}</h1>
        <a
          href={whatsappUrl(SUPPORT_WHATSAPP, lang === 'ar' ? 'مرحبا رومي !' : 'Bonjour Romi !')}
          target="_blank" rel="noreferrer" aria-label="WhatsApp"
          style={{ width: 42, height: 42, minWidth: 42, borderRadius: 999, background: 'var(--accent)', color: 'var(--accent-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="whatsapp" size={22} />
        </a>
      </div>

      {trial && !trial.expired && (
        <div style={{ marginTop: 12 }}>
          <span className="trial-badge">
            🎁 {(() => {
              if (trial.daysLeft >= 2) {
                return `${t('trial_left_prefix')} ${trial.daysLeft} ${t('trial_left_days_pl')} ${t('trial_left_suffix')}`
              } else if (trial.daysLeft === 1) {
                return `${t('trial_left_prefix')} 1 ${t('trial_left_days')} ${t('trial_left_suffix')}`
              } else if (trial.hoursLeft >= 2) {
                return `${t('trial_left_prefix')} ${trial.hoursLeft} ${t('trial_left_hours_pl')} ${t('trial_left_suffix')}`
              } else if (trial.hoursLeft === 1) {
                return `${t('trial_left_prefix')} 1 ${t('trial_left_hours')} ${t('trial_left_suffix')}`
              } else {
                return `${t('trial_left_prefix')} < 1 ${t('trial_left_hours')} ${t('trial_left_suffix')}`
              }
            })()}
          </span>
        </div>
      )}
      {trial?.expired && (
        <button onClick={() => nav('/trial')} className="card" style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 12, padding: 14, marginTop: 12, background: 'var(--danger-soft)', borderColor: 'transparent', textAlign: 'start' }}>
          <span style={{ fontSize: 20 }}>🔒</span>
          <span style={{ flex: 1, fontWeight: 700, color: 'var(--danger)' }}>{t('trial_ended_title')}</span>
          <Icon name="back" size={18} />
        </button>
      )}

      <div style={{ marginTop: 14 }}>
        <span className="pill pill-green">📦 {t('plan_planned_for')} {store.name}</span>
      </div>

      {/* cost + shopping */}
      <div className="grid2" style={{ marginTop: 14 }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="section-label" style={{ margin: 0 }}>{t('plan_cost')}</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{fmtMAD0(total)}</div>
          <div style={{ fontSize: 13, color: budgetPct > 100 ? 'var(--danger)' : 'var(--muted)', fontWeight: 600 }}>/ {fmtMAD0(budget)}</div>
          <div style={{ height: 8, background: 'var(--card-2)', borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
            <div style={{ width: `${budgetPct}%`, height: '100%', background: budgetPct >= 100 ? 'var(--danger)' : 'linear-gradient(90deg,var(--accent-600),var(--accent))' }} />
          </div>
        </div>
        <button onClick={() => nav('/shopping')} className="card" style={{ padding: 16, textAlign: 'start', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--accent-soft)', borderColor: 'transparent' }}>
          <Icon name="list" size={22} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>{articles} {t('plan_articles')}</div>
            <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--accent)' }}>{t('plan_shopping')}</div>
          </div>
        </button>
      </div>

      {/* day-by-day accordion */}
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {byDay.map(([dayIndex, dayMeals]) => {
          const open = openDay === dayIndex
          return (
            <div key={dayIndex} className="card" style={{ overflow: 'hidden' }}>
              <div
                role="button"
                onClick={() => setOpenDay(open ? -1 : dayIndex)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer' }}
              >
                <div style={{
                  width: 46, height: 46, borderRadius: 12, flexShrink: 0, fontWeight: 800, fontSize: 15,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: open ? 'var(--accent)' : 'var(--card-2)', color: open ? 'var(--accent-ink)' : 'var(--accent)',
                }}>
                  {shortDays[dayIndex]?.[lang] ?? `J${dayIndex + 1}`}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{fullDays[dayIndex]?.[lang] ?? `Jour ${dayIndex + 1}`}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                    {dayMeals.length} {dayMeals.length > 1 ? 'repas' : 'repas'} · {fmtMAD0(dayCost(dayMeals))}
                  </div>
                </div>
                <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} />
              </div>

              {open && (
                <div className="fade-in" style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {dayMeals.map((meal) => {
                    const recipe = recipeMap[meal.recipeId]
                    if (!recipe) return null
                    const price = recipePricePerPerson(recipe, store) * meal.people
                    return (
                      <div
                        key={meal.mealType}
                        role="button"
                        onClick={() => nav(`/meal/${dayIndex}/${meal.mealType}`)}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 14, background: 'var(--card-2)', cursor: 'pointer' }}
                      >
                        <div style={{ width: 54, flexShrink: 0 }}><RecipePhoto recipe={recipe} height={54} radius={12} /></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, color: 'var(--muted-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>{MEAL_LABELS[meal.mealType][lang]}</div>
                          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', margin: '1px 0 5px' }}>{recipe.name[lang]}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ color: 'var(--muted)', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="clock" size={12} />{recipe.timeMin}m</span>
                            {recipe.tags.slice(0, 2).map((tg) => <TagChip key={tg} tag={tg} lang={lang} />)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{fmtMAD(price)}</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* fridge */}
      <button onClick={() => nav('/fridge')} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, marginTop: 14, width: '100%', textAlign: 'start' }}>
        <span style={{ fontSize: 22 }}>🧊</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>{t('fridge_title')}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>{t('fridge_sub')}</div>
        </div>
        <Icon name="back" size={18} />
      </button>

      {/* next weeks */}
      <div className="section-label">{t('weeks_title')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1, 2, 3].map((w) => (
          <button key={w} onClick={() => nav('/weeks')} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%', textAlign: 'start' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--card-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
              <Icon name="lock" size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{t('week_n')} {w + 1}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{t('locked_hint')}</div>
            </div>
            <span className="tag" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>🔒</span>
          </button>
        ))}
      </div>

      <BottomNav active="plan" />
    </div>
  )
}
