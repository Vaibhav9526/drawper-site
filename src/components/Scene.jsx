import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const INK = 0x2e2936
const W = 2.3, H = 1.05, D = 0.5

// the same architecture Drawper's canvas shows, as physical objects
const NODES = [
{ name: 'web-app', sub: 'CLIENT · Next.js', color: 0xfffdf8, p: [-4.6, 0, 0.2] },  { name: 'gateway', sub: 'GATEWAY · Kong', color: 0xfffdf8, p: [-1.55, 0, 0.5] },  { name: 'orders-api', sub: 'API · Node', color: 0xffd900, p: [1.5, 0, 0] },  { name: 'orders-db', sub: 'DB · postgres', color: 0x2e2936, dark: true, p: [4.4, 1.75, -0.5] },  { name: 'cache', sub: 'CACHE · redis', color: 0xfffdf8, p: [4.4, 0, 0.3] },  { name: 'mailer', sub: 'WORKER', color: 0xfffdf8, p: [1.5, -1.9, 0.5] },  { name: 'jobs', sub: 'QUEUE · rabbitmq', color: 0xfffdf8, p: [4.4, -1.9, -0.2] },
]
const LINKS = [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5], [5, 6]]

function labelTexture(name, sub, dark) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 460
  const g = c.getContext('2d')
  g.fillStyle = dark ? '#f6f3ea' : '#2e2936'
  g.textBaseline = 'alphabetic'
  g.font = '500 92px "Geist Mono", monospace'
  g.fillText(name, 64, 235)
  g.globalAlpha = 0.62
  g.font = '400 52px "Geist Mono", monospace'
  g.fillText(sub, 64, 330)
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
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd9d2c0, 1.35))
    const sun = new THREE.DirectionalLight(0xffffff, 2.2)
    sun.position.set(-5, 9, 8)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.left = -9
    sun.shadow.camera.right = 9
    sun.shadow.camera.top = 9
    sun.shadow.camera.bottom = -9
    sun.shadow.radius = 6
    sun.shadow.bias = -0.0004
    scene.add(sun)

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.2 }))
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -3.0
    floor.receiveShadow = true
    scene.add(floor)

    const group = new THREE.Group()
    scene.add(group)

    const disposables = []
    const boxGeo = new RoundedBoxGeometry(W, H, D, 4, 0.07)
    const labelGeo = new THREE.PlaneGeometry(W * 0.94, W * 0.94 * (460 / 1024))
    disposables.push(boxGeo, labelGeo)

    const meshes = NODES.map((n) => {
      const m = new THREE.Mesh(boxGeo, new THREE.MeshStandardMaterial({ color: n.color, roughness: 0.8, metalness: 0 }))
      m.position.set(...n.p)
      m.castShadow = true
      group.add(m)
      disposables.push(m.material)
      return m
    })

    // labels once the mono font is available
    let dead = false
    document.fonts.load('500 40px "Geist Mono"').finally(() => {
      if (dead) return
      NODES.forEach((n, i) => {
        const tex = labelTexture(n.name, n.sub, n.dark)
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false })
        const plane = new THREE.Mesh(labelGeo, mat)
        plane.position.set(0, 0, D / 2 + 0.012)
        meshes[i].add(plane)
        disposables.push(tex, mat)
      })
    })

    // links: tubes + cone heads + travelling packets
    const lineMat = new THREE.MeshBasicMaterial({ color: INK })
    const coneGeo = new THREE.ConeGeometry(0.1, 0.26, 20)
    const packetGeo = new THREE.SphereGeometry(0.085, 20, 20)
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xffd900 })
    disposables.push(lineMat, coneGeo, packetGeo, packetMat)
    const up = new THREE.Vector3(0, 1, 0)
    const packets = []

    LINKS.forEach(([a, b], k) => {
      const A = new THREE.Vector3(...NODES[a].p)
      const B = new THREE.Vector3(...NODES[b].p)
      const dir = B.clone().sub(A)
      const vertical = Math.abs(dir.x) < 0.5
      // start at the facing edges
      const start = vertical ? A.clone().add(new THREE.Vector3(0, dir.y < 0 ? -H / 2 : H / 2, 0)) : A.clone().add(new THREE.Vector3(W / 2, 0, 0))
      const end = vertical ? B.clone().add(new THREE.Vector3(0, dir.y < 0 ? H / 2 : -H / 2, 0)) : B.clone().add(new THREE.Vector3(-W / 2, 0, 0))
      const d = end.clone().sub(start)
      const len = d.length()
      const n = d.clone().normalize()
      const tubeEnd = end.clone().sub(n.clone().multiplyScalar(0.2))
      const curve = new THREE.LineCurve3(start, tubeEnd)
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 2, 0.014, 8, false), lineMat)
      const cone = new THREE.Mesh(coneGeo, lineMat)
      cone.position.copy(end.clone().sub(n.clone().multiplyScalar(0.13)))
      cone.quaternion.setFromUnitVectors(up, n)
      group.add(tube, cone)
      disposables.push(tube.geometry)
      const packet = new THREE.Mesh(packetGeo, packetMat)
      group.add(packet)
      packets.push({ mesh: packet, start, end: tubeEnd, off: k * 0.37, speed: 0.16 + (k % 3) * 0.03, len })
    })

    // ---- sizing
    let narrow = false
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      narrow = w < 1024
      camera.position.set(0, 0.6, narrow ? 20 : 19.5)
      camera.lookAt(0, 0, 0)
      camera.setViewOffset(w, h, narrow ? 0 : -w * 0.13, 0, w, h)
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
    let raf, ry = -0.5, rx = 0.18, py = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible) return
      const t = reduce ? 0 : clock.getElapsedTime()
      const ty = -0.5 + mouse.x * 0.16 + sc.p * 1.1
      const tx = 0.18 + mouse.y * 0.07 + sc.p * 0.25
      ry += (ty - ry) * 0.06
      rx += (tx - rx) * 0.06
      py += ((sc.p * -1.2) - py) * 0.06
      group.rotation.y = ry
      group.rotation.x = rx
      group.position.y = py + Math.sin(t * 0.8) * 0.08
      meshes.forEach((m, i) => { m.position.y = NODES[i].p[1] + Math.sin(t * 0.9 + i * 1.3) * 0.06 })
      packets.forEach((pk) => {
        const u = ((t * pk.speed + pk.off) % 1)
        pk.mesh.position.lerpVectors(pk.start, pk.end, u)
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

  return <div ref={wrap} className="relative h-[330px] sm:h-[420px] lg:h-auto lg:absolute lg:inset-0" aria-hidden="true" />
}
