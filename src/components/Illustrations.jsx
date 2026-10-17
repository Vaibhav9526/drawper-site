// Hand-drawn explainer sketches in the "Ian Xiaohei" style (github.com/helloianneo,
// MIT): one concept each, a deadpan bean mascot doing the core action, sparse
// handwritten notes. Adapted for a dark page: off-white linework, yellow body,
// black dot eyes, English notes in orange / blue / yellow.
const LINE = '#ece9e2'
const SUN = '#ffd900'
const OR = '#ff9a3d'
const BL = '#5aa9ff'

// wobble filter, referenced by every sketch below. Mount once.
export function SketchDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <filter id="wob" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" />
      </filter>
    </svg>
  )
}

function Svg({ label, children }) {
  return (
    <svg viewBox="0 0 640 360" role="img" aria-label={label} className="w-full h-auto block">
      <g filter="url(#wob)" fill="none" stroke={LINE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  )
}

function Note({ x, y, children, color = LINE, size = 25, anchor = 'middle' }) {
  return (
    <text x={x} y={y} fill={color} stroke="none" fontFamily="Caveat, cursive" fontWeight="600" fontSize={size} textAnchor={anchor}>
      {children}
    </text>
  )
}

// the bean: blank, serious, thin legs. (cx, cy) is the middle of the body.
function Xiaohei({ cx, cy, s = 1 }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <path d="M0 -70 C 28 -70 41 -40 39 -4 C 37 21 22 31 0 31 C -22 31 -37 21 -39 -4 C -41 -40 -28 -70 0 -70Z" fill={SUN} stroke="#14120a" strokeWidth="1.6" />
      <circle cx="-12" cy="-36" r="5" fill="#14120a" stroke="none" />
      <circle cx="11" cy="-36" r="5" fill="#14120a" stroke="none" />
      <path d="M-12 31 L-14 57 M12 31 L14 57" stroke={SUN} strokeWidth="3" />
    </g>
  )
}

const Ground = ({ x, y, w = 60 }) => <path d={`M${x} ${y} h${w}`} strokeWidth="1.6" strokeDasharray="2 7" />

// 1. an arrow becomes a foreign key: the bean stitches a thread between two drawers
export function ForeignKeySketch() {
  return (
    <Svg label="A mascot stitches a thread from the orders drawer to the customers drawer, and an FK tag appears on it">
      {/* orders cabinet */}
      <rect x="52" y="150" width="122" height="132" />
      <path d="M52 194 H174 M52 238 H174" />
      <path d="M100 172 h26 M100 216 h26 M100 260 h26" strokeWidth="2" />
      {/* customers cabinet */}
      <rect x="462" y="104" width="122" height="132" />
      <path d="M462 148 H584 M462 192 H584" />
      <path d="M510 126 h26 M510 170 h26 M510 214 h26" strokeWidth="2" />
      <Ground x="40" y="284" w="150" />
      <Ground x="450" y="238" w="150" />
      <Ground x="270" y="338" w="120" />

      <Xiaohei cx="318" cy="268" />
      {/* arm up to the needle */}
      <path d="M356 252 L394 210" stroke={SUN} strokeWidth="3" />
      <circle cx="396" cy="208" r="4" fill={SUN} stroke="none" />

      {/* the thread: orange = the path */}
      <path d="M174 216 C 232 262, 292 156, 396 208 C 430 224, 440 176, 460 166" stroke={OR} strokeWidth="3" />
      <path d="M447 158 L461 166 L449 178" stroke={OR} strokeWidth="3" />
      {/* FK tag hanging on the thread */}
      <rect x="236" y="170" width="44" height="26" rx="5" stroke={SUN} />
      <Note x="258" y="190" color={SUN} size={22}>FK</Note>

      <Note x="113" y="132">orders</Note>
      <path d="M113 140 v6" strokeWidth="1.8" />
      <Note x="523" y="86">customers</Note>
      <path d="M523 94 v6" strokeWidth="1.8" />
      <Note x="318" y="62" color={BL}>you only drew an arrow</Note>
      <path d="M300 72 C 280 100, 272 132, 262 162" stroke={BL} strokeWidth="1.8" strokeDasharray="6 6" />
    </Svg>
  )
}

