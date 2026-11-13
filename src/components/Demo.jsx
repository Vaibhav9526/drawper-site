import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import CodeBlock, { highlightHTML } from './CodeBlock'
import PlayBoard from './PlayBoard'
import Icon from './Icon'
import Words from './Words'
import { FORMATS, TW, ROW_H, HEAD_H, edge, height, toSQL, toPrisma } from '../schema'

// The product demo. One GSAP timeline moves the SVG straight in the DOM (no React work per
// frame) and the code is a pure function of the clock, so it is fast, loops, and can be scrubbed.
const DUR = 8.4
const CUST = { id: 'c', name: 'customers', x: 330, y: 30, cols: [{ n: 'id', t: 'int', k: 'PK' }, { n: 'email', t: 'text', k: '' }, { n: 'created_at', t: 'timestamp', k: '' }] }
const ORD = { id: 'o', name: 'orders', x: 36, y: 168, cols: [{ n: 'id', t: 'int', k: 'PK' }, { n: 'total', t: 'numeric', k: '' }, { n: 'created_at', t: 'timestamp', k: '' }] }
const LINK = [{ from: 'o', to: 'c' }]
const ORD_FULL = { ...ORD, cols: [...ORD.cols, { n: 'customer_id', t: 'int', k: 'FK' }] }

const S1 = toSQL([CUST], [])
const S2 = toSQL([CUST, ORD], [])
const S3 = toSQL([CUST, ORD], LINK)
const P = toPrisma([CUST, ORD], LINK)

const E = edge({ x: ORD.x, y: ORD.y, w: TW, h: height(ORD_FULL) }, { x: CUST.x, y: CUST.y, w: TW, h: height(CUST) })
const ARROW_LEN = Math.hypot(E.x2 - E.x1, E.y2 - E.y1)
const ARROW_ANGLE = (Math.atan2(E.y2 - E.y1, E.x2 - E.x1) * 180) / Math.PI

const STEPS = [
  { at: 0, label: 'Drop in tables', cap: 'Pick the table tool and drop in tables.' },
  { at: 2.4, label: 'Link them', cap: 'Draw an arrow from orders to customers.' },
  { at: 4.0, label: 'Foreign key', cap: 'The foreign key is added. SQL is ready.' },
  { at: 5.8, label: 'Any format', cap: 'Prisma, Drizzle and TS types come from the same drawing.' },
]

const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)))
const ease = (x) => 1 - (1 - x) ** 2

// what the code panel shows at time t
function codeAt(t) {
  if (t < 1.0) return ['SQL', '-- empty drawing']
  if (t < 1.7) return ['SQL', S1.slice(0, Math.round(S1.length * ease(seg(t, 1.0, 1.7))))]
  if (t < 2.4) return ['SQL', S2.slice(0, S1.length + Math.round((S2.length - S1.length) * ease(seg(t, 1.7, 2.4))))]
  if (t < 4.0) return ['SQL', S2]
  if (t < 5.8) return ['SQL', S3.slice(0, S2.length + Math.round((S3.length - S2.length) * ease(seg(t, 4.0, 5.2))))]
  return ['Prisma', P.slice(0, Math.round(P.length * ease(seg(t, 5.9, 7.3))))]
}

function Card({ t, cls, fk }) {
  const h = height(fk ? ORD_FULL : t)
  return (
    <g className={cls} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <rect width={TW} height={h} x={t.x} y={t.y} rx="9" fill="#fff" stroke="#0d1b3e" strokeOpacity=".3" />
      <path d={`M${t.x} ${t.y + HEAD_H} V${t.y + 9} a9 9 0 0 1 9 -9 H${t.x + TW - 9} a9 9 0 0 1 9 9 V${t.y + HEAD_H}Z`} fill="#dbe9ff" />
      <path d={`M${t.x} ${t.y + HEAD_H} H${t.x + TW}`} stroke="#0d1b3e" strokeOpacity=".2" />
      <text x={t.x + TW / 2} y={t.y + 23} textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="13" fontWeight="500" fill="#0a3fa8">{t.name}</text>
      {t.cols.map((c, i) => (
        <g key={c.n} transform={`translate(${t.x} ${t.y + HEAD_H + 18 + i * ROW_H})`}>
          <text x="14" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="12" fill="#0d1b3e">{c.n}</text>
          <text x="108" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="12" fill="#55658a">{c.t}</text>
          {c.k && <text x={TW - 12} textAnchor="end" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="11" fontWeight="500" fill="#005fff">{c.k}</text>}
        </g>
      ))}
      {fk && (
        <g className="fk-row" transform={`translate(${t.x} ${t.y + HEAD_H + 18 + 3 * ROW_H})`}>
          <rect x="4" y="-17" width={TW - 8} height="23" rx="5" fill="#ec5451" fillOpacity=".24" />
          <text x="14" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="12" fill="#0d1b3e">customer_id</text>
          <text x="108" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="12" fill="#55658a">int</text>
          <text x={TW - 12} textAnchor="end" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="11" fontWeight="500" fill="#c8403d">FK</text>
        </g>
      )}
    </g>
  )
}

