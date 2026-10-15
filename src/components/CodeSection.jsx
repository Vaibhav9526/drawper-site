import { useState } from 'react'

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

function highlight(line) {
  const esc = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const parts = esc.split(/('[^']*')/g)
  return parts
    .map((p, i) => {
      if (i % 2) return `<span style="color:#87dac7">${p}</span>`
      return p
        .replace(KW, '<span style="color:#ec7b78">$1</span>')
        .replace(TY, '<span style="color:#ffd900">$1</span>')
        .replace(/(@\w+)/g, '<span style="color:#eaaa2a">$1</span>')
    })
    .join('')
}

function Canvas() {
  // miniature of Drawper's table nodes. The arrow starts at the table that holds the key.
  return (
    <svg viewBox="0 0 560 360" className="w-full h-auto" role="img" aria-label="An arrow from the orders table to the customers table">
      <defs>
        <pattern id="g" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke="rgb(255 255 255 / .05)" />
        </pattern>
        <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M1 1L9 5L1 9" fill="none" stroke="#ece8dd" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      <rect width="560" height="360" fill="url(#g)" />

      <g fontFamily="Geist Mono, monospace" fontSize="13">
        <g transform="translate(300 30)">
          <rect width="220" height="128" rx="14" fill="#1a1710" stroke="#d9d4c6" strokeWidth="1.5" />
          <path d="M0 14a14 14 0 0 1 14-14h192a14 14 0 0 1 14 14v22H0z" fill="#5c3d00" />
          <text x="110" y="24" textAnchor="middle" fill="#f1e6cf">customers</text>
          <g fill="#d9d4c6">
            <text x="18" y="62">id</text><text x="124" y="62" fill="#9b968a">int</text><text x="186" y="62" fill="#ffd900">PK</text>
            <text x="18" y="86">email</text><text x="124" y="86" fill="#9b968a">text</text>
            <text x="18" y="110">created_at</text><text x="124" y="110" fill="#9b968a">timestamp</text>
          </g>
        </g>
        <g transform="translate(40 206)">
          <rect width="220" height="128" rx="14" fill="#1a1710" stroke="#d9d4c6" strokeWidth="1.5" />
          <path d="M0 14a14 14 0 0 1 14-14h192a14 14 0 0 1 14 14v22H0z" fill="#5c3d00" />
          <text x="110" y="24" textAnchor="middle" fill="#f1e6cf">orders</text>
          <g fill="#d9d4c6">
            <text x="18" y="62">id</text><text x="124" y="62" fill="#9b968a">int</text><text x="186" y="62" fill="#ffd900">PK</text>
            <text x="18" y="86">customer_id</text><text x="124" y="86" fill="#9b968a">int</text><text x="186" y="86" fill="#87dac7">FK</text>
            <text x="18" y="110">total</text><text x="124" y="110" fill="#9b968a">numeric</text>
          </g>
        </g>
      </g>

      <path
        className="draw-arrow"
        d="M260 270 C 330 270, 410 250, 410 164"
        fill="none" stroke="#ece8dd" strokeWidth="2" strokeLinecap="round" markerEnd="url(#ah)"
      />
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
    <section id="codegen" className="bg-paper-2 border-y rule">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 py-20 lg:py-32">
        <div className="max-w-3xl mb-14 lg:mb-20">
          <p className="eyebrow reveal mb-5">Code generation</p>
          <h2 className="display reveal text-[clamp(2.4rem,5vw,4.8rem)]">
            Draw an arrow.<br />
            <span className="serif">Get a foreign key.</span>
          </h2>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <div className="reveal frame overflow-hidden flex items-center">
            <Canvas />
          </div>

          <div className="reveal frame overflow-hidden flex flex-col min-h-[420px]">
            <div className="flex items-center justify-between border-b border-white/10 px-3 pt-3">
              <div className="flex gap-1" role="tablist">
                {Object.keys(files).map((k) => (
                  <button
                    key={k}
                    role="tab"
                    aria-selected={tab === k}
                    onClick={() => setTab(k)}
                    className={`px-3.5 py-2 rounded-t-md text-[13px] font-mono transition-colors ${tab === k ? 'bg-sun text-ink' : 'text-white/55 hover:text-white'}`}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <button onClick={copy} className="eyebrow !text-white/55 hover:!text-white pr-2 pb-2 transition-colors">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="px-5 pt-3 eyebrow !text-white/40">{f.name}</div>
            <pre className="code-scroll flex-1 overflow-auto px-5 pb-6 pt-3 text-[13px] leading-[1.75] font-mono text-white/85">
              <code dangerouslySetInnerHTML={{ __html: f.code.split('\n').map(highlight).join('\n') }} />
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
