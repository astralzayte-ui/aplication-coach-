# UI/UX Pro Max — Pro Rules
## Native / Mobile App Rules + Pre-Delivery Checklist

---

## NATIVE & MOBILE APP RULES

### Touch Targets (Critical)
- Minimum interactive area: **44×44 pt (iOS) / 48×48 dp (Android)**
- Spacing between tappable elements: ≥ 8pt
- Never rely on hover states — no hover on touch devices
- Bottom-sheet close handles: ≥ 44pt height
- Floating Action Buttons (FAB): 56dp standard, 40dp mini

### Gestures
- Swipe-to-dismiss must have a clear visual affordance (handle bar)
- Back navigation: support both swipe-back (iOS) and hardware back (Android)
- Long-press: always pair with a visible alternative action
- Pinch-to-zoom: never disable on informational content

### Platform Conventions
**iOS:**
- Navigation bar height: 44pt (compact), 52pt (with subtitle)
- Tab bar: 49pt, max 5 items
- Safe area insets: always respect (notch, home indicator)
- Sheet presentation: prefer `.medium` detent for partial sheets

**Android:**
- Material You dynamic color: support via `@dynamic-color`
- Navigation bar: 3-button (56dp) or gesture (0dp) — handle both
- Floating buttons: 16dp from screen edges
- Ripple feedback on every interactive surface

### iOS SwiftUI Patterns
```swift
// Minimum touch target
.frame(minWidth: 44, minHeight: 44)
// Safe area
.ignoresSafeArea(.container, edges: .bottom)
// Reduced motion
.animation(accessibilityReduceMotion ? .none : .spring(), value: state)
```

### Flutter Patterns
```dart
// Splash / ripple
InkWell(
  borderRadius: BorderRadius.circular(8),
  onTap: () {},
  child: Padding(padding: EdgeInsets.all(12), child: widget),
)
// Minimum touch
ConstrainedBox(constraints: BoxConstraints(minHeight: 48, minWidth: 48))
```

### React Native Patterns
```jsx
// Pressable with feedback
<Pressable
  style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
  android_ripple={{ color: 'rgba(0,0,0,0.12)' }}
>
// Safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const insets = useSafeAreaInsets()
// bottom padding: insets.bottom
```

---

## PERFORMANCE RULES

### Images
- WebP for photos (30–40% smaller than JPEG at equivalent quality)
- SVG for icons and logos (never raster icons below 64px)
- Lazy loading: `loading="lazy"` on below-fold images
- Explicit `width` + `height` on all `<img>` to prevent layout shift (CLS)
- Use `srcset` / `sizes` for responsive images
- Max hero image: 200 KB compressed

### Fonts
- Inline critical font as base64 `@font-face` or use `font-display: swap`
- Limit to 2 typeface families max (3 variants each)
- Preload: `<link rel="preload" as="font" crossorigin>`

### Layout Stability
- Reserve space for async content (skeletons, aspect-ratio containers)
- Never inject content above the fold after load
- Avoid CSS `height: auto` on containers that receive dynamic content

### JavaScript
- Defer non-critical scripts: `<script defer>`
- Code-split routes — never load the whole app on first paint
- Debounce scroll and resize handlers (≥ 100ms)
- Avoid synchronous `localStorage` in the render path

### Core Web Vitals Targets
| Metric | Good | Needs Work |
|--------|------|------------|
| LCP (Largest Contentful Paint) | < 2.5s | > 4s |
| INP (Interaction to Next Paint) | < 200ms | > 500ms |
| CLS (Cumulative Layout Shift) | < 0.1 | > 0.25 |

---

## ANIMATION RULES

### Duration Scale
| Use | Duration |
|-----|---------|
| Micro (icon, badge) | 100–150ms |
| Element in/out | 180–250ms |
| Panel / sheet slide | 280–350ms |
| Page transition | 350–500ms |
| Ambient / decorative | 800ms–4s |

### Easing
- Enter: `cubic-bezier(0.0, 0.0, 0.2, 1)` — decelerate (ease-out)
- Exit: `cubic-bezier(0.4, 0.0, 1, 1)` — accelerate (ease-in)
- Standard: `cubic-bezier(0.4, 0.0, 0.2, 1)` — ease-in-out
- Spring (native): stiffness 300, damping 25

### Reduced Motion (Critical)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### What Not to Animate
- Never animate `width` / `height` — use `transform: scaleX/Y` instead
- Never animate `top` / `left` — use `transform: translate` instead
- `opacity` + `transform` are GPU-composited and safe
- Avoid animating more than 3 elements simultaneously

---

## NAVIGATION PATTERNS

### Mobile Navigation
- Bottom tab bar: max 5 items, icon + label (or icon only if universally understood)
- Hamburger: only on secondary/utility navigation, never primary
- Deep linking: every screen must be directly linkable
- Back button label (iOS): show parent screen name, not "Back"

### Web Navigation
- Sticky header: max 60–72px height, compress on scroll
- Skip-to-content link: visible on focus for keyboard users
- Active state: always indicate current page in nav
- Breadcrumbs: required when depth > 2 levels

### Search
- Search field: always in nav or top of page, never buried
- Results appear within 100ms (skeleton) → 300ms (real content)
- Empty state: suggest alternatives, not just "No results"

---

## FORMS & FEEDBACK RULES

