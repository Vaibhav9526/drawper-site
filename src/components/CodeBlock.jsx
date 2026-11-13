// Lightly highlighted code on the dark panel. Not a parser: just keywords and comments.
const KEY = /\b(?:CREATE TABLE|PRIMARY KEY|NOT NULL|FOREIGN KEY|REFERENCES|SERIAL|model|export interface)\b/
const TYPE = /\b(?:INTEGER|TEXT|TIMESTAMP|NUMERIC|Int|String|DateTime|Decimal|number|string|Date|null)\b/
const SPLIT = new RegExp(`(${KEY.source}|${TYPE.source}|@\\w+)`, 'g')

function line(src, i) {
  if (/^\s*(--|\/\/)/.test(src)) return <span key={i} className="text-white/60">{src}{'\n'}</span>
  const parts = src.split(SPLIT)
  return (
    <span key={i}>
      {parts.map((p, j) => {
        if (!p) return null
        if (KEY.test(p) && p.match(KEY)[0] === p) return <span key={j} className="text-[#ff8f8f]">{p}</span>
        if (TYPE.test(p) && p.match(TYPE)[0] === p) return <span key={j} className="text-[#7db4ff]">{p}</span>
        if (p.startsWith('@')) return <span key={j} className="text-[#ffc47a]">{p}</span>
        return p
      })}
      {'\n'}
    </span>
  )
}

export default function CodeBlock({ code, caret = false, className = '' }) {
  return (
    <pre className={`font-mono text-[12px] leading-[1.65] text-[#e7e6ec] whitespace-pre overflow-auto code-scroll ${className}`}>
      {code.split('\n').map(line)}
      {caret && <span className="inline-block w-[7px] h-[14px] -mb-[2px] bg-[#7db4ff] animate-pulse" />}
    </pre>
  )
}

// string version for the demo, which types into the DOM directly (no React work per frame)
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
export function highlightHTML(code) {
  return code
    .split('\n')
    .map((src) => {
      if (/^\s*(--|\/\/)/.test(src)) return `<span style="color:rgb(255 255 255/.4)">${esc(src)}</span>`
      return src
        .split(SPLIT)
        .map((p) => {
          if (!p) return ''
          if (KEY.test(p) && p.match(KEY)[0] === p) return `<span style="color:#ff8f8f">${esc(p)}</span>`
          if (TYPE.test(p) && p.match(TYPE)[0] === p) return `<span style="color:#7db4ff">${esc(p)}</span>`
          if (p.startsWith('@')) return `<span style="color:#ffc47a">${esc(p)}</span>`
          return esc(p)
        })
        .join('')
    })
    .join('\n')
}
