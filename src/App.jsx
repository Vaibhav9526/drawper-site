import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Hub, Rebuild, Format, Terminal, Loupe, Branches, Phosphor, Drawer, Relay, Terrain } from '@lucasmarkes/hairline/react'
import useSmoothScroll from './smooth'
import Scene from './components/Scene'
import Showcase from './components/Showcase'
import CodeSection from './components/CodeSection'
import Icon, { Mark } from './components/Icons'

gsap.registerPlugin(ScrollTrigger)

const REPO = 'https://github.com/Vaibhav9526/Drawper'

const sources = ['Prisma', 'SQL', 'Drizzle', 'TypeORM', 'SQLAlchemy', 'Django', 'Mongoose']

const features = [
  { Fig: Hub, t: 'Architecture panel', d: 'Client, API, worker, gateway, database, cache, queue and storage. Arrows between components become dependencies.', label: 'A hub with tiles around it' },
  { Fig: Drawer, t: 'Schema panel', d: 'Tables and columns with primary keys, nullable, unique and foreign keys. Renaming updates every reference.', label: 'A cabinet of drawers' },
  { Fig: Rebuild, t: 'Relations by arrow', d: 'Join two tables with an arrow and the foreign key is created, then flows into every generator.', label: 'A dependency tree' },
  { Fig: Relay, t: 'Relation queries', d: 'One click writes SQL joins plus Drizzle and Prisma relation queries for every relation, both directions.', label: 'A path lighting hop by hop' },
  { Fig: Format, t: 'Code generation', d: 'SQL, Prisma, Drizzle, TypeScript types and a docker-compose.yml with a Node scaffold per service.', label: 'Lines snapping square' },
  { Fig: Terminal, t: 'Convert from the IDE', d: 'Turn an existing schema file into another format from a CodeLens, the context menu or the Command Palette.', label: 'A terminal window' },
  { Fig: Loupe, t: 'Schema viewer', d: 'A CodeLens above schema definitions opens an ER diagram. Whole app mode shows every schema in the workspace.', label: 'A loupe over a sheet' },
  { Fig: Branches, t: 'Plain JSON files', d: 'Drawings are saved as .dpr and diff cleanly, so your sketches live in git next to the code.', label: 'A commit graph' },
  { Fig: Phosphor, t: 'Opens fast', d: 'A code-split webview of about 750 KB. The document is embedded in the page and the extension only activates when you use it.', label: 'A dot matrix' },
]

const steps = [
  ['download', 'Install', 'code --install-extension drawper-0.0.1.vsix'],
  ['newfile', 'New drawing', 'Drawper: New Drawing (Ctrl+Shift+P)'],
  ['draw', 'Draw', 'Add components or tables, join them with the Arrow tool (A)'],
  ['braces', 'Generate', 'Click SQL, Prisma, Drizzle, TS types or docker-compose'],
]

const facts = [
  ['7', 'Schema formats read'],
  ['6', 'Outputs generated'],
  ['~750 KB', 'Webview up front'],
  ['.dpr', 'Plain JSON, git-friendly'],
]

