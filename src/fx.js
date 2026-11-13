import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

// Every scroll movement on the page. Components only mark elements with data-* attributes:
//   data-hero / data-hero-art / data-hero-copy   hero parallax
//   data-words                                   headings that rise word by word
//   data-reveal                                  cards that swing in
//   data-parallax="0.3"                          drifts against the scroll
//   data-tilt                                    a window that tips up into place
//   data-easel / data-board / data-legs          drawing boards that fall onto their legs
//   data-marquee                                 strip that skews with scroll speed
//   data-cloud / data-bird / data-leaf           sky decor
//   data-meadow + data-girl                      the walk at the end
export function initScroll(root) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const q = (s) => [...root.querySelectorAll(s)]
  if (reduce) return () => {}

  let stop = () => {}
  const ctx = gsap.context(() => {
    const page = { trigger: root, start: 'top top', end: 'bottom bottom', scrub: true }

    // ---- hero: the picture zooms and sinks, the copy lifts away
    const hero = root.querySelector('[data-hero]')
    if (hero) {
      gsap.to('[data-hero-art]', { scale: 1.2, yPercent: 7, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('[data-hero-copy]', { y: -150, opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: '15% top', end: '85% top', scrub: true } })
    }

    // ---- headings rise word by word with a little swing
    q('[data-words]').forEach((h) => {
      gsap.from(h.querySelectorAll('[data-w]'), {
        yPercent: 120, rotate: 7, duration: 0.8, stagger: 0.045, ease: 'power4.out',
        scrollTrigger: { trigger: h, start: 'top 88%', once: true },
      })
    })

    // ---- cards swing in from alternating sides
    const cards = q('[data-reveal]')
    gsap.set(cards, { opacity: 0 })
    ScrollTrigger.batch(cards, {
      start: 'top 92%',
      once: true,
      onEnter: (els) => gsap.fromTo(els,
        { y: 90, opacity: 0, rotate: (i) => (i % 2 ? 4 : -4), scale: 0.92 },
        { y: 0, opacity: 1, rotate: 0, scale: 1, duration: 0.95, stagger: 0.09, ease: 'power3.out' }),
    })

    // ---- things that drift against the scroll
    q('[data-parallax]').forEach((el) => {
      const s = parseFloat(el.dataset.parallax) || 0.2
      gsap.fromTo(el, { y: 120 * s }, { y: -120 * s, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
    })

    // ---- the demo window tips up like a laptop lid
    q('[data-tilt]').forEach((el) => {
      gsap.fromTo(el, { rotateX: 22, scale: 0.88, y: 40, transformPerspective: 1300, transformOrigin: '50% 100%' },
        { rotateX: 0, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 100%', end: 'top 45%', scrub: 0.6 } })
    })

    // ---- each drawing board falls from above onto its legs
    q('[data-easel]').forEach((e, i) => {
      const board = e.querySelector('[data-board]')
      gsap.fromTo(board,
        { y: -300, rotate: i % 2 ? 11 : -11, transformOrigin: i % 2 ? '100% 100%' : '0% 100%' },
        { y: 0, rotate: i % 2 ? 0.8 : -0.8, ease: 'power2.in', scrollTrigger: { trigger: e, start: 'top 98%', end: 'top 38%', scrub: 0.5 } })
      gsap.fromTo(board, { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: e, start: 'top 98%', end: 'top 72%', scrub: true } })
      gsap.fromTo(e, { y: 0, opacity: 1, scale: 1 }, { y: 140, opacity: 0, scale: 0.94, ease: 'power1.in', immediateRender: false, scrollTrigger: { trigger: e, start: 'bottom 58%', end: 'bottom 12%', scrub: true } })
      gsap.fromTo(e.querySelector('[data-legs]'), { scaleY: 0.92, transformOrigin: '50% 0%' }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: e, start: 'top 60%', end: 'top 36%', scrub: true } })
    })

    // ---- marquee that skews with scroll speed
    q('[data-marquee]').forEach((m) => {
      const loop = gsap.to(m, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 })
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: (self) => {
          const v = self.getVelocity()
          gsap.to(m, { skewX: clamp(v / -90, -16, 16), duration: 0.25, overwrite: 'auto' })
          loop.timeScale(1 + Math.min(Math.abs(v) / 350, 7) * (v < 0 ? -1 : 1))
        },
      })
      ScrollTrigger.addEventListener('scrollEnd', () => { gsap.to(m, { skewX: 0, duration: 0.5 }); gsap.to(loop, { timeScale: 1, duration: 0.8 }) })
    })

    // ---- clouds drift across and slower than the page
    q('[data-cloud]').forEach((c) => {
      const s = parseFloat(c.dataset.cloud)
      gsap.to(c, { y: () => -s * (root.scrollHeight - innerHeight), x: Number(c.dataset.dir) * 160, ease: 'none', scrollTrigger: { ...page, scrub: 0.8, invalidateOnRefresh: true } })
    })

    // ---- a flock flies across in a loose V: flap bursts with glides, banking with the path
    const birds = q('[data-bird]')
    birds.forEach((b, i) => {
      const wl = b.querySelector('[data-wl]')
      const wr = b.querySelector('[data-wr]')
      gsap.set(wl, { svgOrigin: '30 18' })
      gsap.set(wr, { svgOrigin: '34 18' })
      const beat = gsap.timeline({ repeat: -1, delay: i * 0.17 })
      const up = 0.17 + (i % 3) * 0.02
      for (let n = 0; n < 4; n++) {
        beat.to(wl, { rotation: -38, duration: up, ease: 'sine.out' }, '>').to(wr, { rotation: 38, duration: up, ease: 'sine.out' }, '<')
        beat.to(wl, { rotation: 16, duration: up * 1.15, ease: 'sine.inOut' }, '>').to(wr, { rotation: -16, duration: up * 1.15, ease: 'sine.inOut' }, '<')
      }
      beat.to(wl, { rotation: -6, duration: 0.5, ease: 'sine.inOut' }, '>').to(wr, { rotation: 6, duration: 0.5, ease: 'sine.inOut' }, '<')
      beat.to({}, { duration: 0.9 + (i % 3) * 0.25 })
    })
    const flight = { scroll: 0 }
    ScrollTrigger.create({ trigger: root, start: 'top top', end: 'bottom bottom', onUpdate: (self) => { flight.scroll = self.progress } })
    const place = birds.map((b) => ({ x: gsap.quickSetter(b, 'x', 'px'), y: gsap.quickSetter(b, 'y', 'px'), r: gsap.quickSetter(b, 'rotation', 'deg') }))
    const fly = () => {
      const t = gsap.ticker.time
      const w = innerWidth + 260
      // the flock drifts on its own and is pushed along when you scroll
      const lead = (t * 0.018 + flight.scroll * 2.6) % 1
      const path = (p) => innerHeight * 0.2 + Math.sin(p * 6.2) * innerHeight * 0.07 + p * innerHeight * 0.12
      birds.forEach((_, i) => {
        const rank = Math.ceil(i / 2)
        const side = i % 2 ? 1 : -1
        const p = (lead - rank * 0.014 + 1) % 1
        const x = p * w - 130
        const bob = Math.sin(t * 1.6 + i * 1.7) * 7
        place[i].x(x)
        place[i].y(path(p) + side * rank * 15 + bob)
        place[i].r(Math.cos(p * 6.2) * 7 + Math.sin(t * 1.6 + i * 1.7) * 3)
      })
    }
    gsap.ticker.add(fly)
    stop = () => gsap.ticker.remove(fly)

    // ---- a few leaves drift down slowly and sway
    q('[data-leaf]').forEach((l, i) => {
      gsap.set(l, { x: (i / 5) * innerWidth + 60, y: -60 })
      gsap.to(l, { y: innerHeight + 80, duration: 20 + (i % 3) * 6, delay: -i * 5, repeat: -1, ease: 'none' })
      gsap.to(l, { x: `+=${70 + (i % 3) * 30}`, rotation: 26, duration: 6 + (i % 3) * 1.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    })

    // ---- the day turns: warm haze in, leaves go golden
    const turn = { trigger: root, start: '48% top', end: 'bottom bottom', scrub: true }
    gsap.to('[data-haze]', { opacity: 1, ease: 'none', scrollTrigger: turn })
    gsap.to('[data-leaves]', { filter: 'hue-rotate(-58deg) saturate(1.5)', ease: 'none', scrollTrigger: turn })

    // ---- the evening picture settles as you reach the end
    const foot = root.querySelector('[data-foot]')
    if (foot) {
      gsap.fromTo('[data-foot-art]', { scale: 1.14, yPercent: 6, transformOrigin: '50% 100%' }, { scale: 1, yPercent: 0, ease: 'none', scrollTrigger: { trigger: foot, start: 'top bottom', end: 'bottom bottom', scrub: true } })
    }
  }, root)

  const refresh = () => ScrollTrigger.refresh()
  window.addEventListener('load', refresh)
  document.fonts?.ready.then(refresh)
  return () => { window.removeEventListener('load', refresh); stop(); ctx.revert() }
}
