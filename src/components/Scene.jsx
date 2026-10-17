import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Drawper's architecture canvas as an isometric line drawing: flat plates,
// hairline edges, one yellow plate. Same projection family as the figures below.
const PAPER = 0x0b0b0e
const PAPER_SIDE = 0x000000
const INK = 0xd9d5e0
const SUN = 0x005fff
const SUN_SIDE = 0x0040b0

const W = 2.4, T = 0.34, D = 1.1

const NODES = [
  { name: 'web-app', sub: 'CLIENT · Next.js', p: [-4.8, 0] },
  { name: 'gateway', sub: 'GATEWAY · Kong', p: [-1.6, 0] },
  { name: 'orders-api', sub: 'API · Node', p: [1.6, 0], accent: true },
  { name: 'orders-db', sub: 'DB · postgres', p: [4.8, -2.4], pale: true },
  { name: 'cache', sub: 'CACHE · redis', p: [4.8, 0] },
  { name: 'mailer', sub: 'WORKER', p: [1.6, 2.4] },
  { name: 'jobs', sub: 'QUEUE · rabbitmq', p: [4.8, 2.4] },
]
const LINKS = [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5], [5, 6]]

function labelTexture(name, sub, dark) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 448
  const g = c.getContext('2d')
  g.fillStyle = dark ? '#1a1820' : '#ecebf0'
  g.font = '500 96px "Geist Mono", monospace'
  g.fillText(name, 56, 210)
  g.globalAlpha = 0.6
  g.font = '400 54px "Geist Mono", monospace'
  g.fillText(sub, 56, 312)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

export default function Scene() {
  const wrap = useRef(null)

  useEffect(() => {
    const el = wrap.current
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-10, 10, 6, -6, 0.1, 100)
    camera.position.set(-10, 10, 10)
    camera.lookAt(0, 0, 0)

    const group = new THREE.Group()
    scene.add(group)

    const disposables = []
    const boxGeo = new THREE.BoxGeometry(W, T, D)
    const edgeGeo = new THREE.EdgesGeometry(boxGeo)
    const labelGeo = new THREE.PlaneGeometry(W * 0.94, W * 0.94 * (448 / 1024))
    const edgeMat = new THREE.LineBasicMaterial({ color: INK })
    disposables.push(boxGeo, edgeGeo, labelGeo, edgeMat)

    const plates = NODES.map((n) => {
      const top = n.pale ? 0xe9e6ee : n.accent ? SUN : PAPER
      const side = n.pale ? 0x8f8b9a : n.accent ? SUN_SIDE : PAPER_SIDE
      const sideM = new THREE.MeshBasicMaterial({ color: side })
      const topM = new THREE.MeshBasicMaterial({ color: top })
      // BoxGeometry face order: +x, -x, +y, -y, +z, -z
      const m = new THREE.Mesh(boxGeo, [sideM, sideM, topM, sideM, sideM, sideM])
      m.position.set(n.p[0], 0, n.p[1])
      m.add(new THREE.LineSegments(edgeGeo, edgeMat))
      group.add(m)
      disposables.push(sideM, topM)
      return m
    })

    let dead = false
    document.fonts.load('500 40px "Geist Mono"').finally(() => {
      if (dead) return
      NODES.forEach((n, i) => {
        const tex = labelTexture(n.name, n.sub, n.pale)
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false })
        const plane = new THREE.Mesh(labelGeo, mat)
        plane.rotation.x = -Math.PI / 2
        plane.position.set(0, T / 2 + 0.004, 0)
        plates[i].add(plane)
        disposables.push(tex, mat)
      })
    })

    // links as ground lines with open arrowheads; packets ride them
    const linkPts = []
    const packets = []
    const packetGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16)
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const packetEdge = new THREE.EdgesGeometry(packetGeo)
    disposables.push(packetGeo, packetMat, packetEdge)
    const y = T / 2 + 0.01

    LINKS.forEach(([a, b], k) => {
      const A = NODES[a].p, B = NODES[b].p
      const vertical = Math.abs(A[0] - B[0]) < 0.1
      let s, e
      if (vertical) {
        const dir = Math.sign(B[1] - A[1])
        s = new THREE.Vector3(A[0], y, A[1] + (dir * D) / 2)
        e = new THREE.Vector3(B[0], y, B[1] - (dir * D) / 2)
      } else {
        s = new THREE.Vector3(A[0] + W / 2, y, A[1])
        e = new THREE.Vector3(B[0] - W / 2, y, B[1])
      }
      const d = e.clone().sub(s).normalize()
      const n = new THREE.Vector3(-d.z, 0, d.x)
      const h1 = e.clone().sub(d.clone().multiplyScalar(0.28)).add(n.clone().multiplyScalar(0.14))
      const h2 = e.clone().sub(d.clone().multiplyScalar(0.28)).sub(n.clone().multiplyScalar(0.14))
      linkPts.push(s, e, e, h1, e, h2)

      const pk = new THREE.Mesh(packetGeo, packetMat)
      pk.add(new THREE.LineSegments(packetEdge, edgeMat))
      group.add(pk)
      packets.push({ mesh: pk, s, e, off: k * 0.31, speed: 0.13 + (k % 3) * 0.025 })
    })
    const linkGeo = new THREE.BufferGeometry().setFromPoints(linkPts)
    const links = new THREE.LineSegments(linkGeo, edgeMat)
    group.add(links)
    disposables.push(linkGeo)

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight
      renderer.setSize(w, h)
      const hw = 7.6
      const hh = hw * (h / w)
      camera.left = -hw
      camera.right = hw
      camera.top = hh
      camera.bottom = -hh
      camera.clearViewOffset()
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const mouse = { x: 0, y: 0 }
    const onMove = (e) => {
      mouse.x = (e.clientX / innerWidth - 0.5) * 2
      mouse.y = (e.clientY / innerHeight - 0.5) * 2
    }
    addEventListener('pointermove', onMove)

    const sc = { p: 0 }
    const st = ScrollTrigger.create({
      trigger: el.parentElement,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (s) => { sc.p = s.progress },
    })

    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(el)

    const clock = new THREE.Clock()
    let raf, ry = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible) return
      const t = reduce ? 0 : clock.getElapsedTime()
      ry += ((mouse.x * 0.1 + sc.p * 0.5) - ry) * 0.06
      group.rotation.y = ry
      plates.forEach((m, i) => { m.position.y = Math.max(0, Math.sin(t * 0.9 + i * 1.1)) * 0.07 })
      packets.forEach((pk) => {
        const u = (t * pk.speed + pk.off) % 1
        pk.mesh.position.lerpVectors(pk.s, pk.e, u)
        pk.mesh.position.y += 0.1
        pk.mesh.visible = !reduce
      })
      renderer.render(scene, camera)
    }
    loop()

    return () => {
      dead = true
      cancelAnimationFrame(raf)
      st.kill()
      io.disconnect()
      ro.disconnect()
      removeEventListener('pointermove', onMove)
      disposables.forEach((d) => d.dispose && d.dispose())
      renderer.dispose()
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={wrap} className="relative h-[340px] sm:h-[440px] lg:h-auto lg:absolute lg:inset-0" aria-hidden="true" />
}
