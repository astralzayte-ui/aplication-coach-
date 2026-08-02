import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getStore } from '../data/stores'
import { recipeMap } from '../data/recipes'
import { ingredientMap } from '../data/ingredients'
import { recipePricePerPerson, fmtMAD } from '../lib/pricing'
import { alternativesFor } from '../lib/planGenerator'
import { RecipePhoto, Icon, TagChip } from '../components/ui'
import type { Allergen, Recipe } from '../data/types'

const ALLERGEN_LABEL: Record<Allergen, { fr: string; ar: string }> = {
  gluten: { fr: 'gluten', ar: 'غلوتين' }, lactose: { fr: 'lait', ar: 'حليب' },
  oeuf: { fr: 'œuf', ar: 'بيض' }, poisson: { fr: 'poisson', ar: 'سمك' },
  crustace: { fr: 'crustacés', ar: 'قشريات' }, fruits_coque: { fr: 'fruits à coque', ar: 'مكسرات' },
  soja: { fr: 'soja', ar: 'صويا' }, arachide: { fr: 'arachide', ar: 'فول سوداني' },
}

function ingQtyLabel(unit: string, qty: number, lang: string) {
  const r = Math.round(qty)
  if (unit === 'piece') return `${Math.round(qty * 10) / 10} ${lang === 'ar' ? 'وحدة' : 'pc'}`
  if (unit === 'ml') return qty >= 1000 ? `${Math.round(qty / 100) / 10} L` : `${r} ml`
  return qty >= 1000 ? `${Math.round(qty / 100) / 10} kg` : `${r} g`
}

export default function MealDetail() {
  const { t, lang, state, swapMeal } = useApp()
  const nav = useNavigate()
  const { day, type } = useParams()
  const dayIndex = Number(day)
  const store = getStore(state.onboarding.storeId)
  const [showSwap, setShowSwap] = useState(false)

  const meal = state.plan?.find((m) => m.dayIndex === dayIndex && m.mealType === type)
  const recipe = meal ? recipeMap[meal.recipeId] : undefined

  const allergens = useMemo(() => {
    if (!recipe) return []
    const set = new Set<Allergen>()
    for (const ri of recipe.ingredients) ingredientMap[ri.id]?.allergens.forEach((a) => set.add(a))
    return [...set]
  }, [recipe])

  const alts = useMemo(() => (recipe ? alternativesFor(recipe.id, state.onboarding) : []), [recipe, state.onboarding])

  if (!meal || !recipe) {
    return <div className="screen"><button onClick={() => nav('/plan')} className="back-btn"><Icon name="back" /></button></div>
  }

  const people = meal.people
  const pricePer = recipePricePerPerson(recipe, store)

  const Stat = ({ icon, emoji, value, label }: { icon?: string; emoji?: string; value: string; label: string }) => (
    <div style={{ textAlign: 'center', padding: '4px 0' }}>
      <div style={{ color: 'var(--green-600)', fontSize: 18, height: 22 }}>{icon ? <Icon name={icon} size={20} /> : emoji}</div>
      <div style={{ fontWeight: 800, fontSize: 18, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.06em' }}>{label}</div>
    </div>
  )

  const doSwap = (r: Recipe) => { swapMeal(dayIndex, meal.mealType, r.id); setShowSwap(false) }

  return (
    <div className="screen scroll" style={{ padding: 0 }}>
      {/* hero */}
      <div style={{ position: 'relative' }}>
        <RecipePhoto recipe={recipe} height={300} radius={0} />
        <button onClick={() => nav(-1)} className="back-btn" style={{ position: 'absolute', top: 16, insetInlineStart: 16, background: 'rgba(10,12,13,.7)', backdropFilter: 'blur(6px)', color: '#fff' }}>
          <Icon name="back" size={20} />
        </button>
        <button onClick={() => setShowSwap(true)} style={{ position: 'absolute', top: 16, insetInlineEnd: 16, background: 'rgba(10,12,13,.7)', backdropFilter: 'blur(6px)', color: '#fff', borderRadius: 999, padding: '9px 16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="refresh" size={16} /> {t('change')}
        </button>
      </div>

      <div style={{ padding: '20px 22px 30px' }}>
        <h1 className="title" style={{ fontSize: 26 }}>{recipe.name[lang]}</h1>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {recipe.tags.map((tg) => <TagChip key={tg} tag={tg} lang={lang} />)}
        </div>

        <div className="card" style={{ padding: '14px 6px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
            <Stat emoji="💪" value={`${recipe.protein}g`} label={t('protein')} />
            <Stat emoji="🌾" value={`${recipe.carbs}g`} label={t('carbs')} />
            <Stat emoji="💧" value={`${recipe.fat}g`} label={t('fat')} />
            <Stat icon="flame" value={`${recipe.kcal}`} label={t('kcal')} />
            <Stat emoji="💰" value={fmtMAD(pricePer, 1)} label={t('price_per')} />
            <Stat icon="clock" value={`${recipe.timeMin} min`} label={t('time')} />
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', margin: '10px 0 4px' }}>{t('nutri_note')}</div>

        {allergens.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--warn)', fontSize: 14, fontWeight: 600, marginTop: 8 }}>
            ⚠️ {allergens.map((a) => ALLERGEN_LABEL[a][lang]).join(', ')}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{t('ingredients')}</h2>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--muted)', fontWeight: 600 }}><Icon name="person" size={16} /> {people}</span>
        </div>
        <div style={{ marginTop: 12 }}>
          {recipe.ingredients.map((ri) => {
            const ing = ingredientMap[ri.id]
            if (!ing) return null
            return (
              <div key={ri.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{ing.emoji}</div>
                <div style={{ flex: 1, fontWeight: 600 }}>{ing.name[lang]}</div>
                <div style={{ color: 'var(--muted)', fontWeight: 600 }}>{ingQtyLabel(ing.unit, ri.qtyPerPerson * people, lang)}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* swap sheet */}
      {showSwap && (
        <div onClick={() => setShowSwap(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--bg)', width: '100%', maxWidth: 480, margin: '0 auto', borderRadius: '22px 22px 0 0', padding: 20, maxHeight: '78vh', overflowY: 'auto' }}>
            <div style={{ width: 40, height: 4, background: '#d9d0c4', borderRadius: 999, margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 14px' }}>{t('choose_other')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alts.map((r) => (
                <button key={r.id} onClick={() => doSwap(r)} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, textAlign: 'start' }}>
                  <div style={{ width: 52 }}><RecipePhoto recipe={r} height={52} radius={12} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name[lang]}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 12, display: 'flex', gap: 8, marginTop: 2 }}>
                      <span>⏱ {r.timeMin}m</span><span>🔥 {r.kcal}</span><span>{fmtMAD(recipePricePerPerson(r, store), 1)}</span>
                    </div>
                  </div>
                  <Icon name="refresh" size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
