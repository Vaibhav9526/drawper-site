// Hand-drawn stand-ins for the app screenshots, in the brand's chunky outlined style:
// flat colour, a heavy outline, an offset "thick" edge, wobbly strokes.
const INK = '#0d1b3e'
const C = { blue: '#2f7bff', sun: '#ffd900', mint: '#87dac7', coral: '#ff7a6b', violet: '#8b7dfa', sky: '#a9cbff', plum: '#2e2936', paper: '#fbfdff' }
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'
const DISPLAY = '-apple-system, BlinkMacSystemFont, SF Pro Display, Inter, sans-serif'

function Defs({ id }) {
  return (
    <defs>
      <filter id={`wob-${id}`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3" />
      </filter>
      <marker id={`ah-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M1 1.500L9 5L1 8.500" fill="none" stroke={INK} strokeWidth="1.800" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
    </defs>
  )
}

const Frame = ({ id, label, children }) => (
  <svg viewBox="0 0 800 400" role="img" aria-label={label} className="w-full h-auto block paper-dots">
    <Defs id={id} />
    <g filter={`url(#wob-${id})`} strokeLinecap="round" strokeLinejoin="round">{children}</g>
  </svg>
)

// a chunky component block: coloured face over a darker thick edge
function Block({ x, y, w = 138, h = 66, fill, label, sub, light = false }) {
  return (
    <g>
      <rect x={x} y={y + 7} width={w} height={h} rx="16" fill={INK} />
      <rect x={x} y={y} width={w} height={h} rx="16" fill={fill} stroke={INK} strokeWidth="2.600" />
      <text x={x + w / 2} y={y + h / 2 - 1} textAnchor="middle" fontFamily={DISPLAY} fontWeight="600" fontSize="17" fill={light ? '#fff' : INK}>{label}</text>
      <text x={x + w / 2} y={y + h / 2 + 17} textAnchor="middle" fontFamily={MONO} fontSize="10.500" fill={light ? '#ffffffb3' : '#0d1b3eaa'}>{sub}</text>
    </g>
  )
}

const Arrow = ({ id, d, dash, w = 2.4 }) => (
  <path d={d} fill="none" stroke={INK} strokeWidth={w} strokeDasharray={dash} markerEnd={`url(#ah-${id})`} />
)
const Note = ({ x, y, children, rot = 0, color = '#e0453f', size = 25, anchor = 'start' }) => (
  <text x={x} y={y} fontFamily="Caveat, cursive" fontWeight="600" fontSize={size} fill={color} textAnchor={anchor} transform={`rotate(${rot} ${x} ${y})`}>{children}</text>
)

function Tbl({ x, y, w = 196, title, head, rows }) {
  const h = 38 + rows.length * 26 + 8
  return (
    <g>
      <rect x={x} y={y + 7} width={w} height={h} rx="14" fill={INK} />
      <rect x={x} y={y} width={w} height={h} rx="14" fill={C.paper} stroke={INK} strokeWidth="2.600" />
      <path d={`M${x} ${y + 38} V${y + 14} a14 14 0 0 1 14 -14 H${x + w - 14} a14 14 0 0 1 14 14 V${y + 38}Z`} fill={head} stroke={INK} strokeWidth="2.600" />
      <text x={x + w / 2} y={y + 25} textAnchor="middle" fontFamily={DISPLAY} fontWeight="600" fontSize="16" fill={INK}>{title}</text>
      {rows.map(([n, t, k], i) => (
        <g key={n} transform={`translate(${x} ${y + 38 + 22 + i * 26})`}>
          {k === 'FK' && <rect x="6" y="-17" width={w - 12} height="23" rx="6" fill={C.coral} fillOpacity=".38" />}
          <text x="14" fontFamily={MONO} fontSize="12.500" fill={INK}>{n}</text>
          <text x={w * 0.56} fontFamily={MONO} fontSize="12" fill="#0d1b3e99">{t}</text>
          {k && <text x={w - 14} textAnchor="end" fontFamily={MONO} fontSize="11.500" fontWeight="500" fill={k === 'FK' ? '#c8403d' : '#005fff'}>{k}</text>}
        </g>
      ))}
    </g>
  )
}

export function ArchitectureDrawing() {
  const id = 'arch'
  return (
    <Frame id={id} label="Hand-drawn architecture canvas: web-app, gateway, orders-api, database, cache, worker and queue joined by arrows">
      <Arrow id={id} d="M164 200 C 180 200, 190 200, 202 200" />
      <Arrow id={id} d="M346 190 C 372 170, 380 150, 398 128" />
      <Arrow id={id} d="M346 214 C 372 240, 380 262, 398 282" />
      <Arrow id={id} d="M540 108 C 566 92, 590 80, 624 72" />
      <Arrow id={id} d="M540 124 C 570 138, 594 152, 624 166" />
      <Arrow id={id} d="M540 304 C 570 304, 594 304, 624 304" />
      <Block x={26} y={166} fill={C.blue} label="web-app" sub="client · next.js" light />
      <Block x={206} y={166} fill={C.sun} label="gateway" sub="kong" />
      <Block x={400} y={82} fill={C.mint} label="orders-api" sub="api · node" />
      <Block x={400} y={262} fill={C.violet} label="mailer" sub="worker" light />
      <Block x={628} y={34} fill={C.plum} label="orders-db" sub="postgres" light />
      <Block x={628} y={134} fill={C.coral} label="cache" sub="redis" />
      <Block x={628} y={262} fill={C.sky} label="jobs" sub="queue · rabbitmq" />
      <Note x={120} y={92} rot={-6}>draw the boxes</Note>
      <path d="M150 104 C 170 120, 180 138, 190 156" fill="none" stroke="#e0453f" strokeWidth="2" markerEnd={`url(#ah-${id})`} />
      <Note x={36} y={352} size={27}>arrows become dependencies → docker-compose.yml</Note>
    </Frame>
  )
}

export function RelationsDrawing() {
  const id = 'rel'
  return (
    <Frame id={id} label="Hand-drawn canvas: an arrow from the orders table to the customers table adds a foreign key column">
      <Tbl x={500} y={36} title="customers" head={C.sun} rows={[['id', 'int', 'PK'], ['email', 'text', ''], ['created_at', 'timestamp', '']]} />
      <Tbl x={70} y={190} title="orders" head={C.mint} rows={[['id', 'int', 'PK'], ['total', 'numeric', ''], ['created_at', 'timestamp', ''], ['customer_id', 'int', 'FK']]} />
      <path d="M280 236 C 360 220, 400 150, 492 130" fill="none" stroke={INK} strokeWidth="3.200" markerEnd={`url(#ah-${id})`} />
      <Note x={330} y={168} rot={-10} size={30}>arrow in,</Note>
      <Note x={344} y={198} rot={-10} size={30}>foreign key out!</Note>
      <g transform="translate(560 262)">
        <rect y="6" width="58" height="52" rx="12" fill={INK} />
        <rect width="58" height="52" rx="12" fill={C.paper} stroke={INK} strokeWidth="2.600" />
        <text x="29" y="34" textAnchor="middle" fontFamily={DISPLAY} fontWeight="600" fontSize="28" fill={INK}>A</text>
      </g>
      <Note x={634} y={292} size={26}>the Arrow tool</Note>
    </Frame>
  )
}

export function ViewerDrawing() {
  const id = 'erd'
  return (
    <Frame id={id} label="Hand-drawn ER diagram of users, posts, comments and tags with foreign keys">
      <path d="M232 106 H 296" fill="none" stroke={INK} strokeWidth="2.400" markerEnd={`url(#ah-${id})`} />
      <path d="M418 188 V 238" fill="none" stroke={INK} strokeWidth="2.400" markerEnd={`url(#ah-${id})`} />
      <path d="M516 110 H 570 V 176 H 590" fill="none" stroke={INK} strokeWidth="2.400" markerEnd={`url(#ah-${id})`} />
      <Tbl x={36} y={44} w={190} title="users" head={C.blue} rows={[['id', 'int', 'PK'], ['name', 'text', ''], ['email', 'text', '']]} />
      <Tbl x={300} y={44} w={212} title="posts" head={C.sun} rows={[['id', 'int', 'PK'], ['user_id', 'int', 'FK'], ['title', 'text', '']]} />
      <Tbl x={300} y={238} w={212} title="comments" head={C.mint} rows={[['id', 'int', 'PK'], ['post_id', 'int', 'FK'], ['body', 'text', '']]} />
      <Tbl x={594} y={140} w={176} title="tags" head={C.coral} rows={[['id', 'int', 'PK'], ['post_id', 'int', 'FK'], ['label', 'text', '']]} />
      <Note x={238} y={96} size={22}>1</Note>
      <Note x={272} y={96} size={22}>n</Note>
      <Note x={424} y={218} size={22}>n</Note>
      <Note x={36} y={352} size={27}>open any schema file</Note>
    </Frame>
  )
}

// small chunky glyphs for the feature cards, after the brand artwork
export function Glyph({ kind }) {
  const stroke = { stroke: INK, strokeWidth: 2.400, strokeLinejoin: 'round', strokeLinecap: 'round' }
  return (
    <svg viewBox="0 0 84 56" width="84" height="56" aria-hidden="true">
      {kind === 'pill' && (<g><rect x="6" y="20" width="72" height="30" rx="15" fill={INK} /><rect x="6" y="14" width="72" height="30" rx="15" fill={C.sun} {...stroke} /><rect x="18" y="24" width="18" height="10" rx="5" fill={INK} /><rect x="46" y="24" width="18" height="10" rx="5" fill={INK} /></g>)}
      {kind === 'box' && (<g><rect x="8" y="22" width="68" height="28" rx="8" fill={INK} /><rect x="8" y="14" width="68" height="28" rx="8" fill={C.mint} {...stroke} /><circle cx="24" cy="28" r="4" fill={INK} /><circle cx="38" cy="28" r="4" fill={INK} /></g>)}
      {kind === 'bolt' && (<g><circle cx="42" cy="32" r="22" fill={INK} /><circle cx="42" cy="27" r="22" fill={C.violet} {...stroke} /><path d="M46 12 L33 31 H42 L38 44 L52 24 H43Z" fill="#fff" stroke={INK} strokeWidth="1.800" strokeLinejoin="round" /></g>)}
      {kind === 'braces' && (<g><rect x="8" y="22" width="68" height="30" rx="8" fill={INK} /><rect x="8" y="14" width="68" height="30" rx="8" fill={C.coral} {...stroke} /><path d="M30 20c-5 0-3 7-6 9 3 2 1 9 6 9M54 20c5 0 3 7 6 9-3 2-1 9-6 9" fill="none" stroke={INK} strokeWidth="2.400" strokeLinecap="round" /><path d="M36 25h12M36 31h12M36 37h8" stroke="#fff" strokeWidth="2.400" strokeLinecap="round" /></g>)}
      {kind === 'card' && (<g><rect x="10" y="22" width="64" height="30" rx="8" fill={INK} /><rect x="10" y="14" width="64" height="30" rx="8" fill={C.blue} {...stroke} /><rect x="18" y="22" width="26" height="6" rx="3" fill={INK} /><rect x="18" y="32" width="40" height="6" rx="3" fill={INK} /><circle cx="62" cy="25" r="4" fill="none" stroke={INK} strokeWidth="2" /></g>)}
    </svg>
  )
}
