import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useSmoothScroll from './smooth'
import Scene from './components/Scene'
import DrawCanvas from './components/DrawCanvas'
import { Phosphor, Hub, Relay, Terminal, Loupe, Rebuild, Riffle, Branches } from '@lucasmarkes/hairline/react'
import Icon from './components/Icons'
import { SketchDefs, ForeignKeySketch, ToasterSketch, UnzipSketch } from './components/Illustrations'

gsap.registerPlugin(ScrollTrigger)

const REPO = 'https://github.com/Vaibhav9526/Drawper'
const CMD = 'code --install-extension drawper-0.0.1.vsix'

const sources = ['Prisma', 'SQL', 'Drizzle', 'TypeORM', 'SQLAlchemy', 'Django', 'Mongoose']

const shots = [
  { img: '/schema-editor.png', alt: 'Drawper schema editor with a table, its columns and the SQL, Prisma, Drizzle and TS generate buttons', k: 'Schema editor', d: 'Tables, columns, PK / NULL / UQ / FK.' },
  { img: '/relations.png', alt: 'Drawper canvas with an arrow from the orders table to the customers table that adds a foreign key', k: 'Relations', d: 'Arrow between tables adds the FK column.' },
  { img: '/schema-viewer.png', alt: 'Drawper schema viewer showing an ER diagram of users, posts, comments and tags with foreign keys', k: 'Schema viewer', d: 'ER diagram for any schema file.' },
]

const how = [
  { Sketch: ForeignKeySketch, t: 'Arrow in, foreign key out', d: 'Draw from one table to another. The FK column is added and flows into every generator.' },
  { Sketch: ToasterSketch, t: 'One drawing, every format', d: 'SQL, Prisma, Drizzle, TS types, relation queries and docker-compose.' },
  { Sketch: UnzipSketch, t: 'Unzip the code you have', d: 'Open any schema file and get an ER diagram, followed across imports.' },
]

const features = [
  [Phosphor, 'Opens fast', '~750 KB code-split webview.'],
  [Hub, 'Architecture panel', 'Client, API, worker, gateway, DB, cache, queue, storage.'],
  [Relay, 'Relation queries', 'SQL joins plus Drizzle and Prisma queries, both ways.'],
  [Terminal, 'Convert in the IDE', 'CodeLens, context menu or Command Palette.'],
  [Loupe, 'Whole app view', 'Every schema in the workspace on one canvas.'],
  [Rebuild, 'Renames cascade', 'Rename a table or column, every FK follows.'],
  [Riffle, 'Icons and SVG', 'Icon library, SVG import, paste SVG markup.'],
  [Branches, 'Plain .dpr JSON', 'Diffs cleanly, lives in git.'],
]

const steps = [
  ['Install', CMD],
  ['New drawing', 'Drawper: New Drawing'],
  ['Draw', 'Add components, join with Arrow (A)'],
  ['Generate', 'SQL · Prisma · Drizzle · TS · compose'],
]

function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md border-b border-line">
      <div className="mx-auto max-w-[1120px] h-12 px-4 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight text-[14.5px]">
          <img src="/logo.svg" width="24" height="24" alt="" className="rounded-[6px]" /> Drawper
        </a>
        <nav aria-label="Primary" className="hidden sm:flex items-center gap-5 text-[13px] text-mute">
          <a href="#product" className="hover:text-text transition-colors">Product</a>
          <a href="#how" className="hover:text-text transition-colors">How it works</a>
          <a href="#features" className="hover:text-text transition-colors">Features</a>
          <a href="#start" className="hover:text-text transition-colors">Start</a>
        </nav>
        <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-brand">
          GitHub <Icon name="arrow" size={13} />
        </a>
      </div>
    </header>
  )
}

function CopyCmd({ cmd = CMD, className = '' }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1400) } catch { /* noop */ }
  }
  return (
    <button onClick={copy} className={`flex items-center justify-between gap-3 w-full text-left font-mono text-[12px] card px-3 h-9 hover:border-white/25 transition-colors ${className}`}>
      <span className="truncate"><span className="text-mute">$</span> {cmd}</span>
      <Icon name={copied ? 'check' : 'copy'} size={14} className="shrink-0 text-mute" />
    </button>
  )
}

function Hero() {
  return (
    <section id="top" className="mx-auto max-w-[1120px] px-4 pt-10 sm:pt-14 pb-8 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_500px] gap-8 lg:gap-12 items-center">
      <div>
        <p className="mono-label hero-in mb-3">Drawper · VS Code extension</p>
        <h1 className="hero-in text-[clamp(2.3rem,5.4vw,3.9rem)] font-semibold tracking-[-0.04em] leading-[1.02]">
          Sketch the system.<br />Ship the <span className="text-brand-hi">schema.</span>
        </h1>
        <p className="hero-in mt-4 max-w-[460px] text-[15px] leading-relaxed text-mute">
          A fast whiteboard canvas inside VS Code. Draw architecture and database tables, get real code out.
        </p>
        <p className="hero-in mt-4 text-[13px]">
          <b className="font-semibold">7</b> <span className="text-mute">schema formats</span>
          <span className="text-mute/50 mx-2">•</span>
          <b className="font-semibold">6</b> <span className="text-mute">outputs</span>
          <span className="text-mute/50 mx-2">•</span>
          <b className="font-semibold">.dpr</b> <span className="text-mute">plain JSON</span>
        </p>
        <div className="hero-in mt-5 max-w-[460px]"><CopyCmd /></div>
        <div className="hero-in mt-3 flex gap-2">
          <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-brand">Get Drawper</a>
          <a href="#product" className="btn btn-ghost">See the canvas</a>
        </div>
      </div>
      <div className="hero-in"><DrawCanvas /></div>
    </section>
  )
}