function Nav() {
  const [open, setOpen] = useState(false)
  const links = [['Product', '#product'], ['Features', '#features'], ['Codegen', '#codegen'], ['Get started', '#start']]
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-paper/90 backdrop-blur-md hl-b">
      <div className="mx-auto max-w-[1400px] h-14 px-5 sm:px-6 lg:px-10 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 font-medium tracking-tight text-[16px]">
          <Mark size={26} /> Drawper
        </a>
        <nav className="hidden md:flex items-center gap-8 text-[14px] text-mute">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="hover:text-ink transition-colors">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-ink !h-9 !px-4 !text-[13px]">
            GitHub <Icon name="arrow" size={14} />
          </a>
          <button aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)} className="md:hidden h-9 w-9 grid place-items-center">
            <Icon name={open ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden hl-t px-5 py-2 flex flex-col bg-paper">
          {links.map(([l, h]) => (
            <a key={l} href={h} onClick={() => setOpen(false)} className="py-3.5 text-[15px] border-b border-line last:border-b-0">{l}</a>
          ))}
        </nav>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden hl-b">
      <div className="grid-bg absolute inset-0 pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 pt-28 lg:pt-14 lg:min-h-[calc(100svh-84px)] lg:flex lg:items-center pointer-events-none">
        <div className="max-w-[640px] pointer-events-auto">
          <p className="eyebrow hero-fade mb-8 flex items-center gap-3">
            <span className="h-px w-8 bg-ink" /> VS Code extension · .dpr files
          </p>
          <h1 className="display text-[clamp(3.2rem,7.4vw,7rem)]">
            <span className="line"><span>Sketch the</span></span>
            <span className="line"><span><b>system.</b></span></span>
            <span className="line"><span>Ship the</span></span>
            <span className="line"><span><b>schema.</b></span></span>
          </h1>
          <p className="hero-fade mt-8 max-w-[480px] text-[18px] leading-relaxed text-mute">
            A fast whiteboard canvas inside VS Code for sketching system architecture and database schemas, then turning them into real code.
          </p>
          <div className="hero-fade mt-9 flex flex-wrap gap-3">
            <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-sun">Get Drawper <Icon name="arrow" size={15} /></a>
            <a href="#product" className="btn btn-ghost">See it in action</a>
          </div>
        </div>
      </div>
      <Scene />
      <div className="relative z-10 hl-t bg-paper/80 backdrop-blur-sm">
        <div className="mx-auto max-w-[1400px] grid grid-cols-2 md:grid-cols-4">
          {facts.map(([v, l], i) => (
            <div key={l} className={`px-5 sm:px-6 lg:px-10 py-5 border-line ${i % 2 ? 'border-l' : ''} ${i > 0 ? 'md:border-l' : ''} ${i > 1 ? 'border-t md:border-t-0' : ''}`}>
              <div className="text-[22px] font-light tracking-tight">{v}</div>
              <div className="eyebrow mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Strip() {
  const row = [...sources, ...sources, ...sources, ...sources]
  return (
    <section className="hl-b overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 py-5 flex items-center gap-8">
        <p className="eyebrow shrink-0 hidden sm:block">Reads &amp; writes</p>
        <div className="overflow-hidden flex-1 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="marquee flex w-max items-center gap-10 pr-10">
            {row.map((s, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap">
                <span className="font-mono text-[14px]">{s}</span>
                <span className="h-3 w-px bg-ink/30" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="hl-b">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 py-20 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8 mb-14 lg:mb-16">
          <div>
            <p className="eyebrow reveal mb-5">02 — Features</p>
            <h2 className="display reveal text-[clamp(2.5rem,6.5vw,6.2rem)]">
              Small surface.<br /><b>Serious output.</b>
            </h2>
          </div>
          <p className="reveal max-w-sm text-mute text-[17px] leading-relaxed">
            Everything lives in one editor tab, next to the code it generates. Move your pointer over the drawings.
          </p>
        </div>

        <div className="figures grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-3 hl-t hl-l">
          {features.map(({ Fig, t, d, label }, i) => (
            <article key={t} className="reveal hl-r hl-b p-5 sm:p-7 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
                <span className="eyebrow">{t.split(' ')[0]}</span>
              </div>
              <Fig intensity={0.6} label={label} theme="light" className="w-full" />
              <h3 className="mt-7 text-[21px] font-medium tracking-tight">{t}</h3>
              <p className="mt-2 text-mute leading-relaxed text-[15px]">{d}</p>
            </article>
          ))}
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
    <section id="start" className="hl-b">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 py-20 lg:py-32 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-14 lg:gap-24">
        <div>
          <p className="eyebrow reveal mb-5">04 — Get started</p>
          <h2 className="display reveal text-[clamp(2.5rem,5.5vw,5rem)]">
            Four steps to<br /><b>your first schema.</b>
          </h2>
          <button onClick={copy} className="reveal ticks mt-10 w-full max-w-lg text-left hl-all bg-[#fbf9f3] hover:bg-paper-2 transition-colors px-5 py-4 font-mono text-[13.5px] flex items-center justify-between gap-4">
            <span className="truncate"><span className="text-mute">$</span> {cmd}</span>
            <span className="shrink-0 flex items-center gap-2 eyebrow">
              <Icon name={copied ? 'check' : 'copy'} size={15} /> {copied ? 'Copied' : 'Copy'}
            </span>
          </button>
        </div>
        <ol className="hl-t">
          {steps.map(([ic, t, d], i) => (
            <li key={t} className="reveal hl-b py-6 grid grid-cols-[2.5rem_1fr_auto] gap-4 items-start">
              <span className="eyebrow pt-1">0{i + 1}</span>
              <div>
                <h3 className="text-xl font-medium tracking-tight">{t}</h3>
                <p className="font-mono text-[13px] text-mute mt-1.5 break-words">{d}</p>
              </div>
              <Icon name={ic} size={24} className="text-ink" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="hl-b overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 py-20 lg:py-28 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="display reveal text-[clamp(3rem,7.5vw,7.4rem)]">
            Open a<br /><b>blank canvas.</b>
          </h2>
          <div className="reveal mt-10 flex flex-wrap gap-3">
            <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-sun">Get Drawper <Icon name="arrow" size={15} /></a>
            <a href="#codegen" className="btn btn-ghost">See the output</a>
          </div>
        </div>
        <div className="figures reveal">
          <Terrain intensity={0.7} label="Pillars rising around the pointer" theme="light" className="w-full" />
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 py-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-[14px] text-mute">
        <span className="flex items-center gap-2.5 text-ink"><Mark size={22} /> Drawper</span>
        <span>A fast whiteboard canvas inside VS Code.</span>
        <span className="flex gap-6">
          <a href={REPO} target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">GitHub</a>
          <a href="https://github.com/lucasmarkes/hairline" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">Figures by Hairline</a>
        </span>
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
      if (reduce) return
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.hero-fade', { y: 16, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.1)
        .from('.line > span', { yPercent: 110, duration: 1.1, stagger: 0.08 }, 0.05)

      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 28, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
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
        <Features />
        <CodeSection />
        <GetStarted />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
