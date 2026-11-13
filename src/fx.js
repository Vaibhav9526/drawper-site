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
//   data-sheet (+ data-pop / data-stroke / data-write)  sketches that ink themselves in
//   data-marquee                                 strip that skews with scroll speed
//   data-cloud / data-leaf                       sky decor
//   data-meadow + data-girl                      the walk at the end
export function initScroll(root) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const q = (s) => [...root.querySelectorAll(s)]
  if (reduce) return () => {}

  const undo = []
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

    // ---- each sketch inks itself in as you scroll: boxes pop, arrows draw, notes appear
    q('[data-sheet]').forEach((sheet) => {
      const svg = sheet.querySelector('svg')
      const pops = [...svg.querySelectorAll('[data-pop]')]
      const notes = [...svg.querySelectorAll('[data-write]')]
      const strokes = [...svg.querySelectorAll('[data-stroke]')]
      gsap.set(pops, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' })
      gsap.set(notes, { opacity: 0 })
      const heads = strokes.map((p) => {
        const len = p.getTotalLength()
        p.style.strokeDasharray = len
        p.style.strokeDashoffset = len
        p.removeAttribute('marker-end')
        const end = p.getPointAtLength(len)
        const pre = p.getPointAtLength(Math.max(0, len - 6))
        const head = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        head.setAttribute('d', 'M-10 -5.500 L0 0 L-10 5.500')
        head.setAttribute('fill', 'none')
        head.setAttribute('stroke', p.getAttribute('stroke') || '#0d1b3e')
        head.setAttribute('stroke-width', p.getAttribute('stroke-width') || '2.4')
        head.setAttribute('stroke-linecap', 'round')
        head.setAttribute('stroke-linejoin', 'round')
        head.setAttribute('transform', `translate(${end.x} ${end.y}) rotate(${(Math.atan2(end.y - pre.y, end.x - pre.x) * 180) / Math.PI})`)
        head.style.opacity = 0
        p.after(head)
        undo.push(() => { head.remove(); p.style.strokeDasharray = ''; p.style.strokeDashoffset = '' })
        return head
      })
      const tl = gsap.timeline({ scrollTrigger: { trigger: sheet, start: 'top 80%', once: true } })
      tl.to(pops, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.6)' })
      strokes.forEach((p, i) => {
        const at = 0.55 + i * 0.16
        tl.to(p, { strokeDashoffset: 0, duration: 0.55, ease: 'none' }, at)
        tl.to(heads[i], { opacity: 1, duration: 0.05 }, at + 0.52)
      })
      tl.to(notes, { opacity: 1, duration: 0.4, stagger: 0.18 }, 0.9)
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

  }, root)

  const refresh = () => ScrollTrigger.refresh()
  window.addEventListener('load', refresh)
  document.fonts?.ready.then(refresh)
  return () => { window.removeEventListener('load', refresh); ctx.revert(); undo.forEach((fn) => fn()) }
}
