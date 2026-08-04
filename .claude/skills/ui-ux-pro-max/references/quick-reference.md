# Quick Reference — Full Rule Set (all 10 categories)

Load this file when doing a UI review/audit pass, or when you need the full checklist for a category beyond the priority table in SKILL.md.

## 1. Accessibility (CRITICAL)
- `color-contrast` - Minimum 4.5:1 ratio for normal text (large text 3:1)
- `focus-states` - Visible focus rings on interactive elements (2–4px)
- `alt-text` - Descriptive alt text for meaningful images
- `aria-labels` - aria-label for icon-only buttons
- `keyboard-nav` - Tab order matches visual order; full keyboard support
- `form-labels` - Use label with for attribute
- `skip-links` - Skip to main content for keyboard users
- `heading-hierarchy` - Sequential h1→h6, no level skip
- `color-not-only` - Don't convey info by color alone
- `dynamic-type` - Support system text scaling
- `reduced-motion` - Respect prefers-reduced-motion
- `escape-routes` - Provide cancel/back in modals and multi-step flows

## 2. Touch & Interaction (CRITICAL)
- `touch-target-size` - Min 44×44pt (Apple) / 48×48dp (Material)
- `touch-spacing` - Minimum 8px/8dp gap between touch targets
- `hover-vs-tap` - Don't rely on hover alone
- `loading-buttons` - Disable button during async; show spinner
- `error-feedback` - Clear error messages near problem
- `cursor-pointer` - Add cursor-pointer to clickable elements
- `tap-delay` - Use touch-action: manipulation
- `press-feedback` - Visual feedback on press (ripple/highlight)

## 3. Performance (HIGH)
- `image-optimization` - WebP/AVIF, responsive images, lazy load
- `font-loading` - font-display: swap to avoid invisible text
- `critical-css` - Prioritize above-the-fold CSS
- `lazy-loading` - Lazy load non-hero components
- `bundle-splitting` - Split code by route/feature
- `progressive-loading` - Skeleton screens instead of spinners

## 4. Style Selection (HIGH)
- `style-match` - Match style to product type
- `consistency` - Same style across all pages
- `no-emoji-icons` - Use SVG icons, not emojis
- `primary-action` - One primary CTA per screen

## 5. Layout & Responsive (HIGH)
- `viewport-meta` - width=device-width initial-scale=1
- `mobile-first` - Design mobile-first
- `readable-font-size` - Minimum 16px body on mobile
- `horizontal-scroll` - No horizontal scroll on mobile
- `spacing-scale` - 4pt/8dp incremental spacing

## 6. Typography & Color (MEDIUM)
- `line-height` - 1.5–1.75 for body text
- `font-pairing` - Match heading/body font personalities
- `color-semantic` - Semantic color tokens
- `number-tabular` - Tabular figures for prices/data

## 7. Animation (MEDIUM)
- `duration-timing` - 150–300ms micro-interactions
- `transform-performance` - transform/opacity only
- `easing` - ease-out entering, ease-in exiting
- `reduced-motion` - Respect prefers-reduced-motion

## 8. Forms & Feedback (MEDIUM)
- `input-labels` - Visible label per input
- `error-placement` - Error below related field
- `submit-feedback` - Loading → success/error state
- `required-indicators` - Mark required fields

## 9. Navigation Patterns (HIGH)
- `bottom-nav-limit` - Max 5 items in bottom nav
- `back-behavior` - Predictable back navigation
- `nav-state-active` - Highlight current location
- `modal-escape` - Clear close/dismiss affordance

## 10. Charts & Data (LOW)
- `chart-type` - Match chart to data type
- `color-guidance` - Accessible color palettes
- `legend-visible` - Always show legend
- `responsive-chart` - Reflow on small screens
