import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useSmoothScroll from './smooth'
import Scene from './components/Scene'
import Showcase from './components/Showcase'
import CodeSection from './components/CodeSection'

gsap.registerPlugin(ScrollTrigger)

const REPO = 'https://github.com/Vaibhav9526/Drawper'

const sources = ['Prisma', 'SQL', 'Drizzle', 'TypeORM', 'SQLAlchemy', 'Django', 'Mongoose']

const features = [
  ['Opens fast', 'A code-split webview of about 750 KB. The document is embedded in the page and the extension only activates when you use it.'],
  ['Architecture panel', 'Client, API, worker, gateway, database, cache, queue and storage. Arrows between components become dependencies.'],
  ['Schema panel', 'Tables and columns with primary keys, nullable, unique and foreign keys. Renames update every reference.'],
  ['Relations by arrow', 'Join two tables with an arrow and the foreign key is created, then flows into every generator.'],
  ['Relation queries', 'One click writes SQL joins plus Drizzle and Prisma relation queries for every relation, both directions.'],
  ['Convert from the IDE', 'Turn an existing schema file into another format from a CodeLens, the context menu or the Command Palette.'],
  ['Schema viewer', 'A CodeLens above schema definitions opens an ER diagram. Whole app mode shows every schema in the workspace.'],
  ['Plain JSON files', 'Drawings are saved as .dpr and diff cleanly, so your sketches live in git next to the code.'],
]

const steps = [
  ['Install', 'code --install-extension drawper-0.0.1.vsix'],
  ['New drawing', 'Drawper: New Drawing  (Ctrl+Shift+P)'],
  ['Draw', 'Add components or tables, join them with the Arrow tool (A)'],
  ['Generate', 'Click SQL, Prisma, Drizzle, TS types or docker-compose'],
]

function Logo({ className = '' }) {
  return <img src="/logo.png" alt="" width="28" height="28" className={`rounded-[7px] ${className}`} />
}

