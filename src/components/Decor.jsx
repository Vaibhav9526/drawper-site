// Elements drawn from the hero picture, scattered through the whole page:
// clouds, birds, falling leaves, and the meadow with the girl at the end.
// Their motion lives in ../fx.js and is keyed off the data-* attributes here.

export function Defs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <filter id="wob" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="5" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3" />
      </filter>
    </svg>
  )
}

export function Leaves() {
  return (
    <div aria-hidden="true" data-leaves className="fixed inset-0 pointer-events-none z-[6] overflow-hidden">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} data-leaf={i} viewBox="0 0 40 18" width={16 + (i % 3) * 6} className="absolute left-0 top-0 will-change-transform opacity-60">
          <path d="M1 9 C9 1 27 0 39 9 C27 18 9 17 1 9Z" fill={i % 2 ? '#b9dd8a' : '#cfe8a4'} stroke="#7fae56" strokeOpacity=".5" strokeWidth=".8" />
          <path d="M3 9 C14 8.500 26 8.500 37 9" fill="none" stroke="#7fae56" strokeOpacity=".5" strokeWidth=".8" />
        </svg>
      ))}
    </div>
  )
}

// a warm wash over the whole window that fades in as the day turns to evening
export function Haze() {
  return <div aria-hidden="true" data-haze className="fixed inset-0 pointer-events-none z-[4] opacity-0" style={{ background: 'linear-gradient(to top, rgba(255,140,70,.34), rgba(255,176,116,.12) 46%, transparent 72%)' }} />
}
