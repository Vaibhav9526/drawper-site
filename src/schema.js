// Tiny version of what the extension does: tables + arrows in, schema code out.
// A table is { id, name, x, y, cols: [{ n, t, k }] }; a link { from, to } means
// "from references to", which adds a foreign key column to `from`.
export const TW = 200
const ROW = 26
const HEAD = 36
const FOOT = 30

const sing = (s) => (s.endsWith('ies') ? s.slice(0, -3) + 'y' : s.endsWith('s') ? s.slice(0, -1) : s)
const cap = (s) => s.replace(/(^|_)(\w)/g, (_m, _p, c) => c.toUpperCase())
export const clean = (s) => s.trim().toLowerCase().replace(/\W+/g, '_').replace(/^_+|_+$/g, '') || 'table'

export const height = (t) => HEAD + t.cols.length * ROW + FOOT
export const ROW_H = ROW
export const HEAD_H = HEAD

// add the FK columns that the arrows imply
export function resolve(tables, links) {
  return tables.map((t) => ({
    ...t,
    cols: [
      ...t.cols,
      ...links
        .filter((l) => l.from === t.id)
        .map((l) => {
          const to = tables.find((x) => x.id === l.to)
          return { n: `${sing(clean(to.name))}_id`, t: 'int', k: 'FK', ref: to }
        }),
    ],
  }))
}

// where the line between two box centres leaves one box and enters the other
export function edge(a, b) {
  const ca = { x: a.x + a.w / 2, y: a.y + a.h / 2 }
  const cb = { x: b.x + b.w / 2, y: b.y + b.h / 2 }
  const dx = cb.x - ca.x
  const dy = cb.y - ca.y
  const t = Math.min((a.w / 2 + 5) / (Math.abs(dx) || 1e-6), (a.h / 2 + 5) / (Math.abs(dy) || 1e-6))
  const u = Math.min((b.w / 2 + 7) / (Math.abs(dx) || 1e-6), (b.h / 2 + 7) / (Math.abs(dy) || 1e-6))
  return { x1: ca.x + dx * t, y1: ca.y + dy * t, x2: cb.x - dx * u, y2: cb.y - dy * u }
}

const EMPTY = '-- Draw a table, then join two with an arrow.'
const pad = (s, n) => s + ' '.repeat(Math.max(1, n - s.length))

export function toSQL(tables, links) {
  const all = resolve(tables, links)
  if (!all.length) return EMPTY
  const T = { int: 'INTEGER', text: 'TEXT', timestamp: 'TIMESTAMP', numeric: 'NUMERIC' }
  return all
    .map((t) => {
      const w = Math.max(...t.cols.map((c) => c.n.length)) + 2
      const lines = t.cols.map((c) =>
        `  ${pad(c.n, w)}${c.k === 'PK' ? 'SERIAL PRIMARY KEY' : T[c.t] + (c.k === 'FK' ? ' NOT NULL' : '')}`,
      )
      const fks = t.cols.filter((c) => c.k === 'FK').map((c) => `  FOREIGN KEY (${c.n}) REFERENCES ${clean(c.ref.name)} (id)`)
      return `CREATE TABLE ${clean(t.name)} (\n${[...lines, ...fks].join(',\n')}\n);`
    })
    .join('\n\n')
}

export function toPrisma(tables, links) {
  const all = resolve(tables, links)
  if (!all.length) return EMPTY.replace('--', '//')
  const T = { int: 'Int', text: 'String', timestamp: 'DateTime', numeric: 'Decimal' }
  return all
    .map((t) => {
      const rows = t.cols.map((c) => [c.n, T[c.t] + (c.k === '' && c.t === 'timestamp' ? '?' : ''), c.k === 'PK' ? '@id @default(autoincrement())' : ''])
      t.cols.filter((c) => c.k === 'FK').forEach((c) =>
        rows.push([sing(clean(c.ref.name)), cap(clean(c.ref.name)), `@relation(fields: [${c.n}], references: [id])`]))
      links.filter((l) => l.to === t.id).forEach((l) => {
        const from = tables.find((x) => x.id === l.from)
        rows.push([clean(from.name), `${cap(clean(from.name))}[]`, ''])
      })
      const a = Math.max(...rows.map((r) => r[0].length)) + 1
      const b = Math.max(...rows.map((r) => r[1].length)) + 1
      return `model ${cap(clean(t.name))} {\n${rows.map((r) => `  ${pad(r[0], a)}${r[2] ? pad(r[1], b) + r[2] : r[1]}`).join('\n')}\n}`
    })
    .join('\n\n')
}

export function toTS(tables, links) {
  const all = resolve(tables, links)
  if (!all.length) return EMPTY.replace('--', '//')
  const T = { int: 'number', text: 'string', timestamp: 'Date | null', numeric: 'number' }
  return all
    .map((t) => `export interface ${cap(sing(clean(t.name)))} {\n${t.cols.map((c) => `  ${c.n}: ${T[c.t]};`).join('\n')}\n}`)
    .join('\n\n')
}

export const FORMATS = { SQL: toSQL, Prisma: toPrisma, 'TS types': toTS }
