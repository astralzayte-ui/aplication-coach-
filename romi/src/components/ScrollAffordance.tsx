import { useEffect, useState } from 'react'
import { Icon } from './ui'

// Window-level scroll helpers shared by every screen:
//  - a thin right-edge indicator that appears whenever the page can scroll,
//    so it's obvious there's more content below;
//  - a back-to-top arrow once the user has scrolled down.
export default function ScrollAffordance() {
  const [ratio, setRatio] = useState(0)
  const [scrollable, setScrollable] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const measure = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const y = window.scrollY
      setScrollable(max > 60)
      setRatio(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0)
      setShowTop(max > 60 && y > 260)
    }
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    const id = window.setInterval(measure, 350) // catch route/content changes
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      window.clearInterval(id)
    }
  }, [])

  return (
    <>
      {scrollable && (
        <div className="scroll-rail" aria-hidden>
          <i style={{ top: `calc(${ratio * 100}% - ${ratio * 26}%)` }} />
        </div>
      )}
      {showTop && (
        <button
          className="scroll-top-btn"
          aria-label="Remonter en haut"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Icon name="arrow-up" size={22} />
        </button>
      )}
    </>
  )
}