function Reads() {
  return (
    <section className="mx-auto max-w-[1120px] px-4 pb-10 flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
      <span className="mono-label shrink-0 mr-1">Reads</span>
      {sources.map((s) => <span key={s} className="chip">{s}</span>)}
    </section>
  )
}

function Product() {
  return (
    <section id="product" className="mx-auto max-w-[1120px] px-4 pb-12">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-[19px] font-semibold tracking-tight">The canvas</h2>
        <span className="mono-label">Real screenshots</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-3 gap-3">
        <figure className="card overflow-hidden relative min-h-[240px] md:min-h-0 reveal">
          <Scene />
          <figcaption className="absolute left-3 top-2.5 mono-label">Architecture · isometric</figcaption>
        </figure>
        <figure className="card overflow-hidden md:col-span-2 reveal">
          <img src="/architecture.png" alt="Drawper architecture canvas: web-app, gateway, orders-api, database, cache, worker and queue connected by arrows" width="1500" height="800" className="w-full h-auto block" loading="lazy" decoding="async" />
          <figcaption className="flex items-center justify-between px-3 py-2 border-t border-line">
            <span className="text-[13px] font-medium">Architecture</span>
            <span className="mono-label">arrows → docker-compose</span>
          </figcaption>
        </figure>
        {shots.map((s) => (
          <figure key={s.k} className="card overflow-hidden reveal">
            <img src={s.img} alt={s.alt} width="1500" height="800" className="w-full block aspect-[16/9] object-cover object-left-top" loading="lazy" decoding="async" />
            <figcaption className="px-3 py-2 border-t border-line">
              <span className="text-[13px] font-medium">{s.k}</span>
              <span className="block text-[12px] text-mute">{s.d}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function How() {
  return (
    <section id="how" className="mx-auto max-w-[1120px] px-4 pb-12">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-[19px] font-semibold tracking-tight">How it works</h2>
        <span className="mono-label">3 sketches</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-3 gap-3">
        {how.map(({ Sketch, t, d }, i) => (
          <article key={t} className="card reveal px-4 pt-4 pb-4 flex flex-col">
            <div className="flex items-center justify-between mono-label">
              <span>Step 0{i + 1}</span><span>of 03</span>
            </div>
            <div className="my-3"><Sketch /></div>
            <div className="border-t border-line mb-3" />
            <h3 className="text-[14.5px] font-medium">{t}</h3>
            <p className="mt-1 text-[12.5px] text-mute leading-relaxed">{d}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-[1120px] px-4 pb-12">
      <h2 className="text-[19px] font-semibold tracking-tight mb-3">Features</h2>
      <div className="figures grid grid-cols-2 lg:grid-cols-4 gap-3">
        {features.map(([Fig, t, d]) => (
          <div key={t} className="card px-3.5 pt-3 pb-3.5 reveal">
            <Fig intensity={0.6} label={t} theme="dark" className="w-full max-w-[150px] mx-auto" />
            <h3 className="mt-2.5 text-[13.5px] font-medium">{t}</h3>
            <p className="mt-0.5 text-[12.5px] text-mute leading-snug">{d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Start() {
  return (
    <section id="start" className="mx-auto max-w-[1120px] px-4 pb-12">
      <h2 className="text-[19px] font-semibold tracking-tight mb-3">Start</h2>
      <ol className="grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map(([t, d], i) => (
          <li key={t} className="card px-3.5 py-3 reveal">
            <div className="mono-label">0{i + 1}</div>
            <h3 className="mt-1 text-[13.5px] font-medium">{t}</h3>
            <p className="mt-0.5 font-mono text-[11.5px] text-mute break-words">{d}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1120px] px-4 h-12 flex items-center justify-between text-[12.5px] text-mute">
        <span className="flex items-center gap-2 text-text"><img src="/logo.svg" width="20" height="20" alt="" className="rounded-[5px]" /> Drawper</span>
        <span className="flex gap-4">
          <a href={REPO} target="_blank" rel="noreferrer" className="hover:text-text transition-colors">GitHub</a>
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
      gsap.from('.hero-in', { y: 14, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06 })
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 18, opacity: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 94%', once: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root}>
      <SketchDefs />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-brand focus:text-white focus:px-3 focus:py-2 focus:rounded-md">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Reads />
        <Product />
        <How />
        <Features />
        <Start />
      </main>
      <Footer />
    </div>
  )
}
