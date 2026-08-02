// Stylised, self-contained brand marks (no external images, CSP-safe).
// Recognisable approximations in each brand's colours.

function CarrefourMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      {/* blue left chevron */}
      <path d="M52 8 L12 50 L52 92 L52 68 L36 50 L52 32 Z" fill="#004e9e" />
      {/* red right chevron */}
      <path d="M48 8 L88 50 L48 92 L48 68 L64 50 L48 32 Z" fill="#e2001a" />
    </svg>
  )
}

export default function StoreLogo({ id }: { id: string }) {
  switch (id) {
    case 'carrefour':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <CarrefourMark size={38} />
          <span style={{ fontWeight: 800, fontSize: 17, color: '#004e9e', letterSpacing: '-.3px' }}>Carrefour</span>
        </div>
      )
    case 'carrefour_market':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <CarrefourMark size={34} />
          <span style={{ fontWeight: 800, fontSize: 15, color: '#004e9e', letterSpacing: '-.3px', lineHeight: 1 }}>Carrefour</span>
          <span style={{ fontWeight: 800, fontSize: 13, color: '#0e8f6e', letterSpacing: '3px', textTransform: 'uppercase' }}>market</span>
        </div>
      )
    case 'bim':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontWeight: 800, fontSize: 34, color: '#e30613', letterSpacing: '-1px' }}>BİM</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#e30613', letterSpacing: '1px' }}>MARKET</span>
        </div>
      )
    case 'marjane':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontWeight: 800, fontSize: 24, color: '#e2001a', letterSpacing: '-.5px' }}>marjane</span>
          <span style={{ width: 9, height: 9, borderRadius: 999, background: '#7bc043', display: 'inline-block', marginBottom: 12 }} />
        </div>
      )
    default:
      return <span style={{ fontWeight: 800 }}>{id}</span>
  }
}
