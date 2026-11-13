import { useEffect, useRef } from 'react'

// A picture rebuilt out of characters. Every cell is coloured from the picture itself
// (tone on tone: a slightly deeper or lighter shade of the pixel under it), the glyph
// density follows the picture's light, and a pencil pass of outline strokes is drawn
// first. The image is read in the browser, so swapping the file is all it takes.
//
// With `sway` ({ from, amp, grass }), the lower part of the picture moves in the wind once it is
// drawn (only the green cells when `grass` is set, so skies and clouds stay still): each
// cell borrows its glyph and colour from a neighbour a little to the left or right, and
// the offset rolls like a wave, so grass and grain ripple in characters.
const COLS = 300
const CW = 4.85
const CH = 8.3
const RAMP = ' .\'`^",:;Il!i~+_-?][}{1)(|tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$'
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const PENCIL = 'rgba(13,27,62,.7)'
const PENCIL_LIGHT = 'rgba(255,232,190,.5)'
const SKETCH_MS = 900
const PAINT_MS = 2200

// canvas aspect for an image (or a crop of it) of the given pixel size
export const sceneAspect = (w, h) => (COLS * CW) / (Math.round((COLS * CW) / (w / h) / CH) * CH)

function read(img, crop, invert) {
  const sy = crop[0] * img.naturalHeight
  const sh = (crop[1] - crop[0]) * img.naturalHeight
  const rows = Math.round((COLS * CW) / (img.naturalWidth / sh) / CH)
  const stage = document.createElement('canvas')
  stage.width = COLS * 2
  stage.height = rows * 2
  const sx = stage.getContext('2d', { willReadFrequently: true })
  sx.imageSmoothingQuality = 'high'
  sx.drawImage(img, 0, sy, img.naturalWidth, sh, 0, 0, stage.width, stage.height)
  const half = document.createElement('canvas')
  half.width = COLS
  half.height = rows
  const hx = half.getContext('2d', { willReadFrequently: true })
  hx.imageSmoothingQuality = 'high'
  hx.drawImage(stage, 0, 0, COLS, rows)
  const px = hx.getImageData(0, 0, COLS, rows).data
  const lum = new Float32Array(COLS * rows)
  for (let i = 0; i < lum.length; i++) lum[i] = (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255

  const cells = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < COLS; x++) {
      const i = y * COLS + x
      const r = px[i * 4]
      const g = px[i * 4 + 1]
      const b = px[i * 4 + 2]
      const l = lum[i]
      // glyph weight follows how dark the cell is, with an ordered dither so there is no banding
      const dark = invert ? Math.min(1, Math.max(0, (l - 0.04) / 0.82) ** 1.15 * 0.95) : Math.min(1, Math.max(0, 1 - l) ** 0.9 * 1.25)
      const k = dark * (RAMP.length - 1) + (BAYER[(y % 4) * 4 + (x % 4)] / 16 - 0.5) * 2.4
      const ch = RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.round(k)))]
      // gradient for the pencil pass
      const gx = x > 0 && x < COLS - 1 ? lum[i + 1] - lum[i - 1] : 0
      const gy = y > 0 && y < rows - 1 ? lum[i + COLS] - lum[i - COLS] : 0
      const edge = Math.hypot(gx, gy)
      // tone on tone: deeper shade over light cells, lighter shade over dark ones
      const f = invert ? (l > 0.6 ? 1.05 : l > 0.3 ? 1.5 : 2.1) : l > 0.82 ? 0.9 : l > 0.55 ? 0.72 : 1.35
      const col = `rgb(${Math.min(255, r * f)},${Math.min(255, g * f)},${Math.min(255, b * f)})`
      const n = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1
      const sketch = edge > 0.17 ? (Math.abs(gx) > Math.abs(gy) * 2 ? '|' : Math.abs(gy) > Math.abs(gx) * 2 ? '-' : gx * gy > 0 ? '\\' : '/') : null
      const grass = g > r * 1.04 && g > b * 1.15 && g > 70
      cells.push({ x, y, ch, col, sketch, n, grass })
    }
  }
  return { rows, cells }
}

