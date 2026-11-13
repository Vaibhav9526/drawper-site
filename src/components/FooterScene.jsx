import Icon from './Icon'
import useRepoStats from '../github'
import { CHANGELOG, ISSUES, LICENSE, MARKET, OPEN_VSCODE, REPO } from '../links'

// The end of the day. The page's evening colour carries straight on into dusk, a low sun
// slips behind hand-drawn hills as you arrive (see data-sun / data-hill in ../fx.js), and the
// links sit on the darkest hill. Nothing here is a photo, so it matches the rest of the page.
const cols = [
  ['Product', [['Demo', '#demo'], ['Drawings', '#product'], ['Features', '#features'], ['Get started', '#start']]],
  ['Resources', [['GitHub', REPO], ['VS Code Marketplace', MARKET], ['Issues', ISSUES], ['Changelog', CHANGELOG], ['MIT licence', LICENSE]]],
]

const headline = 'Sketch it in the morning. Ship it by sunset.'

// rolling hill outlines from a few sine waves, so the layers never repeat each other
const hill = (base, a1, f1, a2, f2, ph) => {
  const pts = []
  for (let x = 0; x <= 1440; x += 24) pts.push([x, base + a1 * Math.sin(x / f1 + ph) + a2 * Math.sin(x / f2 + ph * 2)])
  return `M0 320 L${pts.map(([x, y]) => `${x} ${y.toFixed(1)}`).join(' L')} L1440 320Z`
}
// tufts of grass along the nearest hill
const TUFTS = Array.from({ length: 70 }, (_, i) => {
  const x = (i / 70) * 1440 + ((i * 37) % 11)
  const y = 214 + 14 * Math.sin(x / 190 + 3) + 7 * Math.sin(x / 70 + 6)
  const h = 12 + ((i * 53) % 17)
  const lean = (((i * 29) % 13) - 6) * 1.2
  return `M${x.toFixed(0)} ${y.toFixed(1)} q${(lean * 0.3).toFixed(1)} ${(-h * 0.55).toFixed(1)} ${lean.toFixed(1)} ${-h}`
})

export default function FooterScene() {
  const { stars, forks, version } = useRepoStats()

  return (
    <footer data-foot className="relative z-[1] overflow-hidden" style={{ background: 'linear-gradient(to bottom, #f3978c 0, #ef8e8d 16%, #dd7a90 34%, #b8628f 54%, #7a4887 74%, #3b2456 100%)' }}>
      <div className="relative h-[560px] sm:h-[600px]">
        <div className="relative z-10 px-5 pt-24 text-center text-[#3b1a2b]">
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#3b1a2b]/88">Golden hour</p>
          <h2 data-words className="mt-3 mx-auto max-w-[640px] text-balance text-[clamp(1.8rem,3.8vw,2.9rem)] font-semibold tracking-[-0.04em] leading-[1.08]">
            {headline.split(' ').map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em] mr-[0.24em]"><span data-w className="inline-block">{w}</span></span>
            ))}
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            <a href={OPEN_VSCODE} className="btn btn-brand">Add to VS Code</a>
            <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-paper text-ink"><Icon name="star" size={14} /> Star on GitHub</a>
          </div>
        </div>

        <div aria-hidden="true" data-sun className="absolute left-1/2 -translate-x-1/2 bottom-[52px] size-[360px] sm:size-[440px] rounded-full will-change-transform" style={{ background: 'radial-gradient(circle, #fff7d2 0, #ffe59a 20%, #ffc36b 34%, rgba(255,160,100,0.5) 52%, rgba(255,140,120,0) 70%)' }} />

        <svg aria-hidden="true" viewBox="0 0 1440 260" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 w-full h-[220px] sm:h-[260px] overflow-visible">
          <g filter="url(#wob)">
            <path data-hill="0.5" d={hill(112, 20, 210, 9, 80, 0.4)} fill="#9a5490" />
            <path data-hill="0.3" d={hill(150, 18, 170, 8, 64, 2.1)} fill="#64397f" />
            <path d={hill(190, 14, 190, 7, 70, 3)} fill="#3b2456" />
            <path d={TUFTS.join(' ')} fill="none" stroke="#3b2456" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      <div className="relative -mt-6 bg-[#3b2456] text-white/92">
        <div className="mx-auto max-w-[1120px] px-6 pt-14 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr] gap-x-8 gap-y-10">
            <div className="col-span-2 md:col-span-1">
              <a href="#top" className="inline-flex items-center gap-2.5 text-white">
                <img src="/logo.svg" width="32" height="32" alt="" className="rounded-[9px]" />
                <span className="text-[21px] font-semibold tracking-[-0.03em]">Drawper</span>
              </a>
              <p className="mt-4 max-w-[320px] text-[15px] leading-[1.6] text-white/80 text-pretty">A whiteboard canvas inside VS Code. Draw your architecture and database tables, and get real code out.</p>
              <div className="mt-5 flex flex-wrap gap-2 text-[13px]">
                <a href={REPO} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] transition-colors"><Icon name="star" size={14} /> <b className="font-semibold tabular-nums">{stars}</b> <span className="text-white/80">{stars === 1 ? 'star' : 'stars'}</span></a>
                <a href={`${REPO}/fork`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] transition-colors"><Icon name="fork" size={14} /> <b className="font-semibold tabular-nums">{forks}</b> <span className="text-white/80">{forks === 1 ? 'fork' : 'forks'}</span></a>
                <span className="inline-flex items-center h-9 px-3.5 rounded-full bg-white/[0.08] font-mono text-[12px] text-white/86">v{version}</span>
              </div>
            </div>
            {cols.map(([title, links]) => (
              <nav key={title} aria-label={title}>
                <h3 className="text-[13px] font-semibold text-white">{title}</h3>
                <ul className="mt-4 space-y-3 text-[15px] text-white/80">
                  {links.map(([t, href]) => (
                    <li key={t}><a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})} className="hover:text-white transition-colors">{t}</a></li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[13px] text-white/64">
            <span>© 2026 Drawper. MIT licensed.</span>
            <span>Made for people who draw before they type.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
