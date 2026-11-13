// Text-art scenery used across the page, in the same character style as the hero:
// drifting ASCII clouds, and strips of rolling ASCII hills between the sections.

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => `rgb(${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t)).join(',')})`
// clouds are pale blue in the morning and turn peach and rose toward the evening end of the page
const tint = (top) => mix('#6f9fe6', '#e58a78', Math.min(1, Math.max(0, (top - 48) / 42)))

const CLOUDS = [
  String.raw`            .--~~~~--.
       .--~~           ~~--.      .-~~-.
    .~'      .  .  .       '~._.~'      ~.
   (    .  .       .   .  .       .       )
    '~.     .  .      .      .  .      .~'
       '~--..__               __..--~~'
              ''''~~~~~~~~~''''`,
  String.raw`        .-~~~-.
    .-~'       '~-.     .--~-.
  .'   .  .  .     '~.~'  .   '.
 (  .     .    .  .       .     )
  '.   .     .   .   . .      .'
    '~-..__           __..-~~'
          '''~~~~~~'''`,
  String.raw`              .--~~--.
        .--~~'        '~~-.
     .~'   .   .  .   .    '~.   .-~-.
    (   .     .    .    .      '~'  . '.
     '~.   .     .   .    .  .       .'
        '~--..___         ___..--~~~'
               ''''~~~~'''''`,
]

// [top %, left %, width px, variant, parallax speed]
const PLACED = [
  [2.5, 62, 360, 0, 0.18], [6, 6, 240, 1, 0.3], [11, 78, 280, 2, 0.12], [17, 30, 200, 1, 0.38],
  [24, 88, 320, 0, 0.22], [31, 4, 300, 2, 0.16], [38, 70, 220, 1, 0.34], [46, 18, 340, 0, 0.14],
  [54, 84, 260, 2, 0.28], [62, 8, 220, 1, 0.2], [70, 62, 360, 0, 0.12], [78, 22, 260, 2, 0.3], [86, 80, 300, 1, 0.18],
]

export function Clouds() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {PLACED.map(([top, left, w, v, speed], i) => (
        <pre
          key={i}
          data-cloud={speed}
          data-dir={i % 2 ? 1 : -1}
          style={{ top: `${top}%`, left: `${left}%`, fontSize: w / 24, color: tint(top), opacity: 0.8 }}
          className="absolute m-0 font-mono font-semibold leading-[1.08] whitespace-pre will-change-transform select-none"
        >{CLOUDS[v]}</pre>
      ))}
    </div>
  )
}

// Depth below the ridge gets denser, and each strip takes a colour gradient.
const DEPTH = '.:-=+*#%@'
function hillsText(cols, rows, seed) {
  const ridge = []
  for (let x = 0; x < cols; x++) {
    ridge.push(rows * 0.34 + Math.sin(x / 15 + seed) * rows * 0.16 + Math.sin(x / 5.5 + seed * 2.3) * rows * 0.06 + Math.sin(x / 38 + seed * 0.7) * rows * 0.14)
  }
  const lines = []
  for (let r = 0; r < rows; r++) {
    let line = ''
    for (let x = 0; x < cols; x++) {
      const top = Math.round(ridge[x])
      const next = ridge[Math.min(cols - 1, x + 1)]
      if (r < top) line += ' '
      else if (r === top) line += next < ridge[x] - 0.15 ? '/' : next > ridge[x] + 0.15 ? '\\' : '_'
      else line += DEPTH[Math.min(DEPTH.length - 1, Math.floor((r - top) * 1.15 + ((x * 7 + r * 3) % 3) * 0.4))]
    }
    lines.push(line)
  }
  return lines.join('\n')
}

const GRADIENTS = {
  morning: 'linear-gradient(90deg, #4f9bff 0%, #6fcf8a 34%, #3fa34d 52%, #6fcf8a 70%, #4f9bff 100%)',
  noon: 'linear-gradient(90deg, #5a93e8 0%, #9fb86a 40%, #e0a25a 70%, #e98a78 100%)',
  evening: 'linear-gradient(90deg, #ff9a6b 0%, #ffc873 35%, #f07f8a 65%, #b8628f 100%)',
}

export function AsciiHorizon({ tone = 'morning', seed = 1, className = '' }) {
  return (
    <div aria-hidden="true" className={`relative z-[1] overflow-hidden pointer-events-none select-none ${className}`}>
      <pre
        className="m-0 mx-auto w-max font-mono font-semibold text-[9px] sm:text-[11px] leading-[0.95] text-transparent bg-clip-text"
        style={{ backgroundImage: GRADIENTS[tone], WebkitBackgroundClip: 'text', opacity: 0.9 }}
      >{hillsText(250, 9, seed)}</pre>
    </div>
  )
}
