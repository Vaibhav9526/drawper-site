import Icon from './Icon'

export const COLORS = ['#0d1b3e', '#005fff', '#ec5451', '#ffd900', '#87dac7', '#3fa34d', '#7b6cf6', '#ffffff']
export const SIZES = [4, 9, 16]
export const PAINT = ['pen', 'brush', 'marker', 'eraser']
export const PAINT_TOOLS = [
  { id: 'pen', label: 'Pencil', icon: 'pencil' },
  { id: 'brush', label: 'Paint brush', icon: 'brush' },
  { id: 'marker', label: 'Marker', icon: 'marker' },
  { id: 'eraser', label: 'Eraser', icon: 'eraser' },
]

// The tool pill: tools, colours, brush size, undo and clear. Used on the hero and on the board.
export default function Toolbar({ tools, tool, onTool, color, onColor, size, onSize, onUndo, onClear, canUndo, className = '' }) {
  const sep = <span className="w-px h-6 bg-line mx-1 shrink-0" aria-hidden="true" />
  return (
    <div role="toolbar" aria-label="Drawing tools" className={`flex items-center gap-0.5 rounded-full border border-line bg-card/95 backdrop-blur-md shadow-[0_10px_30px_-12px_rgb(23_24_28/0.35)] px-1.5 py-1.5 max-w-full overflow-x-auto [scrollbar-width:none] ${className}`}>
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => onTool(tool === t.id && t.id !== 'select' ? null : t.id)}
          aria-pressed={tool === t.id}
          title={t.label}
          className={`h-9 w-9 shrink-0 grid place-items-center rounded-full transition-colors ${tool === t.id ? 'bg-ink text-white' : 'text-ink/80 hover:bg-ink/8'}`}
        >
          <Icon name={t.icon} size={17} />
        </button>
      ))}
      {sep}
      <div className="flex items-center gap-1 px-1">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => onColor(c)}
            aria-label={`Colour ${c}`}
            aria-pressed={color === c}
            className={`size-[18px] shrink-0 rounded-full border transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-1 ring-ink/70 ring-offset-card' : 'hover:scale-110'} ${c === '#ffffff' ? 'border-ink/30' : 'border-black/10'}`}
            style={{ background: c }}
          />
        ))}
      </div>
      {sep}
      <div className="flex items-center gap-0.5">
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => onSize(s)}
            aria-label={`Brush size ${s}`}
            aria-pressed={size === s}
            className={`h-9 w-7 shrink-0 grid place-items-center rounded-full ${size === s ? 'bg-ink/10' : 'hover:bg-ink/6'}`}
          >
            <span className="rounded-full bg-ink" style={{ width: 4 + s * 0.45, height: 4 + s * 0.45 }} />
          </button>
        ))}
      </div>
      {sep}
      <button onClick={onUndo} disabled={!canUndo} title="Undo" className="h-9 w-9 shrink-0 grid place-items-center rounded-full text-ink/80 hover:bg-ink/8 disabled:opacity-30 disabled:hover:bg-transparent">
        <Icon name="undo" size={17} />
      </button>
      <button onClick={onClear} disabled={!canUndo} title="Clear drawing" className="h-9 w-9 shrink-0 grid place-items-center rounded-full text-ink/80 hover:bg-ink/8 disabled:opacity-30 disabled:hover:bg-transparent">
        <Icon name="trash" size={17} />
      </button>
    </div>
  )
}