function Nav() {
  const [open, setOpen] = useState(false)
  const links = [['Product', '#product'], ['Codegen', '#codegen'], ['Features', '#features'], ['Get started', '#start']]
  return (
    <header className="fixed top-3 inset-x-0 z-50 px-3 sm:px-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-[1000px] rounded-xl bg-paper/90 backdrop-blur-xl"
        style={{ boxShadow: '0 0 0 1px rgb(46 41 54 / .14), 0 10px 30px -12px rgb(46 41 54 / .25)' }}>
        <div className="h-14 pl-3.5 pr-2 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight text-[16px]">
            <Logo className="!w-7 !h-7" /> Drawper
          </a>
          <nav className="hidden md:flex items-center gap-1 text-[14px] text-mute">
            {links.map(([l, h]) => (
              <a key={l} href={h} className="px-3.5 py-2 rounded-md hover:bg-ink/5 hover:text-ink transition-colors">{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-ink !h-9 !px-4 !text-[13.5px]">GitHub ↗</a>
            <button aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)} className="md:hidden h-9 w-9 rounded-md hover:bg-ink/5 grid place-items-center">
              <span className="block w-4 space-y-[5px]">
                <span className={`block h-px bg-ink transition-transform ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
                <span className={`block h-px bg-ink transition-transform ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>
        {open && (
          <nav className="md:hidden border-t rule px-2 py-2 flex flex-col">
            {links.map(([l, h]) => (
              <a key={l} href={h} onClick={() => setOpen(false)} className="px-3 py-3 rounded-md text-[15px] hover:bg-ink/5">{l}</a>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-5 sm:px-6 lg:px-10 pt-32 lg:pt-20 lg:min-h-[100svh] lg:flex lg:items-center pointer-events-none">
        <div className="max-w-[640px] pointer-events-auto">
          <p className="eyebrow hero-fade mb-7 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" /> VS Code extension · .dpr files
          </p>
          <h1 className="display text-[clamp(3.1rem,7.2vw,6.8rem)]">
            <span className="line"><span>Sketch the</span></span>
            <span className="line"><span><span className="serif">system.</span></span></span>
            <span className="line"><span>Ship the</span></span>
            <span className="line"><span><span className="serif">schema.</span></span></span>
          </h1>
          <p className="hero-fade mt-8 max-w-[470px] text-[18px] leading-relaxed text-mute">
            A fast whiteboard canvas inside VS Code for sketching system architecture and database schemas, then turning them into real code.
          </p>
          <div className="hero-fade mt-9 flex flex-wrap gap-3">
            <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-sun">Get Drawper</a>
            <a href="#product" className="btn btn-ghost">See it in action ↓</a>
          </div>
        </div>
      </div>
      <Scene />
    </section>
  )
}

function Strip() {
  const row = [...sources, ...sources, ...sources, ...sources]
  return (
    <section className="relative bg-paper border-y rule overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-5 sm:px-6 lg:px-10 py-5 flex items-center gap-8">
        <p className="eyebrow shrink-0 hidden sm:block">Reads &amp; writes</p>
        <div className="overflow-hidden flex-1 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="marquee flex w-max gap-12 pr-12">
            {row.map((s, i) => (
              <span key={i} className="font-mono text-[14px] text-ink/65 whitespace-nowrap">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="bg-paper">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 py-20 lg:py-32">
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-24">
          <div className="lg:sticky lg:top-28 self-start">
            <p className="eyebrow reveal mb-5">Features</p>
            <h2 className="display reveal text-[clamp(2.4rem,5vw,4.8rem)]">
              Small surface.<br /><span className="serif">Serious output.</span>
            </h2>
            <p className="reveal mt-8 text-mute text-[17px] leading-relaxed max-w-sm">
              Everything lives in one editor tab, next to the code it generates.
            </p>
          </div>
          <ul className="border-t rule">
            {features.map(([t, d], i) => (
              <li key={t} className="reveal group border-b rule py-7 grid grid-cols-[3rem_1fr] gap-4 hover:bg-ink/[0.025] transition-colors -mx-3 px-3">
                <span className="eyebrow pt-1.5 group-hover:text-ink transition-colors">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-[22px] font-medium tracking-tight">{t}</h3>
                  <p className="text-mute mt-2 leading-relaxed text-[15.5px] max-w-lg">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function GetStarted() {
  const [copied, setCopied] = useState(false)
  const cmd = 'code --install-extension drawper-0.0.1.vsix'
  const copy = async () => {
    try { await navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1400) } catch { /* noop */ }
  }
  return (
    <section id="start" className="bg-ink-2 text-paper">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 py-20 lg:py-32 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-14 lg:gap-24">
        <div>
          <p className="eyebrow reveal mb-5 !text-paper/50">Get started</p>
          <h2 className="display reveal text-[clamp(2.4rem,5vw,4.8rem)]">
            Four steps to<br /><span className="serif">your first schema.</span>
          </h2>
          <button onClick={copy} className="reveal mt-10 w-full max-w-lg text-left rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.07] transition-colors px-5 py-4 font-mono text-[14px] flex items-center justify-between gap-4">
            <span className="truncate"><span className="text-sun">$</span> {cmd}</span>
            <span className="eyebrow !text-paper/50 shrink-0">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <ol className="border-t border-white/15">
          {steps.map(([t, d], i) => (
            <li key={t} className="reveal border-b border-white/15 py-6 grid grid-cols-[3rem_1fr] gap-4">
              <span className="font-serif italic text-3xl text-sun leading-none">{i + 1}</span>
              <div>
                <h3 className="text-xl font-medium tracking-tight">{t}</h3>
                <p className="font-mono text-[13.5px] text-paper/55 mt-1.5">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="bg-sun text-ink relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 py-24 lg:py-40">
        <h2 className="display reveal text-[clamp(3.2rem,10vw,10rem)]">
          Open a<br /><span className="serif">blank canvas.</span>
        </h2>
        <div className="reveal mt-12 flex flex-wrap gap-3">
          <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-ink">Get Drawper</a>
          <a href="#codegen" className="btn btn-ghost">See the output</a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-ink-2 text-paper/60">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 py-10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-[14px]">
        <span className="flex items-center gap-2.5 text-paper"><Logo className="!w-6 !h-6" /> Drawper</span>
        <span>A fast whiteboard canvas inside VS Code.</span>
        <a href={REPO} target="_blank" rel="noreferrer" className="hover:text-paper transition-colors">GitHub</a>
      </div>
    </footer>
  )
}

export default function App() {
  useSmoothScroll()
  const root = useRef(null)

  useLayoutEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduce) {
        return
      }
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.hero-fade', { y: 18, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.1)
        .from('.line > span', { yPercent: 110, duration: 1.2, stagger: 0.09 }, 0.05)

      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 36, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      const arrow = document.querySelector('.draw-arrow')
      if (arrow) {
        const len = arrow.getTotalLength()
        gsap.set(arrow, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(arrow, {
          strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut',
          scrollTrigger: { trigger: arrow, start: 'top 80%', once: true },
        })
      }
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root}>
      <Nav />
      <main>
        <Hero />
        <Strip />
        <Showcase />
        <CodeSection />
        <Features />
        <GetStarted />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
