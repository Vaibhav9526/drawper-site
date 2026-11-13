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

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => `rgb(${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t)).join(',')})`
// clouds are white in the morning and turn peach and rose toward the evening end of the page
const warm = (top) => {
  const t = Math.min(1, Math.max(0, (top - 48) / 42))
  return { fill: mix('#ffffff', '#ffe2c6', t), line: mix('#9fbdf0', '#ee9f8a', t), inner: mix('#c4d9fa', '#f7c4a6', t) }
}

const CLOUDS = [
  'M30 96 C8 96 4 66 28 62 C26 38 56 30 72 46 C84 20 126 22 134 50 C160 40 182 62 168 84 C182 98 168 112 150 108 L50 108 C40 112 30 106 30 96 Z',
  'M20 100 C0 98 2 70 26 68 C28 44 62 38 76 58 C90 34 130 38 136 62 C160 56 176 80 160 98 C174 108 160 116 144 112 L40 112 C30 116 20 110 20 100 Z',
  'M24 92 C6 90 8 62 32 62 C36 36 70 32 82 52 C98 28 138 36 140 62 C168 58 186 82 168 98 L44 104 C34 106 26 100 24 92 Z',
]

// [top %, left %, width px, variant, parallax speed, flip]
const PLACED = [
  [2.5, 62, 360, 0, 0.18, 1], [6, 6, 240, 1, 0.3, 0], [11, 78, 280, 2, 0.12, 1], [17, 30, 200, 1, 0.38, 0],
  [24, 88, 320, 0, 0.22, 0], [31, 4, 300, 2, 0.16, 1], [38, 70, 220, 1, 0.34, 0], [46, 18, 340, 0, 0.14, 0],
  [54, 84, 260, 2, 0.28, 1], [62, 8, 220, 1, 0.2, 0], [70, 62, 360, 0, 0.12, 1], [78, 22, 260, 2, 0.3, 0], [86, 80, 300, 1, 0.18, 1],
]

export function Clouds() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {PLACED.map(([top, left, w, v, speed, flip], i) => (
        <svg key={i} data-cloud={speed} data-dir={i % 2 ? 1 : -1} viewBox="0 0 200 130" style={{ top: `${top}%`, left: `${left}%`, width: w }} className="absolute will-change-transform">
          <g filter="url(#wob)" transform={flip ? 'translate(200 0) scale(-1 1)' : undefined}>
            <path d={CLOUDS[v]} fill={warm(top).fill} stroke={warm(top).line} strokeWidth="2.600" strokeLinejoin="round" opacity=".92" />
            <path d="M56 86 C64 78 80 78 88 86 M104 70 C112 62 128 64 134 72" fill="none" stroke={warm(top).inner} strokeWidth="2.400" strokeLinecap="round" />
          </g>
        </svg>
      ))}
    </div>
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
