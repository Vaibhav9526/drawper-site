import { useState } from 'react'
import Icon from './Icons'

const files = {
  SQL: {
    name: 'schema.sql',
    code: `CREATE TABLE customers (
  id          SERIAL PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMP
);

CREATE TABLE orders (
  id           SERIAL PRIMARY KEY,
  customer_id  INTEGER NOT NULL,
  total        NUMERIC,
  created_at   TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
);`,
  },
  Prisma: {
    name: 'schema.prisma',
    code: `model customers {
  id         Int       @id @default(autoincrement())
  email      String    @unique
  created_at DateTime?
  orders     orders[]
}

model orders {
  id          Int        @id @default(autoincrement())
  customer_id Int
  total       Decimal?
  created_at  DateTime?
  customer    customers  @relation(fields: [customer_id], references: [id])
}`,
  },
  Drizzle: {
    name: 'schema.ts',
    code: `import { pgTable, serial, text, integer, numeric, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at'),
})

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').notNull().references(() => customers.id),
  total: numeric('total'),
  createdAt: timestamp('created_at'),
})

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
}))`,
  },
  'TS types': {
    name: 'types.ts',
    code: `export interface Customers {
  id: number
  email: string
  created_at: Date | null
}

export interface Orders {
  id: number
  customer_id: number
  total: string | null
  created_at: Date | null
}`,
  },
}

const KW = /\b(CREATE|TABLE|PRIMARY|KEY|NOT|NULL|UNIQUE|FOREIGN|REFERENCES|model|import|from|export|const|interface|one|relations)\b/g
const TY = /\b(SERIAL|INTEGER|TEXT|TIMESTAMP|NUMERIC|Int|String|DateTime|Decimal|number|string|Date|serial|text|integer|numeric|timestamp|pgTable)\b/g

// content is our own static strings, escaped before any markup is added
function highlight(line) {
  const esc = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return esc
    .split(/('[^']*')/g)
    .map((p, i) => {
      if (i % 2) return `<span style="color:#2a7a66">${p}</span>`
      return p
        .replace(KW, '<span style="font-weight:600">$1</span>')
        .replace(TY, '<span style="color:#8a6a00">$1</span>')
        .replace(/(@\w+)/g, '<span style="color:#8a6a00">$1</span>')
    })
    .join('')
}

const ink = '#2e2936'
const mute = '#8b8594'

function Table({ x, y, name, rows }) {
    return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="220" height="124" fill="#fbf9f3" stroke={ink} strokeWidth="1" />
      <path d="M0 34H220" stroke={ink} strokeWidth="1" />
      <text x="14" y="22" fill={ink} fontWeight="500">{name}</text>
      {rows.map(([n, t, k], i) => (
        <g key={n} transform={`translate(0 ${58 + i * 24})`}>
          <text x="14" fill={ink}>{n}</text>
          <text x="124" fill={mute}>{t}</text>
          {k && <text x="206" textAnchor="end" fill={ink} fontWeight="500">{k}</text>}
        </g>
      ))}
    </g>
  )
}

function Canvas() {
  // miniature of Drawper's table nodes. The arrow starts at the table that holds the key.
  return (
    <svg viewBox="0 0 560 360" className="w-full h-auto block" role="img" aria-label="An arrow from the orders table to the customers table">
      <defs>
        <pattern id="g" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke="rgb(46 41 54 / .07)" />
        </pattern>
        <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
          <path d="M1 1L9 5L1 9" fill="none" stroke={ink} strokeWidth="1" />
        </marker>
      </defs>
      <rect width="560" height="360" fill="url(#g)" />
      <g fontFamily="Geist Mono, monospace" fontSize="13">
        <Table x={300} y={28} name="customers" rows={[['id', 'int', 'PK'], ['email', 'text'], ['created_at', 'timestamp']]} />
        <Table x={40} y={208} name="orders" rows={[['id', 'int', 'PK'], ['customer_id', 'int', 'FK'], ['total', 'numeric']]} />
      </g>
      <path className="draw-arrow" d="M260 270 C 330 270, 410 250, 410 154" fill="none" stroke={ink} strokeWidth="1.2" markerEnd="url(#ah)" />
      <circle cx="260" cy="270" r="3.5" fill="#ffd900" stroke={ink} strokeWidth="1" />
    </svg>
  )
}

export default function CodeSection() {
  const [tab, setTab] = useState('SQL')
  const [copied, setCopied] = useState(false)
  const f = files[tab]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(f.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <section id="codegen" className="hl-b">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 py-20 lg:py-32">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <p className="eyebrow reveal mb-5">03 — Code generation</p>
          <h2 className="display reveal text-[clamp(2.5rem,5.5vw,5rem)]">
            Draw an arrow.<br /><b>Get a foreign key.</b>
          </h2>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 hl-all reveal">
          <div className="ticks flex items-center bg-paper-2 border-line border-b lg:border-b-0 lg:border-r p-4 sm:p-8">
            <Canvas />
          </div>

          <div className="flex flex-col min-h-[420px] bg-[#fbf9f3]">
            <div className="flex items-stretch justify-between hl-b">
              <div className="flex" role="tablist">
                {Object.keys(files).map((k) => (
                  <button
                    key={k}
                    role="tab"
                    aria-selected={tab === k}
                    onClick={() => setTab(k)}
                    className={`px-4 h-11 text-[13px] font-mono -mb-px border-b transition-colors ${tab === k ? 'border-ink text-ink' : 'border-transparent text-mute hover:text-ink'}`}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <button onClick={copy} aria-label="Copy code" className="px-4 flex items-center gap-2 eyebrow hover:!text-ink transition-colors">
                <Icon name={copied ? 'check' : 'copy'} size={15} />
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="px-5 pt-4 eyebrow">{f.name}</div>
            <pre className="code-scroll flex-1 overflow-auto px-5 pb-6 pt-3 text-[13px] leading-[1.8] font-mono text-ink">
              <code dangerouslySetInnerHTML={{ __html: f.code.split('\n').map(highlight).join('\n') }} />
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
