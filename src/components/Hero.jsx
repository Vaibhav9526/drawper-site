import { useCallback, useState } from 'react'
import AsciiSky, { sceneAspect } from './AsciiSky'
import Icon from './Icon'
import { MARKET, OPEN_VSCODE } from '../links'

const ASPECT = sceneAspect(1800, 1012)
const FULL = [0, 1]

// Morning. The sky and meadow rebuilt in characters, on a real stretched canvas that
// falls away as you scroll (see data-hero-canvas in ../fx.js).
export default function Hero() {
  const [lit, setLit] = useState(false)
  const light = useCallback(() => setLit(true), [])

  return (
    <section id="top" data-hero style={{ '--hh': 'clamp(640px, 50vw, 800px)', '--ar': ASPECT }} className="relative z-0 px-3 sm:px-5 pt-[72px]">
      <div data-hero-canvas className="canvas-frame relative isolate overflow-hidden h-[var(--hh)] flex flex-col will-change-transform">
        <div data-hero-art aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 -z-20 w-[max(100%,calc(var(--hh)*var(--ar)))] [aspect-ratio:var(--ar)] will-change-transform">
          <img src="/hero.jpg" alt="" width="1800" height="1012" fetchPriority="high" className={`absolute inset-0 w-full h-full transition-opacity duration-[1600ms] ease-out ${lit ? 'opacity-100' : 'opacity-0'}`} />
          <AsciiSky src="/hero.jpg" crop={FULL} aspect={ASPECT} className="absolute inset-0 w-full h-full" onPaint={light} />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_46%_46%_at_50%_46%,rgb(233_242_255/0.9),rgb(233_242_255/0.55)_58%,transparent_82%)]" />

        <div className="relative z-20 flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-[780px]">
            <p className="rise inline-flex items-center gap-2 h-8 px-3.5 rounded-full border border-white/70 bg-white/70 backdrop-blur-md text-[12.5px] text-ink/75">
              <span className="size-1.5 rounded-full bg-[#28c840]" aria-hidden="true" /> Live on the VS Code Marketplace
            </p>
            <h1 className="rise mt-6 text-[clamp(2.5rem,6vw,4.8rem)] font-semibold tracking-[-0.05em] leading-[1.02] [animation-delay:80ms]">
              Sketch your system.<br />Ship the <span className="text-brand">schema.</span>
            </h1>
            <p className="rise mt-5 mx-auto max-w-[540px] text-[18px] leading-relaxed text-ink/75 text-balance [animation-delay:160ms]">
              Draw the boxes, drag an arrow, and Drawper writes the SQL. Let your DB engineer enjoy their holiday.
            </p>
            <div className="rise mt-8 flex flex-wrap items-center justify-center gap-3 [animation-delay:240ms]">
              <a href={OPEN_VSCODE} className="btn btn-brand h-12 px-6 text-[15px]">Add to VS Code</a>
              <a href="#demo" className="btn btn-paper h-12 px-6 text-[15px]"><Icon name="play" size={13} /> Watch it work</a>
            </div>
            <p className="rise mt-4 text-[12.5px] text-ink/60 [animation-delay:300ms]">
              Opens straight in VS Code. No VS Code here? <a href={MARKET} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">View on the Marketplace</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
