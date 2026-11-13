import { useEffect, useMemo, useRef, useState } from 'react'
import PaintLayer from './PaintLayer'
import Toolbar, { COLORS, PAINT } from './Toolbar'
import Icon from './Icon'
import { TW, ROW_H, HEAD_H, clean, edge, height, resolve } from '../schema'

const TOOLS = [
  { id: 'select', label: 'Move tables', icon: 'cursor' },
  { id: 'table', label: 'Add a table (click the board)', icon: 'table' },
  { id: 'arrow', label: 'Arrow: drag from one table to another', icon: 'arrow' },
  { id: 'pen', label: 'Pencil', icon: 'pencil' },
  { id: 'brush', label: 'Paint brush', icon: 'brush' },
  { id: 'marker', label: 'Marker', icon: 'marker' },
  { id: 'eraser', label: 'Eraser', icon: 'eraser' },
]
const HINT = {
  select: 'Drag tables around. Double-click a name to rename it.',
  table: 'Click anywhere on the board to drop a table.',
  arrow: 'Press on one table and drag onto another.',
}

const seed = [
  { id: 't1', name: 'customers', x: 56, y: 44, cols: [{ n: 'id', t: 'int', k: 'PK' }, { n: 'email', t: 'text', k: '' }, { n: 'created_at', t: 'timestamp', k: '' }] },
  { id: 't2', name: 'orders', x: 330, y: 190, cols: [{ n: 'id', t: 'int', k: 'PK' }, { n: 'total', t: 'numeric', k: '' }, { n: 'created_at', t: 'timestamp', k: '' }] },
]
let uid = 3

