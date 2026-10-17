// Generated output for the demo canvas. `linked` = an arrow joins orders -> customers,
// which is what adds orders.customer_id and the foreign key in Drawper.
export function gen(linked) {
  const sql = [
    `CREATE TABLE customers (
  id          SERIAL PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMP
);`,
    '',
    `CREATE TABLE orders (
  id           SERIAL PRIMARY KEY,${linked ? '\n  customer_id  INTEGER NOT NULL,' : ''}
  total        NUMERIC,
  created_at   TIMESTAMP${linked ? ',\n  FOREIGN KEY (customer_id) REFERENCES customers (id)' : ''}
);`,
  ].join('\n')

  const prisma = `model customers {
  id         Int       @id @default(autoincrement())
  email      String    @unique
  created_at DateTime?${linked ? '\n  orders     orders[]' : ''}
}

model orders {
  id          Int        @id @default(autoincrement())${linked ? '\n  customer_id Int' : ''}
  total       Decimal?
  created_at  DateTime?${linked ? '\n  customer    customers  @relation(fields: [customer_id], references: [id])' : ''}
}`

  const drizzle = `export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at'),
})

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),${linked ? "\n  customerId: integer('customer_id').notNull().references(() => customers.id)," : ''}
  total: numeric('total'),
  createdAt: timestamp('created_at'),
})${linked ? `

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
}))` : ''}`

  const ts = `export interface Customers {
  id: number
  email: string
  created_at: Date | null
}

export interface Orders {
  id: number${linked ? '\n  customer_id: number' : ''}
  total: string | null
  created_at: Date | null
}`

  return {
    SQL: { name: 'schema.sql', code: sql },
    Prisma: { name: 'schema.prisma', code: prisma },
    Drizzle: { name: 'schema.ts', code: drizzle },
    'TS types': { name: 'types.ts', code: ts },
  }
}

const KW = /\b(CREATE|TABLE|PRIMARY|KEY|NOT|NULL|UNIQUE|FOREIGN|REFERENCES|model|export|const|interface|one|relations)\b/g
const TY = /\b(SERIAL|INTEGER|TEXT|TIMESTAMP|NUMERIC|Int|String|DateTime|Decimal|number|string|Date|serial|text|integer|numeric|timestamp|pgTable)\b/g

// content is our own static strings, escaped before any markup is added
export function highlight(line) {
  const esc = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return esc
    .split(/('[^']*')/g)
    .map((p, i) => {
      if (i % 2) return `<span style="color:#87dac7">${p}</span>`
      return p
        .replace(KW, '<span style="color:#ff8f8c">$1</span>')
        .replace(TY, '<span style="color:#7fb2ff">$1</span>')
        .replace(/(@\w+)/g, '<span style="color:#eaaa2a">$1</span>')
    })
    .join('')
}
