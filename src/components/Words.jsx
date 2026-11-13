// A heading whose words can rise one by one (see data-words in ../fx.js).
export default function Words({ as: Tag = 'h2', className = '', children }) {
  return (
    <Tag data-words className={className}>
      {String(children).split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em] mr-[0.24em]">
          <span data-w className="inline-block">{w}</span>
        </span>
      ))}
    </Tag>
  )
}