### Labels
- Always visible label — no placeholder-only forms
- Label above field (not inline/floating) for highest scanability
- Required fields: mark with `*` + explain `* Required` once at top
- Error text below the field, in red, with an icon

### Input Design
- Height: 44–52px (desktop), 48–56px (mobile)
- Border: 1px neutral, 2px on focus (accent color)
- Font size: ≥ 16px on mobile (prevents iOS zoom)
- Autocomplete attributes: always set (`autocomplete="email"` etc.)

### Validation
- Validate on blur, not on every keystroke
- Show success state after valid input (green checkmark)
- Inline errors: specific (`"Phone must be 10 digits"` not `"Invalid input"`)
- Submit button: disabled until required fields complete OR validate on submit

### Feedback Timing
| Action | Feedback |
|--------|---------|
| Button tap | Ripple / press state < 50ms |
| Form submit | Loading spinner within 100ms |
| Success | Toast / confirmation < 300ms |
| Error | Inline error immediately |
| Long operation | Progress bar if > 2s |

---

## ACCESSIBILITY RULES

### Color Contrast
| Text Size | Minimum Ratio |
|-----------|--------------|
| Normal text (< 18pt) | 4.5:1 |
| Large text (≥ 18pt or 14pt bold) | 3:1 |
| UI components, icons | 3:1 |
| Decorative elements | Exempt |

### Keyboard Navigation
- `Tab` order follows visual reading order
- All interactive elements focusable and operable with Enter/Space
- Focus indicator: visible ring (≥ 2px, high contrast)
- No keyboard traps (modals must be escapable via Escape)
- Skip nav link: first focusable element on every page

### Screen Readers
- All images: meaningful `alt` or `alt=""` for decorative
- Icons with no text label: `aria-label` or `aria-labelledby`
- Form inputs: always `<label>` with matching `for`/`id`
- Dynamic content: `aria-live="polite"` for updates
- Modals: `role="dialog"`, `aria-modal="true"`, focus trap

### ARIA Usage
```html
<!-- Navigation landmark -->
<nav aria-label="Main navigation">

<!-- Live region for async updates -->
<div aria-live="polite" aria-atomic="true" class="sr-only"></div>

<!-- Icon button -->
<button aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>
```

---

## PRE-DELIVERY CHECKLIST

### Visual Quality
- [ ] Consistent spacing — no arbitrary pixel values, use a scale (4/8/12/16/24/32/48/64)
- [ ] Typography hierarchy clear at a glance (3 levels max: display → body → caption)
- [ ] All text meets contrast ratios (run through a checker)
- [ ] Both light and dark themes tested and polished
- [ ] No orphaned words in headings (adjust line-breaks)
- [ ] Images have correct aspect ratios, no distortion
- [ ] Icons consistent size and style throughout

### Interaction Quality
- [ ] All buttons have hover, active, focus, and disabled states
- [ ] Form validation works correctly and gives clear messages
- [ ] Loading states implemented for all async operations
- [ ] Empty states designed and implemented
- [ ] Error states designed (404, network error, etc.)
- [ ] Animations respect `prefers-reduced-motion`

### Responsive Design
- [ ] Tested at 320px, 375px, 768px, 1024px, 1280px, 1440px widths
- [ ] No horizontal scroll on any viewport
- [ ] Touch targets ≥ 44px on mobile
- [ ] Text never overflows its container
- [ ] Images never overflow their container

### Accessibility
- [ ] Tab order makes sense
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Focus styles visible throughout
- [ ] Color is not the only conveyor of meaning
- [ ] Page has a logical heading structure (h1 → h2 → h3)

### Performance
- [ ] All images optimized and correctly sized
- [ ] No render-blocking resources
- [ ] Fonts load without FOIT/FOUT
- [ ] Page weight under 500 KB for landing pages

### Content & Copy
- [ ] No lorem ipsum left in production
- [ ] All placeholder data replaced or clearly marked
- [ ] CTAs are specific and action-oriented
- [ ] Error messages are human-readable
- [ ] Legal/copyright text correct and current

### Cross-Browser
- [ ] Chrome (latest)
- [ ] Safari (latest, iOS Safari)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Samsung Internet (for Android e-commerce)

### Final QA
- [ ] All internal links work
- [ ] All external links open in new tab with `rel="noopener"`
- [ ] Forms submit correctly and send to right destination
- [ ] Analytics tracking verified
- [ ] Console free of errors and warnings

---

## DESIGN TOKEN REFERENCE

### Spacing Scale (4pt base)
```
2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128
```

### Type Scale (Major Third, 1.25×)
```
10 · 12 · 14 · 16(base) · 20 · 25 · 31 · 39 · 49 · 61px
```

### Shadow Scale
```css
--shadow-xs: 0 1px 2px rgba(0,0,0,.05);
--shadow-sm: 0 1px 3px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.06);
--shadow-md: 0 4px 6px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.06);
--shadow-lg: 0 10px 15px rgba(0,0,0,.1), 0 4px 6px rgba(0,0,0,.05);
--shadow-xl: 0 20px 25px rgba(0,0,0,.1), 0 10px 10px rgba(0,0,0,.04);
--shadow-2xl: 0 25px 50px rgba(0,0,0,.25);
```

### Border Radius Scale
```
0 · 2 · 4 · 6 · 8 · 12 · 16 · 24 · 9999px (pill)
```

### Z-Index Scale
```
dropdown: 100 · sticky: 200 · overlay: 300 · modal: 400 · toast: 500 · tooltip: 600
```
