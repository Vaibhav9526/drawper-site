export const files = {
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
    code: `export const customers = pgTable('customers', {
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
        .replace(TY, '<span style="color:#ffd900">$1</span>')
        .replace(/(@\w+)/g, '<span style="color:#eaaa2a">$1</span>')
    })
    .join('')
}
