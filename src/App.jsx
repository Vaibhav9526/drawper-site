import { useLayoutEffect, useRef } from 'react'
import Hero from './components/Hero'
import Demo from './components/Demo'
import Icon from './components/Icon'
import Words from './components/Words'
import { Clouds, Defs, Flock, Haze, Leaves } from './components/Decor'
import FooterScene from './components/FooterScene'
import { ArchitectureDrawing, Glyph, RelationsDrawing, ViewerDrawing } from './components/Drawings'
import useSmoothScroll from './smooth'
import useRepoStats from './github'
import { OPEN_VSCODE, REPO } from './links'
import { initScroll } from './fx'

const sources = ['Prisma', 'SQL', 'Drizzle', 'TypeORM', 'SQLAlchemy', 'Django', 'Mongoose']

const shots = [
  { Art: ArchitectureDrawing, k: 'Architecture canvas', d: 'Drop clients, APIs, workers, queues and databases. Arrows become dependencies, then a docker-compose.yml.' },
  { Art: RelationsDrawing, k: 'Relations by arrow', d: 'Draw an arrow from one table to another and the foreign key column is added for you.' },
  { Art: ViewerDrawing, k: 'Schema viewer', d: 'Open any schema file and see an ER diagram, followed across imports.' },
]

const features = [
  ['Opens fast', 'About 750 KB up front. It only activates when you use it.', 'pill'],
  ['Architecture panel', 'Client, API, worker, gateway, DB, cache, queue, storage. Arrows become dependencies.', 'box'],
  ['Relations by arrow', 'Join two tables and the foreign key is created, then flows into every generator.', 'bolt'],
  ['Code generation', 'SQL, Prisma, Drizzle with relations(), TS types and docker-compose with a Node scaffold per service.', 'braces'],
  ['Relation queries', 'One click writes SQL joins plus Drizzle and Prisma queries for every relation.', 'card'],
  ['Convert in the IDE', 'CodeLens, context menu or Command Palette. No canvas needed.', 'pill'],
  ['Schema viewer', 'Follows foreign keys across files. A Whole app toggle shows every schema.', 'box'],
  ['Draw on your code', 'Pens, arrows and notes on top of a live copy of your source file.', 'bolt'],
  ['Five panel themes', 'Blue, Yellow, Mint, Coral or Violet. Drawings stay plain .dpr JSON in git.', 'braces'],
]

const steps = [
  ['Install', 'Add Drawper from the VS Code Marketplace'],
  ['New drawing', 'Run Drawper: New Drawing'],
  ['Draw', 'Add components, join with the Arrow tool (A)'],
  ['Generate', 'SQL · Prisma · Drizzle · TS · compose'],
]

const H2 = 'text-[clamp(1.9rem,4vw,2.8rem)] font-semibold tracking-[-0.035em] leading-[1.05]'

function Nav() {
  const { stars, forks, version } = useRepoStats()
  const pill = 'hidden md:inline-flex items-center h-8 rounded-full border border-white/70 bg-white/55 backdrop-blur-md text-[12.5px] text-ink/80 hover:bg-white/80 transition-colors overflow-hidden'
  return (
    <header className="sticky top-0 z-50 h-14 bg-white/25 backdrop-blur-xl backdrop-saturate-150 border-b border-white/50 shadow-[0_1px_0_rgb(13_27_62/0.05)]">
      <div className="mx-auto max-w-[1120px] h-14 px-4 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight text-[15px]">
          <img src="/logo.svg" width="28" height="28" alt="" className="rounded-[8px]" /> <span className="font-display text-[19px] font-semibold tracking-[-0.03em]">Drawper</span>
        </a>
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-6 text-[13.5px] text-ink/70">
          <a href="#demo" className="hover:text-ink transition-colors">Demo</a>
          <a href="#product" className="hover:text-ink transition-colors">Drawings</a>
          <a href="#features" className="hover:text-ink transition-colors">Features</a>
          <a href="#start" className="hover:text-ink transition-colors">Start</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href={REPO} target="_blank" rel="noreferrer" className={pill} aria-label={`Star Drawper on GitHub, ${stars} stars`}>
            <span className="inline-flex items-center gap-1.5 px-3"><Icon name="star" size={13} /> Star</span>
            <span className="px-2.5 h-full grid place-items-center border-l border-white/70 bg-white/55 font-medium tabular-nums">{stars}</span>
          </a>
          <a href={`${REPO}/fork`} target="_blank" rel="noreferrer" className={pill} aria-label={`Fork Drawper, ${forks} forks`}>
            <span className="inline-flex items-center gap-1.5 px-3"><Icon name="fork" size={13} /> Fork</span>
            <span className="px-2.5 h-full grid place-items-center border-l border-white/70 bg-white/55 font-medium tabular-nums">{forks}</span>
          </a>
          <span className="hidden xl:inline-flex items-center h-8 px-3 rounded-full border border-white/70 bg-white/55 backdrop-blur-md font-mono text-[12px] text-ink/70">v{version}</span>
          <a href={OPEN_VSCODE} className="btn btn-brand btn-sm">Install</a>
        </div>
      </div>
    </header>
  )
}

