import AsciiSky, { sceneAspect } from './AsciiSky'
import Icon from './Icon'
import useRepoStats from '../github'
import { CHANGELOG, ISSUES, LICENSE, MARKET, REPO } from '../links'

// The end of the day: the same hill and lone tree as the daytime picture, graded to golden
// hour and drawn in characters, with the links and live numbers on the dusk ground below.
const CROP = [0.33, 0.69]
const A = sceneAspect(1600, 1600 * (CROP[1] - CROP[0]))

const cols = [
  ['Product', [['Demo', '#demo'], ['Drawings', '#product'], ['Features', '#features'], ['Get started', '#start']]],
  ['Resources', [['GitHub', REPO], ['VS Code Marketplace', MARKET], ['Issues', ISSUES], ['Changelog', CHANGELOG], ['MIT licence', LICENSE]]],
]

export default function FooterScene() {
  const { stars, forks, version } = useRepoStats()

  return (
    <footer data-foot className="relative z-10 bg-[#2a1830]">
      <div style={{ '--a': A, '--fh': 'max(380px, calc(100vw / var(--a)))' }} className="relative isolate overflow-hidden h-[var(--fh)]">
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0,#000_32%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,#000_32%)]">
          <div data-foot-art aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[max(100%,calc(var(--fh)*var(--a)))] [aspect-ratio:var(--a)] overflow-hidden will-change-transform">
            <AsciiSky src="/footer.jpg" crop={CROP} aspect={A} grade className="absolute inset-0 w-full h-full" />
          </div>
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#2a1830] to-transparent" />

        <div className="absolute inset-x-0 top-[24%] px-4 text-center text-white [text-shadow:0_2px_24px_rgb(60_20_60/0.45)]">
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/80">Golden hour</p>
          <h2 data-words className="mt-3 mx-auto max-w-[760px] text-[clamp(1.8rem,4.4vw,3.2rem)] font-semibold tracking-[-0.035em] leading-[1.06]">
            {'Sketch it in the morning. Ship it by sunset.'.split(' ').map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em] mr-[0.24em]"><span data-w className="inline-block">{w}</span></span>
            ))}
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5 [text-shadow:none]">
            <a href={MARKET} target="_blank" rel="noreferrer" className="btn btn-brand">Add to VS Code</a>
            <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-paper text-ink"><Icon name="star" size={14} /> Star on GitHub</a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1120px] px-4 pt-6 pb-8 text-white/80">
        <div className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr] gap-x-6 gap-y-8">
          <div className="col-span-2 md:col-span-1">
            <a href="#top" className="inline-flex items-center gap-2.5 text-white">
              <img src="/logo.svg" width="30" height="30" alt="" className="rounded-[8px]" />
              <span className="text-[20px] font-semibold tracking-[-0.03em]">Drawper</span>
            </a>
            <p className="mt-3 max-w-[330px] text-[14px] leading-relaxed text-white/65">A whiteboard canvas inside VS Code. Draw your architecture and database tables, get real code out.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-[12.5px]">
              <a href={REPO} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/10 hover:bg-white/16 transition-colors"><Icon name="star" size={13} /> {stars} {stars === 1 ? 'star' : 'stars'}</a>
              <a href={`${REPO}/fork`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/10 hover:bg-white/16 transition-colors"><Icon name="fork" size={13} /> {forks} {forks === 1 ? 'fork' : 'forks'}</a>
              <span className="inline-flex items-center h-8 px-3 rounded-full bg-white/10 font-mono">v{version}</span>
            </div>
          </div>
          {cols.map(([title, links]) => (
            <div key={title}>
              <h3 className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/45">{title}</h3>
              <ul className="mt-3 space-y-2 text-[14px]">
                {links.map(([t, href]) => (
                  <li key={t}><a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})} className="hover:text-white transition-colors">{t}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-5 border-t border-white/12 flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-white/50">
          <span>© 2026 Drawper. MIT licensed.</span>
          <span className="hand text-[20px] text-white/70">sketch your system, ship the schema</span>
        </div>
      </div>
    </footer>
  )
}
