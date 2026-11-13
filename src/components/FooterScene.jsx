import AsciiSky, { sceneAspect } from './AsciiSky'
import Icon from './Icon'
import useRepoStats from '../github'
import { CHANGELOG, ISSUES, LICENSE, MARKET, REPO } from '../links'

// The end of the day: the golden-hour wheat field, drawn only in characters (no photo under
// it) on dusk. The page's evening rose fades into it, and once it is drawn the grain moves in
// the wind. See AsciiSky for how the picture becomes text.
const CROP = [0.08, 0.98]
const SWAY = { from: 0.5, amp: 2.6 }
const A = sceneAspect(1800, 1014 * (CROP[1] - CROP[0]))

const cols = [
  ['Product', [['Demo', '#demo'], ['Drawings', '#product'], ['Features', '#features'], ['Get started', '#start']]],
  ['Resources', [['GitHub', REPO], ['VS Code Marketplace', MARKET], ['Issues', ISSUES], ['Changelog', CHANGELOG], ['MIT licence', LICENSE]]],
]

const headline = 'Sketch it in the morning. Ship it by sunset.'

export default function FooterScene() {
  const { stars, forks, version } = useRepoStats()

  return (
    <footer data-foot className="relative z-[1] overflow-hidden" style={{ background: 'linear-gradient(to bottom, #f3978c 0, #ef8e8d 250px, #8d4f86 430px, #34204a 600px, #1c0f28 100%)' }}>
      <div className="relative z-10 px-5 pt-24 text-center text-[#3b1a2b]">
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#3b1a2b]/80">Golden hour</p>
        <h2 data-words className="mt-3 mx-auto max-w-[640px] text-balance text-[clamp(1.8rem,3.8vw,2.9rem)] font-semibold tracking-[-0.04em] leading-[1.08]">
          {headline.split(' ').map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em] mr-[0.24em]"><span data-w className="inline-block">{w}</span></span>
          ))}
        </h2>
        <div className="mt-7 flex justify-center">
          <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-paper text-ink"><Icon name="star" size={14} /> Star on GitHub</a>
        </div>
      </div>

      <div style={{ '--a': A }} className="relative -mt-24 [mask-image:linear-gradient(to_bottom,transparent_0,rgb(0_0_0/0.5)_16%,#000_34%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,rgb(0_0_0/0.5)_16%,#000_34%)]">
        <AsciiSky src="/footer.jpg" crop={CROP} aspect={A} sway={SWAY} invert className="block w-full h-auto min-w-[900px]" />
      </div>

      <div className="relative text-white/80">
        <div className="mx-auto max-w-[1120px] px-6 pt-6 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr] gap-x-8 gap-y-10">
            <div className="col-span-2 md:col-span-1">
              <a href="#top" className="inline-flex items-center gap-2.5 text-white">
                <img src="/logo.svg" width="32" height="32" alt="" className="rounded-[9px]" />
                <span className="text-[21px] font-semibold tracking-[-0.03em]">Drawper</span>
              </a>
              <p className="mt-4 max-w-[320px] text-[15px] leading-[1.6] text-white/80 text-pretty">A whiteboard canvas inside VS Code. Draw your architecture and database tables, and get real code out.</p>
              <div className="mt-5 flex flex-wrap gap-2 text-[13px]">
                <a href={REPO} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white/[0.1] hover:bg-white/[0.16] transition-colors"><Icon name="star" size={14} /> <b className="font-semibold tabular-nums">{stars}</b> <span className="text-white/80">{stars === 1 ? 'star' : 'stars'}</span></a>
                <a href={`${REPO}/fork`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white/[0.1] hover:bg-white/[0.16] transition-colors"><Icon name="fork" size={14} /> <b className="font-semibold tabular-nums">{forks}</b> <span className="text-white/80">{forks === 1 ? 'fork' : 'forks'}</span></a>
                <span className="inline-flex items-center h-9 px-3.5 rounded-full bg-white/[0.1] font-mono text-[12px] text-white/86">v{version}</span>
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
          <div className="mt-12 pt-6 border-t border-white/12 flex flex-wrap items-center justify-between gap-3 text-[13px] text-white/64">
            <span>© 2026 Drawper. MIT licensed.</span>
            <span>Made for people who draw before they type.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