export default function Demo() {
  const box = useRef(null)
  const tl = useRef(null)
  const [wants, setWants] = useState(true)
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState('auto')
  const [tried, setTried] = useState(false)
  const [schema, setSchema] = useState({ tables: [], links: [] })
  const [fmt, setFmt] = useState('SQL')
  const [copied, setCopied] = useState(false)
  const trying = mode === 'try'
  const playing = wants && visible && !trying

  useLayoutEffect(() => {
    const root = box.current
    const q = (s) => root.querySelector(s)
    const ctx = gsap.context(() => {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      const code = q('[data-code]')
      const tabs = [q('[data-tab="SQL"]'), q('[data-tab="Prisma"]')]
      const file = q('[data-file]')
      const bars = [...root.querySelectorAll('[data-bar]')]
      let last = ''
      let lastStep = -1

      gsap.set(['.c-card', '.o-card'], { opacity: 0, scale: 0.88 })
      gsap.set('.fk-note', { opacity: 0, y: 6 })
      gsap.set('.ah', { opacity: 0 })
      gsap.set('.arrow', { strokeDasharray: ARROW_LEN, strokeDashoffset: ARROW_LEN })
      gsap.set('.cursor', { x: 480, y: 316 })

      const t = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.5, defaults: { ease: 'power2.inOut' } })
      t.to('.cursor', { x: 70, y: 30, duration: 0.45 }, 0)
        .to('.cursor', { x: 430, y: 96, duration: 0.5 }, 0.55)
        .to('.c-card', { opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(2)' }, 1.0)
        .to('.cursor', { x: 136, y: 238, duration: 0.5 }, 1.1)
        .to('.o-card', { opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(2)' }, 1.7)
        .to('.cursor', { x: 104, y: 30, duration: 0.45 }, 2.0)
        .to('.cursor', { x: 150, y: 272, duration: 0.4 }, 2.55)
        .to('.arrow', { strokeDashoffset: 0, duration: 0.75, ease: 'power1.inOut' }, 3.2)
        .to('.cursor', { x: E.x2 - 8, y: E.y2 + 6, duration: 0.75, ease: 'power1.inOut' }, 3.2)
        .to('.ah', { opacity: 1, duration: 0.08 }, 3.9)
        .fromTo('.fk-row', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 4.0)
        .to('.fk-note', { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(2)' }, 4.1)
        .to('.cursor', { x: 490, y: 300, duration: 0.8 }, 4.5)
        .to({}, { duration: DUR - 5.3 }, 5.3)

      t.eventCallback('onUpdate', () => {
        const now = t.time()
        const [tab, text] = codeAt(now)
        const key = tab + text.length
        if (key !== last) {
          last = key
          code.innerHTML = highlightHTML(text)
          code.parentElement.scrollTop = code.parentElement.scrollHeight
          tabs.forEach((n) => { n.dataset.on = String(n.dataset.tab === tab) })
          file.textContent = tab === 'Prisma' ? 'schema.prisma' : 'schema.sql'
        }
        const si = STEPS.findLastIndex((s) => now >= s.at)
        if (si !== lastStep) { lastStep = si; setStep(si) }
        bars.forEach((b, i) => {
          const a = STEPS[i].at
          const z = STEPS[i + 1]?.at ?? DUR
          b.style.transform = `scaleX(${i < si ? 1 : i === si ? seg(now, a, z) : 0})`
        })
        const tool = now >= 2.45 && now < 4.5 ? 2 : now >= 0.45 && now < 2.45 ? 1 : 0
        root.querySelectorAll('.tool-bg').forEach((n, k) => { n.style.opacity = k === tool ? 1 : 0 })
        root.querySelectorAll('.ico').forEach((n, k) => { n.style.stroke = k === tool ? '#fff' : '#0d1b3e' })
      })
      tl.current = t
      if (reduce) t.time(7.4, false)
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(([en]) => setVisible(en.isIntersecting), { threshold: 0.25 })
    io.observe(box.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (tl.current) tl.current.paused(reduce || !playing)
  }, [playing])

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(FORMATS[fmt](schema.tables, schema.links)); setCopied(true); setTimeout(() => setCopied(false), 1400) } catch { /* clipboard unavailable */ }
  }
  const jump = (at) => { tl.current?.time(at + 0.02, false); setWants(true) }

  return (
    <section id="demo" ref={box} className="relative mx-auto max-w-[1120px] px-4 pt-24 pb-6">
      <div className="max-w-[640px]">
        <p className="mono-label">See it work</p>
        <Words as="h2" className="mt-2 text-[clamp(1.9rem,4vw,2.8rem)] font-semibold tracking-[-0.035em] leading-[1.05]">Watch a drawing become a database.</Words>
        <p className="mt-3 text-[16px] leading-relaxed text-ink/70">No sound, no sign-up. It plays on its own: tables go in, an arrow links them, the schema writes itself.</p>
      </div>

      <div data-tilt className="mt-7 rounded-[18px] overflow-hidden bg-white/80 backdrop-blur-md border border-white/80 shadow-[0_40px_80px_-40px_rgb(13_27_62/0.55)]">
        <div className="flex items-center gap-2 h-10 px-3.5 border-b border-line bg-white/60">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" /><span className="size-2.5 rounded-full bg-[#febc2e]" /><span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="mx-auto font-mono text-[11.5px] text-mute">shop.dpr · Drawper</span>
          <span className="w-12" />
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className={`paper-dots ${trying ? 'hidden' : ''}`}>
            <svg viewBox="0 0 560 356" className="w-full h-auto block" role="img" aria-label="Animated demo: two tables are dropped on the canvas, joined by an arrow, and a foreign key appears">
              <g transform="translate(14 10)">
                <rect width="112" height="40" rx="20" fill="#fff" stroke="#0d1b3e" strokeOpacity=".18" />
                {[['cursor', 21], ['table', 55], ['arrow', 89]].map(([n, x], i) => (
                  <g key={n} transform={`translate(${x} 20)`}>
                    <circle className="tool-bg" r="14" fill="#0d1b3e" opacity={i === 0 ? 1 : 0} />
                    <g className="ico" transform="translate(-8 -8) scale(.667)" fill="none" stroke={i === 0 ? '#fff' : '#0d1b3e'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {n === 'cursor' && <path d="M5 3.500l13 7.500-5.800 1.600L9.500 18.500z" />}
                      {n === 'table' && <><rect x="4" y="5" width="16" height="14" rx="1.500" /><path d="M4 10h16M10 10v9" /></>}
                      {n === 'arrow' && <><path d="M4 20 19 5" /><path d="M9 5h10v10" /></>}
                    </g>
                  </g>
                ))}
              </g>
              <Card t={CUST} cls="c-card" />
              <Card t={ORD_FULL} cls="o-card" fk />
              <line className="arrow" x1={E.x1} y1={E.y1} x2={E.x2} y2={E.y2} stroke="#0d1b3e" strokeWidth="1.8" strokeLinecap="round" />
              <path className="ah" d="M-10 -5.500 L0 0 L-10 5.500" transform={`translate(${E.x2} ${E.y2}) rotate(${ARROW_ANGLE})`} fill="none" stroke="#0d1b3e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <text className="fk-note" x={(E.x1 + E.x2) / 2 - 10} y={(E.y1 + E.y2) / 2 + 26} fontFamily="Caveat, cursive" fontWeight="600" fontSize="24" fill="#ec5451">foreign key!</text>
              <g className="cursor">
                <path d="M0 0 L0 17 L4.500 13 L7.500 20 L10 19 L7 12 L13 12Z" fill="#0d1b3e" stroke="#fff" strokeWidth="1.400" strokeLinejoin="round" />
              </g>
            </svg>
          </div>
          {tried && <div className={trying ? '' : 'hidden'}><PlayBoard onSchema={setSchema} /></div>}
          <div className={`bg-night md:min-h-[340px] flex-col ${trying ? 'hidden' : 'flex'}`}>
            <div className="flex items-center gap-1 h-10 px-3 border-b border-white/10 font-mono text-[11.5px]">
              {['SQL', 'Prisma'].map((n) => (
                <span key={n} data-tab={n} data-on={n === 'SQL'} className="px-2.5 py-1 rounded-md text-white/45 data-[on=true]:bg-white/12 data-[on=true]:text-white">{n}</span>
              ))}
              <span data-file className="ml-auto text-white/35">schema.sql</span>
            </div>
            <div className="flex-1 min-h-[220px] max-h-[330px] overflow-auto code-scroll p-4">
              <pre data-code className="font-mono text-[12px] leading-[1.65] text-[#e7e6ec] whitespace-pre" />
            </div>
          </div>
          {tried && (
            <div className={`bg-night md:min-h-[340px] flex-col ${trying ? 'flex' : 'hidden'}`}>
              <div className="flex items-center gap-1 h-10 px-3 border-b border-white/10 font-mono text-[11.5px]">
                {Object.keys(FORMATS).map((n) => (
                  <button key={n} onClick={() => setFmt(n)} aria-pressed={fmt === n} className={`px-2.5 py-1 rounded-md transition-colors ${fmt === n ? 'bg-white/12 text-white' : 'text-white/45 hover:text-white/80'}`}>{n}</button>
                ))}
                <button onClick={copyCode} aria-label="Copy code" className="ml-auto grid place-items-center size-7 rounded-md text-white/50 hover:text-white hover:bg-white/8"><Icon name={copied ? 'check' : 'copy'} size={13} /></button>
              </div>
              <CodeBlock code={FORMATS[fmt](schema.tables, schema.links)} className="flex-1 min-h-[220px] max-h-[420px] p-4" />
              <p className="px-4 py-2 border-t border-white/10 font-mono text-[11px] text-white/40">Live: {schema.tables.length} tables · {schema.links.length} arrows</p>
            </div>
          )}
        </div>
        <div className="border-t border-line px-3.5 py-3 flex flex-wrap items-center gap-3 bg-white/60">
          {trying ? (
            <>
              <span className="size-9 grid place-items-center rounded-full bg-brand text-white shrink-0"><Icon name="cursor" size={15} /></span>
              <p className="text-[14px] font-medium flex-1 min-w-[200px]">Your turn. Pick the arrow tool and drag orders onto customers, or drop your own tables.</p>
              <button onClick={() => { setMode('auto'); setWants(true) }} className="btn btn-paper btn-sm"><Icon name="play" size={12} /> Back to the demo</button>
            </>
          ) : (
            <>
              <button onClick={() => setWants((v) => !v)} aria-label={playing ? 'Pause demo' : 'Play demo'} className="size-9 grid place-items-center rounded-full bg-ink text-white shrink-0">
                <Icon name={playing ? 'pause' : 'play'} size={14} />
              </button>
              <p className="text-[14px] font-medium flex-1 min-w-[200px]">{STEPS[Math.max(0, step)].cap}</p>
              <button onClick={() => { setMode('try'); setTried(true) }} className="btn btn-brand btn-sm">Try it yourself <Icon name="cursor" size={13} /></button>
            </>
          )}
        </div>
        <div className={`flex border-t border-line bg-white/50 ${trying ? 'hidden' : ''}`}>
          {STEPS.map((s, i) => (
            <button key={s.label} onClick={() => jump(s.at)} className="relative flex-1 text-left px-3 py-2.5 hover:bg-white/60 transition-colors min-w-0">
              <span className="block mono-label truncate">0{i + 1}</span>
              <span className={`block text-[12px] truncate ${i === step ? 'text-ink font-medium' : 'text-mute'}`}>{s.label}</span>
              <span data-bar className="absolute left-0 right-0 bottom-0 h-[3px] bg-brand origin-left scale-x-0" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
