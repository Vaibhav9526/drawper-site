import { useEffect, useState } from 'react'

// Live numbers from the public GitHub repo for the navbar. Falls back quietly (and keeps a
// 10 minute copy in sessionStorage) so the page never waits on, or breaks without, the API.
const API = 'https://api.github.com/repos/Vaibhav9526/Drawper'
const PKG = 'https://raw.githubusercontent.com/Vaibhav9526/Drawper/main/package.json'
const KEY = 'drawper-gh'
const FALLBACK = { stars: 0, forks: 1, version: '0.1.0' }

export default function useRepoStats() {
  const [s, setS] = useState(() => {
    try {
      const c = JSON.parse(sessionStorage.getItem(KEY))
      if (c && Date.now() - c.at < 600000) return c.v
    } catch { /* no storage */ }
    return FALLBACK
  })

  useEffect(() => {
    let dead = false
    try {
      const c = JSON.parse(sessionStorage.getItem(KEY))
      if (c && Date.now() - c.at < 600000) return
    } catch { /* no storage */ }
    Promise.all([
      fetch(API).then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch(PKG).then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
    ]).then(([repo, pkg]) => {
      if (dead) return
      const v = { stars: repo.stargazers_count ?? 0, forks: repo.forks_count ?? 0, version: pkg.version || FALLBACK.version }
      setS(v)
      try { sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), v })) } catch { /* no storage */ }
    }).catch(() => {})
    return () => { dead = true }
  }, [])

  return s
}
