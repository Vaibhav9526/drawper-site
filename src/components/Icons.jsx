// Hairline icon set: 1px strokes on a 24 grid, square caps, no fills.
const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'square',
  strokeLinejoin: 'miter',
  'aria-hidden': true,
}

const paths = {
  download: <><path d="M12 3v13" /><path d="M6.5 11 12 16.5 17.5 11" /><path d="M4 20.5h16" /></>,
  newfile: <><path d="M5 3.5h9l5 5v12H5z" /><path d="M14 3.5v5h5" /><path d="M12 11.5v6M9 14.5h6" /></>,
  arrow: <><path d="M4 20 19 5" /><path d="M9 5h10v10" /></>,
  draw: <><rect x="3.5" y="3.5" width="7" height="6" /><rect x="13.5" y="14.5" width="7" height="6" /><path d="M10.5 6.5h3.5v8" /><path d="m12.2 12.8 1.8 1.8 1.8-1.8" /></>,
  braces: <><path d="M9 3.5C6.5 3.5 6.5 5 6.5 7v2c0 1.5-1 2.5-2.5 3 1.5.5 2.5 1.5 2.5 3v2c0 2 0 3.5 2.5 3.5" /><path d="M15 3.5c2.5 0 2.5 1.5 2.5 3.5v2c0 1.5 1 2.5 2.5 3-1.5.5-2.5 1.5-2.5 3v2c0 2 0 3.5-2.5 3.5" /></>,
  copy: <><rect x="8.5" y="8.5" width="12" height="12" /><path d="M15.500 8.500v-5h-12v12h5" /></>,
  check: <path d="m4 12.500 5 5L20 6.500" />,
  cursor: <path d="M5 3.5l13 7.5-5.800 1.600L9.500 18.500z" />,
  arrowtool: <><path d="M4 19 19 4" /><path d="M9 4h10v10" /></>,
  menu: <><path d="M4 8h16" /><path d="M4 16h16" /></>,
  close: <><path d="m5 5 14 14" /><path d="M19 5 5 19" /></>,
  plus: <><path d="M12 4v16" /><path d="M4 12h16" /></>,
}

export default function Icon({ name, size = 22, className = '' }) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      {paths[name]}
    </svg>
  )
}

// Drawper mark redrawn as hairline: the D plate with a pen laid across it.
export function Mark({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter" className={className} aria-hidden="true">
      <path d="M5 3.500h10.500C23 3.500 27.500 9 27.500 16S23 28.500 15.500 28.500H5z" />
      <path d="M10 22.500 22.500 8.500" />
      <path d="m22.500 8.500 2.500 2.200-12.500 14-3.800 1.500 1.300-3.800z" />
      <path d="M20 10.700 22.500 13" />
    </svg>
  )
}
