import { useEffect, useRef, useState } from 'react'

// The hero picture rebuilt out of characters. Every cell is coloured from the picture
// itself (tone on tone: a slightly deeper or lighter shade of the pixel under it), the
// glyph density follows the picture's light, and a pencil pass of outline strokes is
// drawn first. The image is read in the browser, so swapping /hero.jpg is all it takes.
const COLS = 300
const CW = 4.85
const CH = 8.3
const RAMP = ' .\'`^",:;Il!i~+_-?][}{1)(|tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$'
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const PENCIL = 'rgba(13,27,62,.7)'
const SKETCH_MS = 900
const PAINT_MS = 2200

// canvas aspect for an image (or a crop of it) of the given pixel size
export const sceneAspect = (w, h) => (COLS * CW) / (Math.round((COLS * CW) / (w / h) / CH) * CH)


// ---- golden hour: turns the daytime picture into evening light ---------------------
const SKY_STOPS = [[0, [52, 38, 104]], [0.34, [150, 70, 130]], [0.62, [246, 116, 102]], [0.82, [255, 170, 94]], [1, [255, 216, 132]]]
function skyAt(t) {
  for (let i = 1; i < SKY_STOPS.length; i++) {
    if (t <= SKY_STOPS[i][0]) {
      const [t0, a] = SKY_STOPS[i - 1]
      const [t1, b] = SKY_STOPS[i]
      const k = (t - t0) / (t1 - t0)
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
    }
  }
  return SKY_STOPS[SKY_STOPS.length - 1][1]
}
// recolours one pixel; fx, fy are its position in the picture (0 to 1), HOR is where the horizon sits
const HOR = 0.64
function golden(px, i, fx, fy) {
  const r = px[i]
  const g = px[i + 1]
  const b = px[i + 2]
  const mx = Math.max(r, g, b)
  const sat = (mx - Math.min(r, g, b)) / (mx || 1)
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  const above = fy < HOR + 0.03
  const sky = skyAt(Math.min(1, fy / HOR))
  let o
  if (above && b > r + 25 && b > g) { const k = 0.9 + 0.2 * lum; o = [sky[0] * k, sky[1] * k, sky[2] * k] }
  else if (above && sat < 0.38 && lum > 0.6) { const k = 0.84 + 0.2 * lum; o = [(255 * 0.65 + sky[0] * 0.35) * k, (232 * 0.65 + sky[1] * 0.35) * k, (205 * 0.65 + sky[2] * 0.35) * k] }
  else if (g > b + 8 && g >= r * 0.9) { const dim = 1 - 0.3 * Math.max(0, (fy - HOR) / (1 - HOR)); o = [(r * 1.05 + 36) * dim, (g * 0.86 + 8) * dim, b * 0.42 * dim] }
  else o = [r * 1.08 + 8, g * 0.9, b * 0.68]
  // the low sun, just off the tree
  const dx = fx - 0.7
  const dy = (fy - HOR + 0.02) * 1.7
  const glow = Math.exp(-(dx * dx + dy * dy) / 0.02)
  const core = Math.exp(-(dx * dx + dy * dy) / 0.0016)
  px[i] = Math.min(255, o[0] + glow * 120 + core * 140)
  px[i + 1] = Math.min(255, o[1] + glow * 78 + core * 130)
  px[i + 2] = Math.min(255, o[2] + glow * 28 + core * 90)
}
function gradeAll(px, w, h, grade) {
  if (!grade) return
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) golden(px, (y * w + x) * 4, x / w, y / h)
}

function read(img, crop, grade) {
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
  const img2 = hx.getImageData(0, 0, COLS, rows)
  const px = img2.data
  gradeAll(px, COLS, rows, grade)
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
      const dark = Math.min(1, Math.max(0, 1 - l) ** 0.9 * 1.25)
      const k = dark * (RAMP.length - 1) + (BAYER[(y % 4) * 4 + (x % 4)] / 16 - 0.5) * 2.4
      const ch = RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.round(k)))]
      // gradient for the pencil pass
      const gx = x > 0 && x < COLS - 1 ? lum[i + 1] - lum[i - 1] : 0
      const gy = y > 0 && y < rows - 1 ? lum[i + COLS] - lum[i - COLS] : 0
      const edge = Math.hypot(gx, gy)
      // tone on tone: deeper shade over light cells, lighter shade over dark ones
      const f = l > 0.82 ? 0.9 : l > 0.55 ? 0.72 : 1.35
      const col = `rgb(${Math.min(255, r * f)},${Math.min(255, g * f)},${Math.min(255, b * f)})`
      const n = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1
      const sketch = edge > 0.17 ? (Math.abs(gx) > Math.abs(gy) * 2 ? '|' : Math.abs(gy) > Math.abs(gx) * 2 ? '-' : gx * gy > 0 ? '\\' : '/') : null
      cells.push({ x, y, ch, col, sketch, n })
    }
  }
  return { rows, cells }
}

// the graded picture itself, drawn under the characters
function paintWash(canvas, img, crop, grade) {
  const sy = crop[0] * img.naturalHeight
  const sh = (crop[1] - crop[0]) * img.naturalHeight
  canvas.width = 1200
  canvas.height = Math.round(1200 / (img.naturalWidth / sh))
  const c = canvas.getContext('2d', { willReadFrequently: true })
  c.drawImage(img, 0, sy, img.naturalWidth, sh, 0, 0, canvas.width, canvas.height)
  const d = c.getImageData(0, 0, canvas.width, canvas.height)
  gradeAll(d.data, canvas.width, canvas.height, grade)
  c.putImageData(d, 0, 0)
}

export default function AsciiSky({ src, aspect, crop = [0, 1], grade = false, className = '', onPaint }) {
  const cv = useRef(null)
  const wash = useRef(null)
  const [lit, setLit] = useState(false)

  useEffect(() => {
    const c = cv.current
    const ctx = c.getContext('2d')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let dead = false
    let ro

    const img = new Image()
    img.src = src
    img.decode().then(() => {
      if (dead) return
      const { rows, cells } = read(img, crop, grade)
      if (grade && wash.current) paintWash(wash.current, img, crop, grade)
      const LW = COLS * CW
      const LH = rows * CH
      const state = new Uint8Array(cells.length)
      let start = 0
      let painted = false

      const put = (i) => {
        const k = cells[i]
        if (!state[i]) return
        ctx.clearRect(k.x * CW, k.y * CH, CW, CH)
        ctx.fillStyle = state[i] === 1 ? PENCIL : k.col
        ctx.fillText(state[i] === 1 ? k.sketch : k.ch, k.x * CW + CW / 2, k.y * CH + CH / 2 + 0.4)
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
        if (t >= SKETCH_MS * 0.6 && !painted) { painted = true; setLit(true); onPaint?.() }
        if (busy) raf = requestAnimationFrame(frame)
      }
      fit()
      ro = new ResizeObserver(fit)
      ro.observe(c)
      raf = requestAnimationFrame(frame)
    }).catch(() => onPaint?.())

    return () => { dead = true; cancelAnimationFrame(raf); ro?.disconnect() }
  }, [src, crop, grade, onPaint])

  return (
    <>
      {grade && <canvas ref={wash} aria-hidden="true" className={`${className} transition-opacity duration-[1600ms] ease-out ${lit ? 'opacity-100' : 'opacity-0'}`} />}
      <canvas ref={cv} className={className} style={{ aspectRatio: `${aspect}` }} role="img" aria-label="A scene drawn in coloured text characters" />
    </>
  )
}
