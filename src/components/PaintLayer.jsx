import { useEffect, useImperativeHandle, useRef } from 'react'

// A transparent canvas you can paint on: pencil, bristle brush, marker, eraser.
// Strokes are kept as points and re-painted whenever something changes, so
// undo, resize and the eraser all stay exact.
function trace(ctx, pts) {
  ctx.beginPath()
  ctx.moveTo(pts[0][0], pts[0][1])
  if (pts.length === 1) ctx.lineTo(pts[0][0] + 0.01, pts[0][1])
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2
    const my = (pts[i][1] + pts[i + 1][1]) / 2
    ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my)
  }
  if (pts.length > 1) ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1])
  ctx.stroke()
}

function paint(ctx, s) {
  const { tool, color, size, pts } = s
  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = color
  if (tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = size * 3
    trace(ctx, pts)
  } else if (tool === 'marker') {
    ctx.globalAlpha = 0.38
    ctx.lineWidth = size * 3
    ctx.lineCap = 'square'
    trace(ctx, pts)
  } else if (tool === 'pen') {
    ctx.lineWidth = Math.max(1.5, size * 0.55)
    trace(ctx, pts)
  } else {
    // brush: thick where you slow down, with thin bristle streaks trailing behind
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1]
      const [x1, y1] = pts[i]
      const d = Math.hypot(x1 - x0, y1 - y0)
      const w = size * (1.7 - Math.min(d / 20, 1) * 0.85)
      const nx = -(y1 - y0) / (d || 1)
      const ny = (x1 - x0) / (d || 1)
      ctx.globalAlpha = 0.9
      ctx.lineWidth = w
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke()
      ctx.globalAlpha = 0.32
      ctx.lineWidth = Math.max(1, w * 0.2)
      for (const k of [-1, 1]) {
        const o = k * w * (0.42 + 0.12 * Math.sin(i * 0.8 + k))
        ctx.beginPath(); ctx.moveTo(x0 + nx * o, y0 + ny * o); ctx.lineTo(x1 + nx * o, y1 + ny * o); ctx.stroke()
      }
    }
  }
  ctx.restore()
}

export default function PaintLayer({ ref, tool, color, size, active, onCount, className = '' }) {
  const cv = useRef(null)
  const strokes = useRef([])
  const cur = useRef(null)
  const raf = useRef(0)

  const redraw = () => {
    const c = cv.current
    const ctx = c.getContext('2d')
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, c.width, c.height)
    const k = c.width / c.clientWidth
    ctx.setTransform(k, 0, 0, k, 0, 0)
    strokes.current.forEach((s) => paint(ctx, s))
  }
  const schedule = () => {
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(redraw)
  }

  useImperativeHandle(ref, () => ({
    undo() { strokes.current.pop(); redraw(); onCount?.(strokes.current.length) },
    clear() { strokes.current = []; redraw(); onCount?.(0) },
  }))

  useEffect(() => {
    const c = cv.current
    const fit = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      c.width = Math.round(c.clientWidth * dpr)
      c.height = Math.round(c.clientHeight * dpr)
      redraw()
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(c)
    return () => { ro.disconnect(); cancelAnimationFrame(raf.current) }
  }, [])

  const at = (e) => {
    const r = cv.current.getBoundingClientRect()
    return [e.clientX - r.left, e.clientY - r.top]
  }
  const down = (e) => {
    if (!active || e.button > 0) return
    cv.current.setPointerCapture(e.pointerId)
    cur.current = { tool, color, size, pts: [at(e)] }
    strokes.current.push(cur.current)
    schedule()
  }
  const move = (e) => {
    const s = cur.current
    if (!s) return
    const p = at(e)
    const last = s.pts[s.pts.length - 1]
    if (Math.hypot(p[0] - last[0], p[1] - last[1]) < 1.5) return
    s.pts.push(p)
    schedule()
  }
  const up = () => {
    if (!cur.current) return
    cur.current = null
    onCount?.(strokes.current.length)
  }

  return (
    <canvas
      ref={cv}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      className={`${className} ${active ? 'cursor-crosshair touch-none' : 'pointer-events-none'}`}
    />
  )
}