// 2. one drawing, four files: the bean pushes the lever on a toaster
export function ToasterSketch() {
  const slices = [
    { x: 228, y: 112, t: 'SQL' },
    { x: 300, y: 128, t: 'Prisma' },
    { x: 372, y: 106, t: 'Drizzle' },
    { x: 444, y: 122, t: 'TS' },
  ]
  return (
    <Svg label="A mascot pushes the lever on a toaster and four generated files pop out: SQL, Prisma, Drizzle and TS">
      {slices.map((s) => (
        <g key={s.t}>
          <rect x={s.x} y={s.y} width="58" height={186 - s.y} fill="#000" />
          <Note x={s.x + 29} y={s.y + 34} size={20} color={SUN}>{s.t}</Note>
          <path d={`M${s.x + 12} ${s.y + 48} h34 M${s.x + 12} ${s.y + 58} h22`} strokeWidth="1.6" />
        </g>
      ))}
      {/* toaster body */}
      <path d="M214 186 L240 166 H486 L512 186 Z" fill="#000" />
      <rect x="206" y="186" width="314" height="96" rx="20" fill="#000" />
      <path d="M230 176 H252 M302 176 H324 M374 176 H396 M446 176 H468" strokeWidth="1.6" />
      <circle cx="486" cy="236" r="9" />
      <Ground x="196" y="284" w="340" />
      {/* lever */}
      <path d="M206 224 H184" strokeWidth="3" />
      <circle cx="180" cy="224" r="7" fill="#000" />

      <Xiaohei cx="104" cy="240" />
      <path d="M142 228 L174 224" stroke={SUN} strokeWidth="3" />
      {/* other hand holds the drawing */}
      <path d="M68 226 L48 190" stroke={SUN} strokeWidth="3" />
      <g transform="rotate(-9 52 160)">
        <rect x="26" y="130" width="50" height="58" fill="#000" />
        <path d="M36 146 h30 M36 158 h20 M36 170 h26" strokeWidth="1.6" />
      </g>
      <Ground x="60" y="298" w="90" />

      <Note x="64" y="108" color={BL}>one drawing</Note>
      <Note x="388" y="66" color={OR}>four files</Note>
      <path d="M388 76 C 392 90, 396 98, 400 104" stroke={OR} strokeWidth="2.4" />
      <path d="M392 96 L400 105 L407 95" stroke={OR} strokeWidth="2.4" />
    </Svg>
  )
}

// 3. code you already have becomes a diagram: the bean unzips it
export function UnzipSketch() {
  return (
    <Svg label="A mascot pulls a zipper down a schema file, and an ER diagram appears underneath">
      <rect x="196" y="40" width="268" height="170" fill="#000" />
      {/* left half: code lines */}
      <path d="M214 66 h58 M226 86 h82 M226 104 h50 M226 122 h88 M214 142 h44 M214 164 h70" strokeWidth="2" />
      <path d="M214 66 h28" stroke={SUN} strokeWidth="3" />
      {/* right half: diagram */}
      <rect x="352" y="56" width="42" height="28" />
      <rect x="414" y="84" width="40" height="28" />
      <rect x="360" y="136" width="46" height="28" />
      <path d="M394 70 H404 V84 M384 84 V136 M406 150 H434 V112" stroke={OR} strokeWidth="2.6" />
      {/* zipper */}
      <path d="M330 40 V204" strokeDasharray="4 5" strokeWidth="2.6" />
      <path d="M330 204 h-6 l6 18 l6 -18 z" fill={SUN} stroke="none" />

      <Xiaohei cx="416" cy="268" />
      <path d="M380 252 C 360 244, 340 230, 332 214" stroke={SUN} strokeWidth="3" />
      <Ground x="380" y="326" w="90" />

      <Note x="268" y="26" color={BL}>schema.prisma</Note>
      <Note x="404" y="26" color={BL}>ER diagram</Note>
      <Note x="250" y="262" color={SUN}>unzip it</Note>
      <path d="M278 270 C 300 276, 318 270, 332 252" stroke={SUN} strokeWidth="1.8" strokeDasharray="6 6" />
    </Svg>
  )
}
