import { useCallback, useState } from 'react'
import AsciiSky, { sceneAspect } from './AsciiSky'
import Icon from './Icon'
import { OPEN_VSCODE } from '../links'

const ASPECT = sceneAspect(1800, 1012)
const FULL = [0, 1]
const WIND = { from: 0.5, amp: 2.4, grass: true }

// Morning. The sky and meadow rebuilt in characters coloured from the picture, with one
// clear message in the middle.
export default function Hero() {
  const [lit, setLit] = useState(false)
  const light = useCallback(() => setLit(true), [])

  return (
    <section id="top" data-hero style={{ '--hh': 'clamp(700px, 52vw, 860px)', '--ar': ASPECT }} className="relative isolate overflow-hidden h-[var(--hh)] flex flex-col">
      <div data-hero-art aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 -z-20 w-[max(100%,calc(var(--hh)*var(--ar)))] [aspect-ratio:var(--ar)] will-change-transform">
        <img src="/hero.jpg" alt="" width="1800" height="1012" fetchPriority="high" className={`absolute inset-0 w-full h-full transition-opacity duration-[1600ms] ease-out ${lit ? 'opacity-100' : 'opacity-0'}`} />
        <AsciiSky src="/hero.jpg" crop={FULL} aspect={ASPECT} sway={WIND} className="absolute inset-0 w-full h-full" onPaint={light} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_46%_44%_at_50%_46%,rgb(233_242_255/0.9),rgb(233_242_255/0.55)_58%,transparent_82%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-28 -z-10 bg-gradient-to-b from-transparent to-[#e6f0ff]/90" />

      <div data-hero-copy className="relative z-20 flex-1 flex items-center justify-center px-4 pt-14">
        <div className="text-center max-w-[780px]">
          <p className="rise inline-flex items-center gap-2 h-8 px-3.5 rounded-full border border-white/70 bg-white/70 backdrop-blur-md text-[12.5px] text-ink/86">
            <span className="size-1.5 rounded-full bg-[#28c840]" aria-hidden="true" /> Live on the VS Code Marketplace
          </p>
          <h1 className="rise mt-6 text-[clamp(2.6rem,6.2vw,5rem)] font-semibold tracking-[-0.05em] leading-[1.02] [animation-delay:80ms]">
            Sketch your system.<br />Ship the <span className="text-brand">schema.</span>
          </h1>
          <p className="rise mt-5 mx-auto max-w-[540px] text-[18px] leading-relaxed text-ink/86 text-balance [animation-delay:160ms]">
            Draw the boxes, drag an arrow, and Drawper writes the SQL. Let your DB engineer enjoy their holiday.
          </p>
          <div className="rise mt-8 flex flex-wrap items-center justify-center gap-3 [animation-delay:240ms]">
            <a href={OPEN_VSCODE} className="btn btn-brand h-12 px-6 text-[15px]">Add to VS Code</a>
            <a href="#demo" className="btn btn-paper h-12 px-6 text-[15px]"><Icon name="play" size={13} /> Watch it work</a>
          </div>
        </div>
      </div>
    </section>
  )
}