// `invert` is for dark backgrounds: bright areas become dense, bright glyphs and dark areas fade away.
export default function AsciiSky({ src, aspect, crop = [0, 1], sway = null, invert = false, className = '', onPaint }) {
  const cv = useRef(null)

  useEffect(() => {
    const c = cv.current
    const ctx = c.getContext('2d')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let dead = false
    let visible = true
    let ro
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting })
    io.observe(c)

    const img = new Image()
    img.src = src
    img.decode().then(() => {
      if (dead) return
      const { rows, cells } = read(img, crop, invert)
      const LW = COLS * CW
      const LH = rows * CH
      const state = new Uint8Array(cells.length)
      const from = new Int16Array(cells.length) // which column each cell currently borrows from
      for (let i = 0; i < from.length; i++) from[i] = i % COLS
      let start = 0
      let painted = false

      const put = (i) => {
        const k = cells[i]
        if (!state[i]) return
        const s = state[i] === 1 ? k : cells[k.y * COLS + from[i]]
        ctx.clearRect(k.x * CW, k.y * CH, CW, CH)
        ctx.fillStyle = state[i] === 1 ? (invert ? PENCIL_LIGHT : PENCIL) : s.col
        ctx.fillText(state[i] === 1 ? k.sketch : s.ch, k.x * CW + CW / 2, k.y * CH + CH / 2 + 0.4)
      }
      const fit = () => {
        const s = c.clientWidth / LW
        const dpr = Math.min(devicePixelRatio || 1, 2)
        c.width = Math.round(LW * s * dpr)
        c.height = Math.round(LH * s * dpr)
        ctx.setTransform(s * dpr, 0, 0, s * dpr, 0, 0)
        ctx.font = `600 ${CH + 1.4}px "SF Mono", Menlo, Consolas, monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        for (let i = 0; i < cells.length; i++) put(i)
      }

      // wind: roll a wave of small sideways offsets through the lower part of the picture
      let last = 0
      const wind = (now) => {
        raf = requestAnimationFrame(wind)
        if (!visible || now - last < 64) return
        last = now
        const t = now / 1000
        const y0 = Math.floor(rows * sway.from)
        for (let y = y0; y < rows; y++) {
          const depth = (y - y0) / (rows - y0)
          const amp = sway.amp * (0.5 + 0.5 * depth)
          for (let x = 0; x < COLS; x++) {
            const wave = Math.sin(t * 1.3 + x * 0.042 + y * 0.15) + 0.55 * Math.sin(t * 2.2 - x * 0.1 + y * 0.06)
            const sx = Math.min(COLS - 1, Math.max(0, Math.round(x + wave * amp)))
            const i = y * COLS + x
            if (sway.grass && !cells[i].grass) continue
            const to = sway.grass && !cells[y * COLS + sx].grass ? x : sx
            if (to !== from[i]) { from[i] = to; put(i) }
          }
        }
      }

      const frame = (now) => {
        if (!start) start = now
        const t = reduce ? Infinity : now - start
        let busy = false
        for (let i = 0; i < cells.length; i++) {
          const k = cells[i]
          const paintAt = SKETCH_MS * 0.5 + ((k.x / COLS) * 0.55 + (1 - k.y / rows) * 0.45) * PAINT_MS + k.n * 300
          const want = t >= paintAt ? 2 : k.sketch && t >= (k.x / COLS) * SKETCH_MS + k.n * 120 ? 1 : 0
          if (want > state[i]) { state[i] = want; put(i) }
          if (state[i] < 2) busy = true
        }
        if (t >= SKETCH_MS * 0.6 && !painted) { painted = true; onPaint?.() }
        if (busy) raf = requestAnimationFrame(frame)
        else if (sway && !reduce) raf = requestAnimationFrame(wind)
      }
      fit()
      ro = new ResizeObserver(fit)
      ro.observe(c)
      raf = requestAnimationFrame(frame)
    }).catch(() => onPaint?.())

    return () => { dead = true; cancelAnimationFrame(raf); ro?.disconnect(); io.disconnect() }
  }, [src, crop, sway, invert, onPaint])

  return <canvas ref={cv} className={className} style={{ aspectRatio: `${aspect}` }} role="img" aria-label="A scene drawn in coloured text characters" />
}
