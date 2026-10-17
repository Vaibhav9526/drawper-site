import { useEffect, useRef, useState } from 'react'
import { gen, highlight } from '../codeSamples'
import Icon from './Icons'

// A tiny working Drawper canvas: drag the tables, toggle the arrow (A),
// and the generated code changes the way it does in the extension.
const W = 560
const H = 290
const TW = 176
const TH = 98

const rowsFor = (id, linked) => {
  if (id === 'customers') return [['id', 'int', 'PK'], ['email', 'text', ''], ['created_at', 'timestamp', '']]
  return linked
    ? [['id', 'int', 'PK'], ['customer_id', 'int', 'FK'], ['total', 'numeric', '']]
    : [['id', 'int', 'PK'], ['total', 'numeric', ''], ['created_at', 'timestamp', '']]
}

// where the straight line between two box centres leaves/enters each box
function link(a, b) {
  const ca = { x: a.x + TW / 2, y: a.y + TH / 2 }
  const cb = { x: b.x + TW / 2, y: b.y + TH / 2 }
  const dx = cb.x - ca.x
  const dy = cb.y - ca.y
  const t = Math.min((TW / 2 + 4) / (Math.abs(dx) || 1e-6), (TH / 2 + 4) / (Math.abs(dy) || 1e-6))
  return { x1: ca.x + dx * t, y1: ca.y + dy * t, x2: cb.x - dx * t, y2: cb.y - dy * t }
}

function Tool({ active, label, onClick, children, k }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      title={label}
      className={`relative h-8 w-8 grid place-items-center rounded-md transition-colors ${active ? 'bg-sun/20 text-sun' : 'text-mute hover:text-text hover:bg-white/5'}`}
    >
      {children}
      <span className="absolute right-1 bottom-0.5 text-[8px] font-mono opacity-60">{k}</span>
    </button>
  )
}

export default function DrawCanvas() {
  const svg = useRef(null)
  const drag = useRef(null)
  const [pos, setPos] = useState({ customers: { x: 356, y: 26 }, orders: { x: 28, y: 168 } })
  const [linked, setLinked] = useState(true)
  const [tab, setTab] = useState('SQL')
  const [copied, setCopied] = useState(false)

  const files = gen(linked)
  const f = files[tab]

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest('input, textarea') || e.metaKey || e.ctrlKey) return
      if (e.key === 'a' || e.key === 'A') setLinked((v) => !v)
      if (e.key === '1') setLinked(false)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  const toLocal = (e) => {
    const p = svg.current.createSVGPoint()
    p.x = e.clientX
    p.y = e.clientY
    return p.matrixTransform(svg.current.getScreenCTM().inverse())
  }
  const down = (id) => (e) => {
    const p = toLocal(e)
    drag.current = { id, dx: p.x - pos[id].x, dy: p.y - pos[id].y }
    svg.current.setPointerCapture(e.pointerId)
  }
  const move = (e) => {
    if (!drag.current) return
    const p = toLocal(e)
    const { id, dx, dy } = drag.current
    setPos((s) => ({
      ...s,
      [id]: { x: Math.max(4, Math.min(W - TW - 4, p.x - dx)), y: Math.max(4, Math.min(H - TH - 4, p.y - dy)) },
    }))
  }
  const up = () => { drag.current = null }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(f.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch { /* clipboard unavailable */ }
  }

  const L = link(pos.orders, pos.customers)

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between h-11 px-2 border-b border-line">
        <div className="flex items-center gap-0.5">
          <Tool label="Select" active={!linked} onClick={() => setLinked(false)} k="1">
            <Icon name="cursor" size={16} />
          </Tool>
          <Tool label="Arrow: link orders to customers" active={linked} onClick={() => setLinked(true)} k="A">
            <Icon name="arrowtool" size={16} />
          </Tool>
        </div>
        <span className="mono-label pr-1.5">drag the tables · A toggles the arrow</span>
      </div>

      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto block canvas-bg touch-none select-none"
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        role="img"
        aria-label="Interactive canvas with an orders table and a customers table"
      >
        <defs>
          <marker id="dc-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
            <path d="M1 1L9 5L1 9" fill="none" stroke="#f2f1f5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
        <g fontFamily="Geist Mono, monospace" fontSize="12">
          {linked && (
            <line x1={L.x1} y1={L.y1} x2={L.x2} y2={L.y2} stroke="#f2f1f5" strokeWidth="1.4" strokeLinecap="round" markerEnd="url(#dc-ah)" />
          )}
          {['customers', 'orders'].map((id) => (
            <g key={id} transform={`translate(${pos[id].x} ${pos[id].y})`} onPointerDown={down(id)} className="cursor-grab active:cursor-grabbing">
              <rect width={TW} height={TH} rx="9" fill="#050506" stroke="#8d8a98" strokeWidth="1" />
              <rect width={TW} height="26" rx="9" fill="#2a1f00" />
              <rect y="17" width={TW} height="9" fill="#2a1f00" />
              <path d={`M0 26H${TW}`} stroke="#8d8a98" strokeWidth="1" />
              <text x={TW / 2} y="17" textAnchor="middle" fill="#ffe9a0">{id}</text>
              {rowsFor(id, linked).map(([n, t, k], i) => (
                <g key={n} transform={`translate(0 ${46 + i * 20})`}>
                  <text x="12" fill="#ecebf0">{n}</text>
                  <text x="104" fill="#8d8a98">{t}</text>
                  {k && <text x={TW - 12} textAnchor="end" fill={k === 'FK' ? '#87dac7' : '#ffd900'}>{k}</text>}
                </g>
              ))}
            </g>
          ))}
        </g>
      </svg>

      <div className="border-t border-line">
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex gap-1 flex-wrap" role="tablist">
            {Object.keys(files).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={`font-mono text-[11.5px] px-2.5 py-1 rounded-md transition-colors ${tab === k ? 'bg-white/10 text-text' : 'text-mute hover:text-text'}`}
              >
                {k}
              </button>
            ))}
          </div>
          <button onClick={copy} className="mono-label flex items-center gap-1.5 hover:!text-text transition-colors pr-1.5" aria-label="Copy code">
            <Icon name={copied ? 'check' : 'copy'} size={13} /> {copied ? 'Copied' : f.name}
          </button>
        </div>
        <pre className="code-scroll h-[176px] overflow-auto px-3.5 pb-3 pt-2 text-[11.5px] leading-[1.7] font-mono text-text/90">
          <code dangerouslySetInnerHTML={{ __html: f.code.split('\n').map(highlight).join('\n') }} />
        </pre>
      </div>
    </div>
  )
}