function Reads() {
  return (
    <section aria-label="Schema sources it reads" className="relative z-10 overflow-hidden py-5 -mt-1">
      <div data-marquee className="flex w-max items-center gap-2.5 will-change-transform">
        {[...sources, ...sources, ...sources, ...sources].map((s, i) => (
          <span key={i} className="shrink-0 text-[14px] font-medium px-5 py-2 rounded-full border border-white/80 bg-white/70 backdrop-blur-md text-ink/75">{s}</span>
        ))}
      </div>
    </section>
  )
}

function Product() {
  return (
    <section id="product" data-gallery className="relative z-10 lg:min-h-[calc(100svh-56px)] flex flex-col justify-center py-20 lg:py-10">
      <div className="mx-auto w-full max-w-[1120px] px-4">
        <p className="mono-label">Drawn, not screenshotted</p>
        <Words as="h2" className={`mt-2 ${H2}`}>Draw it. Link it. Ship it.</Words>
        <p className="mt-3 max-w-[560px] text-[16px] leading-relaxed text-ink/70">Sketches of what you get inside VS Code: the canvas, the arrow, the viewer.</p>
      </div>
      <div className="mt-8 overflow-hidden lg:overflow-visible">
        <div data-track className="flex flex-col lg:flex-row gap-6 px-4 lg:pl-[max(1rem,calc((100vw-1120px)/2+1rem))] lg:pr-10 lg:w-max will-change-transform">
          {shots.map((s) => (
            <figure key={s.k} data-slide className="card overflow-hidden lg:w-[min(78vw,880px)] shrink-0 shadow-[0_40px_70px_-45px_rgb(13_27_62/0.5)]">
              <s.Art />
              <figcaption className="px-5 py-4 border-t border-line flex flex-wrap items-baseline gap-x-3">
                <span className="font-display text-[18px] font-semibold tracking-[-0.02em]">{s.k}</span>
                <span className="text-[14px] text-ink/65">{s.d}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-[1120px] px-4 pt-24">
      <Words as="h2" className={H2}>Everything on the canvas, and then some.</Words>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(([t, d, g], i) => (
          <div key={t} data-parallax={i % 3 === 1 ? 0.45 : i % 3 === 2 ? 0.22 : 0}>
            <div data-reveal className="card p-5 h-full hover:-translate-y-1 hover:shadow-[0_22px_34px_-24px_rgb(13_27_62/0.55)] transition-[transform,box-shadow]">
              <Glyph kind={g} />
              <h3 className="mt-4 text-[18px] font-semibold tracking-[-0.02em]">{t}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink/65">{d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Start() {
  return (
    <section id="start" className="relative z-10 mx-auto max-w-[1120px] px-4 pt-24 pb-10">
      <div data-reveal className="card p-6 sm:p-10 relative overflow-hidden">
        <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full bg-sun/40 blur-3xl" />
        <Words as="h2" className={`relative ${H2}`}>Start sketching.</Words>
        <p className="relative mt-3 max-w-[480px] text-[16px] text-ink/70">Add the extension from the Marketplace, open a drawing, and the first schema is a few boxes away.</p>
        <ol className="relative mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-xl bg-white/70 px-4 py-3.5 border border-white/80">
              <span className="mono-label">0{i + 1}</span>
              <h3 className="mt-1 text-[14.5px] font-semibold">{t}</h3>
              <p className="mt-0.5 font-mono text-[11.5px] text-mute break-words">{d}</p>
            </li>
          ))}
        </ol>
        <div className="relative mt-8 flex flex-wrap gap-2.5">
          <a href={OPEN_VSCODE} className="btn btn-brand">Add to VS Code</a>
          <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-paper">View on GitHub <Icon name="out" size={14} /></a>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  useSmoothScroll()
  const root = useRef(null)
  useLayoutEffect(() => initScroll(root.current), [])

  return (
    <div ref={root} className="relative overflow-x-clip">
      <Defs />
      <Clouds />
      <Flock />
      <Leaves />
      <Haze />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-brand focus:text-white focus:px-3 focus:py-2 focus:rounded-md">Skip to content</a>
      <Nav />
      <main id="main" className="-mt-14">
        <Hero />
        <Reads />
        <Demo />
        <Product />
        <Features />
        <Start />
      </main>
      <FooterScene />
    </div>
  )
}
