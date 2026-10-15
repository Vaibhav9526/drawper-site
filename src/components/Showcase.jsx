const shots = [
  {
    img: '/architecture.png',
    k: 'Architecture',
    t: 'Draw the system.',
    d: 'Clients, APIs, workers, gateways, databases, caches and queues. Connect them with arrows and the dependencies are real.',
    tag: 'docker-compose',
    wide: true,
  },
  {
    img: '/schema-editor.png',
    k: 'Schema',
    t: 'Design the tables.',
    d: 'Primary keys, nullable, unique and foreign keys. Rename a column and every reference follows.',
    tag: 'SQL · Prisma · Drizzle',
  },
  {
    img: '/relations.png',
    k: 'Relations',
    t: 'Connect with an arrow.',
    d: 'Draw from one table to another and the foreign key column appears.',
    tag: 'Automatic FKs',
  },
  {
    img: '/schema-viewer.png',
    k: 'Viewer',
    t: 'Read the code you have.',
    d: 'Open any schema file and get an ER diagram, followed across imports.',
    tag: 'View in Drawper',
    wide: true,
  },
]

export default function Showcase() {
  return (
    <section id="product" className="bg-paper">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 py-20 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8 mb-14 lg:mb-20">
          <div>
            <p className="eyebrow reveal mb-5">The product</p>
            <h2 className="display reveal text-[clamp(2.8rem,7vw,7rem)]">
              One canvas.<br />
              <span className="serif">Four ways in.</span>
            </h2>
          </div>
          <p className="reveal max-w-sm text-mute text-[17px] leading-relaxed">
            Real screenshots, no mockups. This is exactly what opens in your editor tab.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {shots.map((s, i) => (
            <article key={s.k} className={`reveal group ${s.wide ? 'md:col-span-2' : ''}`}>
              <div className="frame overflow-hidden transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <img src={s.img} alt={`${s.k} view in Drawper`} loading="lazy" className="w-full block" />
              </div>
              <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                <span className="eyebrow">0{i + 1}</span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight">{s.t}</h3>
                <span className="ml-auto eyebrow !text-ink">{s.tag}</span>
              </div>
              <p className="mt-3 text-mute leading-relaxed max-w-xl md:pl-10">{s.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
