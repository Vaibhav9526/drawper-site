import AsciiSky, { sceneAspect } from './AsciiSky'
import Icon from './Icon'
import useRepoStats from '../github'
import { CHANGELOG, ISSUES, LICENSE, MARKET, OPEN_VSCODE, REPO } from '../links'

// The end of the day: a second canvas hangs at the bottom of the page, the same hill and lone
// tree graded to golden hour and drawn in characters. It drops in as you arrive.
const CROP = [0.33, 0.69]
const A = sceneAspect(1600, 1600 * (CROP[1] - CROP[0]))

const cols = [
  ['Product', [['Demo', '#demo'], ['Drawings', '#product'], ['Features', '#features'], ['Get started', '#start']]],
  ['Resources', [['GitHub', REPO], ['VS Code Marketplace', MARKET], ['Issues', ISSUES], ['Changelog', CHANGELOG], ['MIT licence', LICENSE]]],
]

const headline = 'Sketch it in the morning. Ship it by sunset.'

export default function FooterScene() {
  const { stars, forks, version } = useRepoStats()

  return (
    <footer data-foot className="relative z-[1] pt-10">
      <div className="px-3 sm:px-5">
        <div data-foot-canvas style={{ '--a': A, '--fh': 'clamp(420px, calc((100vw - 40px) / var(--a)), 640px)' }} className="canvas-frame relative isolate overflow-hidden h-[var(--fh)] will-change-transform">
          <div data-foot-art aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[max(100%,calc(var(--fh)*var(--a)))] [aspect-ratio:var(--a)] overflow-hidden will-change-transform">
            <AsciiSky src="/footer.jpg" crop={CROP} aspect={A} grade className="absolute inset-0 w-full h-full" />
          </div>

          <div className="absolute inset-x-0 top-[17%] px-5 text-center text-white [text-shadow:0_2px_28px_rgb(60_20_60/0.5)]">
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-white/80">Golden hour</p>
            <h2 data-words className="mt-3 mx-auto max-w-[640px] text-balance text-[clamp(1.7rem,3.6vw,2.7rem)] font-semibold tracking-[-0.04em] leading-[1.08]">
              {headline.split(' ').map((w, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em] mr-[0.24em]"><span data-w className="inline-block">{w}</span></span>
              ))}
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5 [text-shadow:none]">
              <a href={OPEN_VSCODE} className="btn btn-brand">Add to VS Code</a>
              <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-paper text-ink"><Icon name="star" size={14} /> Star on GitHub</a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-[#2a1830] rounded-t-[32px] text-white/80">
        <div className="mx-auto max-w-[1120px] px-6 pt-14 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr] gap-x-8 gap-y-10">
            <div className="col-span-2 md:col-span-1">
              <a href="#top" className="inline-flex items-center gap-2.5 text-white">
                <img src="/logo.svg" width="32" height="32" alt="" className="rounded-[9px]" />
                <span className="text-[21px] font-semibold tracking-[-0.03em]">Drawper</span>
              </a>
              <p className="mt-4 max-w-[320px] text-[15px] leading-[1.6] text-white/60 text-pretty">A whiteboard canvas inside VS Code. Draw your architecture and database tables, and get real code out.</p>
              <div className="mt-5 flex flex-wrap gap-2 text-[13px]">
                <a href={REPO} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] transition-colors"><Icon name="star" size={14} /> <b className="font-semibold tabular-nums">{stars}</b> <span className="text-white/60">{stars === 1 ? 'star' : 'stars'}</span></a>
                <a href={`${REPO}/fork`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] transition-colors"><Icon name="fork" size={14} /> <b className="font-semibold tabular-nums">{forks}</b> <span className="text-white/60">{forks === 1 ? 'fork' : 'forks'}</span></a>
                <span className="inline-flex items-center h-9 px-3.5 rounded-full bg-white/[0.08] font-mono text-[12px] text-white/70">v{version}</span>
              </div>
            </div>
            {cols.map(([title, links]) => (
              <nav key={title} aria-label={title}>
                <h3 className="text-[13px] font-semibold text-white">{title}</h3>
                <ul className="mt-4 space-y-3 text-[15px] text-white/60">
                  {links.map(([t, href]) => (
                    <li key={t}><a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})} className="hover:text-white transition-colors">{t}</a></li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[13px] text-white/45">
            <span>© 2026 Drawper. MIT licensed.</span>
            <span>Made for people who draw before they type.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
