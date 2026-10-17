import { useState } from 'react'
import { files, highlight } from '../codeSamples'

// Hero tool card, same idea as the reference's receipt: real output, one action.
export default function Receipt() {
  const [tab, setTab] = useState('SQL')
  const [copied, setCopied] = useState(false)
  const f = files[tab]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(f.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <div className="receipt px-4 pt-6 pb-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)]">
      <div className="flex items-center justify-between">
        <span className="mono-label">Schema → code</span>
        <span className="mono-label">2 tables · 1 FK</span>
      </div>
      <p className="mt-2 text-[15px] font-medium leading-snug">
        Draw an arrow.<br />Get the foreign key.
      </p>

      <div className="dash my-3" />

      <div className="flex gap-1.5 flex-wrap" role="tablist">
        {Object.keys(files).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`font-mono text-[11.5px] px-2.5 py-1 rounded-md border transition-colors ${tab === k ? 'bg-sun text-black border-sun' : 'border-line text-mute hover:text-text'}`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="mono-label mt-3">{f.name}</div>
      <pre className="code-scroll mt-1.5 h-[250px] overflow-auto text-[11.5px] leading-[1.7] font-mono text-text/90">
        <code dangerouslySetInnerHTML={{ __html: f.code.split('\n').map(highlight).join('\n') }} />
      </pre>

      <div className="dash my-3" />

      <button onClick={copy} className="w-full h-9 rounded-md bg-sun text-black text-[13px] font-medium hover:bg-[#ffe433] transition-colors">
        {copied ? 'Copied' : `Copy ${f.name}`}
      </button>
      <div className="mt-3 flex items-end justify-center gap-[2px] h-5 opacity-70" aria-hidden="true">
        {Array.from({ length: 46 }, (_, i) => (
          <span key={i} className="bg-text" style={{ width: i % 5 === 0 ? 3 : 1.5, height: `${55 + ((i * 37) % 45)}%` }} />
        ))}
      </div>
    </div>
  )
}