// The hands-on canvas inside the demo window: scribble, drop tables, drag arrows. Reports its
// tables and arrows up so the code panel beside it stays live.
export default function PlayBoard({ onSchema }) {
  const board = useRef(null)
  const paintRef = useRef(null)
  const drag = useRef(null)
  const [tables, setTables] = useState(seed)
  const [links, setLinks] = useState([])
  const [pending, setPending] = useState(null)
  const [editing, setEditing] = useState(null)
  const [tool, setTool] = useState('select')
  const [color, setColor] = useState(COLORS[0])
  const [size, setSize] = useState(9)
  const [strokes, setStrokes] = useState(0)

  const shown = useMemo(() => resolve(tables, links), [tables, links])
  const painting = PAINT.includes(tool)
  useEffect(() => { onSchema?.({ tables, links }) }, [tables, links, onSchema])

  const point = (e) => {
    const r = board.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const hit = (p) => [...shown].reverse().find((t) => p.x >= t.x && p.x <= t.x + TW && p.y >= t.y && p.y <= t.y + height(t))

  const down = (e) => {
    if (e.target.closest('button, input')) return
    const p = point(e)
    if (tool === 'table') {
      const n = tables.length + 1
      setTables((ts) => [...ts, { id: `t${uid++}`, name: `table_${n}`, x: Math.max(8, p.x - TW / 2), y: Math.max(8, p.y - 18), cols: [{ n: 'id', t: 'int', k: 'PK' }, { n: 'name', t: 'text', k: '' }] }])
      setTool('select')
    } else if (tool === 'select') {
      const h = hit(p)
      if (h) { drag.current = { id: h.id, dx: p.x - h.x, dy: p.y - h.y }; board.current.setPointerCapture(e.pointerId) }
    } else if (tool === 'arrow') {
      const h = hit(p)
      if (h) { setPending({ from: h.id, ...p }); board.current.setPointerCapture(e.pointerId) }
    }
  }
  const move = (e) => {
    const p = point(e)
    if (drag.current) {
      const { id, dx, dy } = drag.current
      const r = board.current.getBoundingClientRect()
      setTables((ts) => ts.map((t) => (t.id === id ? { ...t, x: Math.max(4, Math.min(r.width - TW - 4, p.x - dx)), y: Math.max(4, Math.min(r.height - 60, p.y - dy)) } : t)))
    } else if (pending) setPending((q) => ({ ...q, ...p }))
  }
  const up = (e) => {
    drag.current = null
    if (!pending) return
    const h = hit(point(e))
    if (h && h.id !== pending.from && !links.some((l) => l.from === pending.from && l.to === h.id)) {
      setLinks((ls) => [...ls, { from: pending.from, to: h.id }])
    }
    setPending(null)
  }
  const dbl = (e) => {
    if (tool !== 'select' || e.target.closest('button, input')) return
    const p = point(e)
    const h = hit(p)
    if (h && p.y - h.y < HEAD_H) setEditing(h.id)
  }

  const rename = (id, v) => { setTables((ts) => ts.map((t) => (t.id === id ? { ...t, name: clean(v) } : t))); setEditing(null) }
  const addCol = (id) => setTables((ts) => ts.map((t) => (t.id === id ? { ...t, cols: [...t.cols, { n: `field_${t.cols.length}`, t: 'text', k: '' }] } : t)))
  const remove = (id) => { setTables((ts) => ts.filter((t) => t.id !== id)); setLinks((ls) => ls.filter((l) => l.from !== id && l.to !== id)) }
  const reset = () => { setTables(seed); setLinks([]); paintRef.current?.clear() }

  const box = (t) => ({ x: t.x, y: t.y, w: TW, h: height(t) })
  const byId = (id) => shown.find((t) => t.id === id)

  return (
    <div className="flex flex-col">
          <div className="flex items-center p-2.5 border-b border-line">
            <Toolbar
              tools={TOOLS}
              tool={tool}
              onTool={(t) => setTool(t ?? 'select')}
              color={color}
              onColor={(c) => { setColor(c); if (!painting) setTool('brush') }}
              size={size}
              onSize={setSize}
              onUndo={() => paintRef.current?.undo()}
              onClear={() => paintRef.current?.clear()}
              canUndo={strokes > 0}
              className="!shadow-none !bg-paper/70"
            />
          </div>

          <div
            ref={board}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onDoubleClick={dbl}
            className={`relative paper-dots h-[410px] overflow-hidden select-none touch-none ${tool === 'table' ? 'cursor-copy' : tool === 'select' ? 'cursor-default' : 'cursor-crosshair'}`}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
              <defs>
                <marker id="ah-board" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
                  <path d="M1 1L9 5L1 9" fill="none" stroke="#0d1b3e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
              </defs>
              {links.map((l) => {
                const a = byId(l.from)
                const b = byId(l.to)
                const e = edge(box(a), box(b))
                return (
                  <g key={`${l.from}-${l.to}`}>
                    <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#0d1b3e" strokeWidth="1.8" strokeLinecap="round" markerEnd="url(#ah-board)" />
                    <text x={(e.x1 + e.x2) / 2 + 8} y={(e.y1 + e.y2) / 2 - 6} fontFamily="Caveat, cursive" fontWeight="600" fontSize="20" fill="#ec5451">FK</text>
                  </g>
                )
              })}
              {pending && (() => {
                const a = box(byId(pending.from))
                return <line x1={a.x + a.w / 2} y1={a.y + a.h / 2} x2={pending.x} y2={pending.y} stroke="#005fff" strokeWidth="1.8" strokeDasharray="5 5" strokeLinecap="round" />
              })()}
            </svg>

            {shown.map((t) => (
              <div key={t.id} className="absolute rounded-[10px] bg-white border border-ink/25 shadow-[0_8px_20px_-14px_rgb(23_24_28/0.5)] pointer-events-none" style={{ left: t.x, top: t.y, width: TW, height: height(t) }}>
                <div className="flex items-center justify-between px-3 rounded-t-[10px] bg-[#e6efff] border-b border-ink/15" style={{ height: HEAD_H }}>
                  {editing === t.id ? (
                    <input
                      autoFocus
                      defaultValue={t.name}
                      onBlur={(e) => rename(t.id, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditing(null) }}
                      className="pointer-events-auto w-full bg-white rounded px-1.5 py-0.5 font-mono text-[13px] text-[#0a3fa8] outline-2 outline-brand"
                    />
                  ) : (
                    <span className="font-mono text-[13px] font-medium text-[#0a3fa8] truncate">{t.name}</span>
                  )}
                  {editing !== t.id && (
                    <button onClick={() => remove(t.id)} aria-label={`Delete ${t.name}`} className="pointer-events-auto text-ink/35 hover:text-ink -mr-1 p-1"><Icon name="close" size={13} /></button>
                  )}
                </div>
                {t.cols.map((c, i) => (
                  <div key={`${c.n}${i}`} className={`flex items-center px-3 font-mono text-[12px] ${c.k === 'FK' ? 'bg-tangerine/15' : ''}`} style={{ height: ROW_H }}>
                    <span className="w-[92px] truncate">{c.n}</span>
                    <span className="text-mute flex-1">{c.t}</span>
                    {c.k && <span className={`text-[11px] font-medium ${c.k === 'FK' ? 'text-[#c8403d]' : 'text-brand'}`}>{c.k}</span>}
                  </div>
                ))}
                <button onClick={() => addCol(t.id)} className="pointer-events-auto absolute left-2 bottom-1 flex items-center gap-1 text-[11px] font-mono text-mute hover:text-ink px-1 h-6">
                  <Icon name="plus" size={11} /> column
                </button>
              </div>
            ))}

            <PaintLayer ref={paintRef} tool={tool} color={color} size={size} active={painting} onCount={setStrokes} className="absolute inset-0 z-30 w-full h-full" />

            <button onClick={reset} className="absolute right-3 bottom-3 z-40 btn btn-paper btn-sm">Reset</button>

            <p className="absolute left-4 bottom-3 z-40 hand text-[21px] text-ink/70 pointer-events-none">
              {HINT[tool] ?? 'Scribble anything. It is your canvas.'}
              {links.length === 0 && tool === 'select' && <span className="text-tangerine"> Pick the arrow tool and link orders → customers.</span>}
            </p>
          </div>
    </div>
  )
}
